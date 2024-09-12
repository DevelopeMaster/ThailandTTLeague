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
            'Free': 'Free'
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
            'Free': 'Бесплатные'
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
            'Free': 'ฟรี'
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

    const editClubProfile = document.querySelector('#editClubProfile');
    editClubProfile.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = `/${lang}/dashboard/editclub/${clubId}`;
    });
    
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
            supplementsName.innerText =  `${getTranslation('Extra charge')}: `;
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
                <p>${nl2br(club.info[lang]) || nl2br(club.info['en'])}</p>
            </div>
        `;
        
        renderMap();
        renderPhotos();  //  жду дизайн
    }

    function nl2br(str) {
        return str.replace(/\n/g, '<br>');
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





});