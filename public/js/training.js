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
    initializeApp();

    btnGoUp();
    
    languageControl();

    breadCrumb();

    const topBlockAdv = document.querySelector('.training');
    fetchAdvertisements(topBlockAdv);

    listenerOfButtons();

    
    const currentPath = window.location.pathname;

    const parts = currentPath.split('/');
    const lang = parts[1];
    const trainingId = parts[3];

    let training;
    let trainingCity;
    let coachData;
    let clubData;
    let infoBlocks = ``;

    const translations = {
        'en': {
            'contacts': 'Contacts:',
            'rating': 'Rating:',
            'training': 'Training:',
            'price': 'Price:',
            'club': 'Club:',
            'city': 'City:',
            'hour': 'h',
            'about': 'About the training',
            'address': 'Address',
            'cancel': 'Cancel booking',
            'finished': 'Training has finished',
            'viewAll': 'View other trainings'
            
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
            'cancel': 'Отменить заявку',
            'finished': 'Тренировка завершена',
            'viewAll': 'Смотреть другие тренировки'

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
            'cancel': 'ยกเลิกการจอง',
            'finished': 'การฝึกอบรมเสร็จสิ้นแล้ว',
            'viewAll': 'ดูการอบรมอื่นๆ'

        }
    };

    function getTranslation(key) {
        return translations[lang][key] || translations['en'][key];
    }

    async function fetchTrainingData() {
        try {
            const response = await fetch(`/get-data-training?lang=${lang}&trainingId=${trainingId}`);
            if (!response.ok) {
                throw new Error('Training not found');
            }
            training = await response.json();
            trainingCity = await getCityName(training.city._id);
            coachData = await getTrainer(training.trainer._id);
            clubData = await fetchClubData(training.club._id);
            renderTrainingData();
        } catch (error) {
            console.error('Error fetching training data:', error);
        }
    }

    
    async function fetchClubData(clubId) {
        try {
            const response = await fetch(`/get-data-club?lang=${lang}&clubId=${clubId}`);
            if (!response.ok) {
                throw new Error('Club not found');
            }
            let club = await response.json();
            return club
            // clubCity = await getCityName(club.city);
            
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
            // console.log(city[cityKey]);
            return city[cityKey] || city['english'];
        } catch (error) {
            console.error('Ошибка при получении названия города:', error);
            return 'Unknown City'; // Возвращение запасного значения в случае ошибки
        }
    }

    async function getTrainer(trainerId) {
        try {
            const response = await fetch(`/trainer/${trainerId}`);
            if (!response.ok) {
                throw new Error('Trainer data not found');
            }
            const trainer = await response.json();

            return trainer
        } catch (error) {
            console.error('Ошибка при получении названия города:', error);
            return 'Unknown City'; // Возвращение запасного значения в случае ошибки
        }
    }

    function renderTrainingData() {
        // console.log(training);
        const trainingDate = new Date(training.date.toLocaleString());
        
        // const dayOfWeek = trainingDate.toLocaleDateString(lang, { weekday: 'long' });

        // const trainingTime = trainingDate.toLocaleTimeString(lang, {
        //     hour: '2-digit',
        //     minute: '2-digit',
        //     hour12: false,
        //     timeZone: 'UTC'
        // });

        const dayOfWeek = new Intl.DateTimeFormat(lang, { weekday: 'long' }).format(trainingDate);

        const trainingTime = new Intl.DateTimeFormat(lang, {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        }).format(trainingDate);

        const formattedDate = `${dayOfWeek} ${String(trainingDate.getDate()).padStart(2, '0')}.${String(trainingDate.getMonth() + 1).padStart(2, '0')} ${trainingTime}`;
        
        const now = new Date();
        const trainingEndDate = new Date(trainingDate.getTime() + training.duration * 60000);

        // Приведение времени тренировки к локальному времени
        const localTrainingEndDate = new Date(trainingEndDate.toLocaleString());
        const localNow = new Date(now.toLocaleString());

        const isPast = localNow > localTrainingEndDate;
        
        
        console.log(localTrainingEndDate);
        console.log(localNow);
        // console.log(trainingDate.getTime() + training.duration * 60000);

        if (isPast) {
            const trainingStatus = document.querySelector('.trainingStatus');
            trainingStatus.classList.add('statusFinished');
            const trainingStatusMassage = document.createElement('h5');
            trainingStatusMassage.innerText = `${getTranslation('finished')}`;
            trainingStatus.appendChild(trainingStatusMassage);
        }
        

        const clubMainInfo = document.querySelector('.training_mainInfo');
        // console.log(clubMainInfo);
        clubMainInfo.innerHTML = '';
        clubMainInfo.innerHTML = `
            <div>
                <div class="training_mainInfo_logo" style="background-image: url(${coachData.logo}); background-position: 50% center; background-size: cover; background-repeat: no-repeat;"></div>
            </div>
            
            <div class="training_mainInfo_info">
                <div class="training_mainInfo_info_header">
                            <p class="training_mainInfo_info_header_name">
                                ${coachData.name}
                            </p>
                            <p class="training_mainInfo_info_header_date">
                                ${formattedDate}
                            </p>
                        </div>
                
                <div class="training_mainInfo_info_descr">
                    <div class="training_mainInfo_info_descr_path">
                        <p>${getTranslation('contacts')} <span>${coachData.phoneNumber}</span></p>
                        <p>${getTranslation('rating')} <span><a href="#">${coachData.rating}</a></span></p>
                        <p>${getTranslation('training')} <span>${training.duration / 60}${getTranslation('hour')}</span></p>
                    </div>
                    <div class="training_mainInfo_info_descr_path">
                        <p class='trainingPrice'>${getTranslation('price')} <span>${training.price}฿</span></p>
                        <p>${getTranslation('club')} <span>${training.club.name}</span></p>
                        <p>${getTranslation('city')} <span>${trainingCity}</span></p>
                        
                    </div>
                </div>
            </div>
        `;

        if (isPast) {
            const btnsWrapper = document.querySelector('.training_buttonWrapp');
            const signUpBtn = document.querySelector('#signUpToTraining');
            signUpBtn.style.display = 'none';
            const information = document.querySelector('.training_buttonWrapp_booked');
            information.style.display = 'none';
            const linkToAllTraining = document.createElement('a');
            linkToAllTraining.setAttribute('href', `/${lang}/trainings`);
            linkToAllTraining.textContent = `${getTranslation('viewAll')}`;
            btnsWrapper.appendChild(linkToAllTraining);
        } else {
            const bookTrainingBtn = document.getElementById('signUpToTraining'); 
            bookTrainingBtn.addEventListener('click', () => {
                document.querySelector('.training_buttonWrapp_booked').style = 'display: flex';
                bookTrainingBtn.innerText = getTranslation('cancel');
            });
        }
        
        // доработать когда будут готовы личные кабинеты

        const trainingAbout = document.querySelector('.training_about');
    
        if (training.info && training.info[lang] && training.info[lang].length > 0) {
            // Формирование HTML строк для каждого блока информации
            training.info[lang].forEach(block => {
                infoBlocks += `<p>${block}</p>`;
            });
        } else {
            infoBlocks = `<p>${block}</p>`;
        }
        trainingAbout.innerHTML = `
            <h3>${getTranslation('about')}</h3>
            <div class="training_about_wrapp">
                <p><span>${getTranslation('address')}: </span>${clubData.address[lang] || clubData.address['en']}</p>
               
                ${infoBlocks}
            </div>
        `;
        // console.log(training);
        renderMap();

        // style="background-image: url(&quot;/icons/playerslogo/default_avatar.svg&quot;); background-position: 50% center; background-size: cover; background-repeat: no-repeat;"

        const bookedPlayersList = document.getElementById('bookedPlayersList');
        bookedPlayersList.innerHTML = '';
        training.players.forEach((player, index) => {
            const playerElement = document.createElement('div');
            playerElement.className = 'bookedPlayers_table_player';
            playerElement.innerHTML = `
                <div class="bookedPlayers_number">${index + 1}</div>
                <div class="cell bookedPlayers_player">
                    <div class="playerLogo" style="background-image: url('${player.logo || "/icons/playerslogo/default_avatar.svg"}'); background-position: 50%; background-size: cover; background-repeat: no-repeat;"></div>
                    <span>${player.name}</span>
                </div>
                <div class="cell bookedPlayers_rating">${Math.round(player.rating)}</div>
            `;
            bookedPlayersList.appendChild(playerElement);
        });
    }

    function renderMap() {
        const mapElement = document.getElementById('map');
        if (!mapElement) return;

        const map = L.map('map').setView([clubData.location[0], clubData.location[1]], 15);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        L.marker([clubData.location[0], clubData.location[1]]).addTo(map)
            .bindPopup(`${clubData.address[lang] || clubData.address['en']}`)
            .openPopup();
    }

    

    fetchTrainingData();



    














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