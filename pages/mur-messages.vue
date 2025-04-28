<template>
  <div class="messages-page">
    <!-- Icônes flottantes en arrière-plan -->
    <div class="floating-icons">
      <div class="floating-icon icon-code"><i class="bi bi-code-slash"></i></div>
      <div class="floating-icon icon-cpu"><i class="bi bi-cpu"></i></div>
      <div class="floating-icon icon-server"><i class="bi bi-server"></i></div>
      <div class="floating-icon icon-database"><i class="bi bi-database"></i></div>
      <div class="floating-icon icon-cloud"><i class="bi bi-cloud"></i></div>
      <div class="floating-icon icon-laptop"><i class="bi bi-laptop"></i></div>
      <div class="floating-icon icon-window"><i class="bi bi-window"></i></div>
      <div class="floating-icon icon-terminal"><i class="bi bi-terminal"></i></div>
      <div class="floating-icon icon-router"><i class="bi bi-router"></i></div>
      <div class="floating-icon icon-phone"><i class="bi bi-phone"></i></div>
      <div class="floating-icon icon-tablet"><i class="bi bi-tablet"></i></div>
      <div class="floating-icon icon-hdd"><i class="bi bi-hdd-network"></i></div>
      <div class="floating-icon icon-git"><i class="bi bi-git"></i></div>
      <div class="floating-icon icon-globe"><i class="bi bi-globe"></i></div>
      <div class="floating-icon icon-wifi"><i class="bi bi-wifi"></i></div>
      <div class="floating-icon icon-plugin"><i class="bi bi-plug"></i></div>
      <div class="floating-icon icon-shield"><i class="bi bi-shield-lock"></i></div>
      <div class="floating-icon icon-diagram"><i class="bi bi-diagram-3"></i></div>
      <div class="floating-icon icon-graph"><i class="bi bi-graph-up"></i></div>
      <div class="floating-icon icon-layers"><i class="bi bi-layers"></i></div>
      <div class="floating-icon icon-card"><i class="bi bi-credit-card-2-front"></i></div>
      <div class="floating-icon icon-camera"><i class="bi bi-camera"></i></div>
      <div class="floating-icon icon-pen"><i class="bi bi-pen"></i></div>
      <div class="floating-icon icon-display"><i class="bi bi-display"></i></div>
      <div class="floating-icon icon-brackets"><i class="bi bi-braces"></i></div>
      <div class="floating-icon icon-award"><i class="bi bi-award"></i></div>
      <div class="floating-icon icon-lightbulb"><i class="bi bi-lightbulb"></i></div>
      <div class="floating-icon icon-ethernet"><i class="bi bi-ethernet"></i></div>
      <div class="floating-icon icon-cast"><i class="bi bi-cast"></i></div>
      <div class="floating-icon icon-bluetooth"><i class="bi bi-bluetooth"></i></div>
    </div>
    
    <div class="page-header">
      <!-- Icônes animées du header -->
      <div class="header-icons">
        <div class="header-icon h-icon-1"><i class="bi bi-emoji-smile" style="color: rgba(46, 204, 113, 0.8);"></i></div>
        <div class="header-icon h-icon-2"><i class="bi bi-chat-heart" style="color: rgba(243, 156, 18, 0.8);"></i></div>
        <div class="header-icon h-icon-3"><i class="bi bi-gift" style="color: rgba(231, 76, 60, 0.8);"></i></div>
        <div class="header-icon h-icon-4"><i class="bi bi-balloon-heart" style="color: rgba(155, 89, 182, 0.8);"></i></div>
        <div class="header-icon h-icon-5"><i class="bi bi-cake2" style="color: rgba(52, 152, 219, 0.8);"></i></div>
        <div class="header-icon h-icon-6"><i class="bi bi-stars" style="color: rgba(241, 196, 15, 0.8);"></i></div>
        <div class="header-icon h-icon-7"><i class="bi bi-heart" style="color: rgba(231, 76, 60, 0.8);"></i></div>
        <div class="header-icon h-icon-8"><i class="bi bi-lightning" style="color: rgba(241, 196, 15, 0.8);"></i></div>
      </div>
      
      <div class="container">
        <h1 class="section-title">Mur de Messages</h1>
        <p class="section-subtitle">Partagez vos vœux et messages pour célébrer l'anniversaire d'Emmanuel !</p>
      </div>
    </div>
    
    <div class="container">
      <div class="message-content">
        <div class="form-column">
          <div class="sticky-form">
            <MessageForm />
          </div>
        </div>
        
        <div class="messages-column">
          <MessageList />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Messages wall page
definePageMeta({
  title: "Mur de messages | Anniversaire d'Emmanuel",
  description: "Laissez un message pour souhaiter un joyeux anniversaire à Emmanuel YAKAM TCHAMEGNI !"
});
</script>

<style scoped>
.messages-page {
  position: relative;
  padding-bottom: 5rem;
  min-height: 100vh;
  background: #f9f9f9;
}

.page-header {
  padding: 8rem 0 3rem;
  text-align: center;
  background: #111;
  position: relative;
  overflow: hidden;
  box-shadow: inset 0 -10px 20px rgba(0, 0, 0, 0.2);
  margin-bottom: 3rem;
}

.page-header::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 100%;
  background: radial-gradient(circle at 30% 30%, rgba(46, 204, 113, 0.4), transparent 70%),
              radial-gradient(circle at 70% 60%, rgba(243, 156, 18, 0.4), transparent 70%),
              radial-gradient(circle at 20% 80%, rgba(82, 234, 148, 0.3), transparent 60%),
              radial-gradient(circle at 80% 20%, rgba(214, 137, 16, 0.3), transparent 60%);
  opacity: 0.6;
  pointer-events: none;
}

/* Icônes animées du header */
.header-icons {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
  overflow: hidden;
}

.header-icon {
  position: absolute;
  font-size: 2.8rem;
  opacity: 0.4;
  animation: headerIconFloat 6s ease-in-out infinite;
  filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.2));
}

.h-icon-1 {
  top: 15%;
  left: 8%;
  animation-delay: 0s;
}

.h-icon-2 {
  top: 60%;
  left: 15%;
  animation-delay: 1s;
}

.h-icon-3 {
  top: 25%;
  right: 10%;
  animation-delay: 2s;
}

.h-icon-4 {
  top: 70%;
  right: 15%;
  animation-delay: 1.5s;
}

.h-icon-5 {
  top: 40%;
  left: 25%;
  animation-delay: 0.5s;
}

.h-icon-6 {
  top: 30%;
  right: 25%;
  animation-delay: 2.5s;
}

.h-icon-7 {
  top: 75%;
  left: 40%;
  animation-delay: 1.8s;
}

.h-icon-8 {
  top: 20%;
  right: 40%;
  animation-delay: 2.2s;
}

@keyframes headerIconFloat {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
  }
  50% {
    transform: translateY(-15px) rotate(5deg);
  }
}

/* Effet de lumière pour header */
.page-header::after {
  content: '';
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

.section-title {
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: 800;
  margin-bottom: 1rem;
  color: #333;
  background: linear-gradient(45deg, var(--primary-green), var(--primary-orange));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  position: relative;
  display: inline-block;
  z-index: 10;
}

.section-title::after {
  content: '';
  position: absolute;
  bottom: -0.5rem;
  left: 25%;
  width: 50%;
  height: 3px;
  background: linear-gradient(to right, var(--primary-green), var(--primary-orange));
  border-radius: 3px;
}

.section-subtitle {
  font-size: clamp(1rem, 2vw, 1.2rem);
  max-width: 700px;
  margin: 1rem auto 0;
  color: rgba(255, 255, 255, 0.85);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
  position: relative;
  z-index: 10;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
  width: 100%;
  box-sizing: border-box;
}

.message-content {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 2rem;
  margin-top: -2rem;
  position: relative;
  z-index: 2;
  margin-bottom: 2rem;
}

.form-column {
  position: relative;
}

.sticky-form {
  position: sticky;
  top: 100px;
  background: white;
  border-radius: 15px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.sticky-form:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
}

.messages-column {
  padding: 1rem 0;
}

/* Responsive design */
@media (max-width: 991px) {
  .message-content {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  
  .sticky-form {
    position: relative;
    top: 0;
    margin-bottom: 2rem;
  }
  
  .page-header {
    padding: 7rem 0 2rem;
  }
}

@media (max-width: 768px) {
  .container {
    padding: 0 1rem;
  }
  
  .page-header {
    padding: 6rem 0 2rem;
  }
}

@media (max-width: 480px) {
  .page-header {
    padding: 5rem 0 1.5rem;
  }
  
  .container {
    padding: 0 0.8rem;
  }
}

/* Icônes flottantes */
.floating-icons {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
  overflow: hidden;
}

.floating-icon {
  position: absolute;
  color: rgba(46, 104, 113, 0.2);
  opacity: 0.6;
  z-index: -1;
  animation-duration: 20s;
  animation-timing-function: ease-in-out;
  animation-iteration-count: infinite;
  animation-name: floating;
}

.floating-icon i {
  display: block;
}

.icon-code {
  top: 15%;
  left: 7%;
  font-size: 3.2rem;
  animation-delay: 0s;
  color: rgba(34, 82, 43, 0.25);
}

.icon-cpu {
  top: 35%;
  left: 15%;
  font-size: 2.8rem;
  animation-delay: 3s;
  animation-duration: 25s;
  transform: rotate(20deg);
  color: rgba(68, 56, 83, 0.25);
}

.icon-server {
  top: 75%;
  left: 5%;
  font-size: 2.7rem;
  animation-delay: 5s;
  animation-duration: 22s;
  color: rgba(126, 84, 10, 0.25);
}

.icon-database {
  top: 25%;
  right: 10%;
  font-size: 3.3rem;
  animation-delay: 8s;
  color: rgba(54, 78, 114, 0.25);
}

.icon-cloud {
  top: 45%;
  right: 15%;
  font-size: 3rem;
  animation-delay: 2s;
  animation-duration: 18s;
  color: rgba(78, 110, 142, 0.25);
}

.icon-laptop {
  top: 65%;
  right: 5%;
  font-size: 3.4rem;
  animation-delay: 10s;
  animation-duration: 23s;
  color: rgba(42, 95, 87, 0.25);
}

.icon-window {
  top: 85%;
  right: 22%;
  font-size: 2.6rem;
  animation-delay: 7s;
  transform: rotate(-15deg);
  color: rgba(95, 69, 42, 0.25);
}

.icon-terminal {
  top: 10%;
  left: 40%;
  font-size: 2.5rem;
  animation-delay: 12s;
  animation-duration: 19s;
  color: rgba(64, 64, 64, 0.3);
}

.icon-router {
  top: 90%;
  left: 35%;
  font-size: 2.9rem;
  animation-delay: 9s;
  animation-duration: 26s;
  color: rgba(80, 80, 80, 0.25);
}

.icon-phone {
  top: 60%;
  right: 40%;
  font-size: 2.7rem;
  animation-delay: 4s;
  animation-duration: 21s;
  color: rgba(82, 58, 34, 0.25);
}

.icon-tablet {
  top: 30%;
  left: 25%;
  font-size: 2.8rem;
  animation-delay: 6s;
  animation-duration: 24s;
  color: rgba(95, 42, 64, 0.25);
}

.icon-hdd {
  top: 70%;
  left: 20%;
  font-size: 2.4rem;
  animation-delay: 11s;
  animation-duration: 27s;
  color: rgba(56, 68, 83, 0.25);
}

.icon-git {
  top: 20%;
  right: 25%;
  font-size: 3rem;
  animation-delay: 1s;
  animation-duration: 28s;
  color: rgba(83, 56, 68, 0.25);
}

.icon-globe {
  top: 50%;
  left: 45%;
  font-size: 2.6rem;
  animation-delay: 13s;
  animation-duration: 23s;
  color: rgba(56, 83, 68, 0.25);
}

.icon-wifi {
  top: 80%;
  right: 30%;
  font-size: 2.5rem;
  animation-delay: 15s;
  animation-duration: 22s;
  color: rgba(68, 83, 56, 0.25);
}

.icon-plugin {
  top: 40%;
  left: 30%;
  font-size: 2.7rem;
  animation-delay: 14s;
  animation-duration: 26s;
  color: rgba(72, 45, 84, 0.25);
}

.icon-shield {
  top: 55%;
  right: 35%;
  font-size: 2.9rem;
  animation-delay: 16s;
  animation-duration: 25s;
  color: rgba(45, 84, 72, 0.25);
}

.icon-diagram {
  top: 5%;
  left: 55%;
  font-size: 2.8rem;
  animation-delay: 17s;
  animation-duration: 24s;
  color: rgba(73, 48, 85, 0.25);
}

.icon-graph {
  top: 75%;
  right: 50%;
  font-size: 2.6rem;
  animation-delay: 19s;
  animation-duration: 27s;
  color: rgba(85, 73, 48, 0.25);
}

.icon-layers {
  top: 12%;
  right: 15%;
  font-size: 3.1rem;
  animation-delay: 18s;
  animation-duration: 29s;
  color: rgba(48, 85, 73, 0.25);
}

.icon-card {
  top: 37%;
  left: 62%;
  font-size: 2.5rem;
  animation-delay: 5s;
  animation-duration: 22s;
  color: rgba(78, 98, 125, 0.3);
}

.icon-camera {
  top: 82%;
  right: 18%;
  font-size: 2.7rem;
  animation-delay: 8s;
  animation-duration: 24s;
  color: rgba(125, 95, 75, 0.3);
}

.icon-pen {
  top: 18%;
  left: 65%;
  font-size: 2.3rem;
  animation-delay: 12s;
  animation-duration: 19s;
  color: rgba(85, 125, 95, 0.3);
}

.icon-display {
  top: 92%;
  left: 15%;
  font-size: 3rem;
  animation-delay: 15s;
  animation-duration: 23s;
  color: rgba(95, 85, 125, 0.3);
}

.icon-brackets {
  top: 8%;
  right: 60%;
  font-size: 2.9rem;
  animation-delay: 7s;
  animation-duration: 25s;
  color: rgba(125, 85, 95, 0.3);
}

.icon-award {
  top: 65%;
  right: 70%;
  font-size: 2.2rem;
  animation-delay: 11s;
  animation-duration: 24s;
  color: rgba(75, 95, 105, 0.3);
}

.icon-lightbulb {
  top: 28%;
  right: 75%;
  font-size: 2.4rem;
  animation-delay: 14s;
  animation-duration: 21s;
  color: rgba(125, 115, 75, 0.3);
}

.icon-ethernet {
  top: 48%;
  right: 88%;
  font-size: 2.8rem;
  animation-delay: 9s;
  animation-duration: 27s;
  color: rgba(75, 125, 115, 0.3);
}

.icon-cast {
  top: 78%;
  left: 88%;
  font-size: 2.6rem;
  animation-delay: 13s;
  animation-duration: 26s;
  color: rgba(115, 75, 125, 0.3);
}

.icon-bluetooth {
  top: 24%;
  left: 80%;
  font-size: 2.2rem;
  animation-delay: 16s;
  animation-duration: 22s;
  color: rgba(75, 115, 125, 0.3);
}

@keyframes floating {
  0% {
    transform: translate(0, 0) rotate(0deg);
  }
  25% {
    transform: translate(10px, 15px) rotate(5deg);
  }
  50% {
    transform: translate(5px, -10px) rotate(-5deg);
  }
  75% {
    transform: translate(-10px, 5px) rotate(3deg);
  }
  100% {
    transform: translate(0, 0) rotate(0deg);
  }
}

/* Rendre les icônes responsives */
@media (max-width: 991px) {
  .floating-icon {
    font-size: 80%;
  }
}

@media (max-width: 768px) {
  .floating-icon {
    font-size: 70%;
  }
}
</style>