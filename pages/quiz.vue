<template>
  <div class="quiz-page">
    <!-- Icônes flottantes en arrière-plan -->
    <div class="floating-icons">
      <div class="floating-icon icon-code"><i class="bi bi-code-slash"></i></div>
      <div class="floating-icon icon-cpu"><i class="bi bi-cpu"></i></div>
      <div class="floating-icon icon-server"><i class="bi bi-server"></i></div>
      <div class="floating-icon icon-database"><i class="bi bi-database"></i></div>
      <div class="floating-icon icon-cloud"><i class="bi bi-cloud"></i></div>
      <div class="floating-icon icon-laptop"><i class="bi bi-laptop"></i></div>
      <div class="floating-icon icon-window"><i class="bi bi-window"></i></div>
      <div class="floating-icon icon-terminal"><i class="bi bi-terminal"></i></div>
      <div class="floating-icon icon-router"><i class="bi bi-router"></i></div>
      <div class="floating-icon icon-phone"><i class="bi bi-phone"></i></div>
      <div class="floating-icon icon-tablet"><i class="bi bi-tablet"></i></div>
      <div class="floating-icon icon-hdd"><i class="bi bi-hdd-network"></i></div>
      <div class="floating-icon icon-git"><i class="bi bi-git"></i></div>
      <div class="floating-icon icon-globe"><i class="bi bi-globe"></i></div>
      <div class="floating-icon icon-wifi"><i class="bi bi-wifi"></i></div>
      <div class="floating-icon icon-plugin"><i class="bi bi-plug"></i></div>
      <div class="floating-icon icon-shield"><i class="bi bi-shield-lock"></i></div>
      <div class="floating-icon icon-diagram"><i class="bi bi-diagram-3"></i></div>
      <div class="floating-icon icon-graph"><i class="bi bi-graph-up"></i></div>
      <div class="floating-icon icon-layers"><i class="bi bi-layers"></i></div>
      <div class="floating-icon icon-card"><i class="bi bi-credit-card-2-front"></i></div>
      <div class="floating-icon icon-pen"><i class="bi bi-pen"></i></div>
      <div class="floating-icon icon-display"><i class="bi bi-display"></i></div>
      <div class="floating-icon icon-brackets"><i class="bi bi-braces"></i></div>
    </div>
    
    <div class="page-header">
      <!-- Icônes animées du header -->
      <div class="header-icons">
        <div class="header-icon h-icon-1"><i class="bi bi-emoji-smile" style="color: rgba(46, 204, 113, 0.8);"></i></div>
        <div class="header-icon h-icon-2"><i class="bi bi-trophy" style="color: rgba(243, 156, 18, 0.8);"></i></div>
        <div class="header-icon h-icon-3"><i class="bi bi-question-circle" style="color: rgba(231, 76, 60, 0.8);"></i></div>
        <div class="header-icon h-icon-4"><i class="bi bi-star" style="color: rgba(155, 89, 182, 0.8);"></i></div>
        <div class="header-icon h-icon-5"><i class="bi bi-award" style="color: rgba(52, 152, 219, 0.8);"></i></div>
        <div class="header-icon h-icon-6"><i class="bi bi-lightning" style="color: rgba(241, 196, 15, 0.8);"></i></div>
        <div class="header-icon h-icon-7"><i class="bi bi-mortarboard" style="color: rgba(231, 76, 60, 0.8);"></i></div>
        <div class="header-icon h-icon-8"><i class="bi bi-patch-check" style="color: rgba(52, 152, 219, 0.8);"></i></div>
      </div>
      
      <div class="container">
        <h1 class="section-title">Quiz "Connais-tu Emmanuel ?"</h1>
        <p class="section-subtitle">Testez vos connaissances sur Emmanuel avec ce quiz amusant !</p>
      </div>
    </div>
    
    <div class="container">
      <div class="quiz-content">
        <div class="quiz-container">

          <!-- État de chargement -->
          <div v-if="isLoading" class="state-container loading-state">
            <div class="loading-spinner">
              <i class="bi bi-arrow-repeat"></i>
            </div>
            <h3>Chargement du quiz...</h3>
          </div>
          
          <!-- État d'erreur -->
          <div v-else-if="error" class="state-container error-state">
            <i class="bi bi-exclamation-circle"></i>
            <p>{{ error }}</p>
            <button @click="quizStore.initializeQuiz()" class="retry-btn">
              <i class="bi bi-arrow-repeat"></i> Réessayer
            </button>
          </div>

          <!-- Écran de démarrage -->
          <div v-else-if="!started && !isQuizCompleted" class="start-screen fade-in">
            <div class="quiz-card">
              <div class="card-header">
                <div class="card-header-icon">
                  <i class="bi bi-question-circle"></i>
                </div>
              </div>
              
              <h2 class="quiz-card-title">Prêt à tester vos connaissances ?</h2>
              <p class="quiz-description">Ce quiz comporte {{ questions?.length || 0 }} questions. Voyons combien vous en connaissez !</p>
              
              <div class="form-group">
                <label for="username" class="form-label">Entrez votre nom</label>
                <div class="input-wrapper">
                  <i class="bi bi-person"></i>
                  <input 
                    type="text" 
                    id="username" 
                    class="form-control" 
                    placeholder="Votre nom" 
                    v-model="username"
                    @keyup.enter="startQuiz"
                  />
                </div>
              </div>
              
              <div class="sound-toggle">
                <label class="toggle-label">
                  <span><i :class="`bi ${soundEnabled ? 'bi-volume-up' : 'bi-volume-mute'}`"></i> Sons</span>
                  <div class="toggle-switch">
                    <input type="checkbox" v-model="soundEnabled">
                    <span class="slider"></span>
                  </div>
                </label>
              </div>
              
              <button @click="startQuiz" class="start-button">
                <span class="button-content">
                  <i class="bi bi-play-fill"></i>
                  Commencer le quiz
                </span>
              </button>
            </div>
          </div>
          
          <!-- Affichage des questions -->
          <div v-else-if="started && !isQuizCompleted && currentQuestion" class="question-screen fade-in">
            <div class="quiz-progress">
              <div class="progress-bar-wrapper">
                <div class="progress-bar" :style="{width: `${(currentQuestionIndex / totalQuestions) * 100}%`}"></div>
              </div>
              <div class="progress-info">
                <span class="question-badge">Question {{ currentQuestionIndex + 1 }} / {{ totalQuestions }}</span>
                <span class="sound-control" @click="soundEnabled = !soundEnabled">
                  <i :class="`bi ${soundEnabled ? 'bi-volume-up' : 'bi-volume-mute'}`"></i>
                </span>
              </div>
            </div>
            
            <div class="question-card">
              <div class="question-header">
                <div class="question-category" :class="currentQuestion.difficulty">
                  {{ currentQuestion.category || 'Général' }} 
                  <span class="difficulty-indicator">
                    {{ currentQuestion.difficulty === 'facile' ? '★' : 
                       currentQuestion.difficulty === 'moyen' ? '★★' : '★★★' }}
                  </span>
                </div>
                <h2 class="question-text">{{ currentQuestion.question }}</h2>
              </div>
              
              <div class="options-container">
                <div 
                  v-for="(option, index) in currentQuestion.options" 
                  :key="index"
                  class="option-item"
                  :class="{
                    'selected': selectedAnswer === index,
                    'correct': showExplanation && index === currentQuestion.answer,
                    'incorrect': showExplanation && selectedAnswer === index && selectedAnswer !== currentQuestion.answer,
                    'animate-correct': animateCorrect && index === currentQuestion.answer,
                    'animate-incorrect': animateIncorrect && selectedAnswer === index && selectedAnswer !== currentQuestion.answer,
                    'disabled': showExplanation
                  }"
                  @click="!showExplanation && selectAnswer(index)"
                >
                  <div class="option-content">
                    <div class="option-letter">{{ ['A', 'B', 'C', 'D'][index] }}</div>
                    <div class="option-text">{{ option }}</div>
                  </div>
                  <div v-if="showExplanation && index === currentQuestion.answer" class="option-icon correct-icon">
                    <i class="bi bi-check-circle-fill"></i>
                  </div>
                  <div v-if="showExplanation && selectedAnswer === index && selectedAnswer !== currentQuestion.answer" class="option-icon incorrect-icon">
                    <i class="bi bi-x-circle-fill"></i>
                  </div>
                </div>
              </div>
              
              <div v-if="showExplanation" class="explanation-box">
                <div class="explanation-header">
                  <i class="bi bi-info-circle"></i> Explication
                </div>
                <div class="explanation-content">
                  {{ currentQuestion.explanation || 'La bonne réponse est ' + currentQuestion.options[currentQuestion.answer] + '.' }}
                </div>
              </div>
              
              <div class="question-controls">
                <button 
                  v-if="!showExplanation"
                  :disabled="selectedAnswer === -1"
                  @click="submitAnswer"
                  class="submit-button"
                >
                  Valider
                </button>
                
                <button 
                  v-else
                  @click="nextQuestion"
                  class="next-button"
                >
                  {{ currentQuestionIndex < totalQuestions - 1 ? 'Question suivante' : 'Voir mes résultats' }}
                  <i class="bi bi-arrow-right"></i>
                </button>
              </div>
            </div>
          </div>

          <!-- Écran de résultats -->
          <div v-else-if="isQuizCompleted || quizStore.quizCompleted" class="results-screen fade-in">
            <div class="quiz-card result-card">
              <div class="confetti-container">
                <div class="confetti confetti-1"></div>
                <div class="confetti confetti-2"></div>
                <div class="confetti confetti-3"></div>
                <div class="confetti confetti-4"></div>
                <div class="confetti confetti-5"></div>
                <div class="confetti confetti-6"></div>
              </div>

              <div class="result-header">
                <div class="result-header-icon">
                  <i class="bi bi-trophy"></i>
                </div>

                <div class="result-title">
                  <h2>Félicitations, {{ username || 'Anonyme' }} !</h2>
                  <p class="result-subtitle">Quiz terminé</p>
                </div>
              </div>

              <div class="score-display">
                <div class="score-circle">
                  <div class="score-number">{{ scorePercentage }}%</div>
                  <div class="score-fractional">{{ score }} / {{ totalQuestions }}</div>
                </div>
              </div>
              
              <div class="result-badge" :class="{ 
                'gold': badge.includes('Or'), 
                'silver': badge.includes('Argent'), 
                'bronze': badge.includes('Bronze'),
                'participant': badge.includes('Participant')
              }">
                <span class="badge-icon">{{ badge.split(' ')[0] }}</span>
                <span class="badge-name">{{ badge.split(' ')[1] }}</span>
              </div>

              <div class="result-stats">
                <div class="stat-item">
                  <div class="stat-icon"><i class="bi bi-stopwatch"></i></div>
                  <div class="stat-value">{{ formatTime(quizStore.elapsedTime) }}</div>
                  <div class="stat-label">Temps</div>
                </div>

                <div class="stat-item">
                  <div class="stat-icon"><i class="bi bi-lightning"></i></div>
                  <div class="stat-value">{{ Math.round((totalQuestions / (quizStore.elapsedTime || 1)) * 60) }}</div>
                  <div class="stat-label">Questions/min</div>
                </div>
              </div>

              <div class="result-message">
                <i v-if="scorePercentage >= 90" class="bi bi-emoji-laughing"></i>
                <i v-else-if="scorePercentage >= 70" class="bi bi-emoji-smile"></i>
                <i v-else-if="scorePercentage >= 50" class="bi bi-emoji-neutral"></i>
                <i v-else class="bi bi-emoji-frown"></i>

                <p v-if="scorePercentage >= 90">
                  Incroyable ! Vous connaissez Emmanuel comme votre poche !
                </p>
                <p v-else-if="scorePercentage >= 70">
                  Bravo ! Vous connaissez très bien Emmanuel !
                </p>
                <p v-else-if="scorePercentage >= 50">
                  Pas mal ! Vous connaissez assez bien Emmanuel.
                </p>
                <p v-else>
                  Continuez à apprendre à connaître Emmanuel !
                </p>
              </div>

              <div class="result-actions">
                <button @click="resetQuiz" class="retry-button">
                  <i class="bi bi-arrow-repeat"></i> Recommencer
                </button>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, computed, ref, watch } from 'vue';
import { useQuizStore } from '~/stores/quiz';

// Store quiz
const quizStore = useQuizStore();

// Propriétés du store
const questions = computed(() => quizStore.questions);
const currentQuestion = computed(() => quizStore.currentQuestion);
const currentQuestionIndex = computed(() => quizStore.currentQuestionIndex);
const isQuizCompleted = computed(() => quizStore.isQuizCompleted);
const score = computed(() => quizStore.score);
const badge = computed(() => quizStore.badge);
const scorePercentage = computed(() => quizStore.scorePercentage);
const isLoading = computed(() => quizStore.isLoading);
const error = computed(() => quizStore.error);
const totalQuestions = computed(() => quizStore.totalQuestions);

// Variables locales
const username = computed({
  get: () => quizStore.username,
  set: (value) => quizStore.setUsername(value)
});
const started = ref(false);
const selectedAnswer = ref(-1);
const showExplanation = ref(false);
const animateCorrect = ref(false);
const animateIncorrect = ref(false);
const soundEnabled = ref(true);

// Sons du quiz
const sounds = {
  correct: new Audio('/sounds/correct.mp3'),
  incorrect: new Audio('/sounds/incorrect.mp3'),
  complete: new Audio('/sounds/complete.mp3'),
  click: new Audio('/sounds/click.mp3'),
  start: new Audio('/sounds/start.mp3')
};

// Jouer un son
const playSound = (soundName) => {
  if (!soundEnabled.value) return;
  
  try {
    sounds[soundName].currentTime = 0;
    sounds[soundName].play();
  } catch(e) {
    console.error('Erreur lors de la lecture du son:', e);
  }
};

// Format time (seconds) to mm:ss
const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
};

// Démarrer le quiz
const startQuiz = () => {
  if (!username.value) {
    username.value = 'Anonyme';
  }
  quizStore.setUsername(username.value);
  started.value = true;
  selectedAnswer.value = -1;
  showExplanation.value = false;
  playSound('start');
};

// Sélectionner une réponse
const selectAnswer = (index) => {
  if (selectedAnswer.value === index) {
    selectedAnswer.value = -1; // Désélectionner
  } else {
    selectedAnswer.value = index; // Sélectionner
    playSound('click');
  }
};

// Soumettre une réponse
const submitAnswer = () => {
  if (selectedAnswer.value === -1) return;
  showExplanation.value = true;
  
  // Animer la bonne/mauvaise réponse
  if (selectedAnswer.value === currentQuestion.value.answer) {
    animateCorrect.value = true;
    playSound('correct');
    setTimeout(() => {
      animateCorrect.value = false;
    }, 1500);
  } else {
    animateIncorrect.value = true;
    playSound('incorrect');
    setTimeout(() => {
      animateIncorrect.value = false;
    }, 1500);
  }
  
  // Enregistrer la réponse dans le store 
  // Mais sans passer à la question suivante automatiquement
  userAnswers.value[currentQuestionIndex.value] = selectedAnswer.value;
};

// Passer à la question suivante
const nextQuestion = () => {
  if (currentQuestionIndex.value < totalQuestions.value - 1) {
    // Utiliser la méthode du store pour passer à la question suivante
    quizStore.submitAnswer(selectedAnswer.value);
    showExplanation.value = false;
    selectedAnswer.value = -1; // Réinitialiser la réponse sélectionnée
    playSound('click');
  } else {
    // Fin du quiz - s'assurer que toutes les réponses sont enregistrées avant de terminer
    quizStore.submitAnswer(selectedAnswer.value); // Soumettre la dernière réponse
    showExplanation.value = false;
    // On utilise directement le store pour afficher l'écran de fin
    quizStore.completeQuiz();
    playSound('complete');
  }
};

// Réinitialiser le quiz
const resetQuiz = () => {
  quizStore.resetQuiz();
  started.value = false;
  selectedAnswer.value = -1;
  showExplanation.value = false;
  playSound('click');
};

// Réagir aux changements d'index de question du store
watch(() => quizStore.currentQuestionIndex, (newIndex) => {
  // Mettre à jour l'index local lorsque le store change
  if (currentQuestionIndex.value !== newIndex) {
    currentQuestionIndex.value = newIndex;
  }
});

// Initialisation du quiz
onMounted(() => {
  // S'assurer que les sons sont préchargés
  Object.values(sounds).forEach(sound => {
    sound.load();
  });
  
  // Initialisation locale des données sans utiliser d'API
  quizStore.initializeQuiz();
});
</script>

<style scoped>
/* Mise en page globale */
.quiz-page {
  position: relative;
  min-height: 100vh;
  padding-bottom: 5rem;
  background: #f9f9f9;
  overflow-x: hidden;
}

/* Animations d'arrière-plan */
.floating-icons {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  overflow: hidden;
  pointer-events: none;
}

.floating-icon {
  position: absolute;
  opacity: 0.05;
  font-size: 3rem;
  animation: float 15s infinite ease-in-out;
}

.icon-code { top: 10%; left: 5%; animation-delay: 0s; }
.icon-cpu { top: 30%; left: 15%; animation-delay: 2s; }
.icon-server { top: 65%; left: 8%; animation-delay: 1s; }
.icon-database { top: 80%; left: 20%; animation-delay: 3s; }
.icon-cloud { top: 15%; right: 10%; animation-delay: 2.5s; }
.icon-laptop { top: 45%; right: 5%; animation-delay: 1.5s; }
.icon-terminal { top: 75%; right: 15%; animation-delay: 0.5s; }
.icon-globe { top: 90%; right: 25%; animation-delay: 3.5s; }
.icon-window { top: 25%; left: 25%; animation-delay: 4s; }
.icon-router { top: 85%; left: 35%; animation-delay: 3.2s; }
.icon-phone { top: 55%; right: 30%; animation-delay: 2.8s; }
.icon-tablet { top: 40%; right: 20%; animation-delay: 1.3s; }
.icon-hdd { top: 70%; right: 40%; animation-delay: 4.5s; }
.icon-git { top: 20%; right: 38%; animation-delay: 5s; }
.icon-wifi { top: 60%; left: 30%; animation-delay: 2.7s; }
.icon-plugin { top: 33%; left: 42%; animation-delay: 3.7s; }
.icon-shield { top: 77%; right: 8%; animation-delay: 2.2s; }
.icon-diagram { top: 18%; left: 38%; animation-delay: 5.2s; }
.icon-graph { top: 52%; right: 22%; animation-delay: 1.8s; }
.icon-layers { top: 67%; left: 12%; animation-delay: 4.2s; }
.icon-card { top: 22%; right: 15%; animation-delay: 3.3s; }
.icon-pen { top: 48%; left: 22%; animation-delay: 2.3s; }
.icon-display { top: 88%; right: 32%; animation-delay: 4.7s; }
.icon-brackets { top: 37%; right: 45%; animation-delay: 3.9s; }

@keyframes float {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  25% { transform: translateY(-15px) rotate(5deg); }
  50% { transform: translateY(0) rotate(0deg); }
  75% { transform: translateY(15px) rotate(-5deg); }
}

/* Header */
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
              radial-gradient(circle at 80% 20%, rgba(241, 196, 15, 0.3), transparent 60%);
  opacity: 0.5;
  z-index: 0;
}

.header-icons {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  pointer-events: none;
}

.header-icon {
  position: absolute;
  font-size: 2.5rem;
  opacity: 0.7;
  transform-origin: center;
  animation: pulse 8s infinite ease-in-out;
  filter: drop-shadow(0 0 10px rgba(0, 0, 0, 0.2));
}

.h-icon-1 { top: 15%; left: 15%; animation-delay: 0s; }
.h-icon-2 { top: 20%; right: 20%; animation-delay: 1s; }
.h-icon-3 { top: 60%; left: 25%; animation-delay: 2s; }
.h-icon-4 { top: 65%; right: 25%; animation-delay: 3s; }
.h-icon-5 { top: 40%; left: 10%; animation-delay: 1.5s; }
.h-icon-6 { top: 35%; right: 10%; animation-delay: 2.5s; }
.h-icon-7 { top: 25%; left: 30%; animation-delay: 3.5s; }
.h-icon-8 { top: 70%; right: 15%; animation-delay: 0.5s; }

@keyframes pulse {
  0%, 100% { transform: scale(1); opacity: 0.7; }
  50% { transform: scale(1.05); opacity: 0.85; }
}

.section-title {
  position: relative;
  font-size: 3.2rem;
  font-weight: bold;
  margin-bottom: 0.8rem;
  color: white;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  z-index: 2;
}

.section-subtitle {
  position: relative;
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.8);
  max-width: 600px;
  margin: 0 auto;
  z-index: 2;
}

/* Conteneurs */
.quiz-content {
  max-width: 900px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

.quiz-container {
  position: relative;
  min-height: 500px;
}

/* Animation de fondu */
.fade-in {
  animation: fadeIn 0.5s ease-in;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(15px); }
  to { opacity: 1; transform: translateY(0); }
}

/* États */
.state-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  border-radius: 1.2rem;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1), 0 4px 10px rgba(0, 0, 0, 0.05);
  background: white;
  text-align: center;
  overflow: hidden;
}

.loading-spinner i {
  font-size: 3.5rem;
  color: #3498db;
  animation: spin 1.5s infinite linear;
  filter: drop-shadow(0 2px 5px rgba(52, 152, 219, 0.3));
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-state i {
  font-size: 3.5rem;
  color: #e74c3c;
  margin-bottom: 1.5rem;
  filter: drop-shadow(0 2px 5px rgba(231, 76, 60, 0.3));
}

.retry-btn {
  background: linear-gradient(45deg, #3498db, #2980b9);
  color: white;
  border: none;
  border-radius: 2rem;
  padding: 0.8rem 1.8rem;
  font-size: 1.1rem;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s;
  margin-top: 1.5rem;
  box-shadow: 0 4px 15px rgba(52, 152, 219, 0.3);
}

.retry-btn:hover {
  background: linear-gradient(45deg, #2980b9, #2573a7);
  transform: translateY(-3px);
  box-shadow: 0 6px 20px rgba(52, 152, 219, 0.4);
}

/* Écran de démarrage */
.start-screen .quiz-card, 
.results-screen .quiz-card {
  background: white;
  border-radius: 1.2rem;
  box-shadow: 0 15px 50px rgba(0, 0, 0, 0.1), 0 5px 15px rgba(0, 0, 0, 0.05);
  padding: 2.5rem;
  max-width: 650px;
  margin: 0 auto;
  text-align: center;
  position: relative;
  overflow: hidden;
  transform-style: preserve-3d;
  transition: transform 0.3s, box-shadow 0.3s;
}

.card-header {
  margin-bottom: 1.5rem;
}

.card-header-icon {
  width: 90px;
  height: 90px;
  background: linear-gradient(45deg, #3498db, #9b59b6);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  box-shadow: 0 10px 25px rgba(52, 152, 219, 0.4);
  transform: translateZ(10px);
  position: relative;
  z-index: 1;
}

.card-header-icon::before {
  content: '';
  position: absolute;
  top: -5px;
  left: -5px;
  right: -5px;
  bottom: -5px;
  background: linear-gradient(135deg, rgba(52, 152, 219, 0.4), rgba(155, 89, 182, 0.4));
  border-radius: 50%;
  z-index: -1;
  filter: blur(15px);
  opacity: 0.6;
}

.card-header-icon i {
  font-size: 3rem;
  color: white;
  filter: drop-shadow(0 2px 5px rgba(0, 0, 0, 0.2));
}

.quiz-card-title {
  font-size: 2rem;
  margin-bottom: 1rem;
  font-weight: 700;
  background: linear-gradient(45deg, #3498db, #9b59b6);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  display: inline-block;
}

.quiz-description {
  color: #666;
  margin-bottom: 2.5rem;
  font-size: 1.2rem;
  line-height: 1.6;
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
  position: relative;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-label {
  display: block;
  text-align: left;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #555;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-wrapper i {
  position: absolute;
  left: 1rem;
  color: #777;
}

.form-control {
  width: 100%;
  padding: 0.8rem 1rem 0.8rem 2.5rem;
  border: 1px solid #ddd;
  border-radius: 0.5rem;
  font-size: 1rem;
  transition: all 0.2s;
}

.form-control:focus {
  border-color: #3498db;
  box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
  outline: none;
}

.sound-toggle {
  display: flex;
  justify-content: center;
  margin-bottom: 1.5rem;
}

.toggle-label {
  display: flex;
  align-items: center;
  cursor: pointer;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: #555;
}

.toggle-switch {
  position: relative;
  display: inline-block;
  width: 50px;
  height: 24px;
  margin-left: 0.5rem;
}

.toggle-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: .4s;
  border-radius: 24px;
}

.slider:before {
  position: absolute;
  content: "";
  height: 16px;
  width: 16px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  transition: .4s;
  border-radius: 50%;
}

input:checked + .slider {
  background-color: #3498db;
}

input:checked + .slider:before {
  transform: translateX(26px);
}

.start-button {
  background: linear-gradient(45deg, #3498db, #9b59b6);
  color: white;
  border: none;
  border-radius: 1rem;
  padding: 1.1rem 2rem;
  font-size: 1.2rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: block;
  width: 100%;
  position: relative;
  overflow: hidden;
  box-shadow: 0 8px 25px rgba(52, 152, 219, 0.3);
  letter-spacing: 0.5px;
}

.start-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0) 100%);
  transform: translateX(-100%);
  transition: transform 0.6s ease;
}

.start-button:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 30px rgba(52, 152, 219, 0.5);
}

.start-button:hover::before {
  transform: translateX(100%);
}

.start-button:active {
  transform: translateY(-2px);
}

.button-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.8rem;
  position: relative;
  z-index: 1;
}

/* Écran de questions */
.question-screen {
  max-width: 800px;
  margin: 0 auto;
}

.quiz-progress {
  margin-bottom: 1.5rem;
}

.progress-bar-wrapper {
  width: 100%;
  height: 8px;
  background-color: #eee;
  border-radius: 4px;
  overflow: hidden;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
}

.progress-bar {
  height: 100%;
  background: linear-gradient(to right, #3498db, #9b59b6);
  transition: width 0.3s ease;
}

.progress-info {
  display: flex;
  justify-content: space-between;
  margin-top: 0.5rem;
  color: #777;
  font-size: 0.9rem;
}

.sound-control {
  cursor: pointer;
  transition: color 0.2s;
}

.sound-control:hover {
  color: #3498db;
}

.question-card {
  background: white;
  border-radius: 1.2rem;
  box-shadow: 0 15px 50px rgba(0, 0, 0, 0.1), 0 5px 15px rgba(0, 0, 0, 0.05);
  padding: 2.5rem;
  margin-bottom: 2rem;
  position: relative;
  overflow: hidden;
  transform-style: preserve-3d;
  transition: transform 0.3s, box-shadow 0.3s;
}

.question-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 7px;
  background: linear-gradient(90deg, #3498db, #9b59b6);
  z-index: 1;
}

.question-header {
  margin-bottom: 2rem;
  text-align: center;
}

.question-category {
  display: inline-block;
  padding: 0.4rem 1.2rem;
  border-radius: 2rem;
  font-size: 0.9rem;
  font-weight: 600;
  margin-bottom: 1.2rem;
  letter-spacing: 0.5px;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.05);
  position: relative;
}

.question-category.facile {
  background-color: rgba(46, 204, 113, 0.1);
  color: #27ae60;
}

.question-category.moyen {
  background-color: rgba(241, 196, 15, 0.1);
  color: #f39c12;
}

.question-category.difficile {
  background-color: rgba(231, 76, 60, 0.1);
  color: #e74c3c;
}

.difficulty-indicator {
  margin-left: 0.5rem;
  font-size: 0.8rem;
}

.question-text {
  font-size: 1.6rem;
  line-height: 1.5;
  margin-bottom: 2.2rem;
  color: #333;
  font-weight: 600;
  position: relative;
  padding: 0 1rem;
}

.question-text::after {
  content: '';
  position: absolute;
  bottom: -1rem;
  left: 50%;
  transform: translateX(-50%);
  width: 50px;
  height: 3px;
  background: linear-gradient(90deg, #3498db, #9b59b6);
  border-radius: 3px;
}

.options-container {
  display: grid;
  gap: 1rem;
  margin-bottom: 2rem;
}

.option-item {
  position: relative;
  padding: 1.2rem 1.5rem;
  border: 2px solid #eee;
  border-radius: 1rem;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.02);
  margin-bottom: 0.5rem;
  overflow: hidden;
}

.option-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 0;
  background: linear-gradient(180deg, #3498db, #9b59b6);
  transition: height 0.3s ease;
}

.option-item:hover:not(.disabled) {
  border-color: #3498db;
  background-color: rgba(52, 152, 219, 0.05);
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(52, 152, 219, 0.1);
}

.option-item:hover:not(.disabled)::before {
  height: 100%;
}

.option-item.selected:not(.correct):not(.incorrect) {
  border-color: #3498db;
  background-color: rgba(52, 152, 219, 0.1);
}

.option-item.correct {
  border-color: #2ecc71;
  background-color: rgba(46, 204, 113, 0.1);
}

.option-item.incorrect {
  border-color: #e74c3c;
  background-color: rgba(231, 76, 60, 0.1);
}

.option-item.disabled {
  cursor: default;
  opacity: 0.7;
}

.option-content {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.option-letter {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.2rem;
  height: 2.2rem;
  border-radius: 50%;
  background-color: #f5f5f5;
  font-weight: 700;
  color: #444;
  flex-shrink: 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  margin-right: 0.5rem;
  transition: all 0.3s;
  position: relative;
  z-index: 1;
}

.option-item:hover:not(.disabled) .option-letter {
  background-color: #3498db;
  color: white;
}

.option-text {
  font-size: 1.1rem;
  color: #444;
}

.option-icon {
  font-size: 1.3rem;
}

.correct-icon {
  color: #2ecc71;
}

.incorrect-icon {
  color: #e74c3c;
}

.animate-correct {
  animation: correct-animation 1.5s;
}

.animate-incorrect {
  animation: incorrect-animation 1.5s;
}

@keyframes correct-animation {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); box-shadow: 0 0 15px rgba(46, 204, 113, 0.5); }
}

@keyframes incorrect-animation {
  0%, 100% { transform: scale(1); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
  20%, 40%, 60%, 80% { transform: translateX(5px); }
}

.explanation-box {
  background-color: #f8f9fa;
  border-left: 4px solid #3498db;
  padding: 1rem 1.5rem;
  margin: 1.5rem 0;
  border-radius: 0 0.5rem 0.5rem 0;
}

.explanation-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  color: #3498db;
  margin-bottom: 0.5rem;
}

.explanation-content {
  color: #555;
  line-height: 1.5;
}

.question-controls {
  display: flex;
  justify-content: center;
  margin-top: 1.5rem;
}

.submit-button, .next-button {
  padding: 1rem 2.5rem;
  border: none;
  border-radius: 1rem;
  font-size: 1.2rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  letter-spacing: 0.5px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  z-index: 1;
}

.submit-button::before, .next-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0) 100%);
  transform: translateX(-100%);
  transition: transform 0.6s ease;
  z-index: -1;
}

.submit-button {
  background: linear-gradient(45deg, #3498db, #2980b9);
  color: white;
}

.submit-button:disabled {
  background: #ccc;
  cursor: not-allowed;
  opacity: 0.7;
  box-shadow: none;
}

.submit-button:not(:disabled):hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 30px rgba(52, 152, 219, 0.3);
}

.submit-button:hover::before, .next-button:hover::before {
  transform: translateX(100%);
}

.next-button {
  background: linear-gradient(45deg, #2ecc71, #27ae60);
  color: white;
  display: flex;
  align-items: center;
  gap: 0.8rem;
}

.next-button:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 30px rgba(46, 204, 113, 0.3);
}

/* Écran de résultats */
.result-card {
  position: relative;
  overflow: hidden;
}

.confetti-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  overflow: hidden;
}

.confetti {
  position: absolute;
  width: 10px;
  height: 10px;
  border-radius: 0;
  opacity: 0.7;
}

.confetti-1 { background-color: #f1c40f; top: 7%; left: 15%; animation: confetti-fall 7s infinite linear; }
.confetti-2 { background-color: #3498db; top: 10%; right: 10%; animation: confetti-fall 6s infinite linear; }
.confetti-3 { background-color: #e74c3c; top: 20%; left: 30%; animation: confetti-fall 8s infinite linear; }
.confetti-4 { background-color: #2ecc71; top: 5%; right: 30%; animation: confetti-fall 10s infinite linear; }
.confetti-5 { background-color: #9b59b6; top: 15%; left: 60%; animation: confetti-fall 7s infinite linear; }
.confetti-6 { background-color: #f39c12; top: 10%; right: 60%; animation: confetti-fall 9s infinite linear; }

@keyframes confetti-fall {
  0% { transform: translateY(0) rotate(0deg); }
  100% { transform: translateY(1000px) rotate(720deg); }
}

.result-header {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 2rem;
}

.result-header-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  background: linear-gradient(45deg, #f39c12, #e74c3c);
  border-radius: 50%;
  margin-bottom: 1rem;
  box-shadow: 0 8px 20px rgba(243, 156, 18, 0.3);
}

.result-header-icon i {
  font-size: 2.5rem;
  color: white;
}

.result-title h2 {
  font-size: 1.8rem;
  margin-bottom: 0.5rem;
  color: #333;
}

.result-subtitle {
  color: #777;
  font-size: 1.1rem;
}

.score-display {
  position: relative;
  z-index: 1;
  margin: 1.5rem 0;
}

.score-circle {
  width: 180px;
  height: 180px;
  border-radius: 50%;
  background: linear-gradient(45deg, #3498db, #9b59b6);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  color: white;
  box-shadow: 0 12px 40px rgba(52, 152, 219, 0.4);
  position: relative;
  transform: translateZ(10px);
}

.score-circle::before {
  content: '';
  position: absolute;
  top: -8px;
  left: -8px;
  right: -8px;
  bottom: -8px;
  background: linear-gradient(135deg, rgba(52, 152, 219, 0.4), rgba(155, 89, 182, 0.4));
  border-radius: 50%;
  z-index: -1;
  filter: blur(15px);
  opacity: 0.6;
}

.score-number {
  font-size: 3.2rem;
  font-weight: bold;
  line-height: 1;
  letter-spacing: 1px;
  text-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}

.score-fractional {
  font-size: 1.2rem;
  opacity: 0.9;
  margin-top: 0.5rem;
  font-weight: 500;
}

.result-badge {
  display: inline-block;
  padding: 0.7rem 2rem;
  border-radius: 2rem;
  font-weight: 700;
  margin: 1.5rem auto;
  display: flex;
  align-items: center;
  gap: 0.8rem;
  width: fit-content;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
  position: relative;
  transition: all 0.3s ease;
  transform-style: preserve-3d;
  transform: translateZ(5px);
}

.result-badge::before {
  content: '';
  position: absolute;
  top: -5px;
  left: -5px;
  right: -5px;
  bottom: -5px;
  border-radius: 2rem;
  z-index: -1;
  filter: blur(10px);
  opacity: 0.4;
  transition: all 0.3s ease;
}

.result-badge.gold {
  background-color: rgba(241, 196, 15, 0.15);
  color: #f39c12;
  border: 2px solid rgba(241, 196, 15, 0.3);
}

.result-badge.gold::before {
  background: rgba(241, 196, 15, 0.3);
}

.result-badge.silver {
  background-color: rgba(189, 195, 199, 0.15);
  color: #7f8c8d;
  border: 2px solid rgba(189, 195, 199, 0.3);
}

.result-badge.silver::before {
  background: rgba(189, 195, 199, 0.3);
}

.result-badge.bronze {
  background-color: rgba(211, 84, 0, 0.15);
  color: #d35400;
  border: 2px solid rgba(211, 84, 0, 0.3);
}

.result-badge.bronze::before {
  background: rgba(211, 84, 0, 0.3);
}

.result-badge.participant {
  background-color: rgba(41, 128, 185, 0.15);
  color: #2980b9;
  border: 2px solid rgba(41, 128, 185, 0.3);
}

.result-badge.participant::before {
  background: rgba(41, 128, 185, 0.3);
}

.result-stats {
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin: 2rem 0;
}

.stat-item {
  text-align: center;
}

.stat-icon {
  font-size: 1.8rem;
  color: #3498db;
  margin-bottom: 0.5rem;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 600;
  color: #333;
}

.stat-label {
  font-size: 0.9rem;
  color: #777;
}

.result-message {
  margin: 2rem 0;
  padding: 1rem;
  text-align: center;
  color: #555;
  line-height: 1.6;
}

.result-message i {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  color: #3498db;
}

.result-actions {
  display: flex;
  justify-content: center;
  margin-top: 2rem;
}

.retry-button {
  background: linear-gradient(45deg, #3498db, #9b59b6);
  color: white;
  border: none;
  border-radius: 1rem;
  padding: 1rem 2.5rem;
  font-size: 1.2rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.8rem;
  box-shadow: 0 8px 25px rgba(52, 152, 219, 0.3);
  position: relative;
  overflow: hidden;
  letter-spacing: 0.5px;
  z-index: 1;
}

.retry-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0) 100%);
  transform: translateX(-100%);
  transition: transform 0.6s ease;
}

.retry-button:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 30px rgba(52, 152, 219, 0.5);
}

.retry-button:hover::before {
  transform: translateX(100%);
}

/* Responsive design */
@media (max-width: 768px) {
  .section-title {
    font-size: 2.4rem;
  }
  
  .section-subtitle {
    font-size: 1.1rem;
    padding: 0 1rem;
  }
  
  .quiz-content {
    padding: 0 0.7rem;
    max-width: 100%;
  }
  
  .quiz-card, .question-card {
    padding: 2rem;
    border-radius: 1rem;
    width: calc(100% - 1rem);
    max-width: 100%;
    margin-left: auto;
    margin-right: auto;
  }
  
  .card-header-icon {
    width: 80px;
    height: 80px;
  }
  
  .card-header-icon i {
    font-size: 2.5rem;
  }
  
  .quiz-card-title {
    font-size: 1.8rem;
  }
  
  .question-text {
    font-size: 1.4rem;
    padding: 0;
  }
  
  .option-item {
    padding: 1rem 1.2rem;
  }
  
  .option-letter {
    width: 2rem;
    height: 2rem;
    font-size: 0.9rem;
  }
  
  .option-text {
    font-size: 1rem;
  }
  
  .submit-button, .next-button, .retry-button {
    padding: 0.9rem 2rem;
    font-size: 1.1rem;
  }
  
  .score-circle {
    width: 150px;
    height: 150px;
  }
  
  .score-number {
    font-size: 2.8rem;
  }
  
  .result-stats {
    gap: 1rem;
  }
  
  .floating-icon, .header-icon {
    font-size: 1.8rem;
  }
  
  .result-badge {
    padding: 0.6rem 1.8rem;
  }
}

@media (max-width: 480px) {
  .page-header {
    padding: 2rem 0;
  }
  
  .section-title {
    font-size: 1.8rem;
  }
  
  .section-subtitle {
    font-size: 1rem;
  }
  
  .quiz-content {
    padding: 0;
    margin: 0;
    width: 100%;
  }
  
  .quiz-card, .question-card {
    padding: 1.5rem;
    border-radius: 0.8rem;
    width: 100%;
    max-width: 100%;
    margin-left: 0;
    margin-right: 0;
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
  }
  
  .question-text {
    font-size: 1.1rem;
    padding: 0;
    margin-bottom: 1.5rem;
  }
  
  .option-item {
    padding: 0.8rem 1rem;
    margin-bottom: 0.7rem;
  }
  
  .option-letter {
    width: 1.5rem;
    height: 1.5rem;
    font-size: 0.8rem;
    margin-right: 0.3rem;
  }
  
  .option-text {
    font-size: 0.95rem;
    line-height: 1.4;
  }
  
  .submit-button, .next-button, .retry-button {
    padding: 0.7rem 1.5rem;
    font-size: 1rem;
    width: 100%;
    border-radius: 0.8rem;
  }
  
  .question-controls {
    width: 100%;
  }
  
  .card-header-icon {
    width: 60px;
    height: 60px;
  }
  
  .card-header-icon i {
    font-size: 1.8rem;
  }
  
  .quiz-card-title {
    font-size: 1.5rem;
  }
  
  .quiz-description {
    font-size: 1rem;
  }
  
  .result-header-icon {
    width: 60px;
    height: 60px;
  }
  
  .result-header-icon i {
    font-size: 1.8rem;
  }
  
  .score-circle {
    width: 120px;
    height: 120px;
  }
  
  .score-number {
    font-size: 2rem;
  }
  
  .score-fractional {
    font-size: 0.9rem;
  }
  
  .result-badge {
    padding: 0.5rem 1.2rem;
    font-size: 0.9rem;
  }
  
  .result-stats {
    flex-direction: column;
    gap: 1.5rem;
  }
  
  .floating-icon, .header-icon {
    display: none;
  }
  
  .explanation-box {
    padding: 0.8rem;
    margin: 1rem 0;
  }
  
  .explanation-content {
    font-size: 0.9rem;
  }
}
</style>
