import connectionPromise from '../connexion.js';
import bcrypt from 'bcrypt';

export async function addUtilisateur(id_user_type,username,email,password){
    const db = await connectionPromise;
    let user_password = await bcrypt.hash(password, 10);
      const res = await db.run(
        `INSERT INTO users(id_user_type,name,email,password)
          VALUES(?,?,?,?)`,
        [id_user_type,username,email,user_password]
    )

    return res.lastID;
}

export async function getUtilisateurParCourriel(email){
    const db = await connectionPromise;
    const utilisateur = db.get(
        `SELECT *
        FROM users where email = ?`,
        [email]
    )
return utilisateur;

}

export async function getUtilisateurParID(idUser){
    const db = await connectionPromise;
    const utilisateur = await db.get(
        `SELECT *
        FROM users where id_user = ?`,
        [idUser]
    )
return utilisateur;
}


