import { createHeader, createFooter, getAllPlayers, getAllTournaments, getAllClubs, showErrorModal, getAllCoaches, listenerOfButtons, btnGoUp, languageControl, controlTextAreaCoach, fetchCities, fetchAdvertisements, breadCrumb } from './modules.js';
// const html2canvas = require('html2canvas');
// import html2canvas from '../node_modules/html2canvas/dist/html2canvas.min.js';
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

// function checkDashboardAccess() {
//     fetch('/dashboard', {
//         method: 'GET',
//         credentials: 'include' // Включаем куки
//     })
//     .then(response => {
//         if (response.status === 401) {
//             loginForm(); // Вызываем функцию логина при отсутствии доступа
//         } else {
//             return response.json();
//         }
//     })
//     .then(data => {
//         if (data && data.message) {
//             console.log(data.message); // Обработка данных из защищенного маршрута
//         }
//     })
//     .catch(error => {
//         console.error('Error:', error);
//     });
// }
// checkDashboardAccess();

document.addEventListener('DOMContentLoaded', async function() {
    createHeader(localStorage.getItem('clientLang') || 'english');
    createFooter(localStorage.getItem('clientLang') || 'english');
    // const userId = document.querySelector('.account').dataset.userid;
    // const userType = document.querySelector('.account').dataset.usertype;
    initializeApp();

    btnGoUp();
    
    languageControl();

    breadCrumb();

    

    const topBlockAdv = document.querySelector('.player');
    fetchAdvertisements(topBlockAdv);

    listenerOfButtons();

    const editUserProfile = document.querySelector('#editUserProfile');
    editUserProfile.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = `/${lang}/dashboard/edituser/${userId}`;
    });



    const currentPath = window.location.pathname;

    const parts = currentPath.split('/');
    const lang = parts[1];
    // const playerId = localStorage.getItem('userId');
    // console.log(playerId);
    // console.log(userId);



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
            // console.log(player);
            playerCity = await getCityName(player.city);
            // console.log(playerCity);
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
                        <p>${getTranslation('Rating')}: <span style="margin-left: 5px">${player.rating || ' - '}</span> <span style="margin-left: 5px; color: ${changeRatingColor}">${changeRatingSymbol}${ratingChange}</span></p>
                        <p>${getTranslation('Coach')}: <span>${player.coach || ' - '}</span></p>
                    </div>
                    <div class="player_mainInfo_info_descr_path">
                        <p>${getTranslation('city')}: <span>${playerCity || ' - '}</span></p>
                        <p>${getTranslation('Birthday')}: <span>${formattedDate}</span></p>
                        <a class="bestVictories_table_btn share_btn" id='shareBtn' href="#">Share</a>
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
                    <div class="raitingWrapp"><span>${getTranslation('Maximum rating')}:</span> <span class="coaches_content_coach_info_rating">${player.rating}</span></div>
                </div>
                <div class="player_statistics_info_descr_path statisticsSeparateLine">
                    <p>${getTranslation('Rank')}: <span>${player.rank || ' - '}</span></p>
                    <p>${getTranslation('First tournament')}: <span>29.01.2018</span></p>
                    <p>${getTranslation('Most often in')}: <span>${player.club || ' - '} (${getTranslation('tournaments')}: ${player.tournaments || ' - '})</span></p>
                    
                </div>
            </div>
            
        `;


        function openShareModal() {
            const modal = document.getElementById('shareModal');
            modal.style.display = 'block';
            document.body.style ='overflow: hidden';
        }
        
        function closeShareModal() {
            const modal = document.getElementById('shareModal');
            modal.style.display = 'none';
            document.body.style ='overflow: auto';
        }
        
        // Закрытие модального окна при клике вне его
        document.addEventListener('click', (event) => {
            const modal = document.querySelector('#shareModal');
            if (modal && window.getComputedStyle(modal).display === 'block') {
                if (!event.target.closest('.modal-content')) {
                    closeShareModal();
                }
            }
        });
        
        // Открытие модального окна
        document.getElementById('shareBtn').addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation(); // Останавливаем распространение события
            openShareModal();
        });
        
        // Закрытие модального окна при клике на кнопку
        document.getElementById('closeModal').addEventListener('click', (e) => {
            e.preventDefault();
            closeShareModal();
        });
        
        // Предотвращение закрытия модального окна при клике внутри него
        document.querySelector('.modal-content').addEventListener('click', (e) => {
            e.stopPropagation(); // Останавливаем распространение события
        });

        //генерация изображения результатов
        function updateTemplate(player) {
            // Устанавливаем логотип игрока
            const playerLogo = document.getElementById('playerLogo');
            playerLogo.src = player.logo;
            const playerName = document.getElementById('playerName');
            playerName.innerText = player.name || player.fullname;

            const scoreBackground = document.getElementById('scoreBackground');
            const scoreBackgroundPath = document.querySelector('#scoreBackground path');
            const scoreArrow = document.getElementById('scoreArrow');
            const playerScore = document.getElementById('playerScore');

            const ratingChanges = player.rating - player.sundaysRating;
            if (ratingChanges > 0) {
                // scoreBackground.setAttribute('fill', '#007026');
                // scoreBackgroundPath.setAttribute('fill', '#007026');
                scoreBackground.style.fill = '#007026';
                scoreArrow.setAttribute('fill', '#007026');
                scoreArrow.style.transform = 'rotate(0deg)';
                playerScore.style.color = '#007026';
            } else if (ratingChanges < 0) {
                // scoreBackground.setAttribute('fill', '#D10000');
                // scoreBackgroundPath.setAttribute('fill', '#D10000');
                scoreBackground.style.fill = '#D10000';
                scoreArrow.setAttribute('fill', '#D10000');
                scoreArrow.style.transform = 'rotate(180deg)';
                playerScore.style.color = '#D10000';
            } else {
                // scoreBackground.setAttribute('fill', '#666877');
                // scoreBackgroundPath.setAttribute('fill', '#666877');
                scoreBackground.style.fill = '#666877';
                scoreArrow.setAttribute('fill', '#666877');
                scoreArrow.style.transform = 'rotate(0deg)';
                playerScore.style.color = '#666877';
            }
            // Устанавливаем очки игрока
            playerScore.textContent = `${ratingChanges}`;
        }

        

        async function generateImage() {
            const template = document.querySelector('#imageTemplate > div'); // Основной элемент
            return html2canvas(template, { useCORS: true }).then((canvas) => {
                return canvas.toDataURL('image/png'); // Получаем Base64 изображение
            });
        }

        

        // document.getElementById('shareFacebook').addEventListener('click', async () => {
            
        //     updateTemplate(player);
        //     const imageData = await generateImage();

        //     const formData = new FormData();
        //     formData.append('image', imageData.split(',')[1]); // Убираем "data:image/png;base64,"
        
        //     const response = await fetch('https://api.imgbb.com/1/upload?key=d9be0bd58fd2d169c9882686e4609e56', {
        //         method: 'POST',
        //         body: formData,
        //     });
        
        //     const data = await response.json();
        //     const imageUrl = data.data.url; // Получаем публичную ссылку
        //     console.log(imageUrl);

        //     const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(imageUrl)}&quote=${encodeURIComponent('Мой успех в настольном теннисе!')}`;

        //     // shareToFacebookWithDialog(imageData);
        //     // Переход на Facebook для публикации
        //     // const caption = 'My achievements in table tennis!';
        //     // const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(imageUrl)}&quote=${encodeURIComponent(caption)}`;
        //     window.open(shareUrl, '_blank');
        // });

        document.getElementById('shareFacebook').addEventListener('click', async () => {
            // 1. Генерация изображения с результатами
            updateTemplate(player);
            const imageData = await generateImage();
        
            // 2. Загрузка изображения на ImgBB
            const formData = new FormData();
            formData.append('image', imageData.split(',')[1]); // Убираем "data:image/png;base64,"
        
            const response = await fetch('https://api.imgbb.com/1/upload?key=d9be0bd58fd2d169c9882686e4609e56', {
                method: 'POST',
                body: formData,
            });
        
            const data = await response.json();
            console.log(data.data.url);
            const publicImageUrl = data.data.url;
        
            // 3. Определение языка пользователя
            const userLanguage = lang; // Можно определить на основе пользовательского профиля
            const name = encodeURIComponent(player.name || player.fullname);
            const ratingChange = encodeURIComponent(player.rating - player.sundaysRating);
            const image = encodeURIComponent(publicImageUrl);
            const userPageLink = encodeURIComponent(`https://asianttleague.com/en/allplayers/${player._id}`);
            // const image = publicImageUrl;
        
            const pageUrl = `https://asiantttleague.com/${userLanguage}/share/result?name=${name}&image=${encodeURIComponent(publicImageUrl)}&ratingChange=${ratingChange}&userPageLink=${userPageLink}`;
            // 4. Формирование URL динамической страницы
            // const pageUrl = `https://asianttleague.com/${userLanguage}/share/result?name=${name}&image=${image}&ratingChange=${ratingChange}&userPageLink=${userPageLink}`;
            // const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}`;
            const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}`;
            console.log(pageUrl);
            console.log(shareUrl);
            // 5. Открытие Facebook Share Dialog
            window.open(shareUrl, '_blank');
        });
        

    }


    

    fetchPlayerData();

    

    // let playerData;
    // let playerCity;
    // // let playerHand;
    // let clubData;
    // let infoBlocks = ``;

    // const translations = {
    //     'en': {
    //         'hand': 'Playing hand:',
    //         'rating': 'Rating:',
    //         'rank': 'Rank:',
    //         'birthday': 'Birth date:',
    //         'training': 'Training:',
    //         'price': 'Price:',
    //         'club': 'Club:',
    //         'city': 'City:',
    //         'hour': 'h',
    //         'about': 'About the training',
    //         'address': 'Address',
    //         'cancel': 'Cancel booking'
            
    //     },
    //     'ru': {
    //         'contacts': 'Контакты:',
    //         'rating': 'Рейтинг:',
    //         'training': 'Тренировка:',
    //         'price': 'Стоимость:',
    //         'club': 'Клуб:',
    //         'city': 'Город:',
    //         'hour': 'ч',
    //         'about': 'Подробнее о тренировке',
    //         'address': 'Адрес',
    //         'cancel': 'Отменить заявку'

    //     },
    //     'th': {
    //         'contacts': 'ติดต่อเรา:',
    //         'rating': 'คะแนน:',
    //         'training': 'เทรนกับโค้ช:',
    //         'price': 'ราคา:',
    //         'club': 'สโมสร:',
    //         'city': 'ที่อยู่:',
    //         'hour': 'h',
    //         'about': 'เกี่ยวกับการฝึกอบรม',
    //         'address': 'ที่อยู่',
    //         'cancel': 'ยกเลิกการจอง'

    //     }
    // };

    // function getTranslation(key) {
    //     return translations[lang][key] || translations['en'][key];
    // }

    // async function fetchUserData() {
    //     try {
    //         const response = await fetch(`/get-playerData?lang=${lang}&playerId=${userId}`);
    //         if (!response.ok) {
    //             throw new Error('User not found');
    //         }
            
    //         playerData = await response.json();
    //         playerCity = await getCityName(playerData.city);
    //         // coachData = await getTrainer(training.trainer._id);
    //         // clubData = await fetchClubData(training.club._id);
    //         // console.log(playerData);
    //         // console.log(playerData.city);
    //         console.log(playerCity);
    //         renderPlayerData();
    //     } catch (error) {
    //         console.error('Error fetching user data:', error);
    //     }
    // }

    // fetchUserData();
    // // console.log(playerCity);
    // // console.log(playerData.city);

    // // async function fetchClubData(clubId) {
    // //     try {
    // //         const response = await fetch(`/get-data-club?lang=${lang}&clubId=${clubId}`);
    // //         if (!response.ok) {
    // //             throw new Error('Club not found');
    // //         }
    // //         let club = await response.json();
    // //         return club
    // //         // clubCity = await getCityName(club.city);
            
    // //     } catch (error) {
    // //         console.error('Error fetching club data:', error);
    // //     }
    // // }
    

    // async function getCityName(cityId) {
    //     try {
    //         const response = await fetch(`/cities/${cityId}`);
    //         if (!response.ok) {
    //             throw new Error('City data not found');
    //         }
    //         const city = await response.json();
    //         const languageKeyMap = {
    //             'en': 'english',
    //             'ru': 'russian',
    //             'th': 'thai'
    //         };
    //         const cityKey = languageKeyMap[lang] || 'english';
            
    //         return city[cityKey] || city['english'];
    //     } catch (error) {
    //         console.error('Ошибка при получении названия города:', error);
    //         return 'Unknown City'; // Возвращение запасного значения в случае ошибки
    //     }
    // }

    // // async function getTrainer(trainerId) {
    // //     try {
    // //         const response = await fetch(`/trainer/${trainerId}`);
    // //         if (!response.ok) {
    // //             throw new Error('Trainer data not found');
    // //         }
    // //         const trainer = await response.json();

    // //         return trainer
    // //     } catch (error) {
    // //         console.error('Ошибка при получении названия города:', error);
    // //         return 'Unknown City'; // Возвращение запасного значения в случае ошибки
    // //     }
    // // }

    // function formatBirthday(dateString) {
    //     // Преобразуем строку в объект Date
    //     const date = new Date(dateString);
        
    //     // Получаем день, месяц и год
    //     const day = String(date.getDate()).padStart(2, '0');
    //     const month = String(date.getMonth() + 1).padStart(2, '0'); // Месяцы нумеруются с 0, поэтому добавляем 1
    //     const year = date.getFullYear();
        
    //     // Форматируем дату в нужный формат
    //     const formattedDate = `${day}.${month}.${year}`;
        
    //     // Вычисляем возраст
    //     const currentDate = new Date();
    //     let age = currentDate.getFullYear() - year;
        
    //     // Проверяем, прошел ли день рождения в этом году
    //     const currentMonth = currentDate.getMonth() + 1;
    //     const currentDay = currentDate.getDate();
    //     if (currentMonth < (date.getMonth() + 1) || (currentMonth === (date.getMonth() + 1) && currentDay < day)) {
    //         age--;
    //     }
        
    //     // Возвращаем форматированную строку
    //     return `${formattedDate} (${age} years)`;
    // }

    // function renderPlayerData() {
        
    //     const accountMainInfo = document.querySelector('.account_mainInfo');
    //     const formattedBirthday = formatBirthday(playerData.birthdayDate);
    //     accountMainInfo.innerHTML = '';
    //     accountMainInfo.innerHTML = `
    //         <div>
    //             <div class="account_mainInfo_logo" style="background-image: url(${playerData.logo}); background-position: 50% center; background-size: cover; background-repeat: no-repeat;"></div>
    //         </div>
            
    //         <div class="account_mainInfo_info">
    //             <div class="account_mainInfo_info_header">
    //                 <p class="account_mainInfo_info_header_name">
    //                     ${playerData.fullname}
    //                 </p>
    //             </div>
    //             <div class="account_mainInfo_info_descr">
    //                 <div class="account_mainInfo_info_descr_path">
    //                     <p>${getTranslation('hand')} <span>${playerData.hand}</span></p>
    //                     <p>${getTranslation('rating')} <span><a href="#">${playerData.rating}</a></span></p>
    //                 </div>
    //                 <div class="account_mainInfo_info_descr_path">
    //                     <p>${getTranslation('city')} <span>${playerCity}</span></p>
    //                     <p>${getTranslation('birthday')} <span>${formattedBirthday}</span></p>
    //                 </div>
    //             </div>
    //         </div>
    //     `;

    //     // const editProfile = document.getElementById('editProfile'); 
    //     // editProfile.addEventListener('click', () => {
    //     //     // document.querySelector('.training_buttonWrapp_booked').style = 'display: flex';
    //     //     // bookTrainingBtn.innerText = getTranslation('cancel');
    //     //     // доработать когда будут готовы личные кабинеты
    //     // })
        

    //     // const trainingAbout = document.querySelector('.training_about');
    
    //     // if (training.info && training.info[lang] && training.info[lang].length > 0) {
    //     //     // Формирование HTML строк для каждого блока информации
    //     //     training.info[lang].forEach(block => {
    //     //         infoBlocks += `<p>${block}</p>`;
    //     //     });
    //     // } else {
    //     //     infoBlocks = `<p>${block}</p>`;
    //     // }
    //     // trainingAbout.innerHTML = `
    //     //     <h3>${getTranslation('about')}</h3>
    //     //     <div class="training_about_wrapp">
    //     //         <p><span>${getTranslation('address')}: </span>${clubData.address[lang] || clubData.address['en']}</p>
               
    //     //         ${infoBlocks}
    //     //     </div>
    //     // `;
    //     // console.log(training);
    //     // renderMap();

    //     // style="background-image: url(&quot;/icons/playerslogo/default_avatar.svg&quot;); background-position: 50% center; background-size: cover; background-repeat: no-repeat;"

    //     // const bookedPlayersList = document.getElementById('bookedPlayersList');
    //     // bookedPlayersList.innerHTML = '';
    //     // training.players.forEach((player, index) => {
    //     //     const playerElement = document.createElement('div');
    //     //     playerElement.className = 'bookedPlayers_table_player';
    //     //     playerElement.innerHTML = `
    //     //         <div class="bookedPlayers_number">${index + 1}</div>
    //     //         <div class="cell bookedPlayers_player">
    //     //             <div class="playerLogo" style="background-image: url('${player.logo || "/icons/playerslogo/default_avatar.svg"}'); background-position: 50%; background-size: cover; background-repeat: no-repeat;"></div>
    //     //             <span>${player.name}</span>
    //     //         </div>
    //     //         <div class="cell bookedPlayers_rating">${player.rating}</div>
    //     //     `;
    //     //     bookedPlayersList.appendChild(playerElement);
    //     // });
    // }

    // getAllTournaments();




});

