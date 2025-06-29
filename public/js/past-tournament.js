import { createHeader, createFooter, getAllClubs, showErrorModal, getAllCoaches, listenerOfButtons, btnGoUp, languageControl, controlTextAreaCoach, fetchCities, fetchAdvertisements, breadCrumb } from './versioned-modules.js';
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
    window.lang = lang;
    const tournamentId = parts[3];
    

    

    const tournamentData = await fetchTournament(tournamentId);
    window.tournamentData = tournamentData;

    if (tournamentData.finished) {
        // console.log(tournamentData);
        renderPastTournamentResults(tournamentData);
        renderPastTournament(tournamentData);
    }

    const clubNameBlock = document.querySelector('.tournament_mainInfo_info_name');
    const logoBlock = document.querySelector('.tournament_mainInfo_logo');
    const playersAndGames = document.querySelector('.tournament_mainInfo_info_descr_path_wrapp span');
    const restrictionsBlock = document.querySelector('.restriction');
    const avrRatingBlock = document.querySelector('.tournament_mainInfo_info_descr_path_avrRating');
    const coefficientBlock = document.querySelector('.tournament_mainInfo_info_descr_path_coefficient');
    const cityBlock = document.querySelector('.tournament_mainInfo_info_descr_path_city');
    const popularScoreBlock = document.querySelector('.tournament_mainInfo_info_descr_path_wrapp_popularScore');

    clubNameBlock.textContent = `${tournamentData.club.name}`;
    logoBlock.style = `background-image: url(${tournamentData.club.logo}); background-position: 50% center; background-size: cover; background-repeat: no-repeat;`;
    playersAndGames.textContent = `${tournamentData.players.length} participants/${tournamentData.finishedPairs.length} games`;
    restrictionsBlock.textContent = `${tournamentData.restrictions || tournamentData.ratingLimit}`;
    
    avrRatingBlock.textContent = `${tournamentData.averageRating}`;
    coefficientBlock.textContent = `${tournamentData.coefficient}`;

    
    let mostPopular = findMostPopularScore(tournamentData.results) || calculatePopularScoreTwoRounds(tournamentData.round1Results, tournamentData.round2Results) || calculatePopularScoreOlympic(tournamentData.finishedPairs) || ' - ';
    popularScoreBlock.textContent =`${mostPopular}`;

    const curCity = await getCityName(tournamentData.city._id || tournamentData.city);
    // console.log(curCity);
    cityBlock.textContent = `${curCity}`;


});

async function getCityName(cityId) {
    let currentLang = localStorage.getItem('clientLang');
    
    try {
        const response = await fetch(`/cities/${cityId}`);
        if (!response.ok) {
            throw new Error('City data not found');
        }
        const city = await response.json();
       
        return city[currentLang] || city['english'];
    } catch (error) {
        console.error('Ошибка при получении названия города:', error);
        return 'Unknown City';
    }
}

function calculatePopularScoreOlympic(finishedPairs) {
    const scoreMap = {};
    console.log('finishedPairs', finishedPairs);
    finishedPairs.forEach(pair => {
        const s1 = pair.score1 ?? 0;
        const s2 = pair.score2 ?? 0;

        const score = s1 > s2 ? `${s1}:${s2}` : `${s2}:${s1}`; // Победный счёт
        scoreMap[score] = (scoreMap[score] || 0) + 1;
    });

    // Найдём самый популярный счёт
    let mostPopular = null;
    let maxCount = 0;
    for (const [score, count] of Object.entries(scoreMap)) {
        if (count > maxCount) {
            mostPopular = score;
            maxCount = count;
        }
    }
    return mostPopular || null;
}

function calculatePopularScoreTwoRounds(round1Results, round2Results) {
    if (!round1Results || !round2Results) {
        // console.log("⚠️ Нет данных о результатах матчей.");
        return null;
    }
    const allScores = {};

    const processRound = (round) => {
        for (const [rowIndex, row] of Object.entries(round)) {
            if (rowIndex === 'sets') continue;

            for (const [colIndex, score] of Object.entries(row)) {
                if (colIndex === 'sets' || colIndex === 'points') continue;
                if (typeof score !== 'string' || !score.includes(':')) continue;

                const [s1, s2] = score.split(':').map(Number);
                if (isNaN(s1) || isNaN(s2)) continue;

                const normalized = s1 >= s2 ? `${s1}:${s2}` : `${s2}:${s1}`;
                allScores[normalized] = (allScores[normalized] || 0) + 1;
            }
        }
    };

    processRound(round1Results);
    processRound(round2Results);

    let mostPopular = null;
    let maxCount = 0;

    for (const [score, count] of Object.entries(allScores)) {
        if (count > maxCount) {
            mostPopular = score;
            maxCount = count;
        }
    }

    return mostPopular || null;
}

function findMostPopularScore(results) {
    if (!results || Object.keys(results).length === 0) {
        // console.log("⚠️ Нет данных о результатах матчей.");
        return null;
    }

    const scoreCount = {}; // Объект для подсчета встречаемости счетов

    // Перебираем все результаты
    Object.values(results).forEach(matches => {
        Object.entries(matches).forEach(([opponentId, score]) => {
            if (opponentId === "sets" || opponentId === "points") return; // Пропускаем технические поля

            let [score1, score2] = score.split(":").map(Number);
            if (isNaN(score1) || isNaN(score2)) return;

            // Всегда записываем счет в формате "большее:меньшее"
            const normalizedScore = score1 > score2 ? `${score1}:${score2}` : `${score2}:${score1}`;

            scoreCount[normalizedScore] = (scoreCount[normalizedScore] || 0) + 1;
        });
    });

    // Найти самый частый счет
    let mostPopularScore = null;
    let maxCount = 0;

    Object.entries(scoreCount).forEach(([score, count]) => {
        if (count > maxCount) {
            mostPopularScore = score;
            maxCount = count;
        }
    });

    return mostPopularScore || null; // Возвращаем только счет
}

function renderPastTournament(tournament) {
    const type = tournament.typeOfTournament;
  
    if (type === 'roundRobin') {
        const players = tournament.players;
        const results = tournament.results;
    
        // Очистим контейнеры
        document.querySelector('.round-robin-table')?.replaceChildren();
        document.querySelector('.standings')?.replaceChildren();
        
        const orderedPlayers = tournament.initialPlayerOrder.map(id =>
            players.find(p => p.id === id)
        );
        document.querySelector('.displayTournamentFirst').style.display = 'block';
        startTournamentDisplay(orderedPlayers, '.displayTournamentFirst');
        // renderRoundRobinResults(results, players);
        // renderFinalStandingsTable(players, document.querySelector('.standings'));
    } else if (type === 'olympic' || type === 'groupOlympicFinal' || type === 'twoRound') {
        const container = document.querySelector('.tournament-placeholder');
        if (container) {
            container.innerHTML = `<p style="color: #666; font-style: italic;">This tournament type is not supported yet on the past tournaments page.</p>`;
        }
    } else {
        console.warn('Unsupported tournament type:', type);
    }
}

function startTournamentDisplay(players, block) {
    renderTournamentTable(players, block);
    const results = window.tournamentData.results;
    // restoreSavedResults(window.tournamentData.results);
    for (const row in results) {
        for (const col in results[row]) {
            const cell = document.querySelector(`td[data-row="${row}"][data-col="${col}"]`);
            if (cell) {
                cell.textContent = results[row][col];
            }
        }
    }
    addBracketsAndHighlightResults();
}

function renderTournamentTable(players, containerSelector) {
    // console.log(containerSelector);
    const tournamentWrapper = document.querySelector(`${containerSelector} .tournament-wrapper`);
    tournamentWrapper.innerHTML = ""; // Очищаем контейнер перед рендером

    // 📌 1. Рендер списка игроков
    const playersList = document.createElement('div');
    playersList.classList.add('players-list');

    const headerPlaceholder = document.createElement('div');
    headerPlaceholder.classList.add('header-placeholder');
    headerPlaceholder.innerHTML = `
        <img src="/icons/racket.svg" alt="tennis racket">
        <h3>Playing</h3>
    `;

    const playersNames = document.createElement('div');
    playersNames.classList.add("players-names");

    players.forEach((player, index) => {
        const li = document.createElement("li");
        li.innerHTML = `
            <span>${index + 1}</span>
            <h3>${player.name || player.fullname}</h3>
            <div>
                <h5>R: ${Number.isFinite(player.rating) ? Math.round(player.rating) : 0}</h5>
            </div>
        `;
        playersNames.appendChild(li);
    });

    playersList.appendChild(headerPlaceholder);
    playersList.appendChild(playersNames);
    tournamentWrapper.appendChild(playersList);

    // 📌 2. Рендер заголовка таблицы
    const tableWrapper = document.createElement('div');
    tableWrapper.classList.add('table-wrapper');

    const tableHeader = document.createElement('div');
    tableHeader.classList.add('table-header');

    const headerRow = document.createElement('div');
    headerRow.classList.add('header-row');

    players.forEach((_, index) => {
        const headerCell = document.createElement("div");
        headerCell.textContent = index + 1;
        headerRow.appendChild(headerCell);
    });

    // Добавляем два дополнительных столбца для очков и мест
    const pointsHeader = document.createElement("div");
    pointsHeader.textContent = "Sc";
    headerRow.appendChild(pointsHeader);

    const placeHeader = document.createElement("div");
    placeHeader.textContent = "Pl";
    headerRow.appendChild(placeHeader);

    tableHeader.appendChild(headerRow);
    tableWrapper.appendChild(tableHeader);

    // 📌 3. Рендер таблицы
    const resultTable = document.createElement('div');
    resultTable.classList.add('results-table');
    
    const table = document.createElement('table');
    const tbody = document.createElement('tbody');

    players.forEach((player, rowIndex) => {
        const row = document.createElement("tr");
        row.setAttribute('data-player-id', player.id);

        for (let colIndex = 0; colIndex <= players.length + 1; colIndex++) {
            const cell = document.createElement("td");

            if (colIndex === rowIndex) {
                cell.classList.add("disabled");
            } else if (colIndex < players.length) {
                cell.setAttribute("data-row", rowIndex);
                cell.setAttribute("data-col", colIndex);
            } else if (colIndex === players.length) {
                cell.classList.add("points");
                cell.textContent = "0";
            } else if (colIndex === players.length + 1) {
                cell.classList.add("place");
            }
            row.appendChild(cell);
        }
        tbody.appendChild(row);
    });

    table.appendChild(tbody);
    resultTable.appendChild(table);
    tableWrapper.appendChild(resultTable);
    tournamentWrapper.appendChild(tableWrapper);

    addBracketsAndHighlightResults();

    // 📌 4. Обновляем места игроков
    // if ( tournamentData.typeOfTournament === 'roundRobin') {
        updateTournamentStandings(players, window.tournamentData.results);
    // } 
    // else if ( selectedType === 'twoRound') {
    //     updateTournamentStandingsTwoRound(players, results, roundCounter);
    // }

    
    

}

function updateTournamentStandings(players, results) {
    console.log("players in update", players);
    let standings = players.map(player => ({
        id: player.id,
        name: player.name || player.fullname,
        birthYear: player.birthYear,
        nickname: player.nickname,
        city: player.city || "Unknown",
        unrated: player.unrated || false,
        wins: 0,
        losses: 0,
        totalPoints: 0,
        setsWon: 0,
        setsLost: 0,
        place: player.place || 0
    }));

    // const playerIdsByIndex = players.map(p => p.id);
    const processedPairs = new Set(); // Храним обработанные пары

    // ✅ **Цикл по `results`, но избегаем дублирования**
    for (const [row, cols] of Object.entries(results)) {
        for (const [col, score] of Object.entries(cols)) {
            if (col === "sets" || col === "points") continue; // Пропускаем лишние поля

            // ✅ **Проверяем формат счета**
            if (typeof score !== "string") {
                console.warn(`⚠️ Некорректные данные: results[${row}][${col}] =`, score);
                continue;
            }

            const [p1Score, p2Score] = score.split(":").map(n => parseInt(n.trim()));

            // const player1 = standings.find(p => p.id == players[row].id);
            // const player2 = standings.find(p => p.id == players[col].id);

            const player1Ref = players[Number(row)];
            const player2Ref = players[Number(col)];

            const player1 = standings.find(p => p.id === player1Ref.id);
            const player2 = standings.find(p => p.id === player2Ref.id);

            

            if (!player1 || !player2) continue;

            // ✅ **Используем `Math.min()` и `Math.max()` для правильного порядка ключа**
            const matchKey = `${Math.min(row, col)}-${Math.max(row, col)}`;
            if (processedPairs.has(matchKey)) continue;
            processedPairs.add(matchKey);

            // ✅ **Обновляем данные игроков**
            player1.setsWon += p1Score;
            player1.setsLost += p2Score;
            player2.setsWon += p2Score;
            player2.setsLost += p1Score;

         
            if (player1.unrated && player2.unrated) {
                // Обычная логика начисления очков
                if (p1Score > p2Score) {
                    player1.wins += 1;
                    player1.totalPoints += 2;
                    player2.totalPoints += 1;
                    player2.losses += 1;
                } else {
                    player2.wins += 1;
                    player2.totalPoints += 2;
                    player1.totalPoints += 1;
                    player1.losses += 1;
                }
            } else

            if (player1.unrated || player2.unrated) {
                // Если один из игроков нерейтинговый
                if (player1.unrated) {
                    player1.losses += 1;
                    player1.totalPoints += 1; // Нерейтинговый игрок всегда получает 1 очко
                    player2.totalPoints += 2; // Его соперник получает 2 очка
                    player2.wins += 1;
                } else {
                    player1.wins += 1;
                    player1.totalPoints += 2; // Победитель получает 2 очка
                    player2.totalPoints += 1; // Нерейтинговый игрок получает 1 очко
                    player2.losses += 1;
                }
            } else {
                // Обычная логика начисления очков
                if (p1Score > p2Score) {
                    player1.wins += 1;
                    player1.totalPoints += 2;
                    player2.totalPoints += 1;
                    player2.losses += 1;
                } else {
                    player2.wins += 1;
                    player2.totalPoints += 2;
                    player1.totalPoints += 1;
                    player1.losses += 1;
                }
            }
            console.log('игрок 2:', player2.name, player2.wins, player2.losses);
            console.log('игрок 1:', player1.name, player1.wins, player1.losses);
        }
    }
    standings.forEach(player => {
        const rowElement = document.querySelector(`tr[data-player-id="${player.id}"]`);
        if (rowElement) {
            const placeCell = rowElement.querySelector(".points");
            if (placeCell) {
                placeCell.textContent = player.totalPoints; // Обновляем место
            }
        }
    });

    // ✅ **Сохранение мест только если турнир завершен**
    // if (currentPairs.length === 0 && waitingPairs.length === 0) {
        standings.forEach(player => {
            const rowElement = document.querySelector(`tr[data-player-id="${player.id}"]`);
            if (rowElement) {
                const placeCell = rowElement.querySelector(".place");
                if (placeCell) {
                    placeCell.textContent = player.place; // Обновляем место
                }
            }
        });
    // }
    // const updatedPlayers = allParticipants.map(player => {
    //     const updated = standings.find(p => p.id === player.id);
    //     return updated ? { ...player, ...updated } : player;
    // });

    // const updatedPlayers = standings.map(s => {
    //     const original = allParticipants.find(p => p.id === s.id) || {};
    //     return {
    //         ...original,
    //         id: s.id,
    //         name: s.name,
    //         fullname: s.name,
    //         nickname: s.nickname,
    //         birthYear: s.birthYear,
    //         city: s.city,
    //         unrated: s.unrated,
    //         wins: s.wins,
    //         losses: s.losses,
    //         totalPoints: s.totalPoints,
    //         setsWon: s.setsWon,
    //         setsLost: s.setsLost,
    //         place: s.place
    //     };
    // });
    
    // saveTournament(null, updatedPlayers);

    // console.log('✅ Итоговые standings:', updatedPlayers);
    // // saveTournament(null, standings);
    // standingsGlobal = updatedPlayers;

    // const hasDuplicateIds = new Set(updatedPlayers.map(p => p.id)).size !== updatedPlayers.length;
    // if (hasDuplicateIds) {
    //     console.warn("⚠️ Дублирующиеся ID в updatedPlayers! Это приведёт к неверным данным.");
    // }

}

function addBracketsAndHighlightResults() {
    document.querySelectorAll("td[data-row][data-col]").forEach(td => {
        const text = td.textContent.trim();

        // Проверяем, есть ли результат в формате "X:Y"
        if (/^\d+:\d+$/.test(text) && !td.classList.contains("points") && !td.classList.contains("place")) {
            const [score1, score2] = text.split(":").map(n => parseInt(n, 10));
            const row = parseInt(td.getAttribute("data-row"));
            const col = parseInt(td.getAttribute("data-col"));
            const player1 = [...window.tournamentData.players, ...window.tournamentData.unratedPlayers][row];
            const player2 = [...window.tournamentData.players, ...window.tournamentData.unratedPlayers][col];

            if (!player1 || !player2) {
                console.log('игрок не найден')
            }
            // Удаляем старую дужку, если есть
            td.querySelector(".svg-bracket")?.remove();

            // Создаём контейнер, чтобы текст и дужка не мешали друг другу
            if (!td.querySelector(".td-wrapper")) {
                const wrapper = document.createElement("div");
                wrapper.classList.add("td-wrapper");
                wrapper.style.position = "relative"; // Для абсолютного позиционирования дужки
                wrapper.style.display = "flex";
                wrapper.style.alignItems = "center"; // Выравнивание по центру
                wrapper.style.justifyContent = "center";
                wrapper.style.height = "100%";
                wrapper.innerHTML = text;
                td.innerHTML = "";
                td.appendChild(wrapper);
            }

            // Добавляем SVG-дужку
            const svg = document.createElement("img");
            svg.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='58' height='10' viewBox='0 0 58 10' fill='none'%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M0 0V4C0 7.31372 2.68628 10 6 10H52C55.3137 10 58 7.31372 58 4V0C58 3.31372 55.3137 6 52 6H6C2.68628 6 0 3.31372 0 0Z' fill='white'/%3E%3C/svg%3E";
            svg.classList.add("svg-bracket");
            svg.style.width = "58px";
            svg.style.height = "10px";
            svg.style.position = "absolute"; // Абсолютное позиционирование
            svg.style.bottom = "0px"; // Чуть ниже текста
            svg.style.left = "50%"; // Центрирование
            svg.style.transform = "translateX(-50%)"; // Точная центровка
            td.appendChild(svg);

            // console.log('player1', player1, 'player2', player2)
            // Логика окрашивания ячеек для нерейтинговых игроков и их соперников
            if (player1.unrated && player2.unrated) {
                // Обычная логика подсветки
                td.style.background = (score1 > score2) ? "#FA6400" : "#D10000";
            } 
            else if (player1.unrated || player2.unrated) {
                if (player1.unrated) {
                    td.style.background = "#D10000"; // Нерейтинговый игрок - всегда красный (проигравший)
                } else {
                    td.style.background = "#FA6400"; // Обычный игрок против нерейтингового - всегда оранжевый (победитель)
                }
            } else {
                // Обычная логика подсветки
                td.style.background = (score1 > score2) ? "#FA6400" : "#D10000";
            }
        } else {
            // Если формат неверный или ячейка не должна содержать дужку — сбрасываем стили
            td.style.background = "";
            td.querySelector(".svg-bracket")?.remove();
            if (td.querySelector(".td-wrapper")) {
                td.innerHTML = td.querySelector(".td-wrapper").textContent;
            }
        }
    });
}

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
    container.innerHTML = "";

    const ratedPlayers = tournamentData.players || [];
    const unratedPlayers = tournamentData.unratedPlayers || [];

    const allPlayers = [...ratedPlayers, ...unratedPlayers];

    if (allPlayers.length === 0) {
        console.warn("⚠️ Нет данных для рендеринга завершенного турнира.");
        return;
    }

    const playerStats = allPlayers.map(player => {
        const city = player.city || player.cityName || "Unknown";
        const ratingBefore = tournamentData.initialRatings?.find(p => p.id === player.id)?.rating ?? 0;
        const ratingAfter = player.rating ?? ratingBefore;
        const ratingChange = (ratingAfter - ratingBefore).toFixed(1);
        const ratingColor = ratingChange > 0 ? "#007026" : ratingChange < 0 ? "#F00" : "#666877";

        const wins = player.wins || 0;
        const losses = player.losses || 0;
        const setsWon = player.setsWon || 0;
        const setsLost = player.setsLost || 0;
        const totalGames = wins + losses;
        const totalSets = setsWon + setsLost;

        return {
            id: player.id,
            place: player.place || 0,
            name: player.name || player.fullname,
            city,
            totalGames,
            wins,
            losses,
            totalSets,
            wonSets: setsWon,
            lostSets: setsLost,
            ratingChange,
            ratingBefore: ratingBefore.toFixed(1),
            ratingAfter: ratingAfter.toFixed(1),
            ratingColor,
            logo: player.logo
        };
    });

    playerStats.sort((a, b) => a.place - b.place);

    playerStats.forEach(player => {
        const playerDiv = document.createElement("a");
        playerDiv.classList.add("pastTournament_table_player");
        playerDiv.href = `/${window.lang}/allplayers/${player.id || player._id}`;

        playerDiv.innerHTML = `
            <div class="pastTournament_number">${player.place}</div>
            <div class="cell pastTournament_player">
                <div class="playerLogo" style="background-image: url('${player.logo}'); background-position: 50%; background-size: cover; background-repeat: no-repeat;"></div>
                <span>${player.name}</span>
            </div>
            <div class="cell pastTournament_city">${player.city}</div>
            <div class="cell pastTournament_games">${player.totalGames} (${player.wins}-${player.losses})</div>
            <div class="cell pastTournament_sets">${player.totalSets} (${player.wonSets}-${player.lostSets})</div>
            <div class="cell pastTournament_avarage" style="color: ${player.ratingColor}; font-weight: bold;">
                ${player.ratingChange > 0 ? `+${player.ratingChange}` : player.ratingChange}
            </div>
            <div class="cell pastTournament_before">${player.ratingBefore}</div>
            <div class="cell pastTournament_after">${player.ratingAfter}</div>
        `;

        container.appendChild(playerDiv);
    });

    console.log("📊 Завершенный турнир успешно отрендерен!");
}


// -------------------------зона рендера таблиц и схем ----------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
    const display = document.querySelector('.displayTournament'); // Родительский контейнер
    const content = document.querySelector('.content'); // Контент внутри

    let isDragging = false;
    let startX, startY, currentX = 0, currentY = 0, scale = 1;

    // Устанавливаем transform-origin в верхний левый угол
    content.style.transformOrigin = 'top left';

    // Получение размеров контейнера и контента
    const getBounds = () => {
        const displayRect = display.getBoundingClientRect();
        return {
            displayWidth: displayRect.width,
            displayHeight: displayRect.height,
            contentWidth: content.offsetWidth * scale,
            contentHeight: content.offsetHeight * scale,
        };
    };

    // Ограничение позиции
    const limitPosition = (x, y) => {
        const { displayWidth, displayHeight, contentWidth, contentHeight } = getBounds();
        const minX = 0, minY = 0;
        const maxX = displayWidth - contentWidth;
        const maxY = displayHeight - contentHeight;

        return {
            x: Math.max(Math.min(x, minX), maxX),
            y: Math.max(Math.min(y, minY), maxY),
        };
    };

    // Обработчик начала перетаскивания
    display.addEventListener('mousedown', (e) => {
        isDragging = true;
        startX = e.clientX - currentX;
        startY = e.clientY - currentY;
        display.style.cursor = 'grabbing';
    });

    // Обработчик движения мыши
    display.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        let x = e.clientX - startX;
        let y = e.clientY - startY;

        const limitedPosition = limitPosition(x, y);
        currentX = limitedPosition.x;
        currentY = limitedPosition.y;

        content.style.transform = `translate(${currentX}px, ${currentY}px) scale(${scale})`;
    });

    // Обработчик окончания перетаскивания
    document.addEventListener('mouseup', () => {
        isDragging = false;
        display.style.cursor = 'grab';
    });

    let lastTouchDistance = null; // Для отслеживания pinch-to-zoom

    // Обработчик тачпада (pinch-to-zoom)
    display.addEventListener('touchmove', (e) => {
        if (e.touches.length !== 2) return; // Обрабатываем только два пальца

        const touch1 = e.touches[0];
        const touch2 = e.touches[1];

        // Вычисляем расстояние между пальцами
        const currentDistance = Math.hypot(
            touch2.clientX - touch1.clientX,
            touch2.clientY - touch1.clientY
        );

        if (lastTouchDistance) {
            const zoomFactor = currentDistance / lastTouchDistance;
            const newScale = Math.min(Math.max(0.5, scale * zoomFactor), 3);

            scale = newScale;
            content.style.transform = `translate(${currentX}px, ${currentY}px) scale(${scale})`;
        }

        lastTouchDistance = currentDistance;
    });

    // Сбрасываем состояние pinch-to-zoom
    display.addEventListener('touchend', () => {
        lastTouchDistance = null;
    });

    // Обработчик колесика мыши (только с Ctrl)
    display.addEventListener('wheel', (e) => {
        if (!e.ctrlKey) return; // Игнорируем зум без Ctrl

        e.preventDefault();
        const zoomIntensity = 0.1;
        const delta = e.deltaY > 0 ? -zoomIntensity : zoomIntensity;
        const newScale = Math.min(Math.max(0.5, scale + delta), 3);

        const { contentWidth, contentHeight } = getBounds();
        const rect = content.getBoundingClientRect();

        const offsetX = (e.clientX - rect.left) / scale;
        const offsetY = (e.clientY - rect.top) / scale;

        currentX -= offsetX * (newScale - scale);
        currentY -= offsetY * (newScale - scale);

        scale = newScale;

        const limitedPosition = limitPosition(currentX, currentY);
        currentX = limitedPosition.x;
        currentY = limitedPosition.y;

        content.style.transform = `translate(${currentX}px, ${currentY}px) scale(${scale})`;
    });

});

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

//     // 🛠 **Создаём структуру данных для игроков**
//     let playerStats = tournamentData.players.map(player => {
//         // 🏙 **Получаем город игрока**
//         const city = player.city || player.cityName || "Unknown";

//         // 📊 **Получаем рейтинг ДО и ПОСЛЕ турнира**
//         const ratingBefore = tournamentData.initialRatings.find(p => p.id === player.id)?.rating ?? 0;
//         const ratingAfter = player.rating ?? ratingBefore;
//         const ratingChange = (ratingAfter - ratingBefore).toFixed(1);
//         const ratingColor = ratingChange > 0 ? "#007026" : ratingChange < 0 ? "#F00" : "#666877";

//         // ✅ **Подсчет игр, побед, поражений, сетов**
//         let totalGames = 0, wins = 0, losses = 0, totalSets = 0, wonSets = 0, lostSets = 0;

//         // ⚡ **Поиск результатов игрока в results**
//         Object.entries(tournamentData.results).forEach(([playerIndex, matches]) => {
//             if (player.id !== tournamentData.players[playerIndex]?.id) return;

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

//         return {
//             id: player.id,
//             place: player.place,
//             name: player.name || player.fullname,
//             city,
//             totalGames,
//             wins,
//             losses,
//             totalSets,
//             wonSets,
//             lostSets,
//             ratingChange,
//             ratingBefore: ratingBefore.toFixed(1),
//             ratingAfter: ratingAfter.toFixed(1),
//             ratingColor,
//             logo: `${player.logo}`
//         };
//     });

//     // 🔽 **Теперь сортируем игроков по `place`**
//     playerStats = playerStats.filter(Boolean).sort((a, b) => a.place - b.place);

//     // 🎨 **Рендерим таблицу**
//     playerStats.forEach(player => {
//         const playerDiv = document.createElement("div");
//         playerDiv.classList.add("pastTournament_table_player");

//         playerDiv.innerHTML = `
//             <div class="pastTournament_number">${player.place}</div>
//             <div class="cell pastTournament_player">
//                 <div class="playerLogo" style="background-image: url('${player.logo}'); background-position: 50%; background-size: cover; background-repeat: no-repeat;"></div>
//                 <span>${player.name}</span>
//             </div>
//             <div class="cell pastTournament_city">${player.city}</div>
//             <div class="cell pastTournament_games">${player.totalGames}(${player.wins}-${player.losses})</div>
//             <div class="cell pastTournament_sets">${player.totalSets}(${player.wonSets}-${player.lostSets})</div>
//             <div class="cell pastTournament_avarage" style="color: ${player.ratingColor}">${player.ratingChange > 0 ? `+${player.ratingChange}` : player.ratingChange}</div>
//             <div class="cell pastTournament_before">${player.ratingBefore}</div>
//             <div class="cell pastTournament_after">${player.ratingAfter}</div>
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