// Script pour démarrer uniquement le serveur backend API
const port = process.env.API_PORT || process.env.PORT || 3001;
const env = process.env.NODE_ENV || 'development';

console.log(`Démarrage du serveur API en mode ${env.toUpperCase()} sur le port ${port}...`);

// Définir explicitement la variable PORT pour le serveur API
process.env.PORT = port;

// Charger le serveur API
require('./server/index'); 