<template>
  <div class="message-form">
    <div class="form-header">
      <h3>Laissez moi un message</h3>
      <div class="form-icon">
        <i class="bi bi-envelope-heart"></i>
      </div>
    </div>
    
    <div v-if="submitSuccess" class="success-message">
      <div class="success-icon">
        <i class="bi bi-check-circle"></i>
      </div>
      <h3>Message envoyé !</h3>
      <p>Votre message a été envoyé directement à Emmanuel. Merci pour votre participation !</p>
      <button @click="resetForm" class="reset-button">
        <i class="bi bi-plus-circle"></i> Envoyer un autre message
      </button>
    </div>
    
    <form v-else ref="emailForm" action="https://formsubmit.co/emmanuelyakam1@gmail.com" method="POST" enctype="multipart/form-data" @submit="handleSubmit">
      <!-- Champs FormSubmit -->
      <input type="hidden" name="_subject" value="Nouveau message d'anniversaire !" />
      <input type="hidden" name="_captcha" value="false" />
      <input type="hidden" name="_template" value="table" />
      <div class="form-group">
        <label for="username" class="form-label">Votre nom</label>
        <div class="input-wrapper">
          <i class="bi bi-person"></i>
          <input
            type="text"
            class="form-input"
            id="username"
            name="name"
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
            name="message"
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
              name="attachment"
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
import { useMessageStore } from '~/stores/messages';

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
const submitSuccess = ref(false);
const emailForm = ref(null);

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

// Gérer la soumission du formulaire FormSubmit
const handleSubmit = (e) => {
  // Utiliser le bouton natif pour montrer le spinner pendant la soumission
  isSubmitting.value = true;
  error.value = null;
  
  // La soumission est gérée automatiquement par FormSubmit
  // FormSubmit envoie le formulaire à l'URL spécifiée dans l'attribut action
  // et redirige ensuite vers une page de confirmation
  
  // Pour éviter la redirection, on peut intercepter le formulaire
  // et utiliser fetch pour soumettre les données en arrière-plan
  e.preventDefault();
  
  const formData = new FormData(emailForm.value);
  
  fetch('https://formsubmit.co/emmanuelyakam1@gmail.com', {
    method: 'POST',
    body: formData,
  })
  .then(response => {
    if (response.ok) {
      // Afficher un message de succès
      submitSuccess.value = true;
      // Mémoriser localement à travers le store pour l'historique
      const messageData = {
        username: form.username,
        message: form.message,
        photoPath: photoFile.value ? URL.createObjectURL(photoFile.value) : null
      };
      // Stocker en arrière-plan sans attendre
      messageStore.addMessage(messageData);
    } else {
      throw new Error('Erreur lors de l\'envoi du formulaire');
    }
  })
  .catch(err => {
    console.error('Erreur lors de l\'envoi:', err);
    error.value = 'Une erreur est survenue lors de l\'envoi. Veuillez réessayer.';
  })
  .finally(() => {
    isSubmitting.value = false;
  });
};

// Réinitialiser le formulaire après un envoi réussi
const resetForm = () => {
  submitSuccess.value = false;
  form.username = '';
  form.message = '';
  removePreview();
  error.value = null;
};
</script>

<style scoped>
.message-form {
  background: white;
  border-radius: 20px;
  overflow: hidden;
  position: relative;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  transform: translateY(0);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.message-form:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.15);
}

.message-form::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 5px;
  background: linear-gradient(90deg, var(--primary-green), var(--primary-orange));
  z-index: 1;
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
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: #6c757d;
  font-size: 18px;
  transition: all 0.3s ease;
}

.form-input {
  width: 100%;
  padding: 14px 14px 14px 45px;
  border: 2px solid #e9ecef;
  border-radius: 12px;
  font-size: 16px;
  transition: all 0.3s ease;
  background-color: #f8f9fa;
  color: #343a40;
  box-shadow: inset 0 1px 2px rgba(0,0,0,0.05);
}

.form-input:focus {
  outline: none;
  border-color: var(--primary-green);
  box-shadow: 0 0 0 4px rgba(46, 204, 113, 0.15);
  background: white;
  transform: translateY(-1px);
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
  gap: 0.8rem;
  padding: 1rem 1.2rem;
  background: #f8f9fa;
  border: 2px dashed #e9ecef;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.file-upload-label:hover {
  background: #f1f3f5;
  border-color: var(--primary-green);
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0,0,0,0.05);
}

.file-upload-label i {
  font-size: 20px;
  color: var(--primary-green);
  transition: all 0.3s ease;
}

.file-upload-label:hover i {
  transform: scale(1.1);
}

.file-upload-label::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 2px;
  background: linear-gradient(90deg, var(--primary-green), var(--primary-orange));
  transition: width 0.3s ease;
}

.file-upload-label:hover::after {
  width: 100%;
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
  background: #ff4d4d;
  color: white;
  transform: scale(1.1);
}

.error-message {
  display: flex;
  align-items: center;
  background-color: rgba(220, 53, 69, 0.1);
  color: #dc3545;
  padding: 10px 15px;
  border-radius: 8px;
  margin-bottom: 20px;
  font-size: 14px;
}

.error-message i {
  margin-right: 10px;
  font-size: 18px;
}

.form-actions {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

.submit-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  padding: 0.9rem 2rem;
  background: linear-gradient(45deg, var(--primary-green), var(--primary-orange));
  color: white;
  border: none;
  border-radius: 50px;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  z-index: 1;
  letter-spacing: 0.5px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.submit-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(45deg, var(--primary-orange), var(--primary-green));
  opacity: 0;
  z-index: -1;
  transition: opacity 0.3s ease;
}

.submit-button:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(46, 204, 113, 0.25);
}

.submit-button:hover::before {
  opacity: 1;
}

.submit-button:active {
  transform: translateY(-1px);
  box-shadow: 0 4px 15px rgba(46, 204, 113, 0.15);
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

/* Styles pour l'écran de succès */
.success-message {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 40px 20px;
  background-color: rgba(40, 167, 69, 0.05);
  border-radius: 15px;
  animation: fadeIn 0.5s ease;
}

.success-icon {
  font-size: 60px;
  color: #28a745;
  margin-bottom: 20px;
}

.success-message h3 {
  font-size: 24px;
  margin-bottom: 15px;
  color: #28a745;
}

.success-message p {
  margin-bottom: 30px;
  color: #666;
  line-height: 1.5;
}

.reset-button {
  background: #28a745;
  color: white;
  border: none;
  padding: 12px 25px;
  border-radius: 30px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
}

.reset-button:hover {
  background: #218838;
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(40, 167, 69, 0.3);
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
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