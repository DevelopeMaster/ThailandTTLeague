import { createHeader, createFooter, getAllTournaments, getAllClubs, showErrorModal, getAllCoaches, listenerOfButtons, btnGoUp, languageControl, controlTextAreaCoach, fetchCities, fetchAdvertisements, breadCrumb } from './modules.js';
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
    createHeader(localStorage.getItem('clientLang') || 'english');
    createFooter(localStorage.getItem('clientLang') || 'english');
    initializeApp();

    btnGoUp();
    
    languageControl();

    breadCrumb();

    const topBlockAdv = document.querySelector('.filterTournaments_filter');
    fetchAdvertisements(topBlockAdv);

    listenerOfButtons();

    getAllTournaments();




    // getAllClubs();
    // getAllCoaches();

    // const dateFromInput = document.getElementById('dateFromInput');
    // const dateUntilInput = document.getElementById('dateUntilInput');
    // // const searchButton = document.getElementById('filterCoaches');

    // formatInputDate(dateFromInput);
    // formatInputDate(dateUntilInput);

    // searchButton.addEventListener('click', function (event) {
    //     if (!validateDates()) {
    //         event.preventDefault();
    //     }
    // });

    // function formatInputDate(input) {
    //     input.addEventListener('input', function (e) {
    //         let value = e.target.value.replace(/\D/g, '');
    //         if (value.length > 2 && value.length <= 4) {
    //             value = value.replace(/^(\d{2})(\d{1,2})$/, '$1.$2');
    //         } else if (value.length > 4) {
    //             value = value.replace(/^(\d{2})(\d{2})(\d{1,4})$/, '$1.$2.$3');
    //         }
    //         e.target.value = value;
    //     });
    // }
    
    // function validateDates() {
    //     const dateFromInput = document.getElementById('dateFromInput');
    //     const dateUntilInput = document.getElementById('dateUntilInput');
    
    //     const dateFromParts = dateFromInput.value.split('.');
    //     const dateUntilParts = dateUntilInput.value.split('.');
    
    //     const dateFrom = new Date(`${dateFromParts[2]}-${dateFromParts[1]}-${dateFromParts[0]}`);
    //     const dateUntil = new Date(`${dateUntilParts[2]}-${dateUntilParts[1]}-${dateUntilParts[0]}`);
    
    //     if (dateFrom > dateUntil) {
    //         alert('The "From" date cannot be later than the "Until" date.');
    //         return false;
    //     }
    //     return true;
    // }



    
    
    
    
    


});

