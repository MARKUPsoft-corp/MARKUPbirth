import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import emailjs from '@emailjs/browser';

interface Message {
  id: number;
  username: string;
  message: string;
  photoPath?: string;
  createdAt: string;
  likes: number;
}

export const useMessageStore = defineStore('messages', () => {
  // Données locales
  const messages = ref<Message[]>([
    { 
      id: 1, 
      username: "Marie", 
      message: "Joyeux anniversaire Emmanuel!", 
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      likes: 5 
    },
    { 
      id: 2, 
      username: "Jean", 
      message: "Merci pour cette belle journée !", 
      createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
      likes: 3 
    },
    { 
      id: 3, 
      username: "Sophie", 
      message: "Les photos sont superbes!", 
      createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      likes: 7 
    },
    { 
      id: 4, 
      username: "Luc", 
      message: "C'était une soirée incroyable!", 
      createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
      likes: 4 
    }
  ]);
  
  const isLoading = ref(false);
  const error = ref<string | null>(null);
  const sortBy = ref<'recent' | 'popular'>('recent');
  
  // Getter pour les messages triés
  const sortedMessages = computed(() => {
    if (sortBy.value === 'recent') {
      return [...messages.value].sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    } else {
      return [...messages.value].sort((a, b) => b.likes - a.likes);
    }
  });
  
  // Simuler le chargement des messages
  const fetchMessages = async () => {
    isLoading.value = true;
    error.value = null;
    
    try {
      // Simuler un délai réseau
      await new Promise(resolve => setTimeout(resolve, 500));
      // Les messages sont déjà chargés en mémoire
      console.log(`Messages chargés: ${messages.value.length} triés par ${sortBy.value}`);
    } catch (err: any) {
      error.value = err.message || 'Failed to load messages';
      console.error('Error fetching messages:', err);
    } finally {
      isLoading.value = false;
    }
  };
  
  // Configuration EmailJS - À personnaliser
  const EMAILJS_SERVICE_ID = 'default_service';
  const EMAILJS_TEMPLATE_ID = 'template_message';
  const EMAILJS_PUBLIC_KEY = 'YOUR_PUBLIC_KEY'; // Remplacer par la vraie clé publique après test
  const RECIPIENT_EMAIL = 'emmanuelyakam1@gmail.com';

  // Ajouter un nouveau message et envoyer un email
  const addMessage = async (newMessage: { username: string; message: string; photoPath?: string }) => {
    isLoading.value = true;
    error.value = null;
    
    try {
      // Simuler un délai réseau
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Créer le nouveau message
      const message: Message = {
        id: Date.now(),
        username: newMessage.username,
        message: newMessage.message,
        photoPath: newMessage.photoPath,
        createdAt: new Date().toISOString(),
        likes: 0
      };
      
      // Ajouter au début du tableau pour l'affichage par date récente
      messages.value.unshift(message);
      
      // Préparer les données pour EmailJS
      const emailParams = {
        to_email: RECIPIENT_EMAIL,
        from_name: message.username,
        message: message.message,
        photo_url: message.photoPath || 'Pas de photo',
        date: new Date().toLocaleString(),
        reply_to: RECIPIENT_EMAIL
      };
      
      // Envoyer l'email avec EmailJS
      try {
        const emailResult = await emailjs.send(
          EMAILJS_SERVICE_ID,
          EMAILJS_TEMPLATE_ID,
          emailParams,
          EMAILJS_PUBLIC_KEY
        );
        console.log('Email envoyé avec succès:', emailResult.text);
      } catch (emailError) {
        console.error('Erreur d\'envoi d\'email:', emailError);
        // Ne pas échouer l'ensemble de l'opération si l'email échoue
        // L'utilisateur a quand même soumis son message avec succès
      }
      
      console.log(`Nouveau message ajouté par ${newMessage.username}`);
      return true;
    } catch (err: any) {
      error.value = err.message || 'Failed to add message';
      console.error('Error adding message:', err);
      return false;
    } finally {
      isLoading.value = false;
    }
  };
  
  // Liker un message
  const likeMessage = async (messageId: number) => {
    try {
      // Trouver et mettre à jour le message
      const message = messages.value.find(m => m.id === messageId);
      if (message) {
        message.likes++;
        
        // Re-trier si nécessaire
        if (sortBy.value === 'popular') {
          messages.value.sort((a, b) => b.likes - a.likes);
        }
      }
      
      return true;
    } catch (err: any) {
      console.error('Error liking message:', err);
      return false;
    }
  };
  
  // Supprimer un message
  const deleteMessage = async (messageId: number) => {
    try {
      // Supprimer du tableau
      messages.value = messages.value.filter(m => m.id !== messageId);
      return true;
    } catch (err: any) {
      console.error('Error deleting message:', err);
      return false;
    }
  };
  
  // Changer l'ordre de tri
  const setSortBy = (sort: 'recent' | 'popular') => {
    sortBy.value = sort;
  };
  
  // Initialisation
  const initialize = () => {
    console.log('Initialisation du store de messages...');
    fetchMessages();
  };
  
  // Appel automatique à l'initialisation
  initialize();
  
  return {
    messages: sortedMessages, // Retourner les messages triés
    isLoading,
    error,
    sortBy,
    
    fetchMessages,
    addMessage,
    likeMessage,
    deleteMessage,
    setSortBy
  };
});
