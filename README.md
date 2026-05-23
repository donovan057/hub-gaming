# Hub Gaming · Base de données de jeux vidéo

Une application web moderne, fluide et responsive qui permet d'explorer la base de données mondiale des jeux vidéo en temps réel en utilisant l'API RAWG.

## 🚀 Fonctionnalités
* **Affichage Dynamique** : Chargement automatique sur 12 jeux les plus populaires du moment.
* **Moteur de Recherche** : Recherche instantanée par mots-clés (ex: *No Man's Sky*, *The Division 2*).
* **Système de Favoris** : Sauvegarde locale des jeux préférés (persistance des données via `localStorage`).
* **Interface Modulaire (Pop-up)** : Clic sur une carte pour ouvrir une fenêtre contenant les détails complets (plateformes, genres, dates de sortie).
* **Design Moderne** : Interface sombre haut de gamme avec des effets de transparence *Glassmorphism*.

## 🛠️ Technologies utilisées
* **HTML5** : Structure sémantique de l'application.
* **CSS3** : Design Responsive (Grid & Flexbox), variables globales et filtres de flou (`backdrop-filter`).
* **Vanilla JavaScript (ES6+)** : Architecture modulaire, programmation asynchrone (`Async/Await`, `Fetch`), manipulation du DOM et gestion du stockage local.
* **API externe** : Connecté aux services de [RAWG.io](https://rawg.io/apidocs).

## 📁 Architecture du projet 
L'application respecte une séparation stricte des fonctionnalités (Clean Code) :
* `/css/` : Contient les feuilles de style de l'application.
* `/js/api.js` : Gestion exclusive des requêtes réseau vers l'API.
* `/js/dom.js` : Logique de fabrication, d'injection HTML et de gestion des favoris.
* `/js/app.js` : Orchestrateur principal (écouteur d'événements et initialisation).