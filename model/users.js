import connectionPromise from '../connexion.js';

/**
 * Recherche des utilisateurs dont le nom correspond à la chaîne spécifiée.
 * @param {string} q La chaîne de recherche pour le nom d'utilisateur.
 * @returns {Promise<Array>} La liste des utilisateurs correspondant à la recherche.
 */
export async function searchUser(q) {
    const db = await connectionPromise; // Attendre la connexion à la base de données
    // Requête SQL pour rechercher des utilisateurs par nom
    const users = await db.all(`
        SELECT id_user AS id, name
        FROM users
        WHERE name LIKE ?
    `, [`%${q}%`]);
    // Renvoyer la liste des utilisateurs trouvés
    return users;
}

/**
 * Récupère les informations d'un utilisateur spécifique.
 * @param {string} id L'identifiant de l'utilisateur à récupérer.
 * @returns {Promise<Object>} Les informations de l'utilisateur.
 */
export async function getUser(id) {
    const db = await connectionPromise; // Attendre la connexion à la base de données
    // Requête SQL pour récupérer les informations de l'utilisateur par son identifiant
    const user = await db.get(`
        SELECT id_user AS id, name
        FROM users
        WHERE id_user = ?
    `, [id]);

    // Renvoyer les informations de l'utilisateur
    return user;
}

/**
 * Récupère les publications d'un utilisateur spécifique avec le nombre de likes pour chaque publication.
 * @param {string} id L'identifiant de l'utilisateur dont récupérer les publications.
 * @returns {Promise<Array>} La liste des publications de l'utilisateur avec les détails.
 */
export async function getUserPosts(id) {
    const db = await connectionPromise; // Attendre la connexion à la base de données
    // Requête SQL pour récupérer les publications de l'utilisateur avec le nombre de likes
    const posts = await db.all(`
        SELECT posts.id_post, posts.text, posts.timestamp, users.name, COUNT(likes.id_user) as likes 
        FROM posts 
        LEFT JOIN users ON posts.id_user = users.id_user 
        LEFT JOIN likes ON posts.id_post = likes.id_post 
        WHERE posts.id_user = ?
        GROUP BY posts.id_post
        ORDER BY posts.timestamp DESC
    `, [id]);

    // Renvoyer la liste des publications de l'utilisateur avec les détails
    return posts;
}
