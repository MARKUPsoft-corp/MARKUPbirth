// Configuration globale de l'API pour toute l'application
window.__FORCE_API_URL__ = 'https://birth-app-6syx.onrender.com';
window.__SOCKET_URL__ = 'https://birth-app-6syx.onrender.com';
window.__DEV_MODE__ = false;

// Override fetch globalement pour rediriger les appels localhost
const originalFetch = window.fetch;
window.fetch = function(url, options) {
  if (typeof url === 'string') {
    // Remplacer TOUTES les URL localhost
    if (url.includes('localhost:3001') || url.includes('localhost:3000/api')) {
      console.log(`[API CONFIG] Redirection fetch: ${url} -> ${window.__FORCE_API_URL__}`);
      const newUrl = url.replace(/http:\/\/localhost:[0-9]+/, window.__FORCE_API_URL__);
      return originalFetch(newUrl, options);
    }
  }
  return originalFetch(url, options);
};

console.log('[API CONFIG] Configuration forcée chargée - Toutes les requêtes API utiliseront:', window.__FORCE_API_URL__);
