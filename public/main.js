import { registrationForm, loginForm, restoreAccesForm, listenerOfButtons, btnGoUp, languageControl, fetchCities, fetchAdvertisements, fetchPastTournaments, fetchFutureTournaments, fetchClub, fetchCoaches } from './modules.js';

//----------- important -----------//
window.onload = function() {
    if (!localStorage.getItem('clientLang')) {
        localStorage.setItem('clientLang', 'english');
    }
};
let language = localStorage.getItem('clientLang') || 'english';
async function initializeApp() {
    await fetchCities(language);
}
//----------- important -----------//

document.addEventListener('DOMContentLoaded', function() {
    initializeApp();

    btnGoUp();
    
    languageControl();

    fetchPastTournaments();
   
    fetchFutureTournaments();

    fetchClub();
    
    fetchCoaches();

    const tournamentsElement = document.querySelector('.tournaments');
    fetchAdvertisements(tournamentsElement);

    // listeners of buttons
    listenerOfButtons();

    
});