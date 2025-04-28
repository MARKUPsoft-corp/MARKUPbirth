<template>
  <div class="message-list">
    <!-- Contrôles de tri -->
    <div class="list-header">
      <h3>Messages d'anniversaire</h3>
      <div class="sort-controls">
        <button 
          @click="setSortBy('recent')" 
          :class="['sort-btn', sortBy === 'recent' ? 'active' : '']"
        >
          <i class="bi bi-clock"></i> Récents
        </button>
        <button 
          @click="setSortBy('popular')" 
          :class="['sort-btn', sortBy === 'popular' ? 'active' : '']"
        >
          <i class="bi bi-heart"></i> Populaires
        </button>
      </div>
    </div>
    
    <!-- État de chargement -->
    <div v-if="isLoading" class="state-container loading-state">
      <div class="loading-spinner">
        <i class="bi bi-arrow-repeat"></i>
      </div>
      <p>Chargement des messages...</p>
    </div>
    
    <!-- État d'erreur -->
    <div v-else-if="error" class="state-container error-state">
      <i class="bi bi-exclamation-circle"></i>
      <p>{{ error }}</p>
      <button @click="fetchMessages" class="retry-btn">
        <i class="bi bi-arrow-repeat"></i> Réessayer
      </button>
    </div>
    
    <!-- État vide -->
    <div v-else-if="messages.length === 0" class="state-container empty-state">
      <i class="bi bi-chat-square-heart"></i>
      <p>Aucun message pour le moment.<br>Soyez le premier à écrire à Emmanuel !</p>
    </div>
    
    <!-- Grille de messages -->
    <div v-else class="messages-grid">
      <div 
        v-for="message in messages" 
        :key="message.id" 
        class="message-card"
      >
        <div class="message-header">
          <div class="header-gradient"></div>
          <div class="user-info">
            <div class="user-avatar">{{ message.username.charAt(0).toUpperCase() }}</div>
            <div class="user-name-date">
              <h4>{{ message.username }}</h4>
              <div class="time-info">
                <span class="message-date">{{ formatDate(message.createdAt) }}</span>
                <span class="message-time">· {{ formatTimeAgo(message.createdAt) }}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div class="message-content">
          <div class="message-body">
            <p>{{ message.message }}</p>
          </div>
          
          <div v-if="message.photoPath" class="message-image-container">
            <a :href="`${apiBaseUrl}${message.photoPath}`" target="_blank" class="photo-button">
              <i class="bi bi-image"></i>
              <span>Voir la photo de {{ message.username }}</span>
            </a>
          </div>
          
          <div class="message-footer">
            <button 
              @click="likeMessage(message.id)" 
              class="like-button"
              :class="{ 'liked': userLikedMessages.includes(message.id) }"
              :disabled="userLikedMessages.includes(message.id)"
            >
              <i class="bi bi-heart-fill"></i>
              <span>{{ message.likes || 0 }} J'aime</span>
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Lightbox pour les images -->
    <div class="lightbox" :class="{ 'active': lightboxActive }" @click="closeLightbox">
      <div class="lightbox-content" @click.stop>
        <img v-if="selectedMessage && selectedMessage.photoPath" 
          :src="`${apiBaseUrl}${selectedMessage.photoPath}`" 
          alt="Image en plein écran"
          class="lightbox-image"
        />
        <div v-if="selectedMessage" class="lightbox-caption">
          <h4>{{ selectedMessage.username }}</h4>
          <p>{{ selectedMessage.message }}</p>
        </div>
      </div>
      <button class="lightbox-close" @click="closeLightbox" aria-label="Fermer">
        <i class="bi bi-x-lg"></i>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useMessageStore } from '~/stores/messages';
import { useRuntimeConfig } from 'nuxt/app';

const config = useRuntimeConfig();
const apiBaseUrl = String(config.public.apiBaseUrl);
const messageStore = useMessageStore();

// Get state from the store
const messages = computed(() => messageStore.messages);
const isLoading = computed(() => messageStore.isLoading);
const error = computed(() => messageStore.error);
const sortBy = computed(() => messageStore.sortBy);

// Local state
const userLikedMessages = ref([]);
const lightboxActive = ref(false);
const selectedMessage = ref(null);

// Set up on mount
onMounted(() => {
  fetchMessages();
  
  // Load liked messages from localStorage
  const storedLikes = localStorage.getItem('userLikedMessages');
  if (storedLikes) {
    userLikedMessages.value = JSON.parse(storedLikes);
  }
  
  // Set up socket listeners
  messageStore.setupSocketListeners();
});

// Fetch messages
const fetchMessages = () => {
  messageStore.fetchMessages();
};

// Change sort order
const setSortBy = (sort) => {
  messageStore.setSortBy(sort);
};

// Like a message
const likeMessage = async (messageId) => {
  // Prevent double-liking
  if (userLikedMessages.value.includes(messageId)) return;
  
  const success = await messageStore.likeMessage(messageId);
  
  if (success) {
    userLikedMessages.value.push(messageId);
    
    // Save to localStorage
    localStorage.setItem('userLikedMessages', JSON.stringify(userLikedMessages.value));
  }
};

// Format date
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('fr-FR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
};

// Format relative time
const formatTimeAgo = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diff = Math.floor((now - date) / 1000); // seconds
  
  if (diff < 60) return 'À l\'instant';
  if (diff < 3600) return `${Math.floor(diff / 60)} min`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} h`;
  if (diff < 2592000) return `${Math.floor(diff / 86400)} j`;
  
  return formatDate(dateString);
};

// Open lightbox for a message with image
const openLightbox = (message) => {
  selectedMessage.value = message;
  lightboxActive.value = true;
  
  // Disable body scroll
  document.body.style.overflow = 'hidden';
};

// Close lightbox
const closeLightbox = () => {
  lightboxActive.value = false;
  
  // Enable body scroll
  document.body.style.overflow = '';
  
  // Clear selected message after transition
  setTimeout(() => {
    selectedMessage.value = null;
  }, 300);
};
</script>

<style scoped>
.message-list {
  position: relative;
}

.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.list-header h3 {
  margin: 0;
  font-size: 1.3rem;
  font-weight: 600;
  color: #333;
  background: linear-gradient(45deg, var(--primary-green), var(--primary-orange));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  position: relative;
  display: inline-block;
  padding-bottom: 0.5rem;
}

.list-header h3::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 3px;
  background: linear-gradient(to right, var(--primary-green), var(--primary-orange));
  border-radius: 3px;
}

.sort-controls {
  display: flex;
  gap: 0.5rem;
}

.sort-btn {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.6rem 1rem;
  background: white;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 25px;
  font-size: 0.9rem;
  font-weight: 500;
  color: #666;
  cursor: pointer;
  transition: all 0.3s ease;
}

.sort-btn:hover {
  background: #f8f9fa;
  transform: translateY(-2px);
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.05);
}

.sort-btn.active {
  background: linear-gradient(45deg, var(--primary-green), var(--primary-orange));
  color: white;
  border-color: transparent;
}

.state-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: white;
  border-radius: 15px;
  padding: 3rem 1rem;
  margin: 2rem 0;
  text-align: center;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.05);
}

.loading-state i {
  font-size: 2.5rem;
  color: var(--primary-green);
  margin-bottom: 1rem;
  animation: spin 1.5s linear infinite;
}

.loading-spinner {
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: linear-gradient(45deg, var(--primary-green), var(--primary-orange));
  box-shadow: 0 5px 15px rgba(46, 204, 113, 0.2);
  margin-bottom: 1rem;
}

.loading-spinner i {
  font-size: 1.8rem;
  color: white;
  animation: spin 1.5s linear infinite;
}

.error-state i {
  font-size: 2.5rem;
  color: #dc3545;
  margin-bottom: 1rem;
}

.empty-state i {
  font-size: 3rem;
  color: #adb5bd;
  margin-bottom: 1rem;
}

.state-container p {
  color: #666;
  font-size: 1.1rem;
  margin-bottom: 1.5rem;
  line-height: 1.5;
}

.retry-btn {
  padding: 0.6rem 1.2rem;
  background: #dc3545;
  color: white;
  border: none;
  border-radius: 25px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.retry-btn:hover {
  background: #c82333;
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(220, 53, 69, 0.2);
}

.messages-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  max-width: 1600px;
  margin: 0 auto;
}

@media (min-width: 768px) {
  .messages-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1200px) {
  .messages-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 2.5rem;
  }
}

@media (min-width: 1500px) {
  .messages-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

.message-card {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
  transition: all 0.4s ease;
  position: relative;
  display: flex;
  flex-direction: column;
  border: none;
  width: 100%;
}

.message-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.12);
}

.message-header {
  position: relative;
  height: 100px;
  display: flex;
  align-items: flex-end;
  padding: 0;
  overflow: hidden;
}

.header-gradient {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, var(--primary-green), var(--primary-orange));
  z-index: 1;
}

.user-info {
  display: flex;
  align-items: center;
  padding: 0 1.5rem 1.5rem;
  position: relative;
  z-index: 2;
  width: 100%;
}

.user-avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: white;
  color: var(--primary-green);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 1.6rem;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  border: 3px solid white;
  margin-right: 1rem;
}

.user-name-date {
  color: white;
}

.time-info {
  display: flex;
  align-items: center;
}

.user-info h4 {
  margin: 0;
  font-size: 1.2rem;
  font-weight: 700;
  color: white;
  margin-bottom: 0.25rem;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.message-date {
  font-size: 0.85rem;
  opacity: 0.9;
}

.message-time {
  font-size: 0.85rem;
  opacity: 0.9;
  margin-left: 3px;
}

.message-content {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}

.message-body {
  position: relative;
}

.message-body p {
  margin: 0;
  color: #2d3748;
  line-height: 1.8;
  font-size: 1.05rem;
  background: #f9fafc;
  padding: 1.2rem;
  border-radius: 12px;
  border-top-left-radius: 0;
  position: relative;
}

.message-body p::before {
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  width: 4px;
  height: 30px;
  background: linear-gradient(to bottom, var(--primary-green), var(--primary-orange));
  border-top-left-radius: 4px;
  border-bottom-left-radius: 4px;
}

.message-image-container {
  width: 100%;
  margin-top: 0.5rem;
}

.photo-button {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  padding: 0.9rem 1.2rem;
  background: #f7fafc;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  color: #4a5568;
  font-size: 1rem;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
}

.photo-button:hover {
  background: #edf2f7;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.photo-button i {
  font-size: 1.3rem;
  color: var(--primary-green);
}

.message-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.like-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.7rem 1.2rem;
  background: white;
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 30px;
  color: #4a5568;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04);
}

.like-button:hover {
  background: #f8fafc;
  border-color: rgba(0, 0, 0, 0.12);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
}

.like-button i {
  font-size: 1.1rem;
  transition: all 0.3s ease;
  color: #cbd5e0;
}

.like-button.liked {
  background: #fdf2f2;
  border-color: #fed7d7;
  color: #e53e3e;
}

.like-button.liked i {
  color: #e53e3e;
  animation: pulse 0.6s ease-in-out;
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.3); }
  100% { transform: scale(1); }
}

.lightbox {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s ease;
  padding: 2rem;
}

.lightbox.active {
  opacity: 1;
  pointer-events: auto;
}

.lightbox-content {
  max-width: 90%;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  border-radius: 10px;
  overflow: hidden;
  background: white;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.lightbox-image {
  max-width: 100%;
  max-height: 60vh;
  object-fit: contain;
}

.lightbox-caption {
  padding: 1.2rem 1.5rem;
  background: white;
}

.lightbox-caption h4 {
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #333;
}

.lightbox-caption p {
  margin: 0;
  color: #666;
  line-height: 1.6;
}

.lightbox-close {
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.lightbox-close:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.1);
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@media (max-width: 767px) {
  .list-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .sort-controls {
    width: 100%;
  }
  
  .sort-btn {
    flex: 1;
    justify-content: center;
  }
  
  .message-header {
    padding: 1rem;
  }
  
  .message-body, .message-footer {
    padding: 1rem;
  }
  
  .state-container {
    padding: 2rem 1rem;
  }
}
</style> 