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
      <div class="floating-icon icon-terminal"><i class="bi bi-terminal"></i></div>
      <div class="floating-icon icon-globe"><i class="bi bi-globe"></i></div>
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
      </div>
      
      <div class="container">
        <h1 class="section-title">Quiz "Connais-tu Emmanuel ?"</h1>
        <p class="section-subtitle">Testez vos connaissances sur Emmanuel avec ce quiz amusant !</p>
      </div>
    </div>
    
    <div class="container">
      <div class="quiz-content">
        <div class="quiz-container">
          <!-- Loading state -->
          <div v-if="isLoading" class="state-container loading-state">
            <div class="loading-spinner">
              <i class="bi bi-arrow-repeat"></i>
            </div>
            <p>Chargement du quiz...</p>
          </div>
          
          <!-- Error state -->
          <div v-else-if="error" class="state-container error-state">
            <i class="bi bi-exclamation-circle"></i>
            <p>{{ error }}</p>
            <button @click="quizStore.initializeQuiz()" class="retry-btn">
              <i class="bi bi-arrow-repeat"></i> Réessayer
            </button>
          </div>
          
          <!-- Quiz start screen -->
          <div v-else-if="!started" class="quiz-card">
            <div class="card-header">
              <div class="card-header-icon">
                <i class="bi bi-puzzle"></i>
              </div>
              <h3 class="card-header-title">Quiz "Connais-tu Emmanuel ?"</h3>
            </div>
            <div class="card-content text-center">
              <div class="start-screen-illustration">
                <div class="question-marks">
                  <i class="bi bi-question-circle-fill q-mark q1"></i>
                  <i class="bi bi-question-circle-fill q-mark q2"></i>
                  <i class="bi bi-question-circle-fill q-mark q3"></i>
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
                    v-model="username" 
                    class="form-input" 
                    placeholder="Votre nom" 
                    required
                  />
                </div>
              </div>
              
              <button 
                @click="startQuiz" 
                class="start-button" 
                :disabled="!username"
              >
                <i class="bi bi-controller"></i>
                Commencer le Quiz
              </button>
              
              <div class="quiz-stats">
                <div class="stat-item">
                  <i class="bi bi-people"></i>
                  <span>{{ topResults.length }} participants</span>
                </div>
                <div class="stat-item">
                  <i class="bi bi-trophy"></i>
                  <span>{{ topResults.length > 0 ? topResults[0].username : 'Soyez le premier!' }}</span>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Quiz questions -->
          <div v-else-if="!manualCompleted && !isQuizCompleted && currentQuestion" class="fade-in">
            <div class="question-header">
              <span class="question-badge">Question {{ currentQuestionIndex + 1 }} / {{ questions?.length || 0 }}</span>
            </div>
            
            <QuizCard 
              :question="currentQuestion" 
              :is-last-question="currentQuestionIndex === (questions?.length || 0) - 1"
              @answer-selected="submitAnswer"
              @quiz-completed="completeQuiz"
            />
          </div>
          
          <!-- Quiz results -->
          <div v-else-if="manualCompleted || isQuizCompleted" class="quiz-result fade-in">
            <div class="quiz-card">
              <div class="card-header">
                <div class="card-header-icon">
                  <i class="bi bi-award"></i>
                </div>
                <h3 class="card-header-title">Résultats du Quiz</h3>
              </div>
              <div class="card-content text-center">
                <div class="result-confetti">
                  <i class="confetti c1 bi bi-star-fill"></i>
                  <i class="confetti c2 bi bi-star-fill"></i>
                  <i class="confetti c3 bi bi-star-fill"></i>
                  <i class="confetti c4 bi bi-star-fill"></i>
                  <i class="confetti c5 bi bi-star-fill"></i>
                </div>
                
                <p class="result-name">{{ username }}, vous avez obtenu:</p>
                
                <div class="score-display">
                  <span class="score-value">{{ score }} / {{ questions?.length || 0 }}</span>
                </div>
                
                <div class="result-progress">
                  <div class="progress-track">
                    <div class="progress-bar" :style="{width: `${(score / (questions?.length || 1)) * 100}%`}"></div>
                  </div>
                  <div class="progress-labels">
                    <span>0</span>
                    <span>{{ (questions?.length || 0) / 2 }}</span>
                    <span>{{ questions?.length || 0 }}</span>
                  </div>
                </div>
                
                <div class="quiz-badge">
                  {{ badge }}
                </div>
                
                <p class="result-message">
                  <span v-if="score === (questions?.length || 0)">
                    <i class="bi bi-emoji-laughing"></i> Parfait ! Vous connaissez vraiment bien Emmanuel !
                  </span>
                  <span v-else-if="score >= (questions?.length || 0) * 0.7">
                    <i class="bi bi-emoji-smile"></i> Bravo ! Vous connaissez très bien Emmanuel !
                  </span>
                  <span v-else-if="score >= (questions?.length || 0) * 0.4">
                    <i class="bi bi-emoji-neutral"></i> Pas mal ! Vous connaissez assez bien Emmanuel.
                  </span>
                  <span v-else>
                    <i class="bi bi-emoji-expressionless"></i> Vous avez encore des choses à découvrir sur Emmanuel !
                  </span>
                </p>
                
                <div class="button-group">
                  <button @click="resetQuiz" class="start-button">
                    <i class="bi bi-arrow-repeat"></i>
                    Recommencer
                  </button>
                </div>
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

// Get quiz store
const quizStore = useQuizStore();

// Computed properties
const questions = computed(() => quizStore.questions);
const currentQuestion = computed(() => quizStore.currentQuestion);
const currentQuestionIndex = computed(() => quizStore.currentQuestionIndex);
const isQuizCompleted = computed(() => quizStore.isQuizCompleted);
const score = computed(() => quizStore.score);
const badge = computed(() => quizStore.badge);
const isLoading = computed(() => quizStore.isLoading);
const error = computed(() => quizStore.error);
const username = computed({
  get: () => quizStore.username,
  set: (value) => quizStore.setUsername(value)
});
// Meilleurs scores supprimés car plus de backend

// State
const started = ref(false);
const manualCompleted = ref(false);

// Fetch quiz questions
onMounted(() => {
  // Initialisation locale des données sans utiliser d'API
  quizStore.initializeQuiz();
  // fetchTopResults supprimé car plus de backend
});

// Cette fonction a été supprimée car les questions sont déjà dans le store
// plus besoin de fetchQuestions car c'est 100% frontend

// Start the quiz
const startQuiz = () => {
  if (!username.value) return;
  started.value = true;
};

// Submit an answer
const submitAnswer = async (answerIndex) => {
  // Appeler le store et récupérer le résultat du serveur
  const result = await quizStore.submitAnswer(answerIndex);
  // Renvoyer le résultat au QuizCard
  return result;
};

// Reset quiz
const resetQuiz = () => {
  quizStore.resetQuiz();
  started.value = false;
};

// Watcher pour détecter la fin du quiz et soumettre les résultats
watch(isQuizCompleted, async (newValue) => {
  if (newValue === true) {
    // Le quiz est terminé, sauvegarder le résultat localement
    await quizStore.submitQuizResult();
  }
});

// Complete the quiz
const completeQuiz = async () => {
  // Forcer l'affichage des résultats
  manualCompleted.value = true;
  
  // Sauvegarder le résultat localement
  await quizStore.submitQuizResult();
};
</script>

<style>
</style>

<style scoped>
.quiz-page {
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

.quiz-content {
  position: relative;
  z-index: 2;
  margin-bottom: 2rem;
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

/* Styles des cartes et conteneurs */
.quiz-container {
  max-width: 800px;
  margin: 0 auto;
}

.state-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: white;
  border-radius: 15px;
  padding: 3rem 1rem;
  margin: 2rem 0;
  text-align: center;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.05);
}

.loading-state i {
  font-size: 2.5rem;
  color: var(--primary-green);
  margin-bottom: 1rem;
  animation: spin 1.5s linear infinite;
}

.loading-spinner {
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: linear-gradient(45deg, var(--primary-green), var(--primary-orange));
  box-shadow: 0 5px 15px rgba(46, 204, 113, 0.2);
  margin-bottom: 1rem;
}

.loading-spinner i {
  font-size: 1.8rem;
  color: white;
  animation: spin 1.5s linear infinite;
}

.error-state i {
  font-size: 2.5rem;
  color: #dc3545;
  margin-bottom: 1rem;
}

.state-container p {
  color: #666;
  font-size: 1.1rem;
  margin-bottom: 1.5rem;
  line-height: 1.5;
}

.retry-btn {
  padding: 0.6rem 1.2rem;
  background: #dc3545;
  color: white;
  border: none;
  border-radius: 25px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.retry-btn:hover {
  background: #c82333;
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(220, 53, 69, 0.2);
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* Styles pour le quiz */
.quiz-card, .top-results-card {
  background: white;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
  margin-bottom: 2rem;
  transition: all 0.4s ease;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
  width: 100%;
}

.quiz-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.12);
}

.card-content {
  padding: 2rem;
}

/* Styles spécifiques pour l'écran de démarrage */
.card-header {
  display: flex;
  align-items: center;
  padding: 1.5rem 2rem;
  background: linear-gradient(135deg, var(--primary-green), var(--primary-orange));
  color: white;
  position: relative;
  overflow: hidden;
}

.card-header::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(
    circle at 70% 30%,
    rgba(255, 255, 255, 0.1) 0%,
    transparent 70%
  );
  pointer-events: none;
}

.card-header-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 42px;
  height: 42px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  margin-right: 1rem;
  font-size: 1.5rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.card-header-title {
  margin: 0;
  font-size: 1.4rem;
  font-weight: 600;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.start-screen-illustration {
  height: 120px;
  position: relative;
  margin: 1rem 0 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
}

.question-marks {
  position: relative;
  width: 120px;
  height: 100%;
}

.q-mark {
  position: absolute;
  opacity: 0.8;
  font-size: 4rem;
}

.q1 {
  left: 0;
  top: 10%;
  color: var(--primary-green);
  animation: float 4s ease-in-out infinite;
  transform-origin: center;
}

.q2 {
  left: 30%;
  top: 0;
  color: var(--primary-orange);
  font-size: 3.5rem;
  animation: float 6s ease-in-out infinite 1s;
}

.q3 {
  right: 0;
  top: 20%;
  color: #3498db;
  font-size: 3rem;
  animation: float 5s ease-in-out infinite 0.5s;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
  }
  50% {
    transform: translateY(-15px) rotate(5deg);
  }
}

.quiz-card-title {
  font-size: 1.6rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  color: #333;
  position: relative;
  display: inline-block;
  padding-bottom: 0.5rem;
}

.quiz-card-title::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 25%;
  width: 50%;
  height: 3px;
  background: linear-gradient(to right, var(--primary-green), var(--primary-orange));
  border-radius: 3px;
}

.quiz-stats {
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid rgba(0, 0, 0, 0.05);
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  color: #666;
  font-size: 0.95rem;
}

.stat-item i {
  font-size: 1.2rem;
  color: var(--primary-green);
}

.quiz-description {
  color: #666;
  font-size: 1.1rem;
  margin-bottom: 2rem;
}

.form-group {
  margin-bottom: 1.5rem;
  text-align: left;
}

.form-label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #333;
  font-size: 0.95rem;
}

.input-wrapper {
  position: relative;
}

.input-wrapper i {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #999;
  transition: color 0.3s ease;
}

.form-input {
  width: 100%;
  padding: 0.8rem 1rem 0.8rem 2.5rem;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: #f8f9fa;
  color: #333;
}

.form-input:focus {
  outline: none;
  border-color: var(--primary-green);
  box-shadow: 0 0 0 3px rgba(46, 204, 113, 0.1);
  background: white;
}

.start-button, .share-button {
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

.start-button:hover, .share-button:hover {
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(46, 204, 113, 0.2);
}

.start-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
}

.secondary-button {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.8rem 1.5rem;
  background: white;
  color: #666;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 50px;
  font-weight: 500;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.secondary-button:hover {
  background: #f8f9fa;
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
}

.button-group {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 2rem;
}

/* Questions */
.question-header {
  text-align: center;
  margin-bottom: 1.5rem;
}

.question-badge {
  display: inline-block;
  padding: 0.5rem 1.2rem;
  background: linear-gradient(45deg, var(--primary-green), var(--primary-orange));
  color: white;
  border-radius: 50px;
  font-weight: 600;
  font-size: 1rem;
}

/* Résultats */
.result-name {
  font-size: 1.3rem;
  margin-bottom: 1.5rem;
  color: #555;
}

.score-display {
  margin: 1.5rem auto;
  width: 150px;
  height: 150px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--primary-green), var(--primary-orange));
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  position: relative;
  z-index: 1;
}

.score-display::before {
  content: '';
  position: absolute;
  inset: 7px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  z-index: -1;
}

.score-display::after {
  content: '';
  position: absolute;
  width: 170px;
  height: 170px;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.05);
  animation: pulse-ring 2s ease infinite;
}

.score-value {
  font-size: 2.5rem;
  font-weight: 700;
}

@keyframes pulse-ring {
  0% {
    transform: scale(0.95);
    opacity: 0.5;
  }
  70% {
    transform: scale(1.1);
    opacity: 0;
  }
  100% {
    transform: scale(0.95);
    opacity: 0;
  }
}

.result-confetti {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  overflow: hidden;
}

.confetti {
  position: absolute;
  color: var(--primary-orange);
  animation: confettiFall 6s linear infinite;
  opacity: 0.5;
}

.c1 {
  left: 10%;
  top: -10%;
  font-size: 1.2rem;
  animation-delay: 0s;
  color: var(--primary-green);
}

.c2 {
  left: 30%;
  top: -5%;
  font-size: 1rem;
  animation-delay: 1.5s;
}

.c3 {
  right: 20%;
  top: -2%;
  font-size: 1.5rem;
  animation-delay: 0.8s;
  color: var(--primary-green);
}

.c4 {
  right: 10%;
  top: -8%;
  font-size: 0.9rem;
  animation-delay: 2.2s;
}

.c5 {
  left: 50%;
  top: -15%;
  font-size: 1.3rem;
  animation-delay: 1.1s;
  color: var(--light-green);
}

@keyframes confettiFall {
  0% {
    transform: translateY(-10px) rotate(0deg);
    opacity: 0;
  }
  10% {
    opacity: 0.7;
  }
  100% {
    transform: translateY(500px) rotate(360deg);
    opacity: 0;
  }
}

.result-progress {
  margin: 0 auto 2rem;
  max-width: 300px;
}

.progress-track {
  height: 10px;
  background: rgba(0, 0, 0, 0.05);
  border-radius: 10px;
  overflow: hidden;
  margin-bottom: 0.5rem;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, var(--primary-green), var(--primary-orange));
  border-radius: 10px;
  transition: width 1s cubic-bezier(0.4, 0, 0.2, 1);
}

.progress-labels {
  display: flex;
  justify-content: space-between;
  font-size: 0.8rem;
  color: #777;
}

.quiz-badge {
  display: inline-block;
  padding: 0.8rem 1.5rem;
  font-size: 1.25rem;
  font-weight: 600;
  background: linear-gradient(45deg, var(--primary-green), var(--primary-orange));
  color: white;
  border-radius: 50px;
  margin-bottom: 1.5rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  position: relative;
  overflow: hidden;
}

.quiz-badge::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 50%;
  height: 100%;
  background: rgba(255, 255, 255, 0.3);
  transform: skewX(-25deg);
  animation: shine 2.5s infinite;
}

@keyframes shine {
  0% {
    left: -100%;
  }
  20% {
    left: 100%;
  }
  100% {
    left: 100%;
  }
}

.result-message {
  color: #555;
  font-size: 1.1rem;
  margin-bottom: 1.5rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 12px;
  display: inline-block;
}

.result-message i {
  font-size: 1.4rem;
  margin-right: 0.5rem;
  vertical-align: middle;
  color: var(--primary-orange);
}

/* Top results */
.card-header {
  padding: 1.2rem 1.5rem;
  background: linear-gradient(135deg, var(--primary-green), var(--primary-orange));
  color: white;
}

.empty-state {
  padding: 2.5rem 1rem;
  text-align: center;
  color: #777;
}

.empty-state i {
  font-size: 3rem;
  color: #ddd;
  margin-bottom: 1rem;
  display: block;
}

.results-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.result-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.result-item:hover {
  background: rgba(0, 0, 0, 0.01);
}

.result-item.highlighted {
  background: rgba(46, 204, 113, 0.05);
}

.result-item:last-child {
  border-bottom: none;
}

.result-user {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  flex-wrap: wrap;
}

.rank-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  background: linear-gradient(45deg, var(--primary-green), var(--primary-orange));
  color: white;
  border-radius: 50%;
  font-size: 0.9rem;
  font-weight: 600;
}

.rank-top {
  background: linear-gradient(45deg, #f1c40f, #e67e22);
  box-shadow: 0 3px 8px rgba(241, 196, 15, 0.2);
}

.rank-top i {
  font-size: 0.8rem;
}

.user-tag {
  display: inline-block;
  padding: 0.2rem 0.5rem;
  background: rgba(46, 204, 113, 0.1);
  color: var(--primary-green);
  border-radius: 12px;
  font-size: 0.7rem;
  font-weight: 600;
}

.result-score {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  flex-wrap: wrap;
}

.score-badge {
  padding: 0.3rem 0.7rem;
  background-color: rgba(46, 204, 113, 0.15);
  color: var(--primary-green);
  border-radius: 15px;
  font-size: 0.85rem;
  font-weight: 600;
}

.badge-name {
  padding: 0.3rem 0.7rem;
  background-color: rgba(243, 156, 18, 0.15);
  color: var(--primary-orange);
  border-radius: 15px;
  font-size: 0.85rem;
  font-weight: 600;
}

.fade-in {
  animation: fadeIn 0.5s ease-in;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* Responsive */
@media (max-width: 768px) {
  .page-header {
    padding: 6rem 0 2rem;
  }
  
  .container {
    padding: 0 0.7rem;
  }
  
  .card-content {
    padding: 1.5rem;
  }
  
  .button-group {
    flex-direction: column;
  }
  
  .quiz-card, .top-results-card {
    width: 95%;
    margin-left: auto;
    margin-right: auto;
  }
  
  .score-display {
    width: 120px;
    height: 120px;
  }
  
  .score-value {
    font-size: 2rem;
  }
  
  .result-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  
  .result-score {
    margin-left: 2.5rem;
  }
}

@media (max-width: 480px) {
  .quiz-content {
    padding: 0;
  }
  
  .container {
    padding: 0 0.5rem;
  }
  
  .quiz-card, .top-results-card {
    width: 98%;
    border-radius: 12px;
  }
  
  .card-content {
    padding: 1.2rem;
  }
  
  .card-header {
    padding: 1rem 1.2rem;
  }
  
  .card-header-title {
    font-size: 1.2rem;
  }
  
  .quiz-badge {
    font-size: 1.1rem;
    padding: 0.6rem 1.2rem;
  }
  
  .result-progress {
    max-width: 260px;
  }
  
  .score-badge, .badge-name {
    font-size: 0.75rem;
    padding: 0.25rem 0.5rem;
  }
  
  .result-item {
    padding: 0.8rem 1rem;
  }
  
  .user-tag {
    font-size: 0.65rem;
    padding: 0.15rem 0.4rem;
  }
}
</style> 