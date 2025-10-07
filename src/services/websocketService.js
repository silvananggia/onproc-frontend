import { io } from 'socket.io-client';

class WebSocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
    this.listeners = new Map();
  }

  connect() {
    if (this.socket && this.isConnected) {
      console.log('🔌 WebSocket: Already connected, skipping');
      return;
    }

    const backendUrl = process.env.REACT_APP_BACKEND_URL || 'https://geomimo-prototype.brin.go.id/be';
    console.log('🔌 WebSocket: Connecting to:', backendUrl);
    
    this.socket = io(backendUrl, {
      path: '/be/socket.io/',
      transports: ['websocket', 'polling'],
      autoConnect: true,
      timeout: 20000,
      forceNew: true
    });

    this.socket.on('connect', () => {
      console.log('✅ WebSocket: Connected successfully:', this.socket.id);
      this.isConnected = true;
    });

    this.socket.on('disconnect', (reason) => {
      console.log('❌ WebSocket: Disconnected, reason:', reason);
      this.isConnected = false;
    });

    this.socket.on('connect_error', (error) => {
      console.error('❌ WebSocket: Connection error:', error);
      this.isConnected = false;
    });

    this.socket.on('reconnect', (attemptNumber) => {
      console.log('🔄 WebSocket: Reconnected after', attemptNumber, 'attempts');
      this.isConnected = true;
    });

    this.socket.on('reconnect_error', (error) => {
      console.error('❌ WebSocket: Reconnection error:', error);
    });

    this.socket.on('reconnect_failed', () => {
      console.error('❌ WebSocket: Reconnection failed');
      this.isConnected = false;
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  joinJobRoom(jobId) {
    if (this.socket && this.isConnected) {
      console.log(`🏠 WebSocket: Joining job room: ${jobId}`);
      this.socket.emit('join-job', jobId);
      console.log(`✅ WebSocket: Joined job room: ${jobId}`);
    } else {
      console.log(`❌ WebSocket: Cannot join job room ${jobId} - not connected`);
    }
  }

  leaveJobRoom(jobId) {
    if (this.socket && this.isConnected) {
      this.socket.emit('leave-job', jobId);
      console.log(`Left job room: ${jobId}`);
    }
  }

  onJobUpdate(callback) {
    if (this.socket) {
      this.socket.on('job-update', callback);
    }
  }

  offJobUpdate(callback) {
    if (this.socket) {
      this.socket.off('job-update', callback);
    }
  }

  // Generic event listener
  on(event, callback) {
    if (this.socket) {
      this.socket.on(event, callback);
    }
  }

  // Remove event listener
  off(event, callback) {
    if (this.socket) {
      this.socket.off(event, callback);
    }
  }

  // Emit event
  emit(event, data) {
    if (this.socket && this.isConnected) {
      this.socket.emit(event, data);
    }
  }

  getConnectionStatus() {
    return this.isConnected;
  }
}

// Create a singleton instance
const websocketService = new WebSocketService();

export default websocketService;
