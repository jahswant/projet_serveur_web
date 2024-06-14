import connectionPromise from '../connexion.js';
import bcrypt from 'bcrypt';

/**
 * Ajoute un nouvel utilisateur dans la base de données.
 * @param {number} id_user_type L'identifiant du type d'utilisateur.
 * @param {string} username Le nom d'utilisateur.
 * @param {string} email L'adresse email de l'utilisateur.
 * @param {string} password Le mot de passe de l'utilisateur (en clair).
 * @returns {number} L'identifiant de l'utilisateur ajouté.
 */
export async function addUtilisateur(id_user_type, username, email, password) {
    const db = await connectionPromise;
    // Hasher le mot de passe avec bcrypt avant de l'insérer dans la base de données
    const user_password = await bcrypt.hash(password, 10);
    // Exécuter la requête SQL pour insérer un nouvel utilisateur
    const res = await db.run(
        `INSERT INTO users(id_user_type, name, email, password)
         VALUES (?, ?, ?, ?)`,
        [id_user_type, username, email, user_password]
    );
    return res.lastID; // Retourner l'identifiant de l'utilisateur ajouté
}

/**
 * Récupère un utilisateur à partir de son adresse email.
 * @param {string} email L'adresse email de l'utilisateur à rechercher.
 * @returns {Object} Les informations de l'utilisateur trouvé.
 */
export async function getUtilisateurParCourriel(email) {
    const db = await connectionPromise;
    // Exécuter la requête SQL pour récupérer un utilisateur par son adresse email
    const utilisateur = await db.get(
        `SELECT *
         FROM users 
         WHERE email = ?`,
        [email]
    );
    return utilisateur;
}

/**
 * Récupère un utilisateur à partir de son identifiant.
 * @param {number} idUser L'identifiant de l'utilisateur à rechercher.
 * @returns {Object} Les informations de l'utilisateur trouvé.
 */
export async function getUtilisateurParID(idUser) {
    const db = await connectionPromise;
    // Exécuter la requête SQL pour récupérer un utilisateur par son identifiant
    const utilisateur = await db.get(
        `SELECT *
         FROM users 
         WHERE id_user = ?`,
        [idUser]
    );
    return utilisateur;
}

/**
 * Ajoute un utilisateur à la liste des utilisateurs suivis par un autre utilisateur.
 * @param {number} id_user L'identifiant de l'utilisateur qui suit.
 * @param {number} id_user_suivis L'identifiant de l'utilisateur suivi.
 */
export async function addUtilisateurSuivi(id_user, id_user_suivis) {
    const db = await connectionPromise;
    // Exécuter la requête SQL pour ajouter un utilisateur suivi
    await db.run(
        `INSERT INTO suivis(id_user, id_user_suivis)
         VALUES (?, ?)`,
        [id_user, id_user_suivis]
    );
}

/**
 * Supprime un utilisateur de la liste des utilisateurs suivis par un autre utilisateur.
 * @param {number} id_user L'identifiant de l'utilisateur qui suit.
 * @param {number} id_user_suivis L'identifiant de l'utilisateur suivi.
 */
export async function removeUtilisateurSuivi(id_user, id_user_suivis) {
    const db = await connectionPromise;
    // Exécuter la requête SQL pour supprimer un utilisateur suivi
    await db.run(
        `DELETE FROM suivis
         WHERE id_user = ? AND id_user_suivis = ?`,
        [id_user, id_user_suivis]
    );
}

/**
 * Vérifie si un utilisateur suit un autre utilisateur.
 * @param {number} follower_id L'identifiant de l'utilisateur qui suit.
 * @param {number} followed_id L'identifiant de l'utilisateur suivi.
 * @returns {boolean} true si l'utilisateur suit l'autre, sinon false.
 */
export async function isFollowing(follower_id, followed_id) {
    const id_user = Number(follower_id);
    const id_user_suivis = Number(followed_id);

    const connexion = await connectionPromise;
    // Exécuter la requête SQL pour vérifier si l'utilisateur suit l'autre utilisateur
    const result = await connexion.get(
        `SELECT * 
         FROM suivis 
         WHERE id_user = ? AND id_user_suivis = ?`,
        [id_user, id_user_suivis]
    );

    return !!result; // Retourner true si l'utilisateur suit l'autre, sinon false
}
