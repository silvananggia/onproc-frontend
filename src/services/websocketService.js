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

    const backendUrl = process.env.REACT_APP_BACKEND_URL || 'https://geomimo-prototype.brin.go.id';
    console.log('🔌 WebSocket: Connecting to:', backendUrl);
    console.log('🔌 WebSocket: Using path:', '/be/socket.io/');
    
    this.socket = io(backendUrl, {
      path: '/be/socket.io/',
      transports: ['polling', 'websocket'], // Try polling first, then websocket
      autoConnect: true,
      timeout: 20000,
      forceNew: true,
      upgrade: true,
      rememberUpgrade: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000
    });

    this.socket.on('connect', () => {
      console.log('✅ WebSocket: Connected successfully:', this.socket.id);
      console.log('✅ WebSocket: Namespace:', this.socket.nsp);
      this.isConnected = true;
    });

    this.socket.on('disconnect', (reason) => {
      console.log('❌ WebSocket: Disconnected, reason:', reason);
      this.isConnected = false;
    });

    this.socket.on('connect_error', (error) => {
      console.error('❌ WebSocket: Connection error:', error);
      console.error('❌ WebSocket: Error details:', {
        message: error.message,
        description: error.description,
        context: error.context,
        type: error.type
      });
      this.isConnected = false;
    });

    // Add additional error handlers
    this.socket.on('error', (error) => {
      console.error('❌ WebSocket: Socket error:', error);
    });

    this.socket.on('reconnect_error', (error) => {
      console.error('❌ WebSocket: Reconnection error:', error);
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
