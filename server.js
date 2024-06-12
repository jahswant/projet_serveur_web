import express, { json } from 'express'; // Importer express et le middleware json
import "dotenv/config"; // Charger les variables d'environnement depuis un fichier .env
import { engine } from 'express-handlebars'; // Importer le moteur de templates express-handlebars
import session from 'express-session';
import memorystore from 'memorystore'
import helmet from 'helmet'; // Importer helmet pour la sécurité
import compression from 'compression'; // Importer compression pour la compression des réponses
import cors from 'cors'; // Importer cors pour le partage des ressources entre origines
import passport from "passport";
import { getPosts, addPost } from './model/posts.js';
import { getUser, getUserPosts, searchUser } from './model/users.js';
import { validateIdUser, validateTexte, validateCourriel, validateSearchTexte, validateMotDePasse, validateUsername } from './validation.js'
import { addUtilisateur } from "./model/utilisateurs.js"
import './passportconfig.js'


const MemoryStore = memorystore(session);

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


app.use(session({
    cookie: { maxAge: 360000 },
    name: process.env.npm_package_name,
    store: new MemoryStore({ checkPeriod: 360000 }),
    resave: false,
    saveUninitialized: false,
    secret: process.env.SESSION_SECRET
}));

app.use(passport.initialize());

app.use(passport.session());

// Middleware pour servir les fichiers statiques
app.use(express.static('public')); // Servir les fichiers statiques depuis le répertoire 'public'


// Routes
// Page d'accueil : afficher toutes les publications
app.get('/', async (req, res) => {
    // Check if user is logged in
    if (!req.session.loggedIn) {
        // Redirect user to login page
        return res.redirect('/connexion');
    }

    res.render('index', {
        titre: 'Accueil | Liste Publications',
        layout: 'main',
        scripts: ['/js/index.js', '/js/main.js'],
        styles: [],
        posts: await getPosts(),
        acceptCookie: req.session.acceptCookie,
        IsLoggedIn : req.session.IsLoggedIn
    });
});


app.post('/users/login', (req, res, next) => {


    // On vérifie le le courriel et le mot de passe
    // envoyé sont valides
    if (validateCourriel(req.body.email) &&
        validateMotDePasse(req.body.password)) {
        // On lance l'authentification avec passport.js
        passport.authenticate('local', (error, user, info) => {
            if (error) {
                // S'il y a une erreur, on la passe
                // au serveur
                next(error);
            }
            else if (!user) {
                // Si la connexion échoue, on envoit
                // l'information au client avec un code
                // 401 (Unauthorized)
                res.status(401).json(info);
            }
            else {
                // Si tout fonctionne, on ajoute
                // l'utilisateur dans la session et
                // on retourne un code 200 (OK)
                req.logIn(user, (error) => {
                    if (error) {
                        next(error);
                    }
                    else{
                        req.session.loggedIn = true;
                        res.sendStatus(200).end();
                    }                   
                });
            }
        })(req, res, next);
    }
    else {
        res.sendStatus(400).end();
    }
});

app.post('/users/logout', (req, res, next) => {
    req.logout((erreur) =>{
        if (erreur){
            next(erreur);
        } else {
            req.session.loggedIn = false;
            res.redirect("/connexion");
        }
       
    });
});


// Page de connexion
app.get('/connexion', async (req, res) => {

 

    res.render('authentification', {
        titre: 'Connectez Vous',
        layout: 'main',
        scripts: ['/js/main.js', '/js/validerconnexion.js'],
        styles: [],
        acceptCookie: req.session.acceptCookie,
        IsLoggedIn : req.session.IsLoggedIn
    });

});

// Page d'Inscription
app.get('/inscription', async (req, res) => {

  

    res.render('enregistrement', {

        titre: 'Enregistez Vous',
        layout: 'main',
        scripts: ['/js/main.js', '/js/validerinscription.js'],
        styles: [],
        acceptCookie: req.session.acceptCookie,
        IsLoggedIn : req.session.IsLoggedIn
    });

});

// Ajouter un nouvel utilisateur
app.post('/users/add', async (req, res) => {
    
    console.log(req.body); // Récupérer le texte de la publication depuis la requête
    const { id_user_type, username, email, password } = req.body;

    try {
        if (validateCourriel(email) &&
            validateMotDePasse(password) &&
            validateUsername(username) &&
            validateIdUser(id_user_type)
        ) {
            const lastID = await addUtilisateur(id_user_type, username, email, password);
            res.status(201).json({ id: lastID });
        } else {
            res.status(400).end();
        }
    } catch (erreur) {
        if (erreur.code == 'SQLITE_CONSTRAINT'){
            res.status(409).end();
        } else {
            next(erreur);
        }

    }

});




// Ajouter une nouvelle publication
app.post('/posts', async (req, res) => {

// Check if user is logged in
if (!req.session.loggedIn) {
    // Redirect user to login page
    return res.redirect('/connexion');
}


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


    // Check if user is logged in
    if (!req.session.loggedIn) {
        // Redirect user to login page
        return res.redirect('/connexion');
    }

    const { q } = req.query; // Récupérer le terme de recherche depuis la requête

    if (validateSearchTexte(q)) {

        res.render('search', {
            titre: 'Utilisateurs | Rechercher',
            layout: 'main',
            scripts: ['/js/search.js', '/js/main.js'],
            styles: [],
            users: await searchUser(q),
            acceptCookie: req.session.acceptCookie,
            IsLoggedIn : req.session.IsLoggedIn
        });
    } else {

        res.render('search', {
            titre: 'Utilisateurs | Rechercher',
            layout: 'main',
            scripts: ['/js/search.js', '/js/main.js'],
            styles: [],
            users: [],
            acceptCookie: req.session.acceptCookie,
            IsLoggedIn : req.session.IsLoggedIn
        });
    }

});

app.get('/aboutus', (req, res) => {

    res.render('aboutus', {
        titre: 'Apropos De Nous',
        layout: 'main',
        scripts: ['/js/main.js'],
        styles: [],
        acceptCookie: req.session.acceptCookie,
        IsLoggedIn : req.session.IsLoggedIn
    });

});


app.get('/contactus', (req, res) => {

    res.render('contactus', {
        titre: 'Nous Contacter',
        layout: 'main',
        scripts: ['/js/main.js'],
        styles: [],
        acceptCookie: req.session.acceptCookie,
        IsLoggedIn : req.session.IsLoggedIn
    });

});

// Afficher le profil et les publications d'un utilisateur spécifique
app.get('/users/:id/posts', async (req, res) => {

    // Check if user is logged in
    if (!req.session.loggedIn) {
        // Redirect user to login page
        return res.redirect('/connexion');
    }


    const id = Number(req.params.id);

    if (validateIdUser(id)) {

        res.render('user', {
            titre: 'Utilisateurs | Liste Publications',
            layout: 'main',
            scripts: ['/js/main.js','/js/userprofile.js'],
            styles: [],
            posts: await getUserPosts(id),
            user: await getUser(id),
            acceptCookie: req.session.acceptCookie,
            IsLoggedIn : req.session.IsLoggedIn
        });
    }
    else {
        res.status(404).end();
    }
});

//Routes des cookies
app.post("/api/cookies", (req, res) => {
    req.session.acceptCookie = true;
    res.status(201).end();
});

// Démarrer le serveur
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`); // Afficher un message de confirmation dans la console
    console.log("http://localhost:" + PORT); // Afficher l'URL du serveur
});
