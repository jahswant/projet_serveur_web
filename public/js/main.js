const buttonCookie = document.getElementById("button-cookie");
const baniereCookies = document.getElementById("baniere-cookies");

const menuAcceuil = document.getElementById("menu-acceuil");
const menuUtilisateur = document.getElementById("menu-utilisateur");
const menuApropos = document.getElementById("menu-apropos");
const menuConnexion = document.getElementById("menu-connexion");
const menuInscription = document.getElementById("menu-inscription");
const menuContacter = document.getElementById("menu-contacter");

async function acceptCookies(){
   const rep = await fetch("/api/cookies",{
        method :"POST"
    });
    
    if (rep.ok){
        baniereCookies.remove(); 
    }
}

if(buttonCookie){
    buttonCookie.addEventListener("click",acceptCookies);
}
