// Récupération des éléments du formulaire et de ses champs
const form = document.getElementById("forminscription");
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const confirmPasswordInput = document.getElementById("confirmpassword");

// Écouteur d'événement pour la soumission du formulaire
form.addEventListener("submit", async function (event) {
    let isValid = true; // Flag pour vérifier la validité du formulaire

    // Validation du nom
    if (!validateName()) {
        isValid = false;
    }

    // Validation de l'adresse email
    if (!validateEmail()) {
        isValid = false;
    }

    // Validation du mot de passe
    if (!validatePassword()) {
        isValid = false;
    }

    // Validation de la confirmation du mot de passe
    if (!validateConfirmPassword()) {
        isValid = false;
    }

    if (!isValid) {
        event.preventDefault(); // Empêche l'envoi du formulaire si les validations échouent
    } else {
        event.preventDefault(); // Empêche l'envoi par défaut du formulaire

        // Préparation des données à envoyer
        const data = {
            username: nameInput.value,
            email: emailInput.value,
            password: passwordInput.value,
        };

        try {
            // Requête POST asynchrone pour l'ajout d'utilisateur
            const response = await fetch('/users/add', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            // Si la requête est réussie
            if (response.ok) {
                const value = await response.json(); // Récupère éventuellement des données de réponse
                // Réinitialisation des champs du formulaire
                nameInput.value = '';
                passwordInput.value = '';
                confirmPasswordInput.value = '';
                emailInput.value = '';
                // Redirection vers la page de connexion avec une alerte de succès
                window.location.replace("/connexion");
                window.alert("Compte créé avec succès. Vous pouvez maintenant vous connecter !");
            }
        } catch (error) {
            console.error('Fetch error:', error); // Affiche les erreurs liées à la requête fetch
        }
    }
});

// Fonction de validation du nom d'utilisateur
function validateName() {
    const nameValue = nameInput.value.trim();
    if (nameValue === "") {
        showError(nameInput, "Veuillez entrer votre nom.");
        return false;
    }
    hideError(nameInput);
    return true;
}

// Fonction de validation de l'adresse email
function validateEmail() {
    const emailValue = emailInput.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Expression régulière pour vérifier le format d'email
    if (!emailRegex.test(emailValue)) {
        showError(emailInput, "Veuillez entrer une adresse email valide.");
        return false;
    }
    hideError(emailInput);
    return true;
}

// Fonction de validation du mot de passe
function validatePassword() {
    const passwordValue = passwordInput.value.trim();
    if (passwordValue.length < 6) {
        showError(passwordInput, "Le mot de passe doit contenir au moins 6 caractères.");
        return false;
    }
    hideError(passwordInput);
    return true;
}

// Fonction de validation de la confirmation du mot de passe
function validateConfirmPassword() {
    const confirmPasswordValue = confirmPasswordInput.value.trim();
    const passwordValue = passwordInput.value.trim();
    if (confirmPasswordValue !== passwordValue) {
        showError(confirmPasswordInput, "Les mots de passe ne correspondent pas.");
        return false;
    }
    hideError(confirmPasswordInput);
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
