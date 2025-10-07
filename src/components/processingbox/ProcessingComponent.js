import React, { useState, useEffect } from 'react';
import './Processing.scss';
import {
    Typography,
    Grid,
    Box,
    Button,
    TextField,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { v4 as uuidv4 } from 'uuid';
import { useDispatch } from "react-redux";
import { createJob } from '../../actions/jobsActions';
import { getUserData } from "../../utility/Utils";
import ProcessingTaskComponent from './ProcessingTaskComponent';
import { getJobById, setSelectedJob } from '../../actions/jobsActions'; // Import the action
import JobDetailComponent from '../job/JobDetailsComponent'; // Import your JobDetailComponent
import useWebSocketJob from '../../hooks/useWebSocketJob';

const ProcessingComponent = () => {
    const dispatch = useDispatch();
    const user = getUserData();
    
    const [isVisible, setIsVisible] = useState(true);
    const [dataDropItem, setdataDropItem] = useState(null);
    const [sign, setSign] = useState('<');
    const [threshold, setThreshold] = useState('0.05');
    const [jobId, setJobId] = useState(null);
    
    // Use WebSocket hook for real-time updates when jobId is available
    const { isConnected } = useWebSocketJob(jobId);

    const togglePanel = () => {
        setIsVisible(!isVisible);
    };

    const handleJobSelect = (jobId) => {
        dispatch(getJobById(jobId));
        dispatch(setSelectedJob(jobId)); // Dispatch the action
    };

    const handleSubmit = async () => {
        const newJobId = uuidv4();
        const jobname = `Burned Area Calculation - ${dataDropItem}`;
        const cpurequired = '1';
        const priority = '1';
        const command = `${process.env.REACT_APP_PROCESSING_URL}/burnedarea?data=${dataDropItem}&sign=${sign}&threshold=${threshold}&idproses=${newJobId}`;
        
        // Set timestamps
        const timeStart = new Date().toISOString();
        const timeFinish = null; // Will be set when job completes
        
        console.log('🕐 Job Creation Timestamps:');
        console.log('  - Job ID:', newJobId);
        console.log('  - Time Start:', timeStart);
        console.log('  - Time Finish:', timeFinish);
        console.log('  - User:', user.username);
        
        try {
            await dispatch(createJob(newJobId, user.username, jobname, command, cpurequired, priority, timeStart, timeFinish));
            setJobId(newJobId); // Set jobId state
         
            await dispatch(setSelectedJob(newJobId)); // Dispatch the action
            await dispatch(getJobById(newJobId));
        } catch (error) {
            console.error("Error:", error);
        }
    };

    return (
        <div className="button-container">
            <div className={`processing-panel ${isVisible ? '' : 'hidden'}`}>
                <div className='panel-header'>
                    <Typography variant="body1" style={{ flexGrow: 1 }}>Processing Burned Area</Typography>
                    <div className='circle-background' style={{ marginLeft: 'auto' }}>
                        <CloseIcon
                            onClick={togglePanel}
                            style={{ color: 'white', fontSize: '20px' }}
                        />
                    </div>
                </div>

                <div className='panel-content'>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <ProcessingTaskComponent
                                dataDropItem={dataDropItem}
                                setdataDropItem={setdataDropItem}
                                sign={sign}
                                setSign={setSign}
                                threshold={threshold}
                                setThreshold={setThreshold}
                                onSubmit={handleSubmit}
                            />
                        </Grid>
                    </Grid>
                </div>
            </div>
          
        </div>
    );
};

export default ProcessingComponent;
