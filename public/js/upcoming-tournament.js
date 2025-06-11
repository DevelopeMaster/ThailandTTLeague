// import { createHeader, createFooter, getAllClubs, showErrorModal, getAllCoaches, listenerOfButtons, btnGoUp, languageControl, controlTextAreaCoach, fetchCities, fetchAdvertisements, breadCrumb } from './modules.js';
import { createHeader, createFooter, getAllClubs, showErrorModal, getAllCoaches, listenerOfButtons, btnGoUp, languageControl, controlTextAreaCoach, fetchCities, fetchAdvertisements, breadCrumb } from '/js/versioned-modules.js';
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

    listenerOfButtons();


    const topBlockAdv = document.querySelector('.tournament');
    fetchAdvertisements(topBlockAdv);

    const currentPath = window.location.pathname;
    const parts = currentPath.split('/');
    const lang = parts[1];
    const tournamentId = parts[3];
    let tournament;
    let allPlayers;

    const translations = {
        en: {
            peopleRegistered: "people registered",
            awardTitle: "Prizes and awards",
            cancelRegistration: "Cancel registration",
            cancelRegistrationNotif: 'You have withdrawn from the tournament',
            successfulRegistrationNotif: 'You have successfully registered for the tournament'
        },
        ru: {
            peopleRegistered: "человек заявлено",
            awardTitle: "Призовой фонд",
            cancelRegistration: "Отказаться от участия",
            cancelRegistrationNotif: 'Вы отказались от участия в турнире',
            successfulRegistrationNotif: 'Вы успешно зарегистрировались на турнир!'
        },
        th: {
            peopleRegistered: "คนลงทะเบียน",
            awardTitle: "ของรางวัล",
            cancelRegistration: "ยกเลิกการเข้าร่วม",
            cancelRegistrationNotif: 'คุณได้ถอนตัวจากการแข่งขันแล้ว',
            successfulRegistrationNotif: 'คุณลงทะเบียนเข้าร่วมการแข่งขันเรียบร้อยแล้ว!'
        }
    };

    await fetchTournamentData();

    let currentUserId = null; // ID текущего пользователя
    const singUpToTournamentBtn = document.querySelector('#singUpToTournamentBtn');
    const cancelRegistrationBtn = document.createElement('button');
    cancelRegistrationBtn.id = 'cancelRegistrationBtn';
    cancelRegistrationBtn.className = 'header_btn-sign singUpToTournament';
    cancelRegistrationBtn.textContent = `${translations[lang].cancelRegistration}`;
    cancelRegistrationBtn.style.display = 'none'; // Изначально скрыта

    // Добавляем кнопку "Отказаться" рядом с кнопкой "Зарегистрироваться"
    singUpToTournamentBtn.parentNode.insertBefore(cancelRegistrationBtn, singUpToTournamentBtn.nextSibling);

    async function checkUserAuth() {
        try {
            const response = await fetch('/api/check-auth', {
                method: 'GET',
                credentials: 'include'
            });
            if (!response.ok) {
                console.log('none auth');
            }
            if (response.ok) {
                const userData = await response.json();
                console.log(userData);
                currentUserId = userData.userId;
                updateButtonVisibility();
            } else {
                singUpToTournamentBtn.style.display = 'none';
            }
        } catch (error) {
            console.log('Ошибка при проверке авторизации:', error);
        }
    }

    // function updateButtonVisibility() {
    //     const isRegistered = tournament.players.some(player => player._id === currentUserId);
    //     const isRetired = tournament.retiredPlayers.some(player => player._id === currentUserId);

    //     if (isRetired) {
    //         singUpToTournamentBtn.style.display = 'none'; // Не показываем кнопку для выбывших игроков
    //     } else if (isRegistered) {
    //         singUpToTournamentBtn.style.display = 'none';
    //         cancelRegistrationBtn.style.display = 'block'; // Показываем кнопку "Отказаться"
    //     } else {
    //         singUpToTournamentBtn.style.display = 'block';
    //         cancelRegistrationBtn.style.display = 'none'; // Скрываем кнопку "Отказаться"
    //     }
    // }

    function updateButtonVisibility() {
        // Проверяем наличие массива игроков и выбывших
        const players = Array.isArray(tournament.players) ? tournament.players : [];
        const retiredPlayers = Array.isArray(tournament.retiredPlayers) ? tournament.retiredPlayers : [];
    
        const isRegistered = players.some(player => player.id === currentUserId);
        const isRetired = retiredPlayers.some(player => player.id === currentUserId);
    
        // console.log('allPlayers', allPlayers);
        // Получаем рейтинг текущего игрока
        const currentPlayer = allPlayers.find(p => p._id === currentUserId);
        const currentRating = currentPlayer?.rating || 0;
        // console.log('currentRating', currentRating);
        // Получаем лимит рейтинга из поля input
        const ratingLimit = tournament.ratingLimit || tournament.restrictions;
        // console.log('ratingLimit', ratingLimit);

        // Проверяем, проходит ли игрок по рейтингу
        const isRatingAllowed = currentRating <= ratingLimit;
        // if (!isRegistered && !isRetired) {
        //     singUpToTournamentBtn.style.display = 'none';
        //     cancelRegistrationBtn.style.display = 'none';
        //     return; // Завершаем выполнение функции
        // }
    
        if (isRetired || !isRatingAllowed) {
            singUpToTournamentBtn.style.display = 'none'; // Не показываем кнопку для выбывших игроков
        } else if (isRegistered) {
            singUpToTournamentBtn.style.display = 'none';
            cancelRegistrationBtn.style.display = 'block'; // Показываем кнопку "Отказаться"
        } else {
            singUpToTournamentBtn.style.display = 'block';
            cancelRegistrationBtn.style.display = 'none'; // Скрываем кнопку "Отказаться"
        }
    }
    

    // Инициализируем проверку авторизации при загрузке страницы
    await checkUserAuth();

    // Обработчик для кнопки "Зарегистрироваться"
    singUpToTournamentBtn.addEventListener('click', async () => {
        try {
            // if (currentUserId && !tournament.players?.some(player => player.id === currentUserId)) {
            //     tournament.players.push({ id: currentUserId });
            if (
                currentUserId &&
                (!Array.isArray(tournament.players) || !tournament.players.some(player => player.id === currentUserId))
              ) {
                  // Инициализируем массив, если он пустой
                  if (!Array.isArray(tournament.players)) {
                      tournament.players = [];
                  }
              
                  tournament.players.push({ id: currentUserId });
              

                await fetch(`/api/tournaments/${tournament._id}/register-player`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ playerId: currentUserId })
                });

                showErrorModal(`${translations[lang].successfulRegistrationNotif}`, '!!!');
                // alert('Вы успешно зарегистрировались на турнир!');
                updateButtonVisibility(); // Обновляем видимость кнопок
                renderListsOfPlayers();
            }
        } catch (error) {
            console.error('Ошибка при регистрации на турнир:', error);
            alert('Произошла ошибка, попробуйте снова позже.');
        }
    });

    // Обработчик для кнопки "Отказаться"
    cancelRegistrationBtn.addEventListener('click', async () => {
        try {
            if (currentUserId && tournament.players.some(player => player.id === currentUserId)) {
                tournament.players = tournament.players.filter(player => player.id !== currentUserId);

                await fetch(`/api/tournaments/${tournament._id}/unregister-player`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ playerId: currentUserId })
                });

                showErrorModal(`${translations[lang].cancelRegistrationNotif}`, '!!!');
                // alert('Вы отказались от участия в турнире.');
                updateButtonVisibility(); // Обновляем видимость кнопок
                renderListsOfPlayers(currentUserId);

            }
        } catch (error) {
            console.error('Ошибка при отказе от участия:', error);
            alert('Error. Please try again later.');
        }
    });

      

    async function fetchTournamentData() {
        try {
            const response = await fetch(`/get-data-tournament?tournamentId=${tournamentId}`);
            if (!response.ok) {
                throw new Error('Tournament not found');
            }
            tournament = await response.json();
            await fetchAllPlayers();
            renderTournamentData();
            renderMap();
        } catch (error) {
            console.error('Error fetching tournament data:', error);
        }
    }

    async function fetchAllPlayers() {
        try {
            const response = await fetch(`/get-players-coaches`);
            const players = await response.json();
            allPlayers = players;
        } catch (error) {
            console.error('Произошла ошибка:', error);
            showErrorModal('Database connection error', 'Ops!');
        }
    }
    

    function formatDate(date) {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
        const year = date.getFullYear();
        return `${day}.${month}.${year}`;
    }

    function renderTournamentData() {
        const date = new Date(tournament.datetime);
        const formattedDate = formatDate(date);

        console.log("tournament.phoneNumber", tournament);

        const [dateTourn, time] = tournament.datetime.split('T');
        // Обрезаем время до часов и минут
        const formattedTime = time.substring(0, 5);
        // const localeTimeString = date.toLocaleTimeString(lang, { hour: '2-digit', minute: '2-digit' });
        document.getElementById('tournamentDate').textContent = formattedDate;
        // document.getElementById('tournamentDate').textContent = new Date(tournament.datetime).toLocaleDateString(lang);
        document.getElementById('tournamentLogo').style.backgroundImage = `url(${tournament.club.logo})`;
        document.getElementById('tournamentName').textContent = tournament.club.name;
        // document.getElementById('registeredPlayers').textContent = `${tournament.players.length} people registered`;

        // document.getElementById('registeredPlayers').textContent = `${tournament.players.length} ${translations[lang].peopleRegistered}`;
        // количество зарегистрированных людей на русском языке
        const registeredPlayersText = getRegisteredPlayersText(tournament.players ? tournament.players.length : 0, lang);
        document.getElementById('registeredPlayers').textContent = `${tournament.players ? tournament.players.length : 0} ${registeredPlayersText}`;

        document.getElementById('restrictionStatus').style.backgroundColor = 'rgb(0, 112, 38)';
        document.getElementById('restrictionStatus').innerHTML = `<div class="restriction">${tournament.restrictions || tournament.ratingLimit}</div>`;
        // document.getElementById('tournamentStart').textContent = new Date(tournament.datetime).toLocaleTimeString(lang, { hour: '2-digit', minute: '2-digit' });
        document.getElementById('tournamentStart').textContent = formattedTime;
        // document.getElementById('tournamentCity').textContent = tournament.address[lang] || tournament.address['en'];
        const cityName = (tournament.address[lang] || tournament.address['en']).split(',')[0];
        document.getElementById('tournamentCity').textContent = cityName;
        document.getElementById('tournamentContacts').textContent = tournament.contact || tournament.phoneNumber || '-';
        document.getElementById('tournamentContacts').href = `tel:${tournament.contact || tournament.phoneNumber || ''}`;
        document.getElementById('tournamentContribution').textContent = `${tournament.contribution}฿`;

        const prizesTable = document.getElementById('prizesTable');
        prizesTable.innerHTML = '';
        prizesTable.innerHTML = `<h3>${translations[lang].awardTitle}</h3>`;
        // tournament.prizes[lang].forEach(prize => {
            const prizeElement = document.createElement('div');
            prizeElement.className = 'prizes_table_award';
            prizeElement.style = "white-space: pre-wrap;";
            prizeElement.textContent = tournament.prizes[lang];
            prizesTable.appendChild(prizeElement);
        // });

        renderListsOfPlayers();

        
        

    }

    function renderListsOfPlayers(addedRetiredPlayer) {
        const registeredPlayersList = document.getElementById('registeredPlayersList');
        registeredPlayersList.innerHTML = '';
        if (!tournament.players || tournament.players.length === 0) {
            // const noPlayersMessage = document.createElement('div');
            // noPlayersMessage.className = 'no-players-message';
            // noPlayersMessage.textContent = 'No registered players.';
            // registeredPlayersList.appendChild(noPlayersMessage);
            console.log('нет зарегистрированных игроков');
        } else {
            // console.log(tournament.players);
            // console.log(allPlayers);
            tournament.players.forEach((playerObj, index) => {
                const player = allPlayers.find(p => p._id === playerObj.id);
                // console.log('player', player);
                if (player) { // Проверяем, найден ли игрок
                    const playerElement = document.createElement('div');
                    playerElement.className = 'upcomingTournament_table_player';
                    playerElement.innerHTML = `
                        <div class="upcomingTournament_number">${index + 1}</div>
                        <div class="cell upcomingTournament_player">
                            <div class="playerLogo" style="border-radius: 50%; background-image: url('${player.logo}'); background-position: 50%; background-size: cover; background-repeat: no-repeat;"></div>
                            <span>${player.name || player.fullname}</span>
                        </div>
                        <div class="cell upcomingTournament_rating">${Math.round(player.rating) || '-'}</div>
                    `;
                    registeredPlayersList.appendChild(playerElement);
                }
            });
        }

        const retiredPlayersList = document.getElementById('retiredPlayersList');
        retiredPlayersList.innerHTML = '';

        if (addedRetiredPlayer) {
            tournament.retiredPlayers.push({ id: addedRetiredPlayer });
            singUpToTournamentBtn.style.display = 'none';
        }
        // Проверяем, определён ли массив и есть ли в нём элементы
        if (Array.isArray(tournament.retiredPlayers) && tournament.retiredPlayers.length > 0) {
            tournament.retiredPlayers.forEach((playerObj, index) => {
                const player = allPlayers.find(p => p._id === playerObj.id);
                if (player) { // Проверяем, найден ли игрок
                    const playerElement = document.createElement('div');
                    playerElement.className = 'upcomingTournament_table_player';
                    playerElement.innerHTML = `
                        <div class="upcomingTournament_number">${index + 1}</div>
                        <div class="cell upcomingTournament_player">
                            <div class="playerLogo" style="background-image: url('${player.logo}'); border-radius: 50%; background-position: 50%; background-size: cover; background-repeat: no-repeat;"></div>
                            <span>${player.name || player.fullname}</span>
                        </div>
                        <div class="cell upcomingTournament_rating">${Math.round(player.rating) || '-'}</div>
                    `;
                    retiredPlayersList.appendChild(playerElement);
                }
            });
        } else {
            console.log('No retired players found');
        }
    }

    function renderMap() {
        const mapElement = document.getElementById('mapTournament');
        if (!mapElement) return;

        const map = L.map('mapTournament').setView([tournament.location[0], tournament.location[1]], 15);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        L.marker([tournament.location[0], tournament.location[1]]).addTo(map)
            // .bindPopup(`${tournament.address[lang] || tournament.address['en']}`)
            .bindPopup(`${tournament.club.name}`)
            .openPopup();
    }

    function getRegisteredPlayersText(count, lang) {
        if (lang === 'ru') {
            if (count === 1) {
                return "человек заявлен";
            } else if (count >= 2 && count <= 4) {
                return "человека заявлено";
            } else {
                return "человек заявлено";
            }
        } else {
            return translations[lang].peopleRegistered;
        }
    }

    

    


    // const singUpToTournamentBtn = document.querySelector('#singUpToTournamentBtn');
    // singUpToTournamentBtn.addEventListener('click', async () => {
    //     try {
    //         // Отправляем запрос на проверку авторизации пользователя
    //         const response = await fetch('/api/check-auth', {
    //             method: 'GET',
    //             credentials: 'include' // Включаем cookies для авторизации
    //         });
    
    //         if (response.ok) {
    //             // Пользователь авторизован, получаем его данные
    //             const userData = await response.json();
    //             const userId = userData.userId;
    
    //             // Добавляем userId в список зарегистрированных игроков, если его там нет
    //             if (!tournament.players.some(player => player._id === userId)) {
    //                 tournament.players.push({ _id: userId });
    //             }
    
    //             // Обновляем список зарегистрированных игроков на сервере
    //             await fetch(`/api/tournaments/${tournament._id}/register-player`, {
    //                 method: 'POST',
    //                 headers: {
    //                     'Content-Type': 'application/json'
    //                 },
    //                 body: JSON.stringify({ playerId: userId })
    //             });
    
    //             alert('Вы успешно зарегистрировались на турнир!');
    //         } else {
    //             // Если пользователь не авторизован, показываем модальное окно
    //             showErrorModal('Пожалуйста, войдите в систему, чтобы зарегистрироваться на турнир.', '!!!');
    //         }
    //     } catch (error) {
    //         console.error('Ошибка при регистрации на турнир:', error);
    //         alert('Произошла ошибка, попробуйте снова позже.');
    //     }
    // });
    

});