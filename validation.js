/**
 * Valide l'identifiant du todo reçu par le client.
 * @param {*} idUser L'identifiant du todo à valider.
 * @returns Une valeur indiquant si l'identifiant user est valide ou non.
 */
export function validateIdUser(idUser) {
    return !!idUser &&
        typeof idUser === 'number' &&
        idUser > 0;
}

/**
 * Valide le texte du poste reçu par le client.
 * @param {*} texte Le texte du poste à valider.
 * @returns Une valeur indiquant si le texte est valide ou non.
 */
export function validateTexte(texte) {
    return !!texte &&
        typeof texte === 'string' &&
        texte.length >= 10 &&
        texte.length <= 100;
}


export function validateSearchTexte(texte) {
    return !!texte &&
        typeof texte === 'string' &&
        texte.length >= 1 &&
        texte.length <= 20;
}


export function validateNumber(value) {
    if (typeof value === 'number' && isFinite(value)) {
        return true;
    } else {
        return false;
    }
}
