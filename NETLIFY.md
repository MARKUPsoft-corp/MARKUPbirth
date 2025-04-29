# Déploiement sur Netlify

Ce document explique comment déployer le frontend de votre application Nuxt.js sur Netlify pendant que l'API backend est déployée sur Render.

## Prérequis

- Un compte [Netlify](https://app.netlify.com/signup)
- Votre dépôt GitHub contenant le code de l'application

## Étapes de déploiement

### 1. Créer un compte Netlify

Si vous n'avez pas encore de compte Netlify, créez-en un à l'adresse [https://app.netlify.com/signup](https://app.netlify.com/signup).

### 2. Ajouter un nouveau site dans Netlify

1. Connectez-vous à votre compte Netlify
2. Cliquez sur "Add new site" puis "Import an existing project"
3. Choisissez "GitHub" comme fournisseur de dépôt
4. Autorisez Netlify à accéder à vos dépôts GitHub si nécessaire
5. Recherchez et sélectionnez votre dépôt `MARKUPsoft-corp/MARKUPbirth`

### 3. Configurer les paramètres de déploiement

Les paramètres de base sont déjà configurés dans le fichier `netlify.toml`, mais vous pouvez les vérifier et les ajuster si nécessaire :

- **Build command** : `npm run generate`
- **Publish directory** : `dist`

### 4. Configurer la variable d'environnement API_URL

1. Dans les paramètres de votre site Netlify, allez dans "Site settings" > "Environment variables"
2. Ajoutez une nouvelle variable :
   - **Clé** : `API_URL`
   - **Valeur** : `https://birth-app.onrender.com` (remplacez par l'URL exacte de votre API sur Render)

### 5. Déclencher le déploiement

1. Cliquez sur "Deploy site"
2. Attendez que le build et le déploiement soient terminés
3. Votre site sera accessible à l'URL fournie par Netlify (généralement `https://your-site-name.netlify.app`)

## Vérification du déploiement

Une fois le déploiement terminé, vous devriez pouvoir accéder à votre application via l'URL fournie par Netlify. Assurez-vous que :

1. Votre page d'accueil s'affiche correctement
2. Les connexions à l'API fonctionnent (vérifiez la console du navigateur pour les erreurs)
3. Les fonctionnalités Socket.IO fonctionnent correctement

## Personnalisation du domaine (optionnel)

Si vous souhaitez utiliser un nom de domaine personnalisé :

1. Dans les paramètres de votre site Netlify, allez dans "Domain settings"
2. Cliquez sur "Add custom domain" et suivez les instructions

## Résolution des problèmes courants

Si votre application ne se connecte pas correctement à l'API :

1. Vérifiez que l'API sur Render est bien active (accédez à l'URL de l'API dans votre navigateur)
2. Assurez-vous que la variable d'environnement `API_URL` est correctement configurée
3. Vérifiez les journaux de déploiement sur Netlify pour les erreurs
4. Inspectez la console du navigateur pour les erreurs CORS ou de connexion

---

Pour toute mise à jour ou modification du site, il vous suffit de pousser les changements sur GitHub, et Netlify déploiera automatiquement la nouvelle version.
