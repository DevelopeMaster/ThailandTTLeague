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




    // const currentPath = window.location.pathname;

    // const parts = currentPath.split('/');
    // const lang = parts[1];
    // const clubId = parts[3];

    // let club;
    // let clubCity;

    // async function fetchClubData() {
    //     try {
    //         const response = await fetch(`/get-data-club?lang=${lang}&clubId=${clubId}`);
    //         if (!response.ok) {
    //             throw new Error('Club not found');
    //         }
    //         club = await response.json();
    //         clubCity = await getCityName(club.city);
    //         renderClubData();
    //     } catch (error) {
    //         console.error('Error fetching club data:', error);
    //     }
    // }

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

    // function renderClubData() {
    //     const clubMainInfo = document.querySelector('.club_mainInfo');
    //     clubMainInfo.innerHTML = `
    //         <div class="club_mainInfo_logo" style="background-image: url(${club.logo}); background-position: 50% center; background-size: cover; background-repeat: no-repeat;"></div>
    //         <div class="club_mainInfo_info">
    //             <div class="club_mainInfo_info_name">
    //                 ${club.name}
    //             </div>
    //             <div class="club_mainInfo_info_descr">
    //                 <div class="club_mainInfo_info_descr_path">
    //                     <p>Representative: <span>${club.representative[lang] || club.representative['en']}</span></p>
    //                     <p>Website: <span><a href="${club.website}">${club.website}</a></span></p>
    //                     <p>Working hours: <span>${club.workingHours}</span></p>
    //                 </div>
    //                 <div class="club_mainInfo_info_descr_path">
    //                     <p>City: <span>${clubCity}</span></p>
    //                     <p>Contacts: <span><a href="tel:${club.phoneNumber}">${club.phoneNumber}</a></span></p>
    //                     <p>Number of tables: <span>${club.tables}</span></p>
    //                 </div>
    //             </div>
    //         </div>
    //     `;

    //     const clubAbout = document.querySelector('.club_about');
    //     clubAbout.innerHTML = `
    //         <h3>About the club</h3>
    //         <div class="club_about_wrapp">
    //             <p><span>Address: </span>${club.address[lang] || club.address['en']}</p>
    //             <p>${club.info[lang] || club.info['en']}</p>
    //         </div>
    //     `;

    //     renderMap();
    //     renderPhotos();
    // }

    // function renderMap() {
    //     const mapElement = document.getElementById('map');
    //     if (!mapElement) return;

    //     const map = L.map('map').setView([club.location[0], club.location[1]], 15);

    //     L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    //         attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    //     }).addTo(map);

    //     L.marker([club.location[0], club.location[1]]).addTo(map)
    //         .bindPopup(`${club.address[lang] || club.address['en']}`)
    //         .openPopup();
    // }

    // function renderPhotos() {
    //     const photoContainer = document.querySelector('#clubsPhotoContainer');
    //     const photos = club.photos;
    //     if (photos) {
    //         photos.forEach(item => {
    //             const photo = document.createElement('div');
    //             photo.classList.add('clubPhotos_item');
    //             photo.style = `background-image: url(${item}); background-position: 50% center; background-size: cover; background-repeat: no-repeat;`;
    //             photoContainer.appendChild(photo);
    //         });
    //     }
    // }

    // fetchClubData();


    const currentPath = window.location.pathname;

    const parts = currentPath.split('/');
    const lang = parts[1];
    const clubId = parts[3];

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
            'address': 'Address'
        },
        'ru': {
            'representative': 'Представитель',
            'website': 'Веб-сайт',
            'workingHours': 'Часы работы',
            'city': 'Город',
            'contacts': 'Контакты',
            'tables': 'Количество столов',
            'about': 'О клубе',
            'address': 'Адрес'
        },
        'th': {
            'representative': 'ตัวแทน',
            'website': 'เว็บไซต์',
            'workingHours': 'ชั่วโมงทำงาน:',
            'city': 'ที่อยู่',
            'contacts': 'ติดต่อเรา',
            'tables': 'จำนวนโต๊ะ',
            'about': 'เกี่ยวกับสโมสร',
            'address': 'ที่อยู่'
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
            renderClubData();
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
        const clubMainInfo = document.querySelector('.club_mainInfo');
        clubMainInfo.innerHTML = `
            <div class="club_mainInfo_logo" style="background-image: url(${club.logo}); background-position: 50% center; background-size: cover; background-repeat: no-repeat;"></div>
            <div class="club_mainInfo_info">
                <div class="club_mainInfo_info_name">
                    ${club.name}
                </div>
                <div class="club_mainInfo_info_descr">
                    <div class="club_mainInfo_info_descr_path">
                        <p>${getTranslation('representative')}: <span>${club.representative[lang] || club.representative['en']}</span></p>
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
                <p>${club.info[lang] || club.info['en']}</p>
            </div>
        `;

        renderMap();
        renderPhotos();
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