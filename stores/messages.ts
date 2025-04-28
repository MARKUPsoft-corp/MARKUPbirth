import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useApi } from '~/composables/useApi';
import { useSocket } from '~/composables/useSocket';

interface Message {
  id: number;
  username: string;
  message: string;
  photoPath?: string;
  createdAt: string;
  likes: number;
}

export const useMessageStore = defineStore('messages', () => {
  const api = useApi();
  const { joinRoom, on, emit } = useSocket();
  
  const messages = ref<Message[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);
  const sortBy = ref<'recent' | 'popular'>('recent');
  
  // Fetch messages from API
  const fetchMessages = async () => {
    isLoading.value = true;
    error.value = null;
    
    try {
      const params = { sort: sortBy.value };
      const data = await api.get('/api/messages', params);
      messages.value = data;
    } catch (err: any) {
      error.value = err.message || 'Failed to load messages';
      console.error('Error fetching messages:', err);
    } finally {
      isLoading.value = false;
    }
  };
  
  // Add a new message
  const addMessage = async (newMessage: { username: string; message: string; photoPath?: string }) => {
    isLoading.value = true;
    error.value = null;
    
    try {
      // If using Socket.io
      emit('message', newMessage);
      
      // If using REST API
      // const addedMessage = await api.post('/api/messages', newMessage);
      // messages.value.unshift(addedMessage);
      
      return true;
    } catch (err: any) {
      error.value = err.message || 'Failed to add message';
      console.error('Error adding message:', err);
      return false;
    } finally {
      isLoading.value = false;
    }
  };
  
  // Like a message
  const likeMessage = async (messageId: number) => {
    try {
      // If using Socket.io
      emit('like-message', messageId);
      
      // If using REST API
      // const response = await api.post(`/api/messages/${messageId}/like`, {});
      // const messageIndex = messages.value.findIndex(m => m.id === messageId);
      // if (messageIndex !== -1) {
      //   messages.value[messageIndex].likes = response.likes;
      // }
      
      return true;
    } catch (err: any) {
      console.error('Error liking message:', err);
      return false;
    }
  };
  
  // Delete a message
  const deleteMessage = async (messageId: number) => {
    try {
      await api.del(`/api/messages/${messageId}`);
      messages.value = messages.value.filter(m => m.id !== messageId);
      return true;
    } catch (err: any) {
      console.error('Error deleting message:', err);
      return false;
    }
  };
  
  // Set up socket listeners
  const setupSocketListeners = () => {
    joinRoom('messages');
    
    // Listen for new messages
    on('new-message', (newMessage: Message) => {
      if (sortBy.value === 'recent') {
        messages.value.unshift(newMessage);
      } else {
        // For popular sort, just add it and re-fetch to get correct order
        messages.value.push(newMessage);
        fetchMessages();
      }
    });
    
    // Listen for likes
    on('message-liked', (data: { id: number; likes: number }) => {
      const messageIndex = messages.value.findIndex(m => m.id === data.id);
      if (messageIndex !== -1) {
        messages.value[messageIndex].likes = data.likes;
        
        // Re-sort if sorting by popularity
        if (sortBy.value === 'popular') {
          messages.value.sort((a, b) => b.likes - a.likes);
        }
      }
    });
  };
  
  // Change sort order
  const setSortBy = (sort: 'recent' | 'popular') => {
    sortBy.value = sort;
    fetchMessages();
  };
  
  return {
    messages,
    isLoading,
    error,
    sortBy,
    fetchMessages,
    addMessage,
    likeMessage,
    deleteMessage,
    setupSocketListeners,
    setSortBy
  };
}); 