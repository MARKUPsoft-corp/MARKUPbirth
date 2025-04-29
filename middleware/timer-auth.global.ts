import { useTimerStore } from '~/stores/timer';

export default defineNuxtRouteMiddleware((to) => {
  // Ne pas bloquer la page d'accueil
  if (to.path === '/') {
    return;
  }

  // Dans un contexte SSR, useTimerStore() ne peut pas être utilisé
  // directement dans le middleware, donc on vérifie seulement côté client
  if (process.client) {
    const timerStore = useTimerStore();
    
    // Initialiser et vérifier l'état
    timerStore.initFromLocalStorage();
    timerStore.checkIfDateReached();
    
    // Si l'anniversaire n'est pas encore atteint, rediriger vers la page d'accueil
    if (!timerStore.birthdayReached) {
      return navigateTo('/');
    }
  }
});
