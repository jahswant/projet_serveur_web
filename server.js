import express, { json } from 'express'; // Importer express et le middleware json
import "dotenv/config"; // Charger les variables d'environnement depuis un fichier .env
import routes from './router.js'; // Importer les routes définies dans router.js
import { engine } from 'express-handlebars'; // Importer le moteur de templates express-handlebars
import helmet from 'helmet'; // Importer helmet pour la sécurité
import compression from 'compression'; // Importer compression pour la compression des réponses
import cors from 'cors'; // Importer cors pour le partage des ressources entre origines

const app = express(); // Créer une instance d'application express
const PORT = process.env.PORT || 5000; // Définir le port sur lequel le serveur écoutera, en utilisant une variable d'environnement ou le port 5000 par défaut

// Configurer Handlebars comme moteur de templates
app.engine('.hbs', engine({
    extname: '.hbs', // Utiliser l'extension .hbs pour les fichiers de templates
    helpers: {
        formatDate: (timestamp) => {
            const date = new Date(timestamp * 1000); // Convertir le timestamp en millisecondes
            return date.toLocaleString(); // Retourner la date au format local
        }
    }
}));

app.set('view engine', '.hbs'); // Définir Handlebars comme moteur de templates
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
app.use('/', routes); // Utiliser les routes définies dans router.js

// Démarrer le serveur
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`); // Afficher un message de confirmation dans la console
    console.log("http://localhost:" + PORT); // Afficher l'URL du serveur
});
