const form = document.getElementById('form-ajout');
const input = document.getElementById('text-ajout');
const inputError = document.getElementById('text-add-error');

/**
 * Valide le champ de texte pour ajouter un poste.
 */
function validateTextAdd() {
    if (input.validity.valid) {
        inputError.innerText = '';
    }
    else {
        if (input.validity.valueMissing) {
            inputError.innerText = 'Le champ de texte est requis.';
        }
        else if (input.validity.tooShort) {
            inputError.innerText = 'Le champ de texte doit avoir au moins 1 caractères.';
        }
        else if (input.validity.tooLong) {
            inputError.innerText = 'Le champ de texte doit avoir au maximum 100 caractères.';
        }
    }
}

/**
 * Ajoute un poste sur le serveur et rafraichit
 * des données entrées dans le formulaire.
 * @param {Event} event 
 */
async function addPostToServeur(event) {
    // Prévient le rafraîchissement automatique de la page
    event.preventDefault();

    // Regarder si le formulaire est valide
    if (!form.checkValidity()) {
        return;
    }

    // Préparation des données
    const data = {
        text: input.value
    }

    // Requête d'ajout de post au serveur
    const response = await fetch('/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });

    // Ajoute le todo dans l'interface graphique et réinitialise le formulaire
    if (response.ok) {
        input.value = '';
        input.focus();
        document.location.reload();
    }
}


// Ajoute le listener pour la soumission du formulaire
form.addEventListener('submit', addPostToServeur);

// Ajoute les listeners pour la validation du formulaire
form.addEventListener('submit', validateTextAdd);
input.addEventListener('input', validateTextAdd);


