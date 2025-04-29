// Plugin pour configurer Socket.IO dans Nuxt
import { io } from 'socket.io-client';
import { getApiUrl, getSocketConfig } from '../api.config';

export default defineNuxtPlugin((nuxtApp) => {
  const socketConfig = getSocketConfig();
  const socket = io(socketConfig.url, socketConfig.options);
  
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
