// Configuration de l'API pour différents environnements

// Obtenir l'URL de l'API en fonction de l'environnement
export function getApiUrl() {
  // En production (sur Netlify), utiliser l'URL de l'API sur Render
  if (process.env.NODE_ENV === 'production') {
    return process.env.API_URL || 'https://birth-app.onrender.com';
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
