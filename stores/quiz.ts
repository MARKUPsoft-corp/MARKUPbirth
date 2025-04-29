import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

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
  const questions = ref<QuizQuestion[]>([
    {
      id: 1,
      question: "Quelle est la date de naissance d'Emmanuel ?",
      options: ["1er janvier", "15 mars", "30 avril", "22 décembre"],
      answer: 2
    },
    {
      id: 2,
      question: "Quel est le plat préféré d'Emmanuel ?",
      options: ["Pizza", "Poulet DG", "Sushi", "Lasagnes"],
      answer: 1
    },
    {
      id: 3,
      question: "Quel sport Emmanuel pratique-t-il régulièrement ?",
      options: ["Football", "Basketball", "Tennis", "Natation"],
      answer: 3
    }
  ]);
  
  const currentQuestionIndex = ref(0);
  const userAnswers = ref<number[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);
  const topResults = ref<QuizResult[]>([
    {
      id: 1,
      username: "Alice",
      score: 85,
      badge: "🥈 Argent",
      createdAt: new Date().toISOString()
    },
    {
      id: 2,
      username: "Bob",
      score: 92,
      badge: "🏆 Or",
      createdAt: new Date().toISOString()
    },
    {
      id: 3,
      username: "Charlie",
      score: 78,
      badge: "🥉 Bronze",
      createdAt: new Date().toISOString()
    }
  ]);
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
  
  // Initialisation
  const initializeQuiz = () => {
    // Préparer le tableau des réponses utilisateur
    userAnswers.value = new Array(questions.value.length).fill(-1);
    currentQuestionIndex.value = 0;
  };
  
  // Détermine le badge en fonction du score
  const getBadgeForScore = (score: number) => {
    if (score >= 90) return "🏆 Or";
    if (score >= 70) return "🥈 Argent";
    if (score >= 50) return "🥉 Bronze";
    return "👍 Participant";
  };
  
  // Submit an answer to the current question
  const submitAnswer = (answerIndex: number) => {
    if (currentQuestionIndex.value >= questions.value.length) {
      return false;
    }
    
    // Store the answer
    userAnswers.value[currentQuestionIndex.value] = answerIndex;
    
    // Move to next question
    if (currentQuestionIndex.value < questions.value.length - 1) {
      currentQuestionIndex.value++;
    }
    
    return true;
  };
  
  // Submit quiz result
  const submitQuizResult = async () => {
    if (!username.value) {
      error.value = 'Username is required';
      return false;
    }

    isLoading.value = true;
    error.value = null;

    try {
      const totalScore = Math.round((score.value / questions.value.length) * 100);
      
      const newResult: QuizResult = {
        id: Date.now(), // Génère un ID unique basé sur le timestamp
        username: username.value,
        score: totalScore,
        badge: getBadgeForScore(totalScore),
        createdAt: new Date().toISOString()
      };

      // Ajouter le résultat à notre liste locale
      topResults.value.push(newResult);
      
      // Trier les résultats par score
      topResults.value.sort((a, b) => b.score - a.score);
      
      console.log(`Résultat du quiz enregistré localement: ${username.value} - Score: ${totalScore}`);
      return true;
    } catch (err: any) {
      error.value = err.message || 'Failed to submit quiz result';
      console.error('Error submitting quiz result:', err);
      return false;
    } finally {
      isLoading.value = false;
    }
  };
  
  // Reset quiz
  const resetQuiz = () => {
    currentQuestionIndex.value = 0;
    userAnswers.value = new Array(questions.value.length).fill(-1);
  };
  
  // Set username
  const setUsername = (newUsername: string) => {
    username.value = newUsername;
  };
  
  // Force quiz completion
  const forceQuizCompletion = () => {
    currentQuestionIndex.value = questions.value.length;
  };
  
  // Appel automatique à l'initialisation
  initializeQuiz();
  
  return {
    questions,
    currentQuestionIndex,
    currentQuestion,
    userAnswers,
    isLoading,
    error,
    score,
    topResults,
    isQuizCompleted,
    username,
    
    submitAnswer,
    submitQuizResult,
    resetQuiz,
    setUsername,
    forceQuizCompletion,
    initializeQuiz
  };
});
