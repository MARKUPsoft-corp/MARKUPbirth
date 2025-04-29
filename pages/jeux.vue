<template>
  <div class="mini-games-page">
    <!-- Icônes flottantes en arrière-plan (comme sur la page quiz) -->
    <div class="floating-icons">
      <div class="floating-icon icon-code"><i class="bi bi-code-slash"></i></div>
      <div class="floating-icon icon-cpu"><i class="bi bi-cpu"></i></div>
      <div class="floating-icon icon-server"><i class="bi bi-server"></i></div>
      <div class="floating-icon icon-database"><i class="bi bi-database"></i></div>
      <div class="floating-icon icon-cloud"><i class="bi bi-cloud"></i></div>
      <div class="floating-icon icon-laptop"><i class="bi bi-laptop"></i></div>
      <div class="floating-icon icon-terminal"><i class="bi bi-terminal"></i></div>
      <div class="floating-icon icon-globe"><i class="bi bi-globe"></i></div>
    </div>
    
    <div class="page-header">
      <!-- Icônes animées du header -->
      <div class="header-icons">
        <div class="header-icon h-icon-1"><i class="bi bi-controller" style="color: rgba(46, 204, 113, 0.8);"></i></div>
        <div class="header-icon h-icon-2"><i class="bi bi-puzzle" style="color: rgba(243, 156, 18, 0.8);"></i></div>
        <div class="header-icon h-icon-3"><i class="bi bi-joystick" style="color: rgba(231, 76, 60, 0.8);"></i></div>
        <div class="header-icon h-icon-4"><i class="bi bi-dice-6" style="color: rgba(155, 89, 182, 0.8);"></i></div>
        <div class="header-icon h-icon-5"><i class="bi bi-trophy" style="color: rgba(52, 152, 219, 0.8);"></i></div>
        <div class="header-icon h-icon-6"><i class="bi bi-lightning" style="color: rgba(241, 196, 15, 0.8);"></i></div>
      </div>
      
      <div class="container">
        <h1 class="section-title">Mini-Jeux Amusants</h1>
        <p class="section-subtitle">Découvrez une collection de mini-jeux divertissants pour célébrer l'anniversaire d'Emmanuel !</p>
      </div>
    </div>
    
    <div class="container">
      <!-- Grille des jeux -->
      <div v-if="!activeGame" class="games-grid">
        <div v-for="game in games" :key="game.id" class="game-card" @click="activeGame = game.id">
          <div class="game-card-header">
            <div class="game-icon">
              <i :class="'bi ' + game.icon"></i>
            </div>
            <h3 class="game-title">{{ game.title }}</h3>
          </div>
          <div class="game-card-content">
            <div class="game-info">
              <p class="game-description">{{ game.description }}</p>
            </div>
            <div class="game-action">
              <button class="play-button">
                <i class="bi bi-controller"></i>
                <span>Jouer</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Jeu actif -->
      <div v-else class="active-game-container">
        <div class="game-nav">
          <button class="back-button" @click="activeGame = null">
            <i class="bi bi-arrow-left"></i>
            Retour aux jeux
          </button>
        </div>
        
        <MemoryGame v-if="activeGame === 'memory'" @game-won="handleGameComplete" />
        <SpeedClickGame v-else-if="activeGame === 'speedclick'" @game-over="handleGameComplete" />
        
        <!-- Placeholder pour le puzzle (à implémenter plus tard) -->
        <div v-else-if="activeGame === 'puzzle'" class="placeholder-game">
          <div class="placeholder-icon">
            <i class="bi bi-grid-3x3"></i>
          </div>
          <h2>Puzzle Coulissant</h2>
          <p>Ce jeu est en cours de développement. Revenez bientôt pour y jouer !</p>
          <button class="back-link" @click="activeGame = null">
            <i class="bi bi-arrow-left"></i>
            Retour aux jeux
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import MemoryGame from '~/components/games/MemoryGame.vue';
import SpeedClickGame from '~/components/games/SpeedClickGame.vue';

// État local
const activeGame = ref(null);

// Données des jeux
const games = ref([
  {
    id: 'memory',
    title: 'Jeu de Mémoire',
    description: 'Retrouvez les paires d\'images liées à Emmanuel pour tester votre mémoire !',
    icon: 'bi-card-image',
    color: 'var(--primary-green)'
  },
  {
    id: 'speedclick',
    title: 'Clics Rapides',
    description: 'Cliquez sur les cadeaux qui apparaissent le plus rapidement possible !',
    icon: 'bi-cursor-fill',
    color: 'var(--primary-orange)'
  },
  {
    id: 'puzzle',
    title: 'Puzzle Coulissant',
    description: 'Reconstituez l\'image en remettant les pièces dans le bon ordre.',
    icon: 'bi-grid-3x3',
    color: 'var(--primary-green)'
  }
]);

// Initialisation
onMounted(() => {
  // Code d'initialisation si nécessaire
});

// Gérer la fin d'un jeu
const handleGameComplete = (result) => {
  console.log('Jeu terminé:', result);
  // Possibilité d'ajouter une notification ou autre action ici
};
</script>

<style scoped>
.mini-games-page {
  position: relative;
  padding-bottom: 5rem;
  min-height: 100vh;
  background: #f9f9f9;
}

.page-header {
  padding: 8rem 0 3rem;
  text-align: center;
  background: #111;
  position: relative;
  overflow: hidden;
  box-shadow: inset 0 -10px 20px rgba(0, 0, 0, 0.2);
  margin-bottom: 3rem;
}

.page-header::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 100%;
  background: radial-gradient(circle at 30% 30%, rgba(46, 204, 113, 0.4), transparent 70%),
              radial-gradient(circle at 70% 60%, rgba(243, 156, 18, 0.4), transparent 70%),
              radial-gradient(circle at 20% 80%, rgba(82, 234, 148, 0.3), transparent 60%),
              radial-gradient(circle at 80% 20%, rgba(214, 137, 16, 0.3), transparent 60%);
  opacity: 0.6;
  pointer-events: none;
}

/* Icônes animées du header */
.header-icons {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
  overflow: hidden;
}

.header-icon {
  position: absolute;
  font-size: 2.8rem;
  opacity: 0.4;
  animation: headerIconFloat 6s ease-in-out infinite;
  filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.2));
}

.h-icon-1 {
  top: 15%;
  left: 8%;
  animation-delay: 0s;
}

.h-icon-2 {
  top: 60%;
  left: 15%;
  animation-delay: 1s;
}

.h-icon-3 {
  top: 25%;
  right: 10%;
  animation-delay: 2s;
}

.h-icon-4 {
  top: 70%;
  right: 15%;
  animation-delay: 1.5s;
}

.h-icon-5 {
  top: 40%;
  left: 25%;
  animation-delay: 0.5s;
}

.h-icon-6 {
  top: 30%;
  right: 25%;
  animation-delay: 2.5s;
}

@keyframes headerIconFloat {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
  }
  50% {
    transform: translateY(-15px) rotate(5deg);
  }
}

/* Effet de lumière pour header */
.page-header::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 150%;
  height: 150%;
  background: radial-gradient(
    ellipse at center,
    rgba(255, 255, 255, 0.05) 0%,
    rgba(0, 0, 0, 0) 70%
  );
  pointer-events: none;
  z-index: 2;
}

.section-title {
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: 800;
  margin-bottom: 1rem;
  color: #333;
  background: linear-gradient(45deg, var(--primary-green), var(--primary-orange));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  position: relative;
  display: inline-block;
  z-index: 10;
}

.section-title::after {
  content: '';
  position: absolute;
  bottom: -0.5rem;
  left: 25%;
  width: 50%;
  height: 3px;
  background: linear-gradient(to right, var(--primary-green), var(--primary-orange));
  border-radius: 3px;
}

.section-subtitle {
  font-size: clamp(1rem, 2vw, 1.2rem);
  max-width: 700px;
  margin: 1rem auto 0;
  color: rgba(255, 255, 255, 0.85);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
  position: relative;
  z-index: 10;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
  width: 100%;
  box-sizing: border-box;
}

/* Icônes flottantes */
.floating-icons {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
  overflow: hidden;
}

.floating-icon {
  position: absolute;
  color: rgba(46, 104, 113, 0.2);
  opacity: 0.6;
  z-index: -1;
  animation-duration: 20s;
  animation-timing-function: ease-in-out;
  animation-iteration-count: infinite;
  animation-name: floating;
}

.floating-icon i {
  display: block;
}

@keyframes floating {
  0% {
    transform: translate(0, 0) rotate(0deg);
  }
  25% {
    transform: translate(10px, 15px) rotate(5deg);
  }
  50% {
    transform: translate(5px, -10px) rotate(-5deg);
  }
  75% {
    transform: translate(-10px, 5px) rotate(3deg);
  }
  100% {
    transform: translate(0, 0) rotate(0deg);
  }
}

/* Positions des icônes flottantes */
.icon-code {
  top: 15%;
  left: 7%;
  font-size: 3.2rem;
  animation-delay: 0s;
  color: rgba(34, 82, 43, 0.25);
}

.icon-cpu {
  top: 35%;
  left: 15%;
  font-size: 2.8rem;
  animation-delay: 3s;
  animation-duration: 25s;
  color: rgba(68, 56, 83, 0.25);
}

.icon-server {
  top: 75%;
  left: 5%;
  font-size: 2.7rem;
  animation-delay: 5s;
  animation-duration: 22s;
  color: rgba(126, 84, 10, 0.25);
}

.icon-database {
  top: 25%;
  right: 10%;
  font-size: 3.3rem;
  animation-delay: 8s;
  color: rgba(54, 78, 114, 0.25);
}

.icon-cloud {
  top: 45%;
  right: 15%;
  font-size: 3rem;
  animation-delay: 2s;
  animation-duration: 18s;
  color: rgba(78, 110, 142, 0.25);
}

.icon-laptop {
  top: 65%;
  right: 5%;
  font-size: 3.4rem;
  animation-delay: 10s;
  animation-duration: 23s;
  color: rgba(42, 95, 87, 0.25);
}

.icon-terminal {
  top: 85%;
  right: 22%;
  font-size: 2.6rem;
  animation-delay: 7s;
  color: rgba(95, 69, 42, 0.25);
}

.icon-globe {
  top: 10%;
  left: 40%;
  font-size: 2.5rem;
  animation-delay: 12s;
  animation-duration: 19s;
  color: rgba(64, 64, 64, 0.3);
}

/* Grille des jeux */
.games-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 2rem;
  margin: 3rem 0;
}

/* Responsive */
@media (max-width: 768px) {
  .page-header {
    padding: 6rem 0 2rem;
  }
  
  .container {
    padding: 0 1rem;
  }
  
  .games-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
}

@media (max-width: 480px) {
  .games-grid {
    margin: 1.5rem 0;
  }
}

/* Styles des cartes de jeu */
.game-card {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  height: 100%;
  border: 1px solid rgba(0, 0, 0, 0.05);
  position: relative;
}

.game-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.15);
  border-color: rgba(0, 0, 0, 0.1);
}

.game-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 5px;
  background: linear-gradient(90deg, var(--primary-green), var(--primary-orange));
  z-index: 5;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.game-card:hover::before {
  opacity: 1;
}

.game-card-header {
  padding: 1.8rem;
  color: white;
  position: relative;
  display: flex;
  align-items: center;
  gap: 1.2rem;
  background: linear-gradient(135deg, var(--primary-green), var(--primary-orange));
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.game-card-header::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.2));
  pointer-events: none;
}

.game-icon {
  width: 64px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.25);
  border-radius: 50%;
  font-size: 1.8rem;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
  position: relative;
  z-index: 5;
  border: 2px solid rgba(255, 255, 255, 0.3);
}

.game-card:hover .game-icon {
  transform: scale(1.1) rotate(5deg);
  background: rgba(255, 255, 255, 0.35);
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.2);
}

.game-title {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
  line-height: 1.3;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  position: relative;
  z-index: 5;
  letter-spacing: 0.5px;
}

.game-card-content {
  padding: 2rem;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  justify-content: space-between;
  background: linear-gradient(to bottom, 
    rgba(249, 249, 249, 0.7), 
    rgba(255, 255, 255, 1));
}

.game-info {
  flex-grow: 1;
}

.game-description {
  color: #444;
  margin-bottom: 2rem;
  line-height: 1.6;
  font-size: 1.05rem;
  position: relative;
  padding-left: 1rem;
  border-left: 3px solid rgba(46, 204, 113, 0.3);
}

.game-description::before {
  content: '"';
  position: absolute;
  top: -0.5rem;
  left: -0.5rem;
  font-size: 2rem;
  color: rgba(46, 204, 113, 0.3);
  font-family: serif;
  opacity: 0.7;
}

.game-action {
  text-align: center;
  margin-top: 1rem;
  position: relative;
}

.game-action::before {
  content: '';
  position: absolute;
  top: -1rem;
  left: 25%;
  width: 50%;
  height: 1px;
  background: linear-gradient(to right, 
    rgba(46, 204, 113, 0.05), 
    rgba(46, 204, 113, 0.2), 
    rgba(46, 204, 113, 0.05));
}

.play-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.7rem;
  padding: 1rem 1.8rem;
  background: linear-gradient(45deg, var(--primary-green), var(--primary-orange));
  color: white;
  border: none;
  border-radius: 50px;
  font-weight: 600;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  width: 100%;
  position: relative;
  overflow: hidden;
  letter-spacing: 0.5px;
  text-transform: uppercase;
}

.play-button span {
  position: relative;
  z-index: 5;
}

.play-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, 
    rgba(255, 255, 255, 0) 0%, 
    rgba(255, 255, 255, 0.3) 50%, 
    rgba(255, 255, 255, 0) 100%);
  transition: left 0.5s ease;
}

.play-button:hover::before {
  left: 100%;
}

.play-button:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(46, 204, 113, 0.3);
}

.play-button i {
  font-size: 1.3rem;
  transition: transform 0.3s ease;
  filter: drop-shadow(0 2px 3px rgba(0, 0, 0, 0.2));
  position: relative;
  z-index: 5;
}

.play-button:hover i {
  transform: rotate(10deg) scale(1.1);
}

/* Styles pour le jeu actif */
.active-game-container {
  max-width: 800px;
  margin: 0 auto;
  background: white;
  border-radius: 16px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

.game-nav {
  display: flex;
  justify-content: space-between;
  padding: 1rem 1.5rem;
  background: #f8f9fa;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.back-button {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: #f1f1f1;
  border: none;
  border-radius: 50px;
  color: #555;
  font-weight: 500;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.back-button:hover {
  background: #e4e4e4;
  transform: translateY(-2px);
}

/* Placeholder pour les jeux en développement */
.placeholder-game {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 2rem;
  text-align: center;
  height: 400px;
}

.placeholder-icon {
  width: 80px;
  height: 80px;
  margin-bottom: 1.5rem;
  background: linear-gradient(135deg, var(--primary-green), var(--primary-orange));
  color: white;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 2.5rem;
  opacity: 0.7;
}

.placeholder-game h2 {
  font-size: 2rem;
  margin-bottom: 1rem;
  color: #333;
}

.placeholder-game p {
  color: #666;
  margin-bottom: 1.5rem;
  max-width: 450px;
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.8rem 1.5rem;
  background: linear-gradient(45deg, var(--primary-green), var(--primary-orange));
  color: white;
  border: none;
  border-radius: 50px;
  font-weight: 500;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.back-link:hover {
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(46, 204, 113, 0.2);
}
</style> 