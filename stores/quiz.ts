import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

// Types pour le nouveau quiz
export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  answer: number;
  explanation?: string;
  image?: string;
  category?: string;
  difficulty?: 'facile' | 'moyen' | 'difficile';
}

interface QuizResult {
  username: string;
  score: number;
  totalQuestions: number;
  category?: string;
  date: string;
  timeSpent: number;
  badge: string;
}

export const useQuizStore = defineStore('quiz', () => {
  // Base de questions enrichie pour le quiz
  const questions = ref<QuizQuestion[]>([
    {
      id: 1,
      question: "Quelle est ma date de naissance ?",
      options: ["1er janvier 1998", "15 mars 2000", "30 avril 2001", "22 décembre 2003"],
      answer: 2,
      explanation: "Je suis est né le 30 avril 2001.",
      category: "Personnel",
      difficulty: "facile"
    },
    {
      id: 2,
      question: "Quel mon plat préféré ?",
      options: ["Pizza", "Koki", "Taro", "Hambuger"],
      answer: 1,
      explanation: "Le Koki est mon deux place depuis la nuit des temps",
      category: "Gastronomie",
      difficulty: "moyen"
    },
    {
      id: 3,
      question: "Quel sport je pratique régulièrement ?",
      options: ["Football", "Basketball", "Tennis", "Street workout"],
      answer: 3,
      explanation: "Je suis un passionné de street workout et pratique ce sport régulièrement.",
      category: "Loisirs",
      difficulty: "moyen"
    },
    {
      id: 4,
      question: "Quelle est ma couleur préférée ?",
      options: ["Rouge", "Bleu", "Vert", "Noir"],
      answer: 2,
      explanation: "Le bleu est ma couleur préférée .",
      category: "Personnel",
      difficulty: "facile"
    },
    {
      id: 5,
      question: "Quel est mon film préféré ?",
      options: ["Star Wars", "Le Parrain", "Avenger Endgame", "Matrix"],
      answer: 2,
      explanation: "Avenger Endgame, réalisé par Marvel, mon film préféré .",
      category: "Divertissement",
      difficulty: "moyen"
    },
    {
      id: 6,
      question: "Quel est le pays que rêve que je souhaiterais visiter ?",
      options: ["Australie", "Brésil", "Nouvelle-Zélande", "Egypte"],
      answer: 0,
      explanation: "Australie, mon pays rêvé .",
      category: "Voyages",
      difficulty: "difficile"
    },
    {
      id: 7,
      question: "Quel est mon animal préféré ?",
      options: ["Chien", "Chat", "Dauphin", "Aigle"],
      answer: 2,
      explanation: "je suis fasciné par l'intelligence des dauphins.",
      category: "Animaux",
      difficulty: "difficile"
    },
    {
      id: 8,
      question: "Quelle musique  j'écoute le plus souvent ?",
      options: ["Rock", "Jazz", "Hip-hop", "Classique"],
      answer: 1,
      explanation: "J'apprécie particulièrement le jazz et son improvisation.",
      category: "Musique",
      difficulty: "moyen"
    }
  ]);
  
  // État du quiz
  const shuffledQuestions = ref<QuizQuestion[]>([]);
  const currentQuestionIndex = ref(0);
  const userAnswers = ref<number[]>([]);
  const username = ref('');
  const startTime = ref(0);
  const elapsedTime = ref(0);
  const isLoading = ref(false);
  const error = ref<string | null>(null);
  const quizCompleted = ref(false);
  const lastResults = ref<QuizResult | null>(null);
  
  // Fonctions et propriétés calculées
  const currentQuestion = computed(() => shuffledQuestions.value[currentQuestionIndex.value]);
  const isQuizCompleted = computed(() => quizCompleted.value);
  const totalQuestions = computed(() => shuffledQuestions.value.length);
  
  const score = computed(() => {
    if (userAnswers.value.length === 0) return 0;
    
    return userAnswers.value.reduce((total, userAnswer, index) => {
      const correctAnswer = shuffledQuestions.value[index].answer;
      return total + (userAnswer === correctAnswer ? 1 : 0);
    }, 0);
  });

  const scorePercentage = computed(() => {
    if (userAnswers.value.length === 0) return 0;
    return Math.round((score.value / totalQuestions.value) * 100);
  });
  
  const badge = computed(() => {
    if (scorePercentage.value >= 90) return "🏆 Or";
    if (scorePercentage.value >= 70) return "🥈 Argent";
    if (scorePercentage.value >= 50) return "🥉 Bronze";
    return "👍 Participant";
  });
  
  // Configuration du quiz
  const quizConfig = {
    questionsPerQuiz: 8, // Nombre de questions par quiz - facilement modifiable
    shuffleQuestions: true // Mélanger les questions - facilement modifiable
  };
  
  // Initialisation du quiz
  const initializeQuiz = () => { 
    let selectedQuestions = [...questions.value];
    
    // Mélanger les questions si l'option est activée
    if (quizConfig.shuffleQuestions) {
      selectedQuestions = selectedQuestions.sort(() => Math.random() - 0.5);
    }
    
    // Limiter au nombre de questions défini dans la configuration
    shuffledQuestions.value = selectedQuestions.slice(0, quizConfig.questionsPerQuiz);
    
    // Réinitialiser les réponses utilisateur
    userAnswers.value = new Array(shuffledQuestions.value.length).fill(-1);
    currentQuestionIndex.value = 0;
    quizCompleted.value = false;
    startTime.value = Date.now();
    elapsedTime.value = 0;
    error.value = null;
  };
  
  // Soumettre une réponse à la question actuelle
  const submitAnswer = (answerIndex: number) => {
    if (currentQuestionIndex.value >= shuffledQuestions.value.length || quizCompleted.value) {
      return false;
    }
    
    // Enregistrer la réponse pour la question actuelle
    userAnswers.value[currentQuestionIndex.value] = answerIndex;
    
    // Passer à la question suivante
    if (currentQuestionIndex.value < shuffledQuestions.value.length - 1) {
      // Avancer à la question suivante
      currentQuestionIndex.value++;
      return true;
    } else {
      // Terminé - toutes les questions ont été répondues
      completeQuiz();
      return true;
    }
  };
  
  // Compléter le quiz
  const completeQuiz = () => {
    if (quizCompleted.value) return;
    
    quizCompleted.value = true;
    elapsedTime.value = Math.floor((Date.now() - startTime.value) / 1000); // en secondes
    
    // Créer un résultat
    lastResults.value = {
      username: username.value || 'Anonyme',
      score: score.value,
      totalQuestions: totalQuestions.value,
      category: 'Général',
      date: new Date().toISOString(),
      timeSpent: elapsedTime.value,
      badge: badge.value
    };
    
    // Sauvegarder dans localStorage si nécessaire
    saveResultToLocalStorage();
    
    return lastResults.value;
  };
  
  // Enregistrer le résultat dans localStorage
  const saveResultToLocalStorage = () => {
    if (!lastResults.value) return;
    
    try {
      const savedResults = localStorage.getItem('quizResults');
      let resultsArray = [];
      
      if (savedResults) {
        resultsArray = JSON.parse(savedResults);
      }
      
      resultsArray.push(lastResults.value);
      
      // Limiter à 10 résultats
      if (resultsArray.length > 10) {
        resultsArray = resultsArray.slice(-10);
      }
      
      localStorage.setItem('quizResults', JSON.stringify(resultsArray));
    } catch (err) {
      console.error('Erreur lors de la sauvegarde des résultats:', err);
    }
  };
  
  // Réinitialiser le quiz
  const resetQuiz = () => {
    initializeQuiz();
  };
  
  // Définir le nom d'utilisateur
  const setUsername = (newUsername: string) => {
    username.value = newUsername;
  };

  // Initialisation automatique
  initializeQuiz();
  
  // Fonctions et propriétés exportées
  return {
    // État
    questions: shuffledQuestions,
    currentQuestionIndex,
    userAnswers,
    username,
    isLoading,
    error,
    quizCompleted,
    lastResults,
    elapsedTime,
    
    // Calculés
    currentQuestion,
    isQuizCompleted,
    score,
    scorePercentage,
    badge,
    totalQuestions,
    
    // Actions
    initializeQuiz,
    submitAnswer,
    completeQuiz,
    resetQuiz,
    setUsername
  };
});
