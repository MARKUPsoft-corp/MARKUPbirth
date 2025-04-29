// Plugin pour forcer l'URL de l'API en production
export default defineNuxtPlugin((nuxtApp) => {
  if (typeof window !== 'undefined') {
    // Force le remplacement des URL localhost par l'URL Render en production
    const originalFetch = window.fetch;
    window.fetch = function(url, options) {
      if (typeof url === 'string') {
        // Remplacer les URL localhost par l'URL Render
        if (url.includes('localhost:3001')) {
          const newUrl = url.replace('http://localhost:3001', 'https://birth-app-6syx.onrender.com');
          console.log(`Redirection de ${url} vers ${newUrl}`);
          return originalFetch(newUrl, options);
        }
      }
      return originalFetch(url, options);
    };

    // Forcer l'URL pour Socket.io également
    window.__force_api_url = 'https://birth-app-6syx.onrender.com';
    
    console.log('Plugin force-api-url activé : redirection des requêtes vers Render');
  }
});
