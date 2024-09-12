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

    const topBlockAdv = document.querySelector('.player');
    fetchAdvertisements(topBlockAdv);

    listenerOfButtons();

    
    const currentPath = window.location.pathname;

    const parts = currentPath.split('/');
    const lang = parts[1];
    // const userId = parts[3];

    const userId = document.querySelector('.player').dataset.userid;
    let player;
    let playerCity;

    const translations = {
        'en': {
            'city': 'City',
            'contacts': 'Contacts',
            'Playing hand': 'Plaing hand',
            'Rating': 'Rating',
            'Birthday': 'Date of birth',
            'Racket': 'Racket',
            'Blade': 'Blade',
            'Forehand rubber': 'Forehand rubber',
            'Backhand rubber': 'Backhand rubber',
            'years': 'years',
            'Tournaments played': 'Tournaments played',
            'Games': 'Games (wins / losses)',
            'Maximum rating': 'Maximum rating',
            'Rank': 'Rank',
            'First tournament': 'First tournament',
            'Most often in': 'Most often in',
            'tournaments': 'tournaments',
            'left': 'left',
            'right': 'right',
            'Coach': 'Coach'
        },
        'ru': {
            'city': 'Город:',
            'contacts': 'Contacts',
            'Playing hand': 'Игровая рука:',
            'Rating': 'Рейтигн',
            'Birthday': 'Дата рождения',
            'Racket': 'Ракетка:',
            'Blade': 'Основание',
            'Forehand rubber': 'Накладка слева',
            'Backhand rubber': 'Накладка справа',
            'years': 'лет',
            'Tournaments played': 'Сыграно турниров',
            'Games': 'Игры (победы / поражения)',
            'Maximum rating': 'Максимальный рейтинг',
            'Rank': 'Место в рейтинге',
            'First tournament': 'Первый турнир',
            'Most often in': 'Чаще всего в',
            'tournaments': 'турниров',
            'left': 'левая',
            'right': 'правая',
            'Coach': 'Тренер'
        },
        'th': {
            'city': 'เมือง',
            'contacts': 'Contacts',
            'Playing hand': 'มือฝั่งที่เล่น',
            'Rating': 'คะแนน',
            'Birthday': 'วันเกิด',
            'Racket': 'Racket',
            'Blade': 'Blade',
            'Forehand rubber': 'Forehand rubber',
            'Backhand rubber': 'Backhand rubber',
            'years': 'years',
            'Tournaments played': 'จำนวนการแข่งขันที่ผ่านมา',
            'Games': 'จำนวนการแข่ง (ชนะ / แพ้)',
            'Maximum rating': 'คะแนนสูงสุด',
            'Rank': 'อันดับ',
            'First tournament': 'การแข่งขันครั้งแรก',
            'Most often in': 'เล่นประจำที่',
            'tournaments': 'การแข่งขัน',
            'left': 'ซ้าย',
            'right': 'ขวา',
            'Coach': 'โค้ช'
        }
    };

    function getTranslation(key) {
        return translations[lang][key] || translations['en'][key];
    }

    async function fetchPlayerData() {
        try {
            const response = await fetch(`/get-data-player?lang=${lang}&userId=${userId}`);
            if (!response.ok) {
                throw new Error('Player not found');
            }
            player = await response.json();
            console.log(player);
            playerCity = await getCityName(player.city);
            console.log(playerCity);
            renderPlayerData();
        } catch (error) {
            console.error('Error fetching player data:', error);
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

    // function formatDateAndAge(dateString) {
    //     // Преобразуем строку в объект Date
    //     const date = new Date(dateString);
    
    //     // Форматируем дату в формате DD.MM.YYYY
    //     const day = String(date.getDate()).padStart(2, '0');
    //     const month = String(date.getMonth() + 1).padStart(2, '0'); // Месяцы в JavaScript начинаются с 0
    //     const year = date.getFullYear();
    
    //     // Вычисляем возраст
    //     const currentDate = new Date();
    //     let age = currentDate.getFullYear() - year;
        
    //     // Проверяем, прошел ли день рождения в этом году
    //     if (
    //         currentDate.getMonth() < date.getMonth() ||
    //         (currentDate.getMonth() === date.getMonth() && currentDate.getDate() < date.getDate())
    //     ) {
    //         age--;
    //     }
    
    //     // Собираем строку в нужном формате
    //     return `${day}.${month}.${year} (${age} years)`;
    // }

    function formatDateAndAge(dateString, language) {
        const date = new Date(dateString);
    
        // Форматируем дату в формате DD.MM.YYYY
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
    
        // Вычисляем возраст
        const currentDate = new Date();
        let age = currentDate.getFullYear() - year;
    
        if (
            currentDate.getMonth() < date.getMonth() ||
            (currentDate.getMonth() === date.getMonth() && currentDate.getDate() < date.getDate())
        ) {
            age--;
        }
    
        // Определяем форму слова для возраста
        let ageText;
        if (language === 'ru') {
            ageText = getRussianAgeText(age);
        } else if (language === 'en') {
            ageText = `${age} years`;
        } else if (language === 'th') {
            ageText = `${age} ปี`; // "ปี" означает "лет" на тайском
        } else {
            ageText = `${age} years`; // По умолчанию используем английский
        }
    
        return `${day}.${month}.${year} (${ageText})`;
    }
    
    function getRussianAgeText(age) {
        const lastDigit = age % 10;
        const lastTwoDigits = age % 100;
    
        if (lastTwoDigits >= 11 && lastTwoDigits <= 14) {
            return `${age} лет`;
        }
    
        switch (lastDigit) {
            case 1:
                return `${age} год`;
            case 2:
            case 3:
            case 4:
                return `${age} года`;
            default:
                return `${age} лет`;
        }
    }
    

    function renderPlayerData() {
        const formattedDate = formatDateAndAge(player.birthdayDate, lang);

        const playerMainInfo = document.querySelector('.player_mainInfo');
        playerMainInfo.innerHTML = `
            <div class="player_mainInfo_logo" style="background-image: url(${player.logo || 'icons/playerslogo/default_avatar.svg'}); background-position: 50% center; background-size: cover; background-repeat: no-repeat;"></div>
            <div class="player_mainInfo_info">
                <div class="player_mainInfo_info_name">
                    ${player.name || player.fullname}
                </div>
                <div class="player_mainInfo_info_descr">
                    <div class="player_mainInfo_info_descr_path">
                        <p>${getTranslation('Playing hand')}: <span>${getTranslation(player.hand)}</span></p>
                        <p>${getTranslation('Rating')}: <span>${player.rating || ' - '}</span></p>
                        <p>${getTranslation('Coach')}: <span>${player.coach || ' - '}</span></p>
                    </div>
                    <div class="player_mainInfo_info_descr_path">
                        <p>${getTranslation('city')}: <span>${playerCity}</span></p>
                        <p>${getTranslation('Birthday')}: <span>${formattedDate}</span></p>
                    </div>
                </div>
            </div>
        `;

        const playerAbout = document.querySelector('.player_about');
        playerAbout.innerHTML = `
            <h3>${getTranslation('Racket')}</h3>
            <div class="player_about_info_descr">
                <div class="player_about_info_descr_path">
                    <p>${getTranslation('Blade')}: <span>${player.blade || ' - '}</span></p>
                    <p>${getTranslation('Forehand rubber')}: <span>${player.forehandRubber || ' - '}</span></p>
                </div>
                <div class="player_about_info_descr_path">
                    <p>${getTranslation('Backhand rubber')}: <span>${player.backhandRubber || ' - '}</span></p>
                    
                </div>
            </div>
            
        `;

        const playerStatistics = document.querySelector('.player_statistics');
        playerStatistics.innerHTML = `
            <div class="player_statistics_info_descr">
                <div class="player_statistics_info_descr_path">
                    <p>${getTranslation('Tournaments played')}: <span>${player.tournaments || ' - '}</span></p>
                    <p>${getTranslation('Games')}: <span>323 (258 / 65)</span></p>
                    <div class="raitingWrapp"><span>${getTranslation('Maximum rating')}:</span> <span class="coaches_content_coach_info_rating">${player.rating || ' - '}</span></div>
                </div>
                <div class="player_statistics_info_descr_path statisticsSeparateLine">
                    <p>${getTranslation('Rank')}: <span>${player.rank || ' - '}</span></p>
                    <p>${getTranslation('First tournament')}: <span>29.01.2018</span></p>
                    <p>${getTranslation('Most often in')}: <span>${player.club || ' - '} (${getTranslation('tournaments')}: ${player.tournaments || ' - '})</span></p>
                    
                </div>
            </div>
            
        `;

        // <div class="player_about_wrapp">
        //         <p><span>${getTranslation('address')}: </span>${player.address[lang] || player.address['en']}</p>
        //         <p>${player.info[lang] || player.info['en']}</p>
        //     </div>
    }


    

    fetchPlayerData();



});