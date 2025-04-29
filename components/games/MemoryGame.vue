<template>
  <div class="memory-game">
    <div class="game-header">
      <div class="game-stats">
        <div class="stat-item">
          <i class="bi bi-eye"></i>
          <span>Coups : {{ moves }}</span>
        </div>
        <div class="stat-item">
          <i class="bi bi-stopwatch"></i>
          <span>Temps : {{ formatTime(elapsedTime) }}</span>
        </div>
      </div>
      <button class="reset-button" @click="resetGame">
        <i class="bi bi-arrow-repeat"></i>
        Recommencer
      </button>
    </div>
    
    <div v-if="gameWon" class="win-screen">
      <div class="win-content">
        <div class="win-icon"><i class="bi bi-trophy"></i></div>
        <h2>Bravo !</h2>
        <p>Vous avez terminé en {{ formatTime(elapsedTime) }} avec {{ moves }} coups.</p>
        <button @click="resetGame" class="play-again-button">
          <i class="bi bi-arrow-repeat"></i>
          Rejouer
        </button>
      </div>
    </div>
    
    <div v-else class="memory-board" :style="{ gridTemplateColumns: `repeat(${gridSize}, 1fr)` }">
      <div 
        v-for="(card, index) in cards" 
        :key="index" 
        class="memory-card"
        :class="{ 'flipped': card.flipped, 'matched': card.matched }"
        @click="flipCard(index)"
      >
        <div class="card-inner">
          <div class="card-front">
            <i class="bi bi-question-circle"></i>
          </div>
          <div class="card-back">
            <i :class="'bi ' + card.icon" :style="{ color: card.color }"></i>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';

const props = defineProps({
  difficulty: {
    type: String,
    default: 'medium' // easy, medium, hard
  }
});

const emit = defineEmits(['game-won']);

// Grille de jeu
const gridSizes = {
  easy: 4, // 4x4 = 16 cartes (8 paires)
  medium: 4, // 4x4 = 16 cartes (8 paires)
  hard: 6 // 6x6 = 36 cartes (18 paires)
};

const gridSize = computed(() => gridSizes[props.difficulty] || 4);

// Statistiques de jeu
const moves = ref(0);
const elapsedTime = ref(0);
const gameWon = ref(false);
const timer = ref(null);

// Cartes
const cards = ref([]);
const flippedCards = ref([]);

// Icons et couleurs possibles
const possibleIcons = [
  { icon: 'bi-gift', color: '#e74c3c' },
  { icon: 'bi-balloon-heart', color: '#9b59b6' },
  { icon: 'bi-cake', color: '#f39c12' },
  { icon: 'bi-music-note-beamed', color: '#2ecc71' },
  { icon: 'bi-star-fill', color: '#f1c40f' },
  { icon: 'bi-emoji-smile', color: '#3498db' },
  { icon: 'bi-cup-hot', color: '#e67e22' },
  { icon: 'bi-camera', color: '#2980b9' },
  { icon: 'bi-headphones', color: '#8e44ad' },
  { icon: 'bi-controller', color: '#16a085' },
  { icon: 'bi-heart-fill', color: '#c0392b' },
  { icon: 'bi-bicycle', color: '#27ae60' },
  { icon: 'bi-book', color: '#2c3e50' },
  { icon: 'bi-palette', color: '#d35400' },
  { icon: 'bi-moon-stars', color: '#34495e' },
  { icon: 'bi-sun', color: '#f39c12' },
  { icon: 'bi-sunglasses', color: '#2c3e50' },
  { icon: 'bi-alarm', color: '#c0392b' }
];

// Initialisation du jeu
const initGame = () => {
  // Réinitialiser les statistiques
  moves.value = 0;
  elapsedTime.value = 0;
  gameWon.value = false;
  flippedCards.value = [];
  
  // Démarrer le timer
  if (timer.value) clearInterval(timer.value);
  timer.value = setInterval(() => {
    elapsedTime.value++;
  }, 1000);
  
  // Créer les paires de cartes
  const totalPairs = (gridSize.value * gridSize.value) / 2;
  const selectedIcons = [...possibleIcons]
    .sort(() => 0.5 - Math.random()) // Mélanger
    .slice(0, totalPairs); // Prendre le nombre de paires nécessaires
  
  // Dupliquer pour créer des paires et mélanger
  const cardPairs = [...selectedIcons, ...selectedIcons].map(icon => ({
    icon: icon.icon,
    color: icon.color,
    flipped: false,
    matched: false
  })).sort(() => 0.5 - Math.random());
  
  cards.value = cardPairs;
};

// Retourner une carte
const flipCard = (index) => {
  const card = cards.value[index];
  
  // Ignorer si déjà retournée, déjà matchée ou deux cartes sont déjà retournées
  if (card.flipped || card.matched || flippedCards.value.length >= 2) return;
  
  // Retourner la carte
  card.flipped = true;
  flippedCards.value.push(index);
  
  // Si deux cartes sont retournées, vérifier si elles correspondent
  if (flippedCards.value.length === 2) {
    moves.value++;
    
    const [firstIndex, secondIndex] = flippedCards.value;
    const firstCard = cards.value[firstIndex];
    const secondCard = cards.value[secondIndex];
    
    if (firstCard.icon === secondCard.icon) {
      // Match trouvé
      firstCard.matched = true;
      secondCard.matched = true;
      flippedCards.value = [];
      
      // Vérifier si le jeu est terminé
      if (cards.value.every(card => card.matched)) {
        gameWon.value = true;
        clearInterval(timer.value);
        emit('game-won', { moves: moves.value, time: elapsedTime.value });
      }
    } else {
      // Pas de match, retourner les cartes après un délai
      setTimeout(() => {
        firstCard.flipped = false;
        secondCard.flipped = false;
        flippedCards.value = [];
      }, 1000);
    }
  }
};

// Réinitialiser le jeu
const resetGame = () => {
  initGame();
};

// Formater le temps (secondes -> mm:ss)
const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
  const secs = (seconds % 60).toString().padStart(2, '0');
  return `${mins}:${secs}`;
};

// Initialisation et nettoyage
onMounted(() => {
  initGame();
});

onUnmounted(() => {
  if (timer.value) clearInterval(timer.value);
});
</script>

<style scoped>
.memory-game {
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
  background: linear-gradient(to right, rgba(46, 204, 113, 0.1), rgba(243, 156, 18, 0.1));
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.03);
  border: 1px solid rgba(46, 204, 113, 0.1);
  position: relative;
}

.game-header::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 100%;
  background: linear-gradient(to bottom, var(--primary-green), var(--primary-orange));
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
  color: var(--primary-green);
  font-size: 1.4rem;
  filter: drop-shadow(0 2px 3px rgba(46, 204, 113, 0.2));
}

.reset-button {
  display: inline-flex;
  align-items: center;
  gap: 0.7rem;
  padding: 0.7rem 1.4rem;
  background: rgba(255, 255, 255, 0.7);
  border: 1px solid rgba(46, 204, 113, 0.2);
  border-radius: 50px;
  color: #444;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.05);
}

.reset-button:hover {
  background: rgba(255, 255, 255, 0.9);
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(46, 204, 113, 0.15);
  color: var(--primary-green);
}

.reset-button i {
  font-size: 1.2rem;
  transition: transform 0.3s ease;
}

.reset-button:hover i {
  transform: rotate(45deg);
}

.memory-board {
  display: grid;
  grid-gap: 1rem;
  perspective: 1000px;
  margin-top: 1rem;
}

.memory-card {
  aspect-ratio: 1 / 1;
  cursor: pointer;
  position: relative;
  transform-style: preserve-3d;
  transition: transform 0.5s;
}

.memory-card.flipped {
  transform: rotateY(180deg);
}

.memory-card.matched {
  transform: rotateY(180deg) scale(0.95);
  opacity: 0.8;
}

.card-inner {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
}

.memory-card:not(.matched):hover .card-inner {
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  transform: translateY(-3px);
}

.card-front, .card-back {
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  backface-visibility: hidden;
  border-radius: 10px;
  font-size: 2rem;
}

.card-front {
  background: linear-gradient(135deg, var(--primary-green), var(--primary-orange));
  color: white;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.card-front i {
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
  font-size: 2.2rem;
}

.card-back {
  background: white;
  transform: rotateY(180deg);
  box-shadow: inset 0 0 0 2px rgba(46, 204, 113, 0.1);
}

.card-back i {
  font-size: 2.2rem;
  filter: drop-shadow(0 2px 3px rgba(0, 0, 0, 0.1));
  transform: scale(1.2);
}

.win-screen {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(255, 255, 255, 0.9);
  z-index: 10;
  animation: fadeIn 0.5s ease;
  backdrop-filter: blur(5px);
}

.win-content {
  text-align: center;
  background: white;
  border-radius: 16px;
  padding: 2.5rem;
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.1);
  max-width: 90%;
  border: 1px solid rgba(46, 204, 113, 0.1);
  position: relative;
}

.win-content::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, var(--primary-green), var(--primary-orange));
  border-radius: 16px 16px 0 0;
}

.win-icon {
  width: 90px;
  height: 90px;
  margin: 0 auto 1.8rem;
  background: linear-gradient(135deg, var(--primary-green), var(--primary-orange));
  color: white;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 2.8rem;
  box-shadow: 0 10px 25px rgba(46, 204, 113, 0.2);
}

.win-content h2 {
  font-size: 2.2rem;
  margin-bottom: 1.2rem;
  color: #333;
  background: linear-gradient(45deg, var(--primary-green), var(--primary-orange));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.win-content p {
  color: #555;
  margin-bottom: 1.8rem;
  font-size: 1.1rem;
}

.play-again-button {
  display: inline-flex;
  align-items: center;
  gap: 0.7rem;
  padding: 1rem 2rem;
  background: linear-gradient(45deg, var(--primary-green), var(--primary-orange));
  color: white;
  border: none;
  border-radius: 50px;
  font-weight: 600;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 5px 15px rgba(46, 204, 113, 0.2);
  position: relative;
  overflow: hidden;
}

.play-again-button::before {
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

.play-again-button:hover::before {
  left: 100%;
}

.play-again-button:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(46, 204, 113, 0.3);
}

.play-again-button i {
  font-size: 1.2rem;
  transition: transform 0.3s ease;
}

.play-again-button:hover i {
  transform: rotate(45deg);
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@media (max-width: 768px) {
  .memory-board {
    grid-gap: 0.8rem;
  }
  
  .card-front, .card-back {
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
}

@media (max-width: 480px) {
  .game-header {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
    padding: 1rem;
  }
  
  .card-front, .card-back {
    font-size: 1.2rem;
  }
  
  .win-content {
    padding: 1.8rem;
  }
  
  .win-icon {
    width: 70px;
    height: 70px;
    font-size: 2.2rem;
    margin-bottom: 1.2rem;
  }
  
  .win-content h2 {
    font-size: 1.8rem;
  }
  
  .play-again-button {
    padding: 0.8rem 1.5rem;
    font-size: 1rem;
  }
}
</style> 