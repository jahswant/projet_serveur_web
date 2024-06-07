let inputCourriel = document.getElementById('input-courriel');
let inputMotDePasse = document.getElementById('input-mot-de-passe');
let formConnexion = document.getElementById('form-connexion');

formConnexion.addEventListener('submit', async (event) => {
    
    let isValid = true;

    if (!validatePassword()) {
        isValid = false;
    }

    if (!validateEmail()) {
        isValid = false;
    }

    if (!isValid) {
        event.preventDefault();
    }else if (isValid) {

        event.preventDefault();

        // Préparation des données
        const data = {
            email: inputCourriel.value,
            password : inputMotDePasse.value
        };

    // Requête d'ajout de todo au serveur
    const response = await fetch('/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    
    // Ajoute le todo dans l'interface graphique et réinitialise le formulaire
    if(response.ok) {
        const value = await response.json();
        inputCourriel.value = '';
        inputMotDePasse.value = '';
        window.location.replace("/");
        
    }
    else if(response.status === 401) {
        // Si l'authentification ne réussi pas, on
        // a le message d'erreur dans l'objet "data"
        let data = await response.json()
        
        // Utiliser "data" pour afficher l'erreur ;a
        // l'utilisateur ici ...
    }
    }

});


function validateEmail() {
    const emailValue = inputCourriel.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailValue)) {
        showError(inputCourriel, "Veuillez entrer une adresse email valide.");
        return false;
    }
    hideError(inputCourriel);
    return true;
}

function validatePassword() {
    const passwordValue = inputMotDePasse.value.trim();
    if (passwordValue.length < 6) {
        showError(inputMotDePasse, "Le mot de passe doit contenir au moins 6 caractères.");
        return false;
    }
    hideError(inputMotDePasse);
    return true;
}