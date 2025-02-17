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

    const currentPath = window.location.pathname;

    const parts = currentPath.split('/');
    const lang = parts[1];
    const tournamentId = parts[3];
    

    

    const tournamentData = await fetchTournament(tournamentId);

    if (tournamentData.finished) {
        // console.log(tournamentData);
        renderPastTournamentResults(tournamentData);
    }





});

async function fetchTournament(tournamentId) {
    

    try {
        const response = await fetch(`/get-data-tournament?tournamentId=${tournamentId}`);
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to fetch tournament data.');
        }

        if (response.ok) {
            const tournament = await response.json();
            console.log('Tournament data:', tournament);
            return tournament;
        }

    } catch (error) {
      console.error('Error fetching tournament:', error.message);
      showErrorModal(error.message || 'Failed to fetch tournament data.');
      return null;
    }
    
}

function renderPastTournamentResults(tournamentData) {
    const container = document.querySelector(".pastTournament_table_content");
    if (!container) {
        console.error("❌ Элемент .pastTournament_table_content не найден!");
        return;
    }
    container.innerHTML = ""; // Очищаем контейнер перед рендерингом

    if (!tournamentData || !tournamentData.players || tournamentData.players.length === 0) {
        console.warn("⚠️ Нет данных для рендеринга завершенного турнира.");
        return;
    }

    // 🛠 **Создаём структуру данных для игроков**
    let playerStats = tournamentData.players.map(player => {
        // 🏙 **Получаем город игрока**
        const city = player.city || player.cityName || "Unknown";

        // 📊 **Получаем рейтинг ДО и ПОСЛЕ турнира**
        const ratingBefore = tournamentData.initialRatings.find(p => p.id === player.id)?.rating ?? 0;
        const ratingAfter = player.rating ?? ratingBefore;
        const ratingChange = (ratingAfter - ratingBefore).toFixed(1);
        const ratingColor = ratingChange > 0 ? "#007026" : ratingChange < 0 ? "#F00" : "#666877";

        // ✅ **Подсчет игр, побед, поражений, сетов**
        let totalGames = 0, wins = 0, losses = 0, totalSets = 0, wonSets = 0, lostSets = 0;

        // ⚡ **Поиск результатов игрока в results**
        Object.entries(tournamentData.results).forEach(([playerIndex, matches]) => {
            if (player.id !== tournamentData.players[playerIndex]?.id) return;

            Object.entries(matches).forEach(([opponentIndex, score]) => {
                if (opponentIndex === "sets" || opponentIndex === "points") return;
                
                const [score1, score2] = score.split(":").map(Number);
                if (isNaN(score1) || isNaN(score2)) return;

                totalGames++;  // Увеличиваем количество матчей
                wonSets += score1;  // Выигранные сеты
                lostSets += score2; // Проигранные сеты
                totalSets += score1 + score2; // Общий счёт сетов

                if (score1 > score2) wins++;  // Победа
                else losses++;  // Поражение
            });
        });

        console.log(`✅ Игрок ${player.fullname} | Матчи: ${totalGames} | Победы: ${wins} | Поражения: ${losses} | Сеты: ${totalSets} (${wonSets}-${lostSets})`);

        return {
            id: player.id,
            place: player.place,
            name: player.name || player.fullname,
            city,
            totalGames,
            wins,
            losses,
            totalSets,
            wonSets,
            lostSets,
            ratingChange,
            ratingBefore: ratingBefore.toFixed(1),
            ratingAfter: ratingAfter.toFixed(1),
            ratingColor,
            logo: `${player.logo}`
        };
    });

    // 🔽 **Теперь сортируем игроков по `place`**
    playerStats = playerStats.filter(Boolean).sort((a, b) => a.place - b.place);

    // 🎨 **Рендерим таблицу**
    playerStats.forEach(player => {
        const playerDiv = document.createElement("div");
        playerDiv.classList.add("pastTournament_table_player");

        playerDiv.innerHTML = `
            <div class="pastTournament_number">${player.place}</div>
            <div class="cell pastTournament_player">
                <div class="playerLogo" style="background-image: url('${player.logo}'); background-position: 50%; background-size: cover; background-repeat: no-repeat;"></div>
                <span>${player.name}</span>
            </div>
            <div class="cell pastTournament_city">${player.city}</div>
            <div class="cell pastTournament_games">${player.totalGames}(${player.wins}-${player.losses})</div>
            <div class="cell pastTournament_sets">${player.totalSets}(${player.wonSets}-${player.lostSets})</div>
            <div class="cell pastTournament_avarage" style="color: ${player.ratingColor}">${player.ratingChange > 0 ? `+${player.ratingChange}` : player.ratingChange}</div>
            <div class="cell pastTournament_before">${player.ratingBefore}</div>
            <div class="cell pastTournament_after">${player.ratingAfter}</div>
        `;

        container.appendChild(playerDiv);
    });

    console.log("📊 Завершенный турнир успешно отрендерен!");
}


// function renderPastTournamentResults(tournamentData) {
//     const container = document.querySelector(".pastTournament_table_content");
//     if (!container) {
//         console.error("❌ Элемент .pastTournament_table_content не найден!");
//         return;
//     }
//     container.innerHTML = ""; // Очищаем контейнер перед рендерингом

//     if (!tournamentData || !tournamentData.players || tournamentData.players.length === 0) {
//         console.warn("⚠️ Нет данных для рендеринга завершенного турнира.");
//         return;
//     }

//     // Сортируем игроков по `place`
//     const sortedPlayers = tournamentData.players
//         .filter(player => player.place !== undefined)
//         .sort((a, b) => a.place - b.place);

//     // 🔽 **Рендерим игроков в таблицу**
//     sortedPlayers.forEach(player => {
//         console.log(`🔍 Обрабатываем игрока: ${player.fullname}`);

//         // 🏙 **Получаем город игрока**
//         const city = player.city || player.cityName || "Unknown";

//         // 📊 **Получаем рейтинг ДО и ПОСЛЕ турнира**
//         const ratingBefore = tournamentData.initialRatings.find(p => p.id === player.id)?.rating ?? 0;
//         const ratingAfter = player.rating ?? ratingBefore;
//         const ratingChange = (ratingAfter - ratingBefore).toFixed(1);
//         const ratingColor = ratingChange > 0 ? "#007026" : ratingChange < 0 ? "#F00" : "#666877";

//         // ✅ **Подсчет игр, побед и поражений**
//         let totalGames = 0, wins = 0, losses = 0, totalSets = 0, wonSets = 0, lostSets = 0;

//         // ⚡ **Поиск результатов игрока в results**
//         Object.entries(tournamentData.results).forEach(([playerIndex, matches]) => {
//             if (player.id !== sortedPlayers[playerIndex]?.id) return;

//             Object.entries(matches).forEach(([opponentIndex, score]) => {
//                 if (opponentIndex === "sets" || opponentIndex === "points") return;
                
//                 const [score1, score2] = score.split(":").map(Number);
//                 if (isNaN(score1) || isNaN(score2)) return;

//                 totalGames++;  // Увеличиваем количество матчей
//                 wonSets += score1;  // Выигранные сеты
//                 lostSets += score2; // Проигранные сеты
//                 totalSets += score1 + score2; // Общий счёт сетов

//                 if (score1 > score2) wins++;  // Победа
//                 else losses++;  // Поражение
//             });
//         });

//         console.log(`✅ Игрок ${player.fullname} | Матчи: ${totalGames} | Победы: ${wins} | Поражения: ${losses} | Сеты: ${totalSets} (${wonSets}-${lostSets})`);

//         // 🎨 **Создаём HTML-элемент игрока**
//         const playerDiv = document.createElement("div");
//         playerDiv.classList.add("pastTournament_table_player");

//         playerDiv.innerHTML = `
//             <div class="pastTournament_number">${player.place}</div>
//             <div class="cell pastTournament_player">
//                 <div class="playerLogo" style="background-image: url('${player.logo}'); background-position: 50%; background-size: cover; background-repeat: no-repeat;"></div>
//                 <span>${player.name || player.fullname}</span>
//             </div>
//             <div class="cell pastTournament_city">${city}</div>
//             <div class="cell pastTournament_games">${totalGames}(${wins}-${losses})</div>
//             <div class="cell pastTournament_sets">${totalSets}(${wonSets}-${lostSets})</div>
//             <div class="cell pastTournament_avarage" style="color: ${ratingColor}">${ratingChange > 0 ? `+${ratingChange}` : ratingChange}</div>
//             <div class="cell pastTournament_before">${ratingBefore.toFixed(1)}</div>
//             <div class="cell pastTournament_after">${ratingAfter.toFixed(1)}</div>
//         `;

//         container.appendChild(playerDiv);
//     });

//     console.log("📊 Завершенный турнир успешно отрендерен!");
// }



// function renderPastTournamentResults(tournamentData) {
//     const container = document.querySelector(".pastTournament_table_content");
//     if (!container) {
//         console.error("❌ Элемент .pastTournament_table_content не найден!");
//         return;
//     }
//     container.innerHTML = ""; // Очищаем контейнер перед рендерингом

//     if (!tournamentData || !tournamentData.players || tournamentData.players.length === 0) {
//         console.warn("⚠️ Нет данных для рендеринга завершенного турнира.");
//         return;
//     }

//     // Сортируем игроков по `place` (месту в турнире)
//     const sortedPlayers = tournamentData.players
//         .filter(player => player.place !== undefined)
//         .sort((a, b) => a.place - b.place);

//     // Рендерим игроков в таблицу
//     sortedPlayers.forEach(player => {
//         console.log(player);
//         // Найдем данные игрока в `allPlayers`, чтобы получить город
//         // const fullPlayerData = allPlayers.find(p => p.id === player.id) || {};
//         const city = player.city || player.cityName || "Unknown";

//         // Получаем рейтинг ДО турнира
//         const ratingBefore = tournamentData.initialRatings.find(p => p.id === player.id)?.rating ?? 0;
//         // Рейтинг ПОСЛЕ турнира
//         const ratingAfter = player.rating ?? ratingBefore;
//         // Изменение рейтинга
//         const ratingChange = (ratingAfter - ratingBefore).toFixed(1);
//         const ratingColor = ratingChange > 0 ? "#007026" : ratingChange < 0 ? "#F00" : "#666877";

//         // Подсчет игр, побед и поражений
//         let totalGames = 0, wins = 0, losses = 0, totalSets = 0, wonSets = 0, lostSets = 0;

//         if (tournamentData.results[player.id]) {
//             Object.entries(tournamentData.results[player.id]).forEach(([opponentId, score]) => {
//                 if (opponentId === "sets" || opponentId === "points") return;

//                 const [score1, score2] = score.split(":").map(Number);
//                 totalGames++;
//                 totalSets += score1 + score2;
//                 wonSets += score1;
//                 lostSets += score2;

//                 if (score1 > score2) wins++;
//                 else losses++;
//             });
//             console.log('totalGames', totalGames);
//             console.log('wonSets', wonSets);
//             console.log('lostSets', lostSets);
//             console.log('totalSets', totalSets);
//         }
        

//         // Создаем HTML-элемент игрока
//         const playerDiv = document.createElement("div");
//         playerDiv.classList.add("pastTournament_table_player");

//         playerDiv.innerHTML = `
//             <div class="pastTournament_number">${player.place}</div>
//             <div class="cell pastTournament_player">
//                 <div class="playerLogo" style="background-image: url('${player.logo}'); background-position: 50%; background-size: cover; background-repeat: no-repeat;"></div>
//                 <span>${player.name || player.fullname}</span>
//             </div>
//             <div class="cell pastTournament_city">${city}</div>
//             <div class="cell pastTournament_games">${totalGames}(${wins}-${losses})</div>
//             <div class="cell pastTournament_sets">${totalSets}(${wonSets}-${lostSets})</div>
//             <div class="cell pastTournament_avarage" style="color: ${ratingColor}">${ratingChange > 0 ? `+${ratingChange}` : ratingChange}</div>
//             <div class="cell pastTournament_before">${ratingBefore.toFixed(1)}</div>
//             <div class="cell pastTournament_after">${ratingAfter.toFixed(1)}</div>
//         `;

//         container.appendChild(playerDiv);
//     });

//     console.log("📊 Завершенный турнир успешно отрендерен!");
// }