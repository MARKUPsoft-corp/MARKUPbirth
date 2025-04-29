import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useTimerStore = defineStore('timer', () => {
  // État pour savoir si l'anniversaire est atteint
  const birthdayReached = ref(false);
  
  // Fonction pour marquer l'anniversaire comme atteint
  const setBirthdayReached = () => {
    birthdayReached.value = true;
    
    // Enregistrer dans localStorage pour maintenir l'état entre les rechargements
    try {
      localStorage.setItem('birthdayReached', 'true');
    } catch (e) {
      console.error('Erreur lors de l\'enregistrement de l\'état dans localStorage:', e);
    }
  };
  
  // Fonction pour initialiser l'état à partir de localStorage
  const initFromLocalStorage = () => {
    try {
      const storedValue = localStorage.getItem('birthdayReached');
      if (storedValue === 'true') {
        birthdayReached.value = true;
      }
    } catch (e) {
      console.error('Erreur lors de la lecture de localStorage:', e);
    }
  };
  
  // Vérifier si la date cible est dépassée
  const checkIfDateReached = () => {
    const now = new Date();
    const targetDate = new Date('2025-04-30T00:00:00');
    
    if (now >= targetDate) {
      setBirthdayReached();
      return true;
    }
    return false;
  };
  
  return {
    birthdayReached,
    setBirthdayReached,
    initFromLocalStorage,
    checkIfDateReached
  };
});
