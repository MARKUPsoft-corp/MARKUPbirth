// Configuration de l'API pour différents environnements

// Obtenir l'URL de l'API en fonction de l'environnement
export function getApiUrl() {
  // Sur Netlify, TOUJOURS utiliser l'URL Render, pas localhost
  if (typeof window !== 'undefined') {
    // Code côté client - vérifier si nous sommes sur netlify
    if (window.location.hostname.includes('netlify.app')) {
      return 'https://birth-app-6syx.onrender.com';
    }
  }

  // En production (sur Netlify), utiliser l'URL de l'API sur Render
  if (process.env.NODE_ENV === 'production') {
    return 'https://birth-app-6syx.onrender.com';
  }
  
  // En développement local, utiliser localhost
  return 'http://localhost:3001';
}

// Configuration pour les requêtes Socket.IO
export function getSocketConfig() {
  return {
    url: getApiUrl(),
    options: {
      transports: ['websocket', 'polling'],
      autoConnect: true
    }
  };
}
