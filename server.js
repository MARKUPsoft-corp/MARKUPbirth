const { spawn } = require('child_process');

// Démarrer le backend API sur le port 3001
console.log('Démarrage du serveur API sur le port 3001...');
const backend = spawn('node', ['start-backend.js'], {
  stdio: 'inherit',
  shell: true
});

// Attendre un peu pour que le serveur API démarre complètement
setTimeout(() => {
  // Démarrer le frontend Nuxt sur le port 3000
  console.log('Démarrage du serveur frontend Nuxt sur le port 3000...');
  const frontend = spawn('node', ['start-frontend.js'], {
    stdio: 'inherit',
    shell: true
  });

  // Gérer les erreurs du frontend
  frontend.on('error', (error) => {
    console.error('Erreur lors du démarrage du frontend:', error);
  });

  // Gérer la terminaison propre
  process.on('SIGINT', () => {
    console.log('Arrêt des serveurs...');
    
    if (backend.pid) {
      process.kill(backend.pid);
    }
    
    if (frontend.pid) {
      process.kill(frontend.pid);
    }
    
    process.exit(0);
  });
}, 2000);

// Gérer les erreurs du backend
backend.on('error', (error) => {
  console.error('Erreur lors du démarrage du backend:', error);
});

console.log('Serveurs en cours de démarrage : Frontend (port 3000), Backend (port 3001)');
console.log('Appuyez sur Ctrl+C pour arrêter les deux serveurs'); 