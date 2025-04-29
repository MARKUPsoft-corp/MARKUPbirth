# Guide de déploiement sur Render

Ce document explique comment déployer l'application Birth sur la plateforme Render.

## Prérequis

- Un compte [Render](https://render.com/)
- Un dépôt Git contenant votre application (GitHub, GitLab, etc.)

## Configuration du déploiement

### 1. Préparation du code

Votre code a déjà été préparé pour le déploiement sur Render avec les modifications suivantes:

- Fichier `render.yaml` pour la configuration automatique
- Adaptation des fichiers serveur pour prendre en compte les variables d'environnement
- Configuration CORS adaptative pour la production
- Scripts adaptés pour le démarrage en production

### 2. Connecter votre dépôt à Render

1. Connectez-vous à votre compte Render
2. Cliquez sur "New" puis sélectionnez "Blueprint"
3. Autorisez Render à accéder à votre dépôt Git
4. Sélectionnez le dépôt contenant votre application

Render détectera automatiquement le fichier `render.yaml` et proposera de déployer les services définis.

### 3. Configuration des variables d'environnement

Si vous avez des secrets ou des configurations spécifiques, ajoutez-les dans les variables d'environnement de votre service sur Render:

- JWT_SECRET (pour l'authentification)
- Autres secrets spécifiques à votre application

### 4. Déploiement

Cliquez sur "Apply" pour lancer le déploiement. Render va:

1. Cloner votre dépôt
2. Installer les dépendances avec `npm install`
3. Construire l'application avec `npm run build`
4. Démarrer l'application avec `NODE_ENV=production node server.js`

## Structure des services

Votre application est déployée comme un service unique qui:

- Exécute le backend Express sur le port 3001 (interne)
- Sert l'application Nuxt construite
- Partage les ressources entre les deux composants

## Surveillance et maintenance

### Logs

Pour consulter les logs de votre application:
1. Accédez à votre tableau de bord Render
2. Sélectionnez votre service "birth-app"
3. Cliquez sur l'onglet "Logs"

### Mise à jour de l'application

Render déploie automatiquement les nouvelles versions lorsque vous poussez des modifications sur la branche principale de votre dépôt Git.

## Gestion des fichiers uploadés

Les fichiers uploadés (photos, etc.) sont stockés dans un volume persistant monté dans le répertoire `/opt/render/project/src/uploads`. Ce stockage est conservé même lorsque votre service est redéployé.

## Problèmes connus et dépannage

- **Problème de CORS**: Si vous rencontrez des problèmes de CORS, vérifiez que `FRONTEND_URL` est correctement configuré.
- **Uploads disparus**: Assurez-vous que le chemin de montage dans `render.yaml` correspond au chemin utilisé dans votre code.
- **Temps de démarrage lent**: Le premier démarrage peut prendre plus de temps car Render doit construire l'application.

## Support

Si vous rencontrez des problèmes avec votre déploiement, consultez la [documentation Render](https://render.com/docs) ou contactez leur support.
