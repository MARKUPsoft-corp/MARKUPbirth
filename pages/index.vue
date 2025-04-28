<template>
  <div class="welcome-page">
    <!-- Hero Section -->
    <div class="hero-section">
      <!-- Effet de parallaxe -->
      <div class="parallax-container">
        <div class="parallax-layer layer-1" data-speed="0.1"></div>
        <div class="parallax-layer layer-2" data-speed="0.2"></div>
        <div class="parallax-layer layer-3" data-speed="0.3"></div>
        <div class="parallax-layer layer-4" data-speed="0.4"></div>
      </div>
      
      <!-- Fond avec bulles et confettis -->
      <div class="bubbles-container">
        <div v-for="n in 20" :key="`bubble-${n}`" class="bubble" :style="getBubbleStyle(n)"></div>
      </div>
      <div class="confetti-container">
        <div v-for="n in 30" :key="`confetti-${n}`" class="confetti" :style="getConfettiStyle(n)"></div>
      </div>
      
      <!-- Icônes de Technologies -->
      <div class="tech-icons-container">
        <div v-for="(icon, index) in allTechIcons" :key="`tech-icon-${icon.id}-${index}`" 
             class="tech-icon" :style="getTechIconStyle(icon, index)">
          <i :class="icon.class"></i>
        </div>
      </div>
      
      <!-- Effet de lumière -->
      <div class="light-effect"></div>
      
      <!-- Contenu principal -->
      <div class="hero-content">
        <div class="hero-text glass-card">
          <!-- Animation de texte -->
          <div class="title-container">
            <h1 class="main-title split-text" ref="titleElement">
              <span>Souhaitez moi </span>
              <span>HBD</span>
            </h1>
          </div>
          
          <p class="subtitle" ref="subtitleElement">
            Bienvenue sur le site d'anniversaire d'<span class="highlight-name">Emma le BG</span>
          </p>
          
          <!-- Compteur 3D -->
          <div class="countdown-3d">
            <div class="countdown-container">
              <div class="countdown-item glass-effect">
                <div class="countdown-number-3d">
                  <div class="number-wrapper">
                    <span class="number-content">{{ days }}</span>
                  </div>
                </div>
                <span class="countdown-label">Jours</span>
              </div>
              <div class="countdown-item glass-effect">
                <div class="countdown-number-3d">
                  <div class="number-wrapper">
                    <span class="number-content">{{ hours }}</span>
                  </div>
                </div>
                <span class="countdown-label">Heures</span>
              </div>
              <div class="countdown-item glass-effect">
                <div class="countdown-number-3d">
                  <div class="number-wrapper">
                    <span class="number-content">{{ minutes }}</span>
                  </div>
                </div>
                <span class="countdown-label">Minutes</span>
              </div>
              <div class="countdown-item glass-effect">
                <div class="countdown-number-3d">
                  <div class="number-wrapper">
                    <span class="number-content">{{ seconds }}</span>
                  </div>
                </div>
                <span class="countdown-label">Secondes</span>
              </div>
            </div>
          </div>
          
          <!-- Call to action -->
          <div class="cta-container">
            <button class="cta-button primary" @click="scrollToCards">
              <span>Explorer</span>
              <i class="bi bi-arrow-down-circle"></i>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Cartes des sections -->
    <div class="cards-section" ref="cardsSection">
      <!-- Fond animé avec formes -->
      <div class="animated-bg">
        <div class="bg-shape shape-1"></div>
        <div class="bg-shape shape-2"></div>
        <div class="bg-shape shape-3"></div>
        <div class="bg-shape shape-4"></div>
      </div>
      
      <!-- Icônes de Technologies -->
      <div class="tech-icons-container cards-tech-icons">
        <div v-for="(icon, index) in allTechIcons" :key="`cards-tech-icon-${icon.id}-${index}`" 
             class="tech-icon cards-tech-icon" :style="getCardsTechIconStyle(icon, index)">
          <i :class="icon.class"></i>
        </div>
      </div>
      
      <div class="section-title">
        <h2>Découvrir</h2>
        <div class="title-underline"></div>
      </div>
      <div class="cards-grid">
        <!-- Carte Messages -->
        <div class="feature-card messages-card" v-scroll-reveal="{ delay: 200, distance: '50px', origin: 'bottom' }">
          <div class="card-content">
            <div class="card-icon">
              <i class="bi bi-chat-heart"></i>
            </div>
            <h3>Messages</h3>
            <p>Laissez un message personnel pour Emmanuel</p>
            <NuxtLink to="/mur-messages" class="card-button">
              Écrire un message
              <i class="bi bi-arrow-right"></i>
            </NuxtLink>
          </div>
        </div>

        <!-- Carte Quiz -->
        <div class="feature-card quiz-card" v-scroll-reveal="{ delay: 300, distance: '50px', origin: 'bottom' }">
          <div class="card-content">
            <div class="card-icon">
              <i class="bi bi-puzzle"></i>
            </div>
            <h3>Quiz</h3>
            <p>Testez vos connaissances sur Emmanuel</p>
            <NuxtLink to="/quiz" class="card-button">
              Commencer le quiz
              <i class="bi bi-arrow-right"></i>
            </NuxtLink>
          </div>
        </div>
        
        <!-- Carte Mini-jeux -->
        <div class="feature-card games-card" v-scroll-reveal="{ delay: 400, distance: '50px', origin: 'bottom' }">
          <div class="card-content">
            <div class="card-icon">
              <i class="bi bi-controller"></i>
            </div>
            <h3>Mini-jeux</h3>
            <p>Amusez-vous avec des jeux thématiques</p>
            <NuxtLink to="/jeux" class="card-button">
              Jouer
              <i class="bi bi-arrow-right"></i>
            </NuxtLink>
          </div>
        </div>

        <!-- Carte Défis -->
        <div class="feature-card challenges-card" v-scroll-reveal="{ delay: 500, distance: '50px', origin: 'bottom' }">
          <div class="card-content">
            <div class="card-icon">
              <i class="bi bi-trophy"></i>
            </div>
            <h3>Défis</h3>
            <p>Relevez des défis personnalisés</p>
            <NuxtLink to="/defis" class="card-button">
              Voir les défis
              <i class="bi bi-arrow-right"></i>
            </NuxtLink>
          </div>
        </div>

        <!-- Carte Sondages -->
        <div class="feature-card polls-card" v-scroll-reveal="{ delay: 600, distance: '50px', origin: 'bottom' }">
          <div class="card-content">
            <div class="card-icon">
              <i class="bi bi-bar-chart"></i>
            </div>
            <h3>Sondages</h3>
            <p>Participez aux sondages et découvrez les résultats</p>
            <NuxtLink to="/sondages" class="card-button">
              Voter
              <i class="bi bi-arrow-right"></i>
            </NuxtLink>
          </div>
        </div>
        
        <!-- Carte Playlist -->
        <div class="feature-card playlist-card" v-scroll-reveal="{ delay: 700, distance: '50px', origin: 'bottom' }">
          <div class="card-content">
            <div class="card-icon">
              <i class="bi bi-music-note-beamed"></i>
            </div>
            <h3>Playlist</h3>
            <p>Écoutez et partagez de la musique</p>
            <NuxtLink to="/playlist" class="card-button">
              Écouter
              <i class="bi bi-arrow-right"></i>
            </NuxtLink>
          </div>
        </div>
        
        <!-- Carte Galerie -->
        <div class="feature-card gallery-card" v-scroll-reveal="{ delay: 800, distance: '50px', origin: 'bottom' }">
          <div class="card-content">
            <div class="card-icon">
              <i class="bi bi-images"></i>
            </div>
            <h3>Galerie</h3>
            <p>Partagez vos photos souvenirs</p>
            <NuxtLink to="/galerie" class="card-button">
              Voir la galerie
              <i class="bi bi-arrow-right"></i>
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick, computed } from 'vue'

const days = ref(0)
const hours = ref(0)
const minutes = ref(0)
const seconds = ref(0)
let countdownInterval
let parallaxElements = []
const titleElement = ref(null)
const subtitleElement = ref(null)
const cardsSection = ref(null)

// Calcul de la prochaine date d'anniversaire (30 avril)
const nextBirthdayDate = computed(() => {
  const today = new Date()
  const currentYear = today.getFullYear()
  
  // Créer la date du 30 avril pour l'année en cours
  let nextBirthday = new Date(currentYear, 3, 30) // Mois est 0-indexé, donc 3 = avril
  
  // Si cette date est déjà passée, utiliser le 30 avril de l'année prochaine
  if (today > nextBirthday) {
    nextBirthday = new Date(currentYear + 1, 3, 30)
  }
  
  return nextBirthday
})

const updateCountdown = () => {
  const now = new Date()
  const diff = nextBirthdayDate.value - now
  
  days.value = Math.floor(diff / (1000 * 60 * 60 * 24))
  hours.value = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  minutes.value = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  seconds.value = Math.floor((diff % (1000 * 60)) / 1000)
  
  // Si pour une raison quelconque le compte à rebours est négatif, réinitialiser à zéro
  if (diff < 0) {
    days.value = hours.value = minutes.value = seconds.value = 0
  }
}

// Définition des icônes tech
const techIcons = [
  { class: 'bi bi-code-slash', color: '#61DAFB' },
  { class: 'bi bi-laptop', color: '#F0DB4F' },
  { class: 'bi bi-braces', color: '#3C873A' },
  { class: 'bi bi-database', color: '#E34F26' },
  { class: 'bi bi-code-square', color: '#007ACC' },
  { class: 'bi bi-terminal', color: '#F05032' },
  { class: 'bi bi-github', color: '#6e5494' },
  { class: 'bi bi-filetype-html', color: '#E34F26' },
  { class: 'bi bi-filetype-css', color: '#264DE4' },
  { class: 'bi bi-filetype-js', color: '#F0DB4F' },
  { class: 'bi bi-filetype-php', color: '#787CB5' },
  { class: 'bi bi-filetype-json', color: '#000080' },
  { class: 'bi bi-filetype-xml', color: '#0074BD' },
  { class: 'bi bi-filetype-sql', color: '#F29111' },
  { class: 'bi bi-cloud', color: '#FF9900' },
  { class: 'bi bi-cpu', color: '#00ADD8' },
  { class: 'bi bi-server', color: '#FF9A00' },
  { class: 'bi bi-hdd-network', color: '#764ABC' },
  { class: 'bi bi-router', color: '#DD0031' },
  { class: 'bi bi-windows', color: '#0078D6' },
  { class: 'bi bi-apple', color: '#999999' },
  { class: 'bi bi-ubuntu', color: '#E95420' },
  { class: 'bi bi-android', color: '#3DDC84' },
  { class: 'bi bi-bug', color: '#FB7A24' },
  { class: 'bi bi-gear', color: '#6C757D' }
]

// Génération d'un grand nombre d'icônes en dupliquant la liste
const allTechIcons = [...techIcons, ...techIcons].map((icon, index) => ({
  ...icon,
  id: index // Ajouter un ID unique pour le rendu des duplications
}))

// Fonction pour le style des icônes tech
const getTechIconStyle = (icon, index) => {
  const size = Math.random() * 25 + 15
  const duration = Math.random() * 50 + 70 // Durées plus longues pour un mouvement plus lent
  const delay = Math.random() * 40
  const posX = Math.random() * 100
  const startY = Math.random() * 100 // Position Y initiale aléatoire
  const amplitude = Math.random() * 20 + 5 // Amplitude aléatoire pour le mouvement
  const direction = Math.random() > 0.5 ? 1 : -1 // Direction aléatoire
  const rotation = Math.random() * 360
  const rotationSpeed = Math.random() * 2 - 1 // Vitesse de rotation aléatoire
  const opacity = Math.random() * 0.3 + 0.1
  
  return {
    '--size': `${size}px`,
    '--duration': `${duration}s`,
    '--delay': `${delay}s`,
    '--pos-x': `${posX}%`,
    '--start-y': `${startY}%`,
    '--amplitude': `${amplitude}px`,
    '--direction': direction,
    '--rotation': `${rotation}deg`,
    '--rotation-speed': rotationSpeed,
    '--color': icon.color,
    '--opacity': opacity,
    'animation-duration': `${duration}s`,
    'animation-delay': `${delay}s`,
    'left': `${posX}%`,
    'top': `${startY}%`,
    'color': icon.color,
    'opacity': opacity
  }
}

const getBubbleStyle = (index) => {
  const size = Math.random() * 30 + 10
  const duration = Math.random() * 20 + 10
  const delay = Math.random() * 10
  const posX = Math.random() * 100
  
  return {
    '--size': `${size}px`,
    '--duration': `${duration}s`,
    '--delay': `${delay}s`,
    '--pos-x': `${posX}%`,
    'animation-duration': `${duration}s`,
    'animation-delay': `${delay}s`,
    'left': `${posX}%`
  }
}

const getConfettiStyle = (index) => {
  const colors = ['var(--primary-green)', 'var(--primary-orange)', 'var(--light-green)', 'var(--dark-orange)', 'var(--light-orange)']
  const size = Math.random() * 10 + 5
  const duration = Math.random() * 15 + 8
  const delay = Math.random() * 5
  const posX = Math.random() * 100
  const color = colors[Math.floor(Math.random() * colors.length)]
  const rotation = Math.random() * 360
  
  return {
    '--size': `${size}px`,
    '--duration': `${duration}s`,
    '--delay': `${delay}s`,
    '--rotation': `${rotation}deg`,
    '--color': color,
    'animation-duration': `${duration}s`,
    'animation-delay': `${delay}s`,
    'left': `${posX}%`,
    'background-color': color
  }
}

const handleParallax = (e) => {
  parallaxElements.forEach(el => {
    const speed = parseFloat(el.dataset.speed)
    const x = (window.innerWidth - e.pageX * speed) / 100
    const y = (window.innerHeight - e.pageY * speed) / 100
    el.style.transform = `translateX(${x}px) translateY(${y}px)`
  })
}

const scrollToCards = () => {
  if (cardsSection.value) {
    cardsSection.value.scrollIntoView({ behavior: 'smooth' })
  }
}

const initTypeAnimation = () => {
  if (titleElement.value) {
    const title = titleElement.value
    const spans = title.querySelectorAll('span')
    
    spans.forEach((span, index) => {
      span.style.animationDelay = `${index * 0.2}s`
      span.classList.add('animate-in')
    })
  }
  
  if (subtitleElement.value) {
    subtitleElement.value.classList.add('fade-in')
  }
}

// Directive pour les animations au scroll
const vScrollReveal = {
  mounted: (el, binding) => {
    const options = binding.value || {}
    const defaultOptions = {
      delay: 200,
      distance: '50px',
      duration: 800,
      easing: 'cubic-bezier(0.5, 0, 0, 1)',
      origin: 'bottom',
      reset: false,
      scale: 1,
      opacity: 0,
      mobile: true
    }
    
    const mergedOptions = { ...defaultOptions, ...options }
    
    el.style.visibility = 'hidden'
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            el.style.visibility = 'visible'
            el.style.transition = `all ${mergedOptions.duration}ms ${mergedOptions.easing}`
            el.style.opacity = '1'
            el.style.transform = 'translateY(0) scale(1)'
            
            if (!mergedOptions.reset) {
              observer.unobserve(el)
            }
          }, mergedOptions.delay)
        } else if (mergedOptions.reset) {
          el.style.visibility = 'hidden'
          el.style.opacity = mergedOptions.opacity
          
          if (mergedOptions.origin === 'top') {
            el.style.transform = `translateY(-${mergedOptions.distance}) scale(${mergedOptions.scale})`
          } else if (mergedOptions.origin === 'bottom') {
            el.style.transform = `translateY(${mergedOptions.distance}) scale(${mergedOptions.scale})`
          } else if (mergedOptions.origin === 'left') {
            el.style.transform = `translateX(-${mergedOptions.distance}) scale(${mergedOptions.scale})`
          } else if (mergedOptions.origin === 'right') {
            el.style.transform = `translateX(${mergedOptions.distance}) scale(${mergedOptions.scale})`
          }
        }
      })
    }, { threshold: 0.1 })
    
    observer.observe(el)
    
    el.style.opacity = mergedOptions.opacity
    
    if (mergedOptions.origin === 'top') {
      el.style.transform = `translateY(-${mergedOptions.distance}) scale(${mergedOptions.scale})`
    } else if (mergedOptions.origin === 'bottom') {
      el.style.transform = `translateY(${mergedOptions.distance}) scale(${mergedOptions.scale})`
    } else if (mergedOptions.origin === 'left') {
      el.style.transform = `translateX(-${mergedOptions.distance}) scale(${mergedOptions.scale})`
    } else if (mergedOptions.origin === 'right') {
      el.style.transform = `translateX(${mergedOptions.distance}) scale(${mergedOptions.scale})`
    }
  }
}

// Fonction pour le style des icônes tech dans la section des cartes
const getCardsTechIconStyle = (icon, index) => {
  const size = Math.random() * 25 + 20
  const duration = Math.random() * 50 + 80
  const delay = Math.random() * 30
  const posX = Math.random() * 100
  const startY = Math.random() * 100
  const amplitude = Math.random() * 20 + 10
  const direction = Math.random() > 0.5 ? 1 : -1
  const rotation = Math.random() * 360
  const rotationSpeed = Math.random() * 2 - 1
  const opacity = Math.random() * 0.15 + 0.05  // Opacité réduite
  
  return {
    '--size': `${size}px`,
    '--duration': `${duration}s`,
    '--delay': `${delay}s`,
    '--pos-x': `${posX}%`,
    '--start-y': `${startY}%`,
    '--amplitude': `${amplitude}px`,
    '--direction': direction,
    '--rotation': `${rotation}deg`,
    '--rotation-speed': rotationSpeed,
    '--color': icon.color,
    '--opacity': opacity,
    'animation-duration': `${duration}s`,
    'animation-delay': `${delay}s`,
    'left': `${posX}%`,
    'top': `${startY}%`,
    'color': icon.color,
    'opacity': opacity
  }
}

onMounted(() => {
  updateCountdown()
  countdownInterval = setInterval(updateCountdown, 1000)
  
  parallaxElements = document.querySelectorAll('.parallax-layer')
  window.addEventListener('mousemove', handleParallax)
  
  nextTick(() => {
    initTypeAnimation()
  })
})

onUnmounted(() => {
  clearInterval(countdownInterval)
  window.removeEventListener('mousemove', handleParallax)
})
</script>

<style scoped>
.welcome-page {
  min-height: 100vh;
  position: relative;
  overflow: hidden;
}

.hero-section {
  height: 100vh;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: #111;
  padding-top: 80px; /* Espace pour la navbar */
  box-sizing: border-box; /* S'assurer que padding est inclus dans la hauteur */
}

/* Effets parallaxe */
.parallax-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
}

.parallax-layer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-size: cover;
  opacity: 0.4;
  transition: transform 0.1s ease-out;
}

.layer-1 {
  background: radial-gradient(circle at 30% 30%, rgba(46, 204, 113, 0.4), transparent 70%);
}

.layer-2 {
  background: radial-gradient(circle at 70% 60%, rgba(243, 156, 18, 0.4), transparent 70%);
}

.layer-3 {
  background: radial-gradient(circle at 20% 80%, rgba(82, 234, 148, 0.3), transparent 60%);
}

.layer-4 {
  background: radial-gradient(circle at 80% 20%, rgba(214, 137, 16, 0.3), transparent 60%);
}

/* Bulles et confettis */
.bubbles-container, .confetti-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
  overflow: hidden;
}

.bubble {
  position: absolute;
  bottom: -100px;
  width: var(--size);
  height: var(--size);
  border-radius: 50%;
  box-shadow: inset 0 0 10px rgba(255, 255, 255, 0.3), 0 0 15px rgba(255, 255, 255, 0.1);
  background: linear-gradient(to right bottom, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05));
  backdrop-filter: blur(1px);
  opacity: 0;
  animation: bubbleRise var(--duration) ease-in infinite var(--delay);
}

.confetti {
  position: absolute;
  top: -20px;
  width: var(--size);
  height: calc(var(--size) * 0.4);
  background-color: var(--color);
  opacity: 0;
  transform: rotate(var(--rotation));
  animation: confettiFall var(--duration) ease-in-out infinite var(--delay);
}

/* Effet de lumière */
.light-effect {
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

/* Contenu principal */
.hero-content {
  position: relative;
  z-index: 10;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: calc(100vh - 80px); /* Hauteur exacte pour s'adapter à l'écran */
  padding: 0 2rem;
  box-sizing: border-box;
}

.hero-text {
  max-width: 900px;
  width: 100%;
  text-align: center;
  padding: clamp(1.5rem, 3vh, 3rem) clamp(1rem, 2vw, 2rem);
  position: relative;
  overflow: auto; /* Au cas où le contenu est trop grand */
  max-height: 90vh; /* Empêcher le débordement sur les grands écrans */
}

.glass-card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 25px 45px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  position: relative;
}

.glass-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: -50%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    to right,
    rgba(255, 255, 255, 0),
    rgba(255, 255, 255, 0.05),
    rgba(255, 255, 255, 0)
  );
  transform: skewX(-15deg);
  transition: 0.5s;
  pointer-events: none;
}

.title-container {
  margin-bottom: clamp(0.6rem, 2vh, 1.2rem);
  position: relative;
  overflow: hidden;
}

.main-title {
  font-size: clamp(2.2rem, 4.5vw, 4.5rem);
  font-weight: 900;
  line-height: 1.1;
  margin-bottom: clamp(0.3rem, 1vh, 0.8rem);
  background: linear-gradient(45deg, var(--primary-green), var(--primary-orange));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.split-text span {
  display: block;
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.8s cubic-bezier(0.215, 0.61, 0.355, 1);
}

.split-text span.animate-in {
  opacity: 1;
  transform: translateY(0);
}

.subtitle {
  font-size: clamp(0.9rem, 1.8vw, 1.5rem);
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: clamp(0.6rem, 2vh, 1.2rem);
  font-weight: 300;
  opacity: 0;
  transition: opacity 0.8s ease;
}

.subtitle.fade-in {
  opacity: 1;
}

.highlight-name {
  background: linear-gradient(45deg, var(--primary-green), var(--primary-orange));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: 600;
}

/* Compteur 3D */
.countdown-3d {
  perspective: 1000px;
  margin-bottom: clamp(0.6rem, 2vh, 1.2rem);
  width: 100%;
}

.countdown-container {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: clamp(0.3rem, 1.5vw, 1rem);
  transform-style: preserve-3d;
  width: 100%;
  max-width: 95%;
  margin: 0 auto;
}

.countdown-item {
  width: clamp(70px, 22%, 180px);
  padding: clamp(0.4rem, 1.5vw, 0.8rem) clamp(0.3rem, 0.8vw, 0.8rem);
  border-radius: 12px;
  text-align: center;
  transform: translateZ(0);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  margin: 0.3rem;
}

.glass-effect {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.1);
  position: relative;
  overflow: hidden;
}

.glass-effect::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    to bottom right,
    rgba(255, 255, 255, 0.1),
    rgba(255, 255, 255, 0.05),
    rgba(255, 255, 255, 0)
  );
  pointer-events: none;
}

.countdown-item:hover {
  transform: translateY(-10px) translateZ(20px);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.3);
}

.countdown-number-3d {
  position: relative;
  height: clamp(40px, 6vw, 60px);
  perspective: 500px;
  margin-bottom: 0.3rem;
}

.number-wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  transform-style: preserve-3d;
  transition: transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  animation: pulse 2s infinite;
}

.number-wrapper:hover {
  animation-play-state: paused;
}

.number-content {
  font-size: clamp(1.3rem, 4vw, 2.8rem);
  font-weight: 700;
  color: white;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

.countdown-label {
  font-size: clamp(0.6rem, 0.8vw, 0.8rem);
  color: rgba(255, 255, 255, 0.7);
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: 500;
}

/* Call to action */
.cta-container {
  margin-top: clamp(0.4rem, 1.5vh, 1rem);
  display: flex;
  justify-content: center;
}

.cta-button {
  padding: clamp(0.5rem, 1.5vw, 0.8rem) clamp(1.2rem, 2.5vw, 2rem);
  font-size: clamp(0.9rem, 1.4vw, 1.1rem);
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  position: relative;
  overflow: hidden;
  z-index: 1;
  border-radius: 50px;
}

.cta-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(45deg, var(--primary-green), var(--primary-orange));
  z-index: -1;
  transition: all 0.3s ease;
}

.cta-button::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(45deg, var(--primary-orange), var(--primary-green));
  z-index: -1;
  opacity: 0;
  transition: all 0.3s ease;
}

.cta-button:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
}

.cta-button:hover::after {
  opacity: 1;
}

.cta-button i {
  font-size: clamp(1.2rem, 1.5vw, 1.5rem);
  transition: transform 0.3s ease;
}

.cta-button:hover i {
  transform: translateY(3px);
}

.cta-button.primary {
  color: white;
}

/* Cartes Section */
.cards-section {
  padding: 5rem 1rem 6rem;
  background: #f9f9f9;
  position: relative;
  z-index: 1;
  overflow: hidden;
}

/* Fond animé */
.animated-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  overflow: hidden;
}

.bg-shape {
  position: absolute;
  border-radius: 50%;
  opacity: 0.2;
  filter: blur(60px);
  animation: floatAnimation 15s infinite alternate ease-in-out;
}

.shape-1 {
  width: 40%;
  height: 40%;
  left: -10%;
  top: -10%;
  background: rgba(46, 204, 113, 0.3);
  animation-delay: 0s;
}

.shape-2 {
  width: 35%;
  height: 35%;
  right: -5%;
  top: 20%;
  background: rgba(243, 156, 18, 0.3);
  animation-delay: 3s;
}

.shape-3 {
  width: 30%;
  height: 30%;
  left: 20%;
  bottom: -5%;
  background: rgba(82, 234, 148, 0.3);
  animation-delay: 6s;
}

.shape-4 {
  width: 25%;
  height: 25%;
  right: 10%;
  bottom: 10%;
  background: rgba(214, 137, 16, 0.3);
  animation-delay: 9s;
}

@keyframes floatAnimation {
  0% {
    transform: translateY(0) translateX(0) scale(1);
  }
  50% {
    transform: translateY(-30px) translateX(20px) scale(1.1);
  }
  100% {
    transform: translateY(20px) translateX(-20px) scale(0.95);
  }
}

.section-title {
  text-align: center;
  margin-bottom: 3rem;
  position: relative;
}

.section-title h2 {
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 800;
  color: #333;
  margin-bottom: 1rem;
  background: linear-gradient(45deg, var(--primary-green), var(--primary-orange));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  display: inline-block;
}

.title-underline {
  height: 4px;
  width: 80px;
  margin: 0 auto;
  background: linear-gradient(to right, var(--primary-green), var(--primary-orange));
  border-radius: 2px;
  position: relative;
}

.title-underline::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to right, var(--primary-orange), var(--primary-green));
  border-radius: 2px;
  opacity: 0;
  transition: opacity 0.5s ease;
}

.section-title:hover .title-underline::before {
  opacity: 1;
}

.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.feature-card {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 16px;
  padding: 0; /* Supprimé le padding ici */
  text-align: center;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(5px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transform-style: preserve-3d;
  perspective: 1000px;
}

.card-content {
  padding: 2.5rem 2rem;
  position: relative;
  z-index: 1;
  transition: all 0.4s ease;
}

.feature-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(to right, var(--primary-green), var(--primary-orange));
  opacity: 0.7;
  transition: opacity 0.3s ease, height 0.4s ease;
  z-index: 0;
}

/* Suppression de l'effet de highlight blanc */
.feature-card::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, 
    rgba(46, 204, 113, 0.05) 0%, 
    rgba(255, 255, 255, 0.05) 50%, 
    rgba(243, 156, 18, 0.05) 100%);
  opacity: 0;
  transition: opacity 0.5s ease;
  z-index: 0;
}

.feature-card:hover {
  transform: translateY(-10px) rotateX(3deg) rotateY(3deg);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  background: rgba(255, 255, 255, 0.95);
}

.feature-card:hover::before {
  opacity: 1;
  height: 6px;
}

.feature-card:hover::after {
  opacity: 1;
}

.feature-card:hover .card-content {
  transform: translateZ(20px);
}

.card-icon {
  width: 90px;
  height: 90px;
  margin: 0 auto 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  font-size: 2.5rem;
  transition: all 0.5s cubic-bezier(0.25, 1, 0.5, 1);
  position: relative;
  background: rgba(255, 255, 255, 0.8);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.feature-card:hover .card-icon {
  transform: scale(1.1) rotate(10deg);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.card-icon::before {
  content: '';
  position: absolute;
  inset: -5px;
  border-radius: 50%;
  background: linear-gradient(45deg, var(--primary-green), var(--primary-orange));
  opacity: 0.1;
  z-index: -1;
  transition: opacity 0.5s ease;
}

.feature-card:hover .card-icon::before {
  opacity: 0.2;
}

.messages-card .card-icon i {
  color: var(--primary-green);
  transition: transform 0.5s ease, color 0.3s ease;
}

.quiz-card .card-icon i {
  color: var(--light-green);
  transition: transform 0.5s ease, color 0.3s ease;
}

.games-card .card-icon i {
  color: #3498db;
  transition: transform 0.5s ease, color 0.3s ease;
}

.challenges-card .card-icon i {
  color: #9b59b6;
  transition: transform 0.5s ease, color 0.3s ease;
}

.polls-card .card-icon i {
  color: #e74c3c;
  transition: transform 0.5s ease, color 0.3s ease;
}

.playlist-card .card-icon i {
  color: #f39c12;
  transition: transform 0.5s ease, color 0.3s ease;
}

.gallery-card .card-icon i {
  color: var(--primary-orange);
  transition: transform 0.5s ease, color 0.3s ease;
}

.feature-card h3 {
  font-size: 1.8rem;
  margin-bottom: 1rem;
  color: #333;
  transition: transform 0.3s ease, color 0.3s ease;
}

.feature-card:hover h3 {
  transform: translateY(-3px);
  color: var(--primary-orange);
}

.feature-card p {
  color: #666;
  margin-bottom: 1.8rem;
  font-size: 1.1rem;
  line-height: 1.6;
  transition: transform 0.4s ease;
}

.feature-card:hover p {
  transform: translateY(-2px);
}

.card-button {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.8rem 1.5rem;
  border-radius: 50px;
  background: linear-gradient(to right, var(--primary-green), var(--primary-orange));
  color: white;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  z-index: 1;
}

.card-button::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to right, var(--primary-orange), var(--primary-green));
  z-index: -1;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.card-button:hover::after {
  opacity: 1;
}

.card-button:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.card-button i {
  transition: transform 0.3s ease;
}

.card-button:hover i {
  transform: translateX(5px);
}

@media (max-width: 768px) {
  .cards-section {
    padding: 4rem 1.5rem 5rem; /* Plus de marge sur les côtés */
  }
  
  .cards-grid {
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 1.5rem;
    max-width: 95%;
    margin: 0 auto;
    padding: 0 0.5rem;
  }
  
  .feature-card {
    max-width: 100%;
    transform-origin: center;
  }
  
  .card-content {
    padding: 2rem 1.5rem;
  }
}

@media (max-width: 480px) {
  .cards-section {
    padding: 3.5rem 1rem 4.5rem; /* Plus de marge sur les côtés */
  }
  
  .cards-grid {
    grid-template-columns: 1fr;
    max-width: 90%;
    padding: 0 1rem;
  }
  
  .card-content {
    padding: 1.8rem 1.2rem;
  }
  
  .feature-card {
    border-radius: 12px;
  }
  
  .card-icon {
    width: 75px;
    height: 75px;
    font-size: 2rem;
    margin-bottom: 1rem;
  }
  
  .feature-card h3 {
    font-size: 1.5rem;
    margin-bottom: 0.7rem;
  }
  
  .feature-card p {
    font-size: 0.95rem;
    margin-bottom: 1.4rem;
  }
  
  .card-button {
    padding: 0.7rem 1.2rem;
    font-size: 0.9rem;
  }
}

@media (max-width: 360px) {
  .cards-section {
    padding: 3rem 0.5rem 4rem;
  }
  
  .cards-grid {
    max-width: 95%;
    padding: 0 0.5rem;
  }
  
  .card-content {
    padding: 1.5rem 1rem;
  }
  
  .card-icon {
    width: 65px;
    height: 65px;
    font-size: 1.7rem;
  }
  
  .feature-card h3 {
    font-size: 1.3rem;
  }
  
  .feature-card p {
    font-size: 0.9rem;
    line-height: 1.4;
  }
  
  .feature-card {
    border-radius: 10px;
  }
}

/* Animations */
@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

@keyframes bubbleRise {
  0% {
    transform: translateY(0) translateX(0) scale(1);
    opacity: 0;
  }
  5% {
    opacity: 0.8;
  }
  25% {
    transform: translateY(-25vh) translateX(calc(var(--pos-x) * 0.1px)) scale(1.2);
  }
  50% {
    transform: translateY(-50vh) translateX(calc(var(--pos-x) * -0.1px)) scale(1.4);
  }
  75% {
    transform: translateY(-75vh) translateX(calc(var(--pos-x) * 0.1px)) scale(1.6);
    opacity: 0.4;
  }
  100% {
    transform: translateY(-100vh) translateX(0) scale(1.8);
    opacity: 0;
  }
}

@keyframes confettiFall {
  0% {
    transform: translateY(0) rotate(var(--rotation));
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 0.3;
  }
  100% {
    transform: translateY(100vh) rotate(calc(var(--rotation) + 180deg));
    opacity: 0;
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Media queries améliorées */
@media (max-width: 992px) and (min-height: 700px) {
  .hero-section {
    padding-top: 60px;
  }
  
  .hero-content {
    min-height: calc(100vh - 60px);
  }
  
  .hero-text {
    padding: 2rem 1.5rem;
  }
}

@media (max-width: 768px) {
  .hero-section {
    height: auto;
    min-height: 100vh;
    padding-top: 60px;
  }
  
  .hero-content {
    height: auto;
    min-height: calc(100vh - 60px);
    padding: 2rem 1rem;
    padding-bottom: 1rem; /* Réduire l'espace en bas */
  }
  
  .hero-text {
    padding: 1.5rem 1rem 1rem; /* Réduire le padding en bas */
  }
  
  .countdown-container {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: repeat(2, auto);
    gap: 1rem;
    width: 100%;
    max-width: 400px;
    margin: 0 auto;
  }
  
  .countdown-item {
    width: 100%;
    margin: 0;
    padding: 0.8rem 0.5rem;
  }
  
  .number-content {
    font-size: clamp(1.5rem, 5vw, 2.5rem);
  }
}

@media (max-width: 480px) {
  .hero-content {
    padding: 1.5rem 1rem 0.5rem; /* Réduire encore plus l'espace en bas */
  }
  
  .hero-text {
    padding: 1.2rem 0.8rem 0.8rem; /* Réduire davantage le padding */
  }
  
  .cta-container {
    margin-top: 0.8rem;
    margin-bottom: 0.5rem; /* Ajouter une marge en bas minimale */
  }
}

/* Pour les téléphones avec petits écrans */
@media (max-width: 360px) {
  .hero-content {
    padding: 1rem 0.8rem 0.3rem; /* Espace minimal en bas */
  }
  
  .hero-text {
    padding: 1rem 0.6rem 0.6rem;
  }
  
  .cta-container {
    margin-top: 0.6rem;
    margin-bottom: 0.3rem;
  }
}

@media (max-height: 600px) {
  .hero-section {
    height: auto;
    min-height: calc(100vh - 60px);
  }
  
  .hero-content {
    height: auto;
    min-height: auto;
    padding: 1rem;
  }
  
  .hero-text {
    padding: 1rem;
  }
  
  .main-title {
    font-size: clamp(2rem, 3vw, 2.5rem);
    margin-bottom: 0.5rem;
  }
  
  .subtitle {
    font-size: 1rem;
    margin-bottom: 0.5rem;
  }
  
  .countdown-3d {
    margin-bottom: 0.5rem;
  }
  
  .countdown-number-3d {
    height: 40px;
  }
}

/* Pour les écrans très hauts, réduire davantage les espaces */
@media (min-height: 1000px) {
  .hero-text {
    max-height: 80vh;
  }
}

/* Styles pour les icônes tech */
.tech-icons-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
  overflow: hidden;
}

.tech-icon {
  position: absolute;
  font-size: var(--size);
  opacity: var(--opacity);
  color: var(--color);
  filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.3));
  animation: techFloat var(--duration) ease-in-out infinite var(--delay);
  transform: translateZ(0);
  will-change: transform, opacity;
}

@keyframes techFloat {
  0%, 100% {
    transform: translate(0, 0) rotate(var(--rotation));
  }
  25% {
    transform: translate(calc(var(--amplitude) * var(--direction)), calc(var(--amplitude) * -1)) 
               rotate(calc(var(--rotation) + var(--rotation-speed) * 90deg));
  }
  50% {
    transform: translate(0, calc(var(--amplitude) * -2)) 
               rotate(calc(var(--rotation) + var(--rotation-speed) * 180deg));
  }
  75% {
    transform: translate(calc(var(--amplitude) * var(--direction) * -1), calc(var(--amplitude) * -1)) 
               rotate(calc(var(--rotation) + var(--rotation-speed) * 270deg));
  }
}

/* Styles pour les icônes tech dans la section des cartes */
.cards-tech-icons {
  z-index: 0;
  opacity: 1; /* Pleine opacité pour le conteneur */
}

.cards-tech-icon {
  color: var(--color);
  opacity: var(--opacity);
  filter: drop-shadow(0 0 8px rgba(var(--color), 0.4));
  text-shadow: 0 0 15px var(--color);
  font-weight: bold;
}

/* Animation plus prononcée pour les icônes technologiques */
@keyframes techFloatCards {
  0%, 100% {
    transform: translate(0, 0) rotate(var(--rotation)) scale(1);
    filter: drop-shadow(0 0 10px rgba(var(--color), 0.5));
  }
  25% {
    transform: translate(calc(var(--amplitude) * 1.2 * var(--direction)), calc(var(--amplitude) * -1)) 
              rotate(calc(var(--rotation) + var(--rotation-speed) * 90deg)) scale(1.1);
    filter: drop-shadow(0 0 15px rgba(var(--color), 0.7));
  }
  50% {
    transform: translate(0, calc(var(--amplitude) * -2)) 
              rotate(calc(var(--rotation) + var(--rotation-speed) * 180deg)) scale(1.15);
    filter: drop-shadow(0 0 20px rgba(var(--color), 0.8));
  }
  75% {
    transform: translate(calc(var(--amplitude) * var(--direction) * -1.2), calc(var(--amplitude) * -1)) 
              rotate(calc(var(--rotation) + var(--rotation-speed) * 270deg)) scale(1.1);
    filter: drop-shadow(0 0 15px rgba(var(--color), 0.7));
  }
}

.cards-tech-icon {
  animation: techFloatCards var(--duration) ease-in-out infinite var(--delay);
}

.feature-card:hover .card-icon i {
  transform: scale(1.2) rotate(-10deg);
}
</style> 