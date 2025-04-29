<template>
  <div class="speed-click-game">
    <div class="game-header">
      <div class="game-stats">
        <div class="stat-item">
          <i class="bi bi-hand-index-thumb"></i>
          <span>Score : {{ score }}</span>
        </div>
        <div class="stat-item">
          <i class="bi bi-stopwatch"></i>
          <span>Temps : {{ timeLeft }}s</span>
        </div>
      </div>
      <button v-if="!gameStarted && !gameOver" class="start-button" @click="startGame">
        <i class="bi bi-play-fill"></i>
        Commencer
      </button>
      <button v-if="gameOver" class="reset-button" @click="resetGame">
        <i class="bi bi-arrow-repeat"></i>
        Recommencer
      </button>
    </div>
    
    <div v-if="!gameStarted && !gameOver" class="start-screen">
      <div class="start-icon">
        <i class="bi bi-cursor-fill"></i>
      </div>
      <h2>Clics Rapides</h2>
      <p>Cliquez sur les cadeaux qui apparaissent le plus rapidement possible ! Vous avez {{ gameDuration }} secondes.</p>
      <button class="play-button" @click="startGame">
        <i class="bi bi-play-fill"></i>
        Commencer
      </button>
    </div>
    
    <div v-else-if="gameOver" class="game-over-screen">
      <div class="result-icon">
        <i class="bi bi-trophy"></i>
      </div>
      <h2>Temps écoulé !</h2>
      <p>Votre score final est de <strong>{{ score }}</strong> points.</p>
      <p class="score-message">{{ getScoreMessage() }}</p>
      <button class="play-again-button" @click="resetGame">
        <i class="bi bi-arrow-repeat"></i>
        Rejouer
      </button>
    </div>
    
    <div v-else class="game-board">
      <div 
        v-for="(target, index) in targets" 
        :key="index" 
        class="target"
        :style="{ 
          left: target.x + '%', 
          top: target.y + '%',
          transform: `scale(${target.scale})`,
          backgroundColor: target.color 
        }"
        @click="clickTarget(index)"
      >
        <i :class="'bi ' + target.icon"></i>
      </div>
      
      <div class="time-progress">
        <div class="progress-bar" :style="{ width: (timeLeft / gameDuration * 100) + '%' }"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';

const props = defineProps({
  difficulty: {
    type: String,
    default: 'medium' // easy, medium, hard
  }
});

const emit = defineEmits(['game-over']);

// Configuration selon la difficulté
const difficultyConfig = {
  easy: {
    targetCount: 3,
    spawnRate: 1500, // ms
    duration: 40
  },
  medium: {
    targetCount: 4,
    spawnRate: 1200,
    duration: 30
  },
  hard: {
    targetCount: 5,
    spawnRate: 900,
    duration: 20
  }
};

// Variables de jeu
const gameStarted = ref(false);
const gameOver = ref(false);
const score = ref(0);
const timeLeft = ref(0);
const targets = ref([]);
const config = computed(() => difficultyConfig[props.difficulty] || difficultyConfig.medium);
const gameDuration = computed(() => config.value.duration);

// Timers
let gameTimer = null;
let spawnTimer = null;

// Icônes et couleurs possibles
const possibleIcons = [
  { icon: 'bi-gift', color: '#e74c3c' },
  { icon: 'bi-balloon-heart', color: '#9b59b6' },
  { icon: 'bi-cake', color: '#f39c12' },
  { icon: 'bi-star-fill', color: '#f1c40f' },
  { icon: 'bi-emoji-smile', color: '#3498db' },
  { icon: 'bi-cup-hot', color: '#e67e22' }
];

// Démarrer le jeu
const startGame = () => {
  gameStarted.value = true;
  gameOver.value = false;
  score.value = 0;
  timeLeft.value = config.value.duration;
  targets.value = [];
  
  // Démarrer le timer principal
  gameTimer = setInterval(() => {
    timeLeft.value--;
    if (timeLeft.value <= 0) {
      endGame();
    }
  }, 1000);
  
  // Démarrer le timer de spawn des cibles
  spawnTargets();
};

// Générer des cibles
const spawnTargets = () => {
  if (spawnTimer) clearInterval(spawnTimer);
  
  spawnTimer = setInterval(() => {
    // Limiter le nombre de cibles à l'écran
    if (targets.value.length < config.value.targetCount) {
      const randomIcon = possibleIcons[Math.floor(Math.random() * possibleIcons.length)];
      
      targets.value.push({
        x: Math.random() * 85, // position X (%)
        y: Math.random() * 85, // position Y (%)
        scale: 0.8 + Math.random() * 0.7, // taille
        icon: randomIcon.icon,
        color: randomIcon.color,
        createdAt: Date.now()
      });
    }
    
    // Supprimer les cibles trop anciennes
    const now = Date.now();
    targets.value = targets.value.filter(target => now - target.createdAt < 2500);
  }, config.value.spawnRate);
};

// Cliquer sur une cible
const clickTarget = (index) => {
  // Incrémenter le score
  score.value++;
  
  // Supprimer la cible
  targets.value.splice(index, 1);
  
  // Ajouter une nouvelle cible immédiatement
  const randomIcon = possibleIcons[Math.floor(Math.random() * possibleIcons.length)];
  
  targets.value.push({
    x: Math.random() * 85,
    y: Math.random() * 85,
    scale: 0.8 + Math.random() * 0.7,
    icon: randomIcon.icon,
    color: randomIcon.color,
    createdAt: Date.now()
  });
};

// Fin du jeu
const endGame = () => {
  gameStarted.value = false;
  gameOver.value = true;
  
  if (gameTimer) clearInterval(gameTimer);
  if (spawnTimer) clearInterval(spawnTimer);
  
  emit('game-over', { score: score.value });
};

// Réinitialiser le jeu
const resetGame = () => {
  gameStarted.value = false;
  gameOver.value = false;
  score.value = 0;
  timeLeft.value = config.value.duration;
  targets.value = [];
};

// Obtenir un message selon le score
const getScoreMessage = () => {
  if (score.value === 0) return "Essayez encore, vous pouvez faire mieux !";
  if (score.value < 10) return "Pas mal pour un début !";
  if (score.value < 20) return "Vous avez de bons réflexes !";
  if (score.value < 30) return "Impressionnant !";
  return "Vous êtes incroyablement rapide !";
};

// Nettoyage
onUnmounted(() => {
  if (gameTimer) clearInterval(gameTimer);
  if (spawnTimer) clearInterval(spawnTimer);
});
</script>

<style scoped>
.speed-click-game {
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  padding: 1rem 1.5rem 2rem;
  position: relative;
}

.game-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding: 1.2rem;
  background: linear-gradient(to right, rgba(243, 156, 18, 0.1), rgba(46, 204, 113, 0.1));
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.03);
  border: 1px solid rgba(243, 156, 18, 0.1);
  position: relative;
}

.game-header::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 100%;
  background: linear-gradient(to bottom, var(--primary-orange), var(--primary-green));
  border-radius: 12px 0 0 12px;
}

.game-stats {
  display: flex;
  gap: 2rem;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  font-weight: 600;
  color: #444;
  font-size: 1.05rem;
}

.stat-item i {
  color: var(--primary-orange);
  font-size: 1.4rem;
  filter: drop-shadow(0 2px 3px rgba(243, 156, 18, 0.2));
}

.start-button, .reset-button, .play-button, .play-again-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.7rem;
  padding: 0.7rem 1.4rem;
  border: none;
  border-radius: 50px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.start-button, .play-button, .play-again-button {
  background: linear-gradient(45deg, var(--primary-orange), var(--primary-green));
  color: white;
  padding: 0.9rem 1.8rem;
  box-shadow: 0 5px 15px rgba(243, 156, 18, 0.15);
  position: relative;
  overflow: hidden;
  font-size: 1.05rem;
}

.start-button::before, .play-button::before, .play-again-button::before {
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

.start-button:hover::before, .play-button:hover::before, .play-again-button:hover::before {
  left: 100%;
}

.reset-button {
  background: rgba(255, 255, 255, 0.7);
  border: 1px solid rgba(243, 156, 18, 0.2);
  color: #444;
  font-size: 0.95rem;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.05);
}

.start-button:hover, .play-button:hover, .play-again-button:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(243, 156, 18, 0.25);
}

.reset-button:hover {
  background: rgba(255, 255, 255, 0.9);
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(243, 156, 18, 0.15);
  color: var(--primary-orange);
}

.start-button i, .play-button i, .play-again-button i, .reset-button i {
  font-size: 1.2rem;
  transition: transform 0.3s ease;
}

.start-button:hover i, .play-button:hover i, .play-again-button:hover i {
  transform: scale(1.1);
}

.reset-button:hover i {
  transform: rotate(45deg);
}

.game-board {
  height: 400px;
  background: linear-gradient(to bottom, 
    rgba(255, 255, 255, 1), 
    rgba(249, 249, 249, 0.7));
  border-radius: 16px;
  position: relative;
  overflow: hidden;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.06);
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.target {
  position: absolute;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  font-size: 1.8rem;
  cursor: pointer;
  transform-origin: center;
  transition: transform 0.2s;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  animation: popIn 0.3s ease-out;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.target i {
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
}

.target:hover {
  transform: scale(1.1) !important;
}

.target:active {
  transform: scale(0.9) !important;
}

.time-progress {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 8px;
  background: rgba(0, 0, 0, 0.05);
  overflow: hidden;
  border-radius: 0 0 16px 16px;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(to right, var(--primary-orange), var(--primary-green));
  transition: width 1s linear;
  box-shadow: 0 0 10px rgba(243, 156, 18, 0.3);
}

.start-screen, .game-over-screen {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 400px;
  background: white;
  border-radius: 16px;
  padding: 2.5rem;
  text-align: center;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(0, 0, 0, 0.05);
  position: relative;
}

.start-screen::before, .game-over-screen::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, var(--primary-orange), var(--primary-green));
  border-radius: 16px 16px 0 0;
}

.start-icon, .result-icon {
  width: 90px;
  height: 90px;
  margin-bottom: 1.8rem;
  background: linear-gradient(135deg, var(--primary-orange), var(--primary-green));
  color: white;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 2.8rem;
  box-shadow: 0 10px 25px rgba(243, 156, 18, 0.2);
}

.start-screen h2, .game-over-screen h2 {
  font-size: 2.2rem;
  margin-bottom: 1.2rem;
  color: #333;
  background: linear-gradient(45deg, var(--primary-orange), var(--primary-green));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.start-screen p, .game-over-screen p {
  color: #555;
  margin-bottom: 1.8rem;
  max-width: 450px;
  font-size: 1.1rem;
}

.score-message {
  font-weight: 600;
  color: var(--primary-orange) !important;
  -webkit-text-fill-color: var(--primary-orange);
  padding: 0.8rem 1.5rem;
  background: rgba(243, 156, 18, 0.1);
  border-radius: 8px;
  margin-top: -0.5rem;
}

@keyframes popIn {
  0% {
    transform: scale(0);
    opacity: 0;
  }
  60% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

@media (max-width: 768px) {
  .game-board {
    height: 350px;
  }
  
  .target {
    width: 50px;
    height: 50px;
    font-size: 1.5rem;
  }
  
  .game-stats {
    gap: 1.2rem;
  }
  
  .stat-item {
    font-size: 0.95rem;
  }
  
  .stat-item i {
    font-size: 1.2rem;
  }
  
  .start-screen, .game-over-screen {
    padding: 2rem;
  }
  
  .start-icon, .result-icon {
    width: 75px;
    height: 75px;
    font-size: 2.2rem;
    margin-bottom: 1.5rem;
  }
  
  .start-screen h2, .game-over-screen h2 {
    font-size: 1.8rem;
  }
}

@media (max-width: 480px) {
  .game-header {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
    padding: 1rem;
  }
  
  .game-board, .start-screen, .game-over-screen {
    height: 300px;
  }
  
  .target {
    width: 45px;
    height: 45px;
    font-size: 1.2rem;
  }
  
  .start-screen, .game-over-screen {
    padding: 1.5rem;
  }
  
  .start-icon, .result-icon {
    width: 70px;
    height: 70px;
    font-size: 2rem;
    margin-bottom: 1.2rem;
  }
  
  .start-screen h2, .game-over-screen h2 {
    font-size: 1.6rem;
    margin-bottom: 0.8rem;
  }
  
  .start-screen p, .game-over-screen p {
    font-size: 0.95rem;
    margin-bottom: 1.2rem;
  }
  
  .start-button, .play-button, .play-again-button {
    padding: 0.7rem 1.4rem;
    font-size: 0.9rem;
  }
}
</style> 