// Plugin pour configurer Socket.IO dans Nuxt
import { io } from 'socket.io-client';
import { getApiUrl, getSocketConfig } from '../api.config';

export default defineNuxtPlugin((nuxtApp) => {
  // TOUJOURS utiliser l'URL Render en production
  let socketUrl = 'https://birth-app-6syx.onrender.com';
  
  // En développement local uniquement, utiliser localhost
  if (typeof window !== 'undefined' && 
      !window.location.hostname.includes('netlify') && 
      window.location.hostname.includes('localhost') && 
      process.env.NODE_ENV !== 'production') {
    socketUrl = 'http://localhost:3001';
  } else {
    // Force l'URL Render dans tous les autres cas
    socketUrl = 'https://birth-app-6syx.onrender.com';
  }
  
  console.log(`Connexion Socket.IO à: ${socketUrl}`);
  
  // Configurer Socket.IO avec l'URL forcée
  const socket = io(socketUrl, {
    transports: ['websocket', 'polling'],
    autoConnect: true
  });
  
  // Rendre le socket disponible dans toute l'application
  nuxtApp.provide('socket', socket);
  
  // Déconnexion propre lors de la fermeture
  nuxtApp.hook('app:beforeMount', () => {
    if (!socket.connected) {
      socket.connect();
    }
  });
  
  nuxtApp.hook('app:unmount', () => {
    if (socket.connected) {
      socket.disconnect();
    }
  });
});
