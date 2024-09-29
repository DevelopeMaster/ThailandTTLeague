import { showErrorModal } from '../modules.js';
export function createHeaderandSidebarForAdmin(page) {
    if (document.querySelector('.admin_header')) {
        const adminHaeder = document.querySelector('.admin_header');
        adminHaeder.innerHTML = `
            <div class="admin_logoWrapp">
                <a class="adminlogo" href="/ru/dashboard/admin">
                    <img class="adminlogo_img" src="/icons/darklogo.svg" alt="logo">
                </a>
            </div>
            <div class="admin_user">
                <img src='/icons/adminLogo.svg' class="admin_user_img" alt="admin logo">
            </div>
            
            <div class="admin_profileMenu">
                <a href="#" id="adminHome" class="logOut">Домой</a>
                <a href="#" id="logOut" class="logOut">Выход</a>
            </div>     
        `;
    }


    if (document.querySelector('.admin_sidebar')) {
        const adminSidebar = document.querySelector('.admin_sidebar');
        adminSidebar.innerHTML = `
            <ul>
                <li>
                    <a class="admin_sidebar_category manageAllPlayers">
                        <img class="admin_sidebar_category-icon" src="/icons/players.svg" alt="">
                        <p class="admin_sidebar_category-text">
                            Игроки
                        </p>
                    </a>
                </li>
                <li>
                    <a class="admin_sidebar_category manageAllClubs">
                        <img class="admin_sidebar_category-icon" src="/icons/clubs.svg" alt="">
                        <p class="header_bottom_category-text">
                            Клубы
                        </p>
                    </a>
                </li>
                <li>
                    <a class="admin_sidebar_category manageAllCoaches">
                        <img class="admin_sidebar_category-icon" src="/icons/about.svg" alt="">
                        <p class="admin_sidebar_category-text">
                            Тренеры
                        </p>
                    </a> 
                </li>
                <li>
                    <a class="admin_sidebar_category manageAllTournaments">
                        <img class="admin_sidebar_category-icon" src="/icons/tour.svg" alt="">
                        <p class="admin_sidebar_category-text">
                            Турниры
                        </p>
                    </a>
                </li>
                <li>
                    <a class="admin_sidebar_category manageAllTrainings">
                        <img class="admin_sidebar_category-icon" src="/icons/train.svg" alt="">
                        <p class="admin_sidebar_category-text">
                            Тренировки
                        </p>
                    </a>
                </li>
                <li>
                    <a class="admin_sidebar_category manageCoachApplications">
                        <img class="admin_sidebar_category-icon" src="/icons/about.svg" alt="">
                        <p class="admin_sidebar_category-text">
                            Заявки тренеров
                        </p>
                    </a> 
                </li>
                <li>
                    <a class="admin_sidebar_category manageClubApplications">
                        <img class="admin_sidebar_category-icon" src="/icons/about.svg" alt="">
                        <p class="admin_sidebar_category-text">
                            Заявки клубов
                        </p>
                    </a> 
                </li>
                <li>
                    <a class="admin_sidebar_category manageAdvertisement">
                        <img class="admin_sidebar_category-icon" src="/icons/about.svg" alt="">
                        <p class="admin_sidebar_category-text">
                            Реклама
                        </p>
                    </a> 
                </li>
            </ul>
        `;

        const categories = document.querySelectorAll('.admin_sidebar_category');
        categories.forEach(item => {
            if (item.classList.contains(page)) {
                item.style.backgroundColor = '#E9E9E9';
            }
        });

    }

}


export async function getAllPlayers() {
    const ratingFromInput = document.getElementById('dateFromInput');
    const ratingUntilInput = document.getElementById('dateUntilInput');
    const nameInput = document.getElementById('clubInput');
    const cityInput = document.getElementById('cityInput');
    
    const nameDropdown = document.getElementById('clubDropdown');
    const cityDropdown = document.getElementById('cityDropdown');
    
    const searchButton = document.getElementById('filterPlayers_btnSearch');

    const playersContainer = document.querySelector('.playersTable_content');

    if (!playersContainer) {
        console.error('Контейнер для игроков не найден');
        return;
    }

    let allPlayers = [];
    let cities = {};
    let isFiltered = false; // Логическая переменная для отслеживания состояния фильтрации

    await fetchAllPlayers();

    let debounceTimeout;

    nameInput.addEventListener('input', () => {
        updateNameDropdown();
        debounceFilterPlayers();
    });

    cityInput.addEventListener('input', () => {
        updateCityDropdown();
        debounceFilterPlayers();
    });

    nameInput.addEventListener('focus', () => {
        nameDropdown.style.display = 'block';
        // cityDropdown.style.display = 'none'; // Скрыть дропдаун городов при фокусе на поле имени
        cityDropdown.style = 'display: none !important';
    });

    cityInput.addEventListener('focus', () => {
        // cityDropdown.style.display = 'block';
        cityDropdown.style = 'display: block !important';
        nameDropdown.style.display = 'none'; // Скрыть дропдаун имен при фокусе на поле города
    });

    nameInput.addEventListener('blur', () => setTimeout(() => nameDropdown.style.display = 'none', 200));
    cityInput.addEventListener('blur', () => setTimeout(() => cityDropdown.style.display = 'none', 200));

    searchButton.addEventListener('click', function (event) {
        event.preventDefault();
        isFiltered = true; // Устанавливаем состояние фильтрации
        filterPlayers();
    });

    function debounceFilterPlayers() {
        clearTimeout(debounceTimeout);
        debounceTimeout = setTimeout(() => {
            isFiltered = true; // Устанавливаем состояние фильтрации
            filterPlayers();
        }, 300);
    }

    function updateNameDropdown() {
        const names = [...new Set(allPlayers.map(player => player.fullname).filter(Boolean))];
        const nicknames = [...new Set(allPlayers.map(player => player.nickname).filter(Boolean))];
        updateDropdownList(nameDropdown, [...names, ...nicknames], nameInput);
    }

    function updateCityDropdown() {
        const cityNames = Object.values(cities);
        updateDropdownList(cityDropdown, cityNames, cityInput);
    }

    async function fetchAllPlayers() {
        try {
            const response = await fetch(`/get-players`);
            const players = await response.json();
            allPlayers = players;

            displayPlayers(players.slice(0, 16), playersContainer);

            const names = [...new Set(players.map(player => player.fullname).filter(Boolean))];
            const nicknames = [...new Set(players.map(player => player.nickname).filter(Boolean))];
            const cityIds = [...new Set(players.map(player => player.city))];

            createDropdown(nameDropdown, [...names, ...nicknames], nameInput);

            for (const cityId of cityIds) {
                await getCityName(cityId);
            }

            const cityNames = Object.values(cities).filter(Boolean);
            createDropdown(cityDropdown, cityNames, cityInput);

            // Скрыть дропдаун меню при инициализации
            // nameDropdown.style.display = 'none';
            // cityDropdown.style.display = 'none';

        } catch (error) {
            console.error('Произошла ошибка:', error);
            showErrorModal('Database connection error', 'Ops!');
        }
    }

    async function getCityName(cityId) {
        let currentLang = localStorage.getItem('clientLang');
        if (cities[cityId]) {
            return cities[cityId];
        }
        try {
            const response = await fetch(`/cities/${cityId}`);
            if (!response.ok) {
                throw new Error('City data not found');
            }
            const city = await response.json();
            cities[cityId] = city[currentLang] || city['english'];
            updateCityDropdown(); // Update dropdown as cities are fetched
            return cities[cityId];
        } catch (error) {
            console.error('Ошибка при получении названия города:', error);
            return 'Unknown City';
        }
    }

    function createDropdown(dropdown, options, inputElement) {
        dropdown.innerHTML = '';
        options.forEach(option => {
            const div = document.createElement('div');
            div.textContent = option;
            div.addEventListener('click', () => {
                inputElement.value = option;
                dropdown.style.display = 'none';
                isFiltered = true; // Устанавливаем состояние фильтрации
                filterPlayers();
            });
            dropdown.appendChild(div);
        });
    }

    function updateDropdownList(dropdown, options, inputElement) {
        dropdown.innerHTML = '';
        const currentText = (inputElement.value || '').toLowerCase();
        // console.log('Filtered options:', options);
        const filteredOptions = options.filter(option => option && option.toLowerCase().includes(currentText));

        filteredOptions.forEach(option => {
            const div = document.createElement('div');
            div.textContent = option;
            div.addEventListener('click', () => {
                inputElement.value = option;
                dropdown.style.display = 'none';
                isFiltered = true; // Устанавливаем состояние фильтрации
                filterPlayers();
            });
            dropdown.appendChild(div);
        });
        dropdown.style.display = 'block';

        // dropdown.style.display = filteredOptions.length > 0 ? 'block' : 'none'; // Отображаем дропдаун только если есть совпадения
    }

    async function filterPlayers() {
        const ratingFromValue = ratingFromInput.value;
        const ratingUntilValue = ratingUntilInput.value;
        const nameValue = (nameInput.value || '').toLowerCase();
        const cityValue = (cityInput.value || '').toLowerCase();

        const filteredPlayers = await Promise.all(allPlayers.map(async player => {
            const ratingFromMatch = !ratingFromValue || player.rating >= parseInt(ratingFromValue, 10);
            const ratingUntilMatch = !ratingUntilValue || player.rating <= parseInt(ratingUntilValue, 10);
            const nameMatch = !nameValue || (player.fullname && player.fullname.toLowerCase().includes(nameValue)) || (player.nickname && player.nickname.toLowerCase().includes(nameValue));

            const cityName = await getCityName(player.city);
            const cityMatch = !cityValue || cityValue === 'all' || (cityName && cityName.toLowerCase().includes(cityValue));

            return ratingFromMatch && ratingUntilMatch && nameMatch && cityMatch ? player : null;
        }));

        const validPlayers = filteredPlayers.filter(player => player !== null);
        displayPlayers(validPlayers, playersContainer);
    }

    async function displayPlayers(players, container) {
        // let currentLang = localStorage.getItem('clientLang') || 'english';
        // const languageMap = {
        //     'russian': 'ru',
        //     'english': 'en',
        //     'thai': 'th'
        // };
        try {
            container.innerHTML = '';
            
            const cityNamesPromises = players.map(player => getCityName(player.city));
            const cityNames = await Promise.all(cityNamesPromises);
    
            players.forEach((player, index) => {
                let playerDiv = document.createElement('a');
                playerDiv.className = 'playersTable_player';
                playerDiv.href = `/ru/dashboard/admin/edit/${player._id}`;
    
                let numberDiv = document.createElement('div');
                numberDiv.className = 'cell player_number';
                numberDiv.textContent = index + 1;
                playerDiv.appendChild(numberDiv);
    
                let nameDiv = document.createElement('div');
                nameDiv.className = 'cell player_player';
                let playerLogoDiv = document.createElement('div');
                playerLogoDiv.className = 'playerLogo';
                playerLogoDiv.style.cssText = `background-image: url('${player.logo}'); background-position: 50%; background-size: cover; background-repeat: no-repeat;`;
                nameDiv.appendChild(playerLogoDiv);
    
                let playerNameSpan = document.createElement('span');
                playerNameSpan.textContent = player.fullname;
                nameDiv.appendChild(playerNameSpan);
                playerDiv.appendChild(nameDiv);
    
                let nicknameDiv = document.createElement('div');
                nicknameDiv.className = 'cell player_login';
                nicknameDiv.textContent = player.nickname ? player.nickname : ' ';
                playerDiv.appendChild(nicknameDiv);
    
                let cityDiv = document.createElement('div');
                cityDiv.className = 'cell player_city';
                cityDiv.textContent = cityNames[index];
                playerDiv.appendChild(cityDiv);
    
                let ratingDiv = document.createElement('div');
                ratingDiv.className = 'cell player_rating';
                ratingDiv.textContent = player.rating ? player.rating : '-';
                playerDiv.appendChild(ratingDiv);

                // preloader.style.display = 'none';
                
                container.appendChild(playerDiv);
            });
    
            // Управление кнопкой "See more"
            if (!isFiltered && players.length < allPlayers.length) {
                // Если не фильтруем и отображаем меньше всех игроков, показываем кнопку "See more"            
                let moreButton = document.createElement('a');
                moreButton.className = 'playersTable_btn';
                moreButton.href = '#';
                // let showMore = {
                //     'english': 'See more',
                //     'thai': 'ดูเพิ่มเติม',
                //     'russian': 'Смотреть еще'
                // };
                moreButton.textContent = 'Смотреть еще';
                moreButton.addEventListener('click', function (event) {
                    event.preventDefault();
                    displayAllPlayers();
                    moreButton.remove();
                });
                container.appendChild(moreButton);
            }
    
        } catch (error) {
            console.error('Произошла ошибка при отображении игроков:', error);
            showErrorModal('Error while displaying players', 'Ops!');
        }
    }
    
    async function displayAllPlayers() {
        try {
            displayPlayers(allPlayers, playersContainer);
            
        } catch (error) {
            console.error('Произошла ошибка при отображении всех игроков:', error);
            showErrorModal('Error while displaying all players', 'Ops!');
        }
    }
};



export async function getAllClubs() {
    const clubInput = document.getElementById('clubInput');
    const cityInput = document.getElementById('cityInput');

    const clubDropdown = document.getElementById('clubDropdown');
    const cityDropdown = document.getElementById('cityDropdown');
    // const viewAllButton = document.querySelector('.clubs_down a');

    const languageMap = {
        'russian': 'ru',
        'english': 'en',
        'thai': 'th'
    };

    const currentLang = localStorage.getItem('clientLang') || 'english';
    const langKey = languageMap[currentLang];

    let allClubs = [];
    let cityMap = {};

    await fetchAllClubs();

    async function fetchAllClubs() {
        try {
            const response = await fetch(`/clubs`);
            const clubs = await response.json();
            allClubs = clubs;

            const cityIds = [...new Set(clubs.map(club => club.city))];
            const cityNames = await Promise.all(cityIds.map(cityId => getCityName(cityId)));

            cityIds.forEach((cityId, index) => {
                cityMap[cityId] = cityNames[index];
            });

            displayClubs(allClubs);
            

            const clubNames = [...new Set(clubs.map(club => club.name))];
            clubNames.sort();
            cityNames.sort();

            createDropdown(clubDropdown, clubNames, clubInput);
            createDropdown(cityDropdown, cityNames, cityInput);
        } catch (error) {
            console.error('Произошла ошибка:', error);
            showErrorModal('Database connection error');
        }
    }

    async function getCityName(cityId) {
        try {
            const response = await fetch(`/cities/${cityId}`);
            if (!response.ok) {
                throw new Error('City data not found');
            }
            const city = await response.json();
            return city[currentLang]; // Возвращает имя города на выбранном языке
        } catch (error) {
            console.error('Ошибка при получении названия города:', error);
            return 'Unknown City'; // Возвращение запасного значения в случае ошибки
        }
    }

    function createDropdown(dropdown, options, inputElement) {
        dropdown.innerHTML = '';
        options.forEach(option => {
            const div = document.createElement('div');
            div.textContent = option;
            div.addEventListener('click', () => {
                inputElement.value = option;
                dropdown.style.display = 'none';
                filterClubs();
            });
            dropdown.appendChild(div);
        });
    }

    function updateDropdownList(dropdown, options, inputElement) {
        dropdown.innerHTML = '';
        const currentText = inputElement.value.toLowerCase();
        const filteredOptions = options
            .filter(option => typeof option === 'string' && option.toLowerCase().includes(currentText))
            .map(option => option.toString()); // Преобразуем все опции в строки

        filteredOptions.forEach(option => {
            const div = document.createElement('div');
            div.textContent = option;
            div.addEventListener('click', () => {
                inputElement.value = option;
                dropdown.style.display = 'none';
                filterClubs();
            });
            dropdown.appendChild(div);
        });
        dropdown.style.display = 'block';
    }

    function filterClubs() {
        const clubValue = clubInput.value.toLowerCase();
        const cityValue = cityInput.value.toLowerCase();

        const filteredClubs = allClubs.filter(club => {
            const clubMatch = !clubValue || club.name.toLowerCase().includes(clubValue);
            const cityMatch = !cityValue || cityMap[club.city].toLowerCase().includes(cityValue);
            return clubMatch && cityMatch;
        });
        displayClubs(filteredClubs);
    }

    async function displayClubs(clubs) {
        const container = document.querySelector('.clubsTable_content');
        container.innerHTML = '';
        
        clubs.forEach((club, i) => {
            const item = document.createElement('a');
            item.href = `/ru/dashboard/admin/editclub/${club._id}`;
            item.classList.add('clubsTable_club');
            item.innerHTML = `
                <div class="cell club_club">
                    <div class="club_number">${i+1}</div>
                    <div class="clubLogo" style="background-image: url(${club.logo || '/icons/playerslogo/default_avatar.svg'}); background-position: 50% center; background-size: cover; background-repeat: no-repeat;"></div>
                    <span>${club.name || club.fullname}</span>
                </div>
                <div class="cell club_city">${cityMap[club.city]}</div>
            `;
            container.appendChild(item);
        });
    }

    clubInput.addEventListener('input', () => {
        updateDropdownList(clubDropdown, [...new Set(allClubs.map(club => club.name))], clubInput);
        filterClubs();
    });
    cityInput.addEventListener('input', () => {
        const cityNames = Object.values(cityMap);
        updateDropdownList(cityDropdown, cityNames, cityInput);
        filterClubs();
    });

    clubInput.addEventListener('focus', () => clubDropdown.style.display = 'block');
    cityInput.addEventListener('focus', () => cityDropdown.style.display = 'block');

    clubInput.addEventListener('blur', () => setTimeout(() => clubDropdown.style.display = 'none', 200));
    cityInput.addEventListener('blur', () => setTimeout(() => cityDropdown.style.display = 'none', 200));

    // viewAllButton.addEventListener('click', function(event) {
    //     event.preventDefault();
    //     displayClubs(allClubs);
    //     viewAllButton.style.display = 'none';
    // });
}