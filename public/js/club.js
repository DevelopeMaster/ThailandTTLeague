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

    const topBlockAdv = document.querySelector('.club');
    fetchAdvertisements(topBlockAdv);

    listenerOfButtons();

    
    const currentPath = window.location.pathname;

    const parts = currentPath.split('/');
    const lang = parts[1];
    const clubId = parts[3];
    // console.log(clubId);
    let club;
    let clubCity;

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
            'Private session': 'Индивидуальная тренировка',
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
            const response = await fetch(`/get-data-club?clubId=${clubId}`);
            if (!response.ok) {
                throw new Error('Club not found');
            }
            club = await response.json();
            clubCity = await getCityName(club.city);
            renderClubData();
            console.log(club);
            
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

    

    function renderClubData() {
        const clubSupplements = document.querySelector('.supplements');
        if (club.supplements.free) {
            const supplFreeContainer = document.createElement('div');
            supplFreeContainer.classList.add('supplements_free');
            clubSupplements.appendChild(supplFreeContainer);

            const supplementsName = document.createElement('p');
            supplementsName.innerText = `${getTranslation(`Free`)}: `;
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
            supplementsName.innerText = `${getTranslation(`Extra charge`)}: `;
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
        // club.supplements.forEach(item => {
        //     console.log(item);
        //     const supplement = document.createElement('div');
        //     supplement.classList.add('supplements_item');
        //     const supplText = document.createElement('p');
        //     supplText.innerHTML = `${getTranslation(item)}`;
        //     supplement.appendChild(supplText);
        //     clubSupplements.appendChild(supplement);
        // })

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
        
        if (club.scheduleData) {
            renderTableBasedOnScreenSize(club);
        } else {
            console.log('рассписание еще не внесено!!!');
        }
        

        if (club.location && club.location[0] && club.location[1]) {
            renderMap();
        } else {
            console.log('локация еще не добавлена!!!');
        }
        
        renderPhotos();
    }

    function nl2br(str) {
        return str.replace(/\n/g, '<br>');
    }


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
    // window.addEventListener('resize', () => {
    //     renderTableBasedOnScreenSize(club); // Вызываем рендер при изменении размера окна
    // });

    function renderScheduleTable(clubData) {
        const daysOfWeek = getTranslation('daysOfWeek'); // Переведенные названия дней
        const dayKeys = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
        const maxSessions = 6; // Постоянное значение для количества сессий
      
        const tableBody = document.querySelector('.schedule-form');
        tableBody.innerHTML = ""; // Очищаем таблицу перед заполнением
    
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
            // console.log(clubData);
            // Создаем ячейки для каждого дня недели
            dayKeys.forEach((dayKey, dayIndex) => {
                const cell = document.createElement("td");
                cell.style = "height: 109px; align-items: center";
                
                const eventData = clubData.scheduleData[dayKey]?.[sessionIndex] || { event: "", start: "", end: "" };
    
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

    fetchClubData();



    














    // {
    //     "_id": {
    //       "$oid": "6666060689e93dc1fd6e7a66"
    //     },
    //     "name": "Phuket TT Club",
    //     "city": {
    //       "$oid": "667019e9ae77584c46f03b07"
    //     },
    //     "logo": "/icons/clubslogo/TT_CLUB.png",
    //     "representative": "Zhgulev Ilya",
    //       "website": "https://worldtabletennissite",
    //       "workingHours": "10:00-20:00",
    //       "tables": "6",
    //       "address": "Phuket, Big C Supercenter, 2nd floor, Ek Wanit Uthit Soi 2, Wichit, Mueang Phuket District, Phuket 83000",
    //       "location": [
    //         7.896233788633527, 
    //         98.3673743360749
    //       ],
    //       "info": "Official table tennis club in the Kingdom of Thailand, Phuket Island.<br><br> Certified professional equipment, air-conditioned premises, professional trainers (English, Russian and Thai).<br><br>We provide individual training services and tournaments of various skill levels.",
    //       "photos": [
    //           "/images/phuketttclub/clubsphoto-one.jpg",
    //           "/images/phuketttclub/clubsphoto-two.png",
    //           "/images/phuketttclub/clubsphoto-three.png",
    //           "/images/phuketttclub/clubsphoto-four.png"
    //       ],
    //   }




});