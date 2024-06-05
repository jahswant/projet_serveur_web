import express from 'express';
import connectionPromise from './connexion.js';

const router = express.Router();

// Page d'accueil : afficher toutes les publications
router.get('/', async (req, res) => {
    const db = await connectionPromise; // Attendre la connexion à la base de données
    // Exécuter la requête SQL pour récupérer toutes les publications avec le nombre de likes
    const posts = await db.all(`
        SELECT posts.id_post, posts.text, posts.timestamp, users.name, COUNT(likes.id_user) as likes, users.id_user 
        FROM posts 
        LEFT JOIN users ON posts.id_user = users.id_user 
        LEFT JOIN likes ON posts.id_post = likes.id_post 
        GROUP BY posts.id_post
        ORDER BY posts.timestamp DESC
    `);
    // Rendre la page d'accueil avec les publications récupérées
    res.render('index', { layout: false, posts });
});

// Ajouter une nouvelle publication
router.post('/posts', async (req, res) => {
    const { text } = req.body; // Récupérer le texte de la publication depuis la requête
    const timestamp = Math.floor(Date.now() / 1000); // Générer un timestamp actuel en secondes
    const id_user = 1; // ID utilisateur par défaut (à adapter selon le contexte)

    const db = await connectionPromise; // Attendre la connexion à la base de données
    // Insérer la nouvelle publication dans la base de données
    await db.run(`
        INSERT INTO posts (id_user, text, timestamp) 
        VALUES (?, ?, ?)
    `, [id_user, text, timestamp]);

    // Rediriger vers la page d'accueil après l'ajout de la publication
    res.redirect('/');
});

// Rechercher un utilisateur
router.get('/users/search', async (req, res) => {
    const { q } = req.query; // Récupérer le terme de recherche depuis la requête
    const db = await connectionPromise; // Attendre la connexion à la base de données
    // Exécuter la requête SQL pour rechercher des utilisateurs par nom
    const users = await db.all(`
        SELECT id_user AS id, name
        FROM users
        WHERE name LIKE ?
    `, [`%${q}%`]);
    // Rendre la page de résultats de recherche avec les utilisateurs trouvés
    res.render('search', { layout: false, users });
});

// Afficher le profil et les publications d'un utilisateur spécifique
router.get('/users/:id/posts', async (req, res) => {
    const { id } = req.params; // Récupérer l'ID de l'utilisateur depuis les paramètres de l'URL
    const db = await connectionPromise; // Attendre la connexion à la base de données
    // Exécuter la requête SQL pour récupérer les informations de l'utilisateur
    const user = await db.get(`
        SELECT id_user AS id, name
        FROM users
        WHERE id_user = ?
    `, [id]);

    // Exécuter la requête SQL pour récupérer les publications de l'utilisateur avec le nombre de likes
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
    res.render('user', { layout: false, user, posts });
});

export default router;
