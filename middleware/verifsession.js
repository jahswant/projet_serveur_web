export function estConnecte(req, res, next) {
    if(req.user) {
        next();
    }
    else {
        if(req.method === 'GET') {
            res.status(401).redirect('/connexion');
        }
        else {
            res.status(401).end();
        }
    }
}

export function estModerateur(req, res, next) {
    if(req.user.id_user_type >= 2) {
        next();
    }
    else {
        res.status(403).end();
    }
}