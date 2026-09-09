import React, { useEffect, useState, useRef } from "react";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import XYZ from "ol/source/XYZ";
import ImageLayer from "ol/layer/Image";
import ImageWMS from "ol/source/ImageWMS";
import Overlay from "ol/Overlay";
import { toLonLat } from "ol/proj";
import "ol/ol.css";
import "./ZPPIMap.css";
import BasemapToggle from "../../map/BasemapToggle";

export default function RawanSawahMap() {
  const [map, setMap] = useState(null);
  const currentLayerRef = useRef(null);
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
    fetch("https://spbn.brin.go.id/public/getlayersfromcategory/135")
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
      target: "rawansawah-map",
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
        STYLES: '',
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
    
    // Update legend URL with style parameter
    const legendUrl = `https://spbn.brin.go.id/geoserver/lapan/wms?service=WMS&version=1.1.0&request=GetLegendGraphic&layer=lapan:${slug}&format=image/png`;
    setLegendUrl(legendUrl);
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
    <div className="zppi-map-container">
      <div className="layer-list">
        <div 
          className={`layer-list-header ${activeSections.layers ? 'active' : ''}`}
          onClick={() => toggleSection('layers')}
        >
          <h2>Rawan Banjir dan Kering Lahan Sawah</h2>
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
            aria-label="Cari layer rawan sawah"
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
                    name="rawansawah-layer"
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
              <li>Data satelit Terra-MODIS (resolusi spasial 250–1000 meter; sumber: Pusat Data dan Informasi - BRIN)</li>
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
              <li>Pengolahan citra Terra-MODIS untuk mengekstraksi indikator kebasahan dan kekeringan lahan sawah.</li>
              <li>Kalibrasi dan koreksi geometri agar posisi data satelit sesuai dengan kondisi di lapangan.</li>
              <li>Klasifikasi tingkat kerawanan banjir dan kekeringan berdasarkan karakteristik spektral dan temporal.</li>
              <li>Pemetaan spasial sebaran kerawanan untuk mendukung peringatan dini dan pengelolaan lahan pertanian.</li>
            </ol>
          </div>
        </div>
      </div>
      <div className="map-wrapper">
        <div id="rawansawah-map" className="map-container"></div>
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
