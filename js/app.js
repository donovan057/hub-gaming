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
    const searchButton = document.getElementById('search-button');

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
            const query = searchInput.value;
            loadAndDisplayGames(query);
        }
    });
}

/**
 * Fait le pont entre l'API (api.js) et le visuel (dom.js)
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