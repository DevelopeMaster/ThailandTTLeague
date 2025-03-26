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
    const userId = document.querySelector('.startTournament').dataset.userid;
    let tournamentId = document.querySelector('.startTournament').dataset.tournamentid;
  
    initializeApp();
    
    languageControl();

    listenerOfButtons();

    const currentPath = window.location.pathname;

    const parts = currentPath.split('/');
    const lang = parts[1];
    const clubId = userId;
    let club;
    let tournaments;
    let ratingLimit;

    console.log('user:', userId, 'tournament:', tournamentId );

    async function fetchClubData() {
        try {
            const response = await fetch(`/get-data-club?clubId=${clubId}`);
            if (!response.ok) {
                throw new Error('Club not found');
            }
            return  response.json();
            // clubCity = await getCityName(club.city);
        } catch (error) {
            console.error('Error fetching club data:', error);
        }
    }

    const clubData = await fetchClubData();
    
    const translations = {
        'en': {
            'no one': 'No players found',
        },
        'ru': {
            'no one': 'Игроки не найдены',
        },
        'th': {
            'no one': 'ไม่พบผู้เล่น',
        }
    };

    function getTranslation(key) {
        return translations[lang][key] || translations['en'][key];
    }

    window.addDots = function(input) {
        let value = input.value;
        let length = value.length;
        
        if (isNaN(value.replace(/\./g, ''))) {
            input.value = value.substring(0, length - 1);
            return;
        }
        if ((length === 2 || length === 5) && !isNaN(value[length - 1])) {
            input.value += '.';
        }
        if (length === 10) {
            let parts = value.split(".");
            const enteredDate = new Date(parts[2], parts[1] - 1, parts[0]);
            const today = new Date().setHours(0, 0, 0, 0);
            if (enteredDate >= today) {
                alert("Date of birth is not correct");
                input.value = "";
            }
        }
    }

    

    

    let tournamentData = await fetchTournament(tournamentId);
    let waitingPairs = tournamentData.waitingPairs || [];
    let currentPairs = tournamentData.currentPairs || [];
    let finishedPairs = tournamentData.finishedPairs || [];
    let roundCounter = tournamentData.roundCounter || 1;
    const numberOfTabels = document.querySelector('#numberOfTables');
    numberOfTabels.value = `${clubData.tables}`;
    const ratingLimitInput = document.querySelector('#ratingLimit');
    ratingLimitInput.value = `${ratingLimit}`;

    const inputTypeOfTournament = document.querySelector('#typeOfTournamentInput');
    const dropdownTypeOfTournament = document.querySelector('#typeOfTournamentDropdown');
    const dropdownItems = dropdownTypeOfTournament.querySelectorAll('div');
    let selectedType = tournamentData.typeOfTournament || 'roundRobin';

    dropdownItems.forEach(item => {
        if (item.getAttribute('data-type') === selectedType) {
            inputTypeOfTournament.value = item.textContent;
            const displayHeader = document.querySelector('.display_header h3');
            displayHeader.textContent = item.textContent;
        }
    })

    // Открытие/закрытие выпадающего списка
    inputTypeOfTournament.addEventListener('click', () => {
        dropdownTypeOfTournament.style.display =
            dropdownTypeOfTournament.style.display === 'none' ? 'block' : 'none';
    });
    // Выбор элемента из списка
    dropdownItems.forEach(item => {
        item.addEventListener('click', () => {
            inputTypeOfTournament.value = item.textContent;
            selectedType = item.getAttribute('data-type');
            const displayHeader = document.querySelector('.display_header h3');
            displayHeader.textContent = item.textContent;
            dropdownTypeOfTournament.style.display = 'none';
        });
    });
    // Закрытие выпадающего списка при клике вне его
    document.addEventListener('click', (event) => {
        if (!dropdownTypeOfTournament.contains(event.target) && event.target !== inputTypeOfTournament) {
            dropdownTypeOfTournament.style.display = 'none';
        }
    });

    
    

    const input = document.getElementById('playerSearchInput');
    const dropdown = document.getElementById('headerPlayerDropdown');
    let allplayers = [];
    let results = {};
    let round1Results = {};
    let round2Results = {};
    let averageRating;
    let tournamentCoefficient;
    let allParticipants;
    let standingsGlobal;
    let byUser = false;

    await fetchAllPlayers();
    
    input.addEventListener('focus', handleFocus);

    function handleFocus() {
        if (allplayers.length > 0) {
            renderDropdown(allplayers);
        }
    }
    
    input.addEventListener('input', () => {
        const query = input.value.toLowerCase().trim();
    
        if (query === '') {
            renderDropdown(allplayers);
            return;
        }
    
        const filteredPlayers = allplayers.filter(player => 
            player.name.toLowerCase().includes(query) || 
            player.cityName.toLowerCase().includes(query)
        );
    
        renderDropdown(filteredPlayers);
    });
    
    document.addEventListener('click', (e) => {
        if (!e.target.closest('#searchPlayerLabel')) {
            dropdown.style.display = 'none';
        }
    });

    async function fetchAllPlayers() {
        try {
            const response = await fetch(`/get-players-with-city?lang=${language}`);
            const players = await response.json();
            allplayers = players;
        } catch (error) {
            console.error('Произошла ошибка:', error);
            showErrorModal('Database connection error', 'Ops!');
            return [];
        }
    }
   

    function renderDropdown(allplayers) {
        dropdown.innerHTML = '';
        if (allplayers.length === 0) {
            dropdown.innerHTML = `<div>${getTranslation('no one')}</div>`;
            return;
        }
        dropdown.style.display = 'block';

        allplayers.forEach((player) => {
            const playerDiv = document.createElement('div');
            const nameSpan = document.createElement('div');
            const yearSpan = document.createElement('div');
            const citySpan = document.createElement('div');
            nameSpan.textContent = `${player.name}`;
            yearSpan.textContent = `${Number.isFinite(player.rating) ? Math.round(player.rating) : ''}`;
            citySpan.textContent = `${player.cityName}`;
            playerDiv.appendChild(nameSpan);
            playerDiv.appendChild(yearSpan);
            playerDiv.appendChild(citySpan);
            dropdown.appendChild(playerDiv);
            playerDiv.addEventListener('click', () => {
                input.value = player.name;
                input.setAttribute('data-id', player.id);
                // Удаляем обработчик focus
                input.removeEventListener('focus', handleFocus);
                dropdown.style.display = 'none';
                // Восстанавливаем обработчик после небольшой задержки
                setTimeout(() => {
                    input.addEventListener('focus', handleFocus);
                }, 100);
            });
        });
    }

    let selectedPlayers = (tournamentData.players || []).map(player => {
        const fullPlayerData = allplayers.find(p => p.id === player.id);
        return fullPlayerData ? { ...player, ...fullPlayerData } : null; // Если игрок найден, объединяем данные
    }).filter(player => player !== null); // Удаляем игроков, которые не найдены в allplayers
   
    let retiredPlayers = (tournamentData.retiredPlayers || []).map(player => {
        const fullPlayerData = allplayers.find(p => p.id === player.id);
        return fullPlayerData ? { ...player, ...fullPlayerData } : null; // Если игрок найден, объединяем данные
    }).filter(player => player !== null);

    let unratedPlayersList = tournamentData.unratedPlayers || []; // Массив для внерейтинговых игроков
   
    if (tournamentData.results) {
        results = tournamentData.results; // Восстанавливаем сохранённые результаты
    }

    allParticipants = [...selectedPlayers, ...unratedPlayersList].sort((a, b) => (b.rating || 0) - (a.rating || 0));
    
    //добавление игрока в список
    const addPlayerButton = document.getElementById('addPlayertoTournament');
    const playerListContainer = document.querySelector('.startTournament_panelWrapp_players_registration_showPlayers');
    const retiredPlayerListContainer = document.querySelector('.startTournament_panelWrapp_players_retired_list');
    
    addPlayerButton.addEventListener('click', () => {
        const playerId = input.getAttribute('data-id'); // Получаем ID выбранного игрока из атрибута
        if (!playerId) {
            showErrorModal('Please select a player first.');
            return;
        }
        // Проверяем, есть ли игрок уже в списке
        if (
            selectedPlayers.some(player => player.id === playerId) ||
            retiredPlayers.some(player => player.id === playerId)
        ) {
            showErrorModal('This player is already in the list.');
            return;
        }
    
        // Находим игрока в массиве allplayers
        const player = allplayers.find(p => p.id === playerId);
        if (player) {
            // Проверяем наличие рейтинга
            if (player.rating === undefined || player.rating === null) {
                const ratingPrompt = prompt(`Enter rating for ${player.name} (${player.cityName}):`, '');
                if (ratingPrompt !== null && !isNaN(ratingPrompt)) {
                    player.rating = Number(ratingPrompt); // Устанавливаем введенный рейтинг
                    if (Number(player.rating) > Number(ratingLimit)) {
                        showErrorModal(`Player rating above the limit rating for this tournament (${ratingLimit}).`);
                        player.rating = '';
                        return;
                    }
                } else {
                    showErrorModal("You must enter a valid rating to add this player.");
                    return;
                }
            }
    
            // Проверяем рейтинг против лимита
            if (Number(player.rating) > Number(ratingLimit)) {
                showErrorModal(`Player rating above the limit rating for this tournament (${ratingLimit}).`);
                return;
            }
    
            // Добавляем игрока в список активных
            selectedPlayers.push({ ...player, retired: false });
            selectedPlayers.sort((a, b) => b.rating - a.rating);
            renderPlayerList(selectedPlayers, retiredPlayers, unratedPlayersList); // Перерисовываем списки
            input.value = ''; // Очищаем поле ввода
            input.removeAttribute('data-id'); // Удаляем атрибут data-id
            // saveTournament();
        } else {
            showErrorModal('Player not found.');
        }
        saveTournament(null, allParticipants);
    });

    // Функция для рендеринга списка активных и выбывших игроков
    function renderPlayerList(players, retired, unrated) {
        playerListContainer.innerHTML = '';
        retiredPlayerListContainer.innerHTML = '';
    
        // Разделяем игроков на рейтингованных и нерейтинговых
        const ratedPlayers = players.filter(player => player.rating !== undefined && !player.unrated);
        const unratedPlayers = unrated.filter(player => player.unrated === true);
    
        // Сортируем рейтингованных игроков по убыванию рейтинга
        const sortedRatedPlayers = [...ratedPlayers].sort((a, b) => (b.rating || 0) - (a.rating || 0));
    
        // Рендеринг активных рейтингованных игроков
        sortedRatedPlayers.forEach((player, index) => {
            const playerDiv = createPlayerDiv(player, index + 1);
            playerListContainer.appendChild(playerDiv);
        });
    
        // Рендеринг заголовка для нерейтинговых игроков
        if (unratedPlayers.length > 0) {
            const unratedHeader = document.createElement('div');
            unratedHeader.textContent = 'Unrated players';
            unratedHeader.classList.add('unrated-header');
            playerListContainer.appendChild(unratedHeader);
    
            // Рендеринг внерейтинговых игроков
            unratedPlayers.forEach((player, index) => {
                const playerDiv = createPlayerDiv(player, sortedRatedPlayers.length + index + 1);
                playerListContainer.appendChild(playerDiv);
            });
        }
    
        // Рендеринг выбывших игроков
        if (retired.length > 0) {
            retired.forEach((player, index) => {
                const playerDiv = createPlayerDiv(player, index + 1, true);
                retiredPlayerListContainer.appendChild(playerDiv);
            });
        }
    }

    // Функция для создания элемента игрока
    function createPlayerDiv(player, number, isRetired = false) {
        const playerDiv = document.createElement('div');
        playerDiv.classList.add('startTournament_panelWrapp_players_registration_showPlayers_item');
        const initialPlayer = tournamentData?.initialRatings?.find(p => p.id === player.id) || null;
        const initialPlayerRating = initialPlayer ? initialPlayer.rating : null;
       
        const playerRating = initialPlayerRating || player.rating;
        playerDiv.innerHTML = `
            <div class="number">
                <h3>${number}</h3>
            </div>
            <div class="name">
                <h3>${player.name  || player.fullname}</h3>
            </div>
            <div class="dob">
                <h3>${player.birthYear || player}</h3>
            </div>
            <div class="rating">
                <h3>${Number.isFinite(playerRating) ? Math.round(playerRating) : '-'}</h3>
            </div>
            <div class="city">
                <h3>${player.city || player.cityName}</h3>
            </div>
            <div class="cross">
                <img src="/icons/deleteCross.svg" alt="Delete" />
            </div>
        `;

        // Обработчик для удаления игрока
        playerDiv.querySelector('.cross img').addEventListener('click', () => {
            if (waitingPairs && waitingPairs.length > 0 || currentPairs && currentPairs.length > 0 || finishedPairs && finishedPairs.length > 0) {
                console.log('Удаление не возможно во время турнира');
                showErrorModal('Removal of players during the tournament is not possible!');
                return;
            }
            if (isRetired) {
                // Удаляем игрока из массива выбывших
                retiredPlayers = retiredPlayers.filter(p => p.id !== player.id);
            } else if (player.unrated) {
                unratedPlayersList = unratedPlayersList.filter(p => p.id !== player.id);
            } else {
                // Перемещаем игрока в массив выбывших
                selectedPlayers = selectedPlayers.filter(p => p.id !== player.id);
                retiredPlayers.push({ ...player, retired: true });
            }
            renderPlayerList(selectedPlayers, retiredPlayers, unratedPlayersList); // Перерисовываем списки
            allParticipants = [...selectedPlayers, ...unratedPlayersList].sort((a, b) => (b.rating || 0) - (a.rating || 0))
            saveTournament();
        });
        return playerDiv;
    }

    // Инициализация списков
    renderPlayerList(selectedPlayers, retiredPlayers, unratedPlayersList);

    
    document.querySelector('.addUnratedPlayer_btn').addEventListener('click', async function (event) {
        event.preventDefault();
    
        const fullname = document.getElementById('fullname').value.trim();
        const birthday = document.getElementById('date').value.trim();
        const nickname = document.getElementById('loginRegInput').value.trim();
        const city = document.getElementById('city').value.trim();
        if (!fullname || !birthday || !city || !nickname) {
            showErrorModal('All fields marked with * are required.');
            return;
        }
        // Проверка формата даты (dd.mm.yyyy)
        const dateRegex = /^\d{2}\.\d{2}\.\d{4}$/;
        if (!dateRegex.test(birthday)) {
            showErrorModal('Invalid date format. Use dd.mm.yyyy.');
            return;
        }
        const playerData = {
            fullname,
            birthday,
            nickname,
            city,
            unrated: true, // Добавляем параметр unrated
        };
        // Отправка данных на сервер
        const playerObject = {
            id: Date.now().toString(), // Используем ID из ответа или генерируем временный
            name: playerData.fullname || playerData.name,
            birthYear: playerData.birthday.split('.')[2], // Извлекаем год из даты
            city: playerData.city,
            nickname: playerData.nickname,
            rating: null, // У unrated игроков рейтинг отсутствует
            unrated: true,
        };

        unratedPlayersList.push({ ...playerObject, retired: false });
        // добавляем внерейтингового игрока в список
        renderPlayerList(selectedPlayers, retiredPlayers, unratedPlayersList);
        // очищаем инпуты
        document.getElementById('fullname').value = '';
        document.getElementById('date').value = '';
        document.getElementById('loginRegInput').value = '';
        document.getElementById('city').value = '';
    });

    

    document.getElementById('saveTournamentData').addEventListener('click', () => {
        byUser = true; 
        if (selectedType === 'roundRobin') {
            saveTournament(null);
        }
        if (selectedType === 'twoRound') {
            saveTournamentTwoRound(null, allParticipants);
        }
    });


    const waitingBlockContainer = document.querySelector('.startTournament_panelWrapp_tournament_games_watingBlock_pairs');
    const playingBlockContainer = document.querySelector('.startTournament_panelWrapp_tournament_games_playingBlock_pairs');
    const startTournament = document.querySelector('#startTournamentBtn');

    if (waitingPairs && waitingPairs.length > 0 || currentPairs && currentPairs.length > 0 || finishedPairs && finishedPairs.length > 0) {
        startTournament.disabled = true; // Отключаем кнопку
        startTournament.classList.add('disabledButton'); // Обновляем текст кнопки (по желанию)
        addPlayertoTournament.disabled = true;
        addPlayertoTournament.classList.add('disabledButton');

        if (selectedType === 'roundRobin') {
            startTournamentDisplay(allParticipants, '.displayTournamentFirst');
            if (tournamentData.results) {
                results = tournamentData.results; // Восстанавливаем сохранённые результаты
                restoreSavedResults(results); // Перерисовываем таблицу с данными
            }
        }
        if (selectedType === 'twoRound') {
            
            // startTournamentDisplay([...tournamentData.players, ...tournamentData.unratedPlayers], '.displayTournamentFirst');
            startTournamentDisplay(allParticipants, '.displayTournamentFirst');
            if (tournamentData.roundCounter === 2) {
                document.querySelector('.displayTournamentSecond').style.display = 'block';
                startTournamentDisplay(allParticipants, '.displayTournamentSecond');
                // startTournamentDisplay([...tournamentData.players, ...tournamentData.unratedPlayers], '.displayTournamentSecond');
            }

            if (tournamentData.round1Results) {
                console.log('Первый круг есть. Восстанавливаем...', tournamentData.round1Results);
                round1Results = tournamentData.round1Results; // Восстанавливаем сохранённые результаты
                restoreSavedResultsTwoRound(round1Results, 1); // Перерисовываем таблицу с данными
            }

            if (tournamentData.round2Results && tournamentData.players[1].place_round1 > 0) {
                console.log('Второй круг есть. Восстанавливаем...',tournamentData.round2Results);
                round2Results = tournamentData.round2Results; // Восстанавливаем сохранённые результаты
                restoreSavedResultsTwoRound(round2Results, 2); // Перерисовываем таблицу с данными
            }
        }

    } else {
        startTournament.disabled = false; // Оставляем кнопку активной
        startTournament.classList.remove('disabledButton');

        startTournament.addEventListener('click', () => {
            // console.log('selectedPlayers', [...selectedPlayers, ...unratedPlayersList]);
            if ((allParticipants && allParticipants.length > 2) || ([...selectedPlayers, ...unratedPlayersList] && [...selectedPlayers, ...unratedPlayersList].length > 2)) {
                if (selectedType === 'roundRobin') {
                    console.log('start round robin tournament');
                    // Генерируем пары игроков
                    const pairs = generateRoundRobinPairs([...selectedPlayers, ...unratedPlayersList]);
                    saveInitialRatings([...selectedPlayers, ...unratedPlayersList]);
                    allParticipants = [...selectedPlayers, ...unratedPlayersList].sort((a, b) => (b.rating || 0) - (a.rating || 0));
                    console.log('allParticipants',allParticipants);
                    startTournamentDisplay(allParticipants, '.displayTournamentFirst');
                    // startTournamentDisplay([...selectedPlayers, ...unratedPlayersList], '.displayTournamentFirst');
                    // Отображаем пары в блоке ожидания
                    renderPairsInWaitingBlock(pairs);
                    startTournament.disabled = true; // Отключаем кнопку
                    startTournament.classList.add('disabledButton'); // Обновляем стиль кнопки
                    saveTournament();
                } else 
                if (selectedType === 'twoRound') {
                    console.log(`start two-round tournament (roundCounter: ${roundCounter})`);
                    console.log('allParticipants', allParticipants);
                    // Генерируем пары игроков
                    const pairs = generateRoundRobinPairs([...selectedPlayers, ...unratedPlayersList]);
                    saveInitialRatings([...selectedPlayers, ...unratedPlayersList]);
                    
                    // startTournamentDisplay([...selectedPlayers, ...unratedPlayersList], '.displayTournamentFirst');
                    startTournamentDisplay(allParticipants, '.displayTournamentFirst');
                    // Отображаем пары в блоке ожидания
                    renderPairsInWaitingBlock(pairs);
                    waitingPairs = pairs;
                    startTournament.disabled = true; // Отключаем кнопку
                    startTournament.classList.add('disabledButton'); // Обновляем стиль кнопки
                    saveTournamentTwoRound(null, allParticipants);
                }
            } else {
                showErrorModal('Cannot start the tournament with fewer than three players.', 'OPS!');
            }
            
        });
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
        if ( selectedType === 'roundRobin') {
            updateTournamentStandings(players, results);
        } else if ( selectedType === 'twoRound') {
            updateTournamentStandingsTwoRound(players, results, roundCounter);
        }
        
        

    }

    function startTournamentDisplay(players, block) {
        renderTournamentTable(players, block);
        // console.log(players);
        // Добавление обработчиков для завершения игр
        document.querySelectorAll("td[contenteditable]").forEach((cell) => {
            cell.addEventListener("blur", () => {
                const row = parseInt(cell.getAttribute("data-row"));
                const col = parseInt(cell.getAttribute("data-col"));
    
                // Сохранение результата
                const score = cell.textContent.trim();
                if (!results[row]) results[row] = {};
                results[row][col] = score;
    
                // Отображаем результат для обоих игроков
                const reverseCell = document.querySelector(
                    `td[data-row='${col}'][data-col='${row}']`
                );
                if (reverseCell) reverseCell.textContent = flipScore(score);
    
                calculatePoints(players.length);
            });
        });
    }
    
    function flipScore(score) {
        const [p1, p2] = score.trim().split(":");
        return `${p2}:${p1}`;
    }
    

    function calculatePoints(playerCount) {
        const points = new Array(playerCount).fill(0);
    
        for (const row in results) {
            for (const col in results[row]) {
                const [p1, p2] = results[row][col].trim().split(":").map(Number);
                const player1 = allParticipants[row];
                const player2 = allParticipants[col];

                if (player1.unrated && player2.unrated) {
                    // Если оба игрока нерейтинговые
                    if (p1 > p2) {
                        points[row] += 2;
                        points[col] += 1;
                    } else if (p1 < p2) {
                        points[col] += 2;
                        points[row] += 1;
                    }
                } else if (player1.unrated || player2.unrated) {
                    // Если один из игроков нерейтинговый
                    if (player1.unrated) {
                        points[row] += 1; // Нерейтинговый игрок всегда получает 1 очко
                        points[col] += 2; // Его соперник получает 2 очка
                    } else {
                        points[row] += 2; // Победитель получает 2 очка
                        points[col] += 1; // Нерейтинговый игрок получает 1 очко
                    }
                } else {
                    // Обычные правила
                    if (p1 > p2) {
                        points[row] += 2;
                        points[col] += 1;
                    } else if (p1 < p2) {
                        points[col] += 2;
                        points[row] += 1;
                    }
                }
            }
        }
        // Обновляем очки в таблице
        document.querySelectorAll(".points").forEach((cell, index) => {
            cell.textContent = points[index] || "0";
        });
    
        // Обновляем места игроков
        if ( selectedType === 'roundRobin') {
            updateTournamentStandings(players, results);
        } 
        else if ( selectedType === 'twoRound') {
            updateTournamentStandingsTwoRound(allParticipants, results, roundCounter);
        }
    }
    

    function generateRoundRobinPairs(players) {
        // console.log(players.length);
        const totalPlayers = players.length;
        if (totalPlayers < 2) return [];
    
        let pairs = [];
        let seenPairs = new Set();
    
        for (let i = 0; i < totalPlayers - 1; i++) {
            for (let j = i + 1; j < totalPlayers; j++) {
                const player1 = players[i];
                const player2 = players[j];
    
                const pairKey = [player1.id, player2.id].sort().join("-");
    
                if (!seenPairs.has(pairKey)) {
                    pairs.push({ player1, player2 });
                    seenPairs.add(pairKey);
                }
            }
        }
    
        return shufflePairsToAvoidRepeats(pairs);
    }

    function shufflePairsToAvoidRepeats(pairs) {
        let sortedPairs = [];
        let usedPlayers = new Set();
    
        while (pairs.length > 0) {
            let found = false;
    
            for (let i = 0; i < pairs.length; i++) {
                const { player1, player2 } = pairs[i];
    
                if (!usedPlayers.has(player1.id) && !usedPlayers.has(player2.id)) {
                    sortedPairs.push(pairs[i]);
                    usedPlayers.add(player1.id);
                    usedPlayers.add(player2.id);
                    pairs.splice(i, 1); // Удаляем использованную пару
                    found = true;
                    break;
                }
            }
    
            if (!found) {
                // Если не нашли подходящую пару, сбрасываем usedPlayers и начинаем новый блок
                usedPlayers.clear();
            }
        }
    
        return sortedPairs;
    }


    function renderPairsInWaitingBlock(pairs) {
        waitingPairs = pairs;
        waitingBlockContainer.innerHTML = ''; // Очищаем блок ожидания
    
        // Собираем ID всех игроков, которые сейчас находятся в игре
        const activePlayers = new Set();
        currentPairs.forEach(pair => {
            activePlayers.add(pair.player1.id);
            activePlayers.add(pair.player2.id);
        });
    
        pairs.forEach((pair) => {
            const isBlocked = activePlayers.has(pair.player1.id) || activePlayers.has(pair.player2.id);
    
            const pairDiv = document.createElement('div');
            pairDiv.classList.add('startTournament_panelWrapp_tournament_games_watingBlock_pairs_item');
            pairDiv.setAttribute('data-player1-id', pair.player1.id);
            pairDiv.setAttribute('data-player2-id', pair.player2.id);
            
            // Если хотя бы один игрок уже играет, блокируем клик
            if (!isBlocked) {
                pairDiv.addEventListener('click', () => {
                    movePairToPlaying(pair, false, pairDiv);
                });
            } else {
                pairDiv.style.pointerEvents = 'none'; // Запрещаем клики на заблокированные пары
            }
    
            pairDiv.innerHTML = `
                <div class="group">
                    <span>Gr.1</span>
                </div>
                <div class="pair">
                    <h6>${pair.player1.name || pair.player1.fullname}</h6>
                    <h6>:</h6>
                    <h6>${pair.player2.name || pair.player2.fullname}</h6>
                </div>
            `;
    
            waitingBlockContainer.appendChild(pairDiv);
            // Задаем цвет текста в зависимости от статуса игроков
            const playerTextBlocks = pairDiv.querySelectorAll('h6');
            playerTextBlocks.forEach(h6 => {
                h6.style.color = isBlocked ? '#B62727' : '#fff';
            })
        });
    }
    
    function movePairToPlaying(pair, playerAction = false, pairDiv = null) {
        if (!pairDiv) {
            pairDiv = document.createElement('div');
            pairDiv.setAttribute('data-player1-id', pair.player1.id);
            pairDiv.setAttribute('data-player2-id', pair.player2.id);
        }
        const playingPairs = Array.from(playingBlockContainer.children);
    
        // Проверяем, находится ли хотя бы один из игроков уже в игре
        const isPlayer1Playing = playingPairs.some(
            (child) =>
                child.getAttribute('data-player1-id') === pair.player1.id ||
                child.getAttribute('data-player2-id') === pair.player1.id
        );
    
        const isPlayer2Playing = playingPairs.some(
            (child) =>
                child.getAttribute('data-player1-id') === pair.player2.id ||
                child.getAttribute('data-player2-id') === pair.player2.id
        );
    
        if (isPlayer1Playing || isPlayer2Playing) {
            showErrorModal(
                `Player ${
                    isPlayer1Playing ? pair.player1.name || pair.player1.fullname : pair.player2.name || pair.player2.fullname
                } is already playing.`
            );
            return;
        }
    
        // Проверяем количество занятых столов
        const totalTables = parseInt(clubData.tables, 10); // Количество столов
        if (playingPairs.length >= totalTables) {
            showErrorModal(`All tables are currently occupied. Please wait for a table to become available.`);
            return;
        }
    
        if (!playerAction) {
            // Отображаем модальное окно для подтверждения
            showConfirmationModal(pair, playingPairs.length + 1)
                .then((confirmed) => {
                    if (confirmed) {
                        // Удаляем пару из блока ожидания
                        pairDiv.remove();
                        // удаляем пару со списка
                        waitingPairs = waitingPairs.filter(
                            (waitingPair) =>
                                !(
                                    waitingPair.player1.id === pair.player1.id && 
                                    waitingPair.player2.id === pair.player2.id
                                )
                        );
                        
                        currentPairs.push(pair);
                        renderPairsInWaitingBlock(waitingPairs);
        
                        // Добавляем пару в блок текущих игр
                        const playingDiv = document.createElement('div');
                        playingDiv.classList.add('startTournament_panelWrapp_tournament_games_playingBlock_pairs_item');
                        playingDiv.setAttribute('data-player1-id', pair.player1.id);
                        playingDiv.setAttribute('data-player2-id', pair.player2.id);
        
                        // Создаем структуру для играющей пары
                        playingDiv.innerHTML = `
                            <h3>${playingBlockContainer.children.length + 1}</h3> <!-- Номер пары -->
                            <div class="group">
                                <span>Gr.1</span>
                            </div>
                            <div class="pair">
                                <h6>${pair.player1.name || pair.player1.fullname}</h6>
                                <h6>:</h6>
                                <h6>${pair.player2.name || pair.player2.fullname}</h6>
                            </div>
                        `;
        
                        playingDiv.addEventListener('click', () => {
                            openGameModal(pair, playingDiv);
                        });
        
                        // Добавляем пару в блок текущих игр
                        playingBlockContainer.appendChild(playingDiv);

                        saveTournament();
                    }
                })
                .catch((error) => {
                    console.error('Error confirming pair:', error);
                });
        } else {
            waitingPairs = waitingPairs.filter(
                (waitingPair) =>
                    !(
                        waitingPair.player1.id === pair.player1.id &&
                        waitingPair.player2.id === pair.player2.id
                    )
            );
            
            renderPairsInWaitingBlock(waitingPairs);
            // Добавляем пару в блок текущих игр
            const playingDiv = document.createElement('div');
            playingDiv.classList.add('startTournament_panelWrapp_tournament_games_playingBlock_pairs_item');
            playingDiv.setAttribute('data-player1-id', pair.player1.id);
            playingDiv.setAttribute('data-player2-id', pair.player2.id);

            // Создаем структуру для играющей пары
            playingDiv.innerHTML = `
                <h3>${playingBlockContainer.children.length + 1}</h3> <!-- Номер пары -->
                <div class="group">
                    <span>Gr.1</span>
                </div>
                <div class="pair">
                    <h6>${pair.player1.name || pair.player1.fullname}</h6>
                    <h6>:</h6>
                    <h6>${pair.player2.name || pair.player2.fullname}</h6>
                </div>
            `;

            playingDiv.addEventListener('click', () => {
                openGameModal(pair, playingDiv);
            });

            // Добавляем пару в блок текущих игр
            playingBlockContainer.appendChild(playingDiv);

            saveTournament();
        }
    }

    function showConfirmationModal(pair, tableNumber) {
        return new Promise((resolve, reject) => {
            // Создаем модальное окно
            const modal = document.querySelector('#myModal');
            const modalContent = modal.querySelector('.modal-content');
            modalContent.innerHTML = ``;
            modalContent.innerHTML = `
                    <h2>editing a meeting</h2>
                    <p>Table Number: ${tableNumber}</p>
                    <div class="modalPairBlock">
                        <div>
                            <h4 class="modalPairBlock_firstPlayer">${pair.player1.name || pair.player1.fullname}</h4>
                            <h4 class="modalPairBlock_vs">:</h4>
                            <h4 class="modalPairBlock_secondPlayer">${pair.player2.name || pair.player2.fullname}</h4>
                        </div>
                         <div>
                            <h4 class="modalPairBlock_firstPlayer_lastGame ">
                                <svg xmlns="http://www.w3.org/2000/svg" width="13" height="14" viewBox="0 0 13 14" fill="none">
                                    <path d="M1.28135 3.12691C1.31794 3.06894 1.36861 3.02117 1.42863 2.98805C1.48865 2.95494 1.55608 2.93754 1.62463 2.9375H11.3746C11.4565 2.93743 11.5365 2.96211 11.6042 3.00831C11.6718 3.05451 11.7239 3.12008 11.7536 3.1964C11.7833 3.27273 11.7892 3.35625 11.7706 3.43601C11.752 3.51577 11.7098 3.58805 11.6494 3.64336L9.51198 5.60199L11.6732 7.94301C11.7269 8.00103 11.7624 8.07343 11.7755 8.15135C11.7886 8.22926 11.7787 8.30931 11.747 8.38168C11.7153 8.45406 11.6632 8.51563 11.5971 8.55884C11.531 8.60206 11.4536 8.62505 11.3746 8.625H4.58924L6.05377 11.7003C6.07826 11.7486 6.09284 11.8014 6.09664 11.8554C6.10044 11.9095 6.09339 11.9637 6.07591 12.015C6.05842 12.0663 6.03086 12.1136 5.99483 12.1541C5.9588 12.1945 5.91504 12.2274 5.86613 12.2507C5.81722 12.274 5.76413 12.2873 5.71001 12.2898C5.65588 12.2922 5.60181 12.2839 5.55096 12.2651C5.50012 12.2464 5.45354 12.2177 5.41396 12.1807C5.37438 12.1437 5.3426 12.0992 5.32049 12.0497L1.25799 3.51844C1.22852 3.45651 1.21521 3.38813 1.21929 3.31967C1.22338 3.25121 1.24473 3.1849 1.28135 3.12691ZM4.2028 7.8125H10.4489L8.64057 5.85387C8.60425 5.81458 8.57604 5.7685 8.55757 5.71829C8.5391 5.66807 8.53074 5.61469 8.53296 5.56123C8.53517 5.50777 8.54793 5.45528 8.57049 5.40676C8.59306 5.35824 8.62498 5.31466 8.66444 5.27852L10.3301 3.75H2.26803L4.2028 7.8125Z" fill="#D10000"/>
                                    <path d="M4.2028 7.8125H10.4489L8.64057 5.85387C8.60425 5.81458 8.57604 5.7685 8.55757 5.71829C8.5391 5.66807 8.53074 5.61469 8.53296 5.56123C8.53517 5.50777 8.54793 5.45528 8.57049 5.40676C8.59306 5.35824 8.62498 5.31466 8.66444 5.27852L10.3301 3.75H2.26803L4.2028 7.8125Z" fill="#D10000"/>
                                </svg>
                                Last game
                            </h4>
                            
                            <h4 class="modalPairBlock_secondPlayer_lastGame lastGame">
                                <svg xmlns="http://www.w3.org/2000/svg" width="13" height="14" viewBox="0 0 13 14" fill="none">
                                    <path d="M1.28135 3.12691C1.31794 3.06894 1.36861 3.02117 1.42863 2.98805C1.48865 2.95494 1.55608 2.93754 1.62463 2.9375H11.3746C11.4565 2.93743 11.5365 2.96211 11.6042 3.00831C11.6718 3.05451 11.7239 3.12008 11.7536 3.1964C11.7833 3.27273 11.7892 3.35625 11.7706 3.43601C11.752 3.51577 11.7098 3.58805 11.6494 3.64336L9.51198 5.60199L11.6732 7.94301C11.7269 8.00103 11.7624 8.07343 11.7755 8.15135C11.7886 8.22926 11.7787 8.30931 11.747 8.38168C11.7153 8.45406 11.6632 8.51563 11.5971 8.55884C11.531 8.60206 11.4536 8.62505 11.3746 8.625H4.58924L6.05377 11.7003C6.07826 11.7486 6.09284 11.8014 6.09664 11.8554C6.10044 11.9095 6.09339 11.9637 6.07591 12.015C6.05842 12.0663 6.03086 12.1136 5.99483 12.1541C5.9588 12.1945 5.91504 12.2274 5.86613 12.2507C5.81722 12.274 5.76413 12.2873 5.71001 12.2898C5.65588 12.2922 5.60181 12.2839 5.55096 12.2651C5.50012 12.2464 5.45354 12.2177 5.41396 12.1807C5.37438 12.1437 5.3426 12.0992 5.32049 12.0497L1.25799 3.51844C1.22852 3.45651 1.21521 3.38813 1.21929 3.31967C1.22338 3.25121 1.24473 3.1849 1.28135 3.12691ZM4.2028 7.8125H10.4489L8.64057 5.85387C8.60425 5.81458 8.57604 5.7685 8.55757 5.71829C8.5391 5.66807 8.53074 5.61469 8.53296 5.56123C8.53517 5.50777 8.54793 5.45528 8.57049 5.40676C8.59306 5.35824 8.62498 5.31466 8.66444 5.27852L10.3301 3.75H2.26803L4.2028 7.8125Z" fill="#D10000"/>
                                    <path d="M4.2028 7.8125H10.4489L8.64057 5.85387C8.60425 5.81458 8.57604 5.7685 8.55757 5.71829C8.5391 5.66807 8.53074 5.61469 8.53296 5.56123C8.53517 5.50777 8.54793 5.45528 8.57049 5.40676C8.59306 5.35824 8.62498 5.31466 8.66444 5.27852L10.3301 3.75H2.26803L4.2028 7.8125Z" fill="#D10000"/>
                                </svg>
                                Last game
                            </h4>
                        </div> 
                    </div>
                    <div class="modal-actions">
                        <button id="createTournamentSoft" class="header_btn-sign btn-confirm">
                            OK
                        </button>
                        <button id="createTournamentSoft" class="header_btn-log btn-cancel">
                            Cancel
                        </button>
                    </div>
            `;

            // Проверяем, играет ли игрок последний матч в турнире
            function isLastGame(playerId) {
                const occurrences = waitingPairs.filter(pair => pair.player1.id === playerId || pair.player2.id === playerId).length;
                // Если игрок найден только один раз (это текущая пара), значит, это его последняя игра
                return occurrences === 1;
            }

            // Получаем элементы для отображения информации о последней игре
            const firstPlayerLastGame = modal.querySelector('.modalPairBlock_firstPlayer_lastGame');
            const secondPlayerLastGame = modal.querySelector('.modalPairBlock_secondPlayer_lastGame');

            // Проверяем, если это последний матч игрока, добавляем класс `lastGame`
            if (isLastGame(pair.player1.id)) {
                firstPlayerLastGame.classList.add('lastGame');
            } else {
                firstPlayerLastGame.classList.remove('lastGame');
            }

            if (isLastGame(pair.player2.id)) {
                secondPlayerLastGame.classList.add('lastGame');
            } else {
                secondPlayerLastGame.classList.remove('lastGame');
            }

            document.body.style = 'overflow: hidden;';
            modal.style = 'display: block';
    
            // Обработчики для кнопок
            modal.querySelector('.btn-confirm').addEventListener('click', () => {
                resolve(true);
                modal.style = 'display: none';
                document.body.style = 'overflow: auto;';
            });
    
            modal.querySelector('.btn-cancel').addEventListener('click', () => {
                resolve(false);
                modal.style = 'display: none';
                document.body.style = 'overflow: auto;';
            });
        });
    }

    function openGameModal(pair, playingDiv) {
        const modal = document.getElementById("modalFinishGame");
        if (!modal) {
            console.error("Modal element not found!");
            return;
        }
        modal.setAttribute("data-player1", JSON.stringify(pair.player1));
        modal.setAttribute("data-player2", JSON.stringify(pair.player2));
    
        // Заполняем данные игроков
        document.querySelector(".modalPairBlockDone_firstPlayer").textContent = pair.player1.name || pair.player1.fullname;
        document.querySelector(".modalPairBlockDone_secondPlayer").textContent = pair.player2.name || pair.player2.fullname;
        document.querySelector(".modalScoreBlock_points_row.firstPlayer .modalScoreBlock_points_left h3").textContent = pair.player1.name || pair.player1.fullname;
        document.querySelector(".modalScoreBlock_points_row.secondPlayer .modalScoreBlock_points_left h3").textContent = pair.player2.name || pair.player2.fullname;

        // Очищаем ввод счета
        const scoreInputs = document.querySelectorAll(".modalPairBlockDone input");
        scoreInputs.forEach(input => input.value = "");

        // Очищаем очки по партиям
        const setInputs1 = document.querySelectorAll(".modalScoreBlock_points_row.firstPlayer .modalScoreBlock_points_right input");
        const setInputs2 = document.querySelectorAll(".modalScoreBlock_points_row.secondPlayer .modalScoreBlock_points_right input");
        setInputs1.forEach(input => input.value = "");
        setInputs2.forEach(input => input.value = "");
    
        // Добавляем обработчики на быстрый выбор счета
        document.querySelectorAll(".modalScoreBlock_scores_player1 button").forEach(button => {
            button.onclick = () => {
                let score = button.textContent.split(":").map(n => n.trim());
                score = score.map(value => (value === "W" ? 1 : value === "L" ? 0 : parseInt(value)));
                scoreInputs[0].value = score[0];
                scoreInputs[1].value = score[1];
                highlightWinnerLoser();
            };
        });
    
        document.querySelectorAll(".modalScoreBlock_scores_player2 button").forEach(button => {
            button.onclick = () => {
                let score = button.textContent.split(":").map(n => n.trim());
                score = score.map(value => (value === "W" ? 1 : value === "L" ? 0 : parseInt(value))); // Преобразуем W и L
                scoreInputs[0].value = score[0];
                scoreInputs[1].value = score[1];
                highlightWinnerLoser();
            };
        });

        // Добавляем обработчик на ввод вручную
        scoreInputs.forEach(input => {
            input.addEventListener("input", highlightWinnerLoser);
        });

        document.querySelectorAll(".modalScoreBlock_points_right input").forEach(input => {
            input.addEventListener("input", () => {
                if (input.value.trim() !== "") {
                    highlightWinnerLoser();
                }
            });
        });

        // Добавляем обработчик на ввод очков партий в реальном времени
        function updateSetScores() {
            let player1Sets = [];
            let player2Sets = [];

            setInputs1.forEach(input => {
                let value = parseInt(input.value.trim());
                if (!isNaN(value)) player1Sets.push(value);
            });

            setInputs2.forEach(input => {
                let value = parseInt(input.value.trim());
                if (!isNaN(value)) player2Sets.push(value);
            });

            let player1Score = 0;
            let player2Score = 0;

            for (let i = 0; i < Math.max(player1Sets.length, player2Sets.length); i++) {
                let p1 = player1Sets[i] || 0;
                let p2 = player2Sets[i] || 0;

                if (p1 > p2) player1Score++;
                if (p2 > p1) player2Score++;
            }

            scoreInputs[0].value = player1Score;
            scoreInputs[1].value = player2Score;

            highlightWinnerLoser();
        }

        // Добавляем обработчик ввода очков партий
        setInputs1.forEach(input => input.addEventListener("input", updateSetScores));
        setInputs2.forEach(input => input.addEventListener("input", updateSetScores));


        document.getElementById("saveGameResult").onclick = async () => {
            let player1Score = scoreInputs[0].value.trim();
            let player2Score = scoreInputs[1].value.trim();

            // Преобразуем W и L в числа
            player1Score = player1Score === "W" ? 1 : player1Score === "L" ? 0 : parseInt(player1Score) || 0;
            player2Score = player2Score === "W" ? 1 : player2Score === "L" ? 0 : parseInt(player2Score) || 0;
        
            if (player1Score === player2Score) {
                alert("A draw is impossible, change the score.");
                return;
            }
        
            // Определяем победителя и проигравшего
            const winner = player1Score > player2Score ? pair.player1 : pair.player2;
            const loser = player1Score > player2Score ? pair.player2 : pair.player1;
            const winnerScore = Math.max(player1Score, player2Score);
            const loserScore = Math.min(player1Score, player2Score);
            const scoreDiff = Math.abs(winnerScore - loserScore);

            // Собираем данные о партиях
            let player1SetScores = [];
            let player2SetScores = [];

            setInputs1.forEach(input => {
                let value = input.value.trim();
                if (value !== "") player1SetScores.push(value);
            });

            setInputs2.forEach(input => {
                let value = input.value.trim();
                if (value !== "") player2SetScores.push(value);
            });

            let setsSummary = player1SetScores.map((p1, index) => `${p1}-${player2SetScores[index] || 0}`).join(", ");
        
            // Удаляем пару из списка текущих игр
            currentPairs = currentPairs.filter(p => 
                !(p.player1.id === pair.player1.id && p.player2.id === pair.player2.id)
            );

            // Добавляем пару в список завершённых игр (если нужно)
            finishedPairs.push(pair);

            // **Удаляем пару из списка текущих игр**
            playingDiv.remove();

            // **Обновляем таблицу результатов**
            if (selectedType === 'roundRobin') {
                updateTableResults(pair, player1Score, player2Score, setsSummary);
            }

            if (selectedType === 'twoRound') {
                updateTableResultsTwoRounds(pair, player1Score, player2Score, setsSummary);
            }
            
            // **Расчёт рейтинга**
            const isWinnerNewbie = winner.tournamentsPlayed < 5;
            const isLoserNewbie = loser.tournamentsPlayed < 5;
            
            updatePlayerRating(winner, loser, scoreDiff, isWinnerNewbie, isLoserNewbie);
         
            // **Закрываем модальное окно**
            modal.style.display = "none";
            
            if ( selectedType === 'roundRobin') {
                updateTournamentStandings([...selectedPlayers, ...unratedPlayersList], results);
            } 
            // else if ( selectedType === 'twoRound') {
            //     updateTournamentStandingsTwoRound([...selectedPlayers, ...unratedPlayersList], results, roundCounter);
            // }
            
            // **Сохраняем изменения в БД**
            await saveUpdatedRatings(winner, loser);
            // saveTournament();
            addBracketsAndHighlightResults();

            if (currentPairs.length === 0 && waitingPairs.length === 0) {
                console.log('standingsGlobal перед финальным расчетом:', standingsGlobal);
                console.log('results перед финалом:', results);
                console.log('round1Results перед финалом:', round1Results);
                console.log('round2Results перед финалом:', round2Results);
                
                if (selectedType === 'roundRobin') {
                    document.querySelector('#showResult').style = 'display: block';
                    console.log("Все игры завершены! Распределяем места...");
                    let sortedStandings = allParticipants.map(player => {
                        const updated = standingsGlobal.find(p => p.id === player.id);
                        return updated ? { ...player, ...updated } : player;
                    });
                    console.log('sortedStandings', sortedStandings)
                    const finalStandings = determineTournamentStandings(sortedStandings, results);
                    console.log('finalStandings', finalStandings)
                    updateTournamentStandings(finalStandings, results);
                    // setTimeout(() => {
                    //     window.location.reload();
                    // }, 500);
                }

                if (selectedType === 'twoRound' && roundCounter === 1) {
                    console.log('глобал перед теминейт', standingsGlobal);
                    roundCounter = 2;
                    const final1RoundStandings = determineTournamentStandingsTwoRounds(standingsGlobal, round1Results, null);
                    console.log('после теминейт', final1RoundStandings);
                    updateTournamentStandingsTwoRound(final1RoundStandings, round1Results, 1);
                    roundCounter = 2;
                    

                    document.querySelector('.displayTournamentSecond').style.display = ' block';
                    const secondRoundPairs = generateRoundRobinPairs([...selectedPlayers, ...unratedPlayersList]);
                    renderTournamentTable(allParticipants, '.displayTournamentSecond'); // Рендер второго круга
                    // Отображаем пары в блоке ожидания
                    renderPairsInWaitingBlock(secondRoundPairs);
                    waitingPairs = secondRoundPairs;
                    saveTournamentTwoRound(null, standingsGlobal);
                    return;
                } else if (selectedType === 'twoRound' && roundCounter === 2) {
                    document.querySelector('#showResult').style = 'display: block';
                    console.log("2 круга завершены! Распределяем места...");
                    console.log('round2Results', round2Results);
                    const final2RoundStandings = determineTournamentStandingsTwoRounds(standingsGlobal, null, round2Results);
                    console.log('тут стэндингс при завершении последнего матча:', final2RoundStandings);
                    updateTournamentStandingsTwoRound(final2RoundStandings, round2Results, 2);

                    // Создаём копию `allParticipants`, чтобы избежать потери данных
                    const finalStandings = determineTournamentStandingsTwoRounds(standingsGlobal, round1Results, round2Results);
                    console.log('finalStandings сформированы', finalStandings)
                    // const finalStandings = determineTournamentStandingsTwoRounds(standingsGlobal, round1Results, round2Results);
                    // updateTournamentStandingsTwoRound(finalStandings, results, "final");
                    saveTournamentTwoRound(null, finalStandings);
                } else {
                    // setTimeout(() => {
                    //     window.location.reload();
                    // }, 500);
                }
            }
            renderPairsInWaitingBlock(waitingPairs);
        };
    
        // Обработчик для кнопки Cancel
        document.getElementById("notFinish").onclick = () => {
            modal.style.display = "none";
            document.querySelectorAll(".modal-content input").forEach(input => {
                input.value = ""; // Очищаем значение
                input.style.backgroundColor = "#3f3f4c"; // Сбрасываем фон
            });
        };

        document.getElementById("cancelGame").onclick = () => {
            // Находим идентификаторы игроков
            const player1 = JSON.parse(modal.getAttribute("data-player1"));
            const player2 = JSON.parse(modal.getAttribute("data-player2"));
            // console.log('player1', player1);
            // Удаляем пару из списка играющих
            currentPairs = currentPairs.filter(pair =>
                !(
                    (pair.player1.id === player1.id && pair.player2.id === player2.id) ||
                    (pair.player1.id === player2.id && pair.player2.id === player1.id) // Проверяем и обратный случай
                )
            );
            
            playingDiv.remove(); 

            // Возвращаем пару в список ожидания
            const pairToRestore = {
                player1,
                player2
            };
            waitingPairs.push(pairToRestore);
        
            // Перерисовываем списки
            renderPairsInWaitingBlock(waitingPairs);
            modal.style.display = "none";
            saveTournament();
        };
    
        // Отображаем модальное окно
        modal.style.display = "block";
    }


    function determineTournamentStandings(standings, results) {
        // Копируем массив, чтобы не менять оригинальные данные
        console.log('determinate standings', standings);
        let sortedStandings = [...standings];
       
        // let sortedStandings = allParticipants.map(player => {
        //     const updated = standings.find(p => p.id === player.id);
        //     return updated ? { ...player, ...updated } : player;
        // });

        console.log('determinate список', sortedStandings);
        // 1️⃣ Сортируем сначала только по очкам (по убыванию)
        sortedStandings.sort((a, b) => b.totalPoints - a.totalPoints);
    
        // 2️⃣ Группируем игроков с одинаковыми очками
        let groupedStandings = [];
        let currentGroup = [sortedStandings[0]];
    
        for (let i = 1; i < sortedStandings.length; i++) {
            if (sortedStandings[i].totalPoints === sortedStandings[i - 1].totalPoints) {
                currentGroup.push(sortedStandings[i]);
            } else {
                groupedStandings.push(currentGroup);
                currentGroup = [sortedStandings[i]];
            }
        }
        groupedStandings.push(currentGroup); // Добавляем последнюю группу
    
        // 3️⃣ Сортируем каждую группу по личным встречам, а затем по разнице сетов
        groupedStandings.forEach(group => {
            if (group.length > 1) {
                group.sort((a, b) => {
                    // 3.1️⃣ Проверяем личные встречи
                    const matchResult = compareHeadToHead(a, b, results);
                    if (matchResult !== 0) return matchResult;
    
                    // 3.2️⃣ Если личные встречи не помогли, сортируем по разнице выигранных/проигранных сетов
                    const setsDifferenceA = a.setsWon - a.setsLost;
                    const setsDifferenceB = b.setsWon - b.setsLost;
                    return setsDifferenceB - setsDifferenceA;
                });
            }
        });
    
        // 4️⃣ Собираем финальный отсортированный массив
        sortedStandings = groupedStandings.flat();
    
        // 5️⃣ Проставляем места игрокам
        if (sortedStandings) {
            sortedStandings.forEach((player, index) => {
                player.place = index + 1;
            });
        }
    
        return sortedStandings;
    }

    function compareHeadToHead(playerA, playerB, results) {
        const indexA = allParticipants.findIndex(p => p.id === playerA.id);
        const indexB = allParticipants.findIndex(p => p.id === playerB.id);
    
        if (indexA === -1 || indexB === -1) return 0;
    
        const isAUnrated = playerA.unrated;
        const isBUnrated = playerB.unrated;
    
        // ✅ Если один из игроков нерейтинговый — автоматически выигрывает рейтинговый
        if (isAUnrated && !isBUnrated) return 1;  // Побеждает B
        if (!isAUnrated && isBUnrated) return -1; // Побеждает A
    
        // ✅ Если оба нерейтинговые — считаем по сетам
        let scoreA = 0, scoreB = 0;
    
        if (results[indexA] && results[indexA][indexB]) {
            const [a, b] = results[indexA][indexB].split(":").map(Number);
            scoreA += a;
            scoreB += b;
        }
    
        if (results[indexB] && results[indexB][indexA]) {
            const [b, a] = results[indexB][indexA].split(":").map(Number);
            scoreA += a;
            scoreB += b;
        }
    
        return scoreB - scoreA;
    }
    
    
    
    // Функция для сравнения личных встреч
    // function compareHeadToHead(playerA, playerB, results) {
    //     const playerAId = playerA.id;
    //     const playerBId = playerB.id;
    
    //     if (results[playerAId] && results[playerAId][playerBId]) {
    //         const [scoreA, scoreB] = results[playerAId][playerBId].split(":").map(Number);
    //         if (scoreA > scoreB) return -1; // Победа игрока A
    //         if (scoreA < scoreB) return 1;  // Победа игрока B
    //     }
    
    //     if (results[playerBId] && results[playerBId][playerAId]) {
    //         const [scoreB, scoreA] = results[playerBId][playerAId].split(":").map(Number);
    //         if (scoreA > scoreB) return 1;  // Победа игрока B
    //         if (scoreA < scoreB) return -1; // Победа игрока A
    //     }
    
    //     return 0; // Если личная встреча не решает
    // }

    function determineTournamentStandingsTwoRounds(players, round1Results = null, round2Results = null) {
        let standings = [...players];
        const allPlayers = [...players];
    
        const isRound1 = round1Results && !round2Results;
        const isRound2 = !round1Results && round2Results;
        const isFinal = round1Results && round2Results;
    
        let pointsKey, placeKey, results;
        if (isRound1) {
            pointsKey = "points_round1";
            placeKey = "place_round1";
            results = round1Results;
        } else if (isRound2) {
            pointsKey = "points_round2";
            placeKey = "place_round2";
            results = round2Results;
        } else if (isFinal) {
            pointsKey = "totalPoints";
            placeKey = "place";
        }
    
        // 🧠 При финальном расчёте пересчитываем total победы, поражения и сеты
        if (isFinal) {
            standings = standings.map((player, index) => {
                const playerIndex = allPlayers.findIndex(p => p.id === player.id);
                let wins = 0, losses = 0, setsWon = 0, setsLost = 0;
    
                const combinedResults = [round1Results, round2Results];
                for (const round of combinedResults) {
                    const row = round?.[playerIndex];
                    if (!row) continue;
    
                    for (let opponentIndex in row) {
                        if (opponentIndex === "sets" || opponentIndex === "points") continue;
                        const opponent = allPlayers[opponentIndex];
                        if (!opponent) continue;
    
                        const [score1, score2] = row[opponentIndex].split(":").map(Number);
    
                        setsWon += score1;
                        setsLost += score2;
    
                        const isUnratedOpponent = opponent.unrated;
                        const isUnratedPlayer = player.unrated;
    
                        if (isUnratedPlayer && isUnratedOpponent) {
                            if (score1 > score2) wins++;
                            else losses++;
                        } else if (isUnratedOpponent) {
                            // Победа автоматически зачисляется игроку
                            wins++;
                        } else if (isUnratedPlayer) {
                            losses++;
                        } else {
                            if (score1 > score2) wins++;
                            else losses++;
                        }
                    }
                }
    
                return {
                    ...player,
                    wins,
                    losses,
                    setsWon,
                    setsLost
                };
            });
        }
    
        // 🔽 Сортировка по очкам
        let sortedStandings = [...standings];
        sortedStandings.sort((a, b) => b[pointsKey] - a[pointsKey]);
    
        // 🔁 Группировка по очкам
        let groupedStandings = [];
        let currentGroup = [sortedStandings[0]];
    
        for (let i = 1; i < sortedStandings.length; i++) {
            if (sortedStandings[i][pointsKey] === sortedStandings[i - 1][pointsKey]) {
                currentGroup.push(sortedStandings[i]);
            } else {
                groupedStandings.push(currentGroup);
                currentGroup = [sortedStandings[i]];
            }
        }
        groupedStandings.push(currentGroup);
    
        // 🧠 Сортировка в группе по личным встречам и сетам
        groupedStandings.forEach(group => {
            if (group.length > 1) {
                group.sort((a, b) => {
                    const matchResult = isFinal
                        ? compareHeadToHeadTwoRounds(a, b, round1Results, round2Results, allPlayers)
                        : compareHeadToHead(a, b, results);
    
                    if (matchResult !== 0) return matchResult;
    
                    const setsDiffA = a.setsWon - a.setsLost;
                    const setsDiffB = b.setsWon - b.setsLost;
                    return setsDiffB - setsDiffA;
                });
            }
        });
    
        // 🏆 Назначение мест
        const sortedPlayers = groupedStandings.flat();
        sortedPlayers.forEach((player, index) => {
            player[placeKey] = index + 1;
        });
    
        return standings.map(player => {
            const updated = sortedPlayers.find(p => p.id === player.id);
            return {
                ...player,
                [placeKey]: updated[placeKey],
                points_round1: player.points_round1 ?? updated.points_round1,
                points_round2: player.points_round2 ?? updated.points_round2
            };
        });
    }
    
    
    // function determineTournamentStandingsTwoRounds(players, round1Results = null, round2Results = null) {
    //     let standings = [...players];
    //     const allPlayers = [...players];
    
    //     let isRound1 = round1Results && !round2Results;
    //     let isRound2 = !round1Results && round2Results;
    //     let isFinal = round1Results && round2Results;
    
    //     let pointsKey, placeKey, results;
    //     if (isRound1) {
    //         pointsKey = "points_round1";
    //         placeKey = "place_round1";
    //         results = round1Results;
    //     } else if (isRound2) {
    //         pointsKey = "points_round2";
    //         placeKey = "place_round2";
    //         results = round2Results;
    //     } else if (isFinal) {
    //         pointsKey = "totalPoints";
    //         placeKey = "place";
    //     }
    
    //     let sortedStandings = [...standings];
    //     sortedStandings.sort((a, b) => b[pointsKey] - a[pointsKey]);
    
    //     let groupedStandings = [];
    //     let currentGroup = [sortedStandings[0]];
    
    //     for (let i = 1; i < sortedStandings.length; i++) {
    //         if (sortedStandings[i][pointsKey] === sortedStandings[i - 1][pointsKey]) {
    //             currentGroup.push(sortedStandings[i]);
    //         } else {
    //             groupedStandings.push(currentGroup);
    //             currentGroup = [sortedStandings[i]];
    //         }
    //     }
    //     groupedStandings.push(currentGroup);
    
    //     groupedStandings.forEach(group => {
    //         if (group.length > 1) {
    //             group.sort((a, b) => {
    //                 const matchResult = isFinal
    //                     ? compareHeadToHeadTwoRounds(a, b, round1Results, round2Results, allPlayers)
    //                     : compareHeadToHead(a, b, results);
    
    //                 if (matchResult !== 0) return matchResult;
    
    //                 const setsDifferenceA = a.setsWon - a.setsLost;
    //                 const setsDifferenceB = b.setsWon - b.setsLost;
    //                 return setsDifferenceB - setsDifferenceA;
    //             });
    //         }
    //     });
    
    //     let sortedPlayers = groupedStandings.flat();
    //     sortedPlayers.forEach((player, index) => {
    //         player[placeKey] = index + 1;
    //     });
    
    //     return standings.map(player => {
    //         const updated = sortedPlayers.find(p => p.id === player.id);
    //         return {
    //             ...player,
    //             [placeKey]: updated[placeKey],
    //             points_round1: player.points_round1 ?? updated.points_round1,
    //             points_round2: player.points_round2 ?? updated.points_round2
    //         };
    //     });
    // }
    
    // function determineTournamentStandingsTwoRounds(players, round1Results = null, round2Results = null) {
    //     let standings = [...players];
    
    //     let isRound1 = round1Results && !round2Results;
    //     let isRound2 = !round1Results && round2Results;
    //     let isFinal = round1Results && round2Results;
    
    //     let pointsKey, placeKey, results;
    //     if (isRound1) {
    //         pointsKey = "points_round1";
    //         placeKey = "place_round1";
    //         results = round1Results;
    //     } else if (isRound2) {
    //         pointsKey = "points_round2";
    //         placeKey = "place_round2";
    //         results = round2Results;
    //     } else if (isFinal) {
    //         pointsKey = "totalPoints";
    //         placeKey = "place";
    
    //         // 1️⃣ Пересчитываем всё для финального ранжирования
    //         standings.forEach((player, index) => {
    //             let wins = 0;
    //             let losses = 0;
    //             let setsWon = 0;
    //             let setsLost = 0;
    
    //             [round1Results, round2Results].forEach(resultObj => {
    //                 const row = resultObj[index];
    //                 if (!row) return;
    
    //                 for (let col in row) {
    //                     if (col === "sets" || col === "points") continue;
    //                     const [score1, score2] = row[col].split(":").map(Number);
    //                     setsWon += score1;
    //                     setsLost += score2;
    //                     if (score1 > score2) wins++;
    //                     else losses++;
    //                 }
    //             });
    
    //             player.setsWon = setsWon;
    //             player.setsLost = setsLost;
    //             player.wins = wins;
    //             player.losses = losses;
    //             player.totalPoints = (player.points_round1 || 0) + (player.points_round2 || 0);
    //         });
    //     }
    
    //     // 2️⃣ Копия для сортировки
    //     let sortedStandings = [...standings];
    
    //     // 3️⃣ Сортируем по очкам
    //     sortedStandings.sort((a, b) => b[pointsKey] - a[pointsKey]);
    
    //     // 4️⃣ Группируем по одинаковым очкам
    //     let groupedStandings = [];
    //     let currentGroup = [sortedStandings[0]];
    //     for (let i = 1; i < sortedStandings.length; i++) {
    //         if (sortedStandings[i][pointsKey] === sortedStandings[i - 1][pointsKey]) {
    //             currentGroup.push(sortedStandings[i]);
    //         } else {
    //             groupedStandings.push(currentGroup);
    //             currentGroup = [sortedStandings[i]];
    //         }
    //     }
    //     groupedStandings.push(currentGroup);
    
    //     // 5️⃣ Сортировка внутри группы
    //     groupedStandings.forEach(group => {
    //         if (group.length > 1) {
    //             group.sort((a, b) => {
    //                 const matchResult = isFinal
    //                     ? compareHeadToHeadTwoRounds(a, b, round1Results, round2Results)
    //                     : compareHeadToHead(a, b, results);
    
    //                 if (matchResult !== 0) return matchResult;
    
    //                 const setsDiffA = a.setsWon - a.setsLost;
    //                 const setsDiffB = b.setsWon - b.setsLost;
    //                 return setsDiffB - setsDiffA;
    //             });
    //         }
    //     });
    
    //     // 6️⃣ Проставляем места
    //     let sortedPlayers = groupedStandings.flat();
    //     sortedPlayers.forEach((player, index) => {
    //         player[placeKey] = index + 1;
    //     });
    
    //     // 7️⃣ Возвращаем игроков в исходном порядке
    //     return standings.map(player => {
    //         const updated = sortedPlayers.find(p => p.id === player.id);
    //         console.log({
    //             ...player,
    //             [placeKey]: updated?.[placeKey],
    //             totalPoints: isFinal ? updated?.totalPoints : player.totalPoints,
    //             setsWon: isFinal ? updated?.setsWon : player.setsWon,
    //             setsLost: isFinal ? updated?.setsLost : player.setsLost,
    //             wins: isFinal ? updated?.wins : player.wins,
    //             losses: isFinal ? updated?.losses : player.losses
    //         });
    //         return {
    //             ...player,
    //             [placeKey]: updated?.[placeKey],
    //             totalPoints: isFinal ? updated?.totalPoints : player.totalPoints,
    //             setsWon: isFinal ? updated?.setsWon : player.setsWon,
    //             setsLost: isFinal ? updated?.setsLost : player.setsLost,
    //             wins: isFinal ? updated?.wins : player.wins,
    //             losses: isFinal ? updated?.losses : player.losses
    //         };
    //     });
    // }
    
    function compareHeadToHeadTwoRounds(playerA, playerB, round1Results, round2Results, allPlayers) {
        const indexA = allPlayers.findIndex(p => p.id === playerA.id);
        const indexB = allPlayers.findIndex(p => p.id === playerB.id);
    
        let scoreA = 0, scoreB = 0;
    
        const compareResults = (results) => {
            if (results?.[indexA]?.[indexB]) {
                const [p1, p2] = results[indexA][indexB].split(":").map(Number);
                const isUnratedB = allPlayers[indexB]?.unrated;
                scoreA += isUnratedB && p1 < p2 ? p1 + 1 : p1;  // Победа при игре с нерейтинговым
                scoreB += isUnratedB && p1 < p2 ? p2 - 1 : p2;
            }
            if (results?.[indexB]?.[indexA]) {
                const [p2, p1] = results[indexB][indexA].split(":").map(Number);
                const isUnratedA = allPlayers[indexA]?.unrated;
                scoreA += isUnratedA && p1 < p2 ? p1 - 1 : p1;
                scoreB += isUnratedA && p1 < p2 ? p2 + 1 : p2;
            }
        };
    
        compareResults(round1Results);
        compareResults(round2Results);
    
        return scoreB - scoreA;
    }
    
    
    // function compareHeadToHeadTwoRounds(playerA, playerB, round1Results, round2Results) {
    //     const playerAId = playerA.id;
    //     const playerBId = playerB.id;
    
    //     // ✅ Находим индексы игроков в общем списке
    //     const playerAIndex = allParticipants.findIndex(p => p.id === playerAId);
    //     const playerBIndex = allParticipants.findIndex(p => p.id === playerBId);
    
    //     if (playerAIndex === -1 || playerBIndex === -1) {
    //         console.warn(`⚠️ Ошибка: Не удалось найти индекс для одного из игроков (${playerAId}, ${playerBId})`);
    //         return 0;
    //     }
    
    //     let scoreA = 0, scoreB = 0;
    
    //     // ✅ Проверяем личные встречи в 1-м круге (используем индексы)
    //     if (round1Results[playerAIndex] && round1Results[playerAIndex][playerBIndex]) {
    //         const [p1, p2] = round1Results[playerAIndex][playerBIndex].split(":").map(Number);
    //         scoreA += p1;
    //         scoreB += p2;
    //     }
    //     if (round1Results[playerBIndex] && round1Results[playerBIndex][playerAIndex]) {
    //         const [p2, p1] = round1Results[playerBIndex][playerAIndex].split(":").map(Number);
    //         scoreA += p1;
    //         scoreB += p2;
    //     }
    
    //     // ✅ Проверяем личные встречи во 2-м круге (используем индексы)
    //     if (round2Results[playerAIndex] && round2Results[playerAIndex][playerBIndex]) {
    //         const [p1, p2] = round2Results[playerAIndex][playerBIndex].split(":").map(Number);
    //         scoreA += p1;
    //         scoreB += p2;
    //     }
    //     if (round2Results[playerBIndex] && round2Results[playerBIndex][playerAIndex]) {
    //         const [p2, p1] = round2Results[playerBIndex][playerAIndex].split(":").map(Number);
    //         scoreA += p1;
    //         scoreB += p2;
    //     }
    
    //     console.log(`⚔️ Личные встречи ${playerA.name} vs ${playerB.name}: ${scoreA}:${scoreB}`);
    
    //     return scoreB - scoreA; // У кого больше очков в личных встречах — тот выше
    // }
    
    // function compareHeadToHeadTwoRounds(playerA, playerB, round1Results, round2Results) {
    //     const playerAId = playerA.id;
    //     const playerBId = playerB.id;
    
    //     let scoreA = 0, scoreB = 0;
    
    //     // Считаем очки личных встреч за 1-й круг
    //     if (round1Results[playerAId] && round1Results[playerAId][playerBId]) {
    //         const [p1, p2] = round1Results[playerAId][playerBId].split(":").map(Number);
    //         scoreA += p1;
    //         scoreB += p2;
    //     }
    //     if (round1Results[playerBId] && round1Results[playerBId][playerAId]) {
    //         const [p2, p1] = round1Results[playerBId][playerAId].split(":").map(Number);
    //         scoreA += p1;
    //         scoreB += p2;
    //     }
    
    //     // Считаем очки личных встреч за 2-й круг
    //     if (round2Results[playerAId] && round2Results[playerAId][playerBId]) {
    //         const [p1, p2] = round2Results[playerAId][playerBId].split(":").map(Number);
    //         scoreA += p1;
    //         scoreB += p2;
    //     }
    //     if (round2Results[playerBId] && round2Results[playerBId][playerAId]) {
    //         const [p2, p1] = round2Results[playerBId][playerAId].split(":").map(Number);
    //         scoreA += p1;
    //         scoreB += p2;
    //     }
    
    //     return scoreB - scoreA; // У кого больше очков в личных встречах — тот выше
    // }
    
    

    function addBracketsAndHighlightResults() {
        document.querySelectorAll("td[data-row][data-col]").forEach(td => {
            const text = td.textContent.trim();
    
            // Проверяем, есть ли результат в формате "X:Y"
            if (/^\d+:\d+$/.test(text) && !td.classList.contains("points") && !td.classList.contains("place")) {
                const [score1, score2] = text.split(":").map(n => parseInt(n, 10));
                const row = parseInt(td.getAttribute("data-row"));
                const col = parseInt(td.getAttribute("data-col"));
                const player1 = [...selectedPlayers, ...unratedPlayersList][row];
                const player2 = [...selectedPlayers, ...unratedPlayersList][col];
    
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


    // сохранение рейтинга до турнира
    function saveInitialRatings(players) {
        tournamentData.initialRatings = players.map(player => ({
            id: player.id,
            name: player.name,
            rating: player.rating ? Number(player.rating) : 0, // Если у игрока нет рейтинга, ставим 0
        }));
        console.log("Сохранены исходные рейтинги:", tournamentData.initialRatings);
    }
    
    // Функция сохранения новых рейтингов в базе данных
    async function saveUpdatedRatings(player1, player2) {
        // console.log('рейтинги этих игроков обновляются', player1, player2);
        try {
            const response = await fetch("/updatePlayerRatings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ players: [player1, player2] }),
            });
    
            if (!response.ok) throw new Error("Ошибка при обновлении рейтинга.");
    
            console.log("Рейтинг успешно сохранён в БД.");
        } catch (error) {
            console.error("Ошибка при сохранении рейтинга:", error);
        }
    }
   
    function calculateAverageRating(players) {
        const ratedPlayers = players.filter(player => player.rating > 0); // Исключаем нулевые рейтинги
        if (ratedPlayers.length === 0) return 0; // Если все внерейтинговые, средний рейтинг 0
    
        const totalRating = ratedPlayers.reduce((sum, player) => sum + parseFloat(player.rating), 0);
        return totalRating / ratedPlayers.length;
    }

    function getTournamentCoefficient(players) {
        const avgRating = calculateAverageRating(players);
        averageRating = avgRating.toFixed(0);
        
        if (avgRating < 250) {
            tournamentCoefficient = 0.2;
            return 0.2;
        }
        if (avgRating < 350) {
            tournamentCoefficient = 0.25;
            return 0.25;
        }
        if (avgRating < 450) {
            tournamentCoefficient = 0.3;
            return 0.3;
        }
        if (avgRating < 550) {
            tournamentCoefficient = 0.35;
            return 0.35;
        }
        tournamentCoefficient = 0.4;
        return 0.4;
    }

    function updatePlayerRating(winner, loser, scoreDiff, isWinnerNewbie, isLoserNewbie) {
        const RW = parseFloat(winner.rating) || 0; // Рейтинг победителя (если внерейтинговый — 0)
        const RL = parseFloat(loser.rating) || 0;  // Рейтинг проигравшего (если внерейтинговый — 0)
    
        if (Math.abs(RW - RL) >= 100) {
            console.log(`Разница 100+, рейтинг не меняется: ${winner.name || winner.fullname} (${RW}) vs ${loser.name || loser.name} (${RL})`);
            return;
        }
    
        const k = isWinnerNewbie ? 1 : (isLoserNewbie ? 0.5 : getTournamentCoefficient(allParticipants));
        const D = scoreDiff >= 3 ? 1.2 : (scoreDiff === 2 ? 1 : 0.8);
    
        const delta = ((100 - (RW - RL)) / 10) * k * D;
    
        console.log('winner', winner)
        console.log('loser', loser)
        console.log('scoreDiff', scoreDiff)
        console.log('isWinnerNewbie', isWinnerNewbie)
        console.log('isLoserNewbie', isLoserNewbie)
        console.log('k', k )
        console.log('D', D)
        console.log('delta', delta)
        if (!winner.unrated) winner.rating = Math.max(1, winner.rating + delta);
        if (!loser.unrated) loser.rating = Math.max(1, loser.rating - delta);
        
        if (winner.unrated) winner.rating = 0;
        if (loser.unrated) loser.rating = 0;
        console.log(`Рейтинг обновлён: ${winner.name || winner.fullname} (${winner.rating}) vs ${loser.name || loser.fullname} (${loser.rating})`);
    }

    
   
    function highlightWinnerLoser() {
        const scoreInputs = document.querySelectorAll(".modalPairBlockDone input");
        const player1Score = parseInt(scoreInputs[0].value) || 0;
        const player2Score = parseInt(scoreInputs[1].value) || 0;
    
        // Получаем блоки игроков
        const player1Block = document.querySelector(".modalScoreBlock_points_row.firstPlayer");
        const player2Block = document.querySelector(".modalScoreBlock_points_row.secondPlayer");
    
        // Получаем все инпуты заработанных очков
        const player1PointInputs = player1Block.querySelectorAll(".modalScoreBlock_points_right input");
        const player2PointInputs = player2Block.querySelectorAll(".modalScoreBlock_points_right input");
    
        // Сброс цветов перед новой проверкой
        [scoreInputs[0], scoreInputs[1], ...player1PointInputs, ...player2PointInputs].forEach(input => {
            input.style.background = "";
        });
    
        if (player1Score > player2Score) {
            // Победил первый игрок
            scoreInputs[0].style.background = "#FA6400";
            scoreInputs[1].style.background = "#D10000";
    
            player1PointInputs.forEach(input => {
                if (input.value.trim() !== "") input.style.background = "#FA6400";
            });
            player2PointInputs.forEach(input => {
                if (input.value.trim() !== "") input.style.background = "#D10000";
            });
        } else if (player2Score > player1Score) {
            // Победил второй игрок
            scoreInputs[1].style.background = "#FA6400";
            scoreInputs[0].style.background = "#D10000";
    
            player2PointInputs.forEach(input => {
                if (input.value.trim() !== "") input.style.background = "#FA6400";
            });
            player1PointInputs.forEach(input => {
                if (input.value.trim() !== "") input.style.background = "#D10000";
            });
        }
    }



    document.getElementById("showResult").addEventListener("click", async () => {
        document.querySelector('.completed').style.display = 'block';
        document.querySelector('.results').style.display = 'block';
        // Устанавливаем флаг "finished" в `state`
        tournamentData = await fetchTournament(tournamentId);
        tournamentData.finished = true;

        getTournamentCoefficient(tournamentData.initialRatings);
        tournamentData.averageRating = averageRating;
        tournamentData.coefficient = tournamentCoefficient;

        // Блокируем кнопку
        const btn = document.getElementById("showResult");
        // console.log("🔍 Перед блокировкой:", btn.disabled); // Проверяем начальное состояние
        btn.disabled = true;
        btn.classList.add('disabledButton');
        
        if (selectedType === 'roundRobin') {
            renderCompletedGames(finishedPairs);
            renderFinalResults(tournamentData);
        }

        if (selectedType === 'twoRound') {

            renderCompletedGamesTwoRound(finishedPairs);
            console.log("Игроки:", tournamentData.players);
            renderFinalResultsTwoRound(tournamentData);
        }
        
        if (selectedType === 'roundRobin') {
            await saveTournament(null, null, tournamentData);
        } else if (selectedType === 'twoRound') {
            console.log('тут сохраняю FINISHED');
            saveTournamentTwoRound(tournamentData, null, { finished: true });
        }
       
        

    });


    if (tournamentData.finished) {
        console.log("🎉 Турнир уже завершён. Показываем результаты!");
        document.querySelector('.completed').style.display = 'block';
        document.querySelector('.results').style.display = 'block';
        // Блокируем кнопку
        const btn = document.getElementById("showResult");
        // console.log("🔍 Перед блокировкой:", btn.disabled); // Проверяем начальное состояние
        btn.disabled = true;
        btn.classList.add('disabledButton');

        tournamentData = await fetchTournament(tournamentId);
        // Рендерим финальные результаты
        

        if (selectedType === 'roundRobin') {
            renderCompletedGames(tournamentData.finishedPairs);
            renderFinalResults(tournamentData);
        }

        if (selectedType === 'twoRound') {
            renderCompletedGamesTwoRound(tournamentData.finishedPairs);
            console.log("Игроки:", tournamentData.players);
            renderFinalResultsTwoRound(tournamentData);
        }
    }
    
    function renderCompletedGames(pairs) {
        const container = document.querySelector(".completedGames-wrapper");
        if (!container) {
            console.error("Элемент .completedGames-wrapper не найден!");
            return;
        }
        container.innerHTML = ""; // Очищаем контейнер перед рендерингом
    
        if (!pairs || pairs.length === 0) {
            console.warn("Нет завершённых игр для рендеринга.");
            return;
        }
    
        const uniquePairs = new Set();
    
        pairs.forEach(pair => {
            if (!pair.player1 || !pair.player2) {
                console.log("Пропущена пара без игроков:", pair);
                return;
            }
    
            // Получаем индексы игроков в массиве players
            const player1Index = [...tournamentData.players, ...tournamentData.unratedPlayers].findIndex(p => p.id === pair.player1.id);
            const player2Index = [...tournamentData.players, ...tournamentData.unratedPlayers].findIndex(p => p.id === pair.player2.id);
    
            if (player1Index === -1 || player2Index === -1) {
                console.log(`Игроки не найдены в списке players:`, pair);
                // console.warn(`Игроки не найдены в списке players:`, pair);
                return;
            }
    
            // Получаем результаты из объекта results
            const score = results[player1Index]?.[player2Index] || results[player2Index]?.[player1Index];
    
            if (!score) {
                console.log(`⚠️ Счёт не найден для пары ${pair.player1.fullname} vs ${pair.player2.fullname}`);
                return;
            }
    
            console.log(`✅ Найден счёт: ${score} для ${pair.player1.fullname} vs ${pair.player2.fullname}`);
    
            const [score1, score2] = score.split(":").map(Number);
    
            
            // Проверяем, есть ли нерейтинговый игрок в паре
            const isPlayer1Unrated = pair.player1.unrated;
            const isPlayer2Unrated = pair.player2.unrated;
            console.log('isPlayer1Unrated', isPlayer1Unrated, 'isPlayer2Unrated', isPlayer2Unrated);
            // let leftPlayer, rightPlayer, leftScore, rightScore;
            let winner, loser, winnerScore, loserScore;

            if (isPlayer1Unrated && isPlayer2Unrated) {
                // Оба игрока нерейтинговые → оставляем как есть
                winner = pair.player1;
                loser = pair.player2;
                winnerScore = score1;
                loserScore = score2;
            } else if (isPlayer1Unrated || isPlayer2Unrated) {
                // Если один из игроков нерейтинговый, победителем всегда считается рейтинговый
                if (isPlayer1Unrated) {
                    winner = pair.player2; // Рейтинговый игрок
                    loser = pair.player1; // Нерейтинговый игрок
                    winnerScore = score2;
                    loserScore = score1;
                } else {
                    winner = pair.player1; // Рейтинговый игрок
                    loser = pair.player2; // Нерейтинговый игрок
                    winnerScore = score1;
                    loserScore = score2;
                }
            } else {
                // Обычная логика: победитель всегда слева
                if (score1 > score2) {
                    winner = pair.player1;
                    loser = pair.player2;
                    winnerScore = score1;
                    loserScore = score2;
                } else {
                    winner = pair.player2;
                    loser = pair.player1;
                    winnerScore = score2;
                    loserScore = score1;
                }
            }
            
    
            const pairDiv = document.createElement("div");
            pairDiv.classList.add("completedGames-wrapper_pair");
    
            pairDiv.innerHTML = `
                <h4 class="completedGames-wrapper_pair_player1">${winner.name || winner.fullname}</h4>
                <div class="completedGames-wrapper_pair_player1_score wins">${winnerScore}</div>
                <h5>:</h5>
                <div class="completedGames-wrapper_pair_player2_score losers">${loserScore}</div>
                <h4 class="completedGames-wrapper_pair_player2">${loser.name || loser.fullname}</h4>
            `;
    
            container.appendChild(pairDiv);
        });
    
        console.log("🎉 Завершённые игры рендерены:", uniquePairs);
    }
    
    function renderCompletedGamesTwoRound(finishedPairs) {
        const container = document.querySelector(".completedGames-wrapper");
        if (!container) {
            console.error("Элемент .completedGames-wrapper не найден!");
            return;
        }
    
        container.innerHTML = ""; // Очищаем контейнер перед рендерингом
    
        if (!finishedPairs || finishedPairs.length === 0) {
            console.warn("Нет завершённых игр для рендеринга.");
            return;
        }
    
        const allPlayers = [...tournamentData.players, ...tournamentData.unratedPlayers];
        const halfway = Math.floor(finishedPairs.length / 2); // Разделение кругов
    
        finishedPairs.forEach((pair, index) => {
            if (!pair.player1 || !pair.player2) {
                console.log("Пропущена пара без игроков:", pair);
                return;
            }
    
            const roundResults = index < halfway ? round1Results : round2Results;
    
            const player1Index = allPlayers.findIndex(p => p.id === pair.player1.id);
            const player2Index = allPlayers.findIndex(p => p.id === pair.player2.id);
    
            if (player1Index === -1 || player2Index === -1) {
                console.log(`Игроки не найдены в списке players:`, pair);
                return;
            }
    
            const score = roundResults[player1Index]?.[player2Index] || roundResults[player2Index]?.[player1Index];
            if (!score || typeof score !== "string") {
                console.log(`⚠️ Счёт не найден для пары ${pair.player1.fullname} vs ${pair.player2.fullname}`);
                return;
            }
    
            const [score1, score2] = score.split(":").map(Number);
    
            let winner, loser, winnerScore, loserScore;
            const isPlayer1Unrated = pair.player1.unrated;
            const isPlayer2Unrated = pair.player2.unrated;
    
            if (isPlayer1Unrated && isPlayer2Unrated) {
                winner = pair.player1;
                loser = pair.player2;
                winnerScore = score1;
                loserScore = score2;
            } else if (isPlayer1Unrated || isPlayer2Unrated) {
                if (isPlayer1Unrated) {
                    winner = pair.player2;
                    loser = pair.player1;
                    winnerScore = score2;
                    loserScore = score1;
                } else {
                    winner = pair.player1;
                    loser = pair.player2;
                    winnerScore = score1;
                    loserScore = score2;
                }
            } else {
                if (score1 > score2) {
                    winner = pair.player1;
                    loser = pair.player2;
                    winnerScore = score1;
                    loserScore = score2;
                } else {
                    winner = pair.player2;
                    loser = pair.player1;
                    winnerScore = score2;
                    loserScore = score1;
                }
            }
    
            const pairDiv = document.createElement("div");
            pairDiv.classList.add("completedGames-wrapper_pair");
    
            if (index === halfway - 1) {
                pairDiv.classList.add("round-separator"); // ✅ Ставим после последней пары 1-го круга
            }
            pairDiv.innerHTML = `
                <h4 class="completedGames-wrapper_pair_player1">${winner.name || winner.fullname}</h4>
                <div class="completedGames-wrapper_pair_player1_score wins">${winnerScore}</div>
                <h5>:</h5>
                <div class="completedGames-wrapper_pair_player2_score losers">${loserScore}</div>
                <h4 class="completedGames-wrapper_pair_player2">${loser.name || loser.fullname}</h4>
            `;
    
            container.appendChild(pairDiv);
        });
    
        console.log("🎉 Завершённые игры рендерены (2 круга):", finishedPairs.length);
    }

    function renderFinalResults(tournament) {
        const container = document.querySelector(".finalResults_table_content");
        if (!container) {
            console.error("❌ Элемент .finalResults_table_content не найден!");
            return;
        }
        container.innerHTML = "";
    
        if (!tournament.players || tournament.players.length === 0) {
            console.warn("⚠️ Нет данных для рендеринга финальных результатов.");
            return;
        }
    
        const allPlayers = [...tournament.players, ...(tournament.unratedPlayers || [])];
        const playerStats = allPlayers.map(player => {
            const fullPlayerData = allplayers.find(p => p.id === player.id);
            const city = fullPlayerData?.cityName || fullPlayerData?.city || player.city || "Unknown";
    
            const ratingBefore = tournament.initialRatings.find(p => p.id === player.id)?.rating ?? 0;
            const ratingAfter = player.rating ?? ratingBefore;
            const ratingChange = (ratingAfter - ratingBefore).toFixed(1);
    
            const wins = player.wins ?? 0;
            const losses = player.losses ?? 0;
            const setsWon = player.setsWon ?? 0;
            const setsLost = player.setsLost ?? 0;
            const totalGames = wins + losses;
            const totalSets = setsWon + setsLost;
    
            return {
                place: player.place || 0,
                name: player.name || player.fullname,
                city,
                games: `${totalGames}(${wins}-${losses})`,
                sets: `${totalSets}(${setsWon}-${setsLost})`,
                ratingChange: ratingChange > 0 ? `+${ratingChange}` : ratingChange,
                ratingBefore: ratingBefore.toFixed(1),
                ratingAfter: ratingAfter.toFixed(1),
                logo: player.logo
            };
        });
    
        playerStats.sort((a, b) => a.place - b.place);
    
        playerStats.forEach(player => {
            const playerDiv = document.createElement("div");
            playerDiv.classList.add("finalResults_table_player");
    
            const ratingColor =
                player.ratingChange > 0 ? "#007026" :
                player.ratingChange < 0 ? "#F00" : "#666877";
    
            playerDiv.innerHTML = `
                <div class="finalResults_number">${player.place || '0'}</div>
                <div class="cell finalResults_player">
                    <div class="playerLogo" style="background-image: url('${player.logo}'); background-position: 50%; background-size: cover; background-repeat: no-repeat;"></div>
                    <span>${player.name}</span>
                </div>
                <div class="cell finalResults_city">${player.city}</div>
                <div class="cell finalResults_games">${player.games}</div>
                <div class="cell finalResults_sets">${player.sets}</div>
                <div class="cell finalResults_avarage" style="color: ${ratingColor}; font-weight: bold;">
                    ${player.ratingChange}
                </div>
                <div class="cell finalResults_before">${player.ratingBefore}</div>
                <div class="cell finalResults_after">${player.ratingAfter}</div>
            `;
    
            container.appendChild(playerDiv);
        });
    
        console.log("📊 Финальные результаты (круговой турнир):", playerStats);
    }
    
    
    // function renderFinalResults(tournament) {
    //     const container = document.querySelector(".finalResults_table_content");
    //     if (!container) {
    //         console.error("❌ Элемент .finalResults_table_content не найден!");
    //         return;
    //     }
    //     container.innerHTML = "";
    
    //     if (!tournament.players || tournament.players.length === 0 || !tournament.results) {
    //         console.warn("⚠️ Нет данных для рендеринга финальных результатов.");
    //         return;
    //     }
    
    //     const allPlayers = [...tournament.players, ...tournament.unratedPlayers];
    //     console.log(allPlayers);
    //     const playerStats = allPlayers.map(player => {
    //         const fullPlayerData = allplayers.find(p => p.id === player.id);
    //         const city = fullPlayerData?.cityName || fullPlayerData?.city || player.city || "Unknown";
    
    //         const ratingBefore = tournament.initialRatings.find(p => p.id === player.id)?.rating ?? 0;
    //         const ratingAfter = player.rating ?? ratingBefore;
    //         const ratingChange = (ratingAfter - ratingBefore).toFixed(1);
    
    //         // 🧠 Найдём индекс игрока в results по позиции
    //         const playerIndex = allPlayers.findIndex(p => p.id === player.id);
    //         const resultRow = tournament.results[playerIndex] || {};
    //         let gamesPlayed = 0;
    //         let setsWon = 0;
    //         let setsLost = 0;
    //         let wins = 0;
    //         let losses = 0;
    
    //         for (let opponentIndex in resultRow) {
    //             if (opponentIndex === "sets" || opponentIndex === "points") continue;
    //             const [score1, score2] = resultRow[opponentIndex].split(":").map(Number);
    //             gamesPlayed++;
    //             setsWon += score1;
    //             setsLost += score2;
    //             if (score1 > score2) wins++;
    //             else losses++;
    //         }
    
    //         return {
    //             place: player.place || 0,
    //             name: player.name || player.fullname,
    //             city,
    //             games: `${gamesPlayed}(${wins}-${losses})`,
    //             sets: `${setsWon + setsLost}(${setsWon}-${setsLost})`,
    //             ratingChange: ratingChange > 0 ? `+${ratingChange}` : ratingChange,
    //             ratingBefore: ratingBefore.toFixed(1),
    //             ratingAfter: ratingAfter.toFixed(1),
    //             logo: player.logo
    //         };
    //     });
    
    //     playerStats.sort((a, b) => a.place - b.place);
    
    //     playerStats.forEach(player => {
    //         const playerDiv = document.createElement("div");
    //         playerDiv.classList.add("finalResults_table_player");
    
    //         const ratingColor =
    //             player.ratingChange > 0 ? "#007026" :
    //             player.ratingChange < 0 ? "#F00" : "#666877";
    
    //         playerDiv.innerHTML = `
    //             <div class="finalResults_number">${player.place || '0'}</div>
    //             <div class="cell finalResults_player">
    //                 <div class="playerLogo" style="background-image: url('${player.logo}'); background-position: 50%; background-size: cover; background-repeat: no-repeat;"></div>
    //                 <span>${player.name}</span>
    //             </div>
    //             <div class="cell finalResults_city">${player.city}</div>
    //             <div class="cell finalResults_games">${player.games}</div>
    //             <div class="cell finalResults_sets">${player.sets}</div>
    //             <div class="cell finalResults_avarage" style="color: ${ratingColor}; font-weight: bold;">
    //                 ${player.ratingChange}
    //             </div>
    //             <div class="cell finalResults_before">${player.ratingBefore}</div>
    //             <div class="cell finalResults_after">${player.ratingAfter}</div>
    //         `;
    
    //         container.appendChild(playerDiv);
    //     });
    
    //     console.log("📊 Финальные результаты (круговой турнир):", playerStats);
    // }
    

    // function renderFinalResults(tournament) {
    //     const container = document.querySelector(".finalResults_table_content");
    //     if (!container) {
    //         console.error("❌ Элемент .finalResults_table_content не найден!");
    //         return;
    //     }
    //     container.innerHTML = ""; // Очищаем контейнер перед рендерингом
    
    //     if (!tournament.players || tournament.players.length === 0 || !tournament.results) {
    //         console.log("⚠️ Нет данных для рендеринга финальных результатов.");
    //         console.warn("⚠️ Нет данных для рендеринга финальных результатов.");
    //         return;
    //     }
    
    //     let playerStats = [...tournament.players, ...tournament.unratedPlayers].map((player, index) => {
    //         // console.log('inex', index);
    //         // console.log('player', player.fullname);
    //         const playerResults = tournament.results[index] || {}; // Используем индекс для сопоставления
    //         const totalGames = Object.keys(playerResults).filter(key => key !== "sets" && key !== "points").length;
    //         // const city = player.cityName || "Unknown";
    //         let fullPlayerData = allplayers.find(p => p.id === player.id);
    //         const city = fullPlayerData ? fullPlayerData.cityName || fullPlayerData.city : "Unknown";
            
    //         // ✅ Получаем рейтинг ДО турнира
    //         const ratingBefore = tournament.initialRatings.find(p => p.id === player.id)?.rating ?? 0;
    //         // ✅ Рейтинг ПОСЛЕ турнира
    //         const ratingAfter = player.rating ?? ratingBefore;
    //         // ✅ Изменение рейтинга
    //         const ratingChange = (ratingAfter - ratingBefore).toFixed(1);
            
    //         // console.log(`данные игрока ${player.name || player.fullname}`, {place: player.place,
    //         //     name: player.name || player.fullname,
    //         //     city: city,
    //         //     games: `${totalGames}(${player.wins}-${player.losses})`,
    //         //     sets: `${player.setsWon + player.setsLost}(${player.setsWon}-${player.setsLost})`,
    //         //     ratingChange: ratingChange > 0 ? `+${ratingChange}` : ratingChange,
    //         //     ratingBefore: ratingBefore.toFixed(1),
    //         //     ratingAfter: ratingAfter.toFixed(1),
    //         //     logo: player.logo}
    //         // );

    //         return {
    //             place: player.place,
    //             name: player.name || player.fullname,
    //             city: (city === "Unknown") ? player.city : city,
    //             games: `${totalGames}(${player.wins}-${player.losses})`,
    //             sets: `${player.setsWon + player.setsLost}(${player.setsWon}-${player.setsLost})`,
    //             ratingChange: ratingChange > 0 ? `+${ratingChange}` : ratingChange,
    //             ratingBefore: ratingBefore.toFixed(1),
    //             ratingAfter: ratingAfter.toFixed(1),
    //             logo: player.logo
    //         };
    //     });
    //     console.log('список игроков с результатами:', playerStats);
    //     playerStats.sort((a, b) => a.place - b.place); // ✅ Сортируем по `place`
        
    //     console.log("📊 Финальная статистика игроков (отсортирована):", playerStats);
    
    //     // Рендеринг таблицы
    //     playerStats.forEach(player => {
    //         const playerDiv = document.createElement("div");
    //         playerDiv.classList.add("finalResults_table_player");
    
    //         const ratingColor = player.ratingChange > 0 ? "#007026" : player.ratingChange < 0 ? "#F00" : "#666877";
    
    //         playerDiv.innerHTML = `
    //             <div class="finalResults_number">${player.place || '0'}</div>
    //             <div class="cell finalResults_player">
    //                 <div class="playerLogo" style="background-image: url('${player.logo}'); background-position: 50%; background-size: cover; background-repeat: no-repeat;"></div>
    //                 <span>${player.name}</span>
    //             </div>
    //             <div class="cell finalResults_city">${player.city}</div>
    //             <div class="cell finalResults_games">${player.games}</div>
    //             <div class="cell finalResults_sets">${player.sets}</div>
    //             <div class="cell finalResults_avarage" style="color: ${ratingColor}; font-weight: bold;">
    //                 ${player.ratingChange}
    //             </div>
    //             <div class="cell finalResults_before">${player.ratingBefore}</div>
    //             <div class="cell finalResults_after">${player.ratingAfter}</div>
    //         `;
    
    //         container.appendChild(playerDiv);
    //     });
    // }


    function renderFinalResultsTwoRound(tournament) {
        const container = document.querySelector(".finalResults_table_content");
        if (!container) {
            console.error("❌ Элемент .finalResults_table_content не найден!");
            return;
        }
        container.innerHTML = "";
    
        const allPlayers = [...tournament.players, ...tournament.unratedPlayers];
    
        const playerStats = allPlayers.map(player => {
            const fullPlayerData = allplayers.find(p => p.id === player.id);
            const city = fullPlayerData?.cityName || fullPlayerData?.city || player.city || "Unknown";
    
            const ratingBefore = tournament.initialRatings.find(p => p.id === player.id)?.rating ?? 0;
            const ratingAfter = player.rating ?? ratingBefore;
            const ratingChange = (ratingAfter - ratingBefore).toFixed(1);
    
            const totalGames = player.wins + player.losses;
            const totalSets = player.setsWon + player.setsLost;
    
            return {
                place: player.place || 0,
                name: player.name || player.fullname,
                city,
                games: `${totalGames}(${player.wins}-${player.losses})`,
                sets: `${totalSets}(${player.setsWon}-${player.setsLost})`,
                ratingChange: ratingChange > 0 ? `+${ratingChange}` : ratingChange,
                ratingBefore: ratingBefore.toFixed(1),
                ratingAfter: ratingAfter.toFixed(1),
                logo: player.logo
            };
        });
    
        playerStats.sort((a, b) => a.place - b.place);
    
        playerStats.forEach(player => {
            const playerDiv = document.createElement("div");
            playerDiv.classList.add("finalResults_table_player");
    
            const ratingColor = player.ratingChange > 0
                ? "#007026"
                : player.ratingChange < 0
                    ? "#F00"
                    : "#666877";
    
            playerDiv.innerHTML = `
                <div class="finalResults_number">${player.place}</div>
                <div class="cell finalResults_player">
                    <div class="playerLogo" style="background-image: url('${player.logo}'); background-position: 50%; background-size: cover; background-repeat: no-repeat;"></div>
                    <span>${player.name}</span>
                </div>
                <div class="cell finalResults_city">${player.city}</div>
                <div class="cell finalResults_games">${player.games}</div>
                <div class="cell finalResults_sets">${player.sets}</div>
                <div class="cell finalResults_avarage" style="color: ${ratingColor}; font-weight: bold;">
                    ${player.ratingChange}
                </div>
                <div class="cell finalResults_before">${player.ratingBefore}</div>
                <div class="cell finalResults_after">${player.ratingAfter}</div>
            `;
    
            container.appendChild(playerDiv);
        });
    
        console.log("📊 Финальные результаты (2 круга):", playerStats);
    }
    
    // function renderFinalResultsTwoRound(tournament) {
    //     const container = document.querySelector(".finalResults_table_content");
    //     if (!container) {
    //         console.error("❌ Элемент .finalResults_table_content не найден!");
    //         return;
    //     }
    //     container.innerHTML = "";
    
    //     const {
    //         players = [],
    //         unratedPlayers = [],
    //         initialRatings = [],
    //         round1Results = {},
    //         round2Results = {}
    //     } = tournament;
    
    //     const allPlayers = [...players, ...unratedPlayers];
    
    //     const playerStats = allPlayers.map((player, index) => {
    //         let gamesPlayed = 0;
    //         let wins = 0;
    //         let losses = 0;
    //         let setsWon = 0;
    //         let setsLost = 0;
    
    //         [round1Results, round2Results].forEach(results => {
    //             const row = results[index];
    //             console.log(row);
    //             if (row) {
    //                 for (let opponentIndex in row) {
    //                     if (opponentIndex === "sets" || opponentIndex === "points") continue;
    //                     const scoreStr = row[opponentIndex];
    //                     if (typeof scoreStr !== "string" || !scoreStr.includes(":")) continue;
    
    //                     const [score1, score2] = scoreStr.split(":").map(Number);
    //                     gamesPlayed++;
    //                     setsWon += score1;
    //                     setsLost += score2;
    //                     if (score1 > score2) wins++;
    //                     else losses++;
    //                 }
    //             }
    //         });
    
    //         const fullPlayerData = allplayers.find(p => p.id === player.id);
    //         const city = fullPlayerData ? fullPlayerData.cityName || fullPlayerData.city : player.city || "Unknown";
    //         const ratingBefore = initialRatings.find(p => p.id === player.id)?.rating ?? 0;
    //         const ratingAfter = player.rating ?? ratingBefore;
    //         const ratingChange = (ratingAfter - ratingBefore).toFixed(1);
    
    //         return {
    //             place: player.place || 0,
    //             name: player.name || player.fullname,
    //             city,
    //             games: `${gamesPlayed}(${wins}-${losses})`,
    //             sets: `${setsWon + setsLost}(${setsWon}-${setsLost})`,
    //             ratingChange: ratingChange > 0 ? `+${ratingChange}` : ratingChange,
    //             ratingBefore: ratingBefore.toFixed(1),
    //             ratingAfter: ratingAfter.toFixed(1),
    //             logo: player.logo
    //         };
    //     });
    
    //     playerStats.sort((a, b) => a.place - b.place);
    
    //     playerStats.forEach(player => {
    //         const playerDiv = document.createElement("div");
    //         playerDiv.classList.add("finalResults_table_player");
    
    //         const ratingColor =
    //             player.ratingChange > 0
    //                 ? "#007026"
    //                 : player.ratingChange < 0
    //                     ? "#F00"
    //                     : "#666877";
    
    //         playerDiv.innerHTML = `
    //             <div class="finalResults_number">${player.place}</div>
    //             <div class="cell finalResults_player">
    //                 <div class="playerLogo" style="background-image: url('${player.logo}'); background-position: 50%; background-size: cover; background-repeat: no-repeat;"></div>
    //                 <span>${player.name}</span>
    //             </div>
    //             <div class="cell finalResults_city">${player.city}</div>
    //             <div class="cell finalResults_games">${player.games}</div>
    //             <div class="cell finalResults_sets">${player.sets}</div>
    //             <div class="cell finalResults_avarage" style="color: ${ratingColor}; font-weight: bold;">
    //                 ${player.ratingChange}
    //             </div>
    //             <div class="cell finalResults_before">${player.ratingBefore}</div>
    //             <div class="cell finalResults_after">${player.ratingAfter}</div>
    //         `;
    
    //         container.appendChild(playerDiv);
    //     });
    
    //     console.log("📊 Финальные результаты (идеальный подсчёт по индексам):", playerStats);
    // }
    
        
    
    

    // function renderFinalResultsTwoRound(tournament) {
    //     const container = document.querySelector(".finalResults_table_content");
    //     if (!container) {
    //         console.error("❌ Элемент .finalResults_table_content не найден!");
    //         return;
    //     }
    //     container.innerHTML = ""; // Очищаем перед отрисовкой
    
    //     if (!tournament.players || tournament.players.length === 0) {
    //         console.warn("⚠️ Нет данных для рендеринга финальных результатов.");
    //         return;
    //     }
    
    //     const allPlayers = [...tournament.players, ...tournament.unratedPlayers];
    //     const playerStats = allPlayers.map(player => {
    //         const fullPlayerData = allplayers.find(p => p.id === player.id);
    //         const city = fullPlayerData ? fullPlayerData.cityName || fullPlayerData.city : player.city || "Unknown";
    
    //         const ratingBefore = tournament.initialRatings.find(p => p.id === player.id)?.rating ?? 0;
    //         const ratingAfter = player.rating ?? ratingBefore;
    //         const ratingChange = (ratingAfter - ratingBefore).toFixed(1);
    
    //         const totalGames = player.wins + player.losses;
    //         const totalSets = player.setsWon + player.setsLost;
    //         console.log({
    //             place: player.place || 0,
    //             name: player.name || player.fullname,
    //             city,
    //             games: `${totalGames}(${player.wins}-${player.losses})`,
    //             sets: `${totalSets}(${player.setsWon}-${player.setsLost})`,
    //             ratingChange: ratingChange > 0 ? `+${ratingChange}` : ratingChange,
    //             ratingBefore: ratingBefore.toFixed(1),
    //             ratingAfter: ratingAfter.toFixed(1),
    //             logo: player.logo
    //         })
    //         return {
    //             place: player.place || 0,
    //             name: player.name || player.fullname,
    //             city,
    //             games: `${totalGames}(${player.wins}-${player.losses})`,
    //             sets: `${totalSets}(${player.setsWon}-${player.setsLost})`,
    //             ratingChange: ratingChange > 0 ? `+${ratingChange}` : ratingChange,
    //             ratingBefore: ratingBefore.toFixed(1),
    //             ratingAfter: ratingAfter.toFixed(1),
    //             logo: player.logo
    //         };
    //     });
    
    //     playerStats.sort((a, b) => a.place - b.place);
    
    //     playerStats.forEach(player => {
    //         const playerDiv = document.createElement("div");
    //         playerDiv.classList.add("finalResults_table_player");
    
    //         const ratingColor = player.ratingChange > 0
    //             ? "#007026"
    //             : player.ratingChange < 0
    //                 ? "#F00"
    //                 : "#666877";
    
    //         playerDiv.innerHTML = `
    //             <div class="finalResults_number">${player.place}</div>
    //             <div class="cell finalResults_player">
    //                 <div class="playerLogo" style="background-image: url('${player.logo}'); background-position: 50%; background-size: cover; background-repeat: no-repeat;"></div>
    //                 <span>${player.name}</span>
    //             </div>
    //             <div class="cell finalResults_city">${player.city}</div>
    //             <div class="cell finalResults_games">${player.games}</div>
    //             <div class="cell finalResults_sets">${player.sets}</div>
    //             <div class="cell finalResults_avarage" style="color: ${ratingColor}; font-weight: bold;">
    //                 ${player.ratingChange}
    //             </div>
    //             <div class="cell finalResults_before">${player.ratingBefore}</div>
    //             <div class="cell finalResults_after">${player.ratingAfter}</div>
    //         `;
    
    //         container.appendChild(playerDiv);
    //     });
    
    //     console.log("📊 Финальные результаты (2 круга):", playerStats);
    // }
    


    async function fetchTournament(tournamentId) {
        try {
          const response = await fetch(`/get-data-tournament?tournamentId=${tournamentId}`);
          
          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to fetch tournament data.');
          }
      
          const tournament = await response.json();
        //   console.log('Tournament data:', tournament);
          ratingLimit = tournament.ratingLimit || tournament.restrictions;
          return tournament;
        } catch (error) {
          console.error('Error fetching tournament:', error.message);
          showErrorModal(error.message || 'Failed to fetch tournament data.');
          return null;
        }
    }


    // ------------------------------------------------------ КРУГОВОЙ ------ КРУГОВОЙ ------КРУГОВОЙ-----------------------------------------

    async function saveTournament(state = null, standings = null, final) {
        // 1️⃣ Формируем `state` вручную, если он не передан
        if (!state) {
            state = {
                players: selectedPlayers.map(player => {
                    const fullPlayerData = allplayers.find(p => p.id === player.id);
                    return {
                        id: player.id,
                        birthYear: player.birthYear,
                        fullname: player.fullname || player.name,
                        place: player.place,
                        rating: player.rating,
                        city: fullPlayerData ? fullPlayerData.city || fullPlayerData.cityName : "Unknown"
                    };
                }),
                retiredPlayers: retiredPlayers.map(player => ({
                    id: player.id,
                    birthYear: player.birthYear,
                    fullname: player.fullname || player.name,
                    rating: player.rating,
                    retired: true
                })),
                unratedPlayers: unratedPlayersList.map(player => ({
                    id: player.id,
                    name: player.name || player.fullname,
                    birthYear: player.birthYear,
                    city: player.city,
                    nickname: player.nickname,
                    unrated: true
                })),
                waitingPairs,
                currentPairs,
                finishedPairs,
                roundCounter,
                results,
                initialRatings: tournamentData.initialRatings,
                typeOfTournament: selectedType || 'roundRobin',
            };
        }
    
        // 2️⃣ Если есть standings — обновляем данные в state
        if (Array.isArray(standings) && standings.length > 0) {
            const updatedPlayers = [];
            const updatedUnratedPlayers = [];
    
            standings.forEach(player => {
                const updatedPlayer = state.players.find(p => p.id === player.id);
                const mergedPlayer = updatedPlayer ? { ...updatedPlayer, ...player } : player;
    
                if (mergedPlayer.unrated) {
                    updatedUnratedPlayers.push(mergedPlayer);
                } else {
                    updatedPlayers.push(mergedPlayer);
                }
            });
    
            state.players = updatedPlayers;
            state.unratedPlayers = updatedUnratedPlayers;
        }
    
        // 3️⃣ Добавляем финальные данные, если есть
        if (final) {
            state = { ...state, ...final };
        }
    
        // 4️⃣ Обновляем флаг завершения
        state.finished = tournamentData.finished || false;
    
        // 5️⃣ Отправляем на сервер
        try {
            const response = await fetch('/saveTournament', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ tournamentId, state }),
            });
    
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Failed to save tournament');
            }
    
            const responseData = await response.json();
            console.log("✅ Tournament saved:", responseData);
    
            if (byUser) {
                showErrorModal('Tournament saved successfully!', 'Congratulation');
                byUser = false;
            }
        } catch (error) {
            console.error('Error saving tournament:', error);
            showErrorModal(error.message || 'Failed to save tournament');
        }
    }
    
    // async function saveTournament(state = null, standings = null, final) {
    //     // console.log(standings);

    //     if (!state) {
    //         state = {
    //             players: selectedPlayers.map(player => {
    //                 const fullPlayerData = allplayers.find(p => p.id === player.id);
    //                 return {
    //                     id: player.id,
    //                     birthYear: player.birthYear,
    //                     fullname: player.fullname || player.name,
    //                     place: player.place,
    //                     rating: player.rating,
    //                     city: fullPlayerData ? fullPlayerData.city  || fullPlayerData.cityName : "Unknown"
    //                 };
    //             }),
    //             retiredPlayers: retiredPlayers.map(player => ({
    //                 id: player.id,
    //                 birthYear: player.birthYear,
    //                 fullname: player.fullname || player.name,
    //                 rating: player.rating,
    //                 retired: true // Флаг выбывшего игрока
    //             })),
    //             unratedPlayers: unratedPlayersList.map(player => ({
    //                 id: player.id,
    //                 name: player.name || player.fullname,
    //                 birthYear: player.birthYear,
    //                 city: player.city,
    //                 nickname: player.nickname,
    //                 unrated: true // Флаг внерейтингового игрока
    //             })),
    //             waitingPairs,
    //             currentPairs,
    //             finishedPairs,
    //             roundCounter,
    //             results,
    //             initialRatings: tournamentData.initialRatings,
    //             typeOfTournament:  selectedType !== tournamentData.typeOfTournament ? selectedType : tournamentData.typeOfTournament || 'roundRobin'
    //         };
    //     }
    //     // console.log('state', state);
    //     // console.log('standings', standings);
        
    //     if (Array.isArray(standings) && standings.length > 0) {
    //         const updatedPlayers = [];
    //         const updatedUnratedPlayers = [];
        
    //         standings.forEach(player => {
    //             const updatedPlayer = state.players.find(p => p.id === player.id);
    //             const mergedPlayer = updatedPlayer ? { ...updatedPlayer, ...player } : player;
        
    //             if (mergedPlayer.unrated) {
    //                 updatedUnratedPlayers.push(mergedPlayer); // Нерейтинговые игроки
    //             } else {
    //                 updatedPlayers.push(mergedPlayer); // Рейтинговые игроки
    //             }
    //         });
        
    //         state.players = updatedPlayers;
    //         state.unratedPlayers = updatedUnratedPlayers;
    //     }

       

    //     if (
    //         (!standings || standings.length === 0) &&
    //         (!state || Object.keys(state).length === 0 || waitingPairs.length > 0 || currentPairs.length > 0 || finishedPairs.length > 0)
    //     ) {
    //         if (!tournamentData.finished) {
    //             console.log("`standings` отсутствует, но пары есть. Ждем обновления...");
    //             return;
    //         } 
            
    //     }
        
    //     if (final) {
    //         state = { ...state, ...final }; // Объединяем данные без потери информации
    //     }

    //     state.finished = tournamentData.finished || false;

    //     try {
    //         const response = await fetch('/saveTournament', {
    //             method: 'POST',
    //             headers: { 'Content-Type': 'application/json' },
    //             body: JSON.stringify({ tournamentId, state }),
    //         });

    //         if (!response.ok) {
    //             const error = await response.json();
    //             throw new Error(error.message || 'Failed to save tournament');
    //         }

    //         const responseData = await response.json();
    //         console.log("✅ Tournament saved:", responseData);
            
    //         if (byUser) {
    //             showErrorModal('Tournament saved successfully!', 'Congratulation');
    //             byUser = false;
    //         }
    //     } catch (error) {
    //         console.error('Error saving tournament:', error);
    //         showErrorModal(error.message || 'Failed to save tournament');
    //     }
    // }


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
    
                const player1 = standings.find(p => p.id == players[row].id);
                const player2 = standings.find(p => p.id == players[col].id);

                // const rowIndex = parseInt(row);
                // const colIndex = parseInt(col);

                // const player1Id = playerIdsByIndex[rowIndex];
                // const player2Id = playerIdsByIndex[colIndex];

                // const player1 = standings.find(p => p.id === player1Id);
                // const player2 = standings.find(p => p.id === player2Id);
    
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
        if (currentPairs.length === 0 && waitingPairs.length === 0) {
            standings.forEach(player => {
                const rowElement = document.querySelector(`tr[data-player-id="${player.id}"]`);
                if (rowElement) {
                    const placeCell = rowElement.querySelector(".place");
                    if (placeCell) {
                        placeCell.textContent = player.place; // Обновляем место
                    }
                }
            });
        }
        const updatedPlayers = allParticipants.map(player => {
            const updated = standings.find(p => p.id === player.id);
            return updated ? { ...player, ...updated } : player;
        });
        saveTournament(null, updatedPlayers);
    
        console.log('✅ Итоговые standings:', updatedPlayers);
        // saveTournament(null, standings);
        standingsGlobal = updatedPlayers;
    }


    function updateTableResults(pair, player1Score, player2Score, setsSummary) {
        // console.log('allParticipants', pair);
        
        const rowIndex = [...selectedPlayers, ...unratedPlayersList].findIndex(p => p.id === pair.player1.id);
        const colIndex = [...selectedPlayers, ...unratedPlayersList].findIndex(p => p.id === pair.player2.id);
    
        if (rowIndex === -1 || colIndex === -1) {
            console.error("Ошибка: игрок не найден в списке.");
            return;
        }
    
        // Определяем победителя и проигравшего
        const winner = player1Score > player2Score ? pair.player1 : pair.player2;
        const loser = player1Score > player2Score ? pair.player2 : pair.player1;

        // Добавляем очки в results**
        if (!results[rowIndex]) results[rowIndex] = {};
        if (!results[colIndex]) results[colIndex] = {};

        // Сохраняем результат в `results`
        results[rowIndex][colIndex] = `${player1Score}:${player2Score}`;
        results[colIndex][rowIndex] = `${player2Score}:${player1Score}`;

        // Добавляем данные о партиях
        if (!results[rowIndex].sets) results[rowIndex].sets = {};
        if (!results[colIndex].sets) results[colIndex].sets = {};

        // Разворачиваем счета партий для второго игрока
        let reversedSetsSummary = setsSummary
            .split(", ")
            .map(set => set.split("-").reverse().join("-"))
            .join(", ");

        results[rowIndex].sets[colIndex] = setsSummary;       // Оригинальный счет для первого игрока
        results[colIndex].sets[rowIndex] = reversedSetsSummary; // Перевернутый счет для второго игрока

        // **Обновляем очки (если поле points не существует, создаём его)**
        if (!results[rowIndex].points) results[rowIndex].points = 0;
        if (!results[colIndex].points) results[colIndex].points = 0;


        // Если один из игроков нерейтинговый
        if (pair.player1.unrated || pair.player2.unrated) {
            if (pair.player1.unrated) {
                results[rowIndex].points += 1; // Нерейтинговый игрок всегда получает 1 очко
                results[colIndex].points += 2; // Его соперник получает 2 очка
            } else {
                results[rowIndex].points += 2; // Победитель получает 2 очка
                results[colIndex].points += 1; // Нерейтинговый игрок получает 1 очко
            }
        } else {
            // Обычное начисление очков для рейтинговых игроков
            if (player1Score > player2Score) {
                results[rowIndex].points += 2;
                results[colIndex].points += 1;
            } else {
                results[rowIndex].points += 1;
                results[colIndex].points += 2;
            }
        }
    
        // console.log(`Очки обновлены: ${pair.player1.fullname || pair.player1.name} - ${results[rowIndex].points}, ${pair.player2.fullname || pair.player2.name} - ${results[colIndex].points}`);
    
        // **Записываем очки в таблицу (предпоследний столбец)**
        const winnerPointsCell = document.querySelector(`td[data-row="${rowIndex}"][data-col="points"]`);
        const loserPointsCell = document.querySelector(`td[data-row="${colIndex}"][data-col="points"]`);
    
        if (winnerPointsCell) winnerPointsCell.textContent = results[winner.id].points;
        if (loserPointsCell) loserPointsCell.textContent = results[loser.id].points;
    
        // Отображаем результат в таблице игр
        const cell = document.querySelector(`td[data-row="${rowIndex}"][data-col="${colIndex}"]`);
        if (cell) cell.textContent = `${player1Score}:${player2Score}`;
    
        const reverseCell = document.querySelector(`td[data-row="${colIndex}"][data-col="${rowIndex}"]`);
        if (reverseCell) reverseCell.textContent = `${player2Score}:${player1Score}`;
    
        // **Обновляем таблицу турнирного положения**
        updateTournamentStandings([...selectedPlayers, ...unratedPlayersList], results);
    }

    function restoreSavedResults(savedResults) {
        results = savedResults; // Восстанавливаем сохранённые результаты
    
        for (const row in results) {
            for (const col in results[row]) {
                const cell = document.querySelector(`td[data-row="${row}"][data-col="${col}"]`);
                if (cell) {
                    cell.textContent = results[row][col];
                }
            }
        }
        addBracketsAndHighlightResults();
        // Пересчитываем очки и места
        updateTournamentStandings([...selectedPlayers, ...unratedPlayersList], results);
        if (waitingPairs && waitingPairs.length === 0 && currentPairs && currentPairs.length === 0) {
            document.querySelector('#showResult').style = 'display: block';
            
        }

        if (waitingPairs && waitingPairs.length > 0) {
            renderPairsInWaitingBlock(waitingPairs);
        }
        
        if (currentPairs && currentPairs.length > 0) {
            currentPairs.forEach(pair => {
                movePairToPlaying(pair, true, null);
            })
        }
    }

    

    // ------------------------------------------------------2 КРУГА ------ 2 КРУГА ------2 КРУГА-----------------------------------------
    
    async function saveTournamentTwoRound(state = null, standings = null, final) {

        if (!state) {
            state = {
                players: selectedPlayers.map(player => {
                    const fullPlayerData = allplayers.find(p => p.id === player.id);
                    return {
                        id: player.id,
                        birthYear: player.birthYear,
                        fullname: player.fullname || player.name,
                        logo: player.logo || null,
                        place: player.place,
                        place_round1: player.place_round1 || '',
                        place_round2: player.place_round2 || '',
                        wins: player.wins,
                        losses: player.losses,
                        points_round1: player.points_round1 || '',
                        points_round2: player.points_round2 || '',
                        totalPoints: player.totalPoints,
                        setsWon: player.setsWon,
                        setsLost: player.setsLost,
                        rating: player.rating,
                        city: fullPlayerData ? fullPlayerData.city  || fullPlayerData.cityName : "Unknown"
                    };
                }),
                retiredPlayers: retiredPlayers.map(player => ({
                    id: player.id,
                    birthYear: player.birthYear,
                    fullname: player.fullname || player.name,
                    rating: player.rating,
                    retired: true // Флаг выбывшего игрока
                })),
                unratedPlayers: unratedPlayersList.map(player => ({
                    id: player.id,
                    name: player.name || player.fullname,
                    birthYear: player.birthYear,
                    city: player.city,
                    logo: "/icons/playerslogo/default_avatar.svg",
                    place: player.place,
                    place_round1: player.place_round1 || '',
                    place_round2: player.place_round2 || '',
                    wins: player.wins,
                    losses: player.losses,
                    points_round1: player.points_round1 || '',
                    points_round2: player.points_round2 || '',
                    totalPoints: player.totalPoints,
                    setsWon: player.setsWon,
                    setsLost: player.setsLost,
                    nickname: player.nickname,
                    unrated: true // Флаг внерейтингового игрока
                })),
                waitingPairs: waitingPairs,
                currentPairs: currentPairs,
                finishedPairs,
                roundCounter,
                results,
                initialRatings: tournamentData.initialRatings,
                typeOfTournament: selectedType !== tournamentData.typeOfTournament ? selectedType : tournamentData.typeOfTournament || 'roundRobin',
                round1Results, // ✅ Сохранение результатов 1-го круга
                round2Results, // ✅ Сохранение результатов 2-го круга
            };
        }

        if (Array.isArray(standings) && standings.length > 0) {
            const updatedPlayers = [];
            const updatedUnratedPlayers = [];
        
            standings.forEach(player => {
                const updatedPlayer = state.players.find(p => p.id === player.id);
                const mergedPlayer = updatedPlayer ? { ...updatedPlayer, ...player } : player;
        
                if (mergedPlayer.unrated) {
                    updatedUnratedPlayers.push(mergedPlayer); // Нерейтинговые игроки
                } else {
                    updatedPlayers.push(mergedPlayer); // Рейтинговые игроки
                }
            });
        
            state.players = updatedPlayers;
            state.unratedPlayers = updatedUnratedPlayers;
        }

       

        if (
            (!standings || standings.length === 0) &&
            (!state || Object.keys(state).length === 0 || waitingPairs.length > 0 || currentPairs.length > 0 || finishedPairs.length > 0)
        ) {
            if (!tournamentData.finished) {
                console.log("`standings` отсутствует, но пары есть. Ждем обновления...");
                return;
            } 
            
        }
        
        if (final) {
            state = { ...state, ...final }; // Объединяем данные без потери информации
        }

        if (state.finished === undefined) {
            state.finished = tournamentData.finished || false;
        }
        
        console.log("📦 Отправляем в БД state:", state);
    
        try {
            const response = await fetch('/saveTournament', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ tournamentId, state }),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Failed to save tournament');
            }

            const responseData = await response.json();
            console.log("✅ Tournament saved:", responseData);
            
            if (byUser) {
                showErrorModal('Tournament saved successfully!', 'Congratulation');
                byUser = false;
            }
        } catch (error) {
            console.error('Error saving tournament:', error);
            showErrorModal(error.message || 'Failed to save tournament');
        }
    }

    function updateTableResultsTwoRounds(pair, player1Score, player2Score, setsSummary) {
        const isFirstRound = roundCounter === 1;
        // const isSecondRound = roundCounter === 2;
    
        // Определяем, в какую переменную сохранять результаты
        const resultsToUpdate = isFirstRound ? round1Results : round2Results;
    
        // const rowIndex = [...selectedPlayers, ...unratedPlayersList].findIndex(p => p.id === pair.player1.id);
        // const colIndex = [...selectedPlayers, ...unratedPlayersList].findIndex(p => p.id === pair.player2.id);

        const rowIndex = allParticipants.findIndex(p => p.id === pair.player1.id);
        const colIndex = allParticipants.findIndex(p => p.id === pair.player2.id);
    
        if (rowIndex === -1 || colIndex === -1) {
            console.error("Ошибка: игрок не найден в списке.");
            return;
        }
    
        // Инициализация структуры данных
        if (!resultsToUpdate[rowIndex]) resultsToUpdate[rowIndex] = {};
        if (!resultsToUpdate[colIndex]) resultsToUpdate[colIndex] = {};
    
        // Записываем результаты для текущего круга
        resultsToUpdate[rowIndex][colIndex] = `${player1Score}:${player2Score}`;
        resultsToUpdate[colIndex][rowIndex] = `${player2Score}:${player1Score}`;
    
        // Добавляем данные о партиях
        if (!resultsToUpdate[rowIndex].sets) resultsToUpdate[rowIndex].sets = {};
        if (!resultsToUpdate[colIndex].sets) resultsToUpdate[colIndex].sets = {};
    
        let reversedSetsSummary = setsSummary
            .split(", ")
            .map(set => set.split("-").reverse().join("-"))
            .join(", ");
    
        resultsToUpdate[rowIndex].sets[colIndex] = setsSummary;
        resultsToUpdate[colIndex].sets[rowIndex] = reversedSetsSummary;
    
        // Обновляем очки (если поле points не существует, создаём его)
        if (!resultsToUpdate[rowIndex].points) resultsToUpdate[rowIndex].points = 0;
        if (!resultsToUpdate[colIndex].points) resultsToUpdate[colIndex].points = 0;
    
        // Обновляем очки в зависимости от типа игроков
        if (pair.player1.unrated && pair.player2.unrated) {
            // Оба игрока нерейтинговые - начисляем очки по стандарту
            if (player1Score > player2Score) {
                resultsToUpdate[rowIndex].points += 2;
                resultsToUpdate[colIndex].points += 1;
            } else {
                resultsToUpdate[rowIndex].points += 1;
                resultsToUpdate[colIndex].points += 2;
            }
        } else if (pair.player1.unrated || pair.player2.unrated) {
            if (pair.player1.unrated) {
                resultsToUpdate[rowIndex].points += 1;
                resultsToUpdate[colIndex].points += 2;
            } else {
                resultsToUpdate[rowIndex].points += 2;
                resultsToUpdate[colIndex].points += 1;
            }
        } else {
            if (player1Score > player2Score) {
                resultsToUpdate[rowIndex].points += 2;
                resultsToUpdate[colIndex].points += 1;
            } else {
                resultsToUpdate[rowIndex].points += 1;
                resultsToUpdate[colIndex].points += 2;
            }
        }
    
        // **Обновляем общий results**, чтобы он учитывал оба круга
        // results[rowIndex] = { ...results[rowIndex], ...resultsToUpdate[rowIndex] };
        // results[colIndex] = { ...results[colIndex], ...resultsToUpdate[colIndex] };
    
        // **Обновляем таблицу результатов**
        const tableSelector = isFirstRound ? '.displayTournamentFirst' : '.displayTournamentSecond';
        const cell = document.querySelector(`${tableSelector} td[data-row="${rowIndex}"][data-col="${colIndex}"]`);
        if (cell) cell.textContent = `${player1Score}:${player2Score}`;
    
        const reverseCell = document.querySelector(`${tableSelector} td[data-row="${colIndex}"][data-col="${rowIndex}"]`);
        if (reverseCell) reverseCell.textContent = `${player2Score}:${player1Score}`;
    
        // **Обновляем standings для текущего круга**
        // updateTournamentStandingsTwoRound([...selectedPlayers, ...unratedPlayersList], resultsToUpdate, roundCounter);
        updateTournamentStandingsTwoRound(allParticipants, resultsToUpdate, roundCounter);

        console.log(`✅ Обновлены результаты (Круг ${roundCounter}):`, resultsToUpdate);
    }

    function updateTournamentStandingsTwoRound(players, resultsObject, roundCounter) {
        console.log(`🔄 Обновляем standings (Круг ${roundCounter})`);
    
        const isFinalCalculation = roundCounter === "final";
        const resultsToUse = isFinalCalculation ? results : resultsObject;
        console.log('resultsToUse', resultsToUse);
    
        let standings = players.map(player => {
            let previousStanding = standingsGlobal?.find(p => p.id === player.id) || {};
            return {
                id: player.id,
                name: player.name || player.fullname,
                birthYear: player.birthYear,
                city: player.city || "Unknown",
                nickname: player.nickname,
                unrated: player.unrated || false,
                wins: 0,  // Сбрасываем перед расчетом
                losses: 0,
                totalPoints: 0,
                setsWon: 0,
                setsLost: 0,
                place: previousStanding.place || 0,
                place_round1: previousStanding.place_round1 || 0,
                place_round2: previousStanding.place_round2 || 0,
                // points_round1: 0,
                // points_round2: 0
                points_round1: roundCounter === 1 ? 0 : (previousStanding.points_round1 ?? 0), // ✅ В течение 1-го круга сбрасываем, но сохраняем после
                points_round2: roundCounter === 2 ? 0 : (previousStanding.points_round2 ?? 0)  // ✅ То же самое для 2-го круга
            };
        });
    
        console.log('standings перед добавлением очков', standings);
        const processedPairs = new Set();
        let tempPoints = {}; 
    
        if (!isFinalCalculation) {
            for (const [row, cols] of Object.entries(resultsToUse)) {
                for (const [col, score] of Object.entries(cols)) {
                    if (col === "sets" || col === "points") continue;
    
                    if (typeof score !== "string") {
                        console.warn(`⚠️ Некорректные данные: results[${row}][${col}] =`, score);
                        continue;
                    }
    
                    const [p1Score, p2Score] = score.split(":").map(n => parseInt(n.trim()));
                    const player1 = standings.find(p => p.id == players[row].id);
                    const player2 = standings.find(p => p.id == players[col].id);
                    if (!player1 || !player2) continue;
    
                    const matchKey = `${Math.min(row, col)}-${Math.max(row, col)}`;
                    if (processedPairs.has(matchKey)) continue;
                    processedPairs.add(matchKey);
    
                    tempPoints[player1.id] = tempPoints[player1.id] || { wins: 0, losses: 0, points: 0, setsWon: 0, setsLost: 0, points_round1: 0, points_round2: 0 };
                    tempPoints[player2.id] = tempPoints[player2.id] || { wins: 0, losses: 0, points: 0, setsWon: 0, setsLost: 0, points_round1: 0, points_round2: 0 };
    
                    tempPoints[player1.id].setsWon += p1Score;
                    tempPoints[player1.id].setsLost += p2Score;
                    tempPoints[player2.id].setsWon += p2Score;
                    tempPoints[player2.id].setsLost += p1Score;
    
                    let p1Points = 0, p2Points = 0;
    
                    if (player1.unrated && player2.unrated) {
                        if (p1Score > p2Score) {
                            tempPoints[player1.id].wins++;
                            tempPoints[player1.id].points += 2;
                            tempPoints[player2.id].points += 1;
                            tempPoints[player2.id].losses++;
                            p1Points = 2;
                            p2Points = 1;
                        } else {
                            tempPoints[player2.id].wins++;
                            tempPoints[player2.id].points += 2;
                            tempPoints[player1.id].points += 1;
                            tempPoints[player1.id].losses++;
                            p1Points = 1;
                            p2Points = 2;
                        }
                    } else if (player1.unrated || player2.unrated) {
                        if (player1.unrated) {
                            tempPoints[player1.id].losses++;
                            tempPoints[player1.id].points += 1;
                            tempPoints[player2.id].points += 2;
                            tempPoints[player2.id].wins++;
                            p1Points = 1;
                            p2Points = 2;
                        } else {
                            tempPoints[player1.id].wins++;
                            tempPoints[player1.id].points += 2;
                            tempPoints[player2.id].points += 1;
                            tempPoints[player2.id].losses++;
                            p1Points = 2;
                            p2Points = 1;
                        }
                    } else {
                        if (p1Score > p2Score) {
                            tempPoints[player1.id].wins++;
                            tempPoints[player1.id].points += 2;
                            tempPoints[player2.id].points += 1;
                            tempPoints[player2.id].losses++;
                            p1Points = 2;
                            p2Points = 1;
                        } else {
                            tempPoints[player2.id].wins++;
                            tempPoints[player2.id].points += 2;
                            tempPoints[player1.id].points += 1;
                            tempPoints[player1.id].losses++;
                            p1Points = 1;
                            p2Points = 2;
                        }
                    }
    
                    if (roundCounter === 1) {
                        tempPoints[player1.id].points_round1 += p1Points;
                        tempPoints[player2.id].points_round1 += p2Points;
                    } else if (roundCounter === 2) {
                        tempPoints[player1.id].points_round2 += p1Points;
                        tempPoints[player2.id].points_round2 += p2Points;
                    }
                }
            }
    
            standings.forEach(player => {
                if (tempPoints[player.id]) {
                    player.wins = tempPoints[player.id].wins;
                    player.losses = tempPoints[player.id].losses;
                    player.totalPoints = tempPoints[player.id].points;
                    player.setsWon = tempPoints[player.id].setsWon;
                    player.setsLost = tempPoints[player.id].setsLost;
                    // player.points_round1 = tempPoints[player.id].points_round1;
                    // player.points_round2 = tempPoints[player.id].points_round2;
                    if (roundCounter === 1) {
                        player.points_round1 = tempPoints[player.id].points_round1;
                    } else if (roundCounter === 2) {
                        player.points_round2 = tempPoints[player.id].points_round2;
                    }
                }
            });
        }
    
        // **Обновляем отображение в таблице**
        standings.forEach(player => {
            const rowElement1 = document.querySelector(`.displayTournamentFirst tr[data-player-id="${player.id}"]`);
            if (rowElement1) {
                rowElement1.querySelector(".points").textContent = player.points_round1 || '';
                rowElement1.querySelector(".place").textContent = player.place_round1 || '';
            }
    
            const rowElement2 = document.querySelector(`.displayTournamentSecond tr[data-player-id="${player.id}"]`);
            if (rowElement2) {
                rowElement2.querySelector(".points").textContent = player.points_round2 || '';
                rowElement2.querySelector(".place").textContent = player.place_round2 || '';
            }
        });

        if (Object.keys(resultsToUse).length > 0) {
            saveTournamentTwoRound(null, standings);
        } else {
            console.log('НЕ Обновляем standings - RESULTS ПУСТОЙ');
        }
        console.log('✅ Обновленные standings:', standings);
        standingsGlobal = standings;
    }
    
    
    
    function restoreSavedResultsTwoRound(savedResults, roundCounter) {
        const isRound1 = roundCounter === 1;
        const isRound2 = roundCounter === 2;
    
        const targetTableSelector = isRound1 ? '.displayTournamentFirst' : '.displayTournamentSecond';
    
        if (isRound1) round1Results = savedResults;
        if (isRound2) round2Results = savedResults;
    
        // Отрисовываем ячейки
        for (const row in savedResults) {
            for (const col in savedResults[row]) {
                if (col === "sets" || col === "points") continue;
    
                const cell = document.querySelector(`${targetTableSelector} td[data-row="${row}"][data-col="${col}"]`);
                if (cell) {
                    cell.textContent = savedResults[row][col];
                }
            }
        }
    
        addBracketsAndHighlightResults();
    
        // 💡 Передаём только нужный раунд
        // const restoredPlayers = determineTournamentStandingsTwoRounds(
        //     [...selectedPlayers, ...unratedPlayersList],
        //     isRound1 ? savedResults : null,
        //     isRound2 ? savedResults : null
        // );
        const standings = [...selectedPlayers, ...unratedPlayersList];
        standings.forEach(player => {
            if (isRound1) {
                const rowElement1 = document.querySelector(`.displayTournamentFirst tr[data-player-id="${player.id}"]`);
                if (rowElement1) {
                    rowElement1.querySelector(".points").textContent = player.points_round1 || '';
                    rowElement1.querySelector(".place").textContent = player.place_round1 || '';
                }
            }
            
            if (isRound2) {
                const rowElement2 = document.querySelector(`.displayTournamentSecond tr[data-player-id="${player.id}"]`);
                if (rowElement2) {
                    rowElement2.querySelector(".points").textContent = player.points_round2 || '';
                    rowElement2.querySelector(".place").textContent = player.place_round2 || '';
                }
            }
            
        });

        console.log('restoredPlayersr', standings);
    
        // updateTournamentStandingsTwoRound(standings, savedResults, roundCounter);
    
        if (waitingPairs.length === 0 && currentPairs.length === 0 && round1Results && round2Results) {
            document.querySelector('#showResult').style.display = 'block';
        }

        if (waitingPairs && waitingPairs.length > 0) {
            renderPairsInWaitingBlock(waitingPairs);
        }
        
        if (currentPairs && currentPairs.length > 0) {
            currentPairs.forEach(pair => {
                movePairToPlaying(pair, true, null);
            })
        }
    }
    
    
    // function restoreSavedResultsTwoRound(savedResults, roundCounter) {
    //     console.log(`♻ Восстанавливаем результаты (Круг ${roundCounter})`);
    //     console.log('savedResults', savedResults);
    
    //     if (!savedResults) {
    //         console.log(`⚠️ Нет сохраненных данных для Круга ${roundCounter}`);
    //         return;
    //     }
    
    //     // Определяем, в какую таблицу рендерить данные
    //     const targetTableSelector = roundCounter === 1 ? '.displayTournamentFirst' : '.displayTournamentSecond';
    //     console.log(targetTableSelector);
    //     results = savedResults; // Восстанавливаем сохранённые результаты
    
    //     for (const row in results) {
    //         for (const col in results[row]) {
    //             if (col === "sets" || col === "points") continue; // Пропускаем дополнительные поля
    
    //             const cell = document.querySelector(`${targetTableSelector} td[data-row="${row}"][data-col="${col}"]`);
    //             if (cell) {
    //                 cell.textContent = results[row][col];
    //             }
    //         }

    //         // const pointsCell = document.querySelector(`${targetTableSelector} td[data-row="${row}"][data-col="points"]`);
    //         // console.log('pointsCell', pointsCell);
    //         // if (pointsCell) {
    //         //     pointsCell.textContent = results[row].points;
    //         // }
    //     }
        
    
    //     // Добавляем дужки и подсветку результатов
    //     addBracketsAndHighlightResults();
    
    //     // Пересчитываем очки и места для текущего круга
    //     updateTournamentStandingsTwoRound([...selectedPlayers, ...unratedPlayersList], results, roundCounter);
    
    //     // Если оба круга завершены, показываем кнопку для отображения финального результата
    //     if (waitingPairs.length === 0 && currentPairs.length === 0 && round1Results && round2Results) {
    //         document.querySelector('#showResult').style = 'display: block';
    //     }
    // }
    
});






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

// document.addEventListener('DOMContentLoaded', () => {
//     const display = document.querySelector('.displayTournament'); // Родительский контейнер
//     const content = document.querySelector('.content'); // Контент внутри

//     let isDragging = false;
//     let startX, startY, currentX = 0, currentY = 0, scale = 1;

//     // Устанавливаем transform-origin в верхний левый угол
//     content.style.transformOrigin = 'top left';

//     // Получение размеров контейнера и контента
//     const getBounds = () => {
//         const displayRect = display.getBoundingClientRect();
//         const contentRect = content.getBoundingClientRect();

//         return {
//             displayWidth: displayRect.width,
//             displayHeight: displayRect.height,
//             contentWidth: content.offsetWidth * scale,
//             contentHeight: content.offsetHeight * scale,
//         };
//     };

//     // Ограничение позиции
//     const limitPosition = (x, y) => {
//         const { displayWidth, displayHeight, contentWidth, contentHeight } = getBounds();
        
//         // Левый верхний угол контента не должен выходить за границы
//         const minX = 0;
//         const minY = 0;
        
//         // Правый нижний угол контента также должен оставаться в пределах контейнера
//         const maxX = displayWidth - contentWidth;
//         const maxY = displayHeight - contentHeight;

//         return {
//             x: Math.max(Math.min(x, minX), maxX), // Ограничиваем правый и левый края
//             y: Math.max(Math.min(y, minY), maxY), // Ограничиваем верхний и нижний края
//         };
//     };

//     // Обработчик начала перетаскивания
//     display.addEventListener('mousedown', (e) => {
//         isDragging = true;
//         startX = e.clientX - currentX;
//         startY = e.clientY - currentY;
//         display.style.cursor = 'grabbing';
//     });

//     // Обработчик движения мыши
//     display.addEventListener('mousemove', (e) => {
//         if (!isDragging) return;

//         let x = e.clientX - startX;
//         let y = e.clientY - startY;

//         // Применяем ограничения
//         const limitedPosition = limitPosition(x, y);
//         currentX = limitedPosition.x;
//         currentY = limitedPosition.y;

//         content.style.transform = `translate(${currentX}px, ${currentY}px) scale(${scale})`;
//     });

//     // Обработчик окончания перетаскивания
//     document.addEventListener('mouseup', () => {
//         isDragging = false;
//         display.style.cursor = 'grab';
//     });

//     // Обработчик масштабирования колесом мыши
//     display.addEventListener('wheel', (e) => {
//         if (!e.ctrlKey) return; // Блокируем зум, если не зажат Ctrl

//         e.preventDefault();
//         const zoomIntensity = 0.1;
//         const delta = e.deltaY > 0 ? -zoomIntensity : zoomIntensity;
//         const newScale = Math.min(Math.max(0.5, scale + delta), 3); // Ограничиваем масштаб

//         // Масштабирование относительно верхнего левого угла
//         const { contentWidth, contentHeight } = getBounds();
//         const rect = content.getBoundingClientRect();

//         const offsetX = (e.clientX - rect.left) / scale; // Смещение по X
//         const offsetY = (e.clientY - rect.top) / scale; // Смещение по Y

//         currentX -= offsetX * (newScale - scale);
//         currentY -= offsetY * (newScale - scale);

//         scale = newScale;

//         // Применяем ограничения
//         const limitedPosition = limitPosition(currentX, currentY);
//         currentX = limitedPosition.x;
//         currentY = limitedPosition.y;

//         content.style.transform = `translate(${currentX}px, ${currentY}px) scale(${scale})`;
//     });
// });

