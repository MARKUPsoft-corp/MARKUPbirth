<template>
  <div class="countdown-container">
    <template v-if="!isExpired">
      <div class="countdown-item">
        <div class="countdown-number">{{ days }}</div>
        <div class="countdown-label">Jours</div>
      </div>
      <div class="countdown-item">
        <div class="countdown-number">{{ hours }}</div>
        <div class="countdown-label">Heures</div>
      </div>
      <div class="countdown-item">
        <div class="countdown-number">{{ minutes }}</div>
        <div class="countdown-label">Minutes</div>
      </div>
      <div class="countdown-item">
        <div class="countdown-number">{{ seconds }}</div>
        <div class="countdown-label">Secondes</div>
      </div>
    </template>
    <div v-else class="countdown-expired">
      <h3>Merci d'avoir fêté avec Emmanuel !</h3>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, computed } from 'vue';
import { useRuntimeConfig } from 'nuxt/app';

const config = useRuntimeConfig();
const birthdayDate = new Date(String(config.public.birthdayDate));

const now = ref(new Date());
const timer = ref(null);

// Computed values for countdown
const timeLeft = computed(() => {
  const difference = birthdayDate.getTime() - now.value.getTime();
  return Math.max(0, difference);
});

const days = computed(() => Math.floor(timeLeft.value / (1000 * 60 * 60 * 24)));
const hours = computed(() => Math.floor((timeLeft.value % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)));
const minutes = computed(() => Math.floor((timeLeft.value % (1000 * 60 * 60)) / (1000 * 60)));
const seconds = computed(() => Math.floor((timeLeft.value % (1000 * 60)) / 1000));
const isExpired = computed(() => timeLeft.value === 0);

// Update time every second
onMounted(() => {
  timer.value = setInterval(() => {
    now.value = new Date();
  }, 1000);
});

// Clean up on component unmount
onBeforeUnmount(() => {
  if (timer.value) {
    clearInterval(timer.value);
  }
});
</script>

<style scoped>
/* Styles are defined in main.css */
.countdown-expired {
  width: 100%;
  text-align: center;
  padding: 1rem;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  backdrop-filter: blur(5px);
}
</style> 