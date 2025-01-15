import { checkSession, getUserData, createSoftHeader, createHeader, createFooter, getAllClubs, showErrorModal, getAllCoaches, listenerOfButtons, btnGoUp, languageControl, controlTextAreaCoach, fetchCities, fetchAdvertisements, breadCrumb } from './modules.js';
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

document.addEventListener('DOMContentLoaded', async function() {
    createSoftHeader(localStorage.getItem('clientLang') || 'english');
    // createFooter(localStorage.getItem('clientLang') || 'english');
    const userId = document.querySelector('.startTournament').dataset.userid;
    const tournamentId = document.querySelector('.startTournament').dataset.tournamentid;
    // const userType = document.querySelector('.soft').dataset.usertype;
    // console.log(userId, userType);
    initializeApp();
    // btnGoUp();
    
    languageControl();

    listenerOfButtons();

    const currentPath = window.location.pathname;

    const parts = currentPath.split('/');
    const lang = parts[1];
    const clubId = userId;

    let tournaments;
    console.log('user:', userId, 'tournament:', tournamentId );

});