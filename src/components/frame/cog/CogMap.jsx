import React, { useEffect, useMemo, useRef, useState } from "react";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import XYZ from "ol/source/XYZ";
import { fromLonLat } from "ol/proj";
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
  Typography,
} from "@mui/material";
import LayersIcon from "@mui/icons-material/Layers";
import ScienceIcon from "@mui/icons-material/Science";
import { getCogTileUrl, PRODUCT_CONFIGS } from "./cogService";

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
  const [map, setMap] = useState(null);
  const layerRef = useRef(null);
  const [values, setValues] = useState(config.defaults);

  const layerConfig = useMemo(() => config.getLayer(values), [config, values]);

  useEffect(() => {
    if (map) return;

    const olMap = new Map({
      target: `${productId}-map`,
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

    setMap(olMap);
    return () => olMap.setTarget(undefined);
  }, [config.defaultCenterLonLat, config.defaultZoom, map, productId]);

  useEffect(() => {
    if (!map || !layerConfig) return;

    if (layerRef.current) {
      map.removeLayer(layerRef.current);
      layerRef.current = null;
    }

    const tileUrl = getCogTileUrl({
      s3Path: layerConfig.s3Path,
      colormap: layerConfig.colormap,
      colormapName: layerConfig.colormapName,
      rescale: layerConfig.rescale,
      nodata: layerConfig.nodata,
    });

    const cogLayer = new TileLayer({
      title: config.title,
      source: new XYZ({
        url: tileUrl,
        tileLoadFunction(tile, src) {
          const img = tile.getImage();
          img.onerror = () => {
            img.src = TRANSPARENT_PIXEL;
          };
          img.src = src;
        },
      }),
      opacity: 0.85,
      zIndex: 10,
    });

    layerRef.current = cogLayer;
    map.addLayer(cogLayer);

    if (layerConfig.centerLonLat) {
      map.getView().animate({
        center: fromLonLat(layerConfig.centerLonLat),
        zoom: layerConfig.zoom || config.defaultZoom,
        duration: 400,
      });
    }
  }, [config.defaultZoom, config.title, layerConfig, map]);

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
    : config.legendItems || [];

  return (
    <div className="cog-map-container">
      <div id={`${productId}-map`} className="map-container" />
      {map && <BasemapToggle map={map} />}

      <div
        style={{
          position: "absolute",
          top: "10px",
          left: "40px",
          width: "min(380px, calc(100% - 56px))",
          zIndex: 1000,
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
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

          {layerConfig?.description && (
            <Typography variant="body2" sx={{ mt: 2, color: "text.secondary" }}>
              {layerConfig.description}
            </Typography>
          )}
        </Paper>
      </div>

      <div
        style={{
          position: "absolute",
          bottom: "20px",
          right: "20px",
          width: "min(280px, calc(100% - 24px))",
          zIndex: 1000,
        }}
      >
        <Paper elevation={3} sx={{ p: 2, backgroundColor: "rgba(255,255,255,0.95)" }}>
          <Typography
            variant="h6"
            gutterBottom
            sx={{ fontSize: "1rem", display: "flex", alignItems: "center" }}
          >
            <ScienceIcon sx={{ mr: 0.5 }} />
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
            <Box sx={{ display: "flex", flexDirection: "column", gap: 0.75 }}>
              {legendItems.map((item) => (
                <Box key={item.label} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <span className="cog-legend-swatch" style={{ background: item.color }} />
                  <Typography variant="body2">{item.label}</Typography>
                </Box>
              ))}
            </Box>
          )}
        </Paper>
      </div>
    </div>
  );
}
