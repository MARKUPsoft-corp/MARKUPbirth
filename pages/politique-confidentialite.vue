<template>
  <div class="container py-5">
    <h1 class="section-title">Politique de Confidentialité</h1>
    
    <div class="card">
      <div class="card-body">
        <h2>À propos de cette politique</h2>
        <p>
          Cette politique de confidentialité explique comment nous collectons, utilisons et protégeons vos informations 
          lorsque vous utilisez notre site web d'anniversaire pour Emmanuel YAKAM TCHAMEGNI.
        </p>
        
        <h2>Informations collectées</h2>
        <p>
          Nous collectons les informations suivantes lorsque vous participez sur notre site :
        </p>
        <ul>
          <li>Votre nom d'utilisateur (fourni par vous)</li>
          <li>Les messages que vous publiez</li>
          <li>Les photos ou vidéos que vous téléchargez</li>
          <li>Vos votes sur les sondages et la playlist</li>
          <li>Vos résultats de quiz</li>
        </ul>
        
        <h2>Utilisation des informations</h2>
        <p>
          Nous utilisons vos informations uniquement pour :
        </p>
        <ul>
          <li>Afficher vos messages, photos et vidéos sur le site</li>
          <li>Permettre aux autres utilisateurs de voir vos contributions</li>
          <li>Améliorer l'expérience interactive du site</li>
        </ul>
        
        <h2>Stockage des informations</h2>
        <p>
          Toutes les informations sont stockées localement sur notre serveur. Le site n'utilise pas de base de données externe.
          Vos informations ne sont pas vendues ou partagées avec des tiers.
        </p>
        
        <h2>Durée de conservation</h2>
        <p>
          Vos informations seront conservées jusqu'à la fin de l'événement d'anniversaire, après quoi elles seront archivées 
          pour référence future. Si vous souhaitez que vos informations soient supprimées, veuillez nous contacter.
        </p>
        
        <h2>Vos droits</h2>
        <p>
          Vous avez le droit de :
        </p>
        <ul>
          <li>Demander l'accès à vos informations personnelles</li>
          <li>Demander la correction de vos informations</li>
          <li>Demander la suppression de vos informations</li>
          <li>Vous opposer au traitement de vos informations</li>
        </ul>
        
        <h2>Suppression de contenu</h2>
        <p>
          Si vous souhaitez supprimer un contenu que vous avez publié, veuillez nous contacter à l'adresse email indiquée ci-dessous.
        </p>
        
        <h2>Contact</h2>
        <p>
          Pour toute question concernant cette politique de confidentialité, veuillez contacter :
          <a href="mailto:contact@example.com">contact@example.com</a>
        </p>
        
        <p class="mt-5 text-muted">
          Dernière mise à jour : {{ new Date().toLocaleDateString('fr-FR') }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
// Privacy policy page
definePageMeta({
  title: "Politique de confidentialité | Anniversaire d'Emmanuel",
  description: "Politique de confidentialité du site web d'anniversaire d'Emmanuel YAKAM TCHAMEGNI"
});
</script>

<style scoped>
/* Page-specific styles */
.card {
  border-radius: 15px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

h2 {
  color: var(--primary-color);
  margin-top: 2rem;
  margin-bottom: 1rem;
  font-size: 1.5rem;
}

ul {
  margin-bottom: 1.5rem;
}
</style> 