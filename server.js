import express, { json } from 'express'; // Importer express et le middleware json
import "dotenv/config"; // Charger les variables d'environnement depuis un fichier .env
import { engine } from 'express-handlebars'; // Importer le moteur de templates express-handlebars
import helmet from 'helmet'; // Importer helmet pour la sécurité
import compression from 'compression'; // Importer compression pour la compression des réponses
import cors from 'cors'; // Importer cors pour le partage des ressources entre origines
import { getPosts, addPost } from './model/posts.js';
import { getUser, getUserPosts, searchUser } from './model/users.js';
import { validateIdUser, validateTexte, validateNumber, validateSearchTexte } from './validation.js'

const app = express(); // Créer une instance d'application express
const PORT = process.env.PORT || 5000; // Définir le port sur lequel le serveur écoutera, en utilisant une variable d'environnement ou le port 5000 par défaut

// Configurer Handlebars comme moteur de templates
app.engine('handlebars', engine({
    helpers: {
        formatDate: (timestamp) => {
            const date = new Date(timestamp * 1000); // Convertir le timestamp en millisecondes
            return date.toLocaleString(); // Retourner la date au format local
        }
    }
}));

app.set('view engine', 'handlebars'); // Définir Handlebars comme moteur de templates
app.set('views', './views'); // Définir le répertoire des vues

// Middleware pour parser les requêtes
app.use(json()); // Parser les payloads JSON entrants

//https://www.geeksforgeeks.org/express-js-express-urlencoded-function/
app.use(express.urlencoded({ extended: true })); // Parser les données URL-encodées

// Middleware pour la sécurité
app.use(helmet()); // Ajouter des en-têtes de sécurité HTTP

// Middleware pour la compression
app.use(compression()); // Compresser les réponses HTTP

// Middleware pour CORS
app.use(cors()); // Activer le partage des ressources entre origines (CORS)

// Middleware pour servir les fichiers statiques
app.use(express.static('public')); // Servir les fichiers statiques depuis le répertoire 'public'

// Routes
// Page d'accueil : afficher toutes les publications
app.get('/', async (req, res) => {

    res.render('index', {
        titre: 'Accueil | Liste Publications',
        layout: 'main',
        scripts: ['/js/index.js'],
        styles: [],
        posts: await getPosts()
    });

});

// Ajouter une nouvelle publication
app.post('/posts', async (req, res) => {
    const { text } = req.body; // Récupérer le texte de la publication depuis la requête
    if (validateTexte(text)) {
        const lastID = addPost(text);
        // Rediriger vers la page d'accueil après l'ajout de la publication
        res.status(201).json({ id: lastID });
    }
    else {
        res.status(400).end();
    }
});

// Rechercher un utilisateur
app.get('/users/search', async (req, res) => {

    const { q } = req.query; // Récupérer le terme de recherche depuis la requête

    if (validateSearchTexte(q)) {

        res.render('search', {
            titre: 'Utilisateurs | Rechercher',
            layout: 'main',
            scripts: ['/js/search.js'],
            styles: [],
            users: await searchUser(q)
        });
    } else {

        res.render('search', {
            titre: 'Utilisateurs | Rechercher',
            layout: 'main',
            scripts: ['/js/search.js'],
            styles: [],
            users: []
        });
    }

});

app.get('/aboutus', (req, res) => {

    res.render('aboutus', {
        titre: 'Apropos De Nous',
        layout: 'main',
        scripts: [],
        styles: []
    });

});


app.get('/contactus', (req, res) => {

    res.render('contactus', {
        titre: 'Nous Contacter',
        layout: 'main',
        scripts: [],
        styles: []
    });

});

// Afficher le profil et les publications d'un utilisateur spécifique
app.get('/users/:id/posts', async (req, res) => {

    const id = Number(req.params.id);

    if (validateIdUser(id)) {

        res.render('user', {
            titre: 'Utilisateurs | Liste Publications',
            layout: 'main',
            scripts: [],
            styles: [],
            posts: await getUserPosts(id),
            user: await getUser(id)
        });
    }
    else {
        res.status(404).end();
    }


});

// Démarrer le serveur
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`); // Afficher un message de confirmation dans la console
    console.log("http://localhost:" + PORT); // Afficher l'URL du serveur
});
