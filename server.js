import express, { json } from 'express'; // Importer express et le middleware json
import "dotenv/config"; // Charger les variables d'environnement depuis un fichier .env
import { engine } from 'express-handlebars'; // Importer le moteur de templates express-handlebars
import session from 'express-session'; // Middleware pour gérer les sessions
import memorystore from 'memorystore'; // Store de session en mémoire
import helmet from 'helmet'; // Middleware pour la sécurité
import compression from 'compression'; // Middleware pour la compression des réponses
import cors from 'cors'; // Middleware pour le partage des ressources entre origines
import passport from "passport"; // Middleware pour l'authentification
import { 
    getPosts, addPost, getModeratorPosts, deletePost 
} from './model/posts.js'; // Importer les fonctions de gestion des publications depuis le modèle
import { 
    getUser, getUserPosts, searchUser 
} from './model/users.js'; // Importer les fonctions de gestion des utilisateurs depuis le modèle
import { 
    validateIdUser, validateTexte, validateCourriel, validateSearchTexte, 
    validateMotDePasse, validateUsername 
} from './validation.js'; // Importer les fonctions de validation depuis un fichier dédié
import { 
    addUtilisateur, addUtilisateurSuivi, removeUtilisateurSuivi, isFollowing 
} from "./model/utilisateurs.js"; // Importer les fonctions de gestion des utilisateurs depuis le modèle
import './passportconfig.js'; // Configuration de passport.js

const MemoryStore = memorystore(session); // Utiliser MemoryStore pour stocker les sessions en mémoire

const app = express(); // Créer une instance d'application express
const PORT = process.env.PORT || 5000; // Définir le port sur lequel le serveur écoutera

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
app.use(express.urlencoded({ extended: true })); // Parser les données URL-encodées

// Middleware pour la sécurité
app.use(helmet()); // Ajouter des en-têtes de sécurité HTTP

// Middleware pour la compression
app.use(compression()); // Compresser les réponses HTTP

// Middleware pour CORS
app.use(cors()); // Activer le partage des ressources entre origines (CORS)

// Middleware pour gérer les sessions
app.use(session({
    cookie: { maxAge: 360000 },
    name: process.env.npm_package_name,
    store: new MemoryStore({ checkPeriod: 360000 }),
    resave: false,
    saveUninitialized: false,
    secret: process.env.SESSION_SECRET
}));

app.use(passport.initialize()); // Initialiser Passport
app.use(passport.session()); // Utiliser Passport avec les sessions

// Middleware pour servir les fichiers statiques
app.use(express.static('public')); // Servir les fichiers statiques depuis le répertoire 'public'

// Routes

// Page d'accueil : afficher toutes les publications
app.get('/', async (req, res) => {
    // Vérifier si l'utilisateur est connecté
    if (!req.session.IsLoggedIn) {
        // Rediriger vers la page de connexion si l'utilisateur n'est pas connecté
        return res.redirect('/connexion');
    }

    const isModerator = (Number(req.user.id_user_type) == 2); // Vérifier si l'utilisateur est un modérateur
    const id_user = Number(req.user.id_user); // Récupérer l'ID de l'utilisateur connecté

    var posts;
    if (!isModerator) {
        posts = await getPosts(id_user); // Récupérer les publications de l'utilisateur
    } else if (isModerator) {
        posts = await getModeratorPosts(); // Récupérer toutes les publications si l'utilisateur est modérateur
    }

    // Rendre la vue 'index' avec les données nécessaires
    res.render('index', {
        titre: 'Accueil | Liste Publications',
        layout: 'main',
        scripts: ['/js/index.js', '/js/main.js'],
        styles: [],
        posts: posts,
        acceptCookie: req.session.acceptCookie,
        IsLoggedIn: req.session.IsLoggedIn,
        LoggedUser: req.user,
        isModerator: isModerator
    });
});

// Supprimer une publication spécifique
app.post('/delete/:id_post/posts', async (req, res) => {
    // Vérifier si l'utilisateur est connecté
    if (!req.session.IsLoggedIn) {
        // Rediriger vers la page de connexion si l'utilisateur n'est pas connecté
        return res.redirect('/connexion');
    }

    const isModerator = (Number(req.user.id_user_type) == 2); // Vérifier si l'utilisateur est un modérateur

    if (isModerator) {
        const { id_post } = req.params; // Récupérer l'ID de la publication à supprimer depuis les paramètres de l'URL
        const postId = Number(id_post);
        await deletePost(postId); // Appeler la fonction pour supprimer la publication
        res.status(201).end(); // Répondre avec un statut 201 (Créé) pour indiquer que la suppression a réussi
    } else {
        return res.redirect('/connexion'); // Rediriger vers la page de connexion si l'utilisateur n'est pas un modérateur
    }
});

// Connexion d'un utilisateur
app.post('/users/login', (req, res, next) => {
    // Vérifier si le courriel et le mot de passe sont valides
    if (validateCourriel(req.body.email) && validateMotDePasse(req.body.password)) {
        // Authentification avec Passport.js
        passport.authenticate('local', (error, user, info) => {
            if (error) {
                next(error); // Passer l'erreur au middleware suivant
            } else if (!user) {
                res.status(401).json(info); // Renvoyer une erreur 401 si la connexion échoue
            } else {
                // Ajouter l'utilisateur à la session et répondre avec un code 200 (OK)
                req.logIn(user, (error) => {
                    if (error) {
                        next(error); // Passer l'erreur au middleware suivant
                    } else {
                        req.session.IsLoggedIn = true;
                        res.sendStatus(200).end(); // Répondre avec un statut 200 (OK)
                    }
                });
            }
        })(req, res, next);
    } else {
        res.sendStatus(400).end(); // Renvoyer une erreur 400 si les données de connexion sont invalides
    }
});

// Déconnexion d'un utilisateur
app.post('/users/logout', (req, res, next) => {
    req.logout((error) => {
        if (error) {
            next(error); // Passer l'erreur au middleware suivant
        } else {
            req.session.IsLoggedIn = false; // Mettre à jour l'état de connexion dans la session
            res.redirect("/connexion"); // Rediriger vers la page de connexion
        }
    });
});

// Page de connexion
app.get('/connexion', async (req, res) => {
    if (req.session.IsLoggedIn) {
        // Rediriger vers la page de / si l'utilisateur est connecté
        return res.redirect('/');
    }
    // Rendre la vue 'authentification' avec les données nécessaires
    res.render('authentification', {
        titre: 'Connectez Vous',
        layout: 'main',
        scripts: ['/js/main.js', '/js/validerconnexion.js'],
        styles: [],
        acceptCookie: req.session.acceptCookie,
        IsLoggedIn: req.session.IsLoggedIn,
        LoggedUser: req.user
    });
});

// Page d'Inscription
app.get('/inscription', async (req, res) => {
    if (req.session.IsLoggedIn) {
        // Rediriger vers la page de / si l'utilisateur est connecté
        return res.redirect('/');
    }
    // Rendre la vue 'enregistrement' avec les données nécessaires
    res.render('enregistrement', {
        titre: 'Enregistez Vous',
        layout: 'main',
        scripts: ['/js/main.js', '/js/validerinscription.js'],
        styles: [],
        acceptCookie: req.session.acceptCookie,
        IsLoggedIn: req.session.IsLoggedIn,
        LoggedUser: req.user
    });
});

// Ajouter un nouvel utilisateur
app.post('/users/add', async (req, res) => {

      // Vérifier si l'utilisateur est connecté
      if (!req.session.IsLoggedIn) {
        // Rediriger vers la page de connexion si l'utilisateur n'est pas connecté
        return res.redirect('/connexion');
    }

    // Récupérer les données du formulaire d'inscription
    const { username, email, password } = req.body;
    const id_user_type = 1; // Définir le type d'utilisateur

    try {
        // Valider les données d'inscription
        if (validateCourriel(email) && validateMotDePasse(password) && validateUsername(username) && validateIdUser(id_user_type)) {
            const lastID = await addUtilisateur(id_user_type, username, email, password); // Appeler la fonction pour ajouter un nouvel utilisateur
            res.status(201).json({ id: lastID }); // Répondre avec un statut 201 (Créé) et l'ID du nouvel utilisateur
        } else {
            res.status(400).end(); // Renvoyer une erreur 400 si les données d'inscription sont invalides
        }
    } catch (erreur) {
        if (erreur.code == 'SQLITE_CONSTRAINT') {
            res.status(409).end(); // Renvoyer une erreur 409 (Conflit) si une contrainte SQLite est violée (email déjà existant)
        } else {
            next(erreur); // Passer l'erreur au middleware suivant en cas d'erreur inattendue
        }
    }
});

// Ajouter une nouvelle publication
app.post('/posts', async (req, res) => {
    // Vérifier si l'utilisateur est connecté
    if (!req.session.IsLoggedIn) {
        // Rediriger vers la page de connexion si l'utilisateur n'est pas connecté
        return res.redirect('/connexion');
    }

    const { text } = req.body; // Récupérer le texte de la publication depuis la requête
    if (validateTexte(text)) {
        const id_user = req.user.id_user; // Récupérer l'ID de l'utilisateur connecté
        const lastID = addPost(id_user, text); // Appeler la fonction pour ajouter une nouvelle publication
        // Rediriger vers la page d'accueil après l'ajout de la publication
        res.status(201).json({ id: lastID }); // Répondre avec un statut 201 (Créé) et l'ID de la nouvelle publication
    } else {
        res.status(400).end(); // Renvoyer une erreur 400 si le texte de la publication est invalide
    }
});

// Rechercher un utilisateur
app.get('/users/search', async (req, res) => {
    // Vérifier si l'utilisateur est connecté
    if (!req.session.IsLoggedIn) {
        // Rediriger vers la page de connexion si l'utilisateur n'est pas connecté
        return res.redirect('/connexion');
    }

    const { q } = req.query; // Récupérer le terme de recherche depuis la requête

    if (validateSearchTexte(q)) {
        // Rendre la vue 'search' avec les résultats de la recherche
        res.render('search', {
            titre: 'Utilisateurs | Rechercher',
            layout: 'main',
            scripts: ['/js/search.js', '/js/main.js'],
            styles: [],
            users: await searchUser(q), // Appeler la fonction pour rechercher les utilisateurs
            acceptCookie: req.session.acceptCookie,
            IsLoggedIn: req.session.IsLoggedIn,
            LoggedUser: req.user
        });
    } else {
        // Rendre la vue 'search' avec une liste vide si le terme de recherche est invalide
        res.render('search', {
            titre: 'Utilisateurs | Rechercher',
            layout: 'main',
            scripts: ['/js/search.js', '/js/main.js'],
            styles: [],
            users: [],
            acceptCookie: req.session.acceptCookie,
            IsLoggedIn: req.session.IsLoggedIn,
            LoggedUser: req.user
        });
    }
});

// Page "À propos de nous"
app.get('/aboutus', (req, res) => {
    // Rendre la vue 'aboutus' avec les données nécessaires
    res.render('aboutus', {
        titre: 'À propos De Nous',
        layout: 'main',
        scripts: ['/js/main.js'],
        styles: [],
        acceptCookie: req.session.acceptCookie,
        IsLoggedIn: req.session.IsLoggedIn,
        LoggedUser: req.user
    });
});

// Page "Nous contacter"
app.get('/contactus', (req, res) => {
    // Rendre la vue 'contactus' avec les données nécessaires
    res.render('contactus', {
        titre: 'Nous Contacter',
        layout: 'main',
        scripts: ['/js/main.js'],
        styles: [],
        acceptCookie: req.session.acceptCookie,
        IsLoggedIn: req.session.IsLoggedIn,
        LoggedUser: req.user
    });
});

// Afficher le profil et les publications d'un utilisateur spécifique
app.get('/users/:id/posts', async (req, res) => {
    // Vérifier si l'utilisateur est connecté
    if (!req.session.IsLoggedIn) {
        // Rediriger vers la page de connexion si l'utilisateur n'est pas connecté
        return res.redirect('/connexion');
    }

    const id = Number(req.params.id); // Récupérer l'ID de l'utilisateur depuis les paramètres d'URL
    const id_user = Number(req.user.id_user); // Récupérer l'ID de l'utilisateur connecté

    const UserIsMe = (id == id_user); // Vérifier si l'utilisateur consulte son propre profil
    const AmIFollowingUser = await isFollowing(id_user, id); // Vérifier si l'utilisateur connecté suit l'utilisateur spécifique

    if (validateIdUser(id)) {
        // Rendre la vue 'user' avec les publications et les informations de l'utilisateur spécifique
        res.render('user', {
            titre: 'Utilisateurs | Liste Publications',
            layout: 'main',
            scripts: ['/js/main.js', '/js/userprofile.js'],
            styles: [],
            posts: await getUserPosts(id), // Appeler la fonction pour récupérer les publications de l'utilisateur spécifique
            user: await getUser(id), // Appeler la fonction pour récupérer les informations de l'utilisateur spécifique
            acceptCookie: req.session.acceptCookie,
            IsLoggedIn: req.session.IsLoggedIn,
            LoggedUser: req.user,
            UserLoggedIsMe: UserIsMe,
            AmIFollowingUser: AmIFollowingUser
        });
    } else {
        res.status(404).end(); // Renvoyer une erreur 404 si l'ID de l'utilisateur est invalide
    }
});

// Activer l'acceptation des cookies
app.post("/api/cookies", (req, res) => {
    req.session.acceptCookie = true; // Mettre à jour l'acceptation des cookies dans la session
    res.status(201).end(); // Répondre avec un statut 201 (Créé)
});

// Suivre un utilisateur
app.post("/users/follow", async (req, res) => {
    // Vérifier si l'utilisateur est connecté
    if (!req.session.IsLoggedIn) {
        // Rediriger vers la page de connexion si l'utilisateur n'est pas connecté
        return res.redirect('/connexion');
    }

    try {
        const id_user = Number(req.user.id_user); // Récupérer l'ID de l'utilisateur connecté
        const id_user_suivis = Number(req.body.id_user_suivis); // Récupérer l'ID de l'utilisateur à suivre depuis la requête

        if (validateIdUser(id_user) && validateIdUser(id_user_suivis)) {
            await addUtilisateurSuivi(id_user, id_user_suivis); // Appeler la fonction pour ajouter l'utilisateur à la liste des suivis
            res.status(201).end(); // Répondre avec un statut 201 (Créé)
        } else {
            res.status(400).end(); // Renvoyer une erreur 400 si les ID d'utilisateurs sont invalides
        }
    } catch (erreur) {
        res.status(400).json({ erreur: erreur }); // Renvoyer une erreur 400 avec un message d'erreur JSON
        next(erreur); // Passer l'erreur au middleware suivant
    }
});

// Ne plus suivre un utilisateur
app.post("/users/unfollow", async (req, res) => {
    // Vérifier si l'utilisateur est connecté
    if (!req.session.IsLoggedIn) {
        // Rediriger vers la page de connexion si l'utilisateur n'est pas connecté
        return res.redirect('/connexion');
    }

    try {
        const id_user = Number(req.user.id_user); // Récupérer l'ID de l'utilisateur connecté
        const id_user_suivis = Number(req.body.id_user_suivis); // Récupérer l'ID de l'utilisateur à ne plus suivre depuis la requête

        if (validateIdUser(id_user) && validateIdUser(id_user_suivis)) {
            await removeUtilisateurSuivi(id_user, id_user_suivis); // Appeler la fonction pour retirer l'utilisateur de la liste des suivis
            res.status(201).end(); // Répondre avec un statut 201 (Créé)
        } else {
            res.status(400).end(); // Renvoyer une erreur 400 si les ID d'utilisateurs sont invalides
        }
    } catch (erreur) {
        res.status(400).json({ erreur: erreur }); // Renvoyer une erreur 400 avec un message d'erreur JSON
        next(erreur); // Passer l'erreur au middleware suivant
    }
});

// Démarrer le serveur
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`); // Afficher un message de confirmation dans la console
    console.log
    ("http://localhost:" + PORT); // Afficher l'URL du serveur dans la console
});

