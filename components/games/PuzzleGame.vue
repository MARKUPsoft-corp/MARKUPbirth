<template>
  <div class="puzzle-game">
    <div class="game-header">
      <div class="game-stats">
        <div class="stat-item">
          <div class="stat-icon">
            <i class="bi bi-arrow-left-right"></i>
          </div>
          <div class="stat-text">
            <span class="stat-label">Mouvements</span>
            <span class="stat-value">{{ moves }}</span>
          </div>
        </div>
        <div class="stat-item">
          <div class="stat-icon">
            <i class="bi bi-stopwatch"></i>
          </div>
          <div class="stat-text">
            <span class="stat-label">Temps</span>
            <span class="stat-value">{{ formatTime(elapsedTime) }}</span>
          </div>
        </div>
        <div class="sound-toggle" @click="soundEnabled = !soundEnabled">
          <i :class="`bi ${soundEnabled ? 'bi-volume-up' : 'bi-volume-mute'}`"></i>
        </div>
      </div>
      <button v-if="!gameStarted && !gameWon" class="start-button" @click="startGame">
        <i class="bi bi-play-fill"></i>
        Commencer
      </button>
      <button v-if="gameWon || (gameStarted && !isImageSelection)" class="reset-button" @click="resetGame">
        <i class="bi bi-arrow-repeat"></i>
        Recommencer
      </button>
    </div>
    
    <div v-if="!gameStarted && !gameWon && !isImageSelection" class="start-screen">
      <div class="start-icon">
        <i class="bi bi-grid-3x3"></i>
      </div>
      <h2>Puzzle Coulissant</h2>
      <div class="game-objective">
        <h3><i class="bi bi-bullseye"></i> Objectif</h3>
        <p>Organisez les tuiles en <strong>ordre croissant</strong> de gauche à droite et de haut en bas. Le puzzle contient <strong>deux cases vides</strong> qui peuvent être placées n'importe où.</p>
      </div>
      <p class="game-instructions">Pour jouer, cliquez sur les flèches qui apparaissent sur les <strong>deux cases vides</strong> pour déplacer les tuiles adjacentes.</p>
      <div class="example-grid">
        <div class="example-row">
          <div class="example-tile">1</div>
          <div class="example-tile">2</div>
          <div class="example-tile">3</div>
        </div>
        <div class="example-row">
          <div class="example-tile">4</div>
          <div class="example-tile">5</div>
          <div class="example-tile">6</div>
        </div>
        <div class="example-row">
          <div class="example-tile">7</div>
          <div class="example-empty"><i class="bi bi-arrow-up"></i></div>
          <div class="example-empty"><i class="bi bi-arrow-left"></i></div>
        </div>
      </div>
      <button class="play-button" @click="showImageSelection">
        <i class="bi bi-play-fill"></i>
        Commencer
      </button>
    </div>

    <div v-else-if="isImageSelection" class="theme-selection">
      <h2>Choisissez un thème et une difficulté</h2>
      <div class="theme-grid">
        <div 
          v-for="(theme, index) in availableThemes" 
          :key="index" 
          class="theme-option"
          :class="{ 'selected': selectedImageIndex === index }"
          :style="{
            'border-color': selectedImageIndex === index ? theme.color : 'transparent',
            'box-shadow': selectedImageIndex === index ? `0 0 15px ${theme.color}33` : 'var(--shadow-sm)'
          }"
          @click="selectImage(index)"
        >
          <div class="theme-icon" :style="{ 'background-color': theme.color }">
            <i :class="'bi ' + theme.iconClass"></i>
          </div>
          <div class="theme-content">
            <div class="theme-name">{{ theme.name }}</div>
            <div class="theme-preview">
              <i v-for="(icon, iconIndex) in theme.icons.slice(0, 5)" 
                 :key="iconIndex" 
                 :class="'bi ' + icon.icon" 
                 :style="{ color: icon.color }"></i>
              <span class="more-icons">+{{ theme.icons.length - 5 }}</span>
            </div>
            <div class="difficulty-label" :style="{ 'background-color': theme.color }">
              {{ getDifficultyLabel(theme.difficulty) }}
            </div>
          </div>
        </div>
      </div>
      <div class="difficulty-selection">
        <h3>Choisissez la taille de la grille</h3>
        <div class="grid-size-options">
          <button 
            v-for="size in [3, 4, 5]" 
            :key="size"
            class="grid-size-button" 
            :class="{ 'selected': gridSize === size }"
            @click="changeLevel(size)"
            :style="{
              'background-color': selectedImageIndex !== null && gridSize === size ? 
                `${availableThemes[selectedImageIndex].color}22` : 'transparent',
              'border-color': selectedImageIndex !== null && gridSize === size ? 
                availableThemes[selectedImageIndex].color : 'var(--border-color)'
            }"
          >
            <span class="grid-size-value">{{ size }}×{{ size }}</span>
            <span class="difficulty-label">
              {{ size === 3 ? 'Facile' : size === 4 ? 'Moyen' : 'Difficile' }}
            </span>
          </button>
        </div>
      </div>

      <div class="selection-controls">
        <button class="back-button" @click="isImageSelection = false">
          <i class="bi bi-arrow-left"></i>
          Retour
        </button>
        <button 
          class="start-button" 
          :disabled="selectedImageIndex === null" 
          @click="initGame"
          :style="{ 
            'background-color': selectedImageIndex !== null ? availableThemes[selectedImageIndex].color : 'var(--text-secondary)' 
          }"
        >
          <i class="bi bi-play-fill"></i>
          Jouer
        </button>
      </div>
    </div>
    
    <div v-else-if="gameWon" class="game-over-screen">
      <div class="victory-animation">
        <div class="confetti confetti-1"></div>
        <div class="confetti confetti-2"></div>
        <div class="confetti confetti-3"></div>
        <div class="confetti confetti-4"></div>
        <div class="confetti confetti-5"></div>
        <div class="confetti confetti-6"></div>
      </div>

      <div class="result-icon" :style="{ 'background': `linear-gradient(135deg, ${selectedTheme?.color || 'var(--primary-orange)'}, var(--primary-green))` }">
        <i class="bi bi-trophy"></i>
      </div>
      
      <h2>Victoire !</h2>
      <h3 class="victory-subtitle">Puzzle résolu avec succès</h3>
      
      <div class="stats-container">
        <div class="stat-card">
          <div class="stat-card-icon">
            <i class="bi bi-arrow-left-right"></i>
          </div>
          <div class="stat-card-value">{{ moves }}</div>
          <div class="stat-card-label">Mouvements</div>
        </div>
        
        <div class="stat-card">
          <div class="stat-card-icon">
            <i class="bi bi-stopwatch"></i>
          </div>
          <div class="stat-card-value">{{ formatTime(elapsedTime) }}</div>
          <div class="stat-card-label">Temps</div>
        </div>

        <div class="stat-card">
          <div class="stat-card-icon">
            <i class="bi bi-grid-3x3"></i>
          </div>
          <div class="stat-card-value">{{ gridSize }}×{{ gridSize }}</div>
          <div class="stat-card-label">Taille</div>
        </div>
      </div>

      <div class="completed-puzzle" :style="{ 'background': `linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.2))`, 'border': `2px solid ${selectedTheme?.color || 'var(--primary-orange)'}` }">
        <div class="theme-icons-grid">
          <i v-for="(icon, index) in puzzleIcons.slice(0, 16)" 
             :key="index" 
             :class="'bi ' + icon.icon" 
             :style="{ color: icon.color }"
             :data-index="index"></i>
        </div>
      </div>

      <div class="victory-message">
        <i class="bi bi-check-circle-fill"></i>
        <span>Bravo! Vous avez organisé toutes les tuiles en ordre croissant.</span>
      </div>
      
      <div class="victory-actions">
        <button class="play-again-button" @click="resetGame" :style="{ 'background-color': selectedTheme?.color || 'var(--primary-green)' }">
          <i class="bi bi-arrow-repeat"></i>
          Rejouer
        </button>

        <button class="change-theme-button" @click="resetGame(); isImageSelection = true;">
          <i class="bi bi-palette"></i>
          Changer de thème
        </button>
      </div>
    </div>
    
    <div v-else class="game-board">
      <div class="puzzle-grid" :style="{ 
        'grid-template-columns': `repeat(${gridSize}, 1fr)`, 
        'grid-template-rows': `repeat(${gridSize}, 1fr)` 
      }">
        <div 
          v-for="(tile, index) in puzzle" 
          :key="index" 
          class="puzzle-tile"
          :class="{ 
            'empty-tile': tile === 0, 
            'animate-move': lastMovedTile === index,
            'shimmer': gameStarted && !gameWon && tile !== 0,
            'mobile-friendly': true
          }"
          @click="tile === 0 ? null : moveTile(index)"
        >
          <div v-if="tile !== 0" class="tile-content" :style="getTileStyle(tile)">
            <div class="tile-inner">
              <span class="tile-number">{{ tile }}</span>
              <i class="tile-icon" :class="'bi ' + getTileIcon(tile)" :style="{ color: getTileIconColor(tile) }"></i>
            </div>
          </div>
          
          <div v-else class="empty-tile-controls">
            <button 
              v-for="(direction, dirIndex) in availableMoves(index)" 
              :key="dirIndex"
              class="direction-btn"
              :class="'direction-' + direction.dir"
              @click.stop="moveInDirection(index, direction.index)"
            >
              <i :class="'bi bi-arrow-' + getDirectionIcon(direction.dir)"></i>
            </button>
          </div>
        </div>
      </div>
      
      <div class="puzzle-controls">
        <div class="toggle-control">
          <label class="toggle-label">
            <input type="checkbox" v-model="showNumbers">
            <span class="toggle-text">Afficher les numéros</span>
          </label>
        </div>
        <div class="level-control">
          <button 
            class="level-button" 
            :class="{ 'active': gridSize === 3 }"
            @click="changeLevel(3)"
          >
            3×3
          </button>
          <button 
            class="level-button" 
            :class="{ 'active': gridSize === 4 }"
            @click="changeLevel(4)"
          >
            4×4
          </button>
          <button 
            class="level-button" 
            :class="{ 'active': gridSize === 5 }"
            @click="changeLevel(5)"
          >
            5×5
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';

// Gestionnaire des effets sonores
const soundEnabled = ref(true); // État pour activer/désactiver les sons

// Dictionnaire des effets sonores
const sounds = {
  move: '/sounds/move.mp3',
  select: '/sounds/select.mp3',
  win: '/sounds/win.mp3',
  start: '/sounds/start.mp3',
  error: '/sounds/error.mp3'
};

// Fonction pour jouer un son
const playSound = (soundName) => {
  if (!soundEnabled.value) return; // Ne pas jouer si les sons sont désactivés
  
  const sound = new Audio(sounds[soundName]);
  sound.volume = 0.6; // Volume à 60%
  try {
    sound.play();
  } catch (err) {
    console.error('Erreur lors de la lecture du son:', err);
  }
};

const props = defineProps({
  difficulty: {
    type: String,
    default: 'medium' // easy, medium, hard
  }
});

const emit = defineEmits(['game-won']);

// Variables d'état
const gameStarted = ref(false);
const gameWon = ref(false);
const isImageSelection = ref(false);
const moves = ref(0);
const elapsedTime = ref(0);
const gridSize = ref(4); // Taille par défaut 4x4
const puzzle = ref([]);
const showNumbers = ref(false);
const selectedImageIndex = ref(null);
const lastMovedTile = ref(null);
const puzzleIcons = ref([]); // Pour stocker les icônes du puzzle actuel

// Thèmes d'icônes disponibles pour le puzzle
const availableThemes = ref([
  { 
    name: 'Tech', 
    iconClass: 'bi-cpu-fill',
    color: '#3498db',
    icons: [
      { icon: 'bi-cpu-fill', color: '#3498db' },
      { icon: 'bi-laptop', color: '#2980b9' },
      { icon: 'bi-phone', color: '#1abc9c' },
      { icon: 'bi-router', color: '#16a085' },
      { icon: 'bi-hdd-network', color: '#27ae60' },
      { icon: 'bi-code-slash', color: '#2ecc71' },
      { icon: 'bi-braces', color: '#f1c40f' },
      { icon: 'bi-terminal', color: '#f39c12' },
      { icon: 'bi-server', color: '#e67e22' },
      { icon: 'bi-globe', color: '#d35400' },
      { icon: 'bi-wifi', color: '#e74c3c' },
      { icon: 'bi-database', color: '#c0392b' },
      { icon: 'bi-cloud', color: '#9b59b6' },
      { icon: 'bi-bluetooth', color: '#8e44ad' },
      { icon: 'bi-gear', color: '#34495e' },
      { icon: 'bi-mouse', color: '#2c3e50' },
      { icon: 'bi-keyboard', color: '#7f8c8d' },
      { icon: 'bi-usb-drive', color: '#95a5a6' },
      { icon: 'bi-earbuds', color: '#bdc3c7' },
      { icon: 'bi-printer', color: '#ecf0f1' },
      { icon: 'bi-camera', color: '#3498db' },
      { icon: 'bi-display', color: '#2980b9' },
      { icon: 'bi-speaker', color: '#1abc9c' },
      { icon: 'bi-smartwatch', color: '#16a085' },
    ],
    difficulty: 'medium'
  },
  { 
    name: 'Loisirs', 
    iconClass: 'bi-controller',
    color: '#e74c3c',
    icons: [
      { icon: 'bi-controller', color: '#e74c3c' },
      { icon: 'bi-dice-6', color: '#c0392b' },
      { icon: 'bi-puzzle', color: '#9b59b6' },
      { icon: 'bi-music-note-beamed', color: '#8e44ad' },
      { icon: 'bi-film', color: '#34495e' },
      { icon: 'bi-bicycle', color: '#2c3e50' },
      { icon: 'bi-palette', color: '#f1c40f' },
      { icon: 'bi-brush', color: '#f39c12' },
      { icon: 'bi-book', color: '#e67e22' },
      { icon: 'bi-headphones', color: '#d35400' },
      { icon: 'bi-camera-reels', color: '#3498db' },
      { icon: 'bi-joystick', color: '#2980b9' },
      { icon: 'bi-tv', color: '#1abc9c' },
      { icon: 'bi-trophy', color: '#16a085' },
      { icon: 'bi-journals', color: '#27ae60' },
      { icon: 'bi-easel', color: '#2ecc71' },
      { icon: 'bi-box2-heart', color: '#e74c3c' },
      { icon: 'bi-balloon-heart', color: '#c0392b' },
      { icon: 'bi-ticket-perforated', color: '#9b59b6' },
      { icon: 'bi-emoji-smile', color: '#8e44ad' },
      { icon: 'bi-heart', color: '#e74c3c' },
      { icon: 'bi-stars', color: '#f1c40f' },
      { icon: 'bi-cup-hot', color: '#f39c12' },
      { icon: 'bi-gift', color: '#e67e22' },
    ],
    difficulty: 'easy'
  },
  { 
    name: 'Nature', 
    iconClass: 'bi-tree-fill',
    color: '#2ecc71',
    icons: [
      { icon: 'bi-tree-fill', color: '#2ecc71' },
      { icon: 'bi-flower1', color: '#27ae60' },
      { icon: 'bi-flower2', color: '#1abc9c' },
      { icon: 'bi-flower3', color: '#16a085' },
      { icon: 'bi-sun', color: '#f1c40f' },
      { icon: 'bi-moon-stars', color: '#f39c12' },
      { icon: 'bi-cloud-sun', color: '#e67e22' },
      { icon: 'bi-cloud-rain', color: '#d35400' },
      { icon: 'bi-cloud-snow', color: '#3498db' },
      { icon: 'bi-rainbow', color: '#2980b9' },
      { icon: 'bi-thermometer-sun', color: '#e74c3c' },
      { icon: 'bi-umbrella', color: '#c0392b' },
      { icon: 'bi-wind', color: '#9b59b6' },
      { icon: 'bi-tsunami', color: '#8e44ad' },
      { icon: 'bi-geo', color: '#34495e' },
      { icon: 'bi-water', color: '#2c3e50' },
      { icon: 'bi-droplet', color: '#7f8c8d' },
      { icon: 'bi-lightning', color: '#95a5a6' },
      { icon: 'bi-snow', color: '#bdc3c7' },
      { icon: 'bi-hurricane', color: '#ecf0f1' },
      { icon: 'bi-bug', color: '#e74c3c' },
      { icon: 'bi-brightness-high', color: '#f1c40f' },
      { icon: 'bi-send', color: '#9b59b6' },
      { icon: 'bi-infinity', color: '#3498db' },
    ],
    difficulty: 'hard'
  }
]);

// Propriétés calculées
const selectedTheme = computed(() => {
  if (selectedImageIndex.value === null) return null;
  return availableThemes.value[selectedImageIndex.value];
});

// Générer le tableau des icônes pour le puzzle
const getIconsForPuzzle = (themeIndex) => {
  if (themeIndex === null) return [];
  
  const theme = availableThemes.value[themeIndex];
  const size = gridSize.value * gridSize.value;
  
  // Limiter le nombre d'icônes au nombre nécessaire pour le puzzle
  // Assurer qu'on a suffisamment d'icônes
  const iconsNeeded = size - 1; // -1 pour la case vide
  let usableIcons = [...theme.icons];
  
  // Si on n'a pas assez d'icônes, dupliquer certaines
  while (usableIcons.length < iconsNeeded) {
    usableIcons = [...usableIcons, ...theme.icons];
  }
  
  // Prendre le nombre exact d'icônes nécessaires et mélanger
  return usableIcons.slice(0, iconsNeeded);
};

// Timer
let timer = null;

// Démarrer le chronomètre
const startTimer = () => {
  if (timer) clearInterval(timer);
  
  timer = setInterval(() => {
    elapsedTime.value++;
  }, 1000);
};

// Formater le temps (secondes -> mm:ss)
const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

// Vérifier si le puzzle est résolu
const checkWin = () => {
  const size = gridSize.value * gridSize.value;
  const puzzleArray = [...puzzle.value];
  
  // Trouver toutes les positions des tuiles vides (0)
  const emptyTilePositions = [];
  for (let i = 0; i < puzzleArray.length; i++) {
    if (puzzleArray[i] === 0) {
      emptyTilePositions.push(i);
    }
  }
  
  // Si aucune tuile vide n'est trouvée, c'est un problème
  if (emptyTilePositions.length === 0) {
    console.warn('Aucune tuile vide trouvée dans le puzzle');
    return false;
  }
  
  console.log(`Détection de ${emptyTilePositions.length} tuiles vides aux positions:`, emptyTilePositions);
  
  // Créer une version du puzzle sans les tuiles vides pour vérifier l'ordre
  const nonEmptyTiles = [];
  const positions = [];
  
  for (let i = 0; i < puzzleArray.length; i++) {
    if (puzzleArray[i] !== 0) {
      nonEmptyTiles.push(puzzleArray[i]);
      positions.push(i);
    }
  }
  
  // Vérifier que les tuiles non-vides sont en ordre croissant
  for (let i = 0; i < nonEmptyTiles.length - 1; i++) {
    if (nonEmptyTiles[i] > nonEmptyTiles[i + 1]) {
      return false;
    }
  }
  
  // Vérifier aussi que les indices sont également en séquence croissante
  // pour s'assurer qu'il n'y a pas de "trous" dans la séquence
  const expectedFirstValue = 1; // La première valeur de tuile non-vide devrait être 1
  if (nonEmptyTiles[0] !== expectedFirstValue) {
    return false;
  }
  
  // Vérifier que toutes les tuiles non-vides forment une séquence continue
  for (let i = 0; i < nonEmptyTiles.length - 1; i++) {
    if (nonEmptyTiles[i + 1] - nonEmptyTiles[i] !== 1) {
      return false;
    }
  }
  
  console.log('Puzzle correctement ordonné. VICTOIRE!');
  return true;
};

// Obtenir les tuiles adjacentes à une position donnée
const getAdjacentTiles = (index) => {
  const size = gridSize.value;
  const row = Math.floor(index / size);
  const col = index % size;
  const adjacent = [];
  
  // Tile above
  if (row > 0) adjacent.push(index - size);
  // Tile below
  if (row < size - 1) adjacent.push(index + size);
  // Tile to the left
  if (col > 0) adjacent.push(index - 1);
  // Tile to the right
  if (col < size - 1) adjacent.push(index + 1);
  
  return adjacent;
};

// Mélanger le puzzle
const shufflePuzzle = () => {
  if (selectedImageIndex.value === null) return;
  
  // Générer les icônes pour ce puzzle
  puzzleIcons.value = getIconsForPuzzle(selectedImageIndex.value);
  
  const size = gridSize.value * gridSize.value;
  const shuffled = Array.from({ length: size }, (_, i) => i);
  
  // Nombre de mouvements aléatoires (plus de mouvements = plus difficile)
  const shuffleMovements = 200 + Math.floor(Math.random() * 300);
  
  let emptyPos = size - 1;
  
  for (let i = 0; i < shuffleMovements; i++) {
    const adjacentTiles = getAdjacentTiles(emptyPos);
    const randomTile = adjacentTiles[Math.floor(Math.random() * adjacentTiles.length)];
    
    // Swap positions
    shuffled[emptyPos] = shuffled[randomTile];
    shuffled[randomTile] = 0;
    emptyPos = randomTile;
  }
  
  // Vérifier si le puzzle est déjà résolu après le mélange
  const isSolvable = checkIfSolvable(shuffled);
  if (!isSolvable || checkSolution(shuffled)) {
    // Si pas solvable ou déjà résolu, recommencer
    return shufflePuzzle();
  }
  
  puzzle.value = shuffled;
};

// Vérifier si un puzzle est solvable
// Une configuration de puzzle est solvable si:
// 1. La largeur de la grille est impaire et le nombre d'inversions est pair
// 2. La largeur de la grille est paire, la position de la tuile vide (à partir du bas) est impaire et le nombre d'inversions est pair
// 3. La largeur de la grille est paire, la position de la tuile vide est paire et le nombre d'inversions est impair
const checkIfSolvable = (puzzleArray) => {
  // Compter les inversions
  let inversions = 0;
  for (let i = 0; i < puzzleArray.length - 1; i++) {
    if (puzzleArray[i] === 0) continue;
    
    for (let j = i + 1; j < puzzleArray.length; j++) {
      if (puzzleArray[j] === 0) continue;
      if (puzzleArray[i] > puzzleArray[j]) {
        inversions++;
      }
    }
  }
  
  // Trouver la position de la tuile vide depuis le bas
  const emptyIndex = puzzleArray.indexOf(0);
  const rowFromBottom = gridSize.value - Math.floor(emptyIndex / gridSize.value);
  
  if (gridSize.value % 2 === 1) {
    // Si la taille est impaire, le puzzle est solvable si inversions est pair
    return inversions % 2 === 0;
  } else {
    // Si la taille est paire
    if (rowFromBottom % 2 === 1) {
      // Si la tuile vide est sur une ligne impaire depuis le bas
      return inversions % 2 === 0;
    } else {
      // Si la tuile vide est sur une ligne paire depuis le bas
      return inversions % 2 === 1;
    }
  }
};

// Vérifier si une configuration est la solution
const checkSolution = (puzzleArray) => {
  // Utiliser la même logique que checkWin mais adaptée pour un tableau quelconque
  
  // Trouver toutes les positions des tuiles vides (0)
  const emptyTilePositions = [];
  for (let i = 0; i < puzzleArray.length; i++) {
    if (puzzleArray[i] === 0) {
      emptyTilePositions.push(i);
    }
  }
  
  // Si aucune tuile vide n'est trouvée, c'est un problème
  if (emptyTilePositions.length === 0) {
    return false;
  }
  
  // Créer une version du puzzle sans les tuiles vides pour vérifier l'ordre
  const nonEmptyTiles = [];
  
  for (let i = 0; i < puzzleArray.length; i++) {
    if (puzzleArray[i] !== 0) {
      nonEmptyTiles.push(puzzleArray[i]);
    }
  }
  
  // Vérifier que les tuiles non-vides sont en ordre croissant
  for (let i = 0; i < nonEmptyTiles.length - 1; i++) {
    if (nonEmptyTiles[i] > nonEmptyTiles[i + 1]) {
      return false;
    }
  }
  
  // Vérifier aussi que les indices sont également en séquence croissante
  const expectedFirstValue = 1; // La première valeur de tuile non-vide devrait être 1
  if (nonEmptyTiles[0] !== expectedFirstValue) {
    return false;
  }
  
  // Vérifier que toutes les tuiles non-vides forment une séquence continue
  for (let i = 0; i < nonEmptyTiles.length - 1; i++) {
    if (nonEmptyTiles[i + 1] - nonEmptyTiles[i] !== 1) {
      return false;
    }
  }
  
  return true;
};

// Obtenir le style pour une tuile (icône)
const getTileStyle = (tileNumber) => {
  if (!tileNumber || tileNumber <= 0) return {};
  
  // La tuile 0 est la case vide, 1 correspond à l'icône à l'index 0, etc.
  const iconIndex = tileNumber - 1;
  
  // Si pas d'icônes ou index invalide, retourner un style par défaut
  if (!puzzleIcons.value.length || iconIndex >= puzzleIcons.value.length) {
    return { backgroundColor: '#f0f0f0' };
  }
  
  const icon = puzzleIcons.value[iconIndex];
  
  return {
    backgroundColor: '#ffffff',
    borderColor: icon.color,
    boxShadow: `inset 0 0 0 2px ${icon.color}33`
  };
};

// Obtenir l'icône pour une tuile
const getTileIcon = (tileNumber) => {
  if (!tileNumber) return '';
  
  const iconIndex = tileNumber - 1;
  if (!puzzleIcons.value.length || iconIndex >= puzzleIcons.value.length) {
    return '';
  }
  
  return puzzleIcons.value[iconIndex].icon;
};

// Obtenir la couleur de l'icône pour une tuile
const getTileIconColor = (tileNumber) => {
  if (!tileNumber) return '';
  
  const iconIndex = tileNumber - 1;
  if (!puzzleIcons.value.length || iconIndex >= puzzleIcons.value.length) {
    return '';
  }
  
  return puzzleIcons.value[iconIndex].color;
};

// Obtenir les mouvements disponibles pour la tuile vide
const availableMoves = (emptyIndex) => {
  if (puzzle.value[emptyIndex] !== 0) return [];
  
  const size = gridSize.value;
  const row = Math.floor(emptyIndex / size);
  const col = emptyIndex % size;
  const moves = [];
  
  // Tuile à gauche (→ pousser la tuile de gauche vers la droite)
  if (col > 0) {
    moves.push({ 
      dir: 'left', 
      index: emptyIndex - 1,
      number: puzzle.value[emptyIndex - 1]
    });
  }
  
  // Tuile à droite (← pousser la tuile de droite vers la gauche)
  if (col < size - 1) {
    moves.push({ 
      dir: 'right', 
      index: emptyIndex + 1,
      number: puzzle.value[emptyIndex + 1]
    });
  }
  
  // Tuile en haut (↓ pousser la tuile du haut vers le bas)
  if (row > 0) {
    moves.push({ 
      dir: 'up', 
      index: emptyIndex - size,
      number: puzzle.value[emptyIndex - size]
    });
  }
  
  // Tuile en bas (↑ pousser la tuile du bas vers le haut)
  if (row < size - 1) {
    moves.push({ 
      dir: 'down', 
      index: emptyIndex + size,
      number: puzzle.value[emptyIndex + size]
    });
  }
  
  return moves;
};

// Obtenir l'icône de direction pour les flèches
const getDirectionIcon = (direction) => {
  switch (direction) {
    case 'left': return 'left';
    case 'right': return 'right';
    case 'up': return 'up';
    case 'down': return 'down';
    default: return '';
  }
};

// Déplacer dans une direction spécifique depuis la tuile vide
const moveInDirection = (emptyIndex, tileIndex) => {
  if (!gameStarted.value || gameWon.value) return;
  
  // Mettre à jour la dernière tuile déplacée pour l'animation
  lastMovedTile.value = emptyIndex;
  
  // Vérifier que nous déplaçons bien depuis la case vide
  if (puzzle.value[emptyIndex] !== 0) {
    console.warn('Tentative de déplacement depuis une case non vide');
    return;
  }
  
  // Swap positions dans le puzzle
  const temp = puzzle.value[tileIndex];
  puzzle.value[tileIndex] = 0;
  puzzle.value[emptyIndex] = temp;
  
  // Incrémenter le nombre de mouvements
  moves.value++;
  
  // Vérifier après chaque mouvement si le puzzle est résolu
  if (checkWin()) {
    console.log('Puzzle résolu! Victoire!');
    endGame();
  }
};

// Déplacer une tuile (ancienne méthode maintenue pour compatibilité)
const moveTile = (index) => {
  if (!gameStarted.value || gameWon.value) return;
  
  // Trouver toutes les tuiles vides
  const emptyTiles = [];
  for (let i = 0; i < puzzle.value.length; i++) {
    if (puzzle.value[i] === 0) {
      emptyTiles.push(i);
    }
  }
  
  // Vérifier si au moins une tuile vide existe
  if (emptyTiles.length === 0) {
    console.warn('Aucune tuile vide trouvée dans le puzzle');
    return;
  }
  
  // Trouver une tuile vide adjacente à la tuile cliquée
  let foundEmptyIndex = -1;
  for (const emptyIndex of emptyTiles) {
    const adjacentTiles = getAdjacentTiles(emptyIndex);
    if (adjacentTiles.includes(index)) {
      foundEmptyIndex = emptyIndex;
      break;
    }
  }
  
  if (foundEmptyIndex !== -1) {
    // Mettre à jour la dernière tuile déplacée pour l'animation
    lastMovedTile.value = foundEmptyIndex;
    
    // Swap positions dans le puzzle
    const temp = puzzle.value[index];
    puzzle.value[index] = 0;
    puzzle.value[foundEmptyIndex] = temp;
    
    // Incrémenter le nombre de mouvements
    moves.value++;
    
    // Vérifier si le puzzle est résolu après chaque mouvement
    if (checkWin()) {
      console.log('Puzzle résolu! Victoire!');
      endGame();
    }
  }
};

// Initialiser le jeu
const initGame = () => {
  if (selectedImageIndex.value === null) return;
  
  isImageSelection.value = false;
  startGame();
};

// Afficher la sélection d'images
const showImageSelection = () => {
  isImageSelection.value = true;
};

// Sélectionner une image
const selectImage = (index) => {
  selectedImageIndex.value = index;
};

// Changer le niveau (taille de la grille)
const changeLevel = (size) => {
  if (gameStarted.value && !gameWon.value) {
    if (!confirm("Changer la taille du puzzle réinitialisera votre progression. Continuer ?")) return;
  }
  
  gridSize.value = size;
  resetGame();
};

// Obtenir le label de difficulté
const getDifficultyLabel = (difficulty) => {
  switch (difficulty) {
    case 'easy': return 'Facile';
    case 'medium': return 'Moyen';
    case 'hard': return 'Difficile';
    default: return 'Moyen';
  }
};

// Démarrer le jeu
const startGame = () => {
  gameStarted.value = true;
  gameWon.value = false;
  moves.value = 0;
  elapsedTime.value = 0;
  shufflePuzzle();
  startTimer();
};

// Réinitialiser le jeu
const resetGame = () => {
  gameStarted.value = false;
  gameWon.value = false;
  isImageSelection.value = false;
  moves.value = 0;
  elapsedTime.value = 0;
  lastMovedTile.value = null;
  
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
};

// Fin du jeu
const endGame = () => {
  gameWon.value = true;
  
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
  
  emit('game-won', { 
    moves: moves.value, 
    time: elapsedTime.value,
    gridSize: gridSize.value
  });
};

// Nettoyage lors de la suppression du composant
onUnmounted(() => {
  if (timer) clearInterval(timer);
});

// Surveiller les changements de taille pour réinitialiser le puzzle
watch(gridSize, () => {
  if (gameStarted.value && !gameWon.value) {
    shufflePuzzle();
  }
});
</script>

<style scoped>
.puzzle-game {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  position: relative;
}

.game-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(135deg, var(--bg-secondary), var(--bg-primary));
  padding: 1rem 1.2rem;
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-md);
  border: 1px solid rgba(255, 255, 255, 0.1);
  margin-bottom: 0.5rem;
}

.game-stats {
  display: flex;
  gap: 1.8rem;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 0.8rem;
}

.stat-icon {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--primary-orange), var(--primary-green));
  color: white;
  font-size: 1.2rem;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.15);
}

.stat-text {
  display: flex;
  flex-direction: column;
}

.stat-label {
  font-size: 0.8rem;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.04em;
  font-weight: 500;
}

.stat-value {
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--text-primary);
  letter-spacing: 0.03em;
}

.start-button, .reset-button {
  padding: 0.6rem 1.2rem;
  background: linear-gradient(135deg, var(--primary-green), var(--primary-green) 60%, var(--dark-green));
  color: white;
  border: none;
  border-radius: var(--radius-md);
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: var(--transition-normal);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  position: relative;
  overflow: hidden;
}

.start-button::after, .reset-button::after {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(to right, rgba(255, 255, 255, 0), rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0));
  transform: rotate(30deg);
  transition: transform 0.6s;
}

.start-button:hover::after, .reset-button:hover::after {
  transform: rotate(30deg) translate(10%, 10%);
}

.start-button:hover {
  background: linear-gradient(135deg, var(--dark-green), var(--primary-green));
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.reset-button {
  background: linear-gradient(135deg, var(--text-secondary), var(--text-secondary) 60%, #6a7a7d);
}

.reset-button:hover {
  background: linear-gradient(135deg, #6a7a7d, var(--text-secondary));
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.start-button i, .reset-button i {
  font-size: 1.1rem;
}

.start-screen, .game-over-screen {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  background-color: var(--bg-secondary);
  padding: 3rem 2rem;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
}

.start-icon, .result-icon {
  width: 90px;
  height: 90px;
  margin-bottom: 1.8rem;
  background: linear-gradient(135deg, var(--primary-orange), var(--primary-green));
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.8rem;
  color: white;
}

.start-screen h2, .game-over-screen h2 {
  font-size: 2rem;
  margin-bottom: 1rem;
  color: var(--text-primary);
}

.start-screen p {
  color: var(--text-secondary);
  margin-bottom: 1rem;
  max-width: 500px;
}

.game-objective {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.2));
  padding: 1rem;
  border-radius: var(--radius-md);
  margin-bottom: 1.5rem;
  border-left: 4px solid var(--primary-green);
}

.game-objective h3 {
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
  color: var(--primary-green);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.game-objective p {
  margin-bottom: 0;
}

.game-instructions {
  font-style: italic;
  margin-bottom: 1.5rem;
}

.example-grid {
  display: flex;
  flex-direction: column;
  gap: 5px;
  margin: 0 auto 2rem;
  max-width: 200px;
  border-radius: var(--radius-md);
  overflow: hidden;
  box-shadow: var(--shadow-md);
}

.example-row {
  display: flex;
  gap: 5px;
}

.example-tile, .example-empty {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 1.2rem;
}

.example-tile {
  background-color: white;
  color: var(--text-primary);
  border: 2px solid var(--primary-orange);
  border-radius: 4px;
}

.example-empty {
  background-color: rgba(0, 0, 0, 0.05);
  border-radius: 4px;
}

.play-button, .play-again-button {
  padding: 0.8rem 1.8rem;
  background: var(--primary-green);
  color: white;
  border: none;
  border-radius: var(--radius-md);
  font-weight: 600;
  font-size: 1.1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: var(--transition-normal);
}

.play-button:hover, .play-again-button:hover {
  background: var(--dark-green);
  transform: translateY(-2px);
}

.game-board {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  background-color: var(--bg-secondary);
  padding: 1.5rem;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
}

.puzzle-grid {
  display: grid;
  gap: 4px;
  aspect-ratio: 1 / 1;
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
}

.puzzle-tile {
  position: relative;
  cursor: pointer;
  border-radius: var(--radius-md);
  background-color: var(--bg-primary);
  transition: all 0.25s ease-out;
  overflow: hidden;
  box-shadow: var(--shadow-sm);
}

/* Styles optimisés pour mobile */
.mobile-friendly {
  min-height: 45px;
  min-width: 45px;
  font-size: 1rem;
  border-radius: var(--radius-sm);
  margin: 2px;
}

@media (max-width: 768px) {
  .puzzle-tile {
    font-size: 0.9rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  }
  
  .mobile-friendly {
    min-height: 40px;
    min-width: 40px;
  }
  
  .puzzle-tile i {
    font-size: 1rem;
  }
}

.animate-move {
  animation: tileMove 0.3s ease-out;
}

@keyframes tileMove {
  0% {
    transform: scale(0.9);
    z-index: 5;
  }
  50% {
    transform: scale(1.08);
    z-index: 5;
  }
  100% {
    transform: scale(1);
    z-index: 1;
  }
}

.puzzle-tile:not(.empty-tile):hover {
  transform: scale(0.96);
  box-shadow: var(--shadow-md);
  z-index: 2;
}

.empty-tile {
  background-color: rgba(0, 0, 0, 0.05);
  cursor: default;
  position: relative;
  overflow: visible;
}

.empty-tile-controls {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}

.direction-btn {
  position: absolute;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: linear-gradient(to bottom, var(--primary-green), var(--primary-orange));
  color: white;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  font-size: 1.1rem;
  transition: all 0.2s ease;
  z-index: 3;
  opacity: 0.9;
  transform: scale(0.9);
}

.direction-btn:hover {
  transform: scale(1.1);
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.3);
  opacity: 1;
}

.direction-btn:active {
  transform: scale(0.95);
}

.direction-left {
  left: -12px;
  top: 50%;
  transform: translateY(-50%) scale(0.9);
}

.direction-right {
  right: -12px;
  top: 50%;
  transform: translateY(-50%) scale(0.9);
}

.direction-up {
  top: -12px;
  left: 50%;
  transform: translateX(-50%) scale(0.9);
}

.direction-down {
  bottom: -12px;
  left: 50%;
  transform: translateX(-50%) scale(0.9);
}

.direction-left:hover {
  transform: translateY(-50%) scale(1.1);
}

.direction-right:hover {
  transform: translateY(-50%) scale(1.1);
}

.direction-up:hover {
  transform: translateX(-50%) scale(1.1);
}

.direction-down:hover {
  transform: translateX(-50%) scale(1.1);
}

.tile-content {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  border: 2px solid transparent;
  background-color: white;
  aspect-ratio: 1;
  padding: 0.5rem;
}

.tile-inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.7), rgba(255, 255, 255, 0.9));
  border-radius: var(--radius-sm);
  position: relative;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.tile-inner::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(to right, var(--primary-green), var(--primary-orange));
}

.tile-icon {
  font-size: 2rem;
  filter: drop-shadow(0 2px 3px rgba(0, 0, 0, 0.2));
  transition: transform 0.3s ease;
  margin-top: 0.5rem;
}

.puzzle-tile:hover .tile-icon {
  transform: scale(1.1);
}

.puzzle-tile:hover .stat-icon {
  transform: scale(1.05);
}

.sound-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background-color: var(--bg-primary);
  border-radius: 50%;
  cursor: pointer;
  box-shadow: var(--shadow-sm);
  transition: all 0.2s ease;
}

.sound-toggle:hover {
  transform: scale(1.1);
  box-shadow: var(--shadow-md);
}

.sound-toggle i {
  font-size: 1.2rem;
  color: var(--text-primary);
}

.tile-number {
  font-size: 1.1rem;
  font-weight: bold;
  color: var(--text-primary);
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: var(--radius-sm);
  padding: 2px 8px;
  margin-bottom: 0.3rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(0, 0, 0, 0.1);
}

.shimmer {
  position: relative;
  overflow: hidden;
}

.shimmer::after {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(
    to bottom right,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.1) 50%,
    rgba(255, 255, 255, 0) 100%
  );
  transform: rotate(30deg);
  animation: shimmerEffect 3s infinite;
  pointer-events: none;
}

@keyframes shimmerEffect {
  0% {
    transform: translateX(-100%) rotate(30deg);
  }
  100% {
    transform: translateX(100%) rotate(30deg);
  }
}

.puzzle-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  margin-top: 1rem;
}

.toggle-control {
  display: flex;
  align-items: center;
}

.toggle-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  user-select: none;
}

.toggle-text {
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.level-control {
  display: flex;
  gap: 0.5rem;
}

.level-button {
  padding: 0.3rem 0.7rem;
  background-color: var(--bg-primary);
  border: 2px solid transparent;
  border-radius: var(--radius-md);
  color: var(--text-secondary);
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition-fast);
}

.level-button:hover {
  border-color: var(--primary-orange);
  color: var(--primary-orange);
}

.level-button.active {
  background-color: var(--primary-orange);
  color: white;
}

.theme-selection {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  background-color: var(--bg-secondary);
  padding: 2rem;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
}

.theme-selection h2 {
  text-align: center;
  margin-bottom: 0.5rem;
  font-size: 1.8rem;
  background: linear-gradient(45deg, var(--primary-green), var(--primary-orange));
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: 700;
}

.difficulty-selection {
  margin-top: 1rem;
  text-align: center;
}

.difficulty-selection h3 {
  margin-bottom: 1rem;
  font-size: 1.2rem;
  font-weight: 500;
  color: var(--text-primary);
}

.grid-size-options {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.grid-size-button {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0.8rem 1.5rem;
  border: 2px solid var(--border-color);
  border-radius: var(--radius-md);
  background-color: transparent;
  transition: all 0.2s ease;
  cursor: pointer;
}

.grid-size-button.selected {
  transform: translateY(-3px);
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);
}

.grid-size-value {
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 0.3rem;
}

.grid-size-button .difficulty-label {
  font-size: 0.8rem;
  color: var(--text-secondary);
  font-weight: 400;
}

@media (max-width: 768px) {
  .grid-size-options {
    flex-wrap: wrap;
  }
  
  .grid-size-button {
    padding: 0.6rem 1.2rem;
  }
}

.theme-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.2rem;
}

.theme-option {
  display: flex;
  align-items: center;
  gap: 1rem;
  background-color: var(--bg-primary);
  border-radius: var(--radius-md);
  padding: 1rem;
  border: 3px solid transparent;
  transition: var(--transition-normal);
  cursor: pointer;
  position: relative;
  overflow: hidden;
  box-shadow: var(--shadow-sm);
}

.theme-option::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(to right, transparent, rgba(255, 255, 255, 0.5), transparent);
  transform: translateX(-100%);
  transition: var(--transition-normal);
}

.theme-option:hover::before {
  transform: translateX(100%);
}

.theme-option:hover {
  transform: translateY(-3px);
  box-shadow: var(--shadow-md);
}

.theme-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.8rem;
  flex-shrink: 0;
  position: relative;
  overflow: hidden;
}

.theme-icon::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at center, rgba(255, 255, 255, 0.2), transparent);
}

.theme-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.theme-name {
  font-weight: 700;
  font-size: 1.1rem;
  color: var(--text-primary);
}

.theme-preview {
  display: flex;
  gap: 0.7rem;
  align-items: center;
  flex-wrap: wrap;
}

.theme-preview i {
  font-size: 1.2rem;
  opacity: 0.9;
}

.more-icons {
  font-size: 0.8rem;
  color: var(--text-secondary);
  background-color: var(--bg-secondary);
  padding: 2px 6px;
  border-radius: var(--radius-full);
}

.difficulty-label {
  position: absolute;
  top: 10px;
  right: 10px;
  padding: 3px 8px;
  border-radius: var(--radius-full);
  font-size: 0.7rem;
  font-weight: bold;
  color: white;
  box-shadow: var(--shadow-sm);
}

.selection-controls {
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;
}

.back-button {
  padding: 0.5rem 1rem;
  background: var(--text-secondary);
  color: white;
  border: none;
  border-radius: var(--radius-md);
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.back-button:hover {
  background: var(--text-primary);
}

.start-button:disabled {
  background-color: var(--text-secondary);
  opacity: 0.6;
  cursor: not-allowed;
}

.completed-puzzle {
  width: 100%;
  max-width: 300px;
  margin: 1.2rem 0;
  border-radius: var(--radius-md);
  overflow: hidden;
  box-shadow: var(--shadow-md);
  padding: 1.5rem;
  position: relative;
}

.theme-icons-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.8rem;
  aspect-ratio: 1 / 1;
}

.theme-icons-grid i {
  font-size: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.15);
  border-radius: var(--radius-md);
  padding: 0.8rem;
  aspect-ratio: 1;
  box-shadow: var(--shadow-sm);
  transition: var(--transition-fast);
  animation: iconPulse 2s infinite alternate;
  position: relative;
}

.theme-icons-grid i:nth-child(1) { animation-delay: 0.1s; }
.theme-icons-grid i:nth-child(2) { animation-delay: 0.2s; }
.theme-icons-grid i:nth-child(3) { animation-delay: 0.3s; }
.theme-icons-grid i:nth-child(4) { animation-delay: 0.4s; }
.theme-icons-grid i:nth-child(5) { animation-delay: 0.5s; }
.theme-icons-grid i:nth-child(6) { animation-delay: 0.6s; }
.theme-icons-grid i:nth-child(7) { animation-delay: 0.7s; }
.theme-icons-grid i:nth-child(8) { animation-delay: 0.8s; }
.theme-icons-grid i:nth-child(9) { animation-delay: 0.9s; }
.theme-icons-grid i:nth-child(10) { animation-delay: 1.0s; }
.theme-icons-grid i:nth-child(11) { animation-delay: 1.1s; }
.theme-icons-grid i:nth-child(12) { animation-delay: 1.2s; }
.theme-icons-grid i:nth-child(13) { animation-delay: 1.3s; }
.theme-icons-grid i:nth-child(14) { animation-delay: 1.4s; }
.theme-icons-grid i:nth-child(15) { animation-delay: 1.5s; }
.theme-icons-grid i:nth-child(16) { animation-delay: 1.6s; }

@keyframes iconPulse {
  0% {
    transform: scale(0.95);
    opacity: 0.9;
  }
  100% {
    transform: scale(1.05);
    opacity: 1;
  }
}

.stats-container {
  display: flex;
  gap: 1rem;
  margin: 1.5rem 0;
  justify-content: center;
}

.stat-card {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.9));
  border-radius: var(--radius-md);
  padding: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-width: 80px;
  box-shadow: var(--shadow-sm);
  position: relative;
  overflow: hidden;
}

.stat-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(to right, var(--primary-green), var(--primary-orange));
}

.stat-card-icon {
  color: var(--primary-orange);
  font-size: 1.2rem;
  margin-bottom: 0.3rem;
}

.stat-card-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
}

.stat-card-label {
  font-size: 0.7rem;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.victory-message {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  margin: 1.5rem 0;
  background-color: rgba(46, 204, 113, 0.1);
  border-left: 4px solid var(--primary-green);
  padding: 1rem;
  border-radius: var(--radius-md);
  max-width: 400px;
}

.victory-message i {
  color: var(--primary-green);
  font-size: 1.2rem;
}

.victory-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
}

.change-theme-button {
  padding: 0.6rem 1.2rem;
  background: linear-gradient(135deg, var(--text-primary), var(--text-primary) 60%, var(--text-secondary));
  color: white;
  border: none;
  border-radius: var(--radius-md);
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: var(--transition-normal);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.change-theme-button:hover {
  background: linear-gradient(135deg, var(--text-secondary), var(--text-primary));
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.victory-subtitle {
  font-size: 1.2rem;
  color: var(--text-secondary);
  margin-top: 0.2rem;
  margin-bottom: 1rem;
  font-weight: normal;
}

.victory-animation {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  overflow: hidden;
  z-index: 0;
}

.confetti {
  position: absolute;
  width: 15px;
  height: 15px;
  opacity: 0;
  animation: confettiFall 5s ease-in-out forwards;
  z-index: 0;
}

.confetti-1 {
  top: -5%;
  left: 10%;
  background-color: var(--primary-green);
  clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
  animation-delay: 0.2s;
}

.confetti-2 {
  top: -8%;
  left: 30%;
  background-color: var(--primary-orange);
  border-radius: 50%;
  animation-delay: 0.5s;
}

.confetti-3 {
  top: -10%;
  left: 50%;
  background-color: #3498db;
  clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%);
  animation-delay: 0.8s;
}

.confetti-4 {
  top: -5%;
  left: 70%;
  background-color: #9b59b6;
  clip-path: polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%);
  animation-delay: 1.1s;
}

.confetti-5 {
  top: -8%;
  left: 85%;
  background-color: #e74c3c;
  clip-path: polygon(20% 0%, 80% 0%, 100% 20%, 100% 80%, 80% 100%, 20% 100%, 0% 80%, 0% 20%);
  animation-delay: 1.4s;
}

.confetti-6 {
  top: -10%;
  left: 20%;
  background-color: #f1c40f;
  clip-path: polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%);
  animation-delay: 1.7s;
}

@keyframes confettiFall {
  0% {
    transform: translateY(-10px) rotate(0deg) scale(0.5);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  100% {
    transform: translateY(800px) rotate(720deg) scale(1.2);
    opacity: 0;
  }
}

/* Responsive */
@media (max-width: 600px) {
  .game-header {
    flex-direction: column;
    gap: 1rem;
  }
  
  .game-stats {
    width: 100%;
    justify-content: space-between;
  }
  
  .puzzle-controls {
    flex-direction: column;
    align-items: center;
    gap: 1rem;
  }
  
  .image-grid {
    grid-template-columns: 1fr;
  }
}
</style>
