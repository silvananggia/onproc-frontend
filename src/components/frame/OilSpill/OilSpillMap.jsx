import React, { useEffect, useState, useRef } from "react";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import XYZ from "ol/source/XYZ";
import ImageLayer from "ol/layer/Image";
import ImageWMS from "ol/source/ImageWMS";
import Overlay from "ol/Overlay";
import GeoJSON from "ol/format/GeoJSON";
import { transformExtent } from "ol/proj";
import { createEmpty, extend, isEmpty } from "ol/extent";
import "ol/ol.css";
import "./OilSpillMap.css";
import BasemapToggle from "../../map/BasemapToggle";

export default function OilSpillMap() {
  const [map, setMap] = useState(null);
  const currentLayerRef = useRef(null);
  const extentAbortRef = useRef(null);
  const [selectedSlug, setSelectedSlug] = useState(null);
  const [layersData, setLayersData] = useState([]);
  const [layersLoading, setLayersLoading] = useState(true);
  const [layersError, setLayersError] = useState("");
  const [layerQuery, setLayerQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [popup, setPopup] = useState(null);
  const [legendUrl, setLegendUrl] = useState(null);
  const [activeSections, setActiveSections] = useState({
    data: false,
    method: false,
    layers: true
  });

  // Indonesia bounding box in EPSG:3857
  const indonesiaBbox = {
    minX: 95.2930261576,
    minY: -10.3599874813,
    maxX: 140.7181246124,
    maxY: 5.47982086834
  };

  const loadLayers = () => {
    setLayersLoading(true);
    setLayersError("");
    fetch("https://spbn.brin.go.id/public/getlayersfromcategory/133")
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        setLayersData(Array.isArray(data) ? data : []);
      })
      .catch(() => {
        setLayersError("Gagal memuat daftar layer. Periksa koneksi lalu coba lagi.");
        setLayersData([]);
      })
      .finally(() => {
        setLayersLoading(false);
      });
  };

  useEffect(() => {
    loadLayers();

    const baseLayer = new TileLayer({
      title: "Basemap",
      source: new XYZ({
        url: "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}",
        attributions: "&copy; <a href='https://www.esri.com/'>Esri</a>",
      }),
    });

    // Create popup element
    const popupElement = document.createElement('div');
    popupElement.className = 'ol-popup';
    
    const popupCloser = document.createElement('a');
    popupCloser.className = 'ol-popup-closer';
    popupCloser.href = '#';
    popupElement.appendChild(popupCloser);
    
    const popupContent = document.createElement('div');
    popupContent.className = 'ol-popup-content';
    popupElement.appendChild(popupContent);

    // Create popup overlay
    const popupOverlay = new Overlay({
      element: popupElement,
      positioning: 'bottom-center',
      offset: [0, -10],
      autoPan: true,
      autoPanAnimation: {
        duration: 250
      }
    });

    const olMap = new Map({
      target: "oilspill-map",
      layers: [baseLayer],
      overlays: [popupOverlay],
      view: new View({
        center: [13124075.715923082, -277949.29803053016],
        zoom: 5,
        projection: "EPSG:3857",
      }),
    });

    // Handle map clicks
    olMap.on('click', function(evt) {
      if (currentLayerRef.current) {
        const view = olMap.getView();
        const viewResolution = view.getResolution();
        const url = currentLayerRef.current.getSource().getFeatureInfoUrl(
          evt.coordinate,
          viewResolution,
          view.getProjection(),
          {
            'INFO_FORMAT': 'application/json',
            'FEATURE_COUNT': 50,
            'QUERY_LAYERS': currentLayerRef.current.getSource().getParams().LAYERS,
            'WIDTH': olMap.getSize()[0],
            'HEIGHT': olMap.getSize()[1],
            'X': Math.floor(evt.pixel[0]),
            'Y': Math.floor(evt.pixel[1])
          }
        );

        if (url) {
          fetch(url)
            .then(response => {
              if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
              }
              return response.json();
            })
            .then(data => {
              if (data.features && data.features.length > 0) {
                const feature = data.features[0];
                const properties = feature.properties;
                let content = '<div class="popup-content">';
                
                // Add all properties to popup content
                Object.entries(properties).forEach(([key, value]) => {
                  if (value !== null && value !== undefined) {
                    content += `<p><strong>${key}:</strong> ${value}</p>`;
                  }
                });
                
                content += '</div>';
                popupContent.innerHTML = content;
                popupOverlay.setPosition(evt.coordinate);
              } else {
                popupOverlay.setPosition(undefined);
              }
            })
            .catch(() => {
              popupOverlay.setPosition(undefined);
            });
        } else {
          popupOverlay.setPosition(undefined);
        }
      } else {
        popupOverlay.setPosition(undefined);
      }
    });

    // Handle popup closer
    popupCloser.onclick = function() {
      popupOverlay.setPosition(undefined);
      popupCloser.blur();
      return false;
    };

    setMap(olMap);
    setPopup(popupOverlay);
  }, []);

  // Add effect to select first layer when data is loaded
  useEffect(() => {
    if (layersData.length > 0 && map) {
      const firstLayer = layersData[0];
      handleLayerSelect(firstLayer.slug, firstLayer.name);
    }
  }, [layersData, map]);

  const fitMapToLonLatExtent = (olMap, lonLatExtent, duration = 800) => {
    if (!olMap || !lonLatExtent) return;
    const view = olMap.getView();
    const extent = transformExtent(
      lonLatExtent,
      "EPSG:4326",
      view.getProjection()
    );
    view.fit(extent, {
      padding: [80, 80, 80, 80],
      duration,
      maxZoom: 14,
    });
  };

  const getRegionExtentFromName = (name = "") => {
    const label = name.toLowerCase();
    if (label.includes("kalimantan")) {
      return [116.2, -1.8, 118.6, 1.2];
    }
    if (label.includes("riau")) {
      return [103.2, 0.2, 109.2, 4.5];
    }
    return [
      indonesiaBbox.minX,
      indonesiaBbox.minY,
      indonesiaBbox.maxX,
      indonesiaBbox.maxY,
    ];
  };

  const extentFromGeoJson = (data, mapProjection) => {
    if (Array.isArray(data?.bbox) && data.bbox.length >= 4) {
      return transformExtent(data.bbox.slice(0, 4), "EPSG:4326", mapProjection);
    }
    if (!data?.features?.length) return null;

    const features = new GeoJSON().readFeatures(data, {
      dataProjection: "EPSG:4326",
      featureProjection: mapProjection,
    });
    const extent = createEmpty();
    features.forEach((feature) => {
      const geometry = feature.getGeometry();
      if (geometry) {
        extend(extent, geometry.getExtent());
      }
    });
    return isEmpty(extent) ? null : extent;
  };

  const zoomToLayerExtent = (slug, name, olMap) => {
    if (!slug || !olMap) return;

    if (extentAbortRef.current) {
      extentAbortRef.current.abort();
    }
    const controller = new AbortController();
    extentAbortRef.current = controller;

    fitMapToLonLatExtent(olMap, getRegionExtentFromName(name), 600);

    const wfsUrl =
      "https://spbn.brin.go.id/geoserver/lapan/ows?" +
      new URLSearchParams({
        service: "WFS",
        version: "1.0.0",
        request: "GetFeature",
        typeName: `lapan:${slug}`,
        outputFormat: "application/json",
        srsName: "EPSG:4326",
        maxFeatures: "200",
      }).toString();

    fetch(wfsUrl, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        const layerExtent = extentFromGeoJson(
          data,
          olMap.getView().getProjection()
        );
        if (layerExtent) {
          olMap.getView().fit(layerExtent, {
            padding: [80, 80, 80, 80],
            duration: 800,
            maxZoom: 14,
          });
        }
      })
      .catch((err) => {
        if (err.name !== "AbortError") {
          console.error("Failed to zoom to oil spill feature extent:", err);
        }
      });
  };

  const handleLayerSelect = (slug, name) => {
    if (!map || !slug) return;

    // Remove current layer if exists
    if (currentLayerRef.current) {
      map.removeLayer(currentLayerRef.current);
    }

    const wmsSource = new ImageWMS({
      url: "https://spbn.brin.go.id/geoserver/lapan/wms",
      params: {
        LAYERS: `lapan:${slug}`,
        TILED: true,
        VERSION: '1.1.1',
        FORMAT: 'image/png',
        TRANSPARENT: true,
        EXCEPTIONS: 'application/vnd.ogc.se_inimage',
        SRS: 'EPSG:3857',
        FORMAT_OPTIONS: 'dpi:180'
      },
      ratio: 1,
      serverType: "geoserver",
      crossOrigin: 'anonymous'
    });

    const newLayer = new ImageLayer({
      source: wmsSource,
      name: name,
      visible: true
    });

    map.addLayer(newLayer);
    currentLayerRef.current = newLayer;
    setSelectedSlug(slug);

    // Update legend URL
    const legendUrl = `https://spbn.brin.go.id/geoserver/lapan/wms?service=WMS&version=1.1.0&request=GetLegendGraphic&layer=lapan:${slug}&format=image/png&legend_options=fontAntiAliasing:true;fontSize:12;fontName:Arial;dx:0.5;dy:0.5;forceLabels:on;`;
    setLegendUrl(legendUrl);

    zoomToLayerExtent(slug, name, map);
  };

  const filteredLayers = layersData.filter((item) => {
    const query = layerQuery.trim().toLowerCase();
    if (!query) return true;
    return (item.name || "").toLowerCase().includes(query);
  });
  const totalPages = Math.max(1, Math.ceil(filteredLayers.length / itemsPerPage));
  const safePage = Math.min(currentPage, totalPages);
  const paginatedData = filteredLayers.slice(
    (safePage - 1) * itemsPerPage,
    safePage * itemsPerPage
  );

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const toggleSection = (section) => {
    setActiveSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  return (
    <div className="oilspill-map-container">
      <div className="layer-list">
        <div 
          className={`layer-list-header ${activeSections.layers ? 'active' : ''}`}
          onClick={() => toggleSection('layers')}
        >
          <h2>Tumpahan Minyak</h2>
        </div>
        
        <div className={`layer-list-content ${activeSections.layers ? '' : 'collapsed'}`}>
          <input
            type="search"
            className="layer-search"
            placeholder="Cari layer..."
            value={layerQuery}
            onChange={(event) => {
              setLayerQuery(event.target.value);
              setCurrentPage(1);
            }}
            aria-label="Cari layer tumpahan minyak"
          />
          {layersLoading && <div className="layer-status">Memuat daftar layer...</div>}
          {layersError && (
            <div className="layer-status error">
              <p>{layersError}</p>
              <button type="button" className="retry-button" onClick={loadLayers}>
                Coba lagi
              </button>
            </div>
          )}
          {!layersLoading && !layersError && filteredLayers.length === 0 && (
            <div className="layer-status">Tidak ada layer yang sesuai.</div>
          )}
          <ul>
            {paginatedData.map((item) => (
              <li key={item.id}>
                <label className={selectedSlug === item.slug ? "selected" : ""}>
                  <input
                    type="radio"
                    name="oilspill-layer"
                    checked={selectedSlug === item.slug}
                    onChange={() => handleLayerSelect(item.slug, item.name)}
                  />
                  <span>{item.name}</span>
                </label>
              </li>
            ))}
          </ul>
          
          <div className="pagination">
            <button
              onClick={() => handlePageChange(safePage - 1)}
              disabled={safePage === 1}
              title="Halaman sebelumnya"
            >
              ←
            </button>
            <span>
              {safePage} / {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(safePage + 1)}
              disabled={safePage === totalPages}
              title="Halaman berikutnya"
            >
              →
            </button>
          </div>
        </div>

        <div className="info-box">
          <h3 
            className={activeSections.data ? 'active' : ''}
            onClick={() => toggleSection('data')}
          >
            Data Yang Digunakan
          </h3>
          <div className={`content ${activeSections.data ? 'active' : ''}`}>
            <ul className="list-disc">
              <li>Data satelit Sentinel-1 (radar SAR; sumber: Pusat Data dan Informasi - BRIN)</li>
              <li>Data satelit Sentinel-2 (optik; sumber: Pusat Data dan Informasi - BRIN)</li>
              <li>Data satelit Landsat 8/9 (optik; sumber: Pusat Data dan Informasi - BRIN)</li>
            </ul>
          </div>

          <h3 
            className={activeSections.method ? 'active' : ''}
            onClick={() => toggleSection('method')}
          >
            Metode Yang Digunakan
          </h3>
          <div className={`content ${activeSections.method ? 'active' : ''}`}>
            <ol className="list-decimal space-y-1">
              <li>Pengolahan citra satelit radar (Sentinel-1) dan optik (Sentinel-2, Landsat 8/9) untuk deteksi tumpahan minyak di permukaan laut.</li>
              <li>Kalibrasi dan reproyeksi (koreksi geometri) untuk mengatur posisi data satelit sesuai di bumi.</li>
              <li>Identifikasi area terduga tumpahan minyak berdasarkan karakteristik hamburan balik radar dan spektral optik.</li>
              <li>Pemetaan sebaran tumpahan minyak dalam format spasial untuk pemantauan dan tanggap darurat.</li>
            </ol>
          </div>
        </div>
      </div>
      <div className="map-wrapper">
        <div id="oilspill-map" className="map-container"></div>
        {map && <BasemapToggle map={map} />}
        {legendUrl && (
          <div className="legend-box">
            <div className="legend-header">
              <h4>Legenda</h4>
            </div>
            <div className="legend-content">
              <img 
                src={legendUrl} 
                alt="Legend" 
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
