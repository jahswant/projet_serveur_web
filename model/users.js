import connectionPromise from '../connexion.js';

// Rechercher un utilisateur
export async function searchUser(q) {
    const db = await connectionPromise; // Attendre la connexion à la base de données
    // Exécuter la requête SQL pour rechercher des utilisateurs par nom
    const users = await db.all(`
        SELECT id_user AS id, name
        FROM users
        WHERE name LIKE ?
    `, [`%${q}%`]);
    // Rendre la page de résultats de recherche avec les utilisateurs trouvés
    return users;
};



// Afficher le profil et les publications d'un utilisateur spécifique

export async function getUser(id) {
    const db = await connectionPromise; // Attendre la connexion à la base de données
    // Exécuter la requête SQL pour récupérer les informations de l'utilisateur
    const user = await db.get(`
        SELECT id_user AS id, name
        FROM users
        WHERE id_user = ?
    `, [id]);

    return user;

}

export async function getUserPosts(id) {
    // Exécuter la requête SQL pour récupérer les publications de l'utilisateur avec le nombre de likes
    const db = await connectionPromise; // Attendre la connexion à la base de données
    const posts = await db.all(`
        SELECT posts.id_post, posts.text, posts.timestamp, users.name, COUNT(likes.id_user) as likes 
        FROM posts 
        LEFT JOIN users ON posts.id_user = users.id_user 
        LEFT JOIN likes ON posts.id_post = likes.id_post 
        WHERE posts.id_user = ?
        GROUP BY posts.id_post
        ORDER BY posts.timestamp DESC
    `, [id]);

    // Rendre la page de profil de l'utilisateur avec les publications récupérées
    return posts;
};