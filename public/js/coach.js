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
    let clubId;
    let club;

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
            'Coach': 'Coach',
            'Training': 'Training',
            'hours': 'hours',
            'Price': 'Price',
            'club': 'Club',
            'address': 'Address',
            'aboutTraining': 'About the training',
            'scheduleBtn': 'Training schedule'
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
            'Coach': 'Тренер',
            'Training': 'Тренировка',
            'hours': 'часа',
            'Price': 'Стоимость',
            'club': 'Клуб',
            'address': 'Адресс',
            'aboutTraining': 'Подробнее о тренировке',
            'scheduleBtn': 'График тренировок'
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
            'Coach': 'โค้ช',
            'Training': 'เทรนกับโค้ช',
            'hours': 'ชั่วโมง',
            'Price': 'ราคา',
            'club': 'สโมสร',
            'address': 'ที่อยู่',
            'aboutTraining': 'เกี่ยวกับการฝึกอบรม',
            'scheduleBtn': 'Training schedule !!!!ПЕРЕВОД'
        }
    };

    function getTranslation(key) {
        return translations[lang][key] || translations['en'][key];
    }

    async function fetchCoachData() {
        try {
            const response = await fetch(`/get-data-coach?lang=${lang}&userId=${userId}`);
            if (!response.ok) {
                throw new Error('Player not found');
            }
            player = await response.json();
            // console.log(player);
            playerCity = await getCityName(player.city);
            console.log(playerCity);
            clubId = player.club;
            console.log('id клуба', clubId);
            await fetchClubData();
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

    async function fetchClubData() {
        try {
            const response = await fetch(`/get-data-club?lang=${lang}&clubId=${clubId}`);
            if (!response.ok) {
                throw new Error('Club not found');
            }
            club = await response.json();
            // clubCity = await getCityName(club.city);
            
            // await renderClubData();
        } catch (error) {
            console.error('Error fetching club data:', error);
        }
    }


    fetchCoachData();

    function renderPlayerData() {
        const playerMainInfo = document.querySelector('.player_mainInfo');
        const currentRating = player.rating;
        const sundayRating = player.sundaysRating;
        const ratingChange = currentRating - sundayRating;
        let changeRatingColor;
        let changeRatingSymbol;

        if (ratingChange > 0) {
            changeRatingColor = '#007026';  // Рейтинг увеличился
            changeRatingSymbol = '+';
        } else if (ratingChange < 0) {
            changeRatingColor = '#ff0000c7';    // Рейтинг уменьшился
            changeRatingSymbol = '';
        } else {
            changeRatingColor = '#adadada1';   // Рейтинг не изменился
            changeRatingSymbol = '+';
        } 
        // console.log(playerMainInfo);
        playerMainInfo.innerHTML = `
            <div class="player_mainInfo_logo" style="background-image: url(${player.logo || 'icons/playerslogo/default_avatar.svg'}); background-position: 50% center; background-size: cover; background-repeat: no-repeat;"></div>
            <div class="player_mainInfo_info">
                <div class="player_mainInfo_info_name">
                    ${player.name || player.fullname}
                </div>
                <div class="player_mainInfo_info_descr">
                    <div class="player_mainInfo_info_descr_path">
                        <p>${getTranslation('Playing hand')}: <span>${getTranslation(player.hand)}</span></p>
                        <p>${getTranslation('Rating')}: <span style="margin-left: 5px">${Math.round(player.rating) || ' - '}</span> <span style="margin-left: 5px; color: ${changeRatingColor}">${changeRatingSymbol || ''}${ratingChange.toFixed(1) || ''}</span></p>
                        <p>${getTranslation('Training')}: <span>${player.trainingDuration / 60 || ' - '} ${getTranslation('hours')}</span></p>
                    </div>
                    <div class="player_mainInfo_info_descr_path">
                        <p>${getTranslation('Price')}: <span>${player.oneTrainingPrice || '-'}฿</span></p>
                        <p>${getTranslation('club')}: <a style='color: #fff; text-decoration: none;' href="/${lang}/allClubs/${clubId}">${club.name || '-'}</a></p>
                        <p>${getTranslation('city')}: <span>${playerCity || '-'}</span></p>
                        
                    </div>
                </div>
            </div>
        `;
        console.log(club);

        const playerAbout = document.querySelector('.player_about');
        // console.log(playerAbout);
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

        let infoBlocks = ''
        const trainingAbout = document.querySelector('.training_about');
        if (player.trainingInfo && player.trainingInfo[lang] && player.trainingInfo[lang].length > 0) {
            // Формирование HTML строк для каждого блока информации
            // console.log(lang);
            // player.trainingInfo[lang].forEach(block => {
            //     infoBlocks += `<p>${block}</p>`;
            // });
        // } 
        // else {
        //     infoBlocks = `<p>${block}</p>`;
        //     // infoBlocks = `<p>нет данных</p>`;
        // }
        // const text = player.trainingInfo[lang];
        // console.log()
        // const formattedText = text.replace(/\r\n|\n/g, '<br>');

        const description = player.trainingInfo[lang] || '';
        // console.log(description);
        const formattedDescription = typeof description === 'string' ? description.replace(/\r\n/g, '<br>') : 'Описание отсутствует';
        
        trainingAbout.innerHTML = `
            <h3>${getTranslation('aboutTraining')}</h3>
            <div class="training_about_wrapp">
                <p><span>${getTranslation('address')}: </span>${club.address[lang] || club.address['en']}</p>
               
                <p>${formattedDescription}</p>
            </div>
        `;
        }

        const linkToSchedule = document.querySelector('#goToTrainingSchedule');
        linkToSchedule.innerHTML = `${getTranslation('scheduleBtn')}`;
        // linkToSchedule.setAttribute('data-club', `${club._id}`);

        linkToSchedule.addEventListener('click', () => {
            window.location = `/${lang}/allclubs/${club._id}`;
        })


        renderMap();

        const playerStatistics = document.querySelector('.player_statistics');
        playerStatistics.innerHTML = `
            <div class="player_statistics_info_descr">
                <div class="player_statistics_info_descr_path">
                    <p>${getTranslation('Tournaments played')}: <span>${player.tournaments || ' - '}</span></p>
                    <p>${getTranslation('Games')}: <span>323 (258 / 65)</span></p>
                    <div class="raitingWrapp"><span>${getTranslation('Maximum rating')}:</span> <span class="coaches_content_coach_info_rating">${Math.round(player.rating) || ' - '}</span></div>
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

    
});