// Script pour démarrer uniquement le frontend Nuxt
const { spawn } = require('child_process');

console.log('Démarrage du serveur frontend Nuxt...');
const nuxt = spawn('npx', ['nuxt', 'dev'], {
  stdio: 'inherit',
  shell: true
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