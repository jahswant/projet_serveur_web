// Sélection des éléments du DOM
var followForm = document.getElementById('followForm'); // Formulaire de suivi
var followButton = document.getElementById('followButton'); // Bouton de suivi
var userIdInput = document.getElementById('userId'); // Champ d'entrée pour l'ID de l'utilisateur à suivre

// Écouteur d'événement pour la soumission du formulaire de suivi
followForm.addEventListener("submit", async function (event) {
    event.preventDefault(); // Empêche la soumission par défaut du formulaire

    var userId = userIdInput.value; // Récupère l'ID de l'utilisateur à suivre depuis le champ d'entrée
    await toggleFollow(userId); // Appelle la fonction pour suivre ou ne plus suivre cet utilisateur
});

// Fonction asynchrone pour basculer entre suivre et ne plus suivre un utilisateur
async function toggleFollow(userId) {
    if (followButton.innerText === 'Follow') { // Si le bouton affiche "Follow"
        followButton.innerText = 'Unfollow'; // Change le texte du bouton à "Unfollow"
        await followUser(userId); // Appelle la fonction pour suivre l'utilisateur avec l'ID spécifié
    } else { // Sinon, si le bouton affiche "Unfollow"
        followButton.innerText = 'Follow'; // Change le texte du bouton à "Follow"
        await unfollowUser(userId); // Appelle la fonction pour ne plus suivre l'utilisateur avec l'ID spécifié
    }
}

// Fonction asynchrone pour suivre un utilisateur
async function followUser(userId) {
    try {
        // Prépare les données à envoyer
        const data = {
            id_user_suivis: userId // ID de l'utilisateur à suivre
        };

        // Effectue une requête POST vers l'URL '/users/follow' avec les données JSON
        const response = await fetch('/users/follow', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        // Si la requête est réussie (status 200-299)
        if (response.ok) {
            console.log("Success"); // Affiche un message de succès dans la console
        } else if (response.status === 400) {
            // Si la validation échoue (par exemple, données incorrectes), récupère l'objet JSON de la réponse
            let repdata = await response.json();
            console.error('Server error:', repdata); // Affiche l'erreur serveur dans la console
            window.alert("Une erreur est survenue pendant la connexion : " + repdata.error); // Affiche l'erreur à l'utilisateur
        } else {
            // Pour d'autres erreurs de réponse HTTP
            window.alert("Une erreur est survenue pendant la connexion : " + response.statusText); // Affiche l'erreur à l'utilisateur
            console.error('Server error:', response.statusText); // Affiche l'erreur serveur dans la console
        }
    } catch (error) {
        console.error('Fetch error:', error); // Affiche l'erreur de fetch dans la console
    }
}

// Fonction asynchrone pour ne plus suivre un utilisateur
async function unfollowUser(userId) {
    try {
        // Prépare les données à envoyer
        const data = {
            id_user_suivis: userId // ID de l'utilisateur à ne plus suivre
        };

        // Effectue une requête POST vers l'URL '/users/unfollow' avec les données JSON
        const response = await fetch('/users/unfollow', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        // Si la requête est réussie (status 200-299)
        if (response.ok) {
            console.log("Success"); // Affiche un message de succès dans la console
        } else if (response.status === 400) {
            // Si la validation échoue (par exemple, données incorrectes), récupère l'objet JSON de la réponse
            let repdata = await response.json();
            console.error('Server error:', repdata); // Affiche l'erreur serveur dans la console
            window.alert("Une erreur est survenue pendant la connexion : " + repdata.error); // Affiche l'erreur à l'utilisateur
        } else {
            // Pour d'autres erreurs de réponse HTTP
            window.alert("Une erreur est survenue pendant la connexion : " + response.statusText); // Affiche l'erreur à l'utilisateur
            console.error('Server error:', response.statusText); // Affiche l'erreur serveur dans la console
        }
    } catch (error) {
        console.error('Fetch error:', error); // Affiche l'erreur de fetch dans la console
    }
}
