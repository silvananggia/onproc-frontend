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
    Tabs
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
import JobListComponent from '../job/JobListComponent'; // Import the JobListComponent
import { useSelector } from 'react-redux';



const WorkspaceComponent = () => {
    const [isVisible, setIsVisible] = useState(true);
    const [tabValue, setTabValue] = useState(0); // State to manage the selected tab

    const dispatch = useDispatch();
    const user = getUserData();

    const [dataDropItem, setdataDropItem] = useState(null);
    const [sign, setSign] = useState('<');
    const [threshold, setThreshold] = useState('0.05');
    const [jobId, setJobId] = useState(null);

    const togglePanel = () => {
        setIsVisible(!isVisible);
    };

    const handleSubmit = async () => {
        const newJobId = uuidv4();
        const jobname = `Burned Area Calculation - ${dataDropItem}`;
        const cpurequired = '1';
        const priority = '1';
        const command = `http://10.27.57.92:5000/burnedarea?data=${dataDropItem}&sign=${sign}&threshold=${threshold}&idproses=${newJobId}`;

        try {
            await dispatch(createJob(newJobId, user.id, jobname, command, cpurequired, priority));
            setJobId(newJobId);

        } catch (error) {
            console.error("Error:", error);
        }
        
        await dispatch( dispatch(setSelectedJob(newJobId)));
    };

    const toggleWorkspace = () => {
        setIsVisible(!isVisible);
    };

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };
    const selectedJobId = useSelector((state) => state.job.selectedJobId); // Get selectedJobId from Redux


    return (
        <div className={`workspace ${isVisible ? '' : 'hidden'}`}>
            <div className='workspace-header'>
                <Typography variant="h4">Workspace</Typography>
            </div>

            <div className='workspace-content'>
                {selectedJobId ? (
                    <JobDetailsComponent jobId={selectedJobId} />
                ) : (
                    <>
                        <Tabs value={tabValue} onChange={handleTabChange}>
                            <Tab label="Processing Task" />
                            <Tab label="Job List" />
                        </Tabs>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                {tabValue === 0 && ( // Show ProcessingTaskComponent when first tab is selected
                                    <ProcessingTaskComponent
                                        dataDropItem={dataDropItem}
                                        setdataDropItem={setdataDropItem}
                                        sign={sign}
                                        setSign={setSign}
                                        threshold={threshold}
                                        setThreshold={setThreshold}
                                        onSubmit={handleSubmit}
                                    />
                                )}
                                {tabValue === 1 && ( // Show JobListComponent when second tab is selected
                                    <JobListComponent />
                                )}
                            </Grid>
                        </Grid>
                    </>
                )}
            </div>
        </div>
    );
};

export default WorkspaceComponent;