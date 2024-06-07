const formsearch = document.getElementById('form-search');
const inputsearch = document.getElementById('text-search');
const inputSearchError = document.getElementById('text-search-error');


/**
 * Valide le champ de texte pour ajouter un poste.
 */
function validateTextSearch() {
    if (inputsearch.validity.valid) {
        inputSearchError.innerText = '';
    }
    else {
        if (inputsearch.validity.valueMissing) {
            inputSearchError.innerText = 'Le champ de texte est requis.';
        }
        else if (inputsearch.validity.tooShort) {
            inputSearchError.innerText = 'Le champ de texte doit avoir au moins 5 caractères.';
        }
        else if (inputsearch.validity.tooLong) {
            inputSearchError.innerText = 'Le champ de texte doit avoir au maximum 100 caractères.';
        }
    }
}

// Add listeners for form validation
formsearch.addEventListener('submit', (event) => {
    validateTextSearch();
    if (!inputsearch.validity.valid) {
        event.preventDefault(); // Prevent form submission if the input is invalid
    }
});
inputsearch.addEventListener('input', validateTextSearch);

