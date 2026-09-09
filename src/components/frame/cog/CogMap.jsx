import React, { useEffect, useMemo, useRef, useState } from "react";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import XYZ from "ol/source/XYZ";
import Overlay from "ol/Overlay";
import { fromLonLat, toLonLat } from "ol/proj";
import { createPortal } from "react-dom";
import "ol/ol.css";
import "./CogMap.css";
import BasemapToggle from "../../map/BasemapToggle";
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Slider,
  Typography,
} from "@mui/material";
import LayersIcon from "@mui/icons-material/Layers";
import ScienceIcon from "@mui/icons-material/Science";
import {
  describeCogValue,
  getCogPointUrl,
  getCogTileJsonUrl,
  getCogTileUrl,
  PRODUCT_CONFIGS,
} from "./cogService";

const TRANSPARENT_PIXEL =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";

function resolveOptions(filter, values) {
  if (filter.optionsBy) {
    const parentValue = values[filter.dependsOn || "layerType"];
    return filter.optionsBy[parentValue] || [];
  }
  return filter.options || [];
}

export default function CogMap({ productId }) {
  const config = PRODUCT_CONFIGS[productId];
  const mapElRef = useRef(null);
  const layerRef = useRef(null);
  const popupElRef = useRef(null);
  const overlayRef = useRef(null);
  const layerConfigRef = useRef(null);
  const identifyAbortRef = useRef(null);
  const [map, setMap] = useState(null);
  const [popupHost, setPopupHost] = useState(null);
  const [values, setValues] = useState(config.defaults);
  const [opacity, setOpacity] = useState(0.85);
  const opacityRef = useRef(0.85);
  const [popup, setPopup] = useState(null);

  const layerConfig = useMemo(() => config.getLayer(values), [config, values]);
  layerConfigRef.current = layerConfig;

  useEffect(() => {
    if (!mapElRef.current) return;

    const olMap = new Map({
      target: mapElRef.current,
      layers: [
        new TileLayer({
          title: "Basemap",
          source: new XYZ({
            url: "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}",
            attributions: "&copy; <a href='https://www.esri.com/'>Esri</a>",
          }),
        }),
      ],
      view: new View({
        center: fromLonLat(config.defaultCenterLonLat),
        zoom: config.defaultZoom,
        projection: "EPSG:3857",
      }),
    });

    const syncSize = () => olMap.updateSize();
    window.addEventListener("resize", syncSize);
    requestAnimationFrame(syncSize);
    setMap(olMap);

    return () => {
      window.removeEventListener("resize", syncSize);
      olMap.setTarget(undefined);
    };
  }, [config.defaultCenterLonLat, config.defaultZoom]);

  useEffect(() => {
    if (!map) return;
    const element = document.createElement("div");
    element.className = "cog-popup";
    element.style.display = "none";
    const overlay = new Overlay({
      element,
      positioning: "bottom-center",
      offset: [0, -12],
      autoPan: {
        animation: { duration: 250 },
      },
    });
    map.addOverlay(overlay);
    overlayRef.current = overlay;
    popupElRef.current = element;
    setPopupHost(element);

    return () => {
      map.removeOverlay(overlay);
      overlayRef.current = null;
      popupElRef.current = null;
      setPopupHost(null);
    };
  }, [map]);

  useEffect(() => {
    if (!map) return;

    const handleClick = (evt) => {
      const currentLayer = layerConfigRef.current;
      if (!currentLayer?.s3Path || !overlayRef.current) return;

      const [lon, lat] = toLonLat(evt.coordinate);
      overlayRef.current.setPosition(evt.coordinate);
      if (overlayRef.current.getElement()) {
        overlayRef.current.getElement().style.display = "block";
      }
      setPopup({
        loading: true,
        lon,
        lat,
        title: currentLayer.legendTitle || config.title,
      });

      if (identifyAbortRef.current) {
        identifyAbortRef.current.abort();
      }
      const abort = new AbortController();
      identifyAbortRef.current = abort;

      fetch(getCogPointUrl(lon, lat, currentLayer.s3Path), { signal: abort.signal })
        .then((res) => {
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          return res.json();
        })
        .then((data) => {
          const raw = Array.isArray(data.values) ? data.values[0] : null;
          const info = describeCogValue(raw, currentLayer, config);
          setPopup({
            loading: false,
            lon,
            lat,
            title: currentLayer.legendTitle || config.title,
            band: data.band_descriptions?.[0] || data.band_names?.[0] || "b1",
            ...info,
          });
        })
        .catch((err) => {
          if (err.name === "AbortError") return;
          setPopup({
            loading: false,
            lon,
            lat,
            title: currentLayer.legendTitle || config.title,
            valueLabel: "Gagal memuat",
            classLabel: "Periksa koneksi lalu klik ulang.",
            color: null,
          });
        });
    };

    map.on("singleclick", handleClick);
    return () => {
      map.un("singleclick", handleClick);
      if (identifyAbortRef.current) {
        identifyAbortRef.current.abort();
      }
    };
  }, [config, map]);

  useEffect(() => {
    if (overlayRef.current) {
      overlayRef.current.setPosition(undefined);
      const el = overlayRef.current.getElement();
      if (el) el.style.display = "none";
    }
    setPopup(null);
  }, [layerConfig]);

  useEffect(() => {
    if (!map || !layerConfig?.s3Path) return;

    let cancelled = false;

    const tileUrl = getCogTileUrl({
      s3Path: layerConfig.s3Path,
      colormap: layerConfig.colormap,
      colormapName: layerConfig.colormapName,
      rescale: layerConfig.rescale,
      nodata: layerConfig.nodata,
    });

    const addLayer = (minZoom = 0, maxZoom = 22) => {
      if (cancelled) return;

      if (layerRef.current) {
        map.removeLayer(layerRef.current);
        layerRef.current = null;
      }

      const cogLayer = new TileLayer({
        title: config.title,
        source: new XYZ({
          url: tileUrl,
          minZoom,
          maxZoom,
          tileLoadFunction(tile, src) {
            const img = tile.getImage();
            img.onerror = () => {
              img.src = TRANSPARENT_PIXEL;
            };
            img.src = src;
          },
        }),
        opacity: opacityRef.current,
        zIndex: 10,
      });

      layerRef.current = cogLayer;
      map.addLayer(cogLayer);
      map.updateSize();

      if (layerConfig.centerLonLat) {
        map.getView().animate({
          center: fromLonLat(layerConfig.centerLonLat),
          zoom: layerConfig.zoom || config.defaultZoom,
          duration: 400,
        });
      }
    };

    addLayer();

    fetch(getCogTileJsonUrl(layerConfig.s3Path))
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!data) return;
        addLayer(data.minzoom ?? 0, data.maxzoom ?? 22);
      })
      .catch(() => {});

    return () => {
      cancelled = true;
      if (layerRef.current) {
        map.removeLayer(layerRef.current);
        layerRef.current = null;
      }
    };
  }, [config.defaultZoom, config.title, layerConfig, map]);

  useEffect(() => {
    opacityRef.current = opacity;
    if (layerRef.current) {
      layerRef.current.setOpacity(opacity);
    }
  }, [opacity]);

  const handleChange = (key) => (event) => {
    const nextValue = event.target.value;
    setValues((prev) => {
      const next = { ...prev, [key]: nextValue };
      config.filters.forEach((filter) => {
        if (!filter.optionsBy) return;
        const options = resolveOptions(filter, next);
        if (options.length && !options.some((opt) => opt.value === next[filter.key])) {
          next[filter.key] = options[0].value;
        }
      });
      return next;
    });
  };

  const legendItems = layerConfig?.legendGradient
    ? []
    : layerConfig?.legendItems || config.legendItems || [];

  return (
    <div className="cog-map-container">
      <div ref={mapElRef} id={`${productId}-map`} className="map-container" />
      {map && <BasemapToggle map={map} />}

      <div className="cog-filter-panel">
        <Paper elevation={3} sx={{ p: 2, backgroundColor: "rgba(255,255,255,0.95)" }}>
          <Typography variant="h6" gutterBottom>
            <LayersIcon sx={{ mr: 1, verticalAlign: "middle" }} />
            {config.title}
          </Typography>

          {config.filters.map((filter) => {
            const options = resolveOptions(filter, values);
            return (
              <FormControl key={filter.key} fullWidth size="small" sx={{ mt: 1.5 }}>
                <InputLabel>{filter.label}</InputLabel>
                <Select
                  value={values[filter.key] || ""}
                  label={filter.label}
                  onChange={handleChange(filter.key)}
                  MenuProps={{
                    PaperProps: { sx: { maxHeight: 320 } },
                  }}
                >
                  {options.map((opt) => (
                    <MenuItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            );
          })}

          <Box sx={{ mt: 2 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 0.5 }}>
              <Typography variant="body2">Opasitas layer</Typography>
              <Typography variant="caption" color="text.secondary">
                {Math.round(opacity * 100)}%
              </Typography>
            </Box>
            <Slider
              size="small"
              min={0}
              max={100}
              value={Math.round(opacity * 100)}
              onChange={(_, value) => {
                const next = Array.isArray(value) ? value[0] : value;
                setOpacity(next / 100);
              }}
              aria-label="Opasitas layer"
            />
          </Box>

          {layerConfig?.description && (
            <Typography variant="body2" sx={{ mt: 1, color: "text.secondary" }}>
              {layerConfig.description}
            </Typography>
          )}
          <Typography variant="caption" sx={{ display: "block", mt: 1.5, color: "text.secondary" }}>
            Klik pada raster untuk melihat informasi nilai.
          </Typography>
        </Paper>
      </div>

      <div className="cog-legend-panel">
        <Paper elevation={3} sx={{ p: 1.5, backgroundColor: "rgba(255,255,255,0.95)" }}>
          <Typography
            variant="h6"
            gutterBottom
            sx={{ fontSize: "0.95rem", display: "flex", alignItems: "flex-start", lineHeight: 1.3 }}
          >
            <ScienceIcon sx={{ mr: 0.5, mt: "1px", flexShrink: 0 }} />
            {layerConfig?.legendTitle || "Legenda"}
          </Typography>

          {layerConfig?.legendGradient ? (
            <Box>
              <div className="cog-legend-gradient" />
              <Box sx={{ display: "flex", justifyContent: "space-between", mt: 0.5 }}>
                <Typography variant="caption">{layerConfig.legendMin}</Typography>
                <Typography variant="caption">{layerConfig.legendMax}</Typography>
              </Box>
            </Box>
          ) : (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 0.6 }}>
              {legendItems.map((item) => (
                <Box key={item.label} className="cog-legend-item">
                  <span className="cog-legend-swatch" style={{ background: item.color }} />
                  <Typography variant="body2" sx={{ fontSize: "0.8rem" }}>
                    {item.label}
                  </Typography>
                </Box>
              ))}
            </Box>
          )}
        </Paper>
      </div>

      {popupHost &&
        createPortal(
          <>
            <button
              type="button"
              className="cog-popup-closer"
              aria-label="Tutup"
              onClick={() => {
                if (overlayRef.current) {
                  overlayRef.current.setPosition(undefined);
                  const el = overlayRef.current.getElement();
                  if (el) el.style.display = "none";
                }
                setPopup(null);
              }}
            >
              ×
            </button>
            {popup?.loading ? (
              <p className="cog-popup-empty">Memuat informasi...</p>
            ) : popup ? (
              <>
                <h3>{popup.title}</h3>
                {popup.classLabel === null ? (
                  <p className="cog-popup-empty">Tidak ada data raster di lokasi ini.</p>
                ) : (
                  <>
                    <p>
                      <strong>Nilai</strong>
                      <span>{popup.valueLabel}</span>
                    </p>
                    <div className="cog-popup-class">
                      {popup.color ? (
                        <span className="cog-legend-swatch" style={{ background: popup.color }} />
                      ) : null}
                      <span>{popup.classLabel}</span>
                    </div>
                  </>
                )}
                <p>
                  <strong>Koordinat</strong>
                  <span>
                    {popup.lon.toFixed(5)}, {popup.lat.toFixed(5)}
                  </span>
                </p>
              </>
            ) : null}
          </>,
          popupHost
        )}
    </div>
  );
}
