// ==========================================================================
// CONFIGURATION ET REQUÊTES DE L'API RAWG
// ==========================================================================

const API_KEY = '495278525ea448ab9f18e7721ca8c66b';
const BASE_URL = 'https://api.rawg.io/api';

/**
 * Fonction asynchrone pour récupérer les jeux populaire ou filtrés
 * @param {string} searchQuery - Le mot-clé tapé par l'utilisateur
 * @returns {Promise<Array} - Un tableau contenant les données des jeux vidéo
 */
async function getGamesFromAPI(searchQuery = '') {
    try {
        let url = `${BASE_URL}/games?key=${API_KEY}&page_size=12`;

        // Si l'utilisateur a tapé une recherche, on l'ajoute à l'URL
        if (searchQuery.trim() !== '') {
            url += `&search=${encodeURIComponent(searchQuery)}`;
        }

        // On lance la requête HTTP asynchrone
        const response = await fetch(url);

        // Si la réponse n'es pas "OK" (ex: mauvaise clé d'API), on lève une erreur
        if (!response.ok) {
            throw new Error(`Erreur HTTP ! Statut : ${response.status}`);
        }

        const data = await response.json();

        // L'API renvoie un objet, les jeux sont stockés dans le tableau 'results'
        return data.results;
        
    } catch (error) {
        console.error("Impossible de récupérer les données de l'API RAWG :", error);
        return [];
    }
}