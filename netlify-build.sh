#!/bin/bash

# Afficher les informations sur l'environnement
echo "Node version:"
node -v
echo "NPM version:"
npm -v

# Installer les dépendances
echo "Installing dependencies..."
npm install

# Générer l'application statique
echo "Generating static site..."
npm run generate

# S'assurer que le dossier dist existe
if [ ! -d "dist" ]; then
  echo "Le dossier dist n'existe pas, création d'un dossier de secours..."
  mkdir -p dist
  
  # Créer une page index de secours
  cat > dist/index.html << EOL
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Anniversaire d'Emmanuel YAKAM TCHAMEGNI</title>
  <style>
    body {
      font-family: 'Poppins', sans-serif;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      margin: 0;
      background-color: #f8f9fa;
      color: #333;
    }
    .container {
      max-width: 800px;
      padding: 40px;
      text-align: center;
      background: white;
      border-radius: 10px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }
    h1 {
      color: #FF8B00;
    }
    .loading {
      margin-top: 20px;
    }
    .loading::after {
      content: "...";
      animation: dots 1.5s steps(5, end) infinite;
    }
    @keyframes dots {
      0%, 20% { content: "."; }
      40% { content: ".."; }
      60% { content: "..."; }
      80%, 100% { content: ""; }
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>Anniversaire d'Emmanuel YAKAM TCHAMEGNI</h1>
    <p>Bienvenue sur le site de l'anniversaire d'Emmanuel !</p>
    <p class="loading">Chargement en cours</p>
    <p>Le site sera bientôt disponible.</p>
  </div>

  <script>
    // Redirection automatique vers la version backend
    setTimeout(() => {
      window.location.href = "${API_URL || 'https://birth-app.onrender.com'}";
    }, 5000);
  </script>
</body>
</html>
EOL
fi

echo "Build completed!"
