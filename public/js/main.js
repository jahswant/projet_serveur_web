// Sélection des éléments du DOM
const buttonCookie = document.getElementById("button-cookie"); // Bouton pour accepter les cookies
const baniereCookies = document.getElementById("baniere-cookies"); // Bannière de consentement aux cookies

// Fonction asynchrone pour accepter les cookies
async function acceptCookies() {
    // Effectuer une requête POST vers l'API /api/cookies lorsque l'utilisateur accepte les cookies
    const response = await fetch("/api/cookies", {
        method: "POST" // Méthode POST pour envoyer la décision d'acceptation
    });

    // Vérifier si la requête a réussi (status 200-299)
    if (response.ok) {
        baniereCookies.remove(); // Supprimer la bannière de cookies une fois acceptée
    }
}

// Vérifier si le bouton de cookies existe dans le DOM
if (buttonCookie) {
    // Ajouter un écouteur d'événement sur le clic du bouton de cookies pour appeler la fonction acceptCookies
    buttonCookie.addEventListener("click", acceptCookies);
}
