import React, { useState, useEffect } from 'react';
import './Sidebar.scss';
import {
  Typography,
  Select,
  FormControl,
  MenuItem,
  InputLabel,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Grid,
  Box,
  Slider,
  Stack,
  Button,
  TextField
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CloudIcon from '@mui/icons-material/Cloud';
import CloudQueueIcon from '@mui/icons-material/CloudQueue';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import CollectionsComponent from '../stac/CollectionsComponent'; // Adjust the path as necessary
import { useDispatch } from 'react-redux'; // Import useDispatch
import { selectCollection } from '../../actions/mapActions'; // Import your action

import { v4 as uuidv4 } from 'uuid';
import { createJob } from '../../actions/jobsActions';
import { getUserData } from "../../utility/Utils";
import { getJobById, setSelectedJob } from '../../actions/jobsActions'; // Import the action

const SidebarComponent = ({ onHoverItem, onItemSelect, onCollectionSelect, aoiCoords }) => {
  const dispatch = useDispatch(); // Initialize dispatch
  const user = getUserData();
  const [isVisible, setIsVisible] = useState(true);
  const [showCollections, setShowCollections] = useState(false); // New state for showing collections
  const [checked, setChecked] = useState([false, false, false]);
  const [cloud, setCloud] = React.useState(30);
  const [dateFrom, setDateFrom] = React.useState(dayjs().subtract(2, 'year')); // Set dateFrom to 2 years ago
  const [dateUntil, setDateUntil] = React.useState(dayjs()); // Set dateUntil to today
  const [collection, setCollection] = React.useState([]);
  const [sattelite, setSattelite] = React.useState('');
  const [params, setParams] = React.useState('');
  const [dateRangeError, setDateRangeError] = React.useState(''); // Add state for date range validation error
  const [jobId, setJobId] = useState(null);
  
  // Add new state variables for all input parameters
  const [jarakAntarTanam, setJarakAntarTanam] = useState('8');
  const [ekstremMin, setEkstremMin] = useState('2');
  const [ekstremMax, setEkstremMax] = useState('4');
  const [perbedaanDN, setPerbedaanDN] = useState('0.3');
  const [batasEkstremMin, setBatasEkstremMin] = useState('0.7');
  const [kelasPertumbuhanMin, setKelasPertumbuhanMin] = useState('7');
  const handleChange = (event, newValue) => {
    setCloud(newValue);
  };

  const validateDateRange = (from, until) => {
    const diffInYears = until.diff(from, 'year', true);
    if (Math.abs(diffInYears - 2) > 0.1) { // Allow small tolerance for day differences
      setDateRangeError('Date range must be exactly 2 years');
    } else {
      setDateRangeError('');
    }
  };

  const toggleSidebar = () => {
    setIsVisible(!isVisible);
  };

  const satteliteChange = (event) => {
    setSattelite(event.target.value);
    setChecked([false, false, false]); // Reset checkboxes when satellite changes
    setCollection([]);
  };

  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    const updatedChecked = checked
      ? [...collection, name]
      : collection.filter(item => item !== name);
    setCollection(updatedChecked); // Update local state

    // Dispatch the collection to Redux
    dispatch(selectCollection(updatedChecked)); // Dispatch action to store in Redux

    // Update the checkbox state for UI
    const index = name === "landsat-c2-l2" ? 0 : name === "sentinel-2-l1c" ? 1 : 2;
    setChecked((prev) => {
      const newChecked = [...prev];
      newChecked[index] = checked;
      return newChecked;
    });
  };

  const handleSubmit = async () => {
    // Check if AOI coordinates are selected
    if (!aoiCoords) {
      alert('Please select an Area of Interest (AOI) by drawing a bounding box on the map first.');
      return;
    }

    // Validate input parameters
    const parameters = [
      { name: 'Jarak Antar Tanam', value: jarakAntarTanam, min: 1, max: 365 },
      { name: 'Ekstrem Minimum', value: ekstremMin, min: 1, max: 50 },
      { name: 'Ekstrem Maksimum', value: ekstremMax, min: 1, max: 50 },
      { name: 'Perbedaan nilai DN', value: perbedaanDN, min: 0, max: 1 },
      { name: 'Batas Ekstrem Minimum', value: batasEkstremMin, min: 0, max: 1 },
      { name: 'Kelas Pertumbuhan Minimum', value: kelasPertumbuhanMin, min: 1, max: 50 }
    ];

    for (const param of parameters) {
      if (!param.value || isNaN(parseFloat(param.value))) {
        alert(`Please enter a valid number for ${param.name}`);
        return;
      }
      
      const value = parseFloat(param.value);
      if (value < param.min || value > param.max) {
        alert(`${param.name} must be between ${param.min} and ${param.max}`);
        return;
      }
    }

    // Validate that ekstremMin < ekstremMax
    if (parseFloat(ekstremMin) >= parseFloat(ekstremMax)) {
      alert('Ekstrem Minimum must be less than Ekstrem Maksimum');
      return;
    }

    const newJobId = uuidv4();
    const jobname = `IP Padi`;
    const cpurequired = '1';
    const priority = '1';
    
    // Parse AOI coordinates from the format "minLon,minLat,maxLon,maxLat"
    const [aoi_xmin, aoi_ymin, aoi_xmax, aoi_ymax] = aoiCoords.split(',').map(coord => parseFloat(coord));
    
    // Validate coordinates
    if (isNaN(aoi_xmin) || isNaN(aoi_ymin) || isNaN(aoi_xmax) || isNaN(aoi_ymax)) {
      alert('Invalid AOI coordinates. Please draw a new bounding box.');
      return;
    }
    
    // Validate coordinate ranges for Indonesia (rough bounds)
    if (aoi_xmin < 90 || aoi_xmax > 150 || aoi_ymin < -15 || aoi_ymax > 10) {
      alert('AOI coordinates are outside the expected range for Indonesia. Please select an area within Indonesia.');
      return;
    }
    
    // Ensure min < max for both longitude and latitude
    if (aoi_xmin >= aoi_xmax || aoi_ymin >= aoi_ymax) {
      alert('Invalid AOI coordinates: minimum values must be less than maximum values.');
      return;
    }
    
    const command = `${process.env.REACT_APP_PADI_PROCESSING_URL}/run_ip_padi?implementation=modul_ip_padi&per1sikluspadi=${jarakAntarTanam}&perekstremmin=${ekstremMin}&perekstremmax=${ekstremMax}&btsbedaekstremmaxmin=${perbedaanDN}&batasekstremmin=${batasEkstremMin}&jlmkelaspertumbuhanminimum=${kelasPertumbuhanMin}&aoi_xmin=${aoi_xmin}&aoi_xmax=${aoi_xmax}&aoi_ymin=${aoi_ymin}&aoi_ymax=${aoi_ymax}&output=Subang&id_proses=${newJobId}`;
    
    console.log('AOI Coordinates:', aoiCoords);
    console.log('Parsed coordinates:', { aoi_xmin, aoi_ymin, aoi_xmax, aoi_ymax });
    console.log('Processing Parameters:', {
      jarakAntarTanam,
      ekstremMin,
      ekstremMax,
      perbedaanDN,
      batasEkstremMin,
      kelasPertumbuhanMin
    });
    console.log('API Command:', command);
    console.log(user);
    console.log(user.username);
    
    try {
        await dispatch(createJob(newJobId, user.username, jobname, command, cpurequired, priority));
        setJobId(newJobId); // Set jobId state
     
        await  dispatch(setSelectedJob(newJobId)); // Dispatch the action
        await dispatch(getJobById(newJobId));
    } catch (error) {
        console.error("Error:", error);
    }
  };

  const handleCollectionSelect = () => {

    setShowCollections(false); // Hide collections and show search form
    onCollectionSelect(collection);

  };

  useEffect(() => {
    validateDateRange(dateFrom, dateUntil);
  }, [dateFrom]);

  return (
    <div className={`sidebar ${isVisible ? '' : 'hidden'}`}>
      <div className='sidebar-header' style={{
        background: 'linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%)',
        color: 'white',
        padding: '20px 24px',
        borderRadius: '12px 12px 0 0',
        boxShadow: '0 4px 20px rgba(76, 175, 80, 0.2)',
        marginBottom: '0'
      }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '16px',
          width: '100%'
        }}>
          <div className='circle-background' style={{
            background: 'rgba(255,255,255,0.2)',
            borderRadius: '50%',
            width: '48px',
            height: '48px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px solid rgba(255,255,255,0.3)'
          }}>
            <ArrowBackIcon
              onClick={toggleSidebar}
              style={{ color: 'white', fontSize: '20px', cursor: 'pointer' }}
            />
          </div>
          <Box display="flex" flexDirection="column">
            <a href="/" style={{ textDecoration: 'none', color:'#fff' }}>
              <Typography variant="h4" sx={{ 
                fontWeight: 600, 
                color: 'white',
                margin: 0,
                fontSize: '1.75rem'
              }}>
                GEOMIMO
              </Typography>
            </a>
            <Typography variant="body2" style={{ 
              fontSize: '0.75rem',
              color: 'rgba(255,255,255,0.9)',
              marginTop: '4px'
            }}>
              Geoinformatics Multi Input Multi Output
            </Typography>
          </Box>
        </div>
      </div>

      <div className='sidebar-content' style={{
        padding: '24px',
        background: '#f8f9fa',
        borderRadius: '0 0 12px 12px',
        boxShadow: '0 2px 12px rgba(76, 175, 80, 0.08)',
        minHeight: '400px'
      }}>
        {showCollections ? ( // Conditional rendering
          <CollectionsComponent
            onHoverItem={onHoverItem}
            onItemSelect={onItemSelect}
            onCollectionSelect={handleCollectionSelect} // Use the updated function
            aoiCoords={aoiCoords}
            collection={collection}
            params={params} // Pass params to CollectionsComponent
            
          />
        ) : (
          <Grid container spacing={3}>
            

            <Grid item xs={12}>
              <Box sx={{ 
                padding: '20px',
                background: 'linear-gradient(135deg, #f8f9fa 0%, #e8f5e8 100%)',
                borderRadius: '12px',
                boxShadow: '0 2px 8px rgba(76, 175, 80, 0.1)',
                border: '1px solid #c8e6c9',
                marginBottom: '20px'
              }}>
                <Typography variant="h6" sx={{ 
                  mb: 2, 
                  color: '#2E7D32',
                  fontWeight: 600,
                  fontSize: '1.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}>
                  🌾 Indeks Penanaman Padi Menggunakan Citra Sentinel-1
                </Typography>
                
                <Typography variant="body2" sx={{ 
                  mb: 2, 
                  color: '#2E7D32',
                  fontSize: '0.9rem',
                  lineHeight: 1.6
                }}>
                  <strong>Deskripsi Modul:</strong> Modul ini menganalisis pola penanaman padi menggunakan citra Sentinel-1 SAR (Synthetic Aperture Radar) untuk memantau aktivitas pertanian dan siklus perkembangan tanaman.
                </Typography>

                <Typography variant="body2" sx={{ 
                  mb: 2, 
                  color: '#2E7D32',
                  fontSize: '0.9rem',
                  lineHeight: 1.6
                }}>
                  <strong>Fitur Utama:</strong>
                  <br />• <strong>Teknologi SAR:</strong> Menggunakan data radar Sentinel-1 untuk pemantauan cuaca apapun, siang/malam
                  <br />• <strong>Deteksi Siklus Tanaman:</strong> Mengidentifikasi pola penanaman dan tahap pertumbuhan
                  <br />• <strong>Analisis Temporal:</strong> Melacak perubahan dari waktu ke waktu untuk menentukan interval penanaman optimal
                  <br />• <strong>Indeks Vegetasi:</strong> Menghitung nilai ekstrem untuk penilaian kesehatan tanaman
                </Typography>

                <Typography variant="body2" sx={{ 
                  mb: 2, 
                  color: '#2E7D32',
                  fontSize: '0.9rem',
                  lineHeight: 1.6
                }}>
                  <strong>Aplikasi:</strong>
                  <br />• Pemantauan dan perencanaan pertanian
                  <br />• Prediksi hasil panen
                  <br />• Deteksi perubahan penggunaan lahan
                  <br />• Praktik pertanian berkelanjutan
                </Typography>

                <Typography variant="body2" sx={{ 
                  color: '#2E7D32',
                  fontSize: '0.9rem',
                  lineHeight: 1.6,
                  fontStyle: 'italic'
                }}>
                  <strong>Catatan:</strong> Modul ini memproses data Sentinel-1 untuk memberikan wawasan tentang pola budidaya padi, membantu petani dan perencana pertanian membuat keputusan yang tepat.
                </Typography>
              </Box>
            </Grid>

           {/* AOI Instructions */}
           <Grid item xs={12}>
              <Box sx={{ 
                padding: '16px', 
                backgroundColor: '#e8f5e8', 
                borderRadius: '12px', 
                mb: 3,
                border: '1px solid #c8e6c9',
                boxShadow: '0 2px 8px rgba(76, 175, 80, 0.1)'
              }}>
                <Typography variant="body2" color="text.secondary" sx={{ 
                  fontSize: '0.85rem',
                  color: '#2E7D32',
                  fontWeight: 500
                }}>
                  <strong>Cara menggunakan:</strong>
                  <br />1. Gunakan tombol "Draw AoI" pada peta untuk memilih area yang diminati
                  <br />2. Isi parameter di bawah ini
                  <br />3. Klik Submit untuk memproses permintaan Anda
                </Typography>
              </Box>
            </Grid>
            
          </Grid>
        )}
      </div>
    </div>
  );
};

export default SidebarComponent;