import { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { updateJobStatus, updateJobProgress } from '../actions/jobsActions';
import websocketService from '../services/websocketService';

const useWebSocketJob = (jobId) => {
  const dispatch = useDispatch();
  const isConnectedRef = useRef(false);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!jobId) return;

    // Connect to WebSocket if not already connected
    console.log('🔌 WebSocket: Checking connection status...');
    if (!websocketService.getConnectionStatus()) {
      console.log('🔌 WebSocket: Not connected, connecting...');
      websocketService.connect();
    } else {
      console.log('🔌 WebSocket: Already connected');
    }

    // Set up connection status listener
    const handleConnectionChange = () => {
      const connected = websocketService.getConnectionStatus();
      console.log('🔌 WebSocket: Connection status changed:', connected);
      setIsConnected(connected);
    };

    // Listen for connection events
    websocketService.on('connect', handleConnectionChange);
    websocketService.on('disconnect', handleConnectionChange);

    // Join the job room
    console.log('🏠 WebSocket: Joining job room:', jobId);
    websocketService.joinJobRoom(jobId);
    isConnectedRef.current = true;
    setIsConnected(websocketService.getConnectionStatus());

    // Set up job update listener
    const handleJobUpdate = (data) => {
      console.log('🔔 WebSocket: Received job update:', data);
      console.log('🔔 WebSocket: Current jobId:', jobId);
      console.log('🔔 WebSocket: Update jobId:', data.jobId);
      console.log('🔔 WebSocket: Match?', data.jobId === jobId);
      
      if (data.jobId === jobId) {
        console.log('✅ WebSocket: Dispatching job update to Redux store');
        console.log('✅ WebSocket: Status:', data.status, 'Progress:', data.progress);
        // Update job status and progress
        dispatch(updateJobStatus(data.jobId, data.status, data.progress));
      } else {
        console.log('❌ WebSocket: Job ID mismatch, ignoring update');
      }
    };

    websocketService.onJobUpdate(handleJobUpdate);

    // Cleanup function
    return () => {
      if (isConnectedRef.current) {
        websocketService.leaveJobRoom(jobId);
        websocketService.offJobUpdate(handleJobUpdate);
        websocketService.off('connect', handleConnectionChange);
        websocketService.off('disconnect', handleConnectionChange);
        isConnectedRef.current = false;
      }
    };
  }, [jobId, dispatch]);

  // Return connection status
  return {
    isConnected,
  };
};

export default useWebSocketJob;
