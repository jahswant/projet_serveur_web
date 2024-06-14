// Sélection des éléments du DOM
const form = document.getElementById('form-ajout');
const input = document.getElementById('text-ajout');
const inputError = document.getElementById('text-add-error');
const deleteForms = document.querySelectorAll('.delete-form');
const likeForms = document.querySelectorAll('.like-form'); // Select all like forms

// Attente du chargement complet du document pour garantir la disponibilité des éléments
document.addEventListener('DOMContentLoaded', function () {
    // Sélection de tous les formulaires de suppression et ajout d'un écouteur d'événement sur leur soumission
    deleteForms.forEach(form => {
        form.addEventListener('submit', handleDelete);
    });

    // Add event listeners to all like forms
    likeForms.forEach(form => {
        form.addEventListener('submit', handleLike);
    });
});

// Function to handle like submission
async function handleLike(event) {
    // Prevent the default form submission
    event.preventDefault();

    // Get the form that triggered the event
    const form = event.target;

    // Get the post ID from the hidden input field
    const postId = form.querySelector('input[name="postId"]').value;

    try {
        // Send a POST request to increment likes
        const response = await fetch(`/posts/like`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id_post: postId }),
        });

        // Parse response JSON
        const data = await response.json();

        console.log(data);

        // Update like count on success
        if (response.ok) {
            document.getElementById(`likes-count-${postId}`).textContent = data.likes;
        } else {
            // Handle error
            console.error('Failed to increment likes');
        }
    } catch (error) {
        console.error('Error handling like:', error.message);
    }
}

// Function to handle post deletion
async function handleDelete(event) {
    // Prevent the default form submission
    event.preventDefault();

    // Get the form that triggered the event
    const form = event.target;

    // Get the post ID from the hidden input field
    const postId = form.querySelector('input[name="postId"]').value;

    try {
        // Send a POST request to delete the post
        const response = await fetch(`/delete/${postId}/posts`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ postId: postId }),
        });

        // Remove the post from the DOM on success
        if (response.ok) {
            const postElement = document.getElementById(`post-${postId}`);
            if (postElement) {
                postElement.remove();
            }
        } else {
            // Handle error
            console.error('Failed to delete post');
        }
    } catch (error) {
        console.error('Error handling delete:', error.message);
    }
}

// Rest of your existing code for adding posts, validation, etc.


// Fonction pour valider le champ de texte avant l'ajout d'un post
function validateTextAdd() {
    if (input.validity.valid) {
        inputError.innerText = ''; // Efface le message d'erreur s'il y en a un
    } else {
        // Affiche un message d'erreur approprié en fonction de la validation HTML5
        if (input.validity.valueMissing) {
            inputError.innerText = 'Le champ de texte est requis.';
        } else if (input.validity.tooShort) {
            inputError.innerText = 'Le champ de texte doit avoir au moins 1 caractère.';
        } else if (input.validity.tooLong) {
            inputError.innerText = 'Le champ de texte ne peut pas dépasser 100 caractères.';
        }
    }
}

// Fonction pour ajouter un post sur le serveur et rafraîchir les données du formulaire
async function addPostToServeur(event) {
    // Empêcher le rafraîchissement automatique de la page
    event.preventDefault();

    // Vérifier si le formulaire est valide avant de continuer
    if (!form.checkValidity()) {
        return;
    }

    // Préparer les données à envoyer au serveur
    const data = {
        text: input.value // Récupérer le texte du champ de texte
    };

    // Effectuer une requête POST pour ajouter le post au serveur
    const response = await fetch('/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });

    // Si l'ajout est réussi, vider le champ de texte, le mettre en focus et recharger la page
    if (response.ok) {
        input.value = ''; // Vider le champ de texte
        input.focus(); // Mettre le focus sur le champ de texte
        document.location.reload(); // Recharger la page pour afficher le nouveau post
    }
}

// Ajouter un écouteur d'événement pour la soumission du formulaire d'ajout de post
form.addEventListener('submit', addPostToServeur);

// Ajouter des écouteurs d'événement pour la validation du formulaire avant soumission
form.addEventListener('submit', validateTextAdd);
input.addEventListener('input', validateTextAdd); // Vérifier à chaque changement dans le champ de texte
