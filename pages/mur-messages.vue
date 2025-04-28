<template>
  <div class="messages-page">
    <div class="page-header">
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
  background: linear-gradient(135deg, rgba(46, 204, 113, 0.1), rgba(243, 156, 18, 0.1));
  position: relative;
  overflow: hidden;
}

.page-header::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 100%;
  background: linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.2) 100%);
  pointer-events: none;
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
}

.section-subtitle {
  font-size: clamp(1rem, 2vw, 1.2rem);
  max-width: 700px;
  margin: 0 auto;
  color: #666;
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
</style>