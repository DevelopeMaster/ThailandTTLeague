export function generateOlympicPairs(players) {
    // Сортировка по рейтингу по убыванию
    const sorted = [...players].sort((a, b) => b.rating - a.rating);
    const pairs = [];

    // Если количество нечётное, добавим виртуального игрока с bye
    if (sorted.length % 2 !== 0) {
        sorted.push({
            _id: 'bye',
            fullname: 'BYE',
            city: ' - ',
            rating: 0,
            unrated: true,
            isBye: true
        });
    }

    const half = sorted.length / 2;
    for (let i = 0; i < half; i++) {
        const p1 = sorted[i];
        const p2 = sorted[sorted.length - 1 - i];
        pairs.push({ player1: p1, player2: p2 });
    }

    return pairs;
}











// куча BYE игроков добавится 
// export function generateOlympicPairs(players) {
//     const sorted = [...players].sort((a, b) => b.rating - a.rating);

//     // 1. Расширяем до степени двойки
//     const paddedCount = Math.pow(2, Math.ceil(Math.log2(sorted.length)));

//     // 2. Добавляем BYE игроков (если не хватает)
//     const playersWithByes = [...sorted];
//     const byeCount = paddedCount - sorted.length;

//     for (let i = 0; i < byeCount; i++) {
//         playersWithByes.push({
//             id: `bye_${i}`,
//             fullname: 'BYE',
//             city: ' - ',
//             logo: '/icons/playerslogo/default_avatar.svg',
//             isBye: true,
//             rating: 0,
//         });
//     }

//     // 3. Формируем пары
//     const pairs = [];
//     for (let i = 0; i < paddedCount / 2; i++) {
//         const p1 = playersWithByes[i];
//         const p2 = playersWithByes[paddedCount - 1 - i];
//         pairs.push({ player1: p1, player2: p2 });
//     }

//     return pairs;
// } 

export function generateOlympicRounds(players) {
    const sorted = [...players].sort((a, b) => b.rating - a.rating);
    const paddedCount = Math.pow(2, Math.ceil(Math.log2(sorted.length)));
    const playersWithByes = [...sorted];

    const byeCount = paddedCount - sorted.length;
    for (let i = 0; i < byeCount; i++) {
        playersWithByes.push({
            id: `bye_${i}`,
            fullname: 'BYE',
            logo: '/icons/playerslogo/default_avatar.svg',
            isBye: true,
            rating: 0
        });
    }

    const totalRounds = Math.log2(paddedCount);
    const rounds = [];

    // --- Round 1: начальные пары
    const firstRoundPairs = [];
    for (let i = 0; i < paddedCount / 2; i++) {
        const p1 = playersWithByes[i];
        const p2 = playersWithByes[paddedCount - 1 - i];
        firstRoundPairs.push({ player1: p1, player2: p2 });
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

    return rounds;
}

// Возвращает игрока, если один из них BYE, иначе null
function getAutoWinner(pair) {
    if (!pair) return {};
    const { player1, player2 } = pair;

    if (player1?.isBye && !player2?.isBye) return player2;
    if (player2?.isBye && !player1?.isBye) return player1;
    return {}; // оба реальные — результат будет после игры
}



export function generateOlympicPairsAndWaiting(players) {
    const sorted = [...players].sort((a, b) => b.rating - a.rating);
    const paddedCount = Math.pow(2, Math.ceil(Math.log2(sorted.length)));

    const playersWithByes = [...sorted];
    const byeCount = paddedCount - sorted.length;

    for (let i = 0; i < byeCount; i++) {
        playersWithByes.push({
            id: `bye_${i}`,
            fullname: 'BYE',
            logo: '/icons/playerslogo/default_avatar.svg',
            isBye: true,
            rating: 0
        });
    }

    const pairs = [];
    const waitingOlympicPairs = [];

    for (let i = 0; i < paddedCount / 2; i++) {
        const p1 = playersWithByes[i];
        const p2 = playersWithByes[paddedCount - 1 - i];
        const pair = { player1: p1, player2: p2 };
        pairs.push(pair);

        const hasBye = p1.isBye || p2.isBye;

        if (!hasBye) {
            // Ждут игры — настоящие игроки
            waitingOlympicPairs.push({
                player1Id: p1.id,
                player2Id: p2.id,
                table: null,
                round: 1
            });
        }
        // Игры с BYE обрабатываются отдельно и победитель сразу пойдет дальше
    }

    return {
        pairs,         // для rounds[0]
        waitingOlympicPairs   // для отображения в "ожидающих"
    };
}



export function renderOlympicGrid(rounds, containerSelector, totalPlayersCount) {
    const container = document.querySelector(`${containerSelector} .tournament-wrapper`);
    container.innerHTML = '';

    // Дополняем число участников до степени двойки
    const paddedCount = Math.pow(2, Math.ceil(Math.log2(totalPlayersCount)));
    // Количество раундов: log2(paddedCount) + 1 (последняя колонка – победитель)
    const totalRounds = Math.log2(paddedCount) + 1;

    const roundsWrapper = document.createElement('div');
    roundsWrapper.className = 'olympic-rounds';

    // Проходим по раундам
    for (let roundIndex = 0; roundIndex < totalRounds; roundIndex++) {
        // Если данные о раунде нет – создаём пустой объект
        const round = rounds[roundIndex] || { pairs: [] };
        const roundDiv = document.createElement('div');
        roundDiv.className = 'olympic-round';
        roundDiv.setAttribute('data-round', roundIndex + 1);
        roundDiv.innerHTML = `<div class="olympic-round_title">Round ${roundIndex + 1}</div>`;

        // Рассчитываем число матчей в раунде
        let expectedMatches;
        if (roundIndex < totalRounds - 1) {
            expectedMatches = paddedCount / Math.pow(2, roundIndex + 1);
        } else {
            expectedMatches = 1; // финальная колонка: один слот для победителя
        }

        // Рендер каждого матча в раунде
        for (let i = 0; i < expectedMatches; i++) {
            const pair = round.pairs[i] || {};
            const player1 = pair.player1 || {};
            const player2 = pair.player2 || {};

            const matchDiv = document.createElement('div');
            matchDiv.className = 'olympic-round_match';
            // Добавляем data-атрибуты для удобства поиска
            matchDiv.setAttribute('data-round', roundIndex + 1);
            matchDiv.setAttribute('data-match-index', i + 1);

            if (roundIndex === totalRounds - 1) {
                // Последний раунд: отображаем только победителя (player1)
                const showTrophy = player1?.id && !pair.score1 && !pair.score2;
                matchDiv.innerHTML = `
                    <div class="olympic-round_match_pair">
                        <div class="olympic-round_match_pair_player olympic-round_match_pair_player_winner" data-id="${player1.id || ''}" '>
                            <div class="olympic-round_match_pair_player_wrapper">
                                <div class="olympic-round_match_pair_player_logo" style="background-image: url(${player1.logo || '/icons/playerslogo/default_avatar.svg'})"></div>
                                <span>${player1.fullname || player1.name || '—'}</span>
                            </div>
                            <span class="olympic-round_match_pair_player_score ${showTrophy ? 'trophy-icon' : ''}">
                                ${showTrophy ? '🏆' : ''}
                            </span>
                        </div>
                    </div>
                `;
            } else {
                // Обычные раунды: две стороны (player1 и player2)
                const score1 = pair.score1;
                const score2 = pair.score2;

                const p1ScoreClass = (score1 != null && score2 != null && score1 > score2) ? 'score-winner' : '';
                const p2ScoreClass = (score1 != null && score2 != null && score2 > score1) ? 'score-winner' : '';

                matchDiv.innerHTML = `
                    <div class="olympic-round_match_pair">
                        <div class="olympic-round_match_pair_player player1" data-id="${player1.id || ''}">
                            <div class="olympic-round_match_pair_player_wrapper">
                                <div class="olympic-round_match_pair_player_logo" style="background-image: url(${player1.logo || '/icons/playerslogo/default_avatar.svg'})"></div>
                                <span>${player1.fullname || player1.name || '—'}</span>
                            </div>
                            <span class="olympic-round_match_pair_player_score ${p1ScoreClass}">${pair.score1 ?? ''}</span>
                        </div>
                        <div class="olympic-round_match_pair_player player2" data-id="${player2.id || ''}">
                            <div class="olympic-round_match_pair_player_wrapper" >
                                <div class="olympic-round_match_pair_player_logo" style="background-image: url(${player2.logo || '/icons/playerslogo/default_avatar.svg'})"></div>
                                <span>${player2.fullname || player2.name || '—'}</span>
                            </div>
                            <span class="olympic-round_match_pair_player_score ${p2ScoreClass}">${pair.score2 ?? ''}</span>
                        </div>
                    </div>
                `;
            }
            // Если это не первый раунд – добавляем соединительный элемент слева
            if (roundIndex > 0) {
                const connector = document.createElement('span');
                connector.className = 'olympic-line-left';
                matchDiv.appendChild(connector);
            }

            roundDiv.appendChild(matchDiv);
        }
        roundsWrapper.appendChild(roundDiv);
    }

    container.appendChild(roundsWrapper);

    const allRounds = roundsWrapper.querySelectorAll('.olympic-round');

    if (allRounds.length >= 2) {
        const lastRound = allRounds[allRounds.length - 1];
        const finalRound = allRounds[allRounds.length - 2];

        // Берём margin-top финала
        const finalMargin = parseFloat(window.getComputedStyle(finalRound).marginTop) || 0;

        // Добавляем половину высоты пары (чтобы победитель стал по центру)
        const marginTopForWinner = finalMargin + 20.5;

        lastRound.style.marginTop = `${marginTopForWinner}px`;
    }
}


// export function calculateOlympicStandings(finishedPairs, totalRounds) {
//     const eliminatedPlayers = new Map(); // key: playerId, value: { player, roundOut }

//     finishedPairs.forEach(pair => {
//         const { player1, player2, score1, score2, round } = pair;
//         if (!player1?.id || !player2?.id) return;

//         const loser = score1 > score2 ? player2 : player1;

//         // Сохраняем раунд, в котором он вылетел
//         if (!eliminatedPlayers.has(loser.id) || eliminatedPlayers.get(loser.id).roundOut < round) {
//             eliminatedPlayers.set(loser.id, {
//                 player: loser,
//                 roundOut: round
//             });
//         }
//     });

//     // Победитель финала (ещё не вылетел)
//     const finalMatch = finishedPairs.find(p => p.round === totalRounds - 1);
//     const winner = finalMatch.score1 > finalMatch.score2 ? finalMatch.player1 : finalMatch.player2;

//     // Финальный список с местами
//     const playersWithPlaces = [];

//     playersWithPlaces.push({ player: winner, place: 1 });

//     const second = finalMatch.score1 > finalMatch.score2 ? finalMatch.player2 : finalMatch.player1;
//     playersWithPlaces.push({ player: second, place: 2 });

//     // Группируем по раундам, где вылетели
//     const grouped = {};
//     for (let [id, data] of eliminatedPlayers.entries()) {
//         const round = data.roundOut;
//         if (!grouped[round]) grouped[round] = [];
//         grouped[round].push(data.player);
//     }

//     // let currentPlace = 3;
//     // for (let round = totalRounds - 2; round >= 1; round--) {
//     //     if (!grouped[round]) continue;
//     //     grouped[round].forEach(p => {
//     //         playersWithPlaces.push({ player: p, place: currentPlace });
//     //     });
//     //     currentPlace += grouped[round].length;
//     // }
//     let currentPlace = 3;

//     for (let round = totalRounds - 2; round >= 1; round--) {
//         if (!grouped[round]) continue;

//         const group = grouped[round];

//         group.forEach(p => {
//             playersWithPlaces.push({ player: p, place: currentPlace });
//             currentPlace++;
//         });
//     }

//     return playersWithPlaces;
// }

export function calculateOlympicStandings(finishedPairs, totalRounds) {
    const eliminatedPlayers = new Map();

    finishedPairs.forEach(pair => {
        const { player1, player2, score1, score2, round } = pair;
        if (!player1?.id || !player2?.id) return;

        const loser = score1 > score2 ? player2 : player1;

        if (!eliminatedPlayers.has(loser.id) || eliminatedPlayers.get(loser.id).roundOut < round) {
            eliminatedPlayers.set(loser.id, {
                player: loser,
                roundOut: round
            });
        }
    });

    const finalMatch = finishedPairs.find(p => p.round === totalRounds - 1);
    const winner = finalMatch.score1 > finalMatch.score2 ? finalMatch.player1 : finalMatch.player2;
    const second = finalMatch.score1 > finalMatch.score2 ? finalMatch.player2 : finalMatch.player1;
    
    const playersWithPlaces = [];
    playersWithPlaces.push({ player: winner, place: 1 });
    playersWithPlaces.push({ player: second, place: 2 });
    console.log('playersWithPlaces', playersWithPlaces);
    // Группируем проигравших по раунду вылета
    const grouped = {};
    for (let [id, data] of eliminatedPlayers.entries()) {
        const round = data.roundOut;
        if (!grouped[round]) grouped[round] = [];
        grouped[round].push(data.player);
    }

    // Двигаемся от раундов ближе к финалу — к началу
    let currentPlace = 3;
    for (let round = totalRounds - 2; round >= 1; round--) {
        if (!grouped[round]) continue;

        const group = grouped[round];
        group.forEach(p => {
            playersWithPlaces.push({ player: p, place: currentPlace });
        });

        // Место увеличиваем только на 1 — все в группе делят это место
        currentPlace += 1;
    }

    return playersWithPlaces;
}



export function getOlympicPlayerStats(finishedPairs) {
    const stats = {};

    finishedPairs.forEach(pair => {
        const { player1, player2, score1, score2 } = pair;

        if (!player1?.id || !player2?.id) return;

        [player1, player2].forEach(player => {
            if (!stats[player.id]) {
                stats[player.id] = {
                    player,
                    games: 0,
                    wins: 0,
                    losses: 0,
                    setsWon: 0,
                    setsLost: 0
                };
            }
        });

        stats[player1.id].games++;
        stats[player2.id].games++;

        if (score1 > score2) {
            stats[player1.id].wins++;
            stats[player2.id].losses++;
        } else {
            stats[player2.id].wins++;
            stats[player1.id].losses++;
        }

        // Подсчёт сетов на основе счёта
        stats[player1.id].setsWon += score1;
        stats[player1.id].setsLost += score2;

        stats[player2.id].setsWon += score2;
        stats[player2.id].setsLost += score1;
    });

    return stats;
}

// 
// 
// function getOlympicPlayerStats(finishedPairs) {
//     const stats = {};

//     finishedPairs.forEach(pair => {
//         const { player1, player2, score1, score2, sets } = pair;

//         if (!player1?.id || !player2?.id) return;

//         [player1, player2].forEach(player => {
//             if (!stats[player.id]) {
//                 stats[player.id] = {
//                     player,
//                     games: 0,
//                     wins: 0,
//                     losses: 0,
//                     setsWon: 0,
//                     setsLost: 0
//                 };
//             }
//         });

//         stats[player1.id].games++;
//         stats[player2.id].games++;

//         if (score1 > score2) {
//             stats[player1.id].wins++;
//             stats[player2.id].losses++;
//         } else {
//             stats[player2.id].wins++;
//             stats[player1.id].losses++;
//         }

//         // Подсчёт сетов (если есть)
//         if (sets && Array.isArray(sets)) {
//             sets.forEach(set => {
//                 const [s1, s2] = set.split('-').map(Number);
//                 if (!isNaN(s1) && !isNaN(s2)) {
//                     stats[player1.id].setsWon += s1;
//                     stats[player1.id].setsLost += s2;
//                     stats[player2.id].setsWon += s2;
//                     stats[player2.id].setsLost += s1;
//                 }
//             });
//         }
//     });

//     return stats;
// }




























// export function renderOlympicGrid(rounds, containerSelector, totalPlayersCount) {
//     const container = document.querySelector(`${containerSelector} .tournament-wrapper`);
//     container.innerHTML = '';

//     const totalRounds = Math.ceil(Math.log2(totalPlayersCount)) + 1;

//     const roundsWrapper = document.createElement('div');
//     roundsWrapper.className = 'olympic-rounds';

//     for (let roundIndex = 0; roundIndex < totalRounds; roundIndex++) {
//         const round = rounds[roundIndex] || { pairs: [] };
//         const roundDiv = document.createElement('div');
//         roundDiv.className = 'olympic-round';
//         roundDiv.innerHTML = `<div class="olympic-round_title">Round ${roundIndex + 1}</div>`;

//         const expectedMatches = Math.max(1, Math.pow(2, totalRounds - roundIndex - 2));

//         for (let i = 0; i < expectedMatches; i++) {
//             const pair = round.pairs[i] || {};
//             const player1 = pair.player1 || {};
//             const player2 = pair.player2 || {};

//             const matchDiv = document.createElement('div');
//             matchDiv.className = 'olympic-round_match';

//             if (roundIndex === totalRounds - 1) {
//                 // Финальный слот: только победитель
//                 matchDiv.innerHTML = `
//                     <div class="olympic-round_match_pair">
//                         <div class="olympic-round_match_pair_player lympic-round_match_pair_player_winner winner">
//                             <div class="olympic-round_match_pair_player_wrapper" data-id="${player1.id || ''}">
//                                 <img src="${player1.logo || '/icons/playerslogo/default_avatar.svg'}">
//                                 <span>${player1.fullname || player1.name || '—'}</span>
//                             </div>
//                             <span class="olympic-round_match_pair_player_score">${pair.score1 ?? '0'}</span>
//                         </div>
//                     </div>
//                 `;
//             } else {
//                 // Все обычные раунды: две стороны
//                 matchDiv.innerHTML = `
//                     <div class="olympic-round_match_pair">
//                         <div class="olympic-round_match_pair_player player1">
//                             <div class="olympic-round_match_pair_player_wrapper" data-id="${player1.id || ''}">
//                                 <img src="${player1.logo || '/icons/playerslogo/default_avatar.svg'}">
//                                 <span>${player1.fullname || player1.name || '—'}</span>
//                             </div>
//                             <span class="olympic-round_match_pair_player_score">${pair.score1 ?? '0'}</span>
//                         </div>
//                         <div class="olympic-round_match_pair_player player2">
//                             <div class="olympic-round_match_pair_player_wrapper" data-id="${player2.id || ''}">
//                                 <img src="${player2.logo || '/icons/playerslogo/default_avatar.svg'}">
//                                 <span>${player2.fullname || player2.name || '—'}</span>
//                             </div>
//                             <span class="olympic-round_match_pair_player_score">${pair.score2 ?? '0'}</span>
//                         </div>
//                     </div>
//                 `;
//             }
//             if (roundIndex > 0) {
//                 const connector = document.createElement('span');
//                 connector.className = 'olympic-line-left';
//                 matchDiv.appendChild(connector);
//             }

//             roundDiv.appendChild(matchDiv);
//         }

//         roundsWrapper.appendChild(roundDiv);
//     }

//     container.appendChild(roundsWrapper);
// }



