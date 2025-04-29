<template>
  <div class="quiz-card">
    <div class="quiz-header">
      <h3>{{ question.question }}</h3>
    </div>
    
    <div class="quiz-content">
      <div v-if="question.image && !imageError" class="image-container">
        <img 
          :src="apiBaseUrl + question.image" 
          :alt="question.question" 
          class="quiz-image"
          @error="handleImageError"
        />
      </div>
      
      <div class="options-container">
        <button 
          v-for="(option, index) in question.options" 
          :key="index"
          class="option-button"
          :class="{
            'correct': answered && answerResult && userAnswer === index,
            'incorrect': answered && !answerResult && userAnswer === index,
            'other-option': answered && userAnswer !== index
          }"
          @click="selectAnswer(index)"
          :disabled="answered"
        >
          <span class="option-number">{{ String.fromCharCode(65 + index) }}</span>
          <span class="option-text">{{ option }}</span>
          <span v-if="answered && answerResult && userAnswer === index" class="option-icon">
            <i class="bi bi-check-circle-fill"></i>
          </span>
          <span v-else-if="answered && !answerResult && userAnswer === index" class="option-icon">
            <i class="bi bi-x-circle-fill"></i>
          </span>
        </button>
      </div>
      
      <div v-if="answered" class="feedback" :class="answerResult ? 'feedback-success' : 'feedback-error'">
        <div class="feedback-icon">
          <i v-if="answerResult" class="bi bi-check-circle-fill"></i>
          <i v-else class="bi bi-x-circle-fill"></i>
        </div>
        <div class="feedback-text">
          <p v-if="answerResult">Bonne réponse !</p>
          <p v-else>
            Mauvaise réponse ! 
            <span class="correct-answer">La bonne réponse était : {{ correctAnswerText }}</span>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRuntimeConfig } from 'nuxt/app';

const props = defineProps({
  question: {
    type: Object,
    required: true
  },
  isLastQuestion: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['answer-selected', 'quiz-completed']);

const config = useRuntimeConfig();
const apiBaseUrl = String(config.public.apiBaseUrl);
const imageError = ref(false);
const answered = ref(false);
const userAnswer = ref(null);
const answerResult = ref(false);
const correctAnswerText = ref('');

// Handle broken images
const handleImageError = () => {
  imageError.value = true;
};

// Select answer
const selectAnswer = async (index) => {
  userAnswer.value = index;
  answered.value = true;
  
  // Vérifier si la réponse est correcte
  answerResult.value = index === props.question.answer;
  
  // Stocker la bonne réponse avant qu'elle ne change
  correctAnswerText.value = props.question.options[props.question.answer];
  
  // Emit the answer to parent (mais ne le faire qu'une fois)
  // Cette émission déclenche l'incrémentation dans le store
  // Donc si on veut voir le feedback pendant 2 secondes, on doit retarder cet événement
  setTimeout(() => {
    // Après avoir montré la réponse pendant 2 secondes, 
    // envoyer la réponse au parent ce qui va incrémenter l'index
    emit('answer-selected', index);
    
    // Si c'est la dernière question, émettre quiz-completed après le délai
    if (props.isLastQuestion) {
      setTimeout(() => emit('quiz-completed'), 500);
    }
    
    // Réinitialiser l'état pour la prochaine question
    answered.value = false;
    userAnswer.value = null;
    answerResult.value = false;
  }, 2000);
};
</script>

<style scoped>
.quiz-card {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
  transition: all 0.4s ease;
}

.quiz-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.12);
}

.quiz-header {
  padding: 1.8rem 2rem;
  background: linear-gradient(135deg, var(--primary-green), var(--primary-orange));
  position: relative;
}

.quiz-header::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 6px;
  background: rgba(255, 255, 255, 0.2);
}

.quiz-header h3 {
  color: white;
  margin: 0;
  font-size: 1.4rem;
  font-weight: 600;
  line-height: 1.5;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.quiz-content {
  padding: 2rem;
}

.image-container {
  margin-bottom: 1.5rem;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
}

.quiz-image {
  width: 100%;
  max-height: 250px;
  object-fit: cover;
  display: block;
}

.options-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.option-button {
  display: flex;
  align-items: center;
  padding: 1rem 1.5rem;
  background: #f8f9fa;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: left;
  font-size: 1.05rem;
  position: relative;
  overflow: hidden;
}

.option-button:hover:not(:disabled) {
  background: #f1f4f6;
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
}

.option-button:disabled {
  cursor: default;
}

.option-number {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  margin-right: 1rem;
  font-weight: 600;
  color: #555;
  flex-shrink: 0;
  transition: all 0.3s ease;
}

.option-text {
  flex-grow: 1;
  color: #333;
}

.option-icon {
  margin-left: 1rem;
  font-size: 1.2rem;
}

.option-button.correct {
  background: rgba(46, 204, 113, 0.15);
  border-color: rgba(46, 204, 113, 0.3);
}

.option-button.correct .option-number {
  background: var(--primary-green);
  color: white;
}

.option-button.correct .option-icon {
  color: var(--primary-green);
}

.option-button.incorrect {
  background: rgba(231, 76, 60, 0.15);
  border-color: rgba(231, 76, 60, 0.3);
}

.option-button.incorrect .option-number {
  background: #e74c3c;
  color: white;
}

.option-button.incorrect .option-icon {
  color: #e74c3c;
}

.option-button.other-option {
  opacity: 0.6;
}

.feedback {
  display: flex;
  padding: 1.2rem;
  border-radius: 12px;
  margin-top: 1.5rem;
  align-items: center;
  gap: 1rem;
  animation: fadeIn 0.5s ease;
  position: relative;
  z-index: 10;
}

.feedback-success {
  background: rgba(46, 204, 113, 0.15);
  border: 1px solid rgba(46, 204, 113, 0.3);
}

.feedback-error {
  background: rgba(231, 76, 60, 0.15);
  border: 1px solid rgba(231, 76, 60, 0.3);
  animation: pulseError 1s ease-in-out infinite;
}

.feedback-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  font-size: 1.5rem;
  flex-shrink: 0;
}

.feedback-success .feedback-icon {
  color: var(--primary-green);
}

.feedback-error .feedback-icon {
  color: #e74c3c;
}

.feedback-text {
  flex-grow: 1;
}

.feedback-text p {
  margin: 0;
  font-weight: 600;
  font-size: 1.1rem;
}

.correct-answer {
  display: block;
  margin-top: 0.5rem;
  font-size: 0.95rem;
  font-weight: 500;
  opacity: 1;
  color: #e74c3c;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes pulseError {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.02); }
}

@media (max-width: 768px) {
  .quiz-header {
    padding: 1.5rem;
  }
  
  .quiz-content {
    padding: 1.5rem;
  }
  
  .quiz-header h3 {
    font-size: 1.2rem;
  }
  
  .option-button {
    padding: 0.8rem 1rem;
    font-size: 1rem;
  }
}
</style> 