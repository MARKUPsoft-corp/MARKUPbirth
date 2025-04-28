<template>
  <div class="message-form">
    <div class="form-header">
      <h3>Laissez moi un message</h3>
      <div class="form-icon">
        <i class="bi bi-envelope-heart"></i>
      </div>
    </div>
    
    <form @submit.prevent="submitMessage">
      <div class="form-group">
        <label for="username" class="form-label">Votre nom</label>
        <div class="input-wrapper">
          <i class="bi bi-person"></i>
          <input
            type="text"
            class="form-input"
            id="username"
            v-model="form.username"
            placeholder="Entrez votre nom"
            required
          />
        </div>
      </div>
      
      <div class="form-group">
        <label for="message" class="form-label">Votre message</label>
        <div class="input-wrapper">
          <i class="bi bi-chat-text"></i>
          <textarea
            class="form-input"
            id="message"
            v-model="form.message"
            rows="4"
            placeholder="Écrivez votre message d'anniversaire ici..."
            required
          ></textarea>
        </div>
      </div>
      
      <div class="form-group">
        <label for="photo" class="form-label">Ajouter une photo (optionnel)</label>
        <div class="file-upload">
          <label class="file-upload-label">
            <i class="bi bi-image"></i>
            <span>{{ photoFile ? photoFile.name : 'Choisir une image' }}</span>
            <input
              type="file"
              class="file-upload-input"
              id="photo"
              ref="photoInput"
              @change="handleFileChange"
              accept="image/*"
            />
          </label>
        </div>
        <div class="form-info">
          Maximum 5MB. Formats acceptés: JPG, PNG, GIF
        </div>
      </div>
      
      <div v-if="preview" class="preview-container">
        <div class="preview-wrapper">
          <img :src="preview" alt="Aperçu" class="preview-image" />
          <button
            type="button"
            class="preview-remove-btn"
            @click="removePreview"
            aria-label="Supprimer l'aperçu"
          >
            <i class="bi bi-x-circle-fill"></i>
          </button>
        </div>
      </div>
      
      <div v-if="error" class="error-message">
        <i class="bi bi-exclamation-triangle"></i>
        {{ error }}
      </div>
      
      <div class="form-actions">
        <button type="submit" class="submit-button" :disabled="isSubmitting">
          <span v-if="isSubmitting" class="spinner"><i class="bi bi-arrow-repeat"></i></span>
          <span v-else><i class="bi bi-send"></i></span>
          Envoyer
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useApi } from '~/composables/useApi';
import { useMessageStore } from '~/stores/messages';

const api = useApi();
const messageStore = useMessageStore();

const form = reactive({
  username: '',
  message: '',
});

const photoInput = ref(null);
const preview = ref(null);
const photoFile = ref(null);
const error = ref(null);
const isSubmitting = ref(false);

// Handle file selection
const handleFileChange = (event) => {
  const file = event.target.files[0];
  
  if (!file) {
    removePreview();
    return;
  }
  
  // Validate file type
  if (!file.type.startsWith('image/')) {
    error.value = 'Seules les images sont acceptées';
    removePreview();
    return;
  }
  
  // Validate file size (5MB max)
  if (file.size > 5 * 1024 * 1024) {
    error.value = 'La taille du fichier ne doit pas dépasser 5MB';
    removePreview();
    return;
  }
  
  // Create preview
  const reader = new FileReader();
  reader.onload = (e) => {
    preview.value = e.target.result;
  };
  reader.readAsDataURL(file);
  
  photoFile.value = file;
  error.value = null;
};

// Remove preview and reset file input
const removePreview = () => {
  preview.value = null;
  photoFile.value = null;
  if (photoInput.value) {
    photoInput.value.value = '';
  }
};

// Submit the message
const submitMessage = async () => {
  try {
    isSubmitting.value = true;
    error.value = null;

    let photoPath = null;
    
    // If there's a photo, upload it first
    if (photoFile.value) {
      const formData = new FormData();
      formData.append('file', photoFile.value);
      
      const uploadResponse = await api.uploadFormData('/api/upload/photos', formData);
      photoPath = uploadResponse.filePath;
    }
    
    // Submit the message with the photo path
    const messageData = {
      username: form.username,
      message: form.message,
      photoPath
    };
    
    // Envoyer via le store qui utilise les websockets
    const success = await messageStore.addMessage(messageData);
    
    if (success) {
      // Reset form
      form.username = '';
      form.message = '';
      removePreview();
      
      // Show success message
      alert('Message envoyé avec succès !');
    } else {
      throw new Error('Échec de l\'envoi du message');
    }
  } catch (err) {
    console.error('Error submitting message:', err);
    error.value = 'Une erreur est survenue lors de l\'envoi du message';
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<style scoped>
.message-form {
  background: white;
  border-radius: 15px;
  overflow: hidden;
  position: relative;
}

.form-header {
  padding: 1.5rem;
  background: linear-gradient(135deg, rgba(46, 204, 113, 0.1), rgba(243, 156, 18, 0.1));
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.form-header h3 {
  margin: 0;
  font-size: 1.3rem;
  font-weight: 600;
  color: #333;
}

.form-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(45deg, var(--primary-green), var(--primary-orange));
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.2rem;
}

form {
  padding: 1.5rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #333;
  font-size: 0.95rem;
}

.input-wrapper {
  position: relative;
}

.input-wrapper i {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #999;
  transition: color 0.3s ease;
}

.form-input {
  width: 100%;
  padding: 0.8rem 1rem 0.8rem 2.5rem;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: #f8f9fa;
  color: #333;
}

.form-input:focus {
  outline: none;
  border-color: var(--primary-green);
  box-shadow: 0 0 0 3px rgba(46, 204, 113, 0.1);
  background: white;
}

.form-input:focus + i {
  color: var(--primary-green);
}

textarea.form-input {
  resize: vertical;
  min-height: 100px;
}

.file-upload {
  position: relative;
  overflow: hidden;
}

.file-upload-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.8rem 1rem;
  background: #f8f9fa;
  border: 1px dashed rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.file-upload-label:hover {
  background: #f1f3f5;
  border-color: var(--primary-green);
}

.file-upload-input {
  position: absolute;
  left: 0;
  top: 0;
  opacity: 0;
  width: 100%;
  height: 100%;
  cursor: pointer;
}

.form-info {
  font-size: 0.8rem;
  color: #6c757d;
  margin-top: 0.5rem;
}

.preview-container {
  margin-bottom: 1.5rem;
}

.preview-wrapper {
  position: relative;
  max-width: 200px;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.preview-image {
  width: 100%;
  height: auto;
  display: block;
}

.preview-remove-btn {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  width: 24px;
  height: 24px;
  border: none;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 50%;
  color: #dc3545;
  font-size: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  cursor: pointer;
  transition: all 0.2s ease;
}

.preview-remove-btn:hover {
  background: white;
  transform: scale(1.1);
}

.error-message {
  background: rgba(220, 53, 69, 0.1);
  color: #dc3545;
  padding: 0.8rem 1rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
}

.submit-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.8rem 1.5rem;
  background: linear-gradient(45deg, var(--primary-green), var(--primary-orange));
  color: white;
  border: none;
  border-radius: 50px;
  font-weight: 500;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.submit-button:hover {
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(46, 204, 113, 0.2);
}

.submit-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
}

.spinner {
  display: inline-block;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@media (max-width: 767px) {
  .form-header {
    padding: 1.2rem;
  }
  
  form {
    padding: 1.2rem;
  }
}
</style> 