import connectionPromise from '../connexion.js';

/**
 * Retourne la liste des posts d'un utilisateur spécifique ou des utilisateurs suivis par cet utilisateur.
 * @param {string} id_user L'identifiant de l'utilisateur pour lequel récupérer les posts.
 * @returns {Promise<Array>}  La liste des posts avec leurs détails.
 */
export async function getPosts(id_user) {
    const connexion = await connectionPromise;

    // Requête SQL pour récupérer les posts d'un utilisateur spécifique ou des utilisateurs suivis par cet utilisateur
    const posts = await connexion.all(
        `SELECT posts.id_post, posts.text, posts.timestamp, users.name, COUNT(likes.id_user) as likes, users.id_user 
        FROM posts 
        LEFT JOIN users ON posts.id_user = users.id_user 
        LEFT JOIN likes ON posts.id_post = likes.id_post 
        WHERE posts.id_user = ? OR posts.id_user IN (
            SELECT id_user_suivis 
            FROM suivis 
            WHERE id_user = ?
        )
        GROUP BY posts.id_post
        ORDER BY posts.timestamp DESC`, [id_user, id_user]
    );

    return posts;
}

/**
 * Retourne la liste de tous les posts avec leurs détails pour les modérateurs.
 * @returns {Promise<Array>} La liste des posts avec leurs détails.
 */
export async function getModeratorPosts() {
    const connexion = await connectionPromise;

    // Requête SQL pour récupérer tous les posts avec leurs détails pour les modérateurs
    const posts = await connexion.all(
        `SELECT posts.id_post, posts.text, posts.timestamp, users.name, COUNT(likes.id_user) as likes, users.id_user 
        FROM posts 
        LEFT JOIN users ON posts.id_user = users.id_user 
        LEFT JOIN likes ON posts.id_post = likes.id_post 
        GROUP BY posts.id_post
        ORDER BY posts.timestamp DESC`
    );
    return posts;
}

/**
 * Ajoute une nouvelle publication dans la base de données.
 * @param {string} id_user L'identifiant de l'utilisateur qui ajoute la publication.
 * @param {string} texte Le texte de la publication à ajouter.
 * @returns {number} L'identifiant de la dernière publication ajoutée.
 */
export async function addPost(id_user, texte) {
    const connexion = await connectionPromise;

    const timestamp = Math.floor(Date.now() / 1000); // Générer un timestamp actuel en secondes

    // Requête SQL pour insérer une nouvelle publication dans la base de données
    const result = await connexion.run(`
        INSERT INTO posts (id_user, text, timestamp) 
        VALUES (?, ?, ?)
    `, [id_user, texte, timestamp]);

    return result.lastID; // Retourne l'identifiant de la dernière publication ajoutée
}

/**
 * Supprime un post de la base de données.
 * @param {string} id_post L'identifiant du post à supprimer.
 */
export async function deletePost(id_post) {
    const connexion = await connectionPromise;

    // Requête SQL pour supprimer un post de la base de données
    const result = await connexion.run(`
        DELETE FROM posts WHERE id_post = ?
    `, [id_post]);
}
