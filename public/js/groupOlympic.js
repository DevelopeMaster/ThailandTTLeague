export function distributePlayersIntoGroups(allPlayers) {
    const numberOfGroups = window.groupFinalSettings.numberOfGroups;

    if (!numberOfGroups || allPlayers.length === 0) {
        console.error('Cannot distribute players: missing settings or players.');
        return [];
    }

    // Сортируем игроков по рейтингу по убыванию
    const sortedPlayers = [...allPlayers].sort((a, b) => b.rating - a.rating);

    // Инициализируем группы
    const groups = Array.from({ length: numberOfGroups }, () => []);

    let direction = 1; // 1 - вправо, -1 - влево
    let groupIndex = 0;

    // Распределяем змейкой
    for (const player of sortedPlayers) {
        groups[groupIndex].push(player);

        groupIndex += direction;

        if (groupIndex === numberOfGroups) {
            direction = -1;
            groupIndex = numberOfGroups - 1;
        } else if (groupIndex === -1) {
            direction = 1;
            groupIndex = 0;
        }
    }

    // Сохраняем группы в глобальное окно
    window.groups = groups;

    console.log('Groups distributed successfully:', groups);

    return groups;
}

export function renderGroups(groups) {
    const tournamentWrapper = document.querySelector('.tournament-wrapper');
    if (!tournamentWrapper) return;

    tournamentWrapper.innerHTML = ''; // Очищаем всё

    const groupsWrapper = document.createElement('div');
    groupsWrapper.classList.add('groups-wrapper');

    groups.forEach((group, groupIndex) => {
        // const displayBlock = document.createElement('div');
        // displayBlock.classList.add('displayTournament', 'graySoftBlock');

        const contentBlock = document.createElement('div');
        contentBlock.classList.add('content');

        const header = document.createElement('div');
        header.classList.add('display_header');
        header.innerHTML = `<h3 class='display_header_groupNumber'>Group ${groupIndex + 1}</h3>`;

        const tournamentInnerWrapper = document.createElement('div');
        tournamentInnerWrapper.classList.add('tournament-wrapper');

        tournamentInnerWrapper.setAttribute('data-group-index', groupIndex);
        // players list
        const playersList = document.createElement('div');
        playersList.classList.add('players-list');

        const headerPlaceholder = document.createElement('div');
        headerPlaceholder.classList.add('header-placeholder');
        headerPlaceholder.innerHTML = `
            <img src="/icons/racket.svg" alt="tennis racket">
            <h3>Playing</h3>
        `;

        const playersNames = document.createElement('div');
        playersNames.classList.add('players-names');

        group.forEach((player, i) => {
            const li = document.createElement('li');
            li.innerHTML = `
                <span>${i + 1}</span>
                <h3>${player.fullname || player.name}</h3>
                <div><h5>R: ${Math.round(player.rating)}</h5></div>
            `;
            playersNames.appendChild(li);
        });

        playersList.appendChild(headerPlaceholder);
        playersList.appendChild(playersNames);

        // results table
        const tableWrapper = document.createElement('div');
        tableWrapper.classList.add('table-wrapper');

        const tableHeader = document.createElement('div');
        tableHeader.classList.add('table-header');

        const headerRow = document.createElement('div');
        headerRow.classList.add('header-row');

        for (let i = 0; i < group.length; i++) {
            headerRow.appendChild(createDivWithText(i + 1));
        }
        headerRow.appendChild(createDivWithText('Sc'));
        headerRow.appendChild(createDivWithText('Pl'));
        tableHeader.appendChild(headerRow);

        const resultsTable = document.createElement('div');
        resultsTable.classList.add('results-table');

        const table = document.createElement('table');
        const tbody = document.createElement('tbody');

        group.forEach((player, rowIndex) => {
            const tr = document.createElement('tr');
            tr.setAttribute('data-player-id', player.id);

            group.forEach((_, colIndex) => {
                const td = document.createElement('td');
                if (rowIndex === colIndex) {
                    td.classList.add('disabled');
                } else {
                    td.setAttribute('data-row', rowIndex);
                    td.setAttribute('data-col', colIndex);
                }
                tr.appendChild(td);
            });

            // столбец Sc (очки) и Pl (место)
            const pointsCell = document.createElement('td');
            pointsCell.classList.add('points');
            pointsCell.textContent = '0';

            const placeCell = document.createElement('td');
            placeCell.classList.add('place');
            placeCell.textContent = '0';

            tr.appendChild(pointsCell);
            tr.appendChild(placeCell);

            tbody.appendChild(tr);
        });

        table.appendChild(tbody);
        resultsTable.appendChild(table);

        tableWrapper.appendChild(tableHeader);
        tableWrapper.appendChild(resultsTable);

        // Собираем всё вместе
        tournamentInnerWrapper.appendChild(playersList);
        tournamentInnerWrapper.appendChild(tableWrapper);
        contentBlock.appendChild(header);
        contentBlock.appendChild(tournamentInnerWrapper);
        // displayBlock.appendChild(contentBlock);

        groupsWrapper.appendChild(contentBlock);
        // groupsWrapper.appendChild(displayBlock);


        // tournamentWrapper.appendChild(displayBlock);
    });

    tournamentWrapper.appendChild(groupsWrapper);

}

// Вспомогательная функция
function createDivWithText(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div;
}

export function generateGroupPairs(groups) {
    const allPairs = [];

    groups.forEach((group, groupIndex) => {
        for (let i = 0; i < group.length; i++) {
            for (let j = i + 1; j < group.length; j++) {
                allPairs.push({
                    player1: group[i],
                    player2: group[j],
                    groupIndex: groupIndex
                });
            }
        }
    });

    return allPairs;
}

export function renderGroupResults(groupsResults) {
    groupsResults.forEach(group => {
        const groupIndex = group.groupIndex;
        const table = document.querySelector(`.tournament-wrapper[data-group-index="${groupIndex}"]`);
        if (!table) return;

        const rows = Array.from(table.querySelectorAll('tr[data-player-id]'));
        const rowMap = new Map(); // playerId → row index
        rows.forEach((row, index) => {
            const id = row.getAttribute('data-player-id');
            if (id) rowMap.set(id, index);
        });

        // === Обновляем ячейки матчей (по id)
        Object.entries(group.results || {}).forEach(([playerAId, opponents]) => {
            Object.entries(opponents).forEach(([playerBId, score]) => {
                const rowIndex = rowMap.get(playerAId);
                const colIndex = rowMap.get(playerBId);
                if (rowIndex === undefined || colIndex === undefined) return;

                const cell = table.querySelector(`td[data-row="${rowIndex}"][data-col="${colIndex}"]`);
                const reverseCell = table.querySelector(`td[data-row="${colIndex}"][data-col="${rowIndex}"]`);

                if (cell) cell.textContent = score;
                if (reverseCell) reverseCell.textContent = reverseScore(score);
            });
        });

        // === Обновляем очки и места
        (group.stats || []).forEach(stat => {
            const row = table.querySelector(`tr[data-player-id="${stat.playerId}"]`);
            if (!row) return;

            const pointsCell = row.querySelector('.points');
            const placeCell = row.querySelector('.place');

            if (pointsCell) pointsCell.textContent = stat.points;
            if (placeCell) placeCell.textContent = stat.groupPlace;
        });
    });
}


// Вспомогательная функция для разворота счёта
function reverseScore(scoreText) {
    const [a, b] = scoreText.split(':').map(Number);
    if (isNaN(a) || isNaN(b)) return '';
    return `${b}:${a}`;
}

export function saveGroupBasedMatchResult(pair, player1Score, player2Score, playingDiv, allParticipants) {
    const groupIndexAttr = playingDiv.getAttribute('data-group-index');
    const groupIndex = groupIndexAttr ? parseInt(groupIndexAttr) : null;
    if (groupIndex === null) return;

    const player1Id = pair.player1.id;
    const player2Id = pair.player2.id;
    const scoreDirect = `${player1Score}:${player2Score}`;
    const scoreReverse = `${player2Score}:${player1Score}`;

    // Инициализируем глобальное хранилище результатов
    window.groupFinalResults = window.groupFinalResults || [];

    let group = window.groupFinalResults.find(g => g.groupIndex === groupIndex);
    if (!group) {
        group = {
            groupIndex,
            results: {}, // results[playerId1][playerId2] = "3:1"
            stats: []
        };
        window.groupFinalResults.push(group);
    }

    // Инициализируем вложенные объекты
    group.results[player1Id] = group.results[player1Id] || {};
    group.results[player2Id] = group.results[player2Id] || {};

    // Сохраняем счёт
    group.results[player1Id][player2Id] = scoreDirect;
    group.results[player2Id][player1Id] = scoreReverse;

    // Получаем список всех игроков этой группы
    const groupWrapper = document.querySelector(`.tournament-wrapper[data-group-index="${groupIndex}"]`);
    const rows = Array.from(groupWrapper.querySelectorAll('tr'));
    const groupPlayers = [];

    rows.forEach(row => {
        const id = row.getAttribute('data-player-id');
        const player = allParticipants.find(p => p.id === id);
        if (player) {
            groupPlayers.push({
                ...player,
                totalPoints: 0,
                setsWon: 0,
                setsLost: 0,
                wins: 0,
                losses: 0,
                groupPoints: 0,
                groupWins: 0,
                groupLosses: 0,
                groupSetsWon: 0,
                groupSetsLost: 0
            });
            
        }
    });

    // Пересчёт очков и сетов по results[playerA][playerB]
    groupPlayers.forEach(player => {
        const pid = player.id;
        const vs = group.results[pid] || {};

        Object.entries(vs).forEach(([opponentId, score]) => {
            const [a, b] = score.split(':').map(Number);
            if (isNaN(a) || isNaN(b)) return;

            player.setsWon += a;
            player.setsLost += b;
            player.groupSetsWon += a;
            player.groupSetsLost += b;
            if (a > b) { 
                player.totalPoints += 2;
                player.wins +=1;
                player.groupPoints += 2;
                player.groupWins +=1;
            }
            else {
                player.totalPoints += 1; // за поражение
                player.losses +=1;
                player.groupPoints += 1; // за поражение
                player.groupLosses +=1;
            }
        });
    });

    // Считаем места через твою функцию
    const standings = determineGroupFinalStandings(groupPlayers, group.results);
    group.stats = standings.map(p => ({
        playerId: p.id,
        points: p.totalPoints,
        // place: p.place,
        setsWon: p.setsWon,
        setsLost: p.setsLost,
        wins: p.wins,
        losses: p.losses,
        groupPlace: p.groupPlace,
        groupWins: p.wins,
        groupLosses: p.losses,
        groupSetsWon: p.groupSetsWon,
        groupSetsLost: p.groupSetsLost,
        groupPoints: p.groupPoints
    }));
    standings.forEach(player => {
        const original = window.selectedPlayers.find(p => p.id === player.id);
        if (original) {
            original.groupPoints = player.groupPoints;
            original.groupPlace = player.groupPlace;
            original.groupWins = player.groupWins;
            original.groupLosses = player.groupLosses;
            original.groupSetsWon = player.groupSetsWon;
            original.groupSetsLost = player.groupSetsLost;

            original.totalPoints = player.totalPoints;
            // original.place = player.place;
            original.wins = player.wins;
            original.losses = player.losses;
            original.setsWon = player.setsWon;
            original.setsLost = player.setsLost;
        }
    
        // const vs = group.results[player.id] || {};
        // Object.values(vs).forEach(score => {
        //     const [a, b] = score.split(':').map(Number);
        //     if (!isNaN(a) && !isNaN(b)) {
        //         if (a > b) {
        //             original.groupWins += 1;
        //         } else {
        //             original.groupLosses += 1;
        //         }
        //     }
        // });
    });

    // console.log('group', group);
    // console.log('standing:', standings);
    renderGroupResults(window.groupFinalResults);
}


export function determineGroupFinalStandings(players, resultsById) {
    const enriched = players.map(player => ({
        ...player,
        setsWon: 0,
        setsLost: 0,
        totalPoints: 0,
        groupSetsWon: 0,
        groupSetsLost: 0,
        groupPoints: 0
    }));

    // Подсчёт очков и сетов
    enriched.forEach(player => {
        const results = resultsById[player.id] || {};
        Object.entries(results).forEach(([opponentId, score]) => {
            const [a, b] = score.split(':').map(Number);
            if (isNaN(a) || isNaN(b)) return;

            player.setsWon += a;
            player.setsLost += b;
            player.totalPoints += a > b ? 2 : 1;
            player.groupSetsWon += a;
            player.groupSetsLost += b;
            player.groupPoints += a > b ? 2 : 1;
        });
    });

    // 1️⃣ Сортируем по totalPoints
    enriched.sort((a, b) => b.totalPoints - a.totalPoints);

    // 2️⃣ Группируем по равным очкам
    const grouped = [];
    let group = [enriched[0]];
    for (let i = 1; i < enriched.length; i++) {
        if (enriched[i].groupPoints === enriched[i - 1].groupPoints) {
            group.push(enriched[i]);
        } else {
            grouped.push(group);
            group = [enriched[i]];
        }
    }
    grouped.push(group);

    // 3️⃣ Внутри групп сортируем по личным встречам и соотношению сетов
    grouped.forEach(group => {
        if (group.length > 1) {
            group.sort((a, b) => {
                const headToHead = compareById(a.id, b.id, resultsById);
                if (headToHead !== 0) return headToHead;

                const ratioA = setRatioById(a.id, group, resultsById);
                const ratioB = setRatioById(b.id, group, resultsById);
                return ratioB - ratioA;
            });
        }
    });

    const finalList = grouped.flat();

    // 4️⃣ Проставляем места
    finalList.forEach((player, index) => {
        player.groupPlace = index + 1;
        player.place = index + 1;
    });

    console.log('finalList', finalList);
    return finalList;
}

function compareById(idA, idB, resultsById) {
    const score = resultsById[idA]?.[idB];
    if (!score) return 0;
    const [a, b] = score.split(':').map(Number);
    return b - a;
}

function setRatioById(playerId, group, resultsById) {
    let won = 0, lost = 0;
    for (const other of group) {
        if (other.id === playerId) continue;
        const score = resultsById[playerId]?.[other.id];
        if (score) {
            const [a, b] = score.split(':').map(Number);
            won += a;
            lost += b;
        }
    }
    return won / Math.max(lost, 1); // избегаем деления на 0
}

export function areAllGroupMatchesFinished(groupFinalResults) {
    if (!Array.isArray(groupFinalResults) || groupFinalResults.length === 0) return false;

    for (const group of groupFinalResults) {
        const results = group.results || {};
        const groupIndex = group.groupIndex;

        // Берём игроков из DOM таблицы группы
        const groupWrapper = document.querySelector(`.tournament-wrapper[data-group-index="${groupIndex}"]`);
        if (!groupWrapper) return false;

        const rows = Array.from(groupWrapper.querySelectorAll('tr[data-player-id]'));
        const playerIds = rows.map(row => row.getAttribute('data-player-id'));

        if (playerIds.length < 2) return false;

        for (let i = 0; i < playerIds.length; i++) {
            for (let j = i + 1; j < playerIds.length; j++) {
                const idA = playerIds[i];
                const idB = playerIds[j];

                const hasAtoB = results[idA]?.[idB];
                const hasBtoA = results[idB]?.[idA];

                if (!hasAtoB || !hasBtoA) {
                    return false; // хотя бы одна пара не сыграна
                }
            }
        }
    }

    return true;
}

// export function areAllGroupMatchesFinished(groupFinalResults) {
//     if (!Array.isArray(groupFinalResults) || groupFinalResults.length === 0) return false;

//     for (const group of groupFinalResults) {
//         const results = group.results || {};
//         const playerIds = (group.stats || []).map(p => p.playerId);

//         if (playerIds.length < 2) return false;

//         for (let i = 0; i < playerIds.length; i++) {
//             for (let j = i + 1; j < playerIds.length; j++) {
//                 const idA = playerIds[i];
//                 const idB = playerIds[j];

//                 const hasAtoB = results[idA]?.[idB];
//                 const hasBtoA = results[idB]?.[idA];

//                 if (!hasAtoB || !hasBtoA) {
//                     return false; // хотя бы одна пара не сыграна в этой группе
//                 }
//             }
//         }
//     }

//     return true; // все группы и все пары сыграны
// }

export function generateGroupOlympicRounds(finalists, numberOfGroups) {
    const playersPerGroup = finalists.length / numberOfGroups;

    // 1. Группируем по groupIndex и сортируем по groupPlace
    const groups = Array.from({ length: numberOfGroups }, (_, i) => {
        return finalists
            .filter(p => p.groupIndex === i)
            .sort((a, b) => a.groupPlace - b.groupPlace);
    });

    // 2. Строим пары перекрестно
    const pairs = [];
    for (let i = 0; i < playersPerGroup; i++) {
        for (let g = 0; g < numberOfGroups / 2; g++) {
            const groupA = groups[g];
            const groupB = groups[numberOfGroups - 1 - g];

            const player1 = groupA[i];
            const player2 = groupB[playersPerGroup - 1 - i];

            if (player1 && player2) {
                pairs.push({ player1, player2 });
            }
        }
    }

    // 3. Дополняем до степени двойки
    const paddedCount = Math.pow(2, Math.ceil(Math.log2(pairs.length * 2)));
    const totalRounds = Math.log2(paddedCount);
    const rounds = [];

    const firstRoundPairs = [...pairs];
    const byeNeeded = paddedCount / 2 - pairs.length;

    for (let i = 0; i < byeNeeded; i++) {
        firstRoundPairs.push({
            player1: {
                id: `bye_${i}`,
                fullname: 'BYE',
                logo: '/icons/playerslogo/default_avatar.svg',
                isBye: true
            },
            player2: {
                id: `bye_${i}_b`,
                fullname: 'BYE',
                logo: '/icons/playerslogo/default_avatar.svg',
                isBye: true
            }
        });
    }

    rounds.push({ pairs: firstRoundPairs });

    // --- Автогенерация следующих раундов
    for (let roundIndex = 1; roundIndex <= totalRounds; roundIndex++) {
        const prevRound = rounds[roundIndex - 1];
        const nextRoundPairs = [];

        for (let i = 0; i < prevRound.pairs.length; i += 2) {
            const pair1 = prevRound.pairs[i];
            const pair2 = prevRound.pairs[i + 1];

            // Победитель из пары 1
            const winner1 = getAutoWinner(pair1);
            const winner2 = getAutoWinner(pair2);

            nextRoundPairs.push({
                player1: winner1,
                player2: winner2
            });
        }

        rounds.push({ pairs: nextRoundPairs });
    }

    // 4. Генерация последующих раундов
    // for (let r = 1; r < totalRounds; r++) {
    //     const prev = rounds[r - 1];
    //     const nextPairs = [];

    //     for (let i = 0; i < prev.pairs.length; i += 2) {
    //         const winner1 = getAutoWinner(prev.pairs[i]);
    //         const winner2 = getAutoWinner(prev.pairs[i + 1]);

    //         nextPairs.push({ player1: winner1, player2: winner2 });
    //     }

    //     rounds.push({ pairs: nextPairs });
    // }
    console.log('rounds', rounds);
    return rounds;
}


function getAutoWinner(pair) {
    if (!pair) return {};
    const { player1, player2 } = pair;

    if (player1?.isBye && !player2?.isBye) return player2;
    if (player2?.isBye && !player1?.isBye) return player1;
    return {}; // оба реальные — результат будет после игры
}





export function getTopPlayersFromGroups(groupFinalResults, playersPerGroupToFinal, allPlayers) {
    const finalists = [];
    const groupMap = {};
    console.log('входящие значения:', groupFinalResults, playersPerGroupToFinal, allPlayers );
    groupFinalResults.forEach(group => {
        const top = group.stats
            .sort((a, b) => a.groupPlace - b.groupPlace)
            .slice(0, playersPerGroupToFinal);

        top.forEach(stat => {
            const full = allPlayers.find(p => p.id === stat.playerId);
            if (full) finalists.push(full);
        });
    });

    groupFinalResults?.forEach(group => {
        group.stats?.forEach(playerStat => {
          groupMap[playerStat.playerId] = group.groupIndex;
        });
    });

    finalists?.forEach(player => {
        if (groupMap[player.id] !== undefined) {
          player.groupIndex = groupMap[player.id];
        }
      });

    return finalists;
}
