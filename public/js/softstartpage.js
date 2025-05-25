import { checkSession, getUserData, createSoftHeader, createHeader, createFooter, getAllClubs, showErrorModal, getAllCoaches, listenerOfButtons, btnGoUp, languageControl, controlTextAreaCoach, fetchCities, fetchAdvertisements, breadCrumb } from './versioned-modules.js';
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
                throw new Error('Tournaments is not found');
            }
            tournaments = await response.json();
            // console.log(tournaments);
            if (tournaments) {
                renderTournaments(tournaments);
            }
            // renderTournaments(tournaments);

        } catch (error) {
            console.log('Error fetching tournaments:', error);
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
    
            // console.log(`/${lang}/soft/tournament/${tournament._id}`);
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




    
    function renderTournamentForm() {
        document.body.style = 'overflow-y: hidden';
        const modal = document.querySelector('#createTournamentModal');
        modal.style.display = 'block'; // Показываем модальное окно
    
        // Добавляем обработчик события для отправки формы
        const form = document.getElementById('addTournamentForm');
        form.addEventListener('submit', async (event) => {
            event.preventDefault();
        
            const formData = new FormData(form);
            const tournamentData = Object.fromEntries(formData.entries());

            // Получение данных о дате и времени из формы
            const date = formData.get('tournamentdate'); // Формат YYYY-MM-DD
            const time = formData.get('tournamenttime'); // Формат HH:MM

            // Создание объекта полной даты
            const datetime = new Date(`${date}T${time}:00Z`); // Объединяем дату и время

            // Добавление даты и времени в данные формы
            // formData.append('date', datetime.toISOString());
            // formData.append('datetime', datetime.toISOString());
            tournamentData.date = datetime.toISOString();
            tournamentData.datetime = datetime.toISOString();
        
            // Добавляем дополнительные данные
            tournamentData.language = lang; // текущий язык
            tournamentData.clubId = clubId; // ID клуба
        
            // Преобразуем дату в ISO-формат, если это необходимо
            if (tournamentData.date) {
                tournamentData.date = new Date(tournamentData.date).toISOString();
            }
        
            // Преобразуем цену в число
            if (tournamentData.price) {
                tournamentData.price = parseFloat(tournamentData.price);
            }
            if (tournamentData.ratingLimit) {
                tournamentData.ratingLimit = parseFloat(tournamentData.price);
            }
        
            console.log('Tournament Data:', tournamentData);
        
            // Отправка данных на сервер
            try {
                const response = await fetch('/createTournament', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(tournamentData),
                });
        
                if (!response.ok) {
                    const error = await response.json();
                    throw new Error(error.message || 'Failed to create tournament');
                }
        
                const result = await response.json();
                console.log('Tournament created:', result);
        
                // Закрываем модальное окно
                closeModal();
                window.location.href = `/${lang}/soft/tournament/${clubId}/${result.tournamentId}`;
            } catch (error) {
                console.error('Error creating tournament:', error);
            }
        });
    
        // Закрытие модального окна при клике вне его содержимого
        modal.addEventListener('click', (event) => {
            if (event.target === modal) {
                closeModal();
            }
        });
    
        // // Функция для закрытия модального окна
        function closeModal() {
            modal.style.display = 'none'; // Показываем модальное окно
            document.body.style = 'overflow-y: auto';
            // modalContent.innerHTML = '';
        }
    }
    
    // Кнопка для открытия модального окна
    const createTournamentBtn = document.querySelector('#createTournamentSoft');
    createTournamentBtn.classList.add('open-modal-btn');
    
    createTournamentBtn.addEventListener('click', renderTournamentForm);
    
    // Добавляем кнопку в DOM
    
    

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
    // document.querySelector('#myProfile').addEventListener('click', (e) => {
    //     e.target.preventDefault();
    //     window.location.href = `${lang}/dashboard/club/${clubId}`;
    // });

    // document.querySelector('#editClubProfile').addEventListener('click', (e) => {
    //     e.target.preventDefault();
    //     window.location.href = `${lang}/dashboard/editclub/${clubId}`;
    // })
});