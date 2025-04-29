<template>
  <header :class="{ 'header-scrolled': isScrolled }">
    <div class="container">
      <nav class="main-nav">
        <!-- Logo -->
        <NuxtLink class="navbar-brand" to="/">
          <i class="bi bi-balloon-heart-fill"></i>
          <span>MARKUP<span class="highlight-word">birth</span></span>
        </NuxtLink>
        
        <!-- Navigation principale -->
        <ul class="nav-links" :class="{ 'active': menuOpen }">
          <li v-for="(item, index) in navItems" :key="`nav-${index}`" :style="{ '--i': index }">
            <NuxtLink :to="item.path" @click="closeMenu" :class="{ 'router-link-active': isActiveRoute(item.path) }">
              {{ item.name }}
            </NuxtLink>
          </li>
        </ul>
        
        <!-- Nouveau menu hamburger -->
        <div class="menu-toggle" @click="toggleMenu" :class="{ 'active': menuOpen }">
          <div class="hamburger-box">
            <span class="hamburger-inner"></span>
          </div>
        </div>
      </nav>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const isScrolled = ref(false)
const menuOpen = ref(false)

const navItems = [
  { name: 'Accueil', path: '/' },
  { name: 'Messages', path: '/mur-messages' },
  { name: 'Quiz', path: '/quiz' },
  { name: 'Mini-jeux', path: '/jeux' },
  { name: 'Défis', path: '/defis' },
  { name: 'Sondages', path: '/sondages' },
  { name: 'Playlist', path: '/playlist' },
  { name: 'Galerie', path: '/galerie' }
]

const handleScroll = () => {
  isScrolled.value = window.scrollY > 50
}

const toggleMenu = () => {
  menuOpen.value = !menuOpen.value
  document.body.style.overflow = menuOpen.value ? 'hidden' : ''
}

const closeMenu = () => {
  menuOpen.value = false
  document.body.style.overflow = ''
}

const isActiveRoute = (path) => {
  return route.path === path
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  handleScroll() // Check initial scroll position
  
  // Fermer le menu au redimensionnement de la fenêtre
  window.addEventListener('resize', closeMenu)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  window.removeEventListener('resize', closeMenu)
  document.body.style.overflow = '' // Reset overflow if component unmounts with menu open
})
</script>

<style scoped>
header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
  background: transparent;
  transition: all 0.3s ease;
}

.header-scrolled {
  background: rgba(17, 17, 17, 0.85);
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.container {
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  padding: 0 clamp(0.5rem, 3vw, 2rem);
  box-sizing: border-box;
}

.main-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: clamp(60px, 10vh, 80px);
  transition: height 0.3s ease;
}

.header-scrolled .main-nav {
  height: clamp(50px, 8vh, 60px);
}

/* Logo */
.navbar-brand {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  text-decoration: none;
  color: white;
  font-weight: 700;
  font-size: clamp(1rem, 3vw, 1.3rem);
  white-space: nowrap;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
}

.navbar-brand:hover {
  transform: translateY(-2px);
}

.navbar-brand i {
  font-size: clamp(1.2rem, 4vw, 1.5rem);
  background: linear-gradient(45deg, var(--primary-green), var(--primary-orange));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
  transition: transform 0.3s ease;
}

.navbar-brand:hover i {
  transform: scale(1.1) rotate(5deg);
}

/* Navigation */
.nav-links {
  display: flex;
  list-style: none;
  gap: clamp(0.3rem, 1vw, 0.5rem);
  margin: 0;
  padding: 0;
}

.nav-links li a {
  color: white;
  text-decoration: none;
  font-weight: 600;
  position: relative;
  padding: 0.5rem 0.8rem;
  transition: all 0.3s ease;
  font-size: clamp(0.9rem, 1vw, 1.1rem);
  letter-spacing: 0.5px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  border-radius: 50px;
  background: linear-gradient(90deg, 
    rgba(255, 255, 255, 0) 0%, 
    rgba(255, 255, 255, 0.05) 50%, 
    rgba(255, 255, 255, 0) 100%);
  display: inline-block;
}

.nav-links li a:hover {
  color: var(--primary-orange);
  transform: translateY(-2px);
  background: linear-gradient(90deg, 
    rgba(255, 255, 255, 0.05) 0%, 
    rgba(255, 255, 255, 0.1) 50%, 
    rgba(255, 255, 255, 0.05) 100%);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.nav-links li a::after {
  content: '';
  position: absolute;
  bottom: 4px;
  left: 15%;
  width: 70%;
  height: 3px;
  background: linear-gradient(to right, var(--primary-green), var(--primary-orange));
  transform: scaleX(0);
  transform-origin: right;
  transition: transform 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border-radius: 3px;
}

.nav-links li a:hover::after,
.nav-links li a.router-link-active::after {
  transform: scaleX(1);
  transform-origin: left;
}

.nav-links li a.router-link-active {
  color: var(--primary-orange);
  font-weight: 700;
  background: linear-gradient(90deg, 
    rgba(255, 255, 255, 0.05) 0%, 
    rgba(255, 255, 255, 0.12) 50%, 
    rgba(255, 255, 255, 0.05) 100%);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

/* Menu burger redesign */
.menu-toggle {
  display: none;
  justify-content: center;
  align-items: center;
  width: 42px;
  height: 42px;
  cursor: pointer;
  z-index: 1001;
  border-radius: 50%;
  background: linear-gradient(135deg, 
    rgba(46, 204, 113, 0.2), 
    rgba(243, 156, 18, 0.2));
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
  position: relative;
}

.menu-toggle:hover {
  transform: scale(1.05);
  background: linear-gradient(135deg, 
    rgba(46, 204, 113, 0.3), 
    rgba(243, 156, 18, 0.3));
}

.menu-toggle::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.menu-toggle:hover::before {
  opacity: 1;
}

.hamburger-box {
  width: 24px;
  height: 18px;
  display: inline-block;
  position: relative;
}

.hamburger-inner {
  display: block;
  top: 50%;
  margin-top: -1px;
}

.hamburger-inner, .hamburger-inner::before, .hamburger-inner::after {
  width: 24px;
  height: 2px;
  background-color: white;
  border-radius: 2px;
  position: absolute;
  transition: transform 0.3s ease, opacity 0.3s ease;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

.hamburger-inner::before, .hamburger-inner::after {
  content: '';
  display: block;
}

.hamburger-inner::before {
  top: -8px;
}

.hamburger-inner::after {
  bottom: -8px;
}

.menu-toggle.active .hamburger-inner {
  transform: rotate(45deg);
}

.menu-toggle.active .hamburger-inner::before {
  top: 0;
  opacity: 0;
  transform: translateX(-10px);
}

.menu-toggle.active .hamburger-inner::after {
  bottom: 0;
  transform: rotate(-90deg);
}

/* Media queries - Menu hamburger sur écrans moyens et petits */
@media (max-width: 1024px) {
  .menu-toggle {
    display: flex;
  }

  .nav-links {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1.2rem;
    background: rgba(17, 17, 17, 0.95);
    backdrop-filter: blur(10px);
    clip-path: circle(0% at calc(100% - 2rem - 21px) calc(2rem + 21px));
    transition: clip-path 0.5s ease-in-out;
    z-index: 1000;
  }
  
  .nav-links.active {
    clip-path: circle(150% at calc(100% - 2rem - 21px) calc(2rem + 21px));
  }

  .nav-links li {
    opacity: 0;
    transform: translateY(20px);
    transition: all 0.3s ease;
    transition-delay: calc(var(--i) * 0.08s);
  }
  
  .nav-links.active li {
    opacity: 1;
    transform: translateY(0);
  }

  .nav-links li a {
    font-size: clamp(1.1rem, 4vw, 1.4rem);
    padding: 0.7rem 1.2rem;
    min-width: 150px;
    text-align: center;
  }
}

@media (max-width: 480px) {
  .container {
    padding: 0 1rem;
  }
  
  .navbar-brand {
    font-size: 1.2rem;
  }
  
  .navbar-brand i {
    font-size: 1.4rem;
  }
  
  .nav-links li a {
    font-size: 1.1rem;
    padding: 0.6rem 1.2rem;
    min-width: 130px;
  }
  
  .nav-links {
    gap: 1rem;
  }
  
  .menu-toggle {
    width: 38px;
    height: 38px;
  }
  
  .hamburger-box {
    width: 20px;
    height: 16px;
  }
  
  .hamburger-inner, .hamburger-inner::before, .hamburger-inner::after {
    width: 20px;
  }
  
  .hamburger-inner::before {
    top: -7px;
  }
  
  .hamburger-inner::after {
    bottom: -7px;
  }
}

@media (max-width: 360px) {
  .navbar-brand {
    max-width: 180px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 1.2rem;
  }
  
  .navbar-brand i {
    font-size: 1.4rem;
  }
  
  .nav-links {
    gap: 0.8rem;
  }
  
  .nav-links li a {
    font-size: 1rem;
    padding: 0.5rem 1rem;
    min-width: 120px;
  }
  
  .menu-toggle {
    width: 34px;
    height: 34px;
  }
}

/* Ajout du style pour le mot "Anniversaire" */
.highlight-word {
  color: var(--primary-orange);
  position: relative;
  font-weight: 700;
}

.highlight-word::after {
  content: '';
  position: absolute;
  bottom: -3px;
  left: 0;
  width: 100%;
  height: 2px;
  background: var(--primary-orange);
}
</style> 