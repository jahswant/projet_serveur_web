import express, { json } from 'express';
import "dotenv/config";
import routes from './router.js';
import { engine } from 'express-handlebars';
import helmet from 'helmet';
import compression from 'compression';
import cors from 'cors';


const app = express();
const PORT = process.env.PORT || 5000;

// Configurer Handlebars
//https://stackoverflow.com/questions/32707322/how-to-make-a-handlebars-helper-global-in-expressjs
app.engine('.hbs', engine({
    extname: '.hbs',
    helpers: {
        formatDate: (timestamp) => {
            const date = new Date(timestamp * 1000);
            return date.toLocaleString();
        }
    }
}));

app.set('view engine', '.hbs');
app.set('views', './views');

// Middleware pour parser les requêtes
app.use(json()); // Parses incoming JSON payloads

app.use(express.urlencoded({ extended: true }));

// Middleware pour sécurité
app.use(helmet()); // Enhances security headers

// Middleware pour compression
app.use(compression()); // Compresses responses

// Middleware pour CORS
app.use(cors()); // Enables Cross-Origin Resource Sharing (CORS)

// Middleware pour servir les fichiers statiques
app.use(express.static('public'));

// Routes
app.use('/', routes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log("http://localhost:" + PORT); // Logs the server URL
});
