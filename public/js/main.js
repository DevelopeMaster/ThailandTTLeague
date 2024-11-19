import { createHeader, createFooter, registrationForm, loginForm, restoreAccesForm, listenerOfButtons, btnGoUp, languageControl, fetchCities, fetchAdvertisements, fetchPastTournaments, fetchFutureTournaments, fetchClub, fetchCoaches } from './modules.js';

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
    const urlParams = new URLSearchParams(window.location.search);
    const loginRequired = urlParams.get('loginRequired');
    
    const setLang = {
        'en': 'english',
        'ru': 'russian',
        'th': 'thai'
    };
    const language = window.location.pathname.match(/^\/(en|ru|th)/)?.[1] || 'en';
    localStorage.setItem('clientLang', setLang[language]);

    if (loginRequired === 'true') {
        // Открываем модальное окно логина
        setTimeout(loginForm, 200);

        // Убираем параметр из URL, чтобы не оставался после действия
        const newUrl = window.location.pathname;
        window.history.replaceState({}, document.title, newUrl);
    }

    createHeader(localStorage.getItem('clientLang') || 'english');
    createFooter(localStorage.getItem('clientLang') || 'english');
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

    const tournamentsElement = document.querySelector('.upcommingTable');
    fetchAdvertisements(tournamentsElement);

    // listeners of buttons
    listenerOfButtons();


    
});