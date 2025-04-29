// Plugin pour configurer l'accès à l'API dans Nuxt
import { getApiUrl } from '../api.config';

export default defineNuxtPlugin((nuxtApp) => {
  const apiUrl = getApiUrl();
  
  // Fonction pour envoyer des requêtes à l'API
  const api = {
    async get(endpoint) {
      const response = await fetch(`${apiUrl}${endpoint}`);
      return await response.json();
    },
    
    async post(endpoint, data) {
      const response = await fetch(`${apiUrl}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      return await response.json();
    },
    
    async put(endpoint, data) {
      const response = await fetch(`${apiUrl}${endpoint}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      return await response.json();
    },
    
    async delete(endpoint) {
      const response = await fetch(`${apiUrl}${endpoint}`, {
        method: 'DELETE',
      });
      return await response.json();
    },
  };
  
  // Rendre l'API disponible dans toute l'application
  nuxtApp.provide('api', api);
});
