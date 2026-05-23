// ==========================================================================
// MANIPULATION DU DOM, AFFICHAGE & FAVORIS
// ==========================================================================

// Clé unique pour stocker les favoris dans le LocalStorage du navigateur
const STORAGE_KEY = 'hub_gaming_favs';

/**
 * Récupère la liste des IDs des jeux favoris stockés dans le LocalStorage
 * @returns {Array} Un tableau d'identifiants uniques (ex: [3498, 4200])
 */
function getFavorites() {
    const favs = localStorage.getItem(STORAGE_KEY);
    return favs ? JSON.parse(favs) : [];
}

/**
 * Ajoute ou supprime un jeu de la liste des favoris
 * @param {number} gameId - L'identifiant unique du jeu vidéo
 */
function toggleFavorite(gameId) {
    let favs = getFavorites();
    
    if (favs.includes(gameId)) {
        // Si le jeu est déjà en favori, on le retire du tableau
        favs = favs.filter(id => id !== gameId);
    } else {
        // Sinon, on l'ajoute au tableau
        favs.push(gameId);
    }
    
    // On met à jour le LocalStorage en convertissant le tableau en chaîne JSON
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favs));
}

/**
 * Génère et affiche les cartes de jeux dans la grille HTML
 * @param {Array} games - Le tableau de jeux retourné par l'API RAWG
 */
function displayGames(games) {
    const gamesGrid = document.getElementById('games-grid');

    // On vide la grille (on enlève le message de chargement ou les anciennes recherches)
    gamesGrid.innerHTML = '';

    // Si aucun jeu n'est trouvé
    if (!games || games.length === 0) {
        gamesGrid.innerHTML = '<div class="status-message">Aucun jeu trouvé. Essayez une autre recherche !</div>';
        return;
    }

    // Récupération des favoris sauvegardés pour savoir quels cœurs afficher en rouge
    const currentFavs = getFavorites();

    // On boucle sur chaque jeu du tableau pour créer sa carte
    games.forEach(game => {
        // Sécurité si le jeu n'a pas d'image de fond
        const backgroundImage = game.background_image ? game.background_image : 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=600&auto=format&fit=crop';
        
        // On vérifie si ce jeu précis fait partie des favoris de l'utilisateur
        const isFavorite = currentFavs.includes(game.id);

        // On crée l'élément carte (div)
        const gameCard = document.createElement('div');
        gameCard.classList.add('game-card');

        // On injecte le contenu HTML de la carte (avec le bouton cœur et la balise img réparée)
        gameCard.innerHTML = `
            <button class="favorite-btn ${isFavorite ? 'is-fav' : ''}" data-id="${game.id}">
                ${isFavorite ? '❤️' : '🤍'}
            </button>
            <div class="card-image-container">
                <img src="${backgroundImage}" alt="${game.name}" class="card-image" crossorigin="anonymous" loading="lazy">
            </div>
            <div class="card-content">
                <h3>${game.name}</h3>
                <div class="card-meta">
                    <span class="rating">⭐️ ${game.rating ? game.rating : 'N/A'}/5</span>
                    <span class="released">Sortie : ${game.released ? new Date(game.released).toLocaleDateString('fr-FR') : 'Inconnue'}</span>
                </div>
            </div>
        `;
        
        // ÉVÉNEMENT 1 : Clic sur le bouton favoris (Cœur)
        const favBtn = gameCard.querySelector('.favorite-btn');
        favBtn.addEventListener('click', (event) => {
            // TRÈS IMPORTANT : Empêche l'événement de monter à la carte et d'ouvrir la pop-up au clic sur le cœur
            event.stopPropagation(); 
            
            toggleFavorite(game.id);
            
            // Mise à jour visuelle et immédiate de l'icône du cœur
            const updatedFavs = getFavorites();
            if (updatedFavs.includes(game.id)) {
                favBtn.classList.add('is-fav');
                favBtn.textContent = '❤️';
            } else {
                favBtn.classList.remove('is-fav');
                favBtn.textContent = '🤍';
            }
        });

        // ÉVÉNEMENT 2 : Clic sur la carte pour ouvrir la Pop-up de détails
        gameCard.addEventListener('click', () => {
            openGameModal(game);
        });

        // On ajoute la carte finalisée dans la grille principale
        gamesGrid.appendChild(gameCard);
    });
}

/**
 * Gère l'affichage des détails d'un jeu dans la fenêtre Pop-up (Modale)
 * @param {Object} game - Les données du jeu sélectionné
 */
function openGameModal(game) {
    const modal = document.getElementById('game-modal');
    const modalBody = document.getElementById('modal-body');

    const backgroundImage = game.background_image ? game.background_image : 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=600&auto=format&fit=crop';

    modalBody.innerHTML = `
        <div class="modal-header-img" style="background-image: url('${backgroundImage}')"></div>
        <h2>${game.name}</h2>
        <p><strong>Date de sortie :</strong> ${game.released ? new Date(game.released).toLocaleDateString('fr-FR') : 'Inconnue'}</p>
        <p><strong>Note globale :</strong> ⭐ ${game.rating}/5 (${game.ratings_count} votes)</p>
        <p><strong>Plateformes :</strong> ${game.platforms ? game.platforms.map(p => p.platform.name).join(', ') : 'Non spécifiées'}</p>
        <p><strong>Genres :</strong> ${game.genres ? game.genres.map(g => g.name).join(', ') : 'Non spécifiés'}</p>
    `;

    // On affiche la modale en lui enlevant la classe cachée 
    modal.classList.remove('hidden');
}

// Événement pour fermer la pop-up au clic sur la croix (X)
document.getElementById('close-modal').addEventListener('click', () => {
    document.getElementById('game-modal').classList.add('hidden');
});

// UX : Fermer la pop-up si l'utilisateur clique sur le fond sombre à l'extérieur de la boîte modale
window.addEventListener('click', (event) => {
    const modal = document.getElementById('game-modal');
    if (event.target === modal) {
        modal.classList.add('hidden');
    }
});