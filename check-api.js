// Script pour vérifier si l'API est accessible
const axios = require('axios');

const API_URL = 'https://birth-app-6syx.onrender.com';

async function checkApiStatus() {
  try {
    console.log(`Tentative de connexion à ${API_URL}...`);
    const response = await axios.get(API_URL);
    console.log('Statut de la réponse:', response.status);
    console.log('Données reçues:', JSON.stringify(response.data, null, 2));
    return true;
  } catch (error) {
    console.error('Erreur lors de la connexion à l\'API:');
    if (error.response) {
      // La requête a été faite et le serveur a répondu avec un code d'erreur
      console.error('Statut de réponse:', error.response.status);
      console.error('Données d\'erreur:', error.response.data);
    } else if (error.request) {
      // La requête a été faite mais aucune réponse n'a été reçue
      console.error('Aucune réponse reçue du serveur');
    } else {
      // Une erreur s'est produite lors de la configuration de la requête
      console.error('Erreur:', error.message);
    }
    return false;
  }
}

// Vérifier les endpoints principaux
async function checkEndpoints() {
  const endpoints = [
    '/',
    '/api/status',
    '/api/messages',
    '/api/quiz',
    '/api/quiz/results/top'
  ];

  console.log('Vérification des endpoints...');
  
  for (const endpoint of endpoints) {
    try {
      const url = `${API_URL}${endpoint}`;
      console.log(`Tentative d'accès à ${url}...`);
      const response = await axios.get(url);
      console.log(`✅ ${endpoint} - Statut: ${response.status}`);
    } catch (error) {
      console.error(`❌ ${endpoint} - Erreur: ${error.message}`);
      if (error.response) {
        console.error(`   Statut: ${error.response.status}`);
      }
    }
  }
}

// Exécuter les vérifications
(async () => {
  const isApiOnline = await checkApiStatus();
  if (isApiOnline) {
    await checkEndpoints();
  }
  console.log('Vérification terminée.');
})();
