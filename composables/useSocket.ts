import { io, Socket } from 'socket.io-client';
import { useRuntimeConfig } from 'nuxt/app';
import { ref } from 'vue';

let socket: Socket | null = null;
const isConnected = ref(false);

export const useSocket = () => {
  const config = useRuntimeConfig();
  const apiBaseUrl = config.public.apiBaseUrl as string;
  
  /**
   * Initialize the socket connection
   */
  const initSocket = () => {
    if (!socket) {
      socket = io(apiBaseUrl);
      
      socket.on('connect', () => {
        console.log('Socket connected');
        isConnected.value = true;
      });
      
      socket.on('disconnect', () => {
        console.log('Socket disconnected');
        isConnected.value = false;
      });
    }
    
    return socket;
  };
  
  /**
   * Join a room
   */
  const joinRoom = (room: string) => {
    if (!socket) {
      initSocket();
    }
    
    socket?.emit('join', room);
  };
  
  /**
   * Listen for an event
   */
  const on = (event: string, callback: (...args: any[]) => void) => {
    if (!socket) {
      initSocket();
    }
    
    socket?.on(event, callback);
    
    // Return a function to unsubscribe
    return () => {
      socket?.off(event, callback);
    };
  };
  
  /**
   * Emit an event
   */
  const emit = (event: string, ...args: any[]) => {
    if (!socket) {
      initSocket();
    }
    
    socket?.emit(event, ...args);
  };
  
  /**
   * Disconnect the socket
   */
  const disconnect = () => {
    if (socket) {
      socket.disconnect();
      socket = null;
      isConnected.value = false;
    }
  };
  
  return {
    socket: initSocket(),
    isConnected,
    joinRoom,
    on,
    emit,
    disconnect,
  };
}; 