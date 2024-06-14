// Middleware pour vérifier si un utilisateur est connecté
export function estConnecte(req, res, next) {
    // Vérifie si req.user est défini, ce qui signifie que l'utilisateur est connecté
    if(req.user) {
        // Si l'utilisateur est connecté, passe à la prochaine étape du middleware
        next();
    }
    else {
        // Si l'utilisateur n'est pas connecté
        // Vérifie si la méthode de la requête est GET
        if(req.method === 'GET') {
            // Si la méthode est GET, renvoie une réponse de redirection vers la page de connexion avec le statut 401 (Non autorisé)
            res.status(401).redirect('/connexion');
        }
        else {
            // Si la méthode n'est pas GET, renvoie une réponse avec le statut 401 (Non autorisé) sans redirection
            res.status(401).end();
        }
    }
}

// Middleware pour vérifier si un utilisateur est un modérateur
export function estModerateur(req, res, next) {
    // Vérifie si l'id du type d'utilisateur dans req.user est supérieur ou égal à 2, ce qui signifie que l'utilisateur est un modérateur
    if(req.user.id_user_type >= 2) {
        // Si l'utilisateur est un modérateur, passe à la prochaine étape du middleware
        next();
    }
    else {
        // Si l'utilisateur n'est pas un modérateur, renvoie une réponse avec le statut 403 (Interdit)
        res.status(403).end();
    }
}
