let inputCourriel = document.getElementById('input-courriel');
let inputMotDePasse = document.getElementById('input-mot-de-passe');
let formConnexion = document.getElementById('form-connexion');

formConnexion.addEventListener("submit", async function (event) {
    let isValid = true;

    if (!validatePassword()) {
        isValid = false;
    }

    if (!validateEmail()) {
        isValid = false;
    }

    if (!isValid) {
        event.preventDefault();
    } else {
        event.preventDefault();

        // Préparation des données
        const data = {
            email: inputCourriel.value,
            password: inputMotDePasse.value
        };

        try {
            // Requête d'ajout de todo au serveur
            const response = await fetch('/users/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            // Ajoute le todo dans l'interface graphique et réinitialise le formulaire
            if (response.ok) {
                inputCourriel.value = '';
                inputMotDePasse.value = '';
                window.location.replace("/");
            } else if (response.status === 401) {
                // Si l'authentification ne réussit pas, on a le message d'erreur dans l'objet "data"
                let repdata = await response.json();
                // Utiliser "data" pour afficher l'erreur à l'utilisateur ici ...
                console.error('Server error:', repdata);
                window.alert("Une Erruere est sourvenue pendant la connexion : ",repdata.error);
            } else {
                // Autres erreurs de réponse
                window.alert("Une Erruere est sourvenue pendant la connexion : ",response.statusText);
                console.error('Server error:', response.statusText);
            }
        } catch (error) {
            console.error('Fetch error:', error);
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

function showError(input, message) {
    const formControl = input.parentElement;
    const errorElement = formControl.querySelector("small");
    errorElement.innerText = message;
    formControl.classList.add("error");
}

function hideError(input) {
    const formControl = input.parentElement;
    formControl.classList.remove("error");
}
