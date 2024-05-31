import express from 'express';
import connectionPromise from './connexion.js';
import exphbs from 'express-handlebars';

const router = express.Router();

// Page d'accueil : afficher toutes les publications
router.get('/', async (req, res) => {
    const db = await connectionPromise;
    const posts = await db.all(`
        SELECT posts.id_post, posts.text, posts.timestamp, users.name, COUNT(likes.id_user) as likes 
        FROM posts 
        LEFT JOIN users ON posts.id_user = users.id_user 
        LEFT JOIN likes ON posts.id_post = likes.id_post 
        GROUP BY posts.id_post
        ORDER BY posts.timestamp DESC
    `);
    res.render('index', { layout: false, posts });
});

// Ajouter une nouvelle publication
router.post('/posts', async (req, res) => {
    const { text } = req.body;
    const timestamp = Math.floor(Date.now() / 1000);
    const id_user = 1; // ID utilisateur par défaut

    const db = await connectionPromise;
    await db.run(`
        INSERT INTO posts (id_user, text, timestamp) 
        VALUES (?, ?, ?)
    `, [id_user, text, timestamp]);

    res.redirect('/');
});

// Rechercher un utilisateur
router.get('/users/search', async (req, res) => {
    const { q } = req.query;
    const db = await connectionPromise;
    const users = await db.all(`
        SELECT id_user AS id, name
        FROM users
        WHERE name LIKE ?
    `, [`%${q}%`]);
    res.render('search', { layout: false, users });
});

// Afficher le profil et les publications d'un utilisateur spécifique
router.get('/users/:id/posts', async (req, res) => {
    const { id } = req.params;
    const db = await connectionPromise;
    const user = await db.get(`
        SELECT id_user AS id, name
        FROM users
        WHERE id_user = ?
    `, [id]);

    const posts = await db.all(`
        SELECT posts.id_post, posts.text, posts.timestamp, users.name, COUNT(likes.id_user) as likes 
        FROM posts 
        LEFT JOIN users ON posts.id_user = users.id_user 
        LEFT JOIN likes ON posts.id_post = likes.id_post 
        WHERE posts.id_user = ?
        GROUP BY posts.id_post
        ORDER BY posts.timestamp DESC
    `, [id]);

    res.render('user', { layout: false, user, posts });
});

export default router;
