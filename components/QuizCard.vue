<template>
  <div class="quiz-card">
    <div class="quiz-header">
      <h3>{{ question.question }}</h3>
    </div>
    
    <div class="quiz-content">
      <div v-if="question.image" class="mb-3">
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
            'incorrect': answered && !answerResult && userAnswer === index
          }"
          @click="selectAnswer(index)"
          :disabled="answered"
        >
          {{ option }}
        </button>
      </div>
      
      <div v-if="answered" class="feedback mt-3" :class="answerResult ? 'text-success' : 'text-danger'">
        <p v-if="answerResult">
          <i class="bi bi-check-circle-fill me-2"></i> Bonne réponse !
        </p>
        <p v-else>
          <i class="bi bi-x-circle-fill me-2"></i> Mauvaise réponse !
        </p>
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
  }
});

const emit = defineEmits(['answer-selected']);

const config = useRuntimeConfig();
const apiBaseUrl = String(config.public.apiBaseUrl);
const imageError = ref(false);
const answered = ref(false);
const userAnswer = ref(null);
const answerResult = ref(false);

// Handle broken images
const handleImageError = () => {
  imageError.value = true;
};

// Select answer
const selectAnswer = async (index) => {
  userAnswer.value = index;
  answered.value = true;
  
  // Emit the answer to parent
  const result = await emit('answer-selected', index);
  answerResult.value = result;
  
  // After a delay, move to next question
  setTimeout(() => {
    answered.value = false;
    userAnswer.value = null;
  }, 1500);
};
</script>

<style scoped>
/* Most styles are defined in main.css */
.feedback {
  font-weight: 500;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
</style> 