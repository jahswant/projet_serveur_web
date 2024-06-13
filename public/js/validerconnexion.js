// Récupération des éléments du formulaire et de ses champs
let inputCourriel = document.getElementById('input-courriel');
let inputMotDePasse = document.getElementById('input-mot-de-passe');
let formConnexion = document.getElementById('form-connexion');

// Écouteur d'événement pour le formulaire de connexion
formConnexion.addEventListener("submit", async function (event) {
    let isValid = true; // Flag pour vérifier la validité du formulaire

    // Validation du mot de passe
    if (!validatePassword()) {
        isValid = false;
    }

    // Validation de l'adresse email
    if (!validateEmail()) {
        isValid = false;
    }

    if (!isValid) {
        event.preventDefault(); // Empêche l'envoi du formulaire si les validations échouent
    } else {
        event.preventDefault(); // Empêche l'envoi par défaut du formulaire

        // Préparation des données à envoyer
        const data = {
            email: inputCourriel.value,
            password: inputMotDePasse.value
        };

        try {
            // Requête POST asynchrone pour la connexion utilisateur
            const response = await fetch('/users/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            // Si la requête est réussie
            if (response.ok) {
                // Réinitialisation des champs du formulaire
                inputCourriel.value = '';
                inputMotDePasse.value = '';
                // Redirection vers la page d'accueil
                window.location.replace("/");
            } else if (response.status === 401) {
                // En cas d'erreur d'authentification, récupérer le message d'erreur
                let responseData = await response.json();
                console.error('Server error:', responseData);
                // Affichage d'une alerte avec le message d'erreur
                window.alert("Une erreur est survenue pendant la connexion : " + responseData.error);
            } else {
                // En cas d'autres erreurs de réponse, afficher le statut textuel de l'erreur
                window.alert("Une erreur est survenue pendant la connexion : " + response.statusText);
                console.error('Server error:', response.statusText);
            }
        } catch (error) {
            // En cas d'erreur lors de la requête fetch
            console.error('Fetch error:', error);
        }
    }
});

// Fonction de validation de l'adresse email
function validateEmail() {
    const emailValue = inputCourriel.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Expression régulière pour vérifier le format d'email
    if (!emailRegex.test(emailValue)) {
        showError(inputCourriel, "Veuillez entrer une adresse email valide.");
        return false;
    }
    hideError(inputCourriel);
    return true;
}

// Fonction de validation du mot de passe
function validatePassword() {
    const passwordValue = inputMotDePasse.value.trim();
    if (passwordValue.length < 6) {
        showError(inputMotDePasse, "Le mot de passe doit contenir au moins 6 caractères.");
        return false;
    }
    hideError(inputMotDePasse);
    return true;
}

// Fonction pour afficher un message d'erreur sous un champ
function showError(input, message) {
    const formControl = input.parentElement; // Récupère le conteneur parent du champ
    const errorElement = formControl.querySelector("small"); // Sélectionne l'élément small pour afficher le message d'erreur
    errorElement.innerText = message; // Définit le texte du message d'erreur
    formControl.classList.add("error"); // Ajoute une classe pour indiquer visuellement une erreur
}

// Fonction pour masquer le message d'erreur
function hideError(input) {
    const formControl = input.parentElement; // Récupère le conteneur parent du champ
    formControl.classList.remove("error"); // Supprime la classe d'erreur pour masquer le message
}
