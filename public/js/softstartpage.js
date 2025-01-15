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
    const userId = document.querySelector('.chooseTournament').dataset.userid;
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
    // let clubCity;

    const translations = {
        'en': {
            'tournament': 'Tournament',
        },
        'ru': {
            'tournament': 'Турнир',
        },
        'th': {
            'tournament': 'การแข่งขัน',
        }
    };

    function getTranslation(key) {
        return translations[lang][key] || translations['en'][key];
    }

    async function fetchClubsTournaments() {
        try {
            const response = await fetch(`/tournaments-by-club/${clubId}`);
            if (!response.ok) {
                throw new Error('Club not found');
            }
            tournaments = await response.json();
            console.log(tournaments);

            renderTournaments(tournaments);

        } catch (error) {
            console.error('Error fetching club data:', error);
        }
    }

    fetchClubsTournaments();

    function renderTournaments(tournaments) {
        const container = document.querySelector('.chooseTournament_wrapp');
    
        // Очистка контейнера перед рендерингом (на случай повторного вызова)
        container.innerHTML = '';
    
        tournaments.forEach((tournament) => {
            // Форматируем дату и время
            const tournamentDate = new Date(tournament.datetime);
            const formattedDate = tournamentDate.toLocaleDateString('en-GB', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
            }).replace(/\//g, '.');
            const formattedTime = tournamentDate.toLocaleTimeString('en-GB', {
                hour: '2-digit',
                minute: '2-digit',
            });
    
            console.log(`/${lang}/soft/tournament/${tournament._id}`);
            // Создаем карточку турнира
            const card = document.createElement('a');
            card.setAttribute('href', `/${lang}/soft/tournament/${clubId}/${tournament._id}`);
            card.classList.add('chooseTournament_wrapp_item');
    
            card.innerHTML = `
                <h3>${tournament.name || getTranslation('tournament')}</h3>
                <h4>${formattedTime} ${formattedDate}</h4>
            `;
    
            // Добавляем карточку в контейнер
            container.appendChild(card);
        });
    }

    const createTournamentBtn = document.querySelector('#createTournament');
    // const newTournament = document.querySelector('#createTournament');
    // console.log(createTournamentBtn);
    createTournamentBtn.addEventListener('click', (e) => {
        console.log(`/${lang}/createTournament/${userId}`);
        e.preventDefault();
        e.stopPropagation();
        window.location.href = `/${lang}/createTournament/${userId}`;
    });

    

    // async function fetchClubData() {
    //     try {
    //         const response = await fetch(`/get-data-club?lang=${lang}&clubId=${clubId}`);
    //         if (!response.ok) {
    //             throw new Error('Club not found');
    //         }
    //         club = await response.json();
    //         clubCity = await getCityName(club.city);
    //         if (club.logo) {
    //             localStorage.setItem('userLogo', club.logo);
    //         } else {
    //             localStorage.setItem('userLogo', 'icons/clubslogo/default_avatar.svg');
    //         }
            

    //         // console.log(clubName);  
    //         renderClubData();
    //         // renderScheduleTable(club);
    //         // renderMobileScheduleTable(club);
    //         renderTableBasedOnScreenSize(club);

    //         const upcomingBlock = document.querySelector('.upcommingTable_content');
    //         displayFutureTournaments(club.name, club.logo, upcomingBlock);

    //     } catch (error) {
    //         console.error('Error fetching club data:', error);
    //     }
    // }

    // const headerBottom = document.querySelector('.header_bottom_pc');
    // headerBottom.style = 'display: none';
});