// ==========================================================================
// ORCHESTRATEUR DE L'APPLICATION (MAIN)
// ==========================================================================

// Dès que la page HTML est complètement chargée par le navigateur 
document.addEventListener('DOMContentLoaded', () => {
    initApp();
});

/**
 * Initialise les fonctionnalités de l'application
 */
async function initApp() {
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-btn');
    const favFilterButton = document.getElementById('fav-filter-btn')

    // 1. Premier affichage : on change les jeux populaires par défaut dès l'ouverture
    await loadAndDisplayGames();

    // 2. Écouteur d'événement : clic sur le bouton "Rechercher"
    searchButton.addEventListener('click', () => {
        const query = searchInput.value;
        loadAndDisplayGames(query);
    });

    // 3. Écouteur d'événement : touche "Entrée" dans la barre de recherche (plus confortable)
    searchInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            const query = searchInput.value.trim();
            loadAndDisplayGames(query);
        }
    });

    // 4. Écouteur d'événement : clic sur le bouton "Mes Favoris ❤️"
    favFilterButton.addEventListener('click', async () => {
        await loadAndDisplayFavorites();
    });
}

/**
 * Fait le pont entre l'API (api.js) et le visuel (dom.js) pour la recherche globale
 * @param {string} search - Le mot-clé de la recherche 
 */
async function loadAndDisplayGames(search = '') {
    const gamesGrid = document.getElementById('games-grid');

    // On affiche un message temporaire pendant que l'API nous répond
    gamesGrid.innerHTML = '<div class="status-message">Rechercher dans la base de données...</div>';

    // On appelle la fonction de js/api.js pour récupérer les données RAWG
    const gamesData = await getGamesFromAPI(search);

    // On envoie le tableau de données à la fonction de js/dom.js pour fabriquer les cartes 
    displayGames(gamesData);
}

/**
 * Récupère les IDs du localStorage et affiche uniquement les jeux mis en favoris
 */
async function loadAndDisplayFavorites() {
    const gamesGrid = document.getElementById('games-grid');

    // Récupération de la liste des IDs favoris depuis le localStorage (via dom.js)
    const favoriteIds = getFavorites();

    if (favoriteIds.length === 0) {
        gamesGrid.innerHTML = '<div class="status-message">Vous n\'avez pas encore ajouté de jeux en favoris ! ❤️</div>';
        return;
    }

    gamesGrid.innerHTML = '<div class="status-message">Chargement de vos favoris...</div>';

    try {
        // On va chercher les données de chaque jeu favori en parallèle
        const fetchPromises = favoriteIds.map(async (id) => {
            // Sécurité : Conversion de l'ID en texte
            const gameIdText = id.toString();
            
            // On utilise exactement la fonction de ton fichier js/api.js pour éviter les erreurs de clé !
            // On lui passe l'ID directement comme paramètre de recherche cible
            const gameData = await getGamesFromAPI(gameIdText);
            
            // getGamesFromAPI renvoie généralement un tableau ou un objet. 
            // Si l'API renvoie un tableau de résultats, on prend le premier élément trouvé.
            if (gameData && gameData.results && gameData.results.length > 0) {
                return gameData.results[0];
            } else if (gameData && gameData.id) {
                return gameData; // Si l'objet du jeu est renvoyé directement
            }
            return null;
        });

        const favoriteGames = await Promise.all(fetchPromises);

        // On nettoie le tableau pour enlever les requêtes vides ou échouées
        const cleanGamesList = favoriteGames.filter(game => game !== null);

        if (cleanGamesList.length === 0) {
            gamesGrid.innerHTML = '<div class="status-message">Impossible de charger les détails de vos favoris.</div>';
            return;
        }

        // On envoie la liste nettoyée à dom.js pour l'affichage final !
        displayGames(cleanGamesList);
        
    } catch (error) {
        console.error("Erreur lors de la récupération des favoris :", error);
        gamesGrid.innerHTML = '<div class="status-message">Une erreur est survenue lors du chargement.</div>';
    }
}