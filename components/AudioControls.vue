<template>
  <div class="audio-controls" @click="toggleAudio">
    <i :class="isPlaying ? 'bi bi-pause-fill' : 'bi bi-play-fill'"></i>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';

const isPlaying = ref(false);
let audio = null;

// Initialize audio player
onMounted(() => {
  audio = new Audio('/audio/celebration.mp3');
  audio.loop = true;
  audio.volume = 0.5;
  
  // Add event listeners
  audio.addEventListener('play', () => {
    isPlaying.value = true;
  });
  
  audio.addEventListener('pause', () => {
    isPlaying.value = false;
  });
});

// Clean up on component unmount
onBeforeUnmount(() => {
  if (audio) {
    audio.pause();
    audio.src = '';
    audio.remove();
    audio = null;
  }
});

// Toggle audio play/pause
const toggleAudio = () => {
  if (!audio) return;
  
  if (isPlaying.value) {
    audio.pause();
  } else {
    audio.play().catch(error => {
      console.error('Error playing audio:', error);
      // Many browsers require user interaction before playing audio
      alert('Cliquez à nouveau pour activer la musique !');
    });
  }
};
</script>

<style scoped>
/* Styles are defined in main.css */
</style> 