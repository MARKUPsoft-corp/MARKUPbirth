<template>
  <canvas ref="confettiCanvas" class="confetti"></canvas>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';

const confettiCanvas = ref(null);
let context = null;
let animationFrame = null;
let particles = [];

// Configuration
const colors = ['#ff4081', '#3f51b5', '#ffeb3b', '#4caf50', '#2196f3', '#e91e63'];
const numParticles = 150;
const gravity = 0.3;
const maxSpeed = 5;
const minSize = 5;
const maxSize = 15;

// Initialize canvas and particles
onMounted(() => {
  const canvas = confettiCanvas.value;
  if (!canvas) return;
  
  context = canvas.getContext('2d');
  
  // Set canvas size
  const resizeCanvas = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  };
  
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);
  
  // Create particles
  createParticles();
  
  // Start animation
  animate();
});

// Clean up
onBeforeUnmount(() => {
  if (animationFrame) {
    cancelAnimationFrame(animationFrame);
  }
  window.removeEventListener('resize', resizeCanvas);
});

// Create particles
const createParticles = () => {
  particles = [];
  
  for (let i = 0; i < numParticles; i++) {
    particles.push({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight * -1 - 100, // Start above the canvas
      size: Math.random() * (maxSize - minSize) + minSize,
      color: colors[Math.floor(Math.random() * colors.length)],
      speedX: (Math.random() - 0.5) * maxSpeed,
      speedY: Math.random() * maxSpeed,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 5
    });
  }
};

// Animation loop
const animate = () => {
  if (!context) return;
  
  // Clear canvas
  context.clearRect(0, 0, window.innerWidth, window.innerHeight);
  
  // Update and draw particles
  particles.forEach((particle, index) => {
    // Update position
    particle.x += particle.speedX;
    particle.y += particle.speedY;
    
    // Apply gravity
    particle.speedY += gravity;
    
    // Update rotation
    particle.rotation += particle.rotationSpeed;
    
    // Draw particle
    context.save();
    context.translate(particle.x, particle.y);
    context.rotate((particle.rotation * Math.PI) / 180);
    
    context.fillStyle = particle.color;
    context.fillRect(-particle.size / 2, -particle.size / 2, particle.size, particle.size);
    
    context.restore();
    
    // Reset if particle is out of bounds
    if (particle.y > window.innerHeight) {
      particles[index].y = Math.random() * window.innerHeight * -1 - 100;
      particles[index].x = Math.random() * window.innerWidth;
      particles[index].speedY = Math.random() * maxSpeed;
    }
  });
  
  // Request next frame
  animationFrame = requestAnimationFrame(animate);
};

// Handle window resize
const resizeCanvas = () => {
  if (!confettiCanvas.value) return;
  
  confettiCanvas.value.width = window.innerWidth;
  confettiCanvas.value.height = window.innerHeight;
};
</script>

<style scoped>
/* Styles defined in main.css */
</style> 