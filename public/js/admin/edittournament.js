import { listenerOfButtons, showErrorModal } from '../modules.js';
import { createHeaderandSidebarForAdmin} from './adminmodules.js';
document.addEventListener('DOMContentLoaded', async () => {
    createHeaderandSidebarForAdmin('manageAllTournaments');
    listenerOfButtons();        
   

    const tournamentId = document.querySelector('.editTournament').dataset.tournamentid;
    let tournamentData;
    let city;
    let allPlayers;

    console.log(tournamentId, 'загрузились');

    async function fetchTournamentData() {
        try {
            const response = await fetch(`/get-data-tournament?lang='ru'&tournamentId=${tournamentId}`);
            if (!response.ok) {
                throw new Error('Tournament not found');
            }
            tournamentData = await response.json();
            city = await getCityName(tournamentData.city._id);
            
        } catch (error) {
            console.error('Error fetching tournament data:', error);
        }
    }

    async function getCityName(cityId) {
        try {
            const response = await fetch(`/cities/${cityId}`);
            if (!response.ok) {
                throw new Error('City data not found');
            }
            const city = await response.json();
                        
            return city['russian'] || city['english'] || city['thai'];
        } catch (error) {
            console.error('Ошибка при получении названия города:', error);
            return 'Unknown City'; // Возвращение запасного значения в случае ошибки
        }
    }

    await fetchTournamentData();
    // console.log(tournamentData);

    if (tournamentData) {
        document.getElementById('playerName').value = tournamentData.club.name;
        document.getElementById('city').value = city;  // замените 'name' на нужный ключ, если требуется
        document.getElementById('ratinglimit').value = tournamentData.ratingLimit;
        document.getElementById('numberoftables').value = tournamentData.tables;
        // Разделяем строку на дату и время
        const [date, time] = tournamentData.datetime.split('T');
        // Обрезаем время до часов и минут
        const formattedTime = time.substring(0, 5);
        // Устанавливаем значение в формате "YYYY-MM-DD, HH:mm"
        document.getElementById('starttournament').value = `${date}, ${formattedTime}`;

        document.getElementById('clubAddress').value = tournamentData.address.ru;
        document.getElementById('phoneNumber').value = tournamentData.contacts;
        document.getElementById('deposit').value = `${tournamentData.contribution}฿`;
        document.getElementById('registeredPlayers').value = tournamentData.players.length;

        // Заполнение текстовых полей с призами
        document.getElementById('description').value = tournamentData.prizes.ru;
        document.getElementById('descriptionEng').value = tournamentData.prizes.en;
        document.getElementById('descriptionThai').value = tournamentData.prizes.th;

        // Заявленные игроки
        const containerRegistered = document.querySelector('.containerforRegistered');
        const containerRetired = document.querySelector('.containerforRetired');
        const playerDropdown = document.querySelector('#playerDropdown');
        const playerInput = document.querySelector('#addPlayer');

        // console.log(playerInput, playerDropdown);

        await fetchAllPlayers();

        displayPlayers(tournamentData.players, containerRegistered, true);

        displayPlayers(tournamentData.retiredPlayers, containerRetired, false);
        console.log(tournamentData.retiredPlayers);
        

        function updateDropdownList(dropdown, players, inputElement) {
            dropdown.innerHTML = '';
            const currentText = (inputElement.value || '').toLowerCase();
            
            // Фильтрация игроков по введенному тексту
            const filteredPlayers = players.filter(player => {
                return (
                    (player.fullname && player.fullname.toLowerCase().includes(currentText)) ||
                    (player.nickname && player.nickname.toLowerCase().includes(currentText))
                );
            });
        
            filteredPlayers.forEach(player => {
                const div = document.createElement('div');
                div.textContent = player.name || player.fullname || player.nickname;
                div.dataset.id = player._id; // Присваиваем ID игрока как data-id
                div.addEventListener('click', () => {
                    inputElement.value = div.textContent;
                    inputElement.dataset.selectedId = div.dataset.id; // Сохраняем ID выбранного игрока в input
                    dropdown.style.display = 'none';
                });
                dropdown.appendChild(div);
            });
            
            // Показываем дропдаун только если есть совпадения
            dropdown.style.display = filteredPlayers.length > 0 ? 'block' : 'none';
        }
        
        function updateNameDropdown() {
            // Используем полный массив объектов игроков для вызова updateDropdownList
            updateDropdownList(playerDropdown, allPlayers, playerInput);
        }

        playerInput.addEventListener('input', () => {
            updateNameDropdown();
        });
    
        playerInput.addEventListener('focus', () => {
            playerDropdown.style.display = 'block';
        });

        playerInput.addEventListener('blur', () => setTimeout(() => playerDropdown.style.display = 'none', 200));
       


        function createDropdown(dropdown, players, inputElement) {
            dropdown.innerHTML = '';
            players.forEach(player => {
                const div = document.createElement('div');
                div.textContent = player.name || player.fullname || player.nickname;
                div.dataset.id = player._id; // Присваиваем ID игрока для удобства
                div.addEventListener('click', () => {
                    inputElement.value = div.textContent;
                    inputElement.dataset.selectedId = div.dataset.id; // Сохраняем ID выбранного игрока в input
                    dropdown.style.display = 'none';
                });
                dropdown.appendChild(div);
            });
        }

        async function fetchAllPlayers() {
            try {
                const response = await fetch(`/get-players-coaches`);
                const players = await response.json();
                allPlayers = players;
                console.log(allPlayers, 'список всех игроков');
    
                createDropdown(playerDropdown, players, playerInput);
    
            } catch (error) {
                console.error('Произошла ошибка:', error);
                showErrorModal('Database connection error', 'Ops!');
            }
        }

        const addButton = document.querySelector('#addPlayerBtn');
        // addButton.addEventListener('click', () => {
        //     const playerId = playerInput.dataset.selectedId;
        //     if (!playerId) {
        //         alert('Пожалуйста, выберите игрока из списка');
        //         return;
        //     }

        //     const selectedPlayer = allPlayers.find(player => player._id === playerId);
        //     if (selectedPlayer) {
        //         // Добавляем игрока в контейнер зарегистрированных игроков
        //         displayPlayers([...tournamentData.players, selectedPlayer], containerRegistered, true);
        //         tournamentData.players.push(selectedPlayer); // Обновляем локальный массив зарегистрированных игроков
        //         playerInput.dataset.selectedId = false;
        //         const qtyRegisteredPlayers = Number(document.querySelector('#registeredPlayers').value);
        //         document.querySelector('#registeredPlayers').value = qtyRegisteredPlayers + 1;
        //         playerInput.value = '';
        //     } else {
        //         alert('Игрок не найден. Пожалуйста, попробуйте снова.');
        //     }
        // });

        addButton.addEventListener('click', () => {
            const playerId = playerInput.dataset.selectedId;
            if (!playerId) {
                alert('Пожалуйста, выберите игрока из списка');
                return;
            }
        
            // Проверка на наличие игрока в DOM в списке зарегистрированных
            const isPlayerInRegisteredDOM = Array.from(containerRegistered.querySelectorAll('.player_cross')).some(cross =>
                cross.getAttribute('data-player-id') === playerId
            );
        
            // Проверка на наличие игрока в DOM в списке выбывших
            const isPlayerInRetiredDOM = Array.from(containerRetired.querySelectorAll('.player_cross')).some(cross =>
                cross.getAttribute('data-player-id') === playerId
            );
        
            if (isPlayerInRegisteredDOM) {
                alert('Этот игрок уже зарегистрирован.');
                return;
            }
        
            if (isPlayerInRetiredDOM) {
                alert('Этот игрок выбывший. Удалите его из списка выбывших, чтобы зарегистрировать снова.');
                return;
            }
        
            const selectedPlayer = allPlayers.find(player => player._id === playerId);
            if (selectedPlayer) {
                // Обновляем DOM и массив игроков
                tournamentData.players.push(selectedPlayer); // Добавляем в массив зарегистрированных
                displayPlayers(tournamentData.players, containerRegistered, true); // Обновляем DOM
        
                // Очистка значений
                playerInput.dataset.selectedId = '';
                playerInput.value = '';
        
                // Обновляем количество зарегистрированных
                const qtyRegisteredPlayers = Number(document.querySelector('#registeredPlayers').value);
                document.querySelector('#registeredPlayers').value = qtyRegisteredPlayers + 1;
            } else {
                alert('Игрок не найден. Пожалуйста, попробуйте снова.');
            }
        });

        saveTournament(document.getElementById('saveTournamentBtnTop'));
        saveTournament(document.getElementById('saveTournamentBtn'));

        function saveTournament(btn) {
            btn.addEventListener('click', async (event) => {
                event.preventDefault();
                await handleSave();
            });
        }

        async function handleSave() {
            // Сбор данных из DOM для зарегистрированных игроков
            const registeredPlayers = Array.from(document.querySelector('.containerforRegistered').children)
                .map(div => div.querySelector('.player_cross').dataset.playerId);
        
            // Сбор данных из DOM для выбывших игроков
            const retiredPlayers = Array.from(document.querySelector('.containerforRetired').children)
                .map(div => div.querySelector('.player_cross').dataset.playerId);
        
            // Собираем остальные данные формы
            const tournamentDataToSave = {
                ratingLimit: document.getElementById('ratinglimit').value,
                startTournament: document.getElementById('starttournament').value,
                deposit: document.getElementById('deposit').value.replace('฿', ''), // Убираем символ валюты
                prizes: {
                    ru: document.getElementById('description').value.split('\n'),
                    en: document.getElementById('descriptionEng').value.split('\n'),
                    th: document.getElementById('descriptionThai').value.split('\n')
                },
                registeredPlayers,
                retiredPlayers
            };
            try {
                const response = await fetch('/api/save-tournament', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ tournamentId, ...tournamentDataToSave })
                });
        
                if (response.ok) {
                    alert('Турнир успешно сохранен');
                    window.location.href = '/ru/dashboard/admin/tournaments';
                } else {
                    throw new Error('Ошибка при сохранении данных');
                }
            } catch (error) {
                console.error('Ошибка при сохранении турнира:', error);
                showErrorModal('Не удалось сохранить данные', 'Ошибка');
            }
        }
        
        
        makeDeleteBtn(document.getElementById('deleteTournamentBtn'));
        makeDeleteBtn(document.getElementById('deleteTournamentBtnTop'));
        
        function makeDeleteBtn(btn) {
            btn.addEventListener('click', async () => {
                if (confirm('Вы уверены, что хотите удалить этот турнир?')) {
                    try {
                        const response = await fetch(`/api/delete-tournament/${tournamentId}`, {
                            method: 'DELETE'
                        });
                        if (!response.ok) {
                            throw new Error('Failed to delete tournament');
                        }
                        alert('Турнир успешно удален');
                        window.location.href = '/ru/dashboard/admin/tournaments'; // Перенаправление на список всех турниров
                    } catch (error) {
                        console.error('Ошибка при удалении турнира:', error);
                        showErrorModal('Error deleting tournament', 'Oops!');
                    }
                }
            });
        }
        

        async function displayPlayers(playerIds, container, isRegistered = true) {
            try {
                container.innerHTML = '';
        
                playerIds.forEach((playerObj, index) => {
                    const playerId = playerObj._id;
                    const player = allPlayers.find(p => p._id === playerId);

                    if (!player) {
                        console.warn(`Игрок с ID ${playerId} не найден в allPlayers.`);
                        return; // Пропускаем итерацию, если игрок не найден
                    }

                    let playerDiv = document.createElement('div');
                    playerDiv.className = 'coachesTable_coach';
        
                    // Порядковый номер
                    let numberDiv = document.createElement('div');
                    numberDiv.className = 'cell player_number';
                    numberDiv.textContent = index + 1;
                    playerDiv.appendChild(numberDiv);
        
                    // Информация об игроке
                    let nameDiv = document.createElement('div');
                    nameDiv.className = 'cell player_player';
        
                    let playerLogoDiv = document.createElement('div');
                    playerLogoDiv.className = 'playerLogo';
                    playerLogoDiv.style.cssText = `
                        background-image: url('${player.logo}');
                        background-position: 50%;
                        background-size: cover;
                        background-repeat: no-repeat;
                    `;
                    nameDiv.appendChild(playerLogoDiv);
        
                    let playerNameSpan = document.createElement('span');
                    playerNameSpan.textContent = player.name || player.fullname || player.nickname;
                    nameDiv.appendChild(playerNameSpan);
                    playerDiv.appendChild(nameDiv);
        
                    // Рейтинг
                    let ratingDiv = document.createElement('div');
                    ratingDiv.className = 'cell player_rating';
                    ratingDiv.textContent = player.rating ? player.rating : '-';
                    playerDiv.appendChild(ratingDiv);
        
                    let crossDiv = document.createElement('div');
                        crossDiv.className = 'cell player_cross';
                        crossDiv.style = "background-image: url('/icons/cross.svg'); background-repeat: no-repeat;";
                        crossDiv.setAttribute('data-player-id', player._id); // Уникальный атрибут для идентификации игрока

                    // Кнопка удаления (крестик)
                    if (isRegistered) {
                        
                        crossDiv.addEventListener('click', () => {
                            const playerId = crossDiv.getAttribute('data-player-id');
                            const indexToRemove = tournamentData.players.findIndex(p => p._id === playerId);
        
                            if (indexToRemove > -1) {
                                // Перемещение игрока из списка зарегистрированных в список выбывших
                                tournamentData.retiredPlayers.push(tournamentData.players.splice(indexToRemove, 1)[0]);
                                const qtyRegisteredPlayers = Number(document.querySelector('#registeredPlayers').value);
                                document.querySelector('#registeredPlayers').value = qtyRegisteredPlayers - 1;
                                // Обновление отображения
                                displayPlayers(tournamentData.players, containerRegistered, true);
                                displayPlayers(tournamentData.retiredPlayers, containerRetired, false);
                            }
                        });
                    } else {
                        // Обработчик для удаления игрока из списка выбывших
                        crossDiv.addEventListener('click', () => {
                            const playerId = crossDiv.getAttribute('data-player-id');
                            const indexToRemove = tournamentData.retiredPlayers.findIndex(p => p._id === playerId);

                            if (indexToRemove > -1) {
                                tournamentData.retiredPlayers.splice(indexToRemove, 1);
                                displayPlayers(tournamentData.retiredPlayers, containerRetired, false);
                            }
                        });
                    }

                    playerDiv.appendChild(crossDiv);
                    container.appendChild(playerDiv);
                });
            } catch (error) {
                console.error('Произошла ошибка при отображении игроков:', error);
                showErrorModal('Error while displaying players', 'Oops!');
            }
        }
    }
});