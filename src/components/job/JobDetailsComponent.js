import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { getJobById, setSelectedJob } from '../../actions/jobsActions';
import { addWmsLayer } from '../../actions/mapActions';
import { Typography, Box, Button, Chip } from '@mui/material';
import LinearProgress from '@mui/material/LinearProgress';
import useWebSocketJob from '../../hooks/useWebSocketJob';

function LinearProgressWithLabel(props) {
    return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ width: '100%', mr: 1 }}>
                <LinearProgress color="success" {...props} />
            </Box>
            <Box sx={{ minWidth: 35 }}>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {`${Math.round(props.value)}%`}
                </Typography>
            </Box>
        </Box>
    );
}

LinearProgressWithLabel.propTypes = {
    value: PropTypes.number.isRequired,
};

const JobDetailsComponent = ({ jobId }) => {
    const dispatch = useDispatch();
    const jobDetails = useSelector((state) => state.job.jobobj);

    console.log('📊 JobDetailsComponent: Rendering with jobId:', jobId);
    console.log('📊 JobDetailsComponent: jobDetails:', jobDetails);
    console.log('📊 JobDetailsComponent: jobDetails.progress:', jobDetails?.progress);
    console.log('📊 JobDetailsComponent: jobDetails.status:', jobDetails?.status);

    // WebSocket for live updates
    const { isConnected } = useWebSocketJob(jobId);

    useEffect(() => {
        dispatch(getJobById(jobId));
    }, [dispatch, jobId]);

    const handleBack = () => {
        dispatch(setSelectedJob(null));
    };

    // Ambil layer dari results
    const layerName = jobDetails?.results?.[0]?.layer;
    const workspace = jobDetails?.results?.[0]?.workspace || 'test';

    const handleAddWmsLayer = () => {
        if (layerName) {
            dispatch(addWmsLayer(layerName));
        }
    };

    const handleDownloadGeoTIFF = () => {
        if (layerName) {
            const downloadUrl = `${process.env.REACT_APP_GEOSERVER_URL}/${workspace}/wcs?service=WCS&version=2.0.1&request=GetCoverage&CoverageId=${workspace}:${layerName}&format=image/tiff`;
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.setAttribute('download', `${jobDetails.job_name}.tiff`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    if (!jobDetails) {
        return <div>Loading job details...</div>;
    }

    return (
        <div>
            <Button onClick={handleBack} variant="outlined">Back to Job List</Button>
            <Box display="flex" alignItems="center" gap={1} mb={2}>
                <h3 style={{ margin: 0 }}>Job Details</h3>
                <Chip 
                    label={isConnected ? "Live Updates" : "Offline"} 
                    color={isConnected ? "success" : "default"}
                    size="small"
                />
            </Box>

            <Box display="grid" gridTemplateColumns="1fr 2fr" gap={2}>
                <Typography variant="body2" fontWeight="bold">Job Name:</Typography>
                <Typography variant="body2">{jobDetails.job_name}</Typography>

                <Typography variant="body2" fontWeight="bold">Date:</Typography>
                <Typography variant="body2">{new Date(jobDetails.created_at).toLocaleString()}</Typography>

                <Typography variant="body2" fontWeight="bold">Job ID:</Typography>
                <Typography variant="body2">{jobDetails.id}</Typography>

                {(() => {
                    if (jobDetails && jobDetails.command) {
                        const urlParams = new URLSearchParams(jobDetails.command.split('?')[1]);
                        const data = urlParams.get('data');
                        const sign = urlParams.get('sign');
                        const threshold = urlParams.get('threshold');

                        return (
                            <>
                                <Typography variant="body2" fontWeight="bold">Data:</Typography>
                                <Typography variant="body2">{data}</Typography>

                                <Typography variant="body2" fontWeight="bold">Threshold:</Typography>
                                <Typography variant="body2">{sign} {threshold}</Typography>
                            </>
                        );
                    }
                })()}

                <Typography variant="body2" fontWeight="bold">Status:</Typography>
                {jobDetails.status && (
                    <Chip 
                        label={jobDetails.status.toUpperCase()} 
                        color={jobDetails.status === 'finished' ? 'success' : 'primary'} 
                    /> 
                )}

                {jobDetails.status !== 'finished' && (
                    <>
                        <Typography variant="body2" fontWeight="bold">Progress:</Typography>
                        <LinearProgressWithLabel value={jobDetails.progress} />
                    </>
                )}

                <Typography variant="body2" fontWeight="bold">Started:</Typography>
                <Typography variant="body2">
                    {jobDetails.time_start ? new Date(jobDetails.time_start).toLocaleString() : '-'}
                </Typography>

                <Typography variant="body2" fontWeight="bold">Finished:</Typography>
                <Typography variant="body2">
                    {jobDetails.time_finish ? new Date(jobDetails.time_finish).toLocaleString() : '-'}
                </Typography>
            </Box>

            <Box sx={{ mt: 2 }} />

            {layerName && (
                <Box display="flex" flexDirection="column" gap={1}>
                    <Button onClick={handleAddWmsLayer} variant="outlined" fullWidth>
                        Show on Map
                    </Button>
                    <Button onClick={handleDownloadGeoTIFF} variant="outlined" fullWidth>
                        Download GeoTIFF
                    </Button>
                </Box>
            )}
        </div>
    );
};

export default JobDetailsComponent;
