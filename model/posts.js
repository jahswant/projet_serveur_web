import connectionPromise from '../connexion.js';


/**
 * Retourne la liste des posts.
 * @returns La liste des posts.
 */
export async function getPosts() {
    const connexion = await connectionPromise;

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
 * Ajoute une publication à la liste.
 * @param {string} texte Le texte de publication à ajouter.
 */
export async function addPost(texte) {

    const connexion = await connectionPromise;

    const timestamp = Math.floor(Date.now() / 1000); // Générer un timestamp actuel en secondes
    const id_user = 1; // ID utilisateur par défaut (à adapter selon le contexte)

    const db = await connectionPromise; // Attendre la connexion à la base de données
    // Insérer la nouvelle publication dans la base de données
    const result = await connexion.run(`
        INSERT INTO posts (id_user, text, timestamp) 
        VALUES (?, ?, ?)
    `, [id_user, texte, timestamp]);

    return result.lastID;
}
