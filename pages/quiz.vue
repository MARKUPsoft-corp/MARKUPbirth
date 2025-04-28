<template>
  <div class="container py-5">
    <h1 class="section-title">Quiz "Connais-tu Emmanuel ?"</h1>
    <p class="text-center mb-5">Testez vos connaissances sur Emmanuel avec ce quiz amusant !</p>
    
    <div class="quiz-container">
      <!-- Loading state -->
      <div v-if="isLoading" class="text-center my-5">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Chargement...</span>
        </div>
        <p class="mt-3">Chargement du quiz...</p>
      </div>
      
      <!-- Error state -->
      <div v-else-if="error" class="alert alert-danger">
        {{ error }}
        <button @click="fetchQuestions" class="btn btn-outline-danger ms-3">Réessayer</button>
      </div>
      
      <!-- Quiz start screen -->
      <div v-else-if="!started" class="card">
        <div class="card-body text-center p-5">
          <h2 class="mb-4">Prêt à tester vos connaissances sur Emmanuel ?</h2>
          <p class="mb-4">Ce quiz comporte {{ questions.length }} questions. Voyons combien vous en connaissez !</p>
          
          <div class="mb-4">
            <label for="username" class="form-label">Entrez votre nom</label>
            <input 
              type="text" 
              id="username" 
              v-model="username" 
              class="form-control form-control-lg mb-3" 
              placeholder="Votre nom" 
              required
            />
          </div>
          
          <button 
            @click="startQuiz" 
            class="btn btn-primary btn-lg" 
            :disabled="!username"
          >
            Commencer le Quiz
          </button>
        </div>
      </div>
      
      <!-- Quiz questions -->
      <div v-else-if="!isQuizCompleted && currentQuestion" class="fade-in">
        <div class="text-center mb-3">
          <span class="badge bg-primary fs-6 mb-3">Question {{ currentQuestionIndex + 1 }} / {{ questions.length }}</span>
        </div>
        
        <QuizCard 
          :question="currentQuestion" 
          @answer-selected="submitAnswer"
        />
      </div>
      
      <!-- Quiz results -->
      <div v-else-if="isQuizCompleted" class="quiz-result fade-in">
        <div class="card">
          <div class="card-body text-center p-5">
            <h2 class="mb-3">Résultats du Quiz</h2>
            <p class="fs-4 mb-4">{{ username }}, vous avez obtenu:</p>
            
            <div class="score-display mb-4">
              <span class="fs-1 fw-bold text-primary">{{ score }} / {{ questions.length }}</span>
            </div>
            
            <div class="quiz-badge mb-4">
              {{ badge }}
            </div>
            
            <p class="mb-4">
              <span v-if="score === questions.length">
                Parfait ! Vous connaissez vraiment bien Emmanuel !
              </span>
              <span v-else-if="score >= questions.length * 0.7">
                Bravo ! Vous connaissez très bien Emmanuel !
              </span>
              <span v-else-if="score >= questions.length * 0.4">
                Pas mal ! Vous connaissez assez bien Emmanuel.
              </span>
              <span v-else>
                Vous avez encore des choses à découvrir sur Emmanuel !
              </span>
            </p>
            
            <div class="d-flex justify-content-center">
              <button @click="resetQuiz" class="btn btn-outline-primary me-3">
                Recommencer le Quiz
              </button>
              <button @click="shareResults" class="btn btn-primary">
                <i class="bi bi-share me-2"></i>
                Partager mes résultats
              </button>
            </div>
          </div>
        </div>
        
        <!-- Top Results -->
        <div class="card mt-4">
          <div class="card-header bg-secondary text-white">
            <h3 class="mb-0">Meilleurs Scores</h3>
          </div>
          <div class="card-body">
            <div v-if="topResults.length === 0" class="text-center py-3">
              <p class="mb-0">Aucun résultat pour le moment. Soyez le premier !</p>
            </div>
            <ul v-else class="list-group">
              <li 
                v-for="(result, index) in topResults" 
                :key="result.id"
                class="list-group-item d-flex justify-content-between align-items-center"
              >
                <div>
                  <span class="badge bg-primary me-2">{{ index + 1 }}</span>
                  <strong>{{ result.username }}</strong>
                </div>
                <div>
                  <span class="badge bg-success me-2">{{ result.score }} / {{ questions.length }}</span>
                  <span class="badge bg-info">{{ result.badge }}</span>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, computed, ref } from 'vue';
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
const topResults = computed(() => quizStore.topResults);

// State
const started = ref(false);

// Fetch quiz questions
onMounted(() => {
  fetchQuestions();
  fetchTopResults();
  quizStore.setupSocketConnection();
});

// Get questions
const fetchQuestions = async () => {
  await quizStore.fetchQuestions();
};

// Get top results
const fetchTopResults = async () => {
  await quizStore.fetchTopResults(5);
};

// Start the quiz
const startQuiz = () => {
  if (!username.value) return;
  started.value = true;
};

// Submit an answer
const submitAnswer = async (answerIndex) => {
  return await quizStore.submitAnswer(answerIndex);
};

// Share quiz results
const shareResults = async () => {
  // First, submit the result
  await quizStore.submitQuizResult();
  
  // Refresh top results
  fetchTopResults();
  
  // Then share (example: copy to clipboard)
  const shareText = `J'ai obtenu ${score.value}/${questions.value.length} au quiz "Connais-tu Emmanuel?" et gagné le badge "${badge.value}" ! Essayez de battre mon score !`;
  
  try {
    await navigator.clipboard.writeText(shareText);
    alert('Résultat copié dans le presse-papier ! Partagez-le avec vos amis.');
  } catch (err) {
    console.error('Erreur de copie:', err);
    
    // Fallback
    prompt('Copiez ce texte pour partager vos résultats:', shareText);
  }
};

// Reset quiz
const resetQuiz = () => {
  quizStore.resetQuiz();
  started.value = false;
};
</script>

<style scoped>
/* Quiz page specific styles */
.score-display {
  margin: 2rem auto;
  width: 150px;
  height: 150px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}

.quiz-badge {
  display: inline-block;
  padding: 0.5rem 1.5rem;
  font-size: 1.25rem;
  font-weight: 600;
  background-color: var(--primary-color);
  color: white;
  border-radius: 50px;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(255, 64, 129, 0.7);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(255, 64, 129, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(255, 64, 129, 0);
  }
}
</style> 