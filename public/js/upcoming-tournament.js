import { createHeader, createFooter, getAllClubs, showErrorModal, getAllCoaches, listenerOfButtons, btnGoUp, languageControl, controlTextAreaCoach, fetchCities, fetchAdvertisements, breadCrumb } from './modules.js';
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

    // const currentPath = window.location.pathname;

    // const parts = currentPath.split('/');
    // const lang = parts[1];
    // const tournamentId = parts[3];

    // console.log(lang, tournamentId);
    // let tournament;

    // async function fetchTournamentData() {
    //     try {
    //         const response = await fetch(`/get-data-tournament?lang=${lang}&tournamentId=${tournamentId}`);
    //         if (!response.ok) {
    //             throw new Error('Tournament not found');
    //         }
    //         tournament = await response.json();
    //         // clubCity = await getCityName(club.city);
    //         console.log(tournament)
    //         // renderClubData();
    //     } catch (error) {
    //         console.error('Error fetching tournament data:', error);
    //     }
    //     renderMap();
    // }
    // fetchTournamentData();

    // function renderMap() {
    //     const mapElement = document.getElementById('mapTournament');
    //     if (!mapElement) return;

    //     const map = L.map('mapTournament').setView([tournament.location[0], tournament.location[1]], 15);

    //     L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    //         attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    //     }).addTo(map);

    //     L.marker([tournament.location[0], tournament.location[1]]).addTo(map)
    //         .bindPopup(`${tournament.address[lang] || tournament.address['en']}`)
    //         .openPopup();
    // }


    const currentPath = window.location.pathname;
    const parts = currentPath.split('/');
    const lang = parts[1];
    const tournamentId = parts[3];
    let tournament;

    async function fetchTournamentData() {
        try {
            const response = await fetch(`/get-data-tournament?lang=${lang}&tournamentId=${tournamentId}`);
            if (!response.ok) {
                throw new Error('Tournament not found');
            }
            tournament = await response.json();
            renderTournamentData();
            renderMap();
        } catch (error) {
            console.error('Error fetching tournament data:', error);
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
        const localeTimeString = date.toLocaleTimeString(lang, { hour: '2-digit', minute: '2-digit' });
        document.getElementById('tournamentDate').textContent = formattedDate;
        // document.getElementById('tournamentDate').textContent = new Date(tournament.datetime).toLocaleDateString(lang);
        document.getElementById('tournamentLogo').style.backgroundImage = `url(${tournament.club.logo})`;
        document.getElementById('tournamentName').textContent = tournament.club.name;
        // document.getElementById('registeredPlayers').textContent = `${tournament.players.length} people registered`;

        // document.getElementById('registeredPlayers').textContent = `${tournament.players.length} ${translations[lang].peopleRegistered}`;
        // количество зарегистрированных людей на русском языке
        const registeredPlayersText = getRegisteredPlayersText(tournament.players.length, lang);
        document.getElementById('registeredPlayers').textContent = `${tournament.players.length} ${registeredPlayersText}`;

        document.getElementById('restrictionStatus').style.backgroundColor = 'rgb(0, 112, 38)';
        document.getElementById('restrictionStatus').innerHTML = `<div class="restriction">${tournament.restrictions}</div>`;
        // document.getElementById('tournamentStart').textContent = new Date(tournament.datetime).toLocaleTimeString(lang, { hour: '2-digit', minute: '2-digit' });
        document.getElementById('tournamentStart').textContent = localeTimeString;
        // document.getElementById('tournamentCity').textContent = tournament.address[lang] || tournament.address['en'];
        const cityName = (tournament.address[lang] || tournament.address['en']).split(',')[0];
        document.getElementById('tournamentCity').textContent = cityName;
        document.getElementById('tournamentContacts').textContent = tournament.contacts;
        document.getElementById('tournamentContacts').href = `tel:${tournament.contacts}`;
        document.getElementById('tournamentContribution').textContent = `${tournament.contribution}฿`;

        const prizesTable = document.getElementById('prizesTable');
        prizesTable.innerHTML = '';
        prizesTable.innerHTML = `<h3>${translations[lang].awardTitle}</h3>`;
        tournament.prizes[lang].forEach(prize => {
            const prizeElement = document.createElement('div');
            prizeElement.className = 'prizes_table_award';
            prizeElement.textContent = prize;
            prizesTable.appendChild(prizeElement);
        });

        const registeredPlayersList = document.getElementById('registeredPlayersList');
        registeredPlayersList.innerHTML = '';
        tournament.players.forEach((player, index) => {
            const playerElement = document.createElement('div');
            playerElement.className = 'upcomingTournament_table_player';
            playerElement.innerHTML = `
                <div class="upcomingTournament_number">${index + 1}</div>
                <div class="cell upcomingTournament_player">
                    <div class="playerLogo" style="background-image: url('${player.logo}'); background-position: 50%; background-size: cover; background-repeat: no-repeat;"></div>
                    <span>${player.name}</span>
                </div>
                <div class="cell upcomingTournament_rating">${player.rating}</div>
            `;
            registeredPlayersList.appendChild(playerElement);
        });
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

    const translations = {
        en: {
            peopleRegistered: "people registered",
            awardTitle: "Prizes and awards"
        },
        ru: {
            peopleRegistered: "человек заявлено",
            awardTitle: "Призовой фонд"
        },
        th: {
            peopleRegistered: "คนลงทะเบียน",
            awardTitle: "ของรางวัล"
        }
    };

    fetchTournamentData();

    

});