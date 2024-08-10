import { createHeader, createFooter, getAllPlayers, getAllTournaments, getAllClubs, showErrorModal, getAllCoaches, listenerOfButtons, btnGoUp, languageControl, controlTextAreaCoach, fetchCities, fetchAdvertisements, breadCrumb } from './modules.js';
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
    initializeApp();

    btnGoUp();
    
    languageControl();

    breadCrumb();

    

    const topBlockAdv = document.querySelector('.account');
    fetchAdvertisements(topBlockAdv);

    listenerOfButtons();




    const currentPath = window.location.pathname;

    const parts = currentPath.split('/');
    const lang = parts[1];
    const playerId = localStorage.getItem('userId');
    console.log(playerId);

    let playerData;
    let playerCity;
    // let playerHand;
    let clubData;
    let infoBlocks = ``;

    const translations = {
        'en': {
            'hand': 'Playing hand:',
            'rating': 'Rating:',
            'rank': 'Rank:',
            'birthday': 'Birth date:',
            'training': 'Training:',
            'price': 'Price:',
            'club': 'Club:',
            'city': 'City:',
            'hour': 'h',
            'about': 'About the training',
            'address': 'Address',
            'cancel': 'Cancel booking'
            
        },
        'ru': {
            'contacts': 'Контакты:',
            'rating': 'Рейтинг:',
            'training': 'Тренировка:',
            'price': 'Стоимость:',
            'club': 'Клуб:',
            'city': 'Город:',
            'hour': 'ч',
            'about': 'Подробнее о тренировке',
            'address': 'Адрес',
            'cancel': 'Отменить заявку'

        },
        'th': {
            'contacts': 'ติดต่อเรา:',
            'rating': 'คะแนน:',
            'training': 'เทรนกับโค้ช:',
            'price': 'ราคา:',
            'club': 'สโมสร:',
            'city': 'ที่อยู่:',
            'hour': 'h',
            'about': 'เกี่ยวกับการฝึกอบรม',
            'address': 'ที่อยู่',
            'cancel': 'ยกเลิกการจอง'

        }
    };

    function getTranslation(key) {
        return translations[lang][key] || translations['en'][key];
    }

    async function fetchUserData() {
        try {
            const response = await fetch(`/get-playerData?lang=${lang}&playerId=${playerId}`);
            if (!response.ok) {
                throw new Error('User not found');
            }
            
            playerData = await response.json();
            playerCity = await getCityName(playerData.city);
            // coachData = await getTrainer(training.trainer._id);
            // clubData = await fetchClubData(training.club._id);
            // console.log(playerData);
            // console.log(playerData.city);
            console.log(playerCity);
            renderPlayerData();
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    }

    fetchUserData();
    // console.log(playerCity);
    // console.log(playerData.city);

    // async function fetchClubData(clubId) {
    //     try {
    //         const response = await fetch(`/get-data-club?lang=${lang}&clubId=${clubId}`);
    //         if (!response.ok) {
    //             throw new Error('Club not found');
    //         }
    //         let club = await response.json();
    //         return club
    //         // clubCity = await getCityName(club.city);
            
    //     } catch (error) {
    //         console.error('Error fetching club data:', error);
    //     }
    // }
    

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

    // async function getTrainer(trainerId) {
    //     try {
    //         const response = await fetch(`/trainer/${trainerId}`);
    //         if (!response.ok) {
    //             throw new Error('Trainer data not found');
    //         }
    //         const trainer = await response.json();

    //         return trainer
    //     } catch (error) {
    //         console.error('Ошибка при получении названия города:', error);
    //         return 'Unknown City'; // Возвращение запасного значения в случае ошибки
    //     }
    // }

    function formatBirthday(dateString) {
        // Преобразуем строку в объект Date
        const date = new Date(dateString);
        
        // Получаем день, месяц и год
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Месяцы нумеруются с 0, поэтому добавляем 1
        const year = date.getFullYear();
        
        // Форматируем дату в нужный формат
        const formattedDate = `${day}.${month}.${year}`;
        
        // Вычисляем возраст
        const currentDate = new Date();
        let age = currentDate.getFullYear() - year;
        
        // Проверяем, прошел ли день рождения в этом году
        const currentMonth = currentDate.getMonth() + 1;
        const currentDay = currentDate.getDate();
        if (currentMonth < (date.getMonth() + 1) || (currentMonth === (date.getMonth() + 1) && currentDay < day)) {
            age--;
        }
        
        // Возвращаем форматированную строку
        return `${formattedDate} (${age} years)`;
    }

    function renderPlayerData() {
        
        const accountMainInfo = document.querySelector('.account_mainInfo');
        const formattedBirthday = formatBirthday(playerData.birthdayDate);
        accountMainInfo.innerHTML = '';
        accountMainInfo.innerHTML = `
            <div>
                <div class="account_mainInfo_logo" style="background-image: url(${playerData.logo}); background-position: 50% center; background-size: cover; background-repeat: no-repeat;"></div>
            </div>
            
            <div class="account_mainInfo_info">
                <div class="account_mainInfo_info_header">
                    <p class="account_mainInfo_info_header_name">
                        ${playerData.fullname}
                    </p>
                </div>
                <div class="account_mainInfo_info_descr">
                    <div class="account_mainInfo_info_descr_path">
                        <p>${getTranslation('hand')} <span>${playerData.hand}</span></p>
                        <p>${getTranslation('rating')} <span><a href="#">${playerData.rating}</a></span></p>
                    </div>
                    <div class="account_mainInfo_info_descr_path">
                        <p>${getTranslation('city')} <span>${playerCity}</span></p>
                        <p>${getTranslation('birthday')} <span>${formattedBirthday}</span></p>
                    </div>
                </div>
            </div>
        `;

        const editProfile = document.getElementById('editProfile'); 
        editProfile.addEventListener('click', () => {
            // document.querySelector('.training_buttonWrapp_booked').style = 'display: flex';
            // bookTrainingBtn.innerText = getTranslation('cancel');
            // доработать когда будут готовы личные кабинеты
        })
        

        // const trainingAbout = document.querySelector('.training_about');
    
        // if (training.info && training.info[lang] && training.info[lang].length > 0) {
        //     // Формирование HTML строк для каждого блока информации
        //     training.info[lang].forEach(block => {
        //         infoBlocks += `<p>${block}</p>`;
        //     });
        // } else {
        //     infoBlocks = `<p>${block}</p>`;
        // }
        // trainingAbout.innerHTML = `
        //     <h3>${getTranslation('about')}</h3>
        //     <div class="training_about_wrapp">
        //         <p><span>${getTranslation('address')}: </span>${clubData.address[lang] || clubData.address['en']}</p>
               
        //         ${infoBlocks}
        //     </div>
        // `;
        // console.log(training);
        // renderMap();

        // style="background-image: url(&quot;/icons/playerslogo/default_avatar.svg&quot;); background-position: 50% center; background-size: cover; background-repeat: no-repeat;"

        // const bookedPlayersList = document.getElementById('bookedPlayersList');
        // bookedPlayersList.innerHTML = '';
        // training.players.forEach((player, index) => {
        //     const playerElement = document.createElement('div');
        //     playerElement.className = 'bookedPlayers_table_player';
        //     playerElement.innerHTML = `
        //         <div class="bookedPlayers_number">${index + 1}</div>
        //         <div class="cell bookedPlayers_player">
        //             <div class="playerLogo" style="background-image: url('${player.logo || "/icons/playerslogo/default_avatar.svg"}'); background-position: 50%; background-size: cover; background-repeat: no-repeat;"></div>
        //             <span>${player.name}</span>
        //         </div>
        //         <div class="cell bookedPlayers_rating">${player.rating}</div>
        //     `;
        //     bookedPlayersList.appendChild(playerElement);
        // });
    }




    // getAllPlayers();
    // getAllTournaments();

});

