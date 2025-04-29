// Plugin pour configurer Socket.IO dans Nuxt
import { io } from 'socket.io-client';
import { getApiUrl, getSocketConfig } from '../api.config';

export default defineNuxtPlugin((nuxtApp) => {
  // Déterminer l'URL du serveur Socket.IO
  let socketUrl = 'https://birth-app-6syx.onrender.com';
  
  // En développement local uniquement, utiliser localhost
  if (typeof window !== 'undefined' && 
      !window.location.hostname.includes('netlify') && 
      process.env.NODE_ENV !== 'production') {
    socketUrl = 'http://localhost:3001';
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
