import React, { useState } from 'react';
import './Workspace.scss';
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
    Tab,
    Tabs,
    Avatar,
    Menu,
    IconButton,
    Divider,
    TextField
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CloudIcon from '@mui/icons-material/Cloud';
import CloudQueueIcon from '@mui/icons-material/CloudQueue';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import CollectionsComponent from '../stac/CollectionsComponent'; // Adjust the path as necessary
import CloseIcon from '@mui/icons-material/Close';
import { v4 as uuidv4 } from 'uuid';
import { useDispatch } from "react-redux";
import { createJob,setSelectedJob } from '../../actions/jobsActions';
import { getUserData } from "../../utility/Utils";
import JobDetailsComponent from '../job/JobDetailsComponent';
import ProcessingTaskComponent from '../processingbox/ProcessingTaskComponent';
import ModuleComponent from '../module/ModuleComponent';
import JobListComponent from '../job/JobListComponent'; // Import the JobListComponent
import { useSelector } from 'react-redux';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import { logout } from '../../actions/authActions';
import { useNavigate } from 'react-router-dom';

const WorkspaceComponent = ({ aoiCoords = null }) => {
    const [isVisible, setIsVisible] = useState(true);
    const [tabValue, setTabValue] = useState(0); // State to manage the selected tab
    const [profileAnchorEl, setProfileAnchorEl] = useState(null);

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = getUserData();

    const [dataDropItem, setdataDropItem] = useState(null);
    const [sign, setSign] = useState('<');
    const [threshold, setThreshold] = useState('0.05');
    const [jobId, setJobId] = useState(null);

    // Add state variables for rice planting parameters
    const [dateFrom, setDateFrom] = useState(dayjs().subtract(2, 'year'));
    const [dateUntil, setDateUntil] = useState(dayjs());
    const [dateRangeError, setDateRangeError] = useState('');
    const [jarakAntarTanam, setJarakAntarTanam] = useState('8');
    const [ekstremMin, setEkstremMin] = useState('2');
    const [ekstremMax, setEkstremMax] = useState('4');
    const [perbedaanDN, setPerbedaanDN] = useState('0.3');
    const [batasEkstremMin, setBatasEkstremMin] = useState('0.7');
    const [kelasPertumbuhanMin, setKelasPertumbuhanMin] = useState('7');

    const togglePanel = () => {
        setIsVisible(!isVisible);
    };

    const validateDateRange = (from, until) => {
        const diffInYears = until.diff(from, 'year', true);
        if (Math.abs(diffInYears - 2) > 0.1) {
            setDateRangeError('Date range must be exactly 2 years');
        } else {
            setDateRangeError('');
        }
    };

    const handleSubmit = async () => {
        const newJobId = uuidv4();
        const jobname = `Burned Area Calculation - ${dataDropItem}`;
        const cpurequired = '1';
        const priority = '1';
        const command = `${process.env.REACT_APP_PROCESSING_URL}/burnedarea?data=${dataDropItem}&sign=${sign}&threshold=${threshold}&idproses=${newJobId}`;

        try {
            await dispatch(createJob(newJobId, user.username, jobname, command, cpurequired, priority));
            setJobId(newJobId);

        } catch (error) {
            console.error("Error:", error);
        }
        
        await dispatch( dispatch(setSelectedJob(newJobId)));
    };

    const handleRicePlantingSubmit = async () => {
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
        const jobname = `IP Padi - Rice Planting Index`;
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
        
        // Create the command URL with parameters and AOI coordinates
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
        console.log('User:', user.username);
        
        try {
            await dispatch(createJob(newJobId, user.username, jobname, command, cpurequired, priority));
            setJobId(newJobId);
            
            // Switch to Job List tab to show the created job
            setTabValue(1);
            
            // Show success message
            alert('Job created successfully! Check the Job List tab to monitor progress.');
        } catch (error) {
            console.error("Error creating job:", error);
            alert('Error creating job. Please try again.');
        }
    };

    const toggleWorkspace = () => {
        setIsVisible(!isVisible);
    };

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    const handleProfileMenuOpen = (event) => {
        setProfileAnchorEl(event.currentTarget);
    };

    const handleProfileMenuClose = () => {
        setProfileAnchorEl(null);
    };

    const handleLogout = () => {
        dispatch(logout());
        navigate('/');
        handleProfileMenuClose();
    };

    const selectedJobId = useSelector((state) => state.job.selectedJobId); // Get selectedJobId from Redux

    return (
        <div className={`workspace ${isVisible ? '' : 'hidden'}`}>
            <div className='workspace-header' style={{
                background: 'linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%)',
                color: 'white',
                padding: '20px 24px',
                borderRadius: '12px 12px 0 0',
                boxShadow: '0 4px 20px rgba(76, 175, 80, 0.2)',
                marginBottom: '0'
            }}>
                <div style={{ 
                    display: 'flex', 
                    flexDirection: 'column',
                    gap: '20px',
                    width: '100%' 
                }}>
                    {/* Workspace Title Section */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div style={{
                            background: 'rgba(255,255,255,0.2)',
                            borderRadius: '50%',
                            width: '48px',
                            height: '48px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <CloudIcon sx={{ color: 'white', fontSize: '24px' }} />
                        </div>
                        <div>
                            <Typography variant="h4" sx={{ 
                                fontWeight: 600, 
                                color: 'white',
                                margin: 0,
                                fontSize: '1.75rem'
                            }}>
                                Workspace
                            </Typography>
                            <Typography variant="body2" sx={{ 
                                color: 'rgba(255,255,255,0.9)',
                                marginTop: '4px'
                            }}>
                                Manage your processing jobs and workflows
                            </Typography>
                        </div>
                    </div>
                    
                    {/* Profile Section */}
                    <div style={{ 
                        display: 'flex', 
                        justifyContent: 'flex-end',
                        alignItems: 'center'
                    }}>
                        {user ? (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <div style={{
                                    background: 'rgba(255,255,255,0.15)',
                                    padding: '8px 16px',
                                    borderRadius: '20px',
                                    border: '1px solid rgba(255,255,255,0.25)'
                                }}>
                                    <Typography variant="body2" sx={{ 
                                        color: 'rgba(255,255,255,0.95)',
                                        fontWeight: 500
                                    }}>
                                        Welcome, {user.name || user.username}
                                    </Typography>
                                </div>
                                <IconButton
                                    onClick={handleProfileMenuOpen}
                                    sx={{ 
                                        color: 'white',
                                        background: 'rgba(255,255,255,0.15)',
                                        border: '1px solid rgba(255,255,255,0.25)',
                                        '&:hover': {
                                            background: 'rgba(255,255,255,0.25)',
                                            transform: 'scale(1.05)'
                                        },
                                        transition: 'all 0.2s ease'
                                    }}
                                >
                                    <Avatar sx={{ 
                                        width: 36, 
                                        height: 36, 
                                        bgcolor: 'rgba(255,255,255,0.2)',
                                        border: '2px solid rgba(255,255,255,0.3)'
                                    }}>
                                        <PersonIcon sx={{ color: 'white' }} />
                                    </Avatar>
                                </IconButton>
                                <Menu
                                    anchorEl={profileAnchorEl}
                                    open={Boolean(profileAnchorEl)}
                                    onClose={handleProfileMenuClose}
                                    anchorOrigin={{
                                        vertical: 'bottom',
                                        horizontal: 'right',
                                    }}
                                    transformOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                    }}
                                    PaperProps={{
                                        sx: {
                                            mt: 1,
                                            borderRadius: '12px',
                                            boxShadow: '0 8px 32px rgba(76, 175, 80, 0.15)',
                                            border: '1px solid rgba(76, 175, 80, 0.1)'
                                        }
                                    }}
                                >
                                    <Box sx={{ p: 3, minWidth: 240 }}>
                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '12px',
                                            marginBottom: '16px'
                                        }}>
                                            <Avatar sx={{ 
                                                width: 48, 
                                                height: 48, 
                                                bgcolor: '#4CAF50',
                                                border: '3px solid #f0f0f0'
                                            }}>
                                                <PersonIcon />
                                            </Avatar>
                                            <div>
                                                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                                    {user.name || user.username}
                                                </Typography>
                                                <Typography variant="body2" color="textSecondary">
                                                    {user.email || 'No email provided'}
                                                </Typography>
                                            </div>
                                        </div>
                                    </Box>
                                    <Divider />
                                    <Box sx={{ p: 2 }}>
                                        <Button
                                            startIcon={<LogoutIcon />}
                                            onClick={handleLogout}
                                            fullWidth
                                            variant="outlined"
                                            color="error"
                                            sx={{ 
                                                justifyContent: 'flex-start', 
                                                textTransform: 'none',
                                                borderRadius: '8px',
                                                py: 1.5,
                                                '&:hover': {
                                                    background: 'error.main',
                                                    color: 'white'
                                                }
                                            }}
                                        >
                                            Logout
                                        </Button>
                                    </Box>
                                </Menu>
                            </div>
                        ) : (
                            <Button
                                variant="contained"
                                sx={{
                                    background: 'rgba(255,255,255,0.2)',
                                    color: 'white',
                                    border: '1px solid rgba(255,255,255,0.3)',
                                    borderRadius: '24px',
                                    px: 3,
                                    py: 1.5,
                                    textTransform: 'none',
                                    fontWeight: 500,
                                    '&:hover': {
                                        background: 'rgba(255,255,255,0.3)',
                                        transform: 'translateY(-1px)'
                                    },
                                    transition: 'all 0.2s ease'
                                }}
                                onClick={() => navigate('/signin-app')}
                                startIcon={<AccountCircleIcon />}
                            >
                                Login
                            </Button>
                        )}
                    </div>
                </div>
            </div>

            <div className='workspace-content' style={{
                padding: '24px',
                background: '#fafafa',
                borderRadius: '0 0 12px 12px',
                boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
                minHeight: '400px'
            }}>
                {selectedJobId ? (
                    <JobDetailsComponent jobId={selectedJobId} />
                ) : (
                    <>
                        <div style={{
                            background: 'white',
                            borderRadius: '12px',
                            padding: '20px',
                            marginBottom: '24px',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                            border: '1px solid #f0f0f0'
                        }}>
                            <Tabs 
                                value={tabValue} 
                                onChange={handleTabChange}
                                sx={{
                                    '& .MuiTab-root': {
                                        textTransform: 'none',
                                        fontWeight: 500,
                                        fontSize: '1rem',
                                        minHeight: '48px'
                                    },
                                    '& .MuiTabs-indicator': {
                                        height: '3px',
                                        borderRadius: '2px'
                                    }
                                }}
                            >
                                <Tab label="Parameters" />
                                <Tab label="Job List" />
                            </Tabs>
                        </div>
                        
                        <div style={{
                            background: 'white',
                            borderRadius: '12px',
                            padding: '24px',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                            border: '1px solid #f0f0f0'
                        }}>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    {tabValue === 0 && (
                                        <div>
                                            

                                            {/* Date Selection Section */}
                                            <Box sx={{ 
                                                padding: '20px',
                                                background: 'white',
                                                borderRadius: '12px',
                                                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                                                border: '1px solid #f0f0f0',
                                                marginBottom: '20px'
                                            }}>
                                                <div className='title-font' style={{ 
                                                    color: '#2E7D32', 
                                                    fontWeight: 600, 
                                                    marginBottom: '16px',
                                                    fontSize: '1.1rem'
                                                }}>Date Range: </div>
                                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                        <DatePicker
                                                            label="From"
                                                            value={dateFrom}
                                                            onChange={(newValue) => {
                                                                const calculatedDateUntil = newValue.add(2, 'year');
                                                                if (calculatedDateUntil.isAfter(dayjs())) {
                                                                    setDateRangeError('Selected date would result in a future end date. Please choose an earlier start date.');
                                                                    return;
                                                                }
                                                                setDateFrom(newValue);
                                                                setDateUntil(calculatedDateUntil);
                                                                setDateRangeError('');
                                                                validateDateRange(newValue, calculatedDateUntil);
                                                            }}
                                                            maxDate={dayjs().subtract(2, 'year')}
                                                            slotProps={{
                                                                actionBar: {
                                                                    actions: ['today'],
                                                                },
                                                            }}
                                                        />
                                                        <Typography variant='h5' sx={{ color: '#4CAF50', fontWeight: 600 }}> to </Typography>
                                                        <DatePicker
                                                            label="Until"
                                                            value={dateUntil}
                                                            disabled={true}
                                                            slotProps={{
                                                                actionBar: {
                                                                    actions: ['today'],
                                                                },
                                                            }}
                                                        />
                                                    </Box>
                                                    {dateRangeError && (
                                                        <Typography 
                                                            variant="body2" 
                                                            color="error" 
                                                            sx={{ mt: 1, fontSize: '0.75rem' }}
                                                        >
                                                            {dateRangeError}
                                                        </Typography>
                                                    )}
                                                </LocalizationProvider>
                                            </Box>

                                            {/* Processing Parameters Section */}
                                            <Box sx={{ 
                                                padding: '20px',
                                                background: 'white',
                                                borderRadius: '12px',
                                                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                                                border: '1px solid #f0f0f0',
                                                marginBottom: '20px'
                                            }}>
                                                <Typography variant="h6" sx={{ 
                                                    mb: 3, 
                                                    color: '#2E7D32',
                                                    fontWeight: 600,
                                                    fontSize: '1.25rem'
                                                }}>
                                                    Processing Parameters
                                                </Typography>
                                                
                                                <TextField
                                                    label="Jarak Antar Tanam (Days)"
                                                    variant="outlined"
                                                    value={jarakAntarTanam}
                                                    onChange={(e) => setJarakAntarTanam(e.target.value)}
                                                    fullWidth
                                                    helperText="Interval between planting cycles in days"
                                                    type="number"
                                                    inputProps={{ min: 1, max: 365, step: 1 }}
                                                    sx={{ mb: 2 }}
                                                />
                                                
                                                <TextField
                                                    label="Ekstrem Minimum"
                                                    variant="outlined"
                                                    value={ekstremMin}
                                                    onChange={(e) => setEkstremMin(e.target.value)}
                                                    fullWidth
                                                    helperText="Minimum extreme value for vegetation index"
                                                    type="number"
                                                    inputProps={{ min: 1, max: 50, step: 1 }}
                                                    sx={{ mb: 2 }}
                                                />
                                                
                                                <TextField
                                                    label="Ekstrem Maksimum"
                                                    variant="outlined"
                                                    value={ekstremMax}
                                                    onChange={(e) => setEkstremMax(e.target.value)}
                                                    fullWidth
                                                    helperText="Maximum extreme value for vegetation index"
                                                    type="number"
                                                    inputProps={{ min: 1, max: 50, step: 1 }}
                                                    sx={{ mb: 2 }}
                                                />
                                                
                                                <TextField
                                                    label="Perbedaan nilai DN antara maximum dan minimum"
                                                    variant="outlined"
                                                    value={perbedaanDN}
                                                    onChange={(e) => setPerbedaanDN(e.target.value)}
                                                    fullWidth
                                                    helperText="DN value difference threshold between max and min"
                                                    type="number"
                                                    inputProps={{ min: 0, max: 1, step: 0.01 }}
                                                    sx={{ mb: 2 }}
                                                />
                                                
                                                <TextField
                                                    label="Batas Ekstrem Minimum"
                                                    variant="outlined"
                                                    value={batasEkstremMin}
                                                    onChange={(e) => setBatasEkstremMin(e.target.value)}
                                                    fullWidth
                                                    helperText="Minimum extreme boundary threshold"
                                                    type="number"
                                                    inputProps={{ min: 0, max: 1, step: 0.01 }}
                                                    sx={{ mb: 2 }}
                                                />
                                                
                                                <TextField
                                                    label="Kelas Pertumbuhan Minimum"
                                                    variant="outlined"
                                                    value={kelasPertumbuhanMin}
                                                    onChange={(e) => setKelasPertumbuhanMin(e.target.value)}
                                                    fullWidth
                                                    helperText="Minimum growth class threshold"
                                                    type="number"
                                                    inputProps={{ min: 1, max: 50, step: 1 }}
                                                />
                                            </Box>

                                            {/* AOI Status Message */}
                                            <Box sx={{ 
                                                padding: '16px', 
                                                mb: 2,
                                                background: !aoiCoords ? '#fff3cd' : '#d4edda',
                                                borderRadius: '12px',
                                                border: !aoiCoords ? '1px solid #ffeaa7' : '1px solid #c3e6cb',
                                                boxShadow: !aoiCoords ? '0 2px 8px rgba(255, 193, 7, 0.1)' : '0 2px 8px rgba(76, 175, 80, 0.1)'
                                            }}>
                                                {!aoiCoords ? (
                                                    <Typography 
                                                        variant="body2" 
                                                        color="warning.main" 
                                                        sx={{ 
                                                            fontSize: '0.85rem', 
                                                            textAlign: 'center',
                                                            fontWeight: 500
                                                        }}
                                                    >
                                                        ⚠️ Please draw an Area of Interest (AOI) on the map first
                                                    </Typography>
                                                ) : (
                                                    <Typography 
                                                        variant="body2" 
                                                        color="success.main" 
                                                        sx={{ 
                                                            fontSize: '0.85rem', 
                                                            textAlign: 'center',
                                                            fontWeight: 500
                                                        }}
                                                    >
                                                        ✅ AOI Selected: {aoiCoords}
                                                    </Typography>
                                                )}
                                            </Box>

                                            {/* Action Buttons */}
                                            <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
                                                <Button 
                                                    variant="contained" 
                                                    disabled={!aoiCoords}
                                                    sx={{
                                                        background: !aoiCoords ? '#ccc' : 'linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%)',
                                                        color: 'white',
                                                        borderRadius: '12px',
                                                        py: 1.5,
                                                        px: 3,
                                                        fontWeight: 600,
                                                        textTransform: 'none',
                                                        boxShadow: !aoiCoords ? 'none' : '0 4px 12px rgba(76, 175, 80, 0.3)',
                                                        '&:hover': !aoiCoords ? {} : {
                                                            background: 'linear-gradient(135deg, #45a049 0%, #1b5e20 100%)',
                                                            transform: 'translateY(-1px)',
                                                            boxShadow: '0 6px 16px rgba(76, 175, 80, 0.4)'
                                                        },
                                                        transition: 'all 0.2s ease',
                                                        flex: 1,
                                                        cursor: !aoiCoords ? 'not-allowed' : 'pointer'
                                                    }}
                                                    onClick={handleRicePlantingSubmit}
                                                >
                                                    Submit Job
                                                </Button>
                                                <Button 
                                                    variant="outlined" 
                                                    sx={{
                                                        color: '#4CAF50',
                                                        borderColor: '#4CAF50',
                                                        borderRadius: '12px',
                                                        py: 1.5,
                                                        px: 3,
                                                        fontWeight: 500,
                                                        textTransform: 'none',
                                                        minWidth: '100px',
                                                        '&:hover': {
                                                            background: '#4CAF50',
                                                            color: 'white',
                                                            borderColor: '#4CAF50'
                                                        },
                                                        transition: 'all 0.2s ease'
                                                    }}
                                                    onClick={() => {
                                                        setJarakAntarTanam('8');
                                                        setEkstremMin('2');
                                                        setEkstremMax('4');
                                                        setPerbedaanDN('0.3');
                                                        setBatasEkstremMin('0.7');
                                                        setKelasPertumbuhanMin('7');
                                                    }}
                                                >
                                                    Reset
                                                </Button>
                                            </Box>
                                        </div>
                                    )}
                                    {tabValue === 1 && (
                                        <JobListComponent />
                                    )}
                                </Grid>
                            </Grid>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default WorkspaceComponent;
