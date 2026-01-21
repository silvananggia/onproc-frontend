import React, { useEffect, useRef, useState } from "react";
import { Map, View } from "ol";
import "ol/ol.css";
import "ol-ext/dist/ol-ext.css";
import "./Map.scss";

import TileLayer from "ol/layer/Tile";
import XYZ from "ol/source/XYZ";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { defaults as defaultControls } from "ol/control";
import LayerGroup from "ol/layer/Group";
import { fromLonLat } from "ol/proj";
import { Feature } from "ol";
import { Style, Stroke, Fill } from "ol/style";
import TileWMS from "ol/source/TileWMS";
import axios from "axios";
import { Point } from 'ol/geom';
import { Circle as CircleStyle } from 'ol/style';

// Layer configuration for Deforestasi
const DEFORESTASI_LAYERS = [
  { id: 'kalimantan_2324', name: 'Deforestasi Kalimantan 2023-2024', layer: 'geomimo:Deforestasi_Kalimantan_2324', region: 'Kalimantan', period: '2023-2024' },
  { id: 'kalimantan_2425', name: 'Deforestasi Kalimantan 2024-2025', layer: 'geomimo:Deforestasi_Kalimantan_2425', region: 'Kalimantan', period: '2024-2025' },
  { id: 'papua_2324', name: 'Deforestasi Papua 2023-2024', layer: 'geomimo:Deforestasi_Papua_2324', region: 'Papua', period: '2023-2024' },
  { id: 'papua_2425', name: 'Deforestasi Papua 2024-2025', layer: 'geomimo:Deforestasi_Papua_2425', region: 'Papua', period: '2024-2025' },
  { id: 'sulawesi_2324', name: 'Deforestasi Sulawesi 2023-2024', layer: 'geomimo:Deforestasi_Sulawesi_2324', region: 'Sulawesi', period: '2023-2024' },
  { id: 'sulawesi_2425', name: 'Deforestasi Sulawesi 2024-2025', layer: 'geomimo:Deforestasi_Sulawesi_2425', region: 'Sulawesi', period: '2024-2025' },
  { id: 'sumatera_2324', name: 'Deforestasi Sumatera 2023-2024', layer: 'geomimo:Deforestasi_Sumatera_2324', region: 'Sumatera', period: '2023-2024' },
  { id: 'sumatera_2425', name: 'Deforestasi Sumatera 2024-2025', layer: 'geomimo:Deforestasi_Sumatera_2425', region: 'Sumatera', period: '2024-2025' },
];

// Region center coordinates for zooming
const REGION_CENTERS = {
  'Kalimantan': [116.0, 0.5],
  'Papua': [138.0, -4.0],
  'Sulawesi': [121.0, -2.0],
  'Sumatera': [102.0, 0.5],
};

const BaseMapComponent = ({ map, setMap, vectorLayerRef }) => {
  // Legend URL state
  const [legendUrl, setLegendUrl] = useState(null);
  
  // Layer visibility state - initialize all layers as visible
  const [layerVisibility, setLayerVisibility] = useState(
    DEFORESTASI_LAYERS.reduce((acc, layer) => ({ ...acc, [layer.id]: true }), { basemap: true })
  );
  
  // Layer opacity state
  const [layerOpacity, setLayerOpacity] = useState(
    DEFORESTASI_LAYERS.reduce((acc, layer) => ({ ...acc, [layer.id]: 0.7 }), {})
  );
  
  // Layer refs
  const basemapLayerRef = useRef();
  const wmsLayerRefs = useRef({});
  
  // Highlight layer ref
  const highlightLayerRef = useRef();

  // Layer control panel state
  const [isLayerPanelOpen, setIsLayerPanelOpen] = useState(true);
  const [selectedRegion, setSelectedRegion] = useState('all');

  useEffect(() => {
    if (!map) {
      const rasterLayer = new TileLayer({
        title: "Basemap",
        source: new XYZ({
          url: "https://abcd.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
        }),
      });
      basemapLayerRef.current = rasterLayer;

      const vectorSource = new VectorSource({ wrapX: false });

      const vectorLayer = new VectorLayer({
        source: vectorSource,
      });
      if (vectorLayerRef && typeof vectorLayerRef === "object") {
        vectorLayerRef.current = vectorLayer;
      }
      
      const newMap = new Map({
        target: "map",
        controls: defaultControls(),
        layers: [
          new LayerGroup({
            title: "Basemap",
            layers: [rasterLayer],
          }),
          vectorLayer,
        ],
        view: new View({
          center: [13124075.715923082, -277949.29803053016],
          zoom: 5,
          maxZoom: 20,
        }),
      });

      setMap(newMap);
    }
  }, [map]);

  useEffect(() => {
    if (map) {
      const wmsUrl = "https://geomimo-prototype.brin.go.id/service/geoserver/geomimo/wms";
      
      // Add WMS layers for each deforestasi layer
      DEFORESTASI_LAYERS.forEach((layerConfig, index) => {
        const wmsLayer = new TileLayer({
          title: layerConfig.name,
          source: new TileWMS({
            url: wmsUrl,
            params: {
              'LAYERS': layerConfig.layer,
              TILED: true,
              VERSION: '1.1.1',
              FORMAT: 'image/png',
              TRANSPARENT: true,
              STYLES: '',
              EXCEPTIONS: 'application/vnd.ogc.se_inimage',
              SRS: 'EPSG:4326',
              FORMAT_OPTIONS: 'dpi:180'
            },
            serverType: 'geoserver'
          }),
          zIndex: index + 2,
          opacity: layerOpacity[layerConfig.id] || 0.7,
          visible: layerVisibility[layerConfig.id] !== false,
        });
        wmsLayerRefs.current[layerConfig.id] = wmsLayer;
        map.addLayer(wmsLayer);
      });

      // Set legend URL for the first layer
      const legendUrl = `https://geomimo-prototype.brin.go.id/service/geoserver/geomimo/wms?service=WMS&version=1.1.0&request=GetLegendGraphic&layer=${DEFORESTASI_LAYERS[0].layer}&format=image/png`;
      setLegendUrl(legendUrl);

      // --- HIGHLIGHT LAYER ---
      const highlightSource = new VectorSource();
      const highlightLayer = new VectorLayer({
        source: highlightSource,
        zIndex: 99,
        style: new Style({
          image: new CircleStyle({
            radius: 8,
            fill: new Fill({ color: 'rgba(255,0,0,0.7)' }),
            stroke: new Stroke({ color: '#fff', width: 2 })
          })
        })
      });
      highlightLayerRef.current = highlightLayer;
      map.addLayer(highlightLayer);

      // --- POPUP SETUP ---
      let popupContainer = document.getElementById('popup-deforestasi');
      let popupContent = document.getElementById('popup-content-deforestasi');
      let popupCloser = document.getElementById('popup-closer-deforestasi');
      if (!popupContainer) {
        popupContainer = document.createElement('div');
        popupContainer.id = 'popup-deforestasi';
        popupContainer.className = 'ol-popup';
        popupContent = document.createElement('div');
        popupContent.id = 'popup-content-deforestasi';
        popupCloser = document.createElement('a');
        popupCloser.id = 'popup-closer-deforestasi';
        popupCloser.href = '#';
        popupCloser.className = 'ol-popup-closer';
        popupContainer.appendChild(popupCloser);
        popupContainer.appendChild(popupContent);
        document.body.appendChild(popupContainer);
      }
      
      // OpenLayers Overlay
      const Overlay = require('ol/Overlay').default;
      const popupOverlay = new Overlay({
        element: popupContainer,
        autoPan: true,
        autoPanAnimation: {
          duration: 250,
        },
      });
      map.addOverlay(popupOverlay);
      
      // Closer
      popupCloser.onclick = function () {
        popupOverlay.setPosition(undefined);
        popupCloser.blur();
        return false;
      };

      // Add click event for GetFeatureInfo
      const handleMapClick = (evt) => {
        const view = map.getView();
        const viewResolution = view.getResolution();
        
        // Get visible layers
        const visibleLayers = DEFORESTASI_LAYERS.filter(l => layerVisibility[l.id]);
        
        if (visibleLayers.length === 0) return;

        // Highlight selected pixel
        if (highlightLayerRef.current) {
          const source = highlightLayerRef.current.getSource();
          source.clear();
          const feature = new Feature({ geometry: new Point(evt.coordinate) });
          source.addFeature(feature);
        }

        // Fetch feature info for all visible layers
        const getUrl = (layerName) => {
          return new TileWMS({
            url: wmsUrl,
            params: {
              'LAYERS': layerName,
              TILED: true,
              VERSION: '1.1.1',
              FORMAT: 'image/png',
              TRANSPARENT: true,
              STYLES: '',
              EXCEPTIONS: 'application/vnd.ogc.se_inimage',
              SRS: 'EPSG:4326',
              FORMAT_OPTIONS: 'dpi:180'
            },
            serverType: 'geoserver'
          }).getFeatureInfoUrl(
            evt.coordinate,
            viewResolution,
            view.getProjection(),
            {
              'INFO_FORMAT': 'application/json',
              'QUERY_LAYERS': layerName,
            }
          );
        };

        // Fetch info for all visible layers
        const requests = visibleLayers.map(layer => {
          const url = getUrl(layer.layer);
          return url ? axios.get(url).catch(() => null) : Promise.resolve(null);
        });

        Promise.all(requests).then((responses) => {
          let content = '<div style="max-height: 300px; overflow-y: auto;">';
          let hasData = false;

          responses.forEach((response, index) => {
            if (response && response.data && response.data.features && response.data.features.length > 0) {
              hasData = true;
              const layer = visibleLayers[index];
              const props = response.data.features[0].properties;
              
              content += `<div style="margin-bottom: 10px; padding-bottom: 10px; border-bottom: 1px solid #eee;">`;
              content += `<b style="color: #d32f2f;">${layer.name}</b><br/>`;
              
              for (const key in props) {
                if (props[key] !== null && props[key] !== undefined) {
                  content += `<b>${key}:</b> ${props[key]}<br/>`;
                }
              }
              content += '</div>';
            }
          });

          if (hasData) {
            content += '</div>';
            popupContent.innerHTML = content;
            popupOverlay.setPosition(evt.coordinate);
          } else {
            popupOverlay.setPosition(undefined);
          }
        });
      };
      
      map.on('singleclick', handleMapClick);
      
      // Cleanup
      return () => {
        map.un('singleclick', handleMapClick);
        map.removeOverlay(popupOverlay);
        if (popupContainer && popupContainer.parentNode) popupContainer.parentNode.removeChild(popupContainer);
        DEFORESTASI_LAYERS.forEach((layerConfig) => {
          if (wmsLayerRefs.current[layerConfig.id]) {
            map.removeLayer(wmsLayerRefs.current[layerConfig.id]);
          }
        });
        map.removeLayer(highlightLayer);
      };
    }
  }, [map]);
  
  // Sync layer visibility with state
  useEffect(() => {
    if (basemapLayerRef.current) basemapLayerRef.current.setVisible(layerVisibility.basemap);
    DEFORESTASI_LAYERS.forEach((layerConfig) => {
      if (wmsLayerRefs.current[layerConfig.id]) {
        wmsLayerRefs.current[layerConfig.id].setVisible(layerVisibility[layerConfig.id]);
      }
    });
  }, [layerVisibility]);

  // Sync layer opacity with state
  useEffect(() => {
    DEFORESTASI_LAYERS.forEach((layerConfig) => {
      if (wmsLayerRefs.current[layerConfig.id]) {
        wmsLayerRefs.current[layerConfig.id].setOpacity(layerOpacity[layerConfig.id]);
      }
    });
  }, [layerOpacity]);

  // Layer control panel handlers
  const handleLayerToggle = (layerId) => {
    setLayerVisibility((prev) => ({ ...prev, [layerId]: !prev[layerId] }));
  };
  
  const handleOpacityChange = (layerId, value) => {
    setLayerOpacity((prev) => ({ ...prev, [layerId]: value }));
  };

  // Zoom to region
  const handleZoomToRegion = (region) => {
    if (map && REGION_CENTERS[region]) {
      const center = fromLonLat(REGION_CENTERS[region]);
      map.getView().animate({
        center: center,
        zoom: 6,
        duration: 1000
      });
    }
  };

  // Filter layers by region
  const filteredLayers = selectedRegion === 'all' 
    ? DEFORESTASI_LAYERS 
    : DEFORESTASI_LAYERS.filter(l => l.region === selectedRegion);

  // Get unique regions
  const regions = ['all', ...new Set(DEFORESTASI_LAYERS.map(l => l.region))];

  return (
    <>
      <div style={{ position: 'relative', width: '100%', height: '100%' }}>
        <div id="map" className="map"></div>
        
        {/* Legend */}
        {legendUrl && (
          <div style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            backgroundColor: 'white',
            border: '1px solid #ccc',
            padding: '10px',
            borderRadius: '5px',
            zIndex: 1000,
            maxWidth: '250px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
          }}>
            <div style={{
              marginBottom: '8px',
              borderBottom: '1px solid #e5e7eb',
              paddingBottom: '5px'
            }}>
              <h4 style={{
                margin: 0,
                fontSize: '0.95rem',
                fontWeight: 600,
                color: '#1f2937'
              }}>Legend - Deforestasi</h4>
            </div>
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}>
              <img 
                src={legendUrl} 
                alt="Legend" 
                style={{
                  maxWidth: '100%',
                  height: 'auto',
                  display: 'block'
                }}
                onError={(e) => {
                  console.error('Failed to load legend image:', legendUrl);
                }}
              />
            </div>
          </div>
        )}
      </div>
      
      {/* Layer Control Panel */}
      <div style={{
        position: 'absolute',
        top: 10,
        left: 10,
        background: 'rgba(255,255,255,0.95)',
        borderRadius: 8,
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
        padding: '12px 18px',
        zIndex: 1000,
        minWidth: 280,
        maxHeight: 'calc(100vh - 150px)',
        overflowY: 'auto',
      }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: 10,
          borderBottom: '1px solid #e5e7eb',
          paddingBottom: 8
        }}>
          <strong style={{ color: '#d32f2f' }}>Layer Deforestasi</strong>
          <button 
            onClick={() => setIsLayerPanelOpen(!isLayerPanelOpen)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            {isLayerPanelOpen ? '▼' : '▶'}
          </button>
        </div>
        
        {isLayerPanelOpen && (
          <>
            {/* Region Filter */}
            <div style={{ marginBottom: 12 }}>
              <label style={{ fontSize: '12px', fontWeight: 500 }}>Filter Wilayah:</label>
              <select 
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                style={{
                  width: '100%',
                  padding: '5px',
                  marginTop: '4px',
                  borderRadius: '4px',
                  border: '1px solid #ccc'
                }}
              >
                {regions.map(region => (
                  <option key={region} value={region}>
                    {region === 'all' ? 'Semua Wilayah' : region}
                  </option>
                ))}
              </select>
            </div>

            {/* Quick Zoom Buttons */}
            <div style={{ marginBottom: 12 }}>
              <label style={{ fontSize: '12px', fontWeight: 500 }}>Zoom ke Wilayah:</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '4px' }}>
                {Object.keys(REGION_CENTERS).map(region => (
                  <button
                    key={region}
                    onClick={() => handleZoomToRegion(region)}
                    style={{
                      padding: '4px 8px',
                      fontSize: '11px',
                      borderRadius: '4px',
                      border: '1px solid #d32f2f',
                      background: 'white',
                      color: '#d32f2f',
                      cursor: 'pointer'
                    }}
                  >
                    {region}
                  </button>
                ))}
              </div>
            </div>

            {/* Layer List */}
            {filteredLayers.map((layerConfig) => (
              <div key={layerConfig.id} style={{ marginBottom: 8, paddingBottom: 8, borderBottom: '1px solid #f0f0f0' }}>
                <label style={{ display: 'flex', alignItems: 'center', fontSize: '13px' }}>
                  <input 
                    type="checkbox" 
                    checked={layerVisibility[layerConfig.id]} 
                    onChange={() => handleLayerToggle(layerConfig.id)}
                    style={{ marginRight: 8 }}
                  /> 
                  <span>{layerConfig.name}</span>
                </label>
                <div style={{ marginLeft: 24, marginTop: 4 }}>
                  <input 
                    type="range" 
                    min={0} 
                    max={1} 
                    step={0.01} 
                    value={layerOpacity[layerConfig.id]} 
                    onChange={e => handleOpacityChange(layerConfig.id, parseFloat(e.target.value))}
                    style={{ width: '120px' }}
                  />
                  <span style={{ marginLeft: 8, fontSize: '11px' }}>{Math.round(layerOpacity[layerConfig.id] * 100)}%</span>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </>
  );
};

export default BaseMapComponent;

// Add popup CSS
document.head.insertAdjacentHTML('beforeend', `<style>.ol-popup{position:absolute;background:white;-webkit-filter:drop-shadow(0 1px 4px rgba(0,0,0,0.2));filter:drop-shadow(0 1px 4px rgba(0,0,0,0.2));padding:15px;border-radius:10px;border:1px solid #cccccc;bottom:12px;left:-50px;min-width:200px;max-width:350px}.ol-popup:after,.ol-popup:before{top:100%;border:solid transparent;content:" ";height:0;width:0;position:absolute;pointer-events:none}.ol-popup:after{border-top-color:white;border-width:10px;left:48px;margin-left:-10px}.ol-popup-closer{text-decoration:none;position:absolute;top:2px;right:8px;font-size:16px}</style>`);
