<template>
  <footer class="footer">
    <div class="container">
      <div class="footer-grid">
        <div class="footer-section main-section">
          <h5>Anniversaire d'Emmanuel YAKAM TCHAMEGNI</h5>
          <p>Un site créé avec amour pour célébrer l'anniversaire d'Emmanuel.</p>
        </div>
        <div class="footer-section">
          <h5>Navigation</h5>
          <ul>
            <li><NuxtLink to="/">Accueil</NuxtLink></li>
            <li><NuxtLink to="/mur-messages">Mur de messages</NuxtLink></li>
            <li><NuxtLink to="/quiz">Quiz</NuxtLink></li>
            <li><NuxtLink to="/jeux">Mini-jeux</NuxtLink></li>
          </ul>
        </div>
        <div class="footer-section">
          <h5>Plus</h5>
          <ul>
            <li><NuxtLink to="/defis">Défis</NuxtLink></li>
            <li><NuxtLink to="/sondages">Sondages</NuxtLink></li>
            <li><NuxtLink to="/playlist">Playlist</NuxtLink></li>
            <li><NuxtLink to="/galerie">Galerie</NuxtLink></li>
          </ul>
        </div>
      </div>
      <div class="footer-divider"></div>
      <div class="footer-bottom">
        <div class="copyright">
          <p>© {{ new Date().getFullYear() }} - Tous droits réservés</p>
          <p>
            <NuxtLink to="/politique-confidentialite">Politique de confidentialité</NuxtLink>
          </p>
        </div>
        <div class="social-links">
          <a href="#" aria-label="Partager sur Facebook">
            <i class="bi bi-facebook"></i>
          </a>
          <a href="#" aria-label="Partager sur Twitter">
            <i class="bi bi-twitter-x"></i>
          </a>
          <a href="#" aria-label="Partager sur Instagram">
            <i class="bi bi-instagram"></i>
          </a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
// Footer component
</script>

<style scoped>
.footer {
  background: linear-gradient(to bottom, rgba(17, 17, 17, 0.95), rgba(17, 17, 17, 1));
  color: rgba(255, 255, 255, 0.8);
  padding: 4rem 0 2rem;
  position: relative;
  z-index: 10;
  width: 100%;
  overflow: hidden;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  width: 100%;
  box-sizing: border-box;
}

.footer-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2.5rem;
  margin-bottom: 2rem;
}

.footer-section h5 {
  font-size: 1.3rem;
  margin-bottom: 1.2rem;
  color: white;
  position: relative;
  font-weight: 600;
}

.footer-section h5::after {
  content: '';
  position: absolute;
  bottom: -0.5rem;
  left: 0;
  width: 40px;
  height: 3px;
  background: linear-gradient(to right, var(--primary-green), var(--primary-orange));
  border-radius: 3px;
}

.main-section p {
  line-height: 1.6;
  margin-bottom: 1rem;
}

.footer-section ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-section li {
  margin-bottom: 0.7rem;
}

.footer a {
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  transition: all 0.3s ease;
  position: relative;
  display: inline-block;
}

.footer a:hover {
  color: var(--primary-orange);
  transform: translateX(5px);
}

.footer-divider {
  width: 100%;
  height: 1px;
  background: linear-gradient(to right, 
    transparent, 
    rgba(255, 255, 255, 0.2),
    transparent);
  margin-bottom: 2rem;
}

.footer-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1.5rem;
}

.copyright p {
  margin: 0.3rem 0;
  font-size: 0.9rem;
}

.social-links {
  display: flex;
  gap: 1.2rem;
}

.social-links a {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, 
    rgba(46, 204, 113, 0.1), 
    rgba(243, 156, 18, 0.1));
  transition: all 0.3s ease;
}

.social-links i {
  font-size: 1.2rem;
  color: white;
}

.social-links a:hover {
  transform: translateY(-5px);
  background: linear-gradient(135deg, 
    rgba(46, 204, 113, 0.2), 
    rgba(243, 156, 18, 0.2));
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}

/* Responsive */
@media (max-width: 768px) {
  .footer {
    padding: 3rem 0 1.5rem;
  }
  
  .footer-grid {
    gap: 2rem;
    grid-template-columns: repeat(2, 1fr); /* Deux colonnes sur tablette */
  }
  
  .main-section {
    grid-column: span 2; /* Section principale prend toute la largeur */
  }
  
  .footer-bottom {
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 1rem;
  }
  
  .copyright {
    order: 2;
  }
  
  .social-links {
    order: 1;
  }
  
  .container {
    padding: 0 1.5rem;
  }
}

@media (max-width: 480px) {
  .footer {
    padding: 2.5rem 0 1rem;
  }
  
  .footer-grid {
    gap: 1.5rem;
    grid-template-columns: repeat(2, 1fr); /* Maintenir deux colonnes sur mobile */
  }
  
  .main-section {
    grid-column: span 2; /* Section principale prend toute la largeur */
  }
  
  .footer-section h5 {
    font-size: 1.1rem;
    margin-bottom: 1rem;
  }
  
  .footer-section {
    padding: 0 0.5rem; /* Ajout d'un peu d'espace sur les côtés */
  }
  
  .container {
    padding: 0 1rem;
  }
}

@media (max-width: 360px) {
  .footer-section h5 {
    font-size: 1rem;
  }
  
  .footer-section li, .footer-section a {
    font-size: 0.9rem;
  }
}
</style> 