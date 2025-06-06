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
    const userId = document.querySelector('.club').dataset.userid;
    const userType = document.querySelector('.club').dataset.usertype;
    // console.log(userId, userType);
    initializeApp();

    btnGoUp();
    
    languageControl();

    breadCrumb();

    const topBlockAdv = document.querySelector('.club');
    fetchAdvertisements(topBlockAdv);

    listenerOfButtons();

    
    const currentPath = window.location.pathname;

    const parts = currentPath.split('/');
    const lang = parts[1];
    const clubId = userId;

    let club;
    let clubCity;
    let clubsPlayers;
    

    const translations = {
        'en': {
            'representative': 'Representative',
            'website': 'Website',
            'workingHours': 'Working hours',
            'city': 'City',
            'contacts': 'Contacts',
            'tables': 'Number of tables',
            'about': 'About the club',
            'address': 'Address',
            'Parking': 'Parking',
            'Shop': 'Shop',
            'Wifi': 'WI-FI',
            'Shower': 'Shower',
            'Air conditioning': 'Air conditioner',
            "Water cooler": "Water cooler",
            'Lockers': 'Lockers',
            'Cafe': 'Cafe',
            'Restaurant': 'Restaurant',
            'Beverages': 'Beverages',
            'Gym': 'Gym',
            'Extra charge': 'Extra charge',
            'Free': 'Free',
            'daysOfWeek': ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            'event': 'Event',
            'start': 'Start',
            'end': 'End',
            'Group training (Adults)': 'Group training (Adults)',
            'Group training (Kids)': 'Group training (Kids)',
            'The Ladder': 'The Ladder',
            'Tournament (Master’s Cup)': 'Tournament (Master’s Cup)',
            'Tournament (Kids Open Cup)': 'Tournament (Kids Open Cup)',
            'Tournament (Amateurs Cup)': 'Tournament (Amateurs Cup)',
            'Private session': 'Private session',
            'Master Class': 'Master Class',
            '-': 'Not selected'
        },
        'ru': {
            'representative': 'Представитель',
            'website': 'Веб-сайт',
            'workingHours': 'Часы работы',
            'city': 'Город',
            'contacts': 'Контакты',
            'tables': 'Количество столов',
            'about': 'О клубе',
            'address': 'Адрес',
            'Parking': 'Парковка',
            'Shop': 'Магазин',
            'Wifi': 'Wi-Fi',
            'Shower': 'Душ',
            'Air conditioning': 'Кондиционер',
            "Water cooler": "Кулер",
            'Lockers': 'Камеры хранения',
            'Cafe': 'Кафе',
            'Restaurant': 'Ресторан',
            'Beverages': 'Напитки',
            'Gym': 'Тренажерный зал',
            'Extra charge': 'Платные',
            'Free': 'Бесплатные',
            'daysOfWeek': ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'],
            'event': 'Событие',
            'start': 'Начало',
            'end': 'Конец',
            'Group training (Adults)': 'Групповая тренировка (взрослые)',
            'Group training (Kids)': 'Групповая тренировка (дети)',
            'The Ladder': 'Лестница',
            'Tournament (Master’s Cup)': 'Турнир (Кубок мастеров)',
            'Tournament (Kids Open Cup)': 'Турнир (Открытый кубок для детей)',
            'Tournament (Amateurs Cup)': 'Турнир (Кубок любителей)',
            'Private session': 'Инд. тренировка',
            'Master Class': 'Мастер-класс',
            '-': 'Не выбрано'
        },
        'th': {
            'representative': 'ตัวแทน',
            'website': 'เว็บไซต์',
            'workingHours': 'ชั่วโมงทำงาน:',
            'city': 'ที่อยู่',
            'contacts': 'ติดต่อเรา',
            'tables': 'จำนวนโต๊ะ',
            'about': 'เกี่ยวกับสโมสร',
            'address': 'ที่อยู่',
            'Parking': 'ที่จอดรถ',
            'Shop': 'ร้านค้า',
            'Wifi': 'Wi-Fi',
            'Shower': 'ห้องอาบน้ำ',
            'Air conditioning': 'เครื่องปรับอากาศ',
            "Water cooler": "ตู้กดน้ำ",
            'Lockers': 'ตู้ล็อกเกอร์',
            'Cafe': 'คาเฟ่',
            'Restaurant': 'ร้านอาหาร',
            'Beverages': 'เครื่องดื่ม',
            'Gym': 'ยิม',
            'Extra charge': 'มีค่าใช้จ่ายเพิ่มเติม',
            'Free': 'ฟรี',
            'daysOfWeek': ['จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์', 'อาทิตย์'],
            'event': 'กิจกรรม',
            'start': 'เริ่ม',
            'end': 'จบ',
            'Group training (Adults)': 'เทรนแบบกลุ่ม (ผู้ใหญ่)',
            'Group training (Kids)': 'เทรนแบบกลุ่ม (เด็ก)',
            'The Ladder': 'แลดเดอร์',
            'Tournament (Master’s Cup)': 'การแข่งขันสำหรับมืออาชีพ',
            'Tournament (Kids Open Cup)': 'การแข่งขันสำหรับเด็ก',
            'Tournament (Amateurs Cup)': 'การแข่งขันสำหรับบุคคลทั่วไป',
            'Private session': 'เทรนส่วนตัว 1:1',
            'Master Class': 'มาสเตอร์คลาส',
            '-': 'ไม่ได้เลือก'
        }
    };

    function getTranslation(key) {
        return translations[lang][key] || translations['en'][key];
    }

    
    async function fetchClubData() {
        try {
            const response = await fetch(`/get-data-club?lang=${lang}&clubId=${clubId}`);
            if (!response.ok) {
                throw new Error('Club not found');
            }
            club = await response.json();
            clubCity = await getCityName(club.city);
            if (club.logo) {
                localStorage.setItem('userLogo', club.logo);
            } else {
                localStorage.setItem('userLogo', 'icons/clubslogo/default_avatar.svg');
            }
            

            // console.log(clubName);  
            renderClubData();
            // renderScheduleTable(club);
            // renderMobileScheduleTable(club);
            renderTableBasedOnScreenSize(club);

            const upcomingBlock = document.querySelector('.upcommingTable_content');
            displayFutureTournaments(club.name, club.logo, upcomingBlock);

        } catch (error) {
            console.error('Error fetching club data:', error);
        }
    }

    async function getCityName(cityId) {
        try {
            const response = await fetch(`/cities/${cityId}`);
            if (!response.ok) {
                throw new Error('City data not found');
            }
            const city = await response.json();
            const languageKeyMap = {
                'en': 'english',
                'ru': 'russian',
                'th': 'thai'
            };
            const cityKey = languageKeyMap[lang] || 'english';
            
            return city[cityKey] || city['english'];
        } catch (error) {
            console.error('Ошибка при получении названия города:', error);
            return 'Unknown City'; // Возвращение запасного значения в случае ошибки
        }
    }

    // const editClubProfile = document.querySelector('#editClubProfile');
    // editClubProfile.addEventListener('click', (e) => {
    //     console.log('есть');
    //     e.preventDefault();
    //     window.location.href = `/${lang}/dashboard/editclub/${clubId}`;
    // });
    
    function renderPhotos() {
        const photoContainer = document.querySelector('#clubsPhotoContainer');
        const photos = club.photos;
        if (photos) {
            photos.forEach(item => {
                const photo = document.createElement('div');
                photo.classList.add('clubPhotos_item');
                photo.style = `background-image: url(${item}); background-position: 50% center; background-size: cover; background-repeat: no-repeat;`;
                photoContainer.appendChild(photo);
            });
        }
    }
    
    function renderClubData() {
        const clubSupplements = document.querySelector('.supplements');
        if (club.supplements.free) {
            const supplFreeContainer = document.createElement('div');
            supplFreeContainer.classList.add('supplements_free');
            clubSupplements.appendChild(supplFreeContainer);

            const supplementsName = document.createElement('p');
            supplementsName.innerText = `${getTranslation('Free')}: `;
            supplFreeContainer.appendChild(supplementsName);

            club.supplements.free.forEach(item => {
                // console.log(item);
                const supplement = document.createElement('div');
                supplement.classList.add('supplements_item');
                const supplText = document.createElement('p');
                supplText.innerHTML = `${getTranslation(item)}`;
                supplement.appendChild(supplText);
                supplFreeContainer.appendChild(supplement);
            })
        }

        if (club.supplements.paid) {
            const supplPaidContainer = document.createElement('div');
            supplPaidContainer.classList.add('supplements_paid');
            clubSupplements.appendChild(supplPaidContainer);

            const supplementsName = document.createElement('p');
            supplementsName.innerText = `${getTranslation('Extra charge')}: `;
            supplPaidContainer.appendChild(supplementsName);

            club.supplements.paid.forEach(item => {
                // console.log(item);
                const supplement = document.createElement('div');
                supplement.classList.add('supplements_item');
                const supplText = document.createElement('p');
                supplText.innerHTML = `${getTranslation(item)}`;
                supplement.appendChild(supplText);
                supplPaidContainer.appendChild(supplement);
            })
        }

        const clubMainInfo = document.querySelector('.club_mainInfo');
        clubMainInfo.innerHTML = `
            <div class="club_mainInfo_logo" style="background-image: url(${club.logo}); background-position: 50% center; background-size: cover; background-repeat: no-repeat;"></div>
            <div class="club_mainInfo_info">
                <div class="club_mainInfo_info_name">
                    ${club.name}
                </div>
                <div class="club_mainInfo_info_descr">
                    <div class="club_mainInfo_info_descr_path">
                        <p>${getTranslation('representative')}: <span>${club.representative || ' - '}</span></p>
                        <p>${getTranslation('website')}: <span><a href="${club.website}">${club.website}</a></span></p>
                        <p>${getTranslation('workingHours')}: <span>${club.workingHours}</span></p>
                    </div>
                    <div class="club_mainInfo_info_descr_path">
                        <p>${getTranslation('city')}: <span>${clubCity}</span></p>
                        <p>${getTranslation('contacts')}: <span><a href="tel:${club.phoneNumber}">${club.phoneNumber}</a></span></p>
                        <p>${getTranslation('tables')}: <span>${club.tables}</span></p>
                    </div>
                </div>
            </div>
        `;

        const clubAbout = document.querySelector('.club_about');
        clubAbout.innerHTML = `
            <h3>${getTranslation('about')}</h3>
            <div class="club_about_wrapp">
                <p><span>${getTranslation('address')}: </span>${club.address[lang] || club.address['en']}</p>
                <p>${nl2br(club.info[lang]) || nl2br(club.info['en'])}</p>
            </div>
        `;
        
        renderMap();
        renderPhotos();  //  жду дизайн

        document.addEventListener('click', (event) => {
            // console.log(event.target);
            
            if (event.target.closest('#createTournament')) {
                event.preventDefault();
                event.stopPropagation();
                window.location.href = `/${lang}/createtournament/${club._id}`;
            }

        });
        
    }

    document.addEventListener('click', async function(event) {

        if (event.target.id === 'createTournament') {
            event.stopPropagation();
            window.location.href = `/${lang}/createtournament/${club._id}`;
        }

        if (event.target.id === 'startTournament') {
            event.preventDefault();
            window.location.href = `/${lang}/soft/${club._id}`;
        }

    });

    function nl2br(str) {
        return str.replace(/\n/g, '<br>');
    }

    // renderScheduleTable(club);

    function renderTableBasedOnScreenSize(clubData) {
        // Определяем ширину экрана
        const screenWidth = window.innerWidth;
    
        // Если ширина меньше 700px, рендерим мобильную таблицу
        if (screenWidth < 768) {
            renderMobileScheduleTable(clubData);
        } else {
            renderScheduleTable(clubData);
        }
    }
    
    // Добавляем слушатель resize
    window.addEventListener('resize', () => {
        renderTableBasedOnScreenSize(club); // Вызываем рендер при изменении размера окна
    });

    function renderScheduleTable(clubData) {
        const daysOfWeek = getTranslation('daysOfWeek'); // Переведенные названия дней
        const dayKeys = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
        const maxSessions = 6; // Постоянное значение для количества сессий
      
        const tableBody = document.querySelector('.schedule-form');
        tableBody.innerHTML = ""; // Очищаем таблицу перед заполнением
    
        const schedule = clubData?.scheduleData || {};
        // Создаем строку заголовков таблицы
        const headerRow = document.createElement("tr");
    
        // Первая ячейка заголовка - "Session"
        const sessionHeader = document.createElement("th");
        // sessionHeader.innerText = getTranslation('session');
        headerRow.appendChild(sessionHeader);
    
        // Добавляем названия дней недели в заголовок
        daysOfWeek.forEach(day => {
            const dayHeader = document.createElement("th");
            dayHeader.innerText = day;
            headerRow.appendChild(dayHeader);
        });
    
        tableBody.appendChild(headerRow); // Добавляем заголовок в таблицу
    
        
        // Рендерим строки для каждой сессии
        for (let sessionIndex = 0; sessionIndex < maxSessions; sessionIndex++) {
            const row = document.createElement("tr");
    
            // Добавляем номер сессии
            const sessionCell = document.createElement("td");
            sessionCell.innerText = sessionIndex + 1;
            sessionCell.classList.add('sessionCell');
            sessionCell.style = 'align-content: center; width: 40px';
            row.appendChild(sessionCell);
            
            // Создаем ячейки для каждого дня недели
            dayKeys.forEach((dayKey, dayIndex) => {
                const cell = document.createElement("td");
                cell.style = "height: 109px; align-items: center";
                
                const eventData = schedule[dayKey]?.[sessionIndex] || { event: "", start: "", end: "" };
    
                const eventInput = document.createElement("div");
                eventInput.innerText = getTranslation(eventData.event) || '';

                eventInput.name = `${dayKey}_event_${sessionIndex + 1}`;
                eventInput.classList.add("event");

    
                // Поля для начала и окончания события
                const startLabel = document.createElement("div");
                startLabel.classList.add("time");
                if(eventData.event !== '' && eventData.start && eventData.end) {
                    startLabel.innerText = `${eventData.start} - ${eventData.end}`;
                } else {
                    startLabel.innerText = '';
                }
                
                cell.appendChild(eventInput);
                // cell.appendChild(dropdown);
                cell.appendChild(startLabel);
    
                row.appendChild(cell);
            });
    
            tableBody.appendChild(row);
        }
    }

    function renderMobileScheduleTable(clubData) {
        const daysOfWeek = getTranslation('daysOfWeek'); // Переведенные названия дней
        const dayKeys = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
        
        const tableBody = document.querySelector('.schedule-form');
        tableBody.innerHTML = ""; // Очищаем таблицу перед заполнением
        
        // Идем по каждому дню недели
        dayKeys.forEach((dayKey, dayIndex) => {
            const eventsForDay = clubData.scheduleData[dayKey] || []; // События дня

            // Фильтруем события: оставляем только те, где есть данные
            const filteredEvents = eventsForDay.filter(event => event.event && event.start && event.end);
            
            // Пропускаем день, если событий нет
            if (filteredEvents.length === 0) return;

            // Создаём заголовок дня
            const dayRow = document.createElement("tr");
            const dayCell = document.createElement("th");
            dayCell.colSpan = 3; // Охватывает все колонки
            dayCell.classList.add("day-header");
            dayCell.innerText = daysOfWeek[dayIndex]; // Название дня недели
            dayRow.appendChild(dayCell);
            tableBody.appendChild(dayRow);

            // Для каждого события создаем строку
            filteredEvents.forEach(eventData => {
                const eventRow = document.createElement("tr");

                // Ячейка с названием события
                const eventNameCell = document.createElement("td");
                eventNameCell.classList.add("event");
                const spanEvent = document.createElement('span');
                spanEvent.innerText = `${getTranslation(eventData.event)}`;
                const spanTime = document.createElement('span');
                spanTime.innerText = `${eventData.start}-${eventData.end}`;

                eventNameCell.appendChild(spanEvent);
                eventNameCell.appendChild(spanTime);
                eventRow.appendChild(eventNameCell);

                tableBody.appendChild(eventRow);
            });
        });
    }
    
    

    function renderMap() {
        const mapElement = document.getElementById('map');
        if (!mapElement) return;

        const map = L.map('map').setView([club.location[0], club.location[1]], 15);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        L.marker([club.location[0], club.location[1]]).addTo(map)
            .bindPopup(`${club.address[lang] || club.address['en']}`)
            .openPopup();
    }

    function renderPhotos() {
        const photoContainer = document.querySelector('#clubsPhotoContainer');
        const photos = club.photos;
        if (photos) {
            photos.forEach(item => {
                const photo = document.createElement('div');
                photo.classList.add('clubPhotos_item');
                photo.style = `background-image: url(${item}); background-position: 50% center; background-size: cover; background-repeat: no-repeat;`;
                photoContainer.appendChild(photo);
            });
        }
    }

    // const upcomingBlock = document.querySelector('.upcommingTable_content');
    // displayFutureTournaments(clubName, upcomingBlock);
    await fetchClubData();
    
    console.log('club', club);
    // loadClubWinners(club._id);
    loadClubPlayers(club._id);

    async function displayFutureTournaments(clubName, clubLogo, container) {
        try {
            // Очистка контейнера перед отрисовкой данных
            container.innerHTML = '';
    
            // Получение текущего языка интерфейса
            const languageMap = {
                'russian': 'ru',
                'english': 'en',
                'thai': 'th'
            };
            const currentLang = localStorage.getItem('clientLang') || 'english';
            const langKey = languageMap[currentLang];
    
            // const clubName = 'PHUKET TT CLUB';
            // Запрос к базе данных для получения будущих турниров текущего клуба
            const response = await fetch(`/api/clubtournaments?clubName=${encodeURIComponent(clubName)}&clubLogo=${encodeURIComponent(clubLogo)}&upcoming=true`);
    
            const gettournaments = await response.json();
            // console.log(tournaments);
            // Сортировка турниров по дате
            // tournaments.sort((a, b) => new Date(a.datetime) - new Date(b.datetime));
            const tournaments = gettournaments.filter(t => !t.finished).sort((a, b) => new Date(a.datetime) - new Date(b.datetime));

    
            // Рендеринг каждого турнира
            for (const tournament of tournaments) {
                const tournamentDate = new Date(tournament.datetime);
                let langMap = { 'english': 'en-US', 'thai': 'th-TH', 'russian': 'ru-RU' };
                let lang = langMap[localStorage.clientLang] || 'en-US';
                let dayOfWeek = tournamentDate.toLocaleDateString(lang, { weekday: 'long' });
                let formattedDate = `${dayOfWeek} ${String(tournamentDate.getDate()).padStart(2, '0')}.${String(tournamentDate.getMonth() + 1).padStart(2, '0')}.${tournamentDate.getFullYear()}`;
    
                // Создание элемента турнира
                let tournamentDiv = document.createElement('a');
                tournamentDiv.className = 'upcommingTable_tournament';
                tournamentDiv.href = `/${langKey}/tournaments/${tournament._id}`;
    
                // Время
                let timeDiv = document.createElement('div');
                timeDiv.className = 'cell tournament_time';
                timeDiv.textContent = tournament.datetime.split('T')[1].substring(0, 5);
                tournamentDiv.appendChild(timeDiv);
    
                // Клуб
                let clubDiv = document.createElement('div');
                clubDiv.className = 'cell tournament_club';
                let clubLogoDiv = document.createElement('div');
                clubLogoDiv.className = 'clubLogo';
                clubLogoDiv.style.cssText = `background-image: url('${tournament.club.logo}'); background-position: 50%; background-size: cover; background-repeat: no-repeat;`;
                clubDiv.appendChild(clubLogoDiv);
    
                let clubNameSpan = document.createElement('span');
                clubNameSpan.textContent = tournament.club.name;
                clubDiv.appendChild(clubNameSpan);
                tournamentDiv.appendChild(clubDiv);
    
                // Ограничения
                let restrictionsDiv = document.createElement('div');
                restrictionsDiv.className = 'cell tournament_restrict';
                restrictionsDiv.textContent = tournament.restrictions || '';
                tournamentDiv.appendChild(restrictionsDiv);
    
                // Рейтинг
                let ratingDiv = document.createElement('div');
                ratingDiv.className = 'cell tournament_rating';
                ratingDiv.textContent = tournament.rating || '-';
                tournamentDiv.appendChild(ratingDiv);
    
                // Игроки
                let playersDiv = document.createElement('div');
                playersDiv.className = 'cell tournament_players';
                let playersImg = document.createElement('img');
                playersImg.src = '/icons/user.svg';
                playersImg.alt = 'players';
                playersDiv.appendChild(playersImg);
    
                let playersSpan = document.createElement('span');
                playersSpan.textContent = tournament.players ? tournament.players.length : '0';
                playersDiv.appendChild(playersSpan);
                tournamentDiv.appendChild(playersDiv);

                let editTournament = document.createElement('img');
                editTournament.src = '/icons/editpen.svg';
                editTournament.alt = 'Edit Pen';
                editTournament.className = 'editPen';
                editTournament.id = 'editPen';
                editTournament.dataset.id = tournament._id || tournament.id;
                // editTournament.addEventListener('click', (e) => {
                //     e.stopPropagation();
                //     window.location.href = `/${lang}/dashboard/edittournament/${tournament._id || tournament.id}`;
                // });
                playersDiv.appendChild(editTournament);
                tournamentDiv.appendChild(playersDiv);
                document.addEventListener('click', function (event) {
                    const editPen = event.target.closest('.editPen');
                    if (editPen) {
                        event.preventDefault(); // Предотвращает переход по ссылке-родителю
                        const tournamentId = editPen.dataset.id;
                        const usertId = clubId;
                        window.location.href = `/${langKey}/dashboard/edittournament/${tournamentId}/${usertId}`;
                    }
                });
    
                // Добавление турнира в контейнер
                container.appendChild(tournamentDiv);
            }
    
            // Если турниры не найдены
            if (tournaments.length === 0) {
                let noTournamentsDiv = document.createElement('div');
                noTournamentsDiv.className = 'no_tournaments';
                noTournamentsDiv.textContent = {
                    'english': 'No upcoming tournaments',
                    'thai': 'ไม่มีการแข่งขันที่จะมาถึง',
                    'russian': 'Нет предстоящих турниров'
                }[currentLang] || 'No upcoming tournaments';
                container.appendChild(noTournamentsDiv);
            }
        } catch (error) {
            console.error('Error displaying tournaments:', error);
            showErrorModal('Error while displaying tournaments', 'Oops!');
        }
    }

    // document.addEventListener('click', (event) => {
    //     if (event.target.id === 'startTournament') {
    //         event.preventDefault();
    //         window.location.href = `/${languageMap[localStorage.clientLang]}/soft`;
    //     }
    // })

    

    // async function fetchClubPlayersDetails(club) {
    //     try {
    //         const response = await fetch('/getClubPlayers', {
    //             method: 'POST',
    //             headers: { 'Content-Type': 'application/json' },
    //             body: JSON.stringify({ playerIds: club.players })
    //         });
    
    //         const data = await response.json();
    //         if (!response.ok) throw new Error(data.error || "Ошибка загрузки игроков");
    //         return data.players;
    //     } catch (err) {
    //         console.error('Ошибка загрузки игроков клуба:', err);
    //         return [];
    //     }
    // }

    // async function loadClubWinners(clubId) {
    //     const players = await fetchClubWinners(clubId);
    //     renderClubWinners(players, clubId);
    //     renderClubParticipants(players, clubId);
    // }

    // async function fetchClubWinners(clubId) {
    //     try {
    //       const response = await fetch('/getClubWinners', {
    //         method: 'POST',
    //         headers: { 'Content-Type': 'application/json' },
    //         body: JSON.stringify({ clubId })
    //       });
      
    //       const data = await response.json();
    //       if (!response.ok) throw new Error(data.error || 'Ошибка загрузки победителей');
      
    //       return data.players || [];
    //     } catch (error) {
    //       console.error('❌ Ошибка при получении призёров клуба:', error);
    //       return [];
    //     }
    // }

    async function loadClubPlayers(clubId) {
        const response = await fetch('/getClubPlayersFull', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ clubId }),
        });
      
        const { players, prizePlayerIds } = await response.json();
        console.log('players', players);
        console.log('prizePlayerIds', prizePlayerIds);

        // Отображаем призёров
        const winners = players.filter(p => prizePlayerIds.includes(p._id));
        renderClubWinners(winners, clubId);
        renderClubVictories(winners, clubId)
      
        // Отображаем всех участников
        renderClubParticipants(players, clubId);
      }

    

    // function renderClubParticipants(players, clubId) {
    //     const table = document.getElementById('tournamentsTable');
    //     const seeMoreBtn = document.querySelector('.tournamentsTable_btn');
      
    //     if (!table || !players || !Array.isArray(players)) return;
      
    //     table.innerHTML = '';
    //     seeMoreBtn.style.display = 'none';
      
    //     // Сортировка по количеству турниров в клубе
    //     const sorted = [...players].sort((a, b) => {
    //       const tourA = a.tournaments?.[clubId] || 0;
    //       const tourB = b.tournaments?.[clubId] || 0;
    //       return tourB - tourA;
    //     });
      
    //     const maxVisible = 5;
    //     sorted.forEach((player, index) => {
    //       const tournaments = player.tournaments?.[clubId] || 1;
    //       const rating = Math.round(player.rating) || 0;
      
    //       const div = document.createElement('div');
    //       div.classList.add('tournamentsTable_row');
    //       if (index >= maxVisible) div.classList.add('hidden'); // скрываем лишние
      
    //       div.innerHTML = `
    //         <span class="player_number">${index + 1}</span>
    //         <span class="player_player">${player.name || player.fullname || player.nickname}</span>
    //         <span class="player_tournaments">${tournaments}</span>
    //         <span class="player_rating">${rating}</span>
    //       `;
      
    //       table.appendChild(div);
    //     });
      
    //     // Показываем кнопку "See more", если игроков больше 5
    //     if (sorted.length > maxVisible) {
    //       seeMoreBtn.style.display = 'inline-block';
    //       seeMoreBtn.addEventListener('click', (e) => {
    //         e.preventDefault();
    //         table.querySelectorAll('.hidden').forEach(row => row.classList.remove('hidden'));
    //         seeMoreBtn.style.display = 'none';
    //       });
    //     }
    // }

    function renderClubParticipants(players, clubId) {
        const table = document.getElementById('tournamentsTable');
        const btn = document.querySelector('.tournamentsTable_btn');
        if (!table || !players || !Array.isArray(players)) return;
    
        table.innerHTML = '';
        btn.style.display = 'none';
    
        const sorted = [...players].sort((a, b) => {
            const tourA = a.tournaments?.[clubId] || 0;
            const tourB = b.tournaments?.[clubId] || 0;
            return tourB - tourA;
        });
    
        const maxVisible = 5;
        let showingAll = false;
    
        const renderList = (list) => {
            table.innerHTML = '';
            list.forEach((player, index) => {
                const tournaments = player.tournaments?.[clubId] || 1;
                const rating = Math.round(player.rating) || 0;
    
                const div = document.createElement('div');
                div.classList.add('tournamentsTable_row');
                div.innerHTML = `
                    <span class="player_number">${index + 1}</span>
                    <span class="player_player">${player.name || player.fullname || player.nickname}</span>
                    <span class="player_tournaments">${tournaments}</span>
                    <span class="player_rating">${rating}</span>
                `;
                table.appendChild(div);
            });
        };
    
        const visibleList = sorted.slice(0, maxVisible);
        renderList(visibleList);
    
        if (sorted.length > maxVisible) {
            btn.style.display = 'inline-block';
            btn.textContent = 'See more';
    
            btn.onclick = (e) => {
                e.preventDefault();
                if (showingAll) {
                    renderList(visibleList);
                    btn.textContent = 'See more';
                    showingAll = false;
                } else {
                    renderList(sorted);
                    btn.textContent = 'See less';
                    showingAll = true;
                }
            };
        }
    }
    
      
    function renderClubVictories(players, clubId) {
        const table = document.getElementById('victoriesTable');
        const btn = document.querySelector('.victoriesTable_btn');
        if (!table || !players || !Array.isArray(players)) return;
    
        table.innerHTML = '';
    
        const enriched = players.map(p => {
            const aw = p.awards?.[clubId] || {};
            return {
                ...p,
                victories: (aw.gold || 0) + (aw.silver || 0) + (aw.bronze || 0),
            };
        });
    
        const filtered = enriched.filter(p => p.victories > 0);
        const sorted = filtered.sort((a, b) => b.victories - a.victories);
    
        let showingAll = false;
    
        const renderList = (list) => {
            table.innerHTML = '';
            list.forEach((player, index) => {
                const rating = Math.round(player.rating || 0);
                const div = document.createElement('div');
                div.classList.add('victoriesTable_row');
                div.innerHTML = `
                    <span class="player_number">${index + 1}</span>
                    <span class="player_player">${player.fullname || player.nickname}</span>
                    <span class="player_tournaments">${player.victories}</span>
                    <span class="player_rating">${rating}</span>
                `;
                table.appendChild(div);
            });
        };
    
        // Первичная отрисовка (только топ-5)
        const visibleList = sorted.slice(0, 5);
        renderList(visibleList);
    
        if (sorted.length > 5) {
            btn.style.display = 'block';
            btn.onclick = (e) => {
                e.preventDefault();
                if (showingAll) {
                    renderList(visibleList);
                    btn.textContent = 'See more';
                    showingAll = false;
                } else {
                    renderList(sorted);
                    btn.textContent = 'See less';
                    showingAll = true;
                }
            };
        } else {
            btn.style.display = 'none';
        }
    }
    
    

    function renderClubWinners(players, clubId) {
        const table = document.getElementById('winnersTable');
        const seeMoreBtn = document.querySelector('.winnersTable_btn');
        if (!table || !players || !Array.isArray(players)) return;
    
        table.innerHTML = '';
        seeMoreBtn.style.display = 'none'; // Скрываем кнопку по умолчанию

        const filtered = players.filter(p => {
            const aw = p.awards?.[clubId];
            return aw?.gold || aw?.silver || aw?.bronze;
        });
    
        const sorted = [...filtered].sort((a, b) => {
            const awA = a.awards?.[clubId] || {};
            const awB = b.awards?.[clubId] || {};
    
            if ((awB.gold || 0) !== (awA.gold || 0)) return (awB.gold || 0) - (awA.gold || 0);
            if ((awB.silver || 0) !== (awA.silver || 0)) return (awB.silver || 0) - (awA.silver || 0);
            return (awB.bronze || 0) - (awA.bronze || 0);
        });
    
        const initialCount = 5;
    
        // Вложенная функция для создания строки
        const createRow = (player, index) => {
            const award = player.awards?.[clubId] || {};
            const rating = Math.round(player.rating) || 0;
            const tournaments = player.tournaments?.[clubId] || 1;
    
            const div = document.createElement('div');
            div.classList.add('winnersTable_row');
            div.innerHTML = `
                <span class="player_number">${index + 1}</span>
                <span class="player_player">${player.name || player.fullname || player.nickname}</span>
                <span class="player_places">
                    <span>${award.gold || 0}</span>
                    <span>${award.silver || 0}</span>
                    <span>${award.bronze || 0}</span>
                </span>
                <span class="player_tournaments">${tournaments}</span>
                <span class="player_rating">${rating}</span>
            `;
            return div;
        };
    
        // Отображаем только первые 5
        sorted.slice(0, initialCount).forEach((player, index) => {
            const row = createRow(player, index);
            table.appendChild(row);
        });
    
        // Если больше 5 — показываем кнопку и добавляем обработчик
        if (sorted.length > initialCount) {
            seeMoreBtn.style.display = 'inline-block';
            seeMoreBtn.onclick = (e) => {
                e.preventDefault();
                table.innerHTML = ''; // Очищаем и перерисовываем все
                sorted.forEach((player, index) => {
                    const row = createRow(player, index);
                    table.appendChild(row);
                });
                seeMoreBtn.style.display = 'none'; // Скрываем кнопку после раскрытия
            };
        }
    }
    
    // function renderClubWinners(players, clubId) {
    //     const table = document.getElementById('winnersTable');
    //     if (!table || !players || !Array.isArray(players)) return;
    
    //     table.innerHTML = '';
    
    //     const sorted = [...players].sort((a, b) => {
    //         const awA = a.awards?.[clubId] || {};
    //         const awB = b.awards?.[clubId] || {};
    
    //         if ((awB.gold || 0) !== (awA.gold || 0)) return (awB.gold || 0) - (awA.gold || 0);
    //         if ((awB.silver || 0) !== (awA.silver || 0)) return (awB.silver || 0) - (awA.silver || 0);
    //         return (awB.bronze || 0) - (awA.bronze || 0);
    //     });
    
    //     sorted.forEach((player, index) => {
    //         const award = player.awards?.[clubId] || {};
    //         const rating = Math.round(player.rating, 0) || 0;
    //         const tournaments = player.tournaments?.[clubId] || 0;
    
    //         const div = document.createElement('div');
    //         div.classList.add('winnersTable_row');
    
    //         div.innerHTML = `
    //             <span class="player_number">${index + 1}</span>
    //             <span class="player_player">${player.fullname || player.nickname}</span>
    //             <span class="player_places">
    //                 ${award.gold || 0}
    //                 ${award.silver || 0}
    //                 ${award.bronze || 0}
    //             </span>
    //             <span class="player_tournaments">${tournaments}</span>
    //             <span class="player_rating">${rating}</span>
    //         `;
    
    //         table.appendChild(div);
    //     });
    // }
    



});