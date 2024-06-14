// Sélection des éléments du DOM
const formsearch = document.getElementById('form-search'); // Formulaire de recherche
const inputsearch = document.getElementById('text-search'); // Champ de texte de recherche
const inputSearchError = document.getElementById('text-search-error'); // Élément pour afficher les messages d'erreur de recherche

/**
 * Valide le champ de texte pour la recherche.
 */
function validateTextSearch() {
    if (inputsearch.validity.valid) {
        inputSearchError.innerText = ''; // Efface le message d'erreur s'il y en a un
    }
    else {
        // Affiche un message d'erreur approprié en fonction de la validation HTML5
        if (inputsearch.validity.valueMissing) {
            inputSearchError.innerText = 'Le champ de texte est requis.';
        }
        else if (inputsearch.validity.tooShort) {
            inputSearchError.innerText = 'Le champ de texte doit avoir au moins 5 caractères.';
        }
        else if (inputsearch.validity.tooLong) {
            inputSearchError.innerText = 'Le champ de texte ne peut pas dépasser 100 caractères.';
        }
    }
}

// Ajoute un écouteur d'événement pour la soumission du formulaire de recherche
formsearch.addEventListener('submit', (event) => {
    validateTextSearch(); // Valide le champ de texte avant la soumission
    if (!inputsearch.validity.valid) {
        event.preventDefault(); // Empêche la soumission du formulaire si le champ de texte est invalide
    }
});

// Ajoute un écouteur d'événement pour vérifier la validation du champ de texte à chaque changement
inputsearch.addEventListener('input', validateTextSearch);
