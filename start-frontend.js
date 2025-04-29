// Script pour démarrer uniquement le frontend Nuxt
const { spawn } = require('child_process');

// Déterminer si nous sommes en mode production
const isProd = process.env.NODE_ENV === 'production';
const port = process.env.PORT || 3000;

console.log(`Démarrage du serveur frontend Nuxt en mode ${isProd ? 'PRODUCTION' : 'DÉVELOPPEMENT'} sur le port ${port}...`);

// Choisir la commande Nuxt en fonction du mode
const command = isProd ? 'node' : 'npx';
const args = isProd ? ['.output/server/index.mjs'] : ['nuxt', 'dev'];

const nuxt = spawn(command, args, {
  stdio: 'inherit',
  shell: true,
  env: { ...process.env, PORT: port }
});

// Capturer les erreurs
nuxt.on('error', (error) => {
  console.error('Erreur lors du démarrage de Nuxt:', error);
});

// Gérer la terminaison propre
process.on('SIGINT', () => {
  console.log('Arrêt du serveur frontend...');
  if (nuxt.pid) {
    process.kill(nuxt.pid);
  }
  process.exit(0);
}); 