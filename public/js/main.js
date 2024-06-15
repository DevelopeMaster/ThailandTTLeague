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
    const languageMap = {
        'russian': 'ru',
        'english': 'en',
        'thai': 'th'
    };
    
    let shortLang = languageMap[localStorage.getItem('clientLang')] || 'en';

    if (!window.location.pathname.startsWith(`/${shortLang}`)) {
        let newPath = `/${shortLang}` + window.location.pathname.replace(/^\/(ru|en|th)/, '');
        window.location.href = window.location.origin + newPath;
    }
    
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