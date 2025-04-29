import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { useApi } from '~/composables/useApi';
import { useSocket } from '~/composables/useSocket';

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  answer?: number;
  image?: string;
}

interface QuizResult {
  id: number;
  username: string;
  score: number;
  badge: string;
  createdAt: string;
}

export const useQuizStore = defineStore('quiz', () => {
  const api = useApi();
  const { joinRoom, emit } = useSocket();
  
  const questions = ref<QuizQuestion[]>([]);
  const currentQuestionIndex = ref(0);
  const userAnswers = ref<number[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);
  const topResults = ref<QuizResult[]>([]);
  const username = ref('');
  
  // Computed properties
  const currentQuestion = computed(() => 
    questions.value[currentQuestionIndex.value] || null
  );
  
  const isQuizCompleted = computed(() => 
    currentQuestionIndex.value >= questions.value.length && 
    userAnswers.value.length === questions.value.length
  );
  
  const score = computed(() => {
    if (!questions.value.length) return 0;
    
    return userAnswers.value.reduce((total, userAnswer, index) => {
      const correctAnswer = questions.value[index]?.answer;
      return total + (userAnswer === correctAnswer ? 1 : 0);
    }, 0);
  });
  
  const badge = computed(() => {
    const scoreValue = score.value;
    const totalQuestions = questions.value.length;
    
    if (scoreValue === 0) return 'Rookie';
    if (scoreValue <= totalQuestions * 0.4) return 'Rookie';
    if (scoreValue <= totalQuestions * 0.7) return 'Fan';
    return 'Super-fan';
  });
  
  // Fetch quiz questions
  const fetchQuestions = async () => {
    isLoading.value = true;
    error.value = null;
    
    try {
      // Charger les questions avec les réponses
      const data = await api.get('/api/quiz');
      questions.value = data;
      // Reset quiz state
      currentQuestionIndex.value = 0;
      userAnswers.value = [];
    } catch (err: any) {
      error.value = err.message || 'Failed to load quiz questions';
      console.error('Error fetching quiz questions:', err);
    } finally {
      isLoading.value = false;
    }
  };
  
  // Submit an answer to the current question
  const submitAnswer = async (answerIndex: number) => {
    try {
      // Ajouter la réponse à la liste
      userAnswers.value.push(answerIndex);
      
      // Check if answer is correct via API
      const response = await api.post(`/api/quiz/check/${currentQuestion.value?.id}`, {
        answerIndex
      });
      
      // Augmenter l'index pour passer à la question suivante
      // Même pour la dernière question (l'interface s'occupera de la transition)
      if (currentQuestionIndex.value < questions.value.length) {
        currentQuestionIndex.value++;
      }
      
      return response.isCorrect;
    } catch (err: any) {
      console.error('Error submitting answer:', err);
      return false;
    }
  };
  
  // Submit quiz result
  const submitQuizResult = async () => {
    if (!username.value) {
      error.value = 'Username is required';
      return false;
    }
    
    try {
      const result = {
        username: username.value,
        score: score.value,
        badge: badge.value
      };
      
      // Via Socket.io
      emit('quiz-completed', result);
      
      // Via REST API
      await api.post('/api/quiz/results', result);
      
      return true;
    } catch (err: any) {
      error.value = err.message || 'Failed to submit quiz result';
      console.error('Error submitting quiz result:', err);
      return false;
    }
  };
  
  // Fetch top quiz results
  const fetchTopResults = async (limit = 10) => {
    isLoading.value = true;
    
    try {
      const data = await api.get('/api/quiz/results/top', { limit });
      topResults.value = data;
    } catch (err: any) {
      console.error('Error fetching top results:', err);
    } finally {
      isLoading.value = false;
    }
  };
  
  // Reset quiz
  const resetQuiz = () => {
    currentQuestionIndex.value = 0;
    userAnswers.value = [];
    error.value = null;
  };
  
  // Set username
  const setUsername = (newUsername: string) => {
    username.value = newUsername;
  };
  
  // Set up socket connection for the quiz
  const setupSocketConnection = () => {
    joinRoom('quiz');
  };
  
  // Force quiz completion
  const forceQuizCompletion = () => {
    currentQuestionIndex.value = questions.value.length;
  };
  
  return {
    questions,
    currentQuestionIndex,
    currentQuestion,
    userAnswers,
    isLoading,
    error,
    isQuizCompleted,
    score,
    badge,
    topResults,
    username,
    fetchQuestions,
    submitAnswer,
    submitQuizResult,
    fetchTopResults,
    resetQuiz,
    setUsername,
    setupSocketConnection,
    forceQuizCompletion
  };
}); 