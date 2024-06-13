// Sélection des éléments du DOM
const form = document.getElementById('form-ajout');
const input = document.getElementById('text-ajout');
const inputError = document.getElementById('text-add-error');
const deleteForms = document.querySelectorAll('.delete-form');

// Attente du chargement complet du document pour garantir la disponibilité des éléments
document.addEventListener('DOMContentLoaded', function () {
    // Sélection de tous les formulaires de suppression et ajout d'un écouteur d'événement sur leur soumission
    const deleteForms = document.querySelectorAll('.delete-form');
    deleteForms.forEach(form => {
        form.addEventListener('submit', handleDelete);
    });
});

// Fonction pour gérer la suppression d'un post
async function handleDelete(event) {
    // Empêcher la soumission par défaut du formulaire
    event.preventDefault();

    // Récupérer le formulaire qui a déclenché l'événement
    const form = event.target;

    // Récupérer l'identifiant du post à supprimer depuis le champ input caché
    const postId = form.querySelector('input[name="postId"]').value;

    // Exemple de gestion de la suppression via AJAX
    const response = await fetch(`/delete/${postId}/posts`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ postId: postId })
    });

    // Afficher dans la console la réponse reçue
    console.log(response);

    // Si la suppression a réussi, supprimer l'élément du DOM correspondant au post
    if (response.ok) {
        const postElement = document.getElementById(`post-${postId}`);
        if (postElement) {
            postElement.remove();
        }
    } else {
        // En cas d'échec, afficher une alerte à l'utilisateur
        window.alert('Une erreur est survenue pendant la suppression du poste.');
    }
}

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
