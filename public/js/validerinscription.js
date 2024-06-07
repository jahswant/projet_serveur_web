const form = document.getElementById("forminscription");
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const confirmPasswordInput = document.getElementById("confirmpassword");

form.addEventListener("submit", async function  (event) {
    let isValid = true;

    if (!validateName()) {
        isValid = false;
    }

    if (!validateEmail()) {
        isValid = false;
    }

    if (!validatePassword()) {
        isValid = false;
    }

    if (!validateConfirmPassword()) {
        isValid = false;
    }

    if (!isValid) {
        event.preventDefault();
    }else if (isValid) {

        event.preventDefault();

        // Préparation des données
    const data = {
        id_user_type  : "regular",
        username : nameInput.value,
        email : emailInput.value,
        password : passwordInput.value,
    }

    // Requête d'ajout de todo au serveur
    const response = await fetch('/users/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    
    // Ajoute le todo dans l'interface graphique et réinitialise le formulaire
    if(response.ok) {
        const value = await response.json();
        nameInput.value = '';
        passwordInput.value = '';
        confirmPasswordInput.value = '';
        emailInput.value = '';
        window.location.replace("/connexion");
        window.alert("Compte Crée Avec Success. Vous Pouvez Vous Connecter !");
    }
    }



});

function validateName() {
    const nameValue = nameInput.value.trim();
    if (nameValue === "") {
        showError(nameInput, "Veuillez entrer votre nom.");
        return false;
    }
    hideError(nameInput);
    return true;
}

function validateEmail() {
    const emailValue = emailInput.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailValue)) {
        showError(emailInput, "Veuillez entrer une adresse email valide.");
        return false;
    }
    hideError(emailInput);
    return true;
}

function validatePassword() {
    const passwordValue = passwordInput.value.trim();
    if (passwordValue.length < 6) {
        showError(passwordInput, "Le mot de passe doit contenir au moins 6 caractères.");
        return false;
    }
    hideError(passwordInput);
    return true;
}

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
