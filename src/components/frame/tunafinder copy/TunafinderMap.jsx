import React, { useEffect, useState, useRef } from "react";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import VectorTileLayer from "ol/layer/VectorTile";
import XYZ from "ol/source/XYZ";
import VectorTile from "ol/source/VectorTile";
import MVT from "ol/format/MVT";
import Style from "ol/style/Style";
import Icon from "ol/style/Icon";
import Fill from "ol/style/Fill";
import Stroke from "ol/style/Stroke";
import "ol/ol.css";
import "./TunafinderMap.css";
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Paper,
  Typography,
  FormControlLabel,
  Switch,
  Button,
  Checkbox,
  FormGroup,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import LayersIcon from '@mui/icons-material/Layers';
import DateRangeIcon from '@mui/icons-material/DateRange';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import MapIcon from '@mui/icons-material/Map';
import ScienceIcon from '@mui/icons-material/Science';
import { getHSITileUrl, getAreaTangkapTileUrl, getTitikTangkapTileUrl } from './tunafinderService';

export default function TunafinderMap() {
  const [map, setMap] = useState(null);
  const mapRef = useRef(null);
  const hsiLayerRef = useRef(null);
  const areaLayerRef = useRef(null);
  const titikLayerRef = useRef(null);

  // Filter states
  const [filterParams, setFilterParams] = useState({
    tanggal_start: '2025-09-01',
    tanggal_end: '2025-09-30',
    kategori: 'Berpotensi',
    // MVT (Area/Titik) can use more than one species
    spesies: ['ALB'],
    // HSI uses single species (dropdown)
    hsi_spesies: 'ALB',
    hsi_date: '20251119',
  });

  // Layer visibility states
  const [layerVisibility, setLayerVisibility] = useState({
    hsi: false,
    area: true,
    titik: true
  });

  // Initialize map
  useEffect(() => {
    if (map) return; // Prevent multiple map initializations

    const baseLayer = new TileLayer({
      title: "Basemap",
      source: new XYZ({ 
        url: "https://abcd.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
      }),
    });

    const olMap = new Map({
      target: "tunafinder-map",
      layers: [baseLayer],
      view: new View({
        center: [13124075.715923082, -277949.29803053016], // Indonesia center
        zoom: 5,
        projection: "EPSG:3857",
      }),
    });

    setMap(olMap);
    mapRef.current = olMap;

    return () => {
      if (olMap) {
        olMap.setTarget(undefined);
      }
    };
  }, []);

  // Update layers when filters or visibility change
  useEffect(() => {
    if (!map) return;

    // Update HSI layer
    if (layerVisibility.hsi) {
      // Remove existing HSI layer
      if (hsiLayerRef.current) {
        map.removeLayer(hsiLayerRef.current);
      }

      const hsiUrl = getHSITileUrl({
        date: filterParams.hsi_date,
        spesies: filterParams.hsi_spesies || 'ALB',
      });
      
      const hsiSource = new XYZ({
        url: hsiUrl,
        tileLoadFunction: function(tile, src) {
          // Handle tile loading errors
          const img = tile.getImage();
          img.onerror = function() {
            console.warn('HSI tile load error:', src);
            // Set a transparent/empty tile on error
            img.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
          };
          img.src = src;
        }
      });
      
      const hsiLayer = new TileLayer({
        title: 'HSI',
        source: hsiSource,
        opacity: 0.8,
        zIndex: 10
      });
      
      hsiLayerRef.current = hsiLayer;
      map.addLayer(hsiLayer);
    } else {
      if (hsiLayerRef.current) {
        map.removeLayer(hsiLayerRef.current);
        hsiLayerRef.current = null;
      }
    }

    // Update Area Tangkap layer (Vector Tiles)
    if (layerVisibility.area) {
      // Remove existing area layer
      if (areaLayerRef.current) {
        map.removeLayer(areaLayerRef.current);
      }

      const areaUrl = getAreaTangkapTileUrl({
        tanggal_start: filterParams.tanggal_start,
        tanggal_end: filterParams.tanggal_end,
        kategori: filterParams.kategori,
        spesies: filterParams.spesies
      });
      
      // Define colors per species for Area Tangkap
      const spesiesColorMap = {
        ALB: 'rgba(33, 150, 243, 0.4)', // Blue
        BET: 'rgba(76, 175, 80, 0.4)',  // Green
        SKJ: 'rgba(255, 193, 7, 0.4)',  // Amber
        YFT: 'rgba(244, 67, 54, 0.4)',  // Red
      };

      const areaStyle = (feature) => {
        const s = feature.get('spesies') || feature.get('species');
        const baseColor = spesiesColorMap[s] || 'rgba(96, 125, 139, 0.4)'; // Default blue-grey
        const strokeColor = baseColor.replace('0.4', '1');

        return new Style({
          fill: new Fill({
            color: baseColor,
          }),
          stroke: new Stroke({
            color: strokeColor,
            width: 1,
          }),
        });
      };

      const areaLayer = new VectorTileLayer({
        title: 'Area Tangkap',
        source: new VectorTile({
          format: new MVT(),
          url: areaUrl
        }),
        style: areaStyle,
        opacity: 0.7,
        zIndex: 20
      });
      
      areaLayerRef.current = areaLayer;
      map.addLayer(areaLayer);
    } else {
      if (areaLayerRef.current) {
        map.removeLayer(areaLayerRef.current);
        areaLayerRef.current = null;
      }
    }

    // Update Titik Tangkap layer (Vector Tiles)
    if (layerVisibility.titik) {
      // Remove existing titik layer
      if (titikLayerRef.current) {
        map.removeLayer(titikLayerRef.current);
      }

      const titikUrl = getTitikTangkapTileUrl({
        tanggal_start: filterParams.tanggal_start,
        tanggal_end: filterParams.tanggal_end,
        kategori: filterParams.kategori,
        spesies: filterParams.spesies
      });
      
      // Fish icon style for catch points (dynamic scale by zoom/resolution)
      const titikStyle = (feature, resolution) => {
        // Approximate zoom level from resolution (WebMercator)
        const zoom = Math.log2(156543.03392804097 / resolution);
        const minZoom = 3;
        const maxZoom = 12;
        const clampedZoom = Math.max(minZoom, Math.min(maxZoom, zoom));

        // Scale between 0.2 (far) and 0.6 (near) so icon is not too big
        const minScale = 0.2;
        const maxScale = 0.6;
        const scale =
          minScale +
          ((clampedZoom - minZoom) / (maxZoom - minZoom)) * (maxScale - minScale);

        return new Style({
          image: new Icon({
            src: 'https://cdn-icons-png.flaticon.com/512/311/311593.png',
            scale,
            anchor: [0.5, 1],
          }),
        });
      };

      const titikLayer = new VectorTileLayer({
        title: 'Titik Tangkap',
        source: new VectorTile({
          format: new MVT(),
          url: titikUrl
        }),
        style: titikStyle,
        opacity: 0.9,
        zIndex: 30
      });
      
      titikLayerRef.current = titikLayer;
      map.addLayer(titikLayer);
    } else {
      if (titikLayerRef.current) {
        map.removeLayer(titikLayerRef.current);
        titikLayerRef.current = null;
      }
    }

    // Force map refresh
    map.render();
  }, [map, filterParams, layerVisibility]);

  // Handle filter changes
  const handleFilterChange = (field) => (event) => {
    const value = event.target.value;
    setFilterParams(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle checkbox change for multi-species (MVT layers)
  const handleSpeciesCheckboxChange = (code) => (event) => {
    const checked = event.target.checked;
    setFilterParams(prev => {
      const current = Array.isArray(prev.spesies) ? prev.spesies : [];
      let next;
      if (checked) {
        next = current.includes(code) ? current : [...current, code];
      } else {
        next = current.filter(s => s !== code);
      }
      // Ensure at least one species remains selected for MVT
      if (next.length === 0) {
        next = ['ALB'];
      }
      return {
        ...prev,
        spesies: next,
      };
    });
  };

  // Handle date changes
  const handleDateChange = (field) => (date) => {
    setFilterParams(prev => ({
      ...prev,
      [field]: date ? date.format('YYYY-MM-DD') : ''
    }));
  };

  // Handle HSI date change
  const handleHSIDateChange = (date) => {
    if (date) {
      const formattedDate = date.format('YYYYMMDD');
      setFilterParams(prev => ({
        ...prev,
        hsi_date: formattedDate
      }));
    }
  };

  // Handle layer visibility changes
  const handleLayerToggle = (layer) => (event) => {
    setLayerVisibility(prev => ({
      ...prev,
      [layer]: event.target.checked
    }));
  };

  return (
    <div className="tunafinder-map-container">
      <div id="tunafinder-map" className="map-container"></div>

      {/* Filter Form - Top Left */}
      <div style={{
        position: 'absolute',
        top: '10px',
        left: '40px',
        width: '400px',
        zIndex: 1000,
        maxHeight: '90vh',
        overflowY: 'auto'
      }}>
        <Paper elevation={3} sx={{ p: 2, backgroundColor: 'rgba(255, 255, 255, 0.95)' }}>
          <Typography variant="h6" gutterBottom>
            <MapIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
            Tuna Finder Filter
          </Typography>
          
          <Grid container spacing={2}>
            {/* Layer Control Section */}
            <Grid item xs={12}>
              <Typography variant="subtitle2" sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
                <LayersIcon sx={{ mr: 0.5, fontSize: '1rem' }} />
                Layer Control
              </Typography>
              <FormControlLabel
                control={
                  <Switch
                    checked={layerVisibility.hsi}
                    onChange={handleLayerToggle('hsi')}
                    color="primary"
                  />
                }
                label="Intensitas / HSI"
              />
              <br />
              <FormControlLabel
                control={
                  <Switch
                    checked={layerVisibility.area}
                    onChange={handleLayerToggle('area')}
                    color="primary"
                  />
                }
                label="Area Tangkap"
              />
              <br />
              <FormControlLabel
                control={
                  <Switch
                    checked={layerVisibility.titik}
                    onChange={handleLayerToggle('titik')}
                    color="primary"
                  />
                }
                label="Titik Tangkap"
              />
            </Grid>

            {/* Date Range Section */}
            <Grid item xs={12}>
              <Typography variant="subtitle2" sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
                <DateRangeIcon sx={{ mr: 0.5, fontSize: '1rem' }} />
                Date Range
              </Typography>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Tanggal Start"
                  value={filterParams.tanggal_start ? dayjs(filterParams.tanggal_start) : null}
                  onChange={handleDateChange('tanggal_start')}
                  slotProps={{ textField: { fullWidth: true, size: 'small' } }}
                />
              </LocalizationProvider>
            </Grid>

            <Grid item xs={12}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Tanggal End"
                  value={filterParams.tanggal_end ? dayjs(filterParams.tanggal_end) : null}
                  onChange={handleDateChange('tanggal_end')}
                  slotProps={{ textField: { fullWidth: true, size: 'small' } }}
                />
              </LocalizationProvider>
            </Grid>

            {/* HSI Section */}
            <Grid item xs={12}>
              <Typography variant="subtitle2" sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
                <ScienceIcon sx={{ mr: 0.5, fontSize: '1rem' }} />
                HSI (Habitat Suitability Index)
              </Typography>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="HSI Date"
                  value={filterParams.hsi_date ? dayjs(filterParams.hsi_date, 'YYYYMMDD') : null}
                  onChange={handleHSIDateChange}
                  slotProps={{ textField: { fullWidth: true, size: 'small', sx: { mb: 1 } } }}
                />
              </LocalizationProvider>
              <FormControl fullWidth size="small">
                <InputLabel>HSI Species</InputLabel>
                <Select
                  value={filterParams.hsi_spesies}
                  onChange={handleFilterChange('hsi_spesies')}
                  label="HSI Species"
                >
                  <MenuItem value="ALB">ALB (Albacore)</MenuItem>
                  <MenuItem value="BET">BET (Bigeye Tuna)</MenuItem>
                  <MenuItem value="YFT">YFT (Yellowfin Tuna)</MenuItem>
                  <MenuItem value="SKJ">SKJ (Skipjack)</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Category Filter */}
            <Grid item xs={12}>
              <Typography variant="subtitle2" sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
                <LocationOnIcon sx={{ mr: 0.5, fontSize: '1rem' }} />
                Filter Parameters
              </Typography>
              <FormControl fullWidth size="small">
                <InputLabel>Kategori</InputLabel>
                <Select
                  value={filterParams.kategori}
                  onChange={handleFilterChange('kategori')}
                  label="Kategori"
                >
                  <MenuItem value="Sangat Berpotensi">Sangat Berpotensi</MenuItem>
                  <MenuItem value="Berpotensi">Berpotensi</MenuItem>
                  <MenuItem value="Cukup Berpotensi">Cukup Berpotensi</MenuItem>
                  {/* Add more categories as needed */}
                </Select>
              </FormControl>
            </Grid>

            {/* Species Filter for MVT (Area/Titik) as checkboxes */}
            <Grid item xs={12}>
              <Typography variant="subtitle2" sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
                <LocationOnIcon sx={{ mr: 0.5, fontSize: '1rem' }} />
                Spesies (Area & Titik Tangkap)
              </Typography>
              <FormGroup>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={Array.isArray(filterParams.spesies) && filterParams.spesies.includes('ALB')}
                      onChange={handleSpeciesCheckboxChange('ALB')}
                    />
                  }
                  label="ALB (Albacore)"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={Array.isArray(filterParams.spesies) && filterParams.spesies.includes('BET')}
                      onChange={handleSpeciesCheckboxChange('BET')}
                    />
                  }
                  label="BET (Bigeye Tuna)"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={Array.isArray(filterParams.spesies) && filterParams.spesies.includes('YFT')}
                      onChange={handleSpeciesCheckboxChange('YFT')}
                    />
                  }
                  label="YFT (Yellowfin Tuna)"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={Array.isArray(filterParams.spesies) && filterParams.spesies.includes('SKJ')}
                      onChange={handleSpeciesCheckboxChange('SKJ')}
                    />
                  }
                  label="SKJ (Skipjack)"
                />
              </FormGroup>
            </Grid>
          </Grid>
        </Paper>
      </div>

      {/* Legend / Info Section - Bottom Right */}
      <div style={{
        position: 'absolute',
        bottom: '20px',
        right: '20px',
        width: '300px',
        zIndex: 1000
      }}>
        <Paper elevation={3} sx={{ p: 2, backgroundColor: 'rgba(255, 255, 255, 0.95)' }}>
          <Typography variant="h6" gutterBottom sx={{ fontSize: '1rem', display: 'flex', alignItems: 'center' }}>
            <ScienceIcon sx={{ mr: 0.5 }} />
            Layer Info
          </Typography>
          <Box sx={{ fontSize: '0.85rem' }}>
            {layerVisibility.hsi && (
              <Box sx={{ mb: 1, p: 1, bgcolor: 'rgba(25, 118, 210, 0.1)', borderRadius: 1 }}>
                <strong>HSI:</strong> Habitat Suitability Index<br />
                <small>
                  Species: {filterParams.hsi_spesies} | Date: {filterParams.hsi_date}
                </small>
              </Box>
            )}
            {layerVisibility.area && (
              <Box sx={{ mb: 1, p: 1, bgcolor: 'rgba(76, 175, 80, 0.1)', borderRadius: 1 }}>
                <strong>Area Tangkap:</strong> Catch area visualization<br />
                <small>
                  Species: {Array.isArray(filterParams.spesies) ? filterParams.spesies.join(', ') : filterParams.spesies}
                </small>
              </Box>
            )}
            {layerVisibility.titik && (
              <Box sx={{ mb: 1, p: 1, bgcolor: 'rgba(255, 152, 0, 0.1)', borderRadius: 1 }}>
                <strong>Titik Tangkap:</strong> Catch point locations<br />
                <small>
                  Species: {Array.isArray(filterParams.spesies) ? filterParams.spesies.join(', ') : filterParams.spesies}
                </small>
              </Box>
            )}
            {!layerVisibility.hsi && !layerVisibility.area && !layerVisibility.titik && (
              <Typography variant="body2" color="text.secondary">
                Enable layers to see information
              </Typography>
            )}
          </Box>
        </Paper>
      </div>
    </div>
  );
}
