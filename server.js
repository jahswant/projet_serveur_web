// Loading configuration file
import "dotenv/config";

// Imports
import express, { json } from "express";
import helmet from "helmet";
import compression from "compression";
import cors from "cors";


// Creating the web server
const app = express();

// Adding middleware
app.use(helmet()); // Enhances security headers
app.use(compression()); // Compresses responses
app.use(cors()); // Enables Cross-Origin Resource Sharing (CORS)
app.use(json()); // Parses incoming JSON payloads
app.use(express.static("public")); // Serves static files from the "public" 

// Waiting for routes.


// Starting the server
app.listen(process.env.PORT); // Listens on the port specified in the environment variable
console.log("Server started");
console.log("http://localhost:" + process.env.PORT); // Logs the server URL

