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

// let citiesList = [];

// async function getCities(curLang) {
//     try {
//         const response = await fetch(`/cities?language=${curLang}`);
//         const cities = await response.json();
//         citiesList = cities.sort();
//     } catch (error) {
//         console.error('Произошла ошибка:', error);
//     }
// };

document.addEventListener("DOMContentLoaded", async function() {
    createHeader(localStorage.getItem('clientLang') || 'english');
    createFooter(localStorage.getItem('clientLang') || 'english');
    initializeApp();

    btnGoUp();
    
    languageControl();

    breadCrumb();

    const topBlockAdv = document.querySelector('#editClubForm');
    fetchAdvertisements(topBlockAdv);

    listenerOfButtons();
    

    const currentPath = window.location.pathname;

    const parts = currentPath.split('/');
    const lang = parts[1];
    // const clubId = parts[3];

    // const club = JSON.parse(document.getElementById('clubData').textContent);
    const userId = document.querySelector('.club').dataset.userid;
    let clubdata;
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
            'File too large': 'The file is too large. Maximum size: 1 MB',
            'Not image': 'Please select a valid image file.',
            'daysOfWeek': ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
            'session': 'Session',
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
            'File too large': 'Файл слишком большой. Максимальный размер: 1 MB',
            'Not image': 'Пожалуйста, выберите корректный файл изображения.',
            'daysOfWeek': ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
            'session': 'Сессия',
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
            'File too large': 'ไฟล์มีขนาดใหญ่เกินไป ขนาดสูงสุด: 1 MB',
            'Not image': 'กรุณาเลือกไฟล์รูปภาพที่ถูกต้อง',
            'daysOfWeek': ['อาทิตย์', 'จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์'],
            'session': 'ช่วง',
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

    await fetchClubData();

    console.log(clubdata);
    const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1 МБ
    const DEFAULT_CLUB_PHOTO = '/icons/defaultClubPicture.svg';
    const DEFAULT_PLAYER_LOGO = '/icons/clubslogo/default_avatar.svg';

    // Функция для проверки файла
    function validateFile(file) {
        if (!file) {
            return false;
        }
        if (!file.type.startsWith('image/')) {
            showErrorModal(getTranslation('Not image'));
            return false;
        }
        if (file.size > MAX_FILE_SIZE) {
            showErrorModal(getTranslation('File too large'));
            return false;
        }
        return true;
    }

    // Функция для предпросмотра изображения
    window.previewImage = function (fileInput, previewElement) {
        const file = fileInput.files[0];
        if (validateFile(file)) {
            const reader = new FileReader();
            reader.onload = function (e) {
                previewElement.setAttribute('src', e.target.result);
            };
            reader.readAsDataURL(file);
        } else {
            fileInput.value = ''; // Сброс значения
        }
    };

    // Логотип клуба
    document.getElementById('logoInput').addEventListener('change', function (event) {
        const logoPreview = document.getElementById('clubLogo');
        previewImage(event.target, logoPreview, (error) => {
            showErrorModal(error);
        });
    });

    // Фотографии клуба
    for (let i = 1; i <= 4; i++) {
        const fileInput = document.getElementById(`photoInput${i}`);
        const preview = document.getElementById(`preview${i}`);

        fileInput.addEventListener('change', function (event) {
            previewImage(event.target, preview, (error) => {
                showErrorModal(error);
            });
        });
    }
    // for (let i = 1; i <= 4; i++) {
    //     document.getElementById(`photoInput${i}`).addEventListener('change', function(event) {
    //         const file = event.target.files[0];
    //         if (file && file.size > 1 * 1024 * 1024) { // 1 MB = 1 * 1024 * 1024 bytes
    //             showErrorModal(`${getTranslation('File too large')}`);
    //             event.target.value = ''; // Сбрасываем выбор файла
    //         }
    //     });
    // }

    // Удаление фотографий клуба
    window.removePhoto = function (index, event) {
        event.stopPropagation();
        const preview = document.getElementById(`preview${index}`);
        const fileInput = document.getElementById(`photoInput${index}`);
        preview.setAttribute('src', DEFAULT_CLUB_PHOTO);
        fileInput.value = ''; // Очистка input
    };

    if (clubdata) {
        document.getElementById('clubName').value = clubdata.name || '';
        document.getElementById('city').value = clubCity || '';
        document.getElementById('address').value = clubdata.address[lang] || '';
        document.getElementById('location').value = clubdata.location?.join(', ') || '';
        document.getElementById('workingHours').value = clubdata.workingHours || '';
        document.getElementById('numberOfTables').value = clubdata.tables || '';
        document.getElementById('representative').value = clubdata.representative || '';
        document.getElementById('phoneNumber').value = clubdata.phoneNumber || '';
        document.getElementById('website').value = clubdata.website || '';
        document.getElementById('description').value = clubdata.info[lang] || '';
        document.getElementById('clubLogo').src = clubdata.logo || DEFAULT_PLAYER_LOGO;
    
        // Установка бесплатных и платных услуг
        clubdata.supplements.free.forEach(service => {
            const checkbox = document.querySelector(`.freeServices input[value="${service}"]`);
            if (checkbox) checkbox.checked = true;
        });
    
        clubdata.supplements.paid.forEach(service => {
            const checkbox = document.querySelector(`.paidServices input[value="${service}"]`);
            if (checkbox) checkbox.checked = true;
        });
    
        // Установка фотографий
        if (Array.isArray(clubdata.photos)) {
            clubdata.photos.forEach((photo, index) => {
                if (index < 4) {
                    const preview = document.getElementById(`preview${index + 1}`);
                    if (preview) preview.src = photo;
                }
            });
        }
    } else {
        console.error('Club data is undefined.');
    }
    // if (clubdata) {
    //     document.getElementById('clubName').value = clubdata.name || '';
    //     document.getElementById('city').value = clubCity || '';
    //     document.getElementById('address').value = clubdata.address[lang] || '';
    //     document.getElementById('location').value = clubdata.location.join(', ') || '';
    //     document.getElementById('workingHours').value = clubdata.workingHours || '';
    //     document.getElementById('numberOfTables').value = clubdata.tables || '';
    //     document.getElementById('representative').value = clubdata.representative || '';
    //     document.getElementById('phoneNumber').value = clubdata.phoneNumber || '';
    //     document.getElementById('website').value = clubdata.website || '';
    //     // document.getElementById('freeServices').value = clubdata.freeServices || '';
    //     // document.getElementById('paidServices').value = clubdata.paidServices || '';
    //     document.getElementById('description').value = clubdata.info[lang] || '';
    //     document.getElementById('clubLogo').src = clubdata.logo || '/icons/playerslogo/default_avatar.svg';


    //     const logoInput = document.getElementById('logoInput');
    //     const logoPreview = document.getElementById('clubLogo');

    //     // Обработчик события для изменения файла
    //     // logoInput.addEventListener('change', function(event) {
    //     //     const file = event.target.files[0];
            
    //     //     // Проверяем, выбран ли файл и является ли он изображением
    //     //     if (file && file.type.startsWith('image/')) {
    //     //         const reader = new FileReader();
                
    //     //         reader.onload = function(e) {
    //     //             // Устанавливаем новый src для логотипа-превью
    //     //             logoPreview.src = e.target.result;
    //     //         };

    //     //         // Читаем файл как Data URL
    //     //         reader.readAsDataURL(file);
    //     //     } else {
    //     //         alert('Please select a valid image file.');
    //     //     }
    //     // });

    //     logoInput.addEventListener('change', function(event) {
    //         const file = event.target.files[0];
        
    //         // Проверяем, выбран ли файл и является ли он изображением
    //         if (file && file.type.startsWith('image/')) {
    //             if (file.size > 1 * 1024 * 1024) {
    //                 showErrorModal(`${getTranslation('File too large')}`);
    //                 logoInput.value = ''; 
    //                 return;
    //             }
        
    //             const reader = new FileReader();
        
    //             reader.onload = function(e) {
    //                 logoPreview.src = e.target.result;
    //             };
        
    //             reader.readAsDataURL(file);
    //         } else {
    //             showErrorModal(`${getTranslation('Not image')}`);
    //             logoInput.value = '';
    //         }
    //     });
        
    //     clubdata.supplements.free.forEach(service => {
    //         const checkbox = document.querySelector(`.freeServices input[value="${service}"]`);
    //         if (checkbox) {
    //             checkbox.checked = true;
    //         }
    //     });

    //     clubdata.supplements.paid.forEach(service => {
    //         const checkbox = document.querySelector(`.paidServices input[value="${service}"]`);
    //         if (checkbox) {
    //             checkbox.checked = true;
    //         }
    //     });

    //     if (clubdata.photos && Array.isArray(clubdata.photos)) {
    //         clubdata.photos.forEach((photo, index) => {
    //             if (index < 4) { // Учитываем, что у нас только 4 миниатюры
    //                 const preview = document.getElementById(`preview${index + 1}`);
    //                 if (preview) {
    //                     preview.src = photo; // Устанавливаем URL фотографии
    //                 }
    //             }
    //         });
    //     }
    // } else {
    //     console.error('Club data is undefined.');
    // }

    window.triggerFileInput = function(index) {
        document.getElementById(`photoInput${index}`).click();
    }

    // // Функция для удаления фотографии и установки дефолтной картинки
    // window.removePhoto = function(index, event) {
    //     event.stopPropagation(); // Предотвращаем открытие проводника при удалении фото

    //     const preview = document.getElementById(`preview${index}`);
    //     const defaultImage = '/icons/defaultClubPicture.svg'; 

    //     // Устанавливаем дефолтное изображение
    //     preview.setAttribute('src', defaultImage);

    //     // Очищаем значение input
    //     document.getElementById(`photoInput${index}`).value = '';
    // }

    // // Функция для изменения изображения при выборе файла
    // window.previewPhoto = function(index) {
    //     const fileInput = document.getElementById(`photoInput${index}`);
    //     const preview = document.getElementById(`preview${index}`);
    //     const file = fileInput.files[0];
    
    //     if (file) {
    //         // Проверяем, является ли файл изображением
    //         if (file.type.startsWith('image/')) {
    //             // Проверка размера файла
    //             if (file.size > 1 * 1024 * 1024) { 
    //                 showErrorModal(`${getTranslation('File too large')}`);
    //                 fileInput.value = '';
    //                 return;
    //             }
                
    //             const reader = new FileReader();
    
    //             reader.onload = function(e) {
    //                 preview.setAttribute('src', e.target.result);
    //             };
    
    //             reader.readAsDataURL(file);
    //         } else {
    //             showErrorModal(`${getTranslation('Not image')}`);
    //             fileInput.value = '';
    //             // preview.setAttribute('src', ''); // Очистить превью
    //         }
    //     }
    // };

    // window.previewPhoto = function(index) {
    //     const fileInput = document.getElementById(`photoInput${index}`);
    //     const preview = document.getElementById(`preview${index}`);
    //     const file = fileInput.files[0];
    
    //     if (file) {
    //         // Проверка размера файла
    //         if (file.size > 1 * 1024 * 1024) { // 1 MB = 1 * 1024 * 1024 bytes
    //             showErrorModal(`${getTranslation('File too large')}`);
    //             fileInput.value = ''; // Сбрасываем выбор файла
    //             return;
    //         }
    
    //         const reader = new FileReader();
    
    //         reader.onload = function(e) {
    //             preview.setAttribute('src', e.target.result);
    //         };
    
    //         reader.readAsDataURL(file);
    //     }
    // };

    
    async function fetchClubData() {
        try {
            const response = await fetch(`/get-data-club?lang=${lang}&clubId=${userId}`);
            if (!response.ok) {
                throw new Error('Club not found');
            }
            clubdata = await response.json();
            clubCity = await getCityName(clubdata.city);
            console.log(clubCity);
            // renderClubData();
        } catch (error) {
            console.error('Error fetching club data:', error);
        }
    }

    // let citiesList = [];

    // async function fetchCities(curLang) {
    //     try {
    //         const response = await fetch(`/cities?language=${curLang}`);
    //         const cities = await response.json();
    //         citiesList = cities.sort();
    //     } catch (error) {
    //         console.error('Произошла ошибка:', error);
    //     }
    // };

    // await fetchCities(language);

    // console.log(citiesList);

    // const listOfCities = document.getElementById('dropdown-content');
    // citiesList.forEach(city => {
    //     const option = document.createElement('div');
    //     option.value = city;
    //     option.innerText = city;
    //     listOfCities.appendChild(option);
    // });

    // const cityInput = document.getElementById('city');
    // // const clubCityInput = document.getElementById('clubcity');

    // function updateCityList() {
    //     listOfCities.innerHTML = '';
    //     const currentText = cityInput.value.toLowerCase();

    //     const filteredCities = citiesList.filter(city => city.toLowerCase().startsWith(currentText));

    //     filteredCities.forEach(city => {
    //         const div = document.createElement('div');
    //         div.textContent = city;
    //         div.addEventListener('click', function(event) {
    //             event.stopPropagation();
    //             cityInput.value = event.target.textContent;
    //             listOfCities.style.display = 'none';
    //         });
    //         listOfCities.appendChild(div);
    //     });
    //     listOfCities.style.display = 'block';
    // }

    // // update list cities
    // cityInput.addEventListener('input', updateCityList);

    // // show dropdown cities
    // cityInput.addEventListener('focus', () => {
    //     updateCityList();
    //     listOfCities.style.display = 'block';
    // });

    // // hide dropdown cities
    // cityInput.addEventListener('blur', () => {
    //     setTimeout(() => { listOfCities.style.display = 'none'; }, 200);
    // });

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


    // Добавление обработчиков событий для полей ввода логотипа и фотографий
    document.getElementById('logoInput').addEventListener('change', function(event) {
        const file = event.target.files[0];
        if (file && file.size > 1 * 1024 * 1024) { // 1 MB = 1 * 1024 * 1024 bytes
            showErrorModal(`${getTranslation('File too large')}`);
            event.target.value = ''; // Сбрасываем выбор файла
        }
    });

    

    async function saveClubData() {
        try {
            const formData = new FormData();
            
            formData.append('phoneNumber', document.getElementById('phoneNumber').value);
            formData.append('website', document.getElementById('website').value);
            formData.append('workingHours', document.getElementById('workingHours').value);
            formData.append('numberOfTables', document.getElementById('numberOfTables').value);
            formData.append('lang', lang); // Отправляем текущий язык на сервер
            formData.append('userId', userId);

            // // Добавление логотипа
            const logoInput = document.getElementById('logoInput'); // Предполагается, что есть input для выбора файла логотипа
            if (logoInput.files[0]) {
                formData.append('logo', logoInput.files[0]);
            }
    
            // Добавление фотографий (если они предусмотрены)
            for (let i = 1; i <= 4; i++) {
                const photoInput = document.getElementById(`photoInput${i}`);
                if (photoInput.files[0]) {
                    formData.append('photos', photoInput.files[0]);
                    formData.append('photoIndex', i - 1); // Индекс фотографии, которую нужно заменить
                }
            }
    
            // Добавление данных об услугах
            const freeServices = [];
            const paidServices = [];
            document.querySelectorAll('.freeServices input:checked').forEach(checkbox => {
                freeServices.push(checkbox.value);
            });
            document.querySelectorAll('.paidServices input:checked').forEach(checkbox => {
                paidServices.push(checkbox.value);
            });

            formData.append('freeServices', freeServices.join(','));
            formData.append('paidServices', paidServices.join(','));
    
            // Отправка данных на сервер
            const response = await fetch(`/api/saveClubProfile`, { // Путь должен совпадать с тем, что указан на сервере
                method: 'POST',
                body: formData
            });
    
            if (!response.ok) {
                // throw new Error('Failed to save club data');
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to save club data');
            }
            const data = await response.json();
            if (data.success) {
                // Сохраняем пути в локальное хранилище
                if (data.logoUrl) {
                    localStorage.setItem('userLogo', data.logoUrl);
                    // document.getElementById('clubLogo').src = data.logoUrl; // Обновляем превью
                }
            }
            if (data.redirectUrl) {
                window.location.href = data.redirectUrl;
            }
    
        } catch (error) {
            console.error('Error saving club data:', error.message);
            showErrorModal(error.message);
        }
    }
    
    document.getElementById('editClubForm').addEventListener('submit', function(event) {
        event.preventDefault();
        saveClubData();
    });

    document.getElementById('rescheduling').addEventListener('submit', function(event) {
        event.preventDefault();
        saveScheduleData();
    });

    const sectionSchedule =  document.querySelector('.sectionSchedule');

     // Добавляем слушатель resize
    window.addEventListener('resize', () => {

        const screenWidth = window.innerWidth;
        if (screenWidth > 767) {
            sectionSchedule.style = "display: block";
            renderScheduleTable(clubdata);
        } else {
            sectionSchedule.style = "display: none";
        }
    });

    
    renderScheduleTable(clubdata);
    

    function renderScheduleTable(clubData) {
        const daysOfWeek = getTranslation('daysOfWeek'); // Переведенные названия дней
        const dayKeys = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
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
            sessionCell.style = 'align-content: center';
            row.appendChild(sessionCell);
    
            // Создаем ячейки для каждого дня недели
            dayKeys.forEach((dayKey, dayIndex) => {
                const cell = document.createElement("td");
                const eventData = clubData.scheduleData[dayKey]?.[sessionIndex] || { event: "", start: "", end: "" };
    
                const eventLabel = document.createElement("label");
                eventLabel.innerText = getTranslation('event');
                const eventInput = document.createElement("textarea");
                eventInput.setAttribute("readonly", true);
                // eventInput.type = "text";
                eventInput.rows = 4; // устанавливаем количество строк, например, 4
                eventInput.cols = 5; // ширина в колонках, например, 30
                eventInput.value = getTranslation(eventData.event) || (eventData.event === '' ? getTranslation('-'): 'Not selected');
                if (eventInput.value === 'Not selected' || eventInput.value === ' Не выбрано' || eventInput.value === 'ไม่ได้เลือก') {
                    eventInput.style = "color: #666877"; 
                }
                eventInput.name = `${dayKey}_event_${sessionIndex + 1}`;
                eventInput.classList.add("event-input");

                // eventInput.addEventListener('blur', () => {
                //     if (eventInput.value === 'Not selected' || eventInput.value === ' Не выбрано' || eventInput.value === 'ไม่ได้เลือก') {
                //         eventInput.style = "color: #666877"; 
                //     } else {
                //         eventInput.style = "color: #fff";
                //     }
                // });
    
                const dropdown = document.createElement("div");
                dropdown.classList.add("eventDropdown");
    
                const dropdownContent = document.createElement("div");
                dropdownContent.classList.add("eventDropdown-content");
                dropdownContent.id = `${dayKey}_event_${sessionIndex + 1}`;
    
                const events = ["-", "Group training (Adults)", "Group training (Kids)", "The Ladder", "Tournament (Master’s Cup)", "Tournament (Kids Open Cup)", "Tournament (Amateurs Cup)", "Private session", "Master Class"];
                events.forEach(type => {
                    const dropdownItem = document.createElement("div");
                    dropdownItem.innerText = getTranslation(type);  // Получаем перевод по ключу
                    dropdownItem.onclick = () => { 
                        eventInput.value = getTranslation(type);     // Заполняем поле ввода переводом
                        dropdownContent.style.display = "none";
                        if (eventInput.value === 'Not selected' || eventInput.value === 'Не выбрано' || eventInput.value === 'ไม่ได้เลือก') {
                            eventInput.style = "color: #666877"; 
                        } else {
                            eventInput.style = "color: #fff";
                        }
                    };
                    dropdownContent.appendChild(dropdownItem);
                });
                dropdown.appendChild(dropdownContent);
                eventInput.onclick = (e) => {
                    e.stopPropagation();
                    dropdownContent.style.display = "block";
                };
                document.addEventListener("click", (e) => {
                    if (!dropdown.contains(e.target)) {
                        dropdownContent.style.display = "none";
                    }
                });
    
                // Поля для начала и окончания события
                const startLabel = document.createElement("label");
                startLabel.innerText = getTranslation('start'); // Перевод "Start"
                const startTime = document.createElement("input");
                startTime.type = "time";
                startTime.value = eventData.start;
                // startTime.value = eventData.start || '--:--';
                // startTime.setAttribute('appearance', 'none');
                // startTime.setAttribute('inputmode', 'none');
                // startTime.setAttribute('autocomplete', 'off');
                startTime.setAttribute('step', '60');
                startTime.name = `${dayKey}_start_${sessionIndex + 1}`;
    
                const endLabel = document.createElement("label");
                endLabel.innerText = getTranslation('end'); // Перевод "End"
                const endTime = document.createElement("input");
                endTime.type = "time";
                endTime.value = eventData.end;
                // endTime.value = eventData.end || '00:00';
                endTime.name = `${dayKey}_end_${sessionIndex + 1}`;
    
                // Добавляем элементы в ячейку
                cell.appendChild(eventLabel);
                cell.appendChild(eventInput);
                cell.appendChild(dropdown);
                cell.appendChild(startLabel);
                cell.appendChild(startTime);
                cell.appendChild(endLabel);
                cell.appendChild(endTime);
    
                row.appendChild(cell);
            });
    
            tableBody.appendChild(row);
        }
        const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

        if (isSafari) {
            document.querySelectorAll('input[type="time"]').forEach(input => {
                input.addEventListener("input", () => {
                    if (input.value && input.value !== "--:--") {
                        input.classList.remove("empty");
                    } else {
                        input.classList.add("empty");
                    }
                });
    
                input.addEventListener("blur", () => {
                    if (!input.value) {
                        input.classList.add("empty");
                    }
                });
    
                // Проверяем начальное состояние
                if (!input.value) {
                    input.classList.add("empty");
                }
            });
        }

        document.querySelectorAll('input[type="time"]').forEach(input => {
            input.addEventListener("change", (event) => {
                const inputElement = event.target;
                if (!inputElement.value) return;
    
                console.log(`⏰ Время обновлено: ${inputElement.name} -> ${inputElement.value}`);
                
                // Принудительное обновление value (фикс для Chrome)
                inputElement.setAttribute("value", inputElement.value);
            });
        });
    
        // document.querySelectorAll('input[type="time"]').forEach(input => {
        //     input.addEventListener("input", () => {
        //         if (!input.value) {
        //             console.log(input, 'отсутствует value');
        //             input.classList.add("empty");
        //         } else {
        //             input.classList.remove("empty");
        //         }
        //     });
    
        //     // Проверяем начальное состояние
        //     if (!input.value) {
        //         input.classList.add("empty");
        //     }
        // });
    }

    // renderResponsiveScheduleTable(clubdata);

    // function renderResponsiveScheduleTable(clubData) {
    //     const daysOfWeek = getTranslation('daysOfWeek'); // Переведенные названия дней
    //     const dayKeys = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
    //     const maxSessions = 6; // Постоянное значение для количества сессий
    
    //     const tableBody = document.querySelector('.schedule-form');
    //     tableBody.innerHTML = ""; // Очищаем таблицу перед заполнением
    
    //     dayKeys.forEach((dayKey, dayIndex) => {
    //         const eventsForDay = clubData.scheduleData[dayKey] || [];
    
    //         if (eventsForDay.length === 0) return; // Пропускаем дни без событий
    
    //         // Создаем блок для дня
    //         const dayBlock = document.createElement("div");
    //         dayBlock.classList.add("day-block");
    
    //         // Название дня недели
    //         const dayTitle = document.createElement("h3");
    //         dayTitle.innerText = daysOfWeek[dayIndex];
    //         dayBlock.appendChild(dayTitle);
    
    //         // Рендерим сессии для дня
    //         for (let sessionIndex = 0; sessionIndex < maxSessions; sessionIndex++) {
    //             const sessionData = eventsForDay[sessionIndex] || { event: "", start: "", end: "" };
    
    //             // Создаем блок для сессии
    //             const sessionBlock = document.createElement("div");
    //             sessionBlock.classList.add("session-block");
    
    //             // Сессия
    //             const sessionTitle = document.createElement("div");
    //             sessionTitle.classList.add("session-title");
    //             sessionTitle.innerText = `Session ${sessionIndex + 1}`;
    //             sessionBlock.appendChild(sessionTitle);
    
    //             // Название события
    //             const eventLabel = document.createElement("label");
    //             eventLabel.innerText = getTranslation('event');
    //             const eventInput = document.createElement("textarea");
    //             eventInput.setAttribute("readonly", true);
    //             eventInput.rows = 4;
    //             eventInput.cols = 5;
    //             eventInput.value = getTranslation(sessionData.event) || (sessionData.event === '' ? getTranslation('-'): 'Not selected');
    //             if (eventInput.value === 'Not selected' || eventInput.value === ' Не выбрано' || eventInput.value === 'ไม่ได้เลือก') {
    //                 eventInput.style = "color: #666877"; 
    //             }
    //             eventInput.classList.add("event-input");
    
    //             // Выпадающий список для выбора события
    //             const dropdown = document.createElement("div");
    //             dropdown.classList.add("eventDropdown");
    
    //             const dropdownContent = document.createElement("div");
    //             dropdownContent.classList.add("eventDropdown-content");
    //             dropdownContent.id = `${dayKey}_event_${sessionIndex + 1}`;
    
    //             const events = ["-", "Group training (Adults)", "Group training (Kids)", "The Ladder", "Tournament (Master’s Cup)", "Tournament (Kids Open Cup)", "Tournament (Amateurs Cup)", "Private session", "Master Class"];
    //             events.forEach(type => {
    //                 const dropdownItem = document.createElement("div");
    //                 dropdownItem.innerText = getTranslation(type);
    //                 dropdownItem.onclick = () => { 
    //                     eventInput.value = getTranslation(type);
    //                     dropdownContent.style.display = "none";
    //                     eventInput.style = eventInput.value === 'Not selected' || eventInput.value === 'Не выбрано' || eventInput.value === 'ไม่ได้เลือก' ? "color: #666877" : "color: #fff";
    //                 };
    //                 dropdownContent.appendChild(dropdownItem);
    //             });
    //             dropdown.appendChild(dropdownContent);
    
    //             eventInput.onclick = (e) => {
    //                 e.stopPropagation();
    //                 dropdownContent.style.display = "block";
    //             };
    
    //             // Время начала и окончания
    //             const startLabel = document.createElement("label");
    //             startLabel.innerText = getTranslation('start');
    //             const startTime = document.createElement("input");
    //             startTime.type = "time";
    //             startTime.value = sessionData.start;
    //             startTime.name = `${dayKey}_start_${sessionIndex + 1}`;
    
    //             const endLabel = document.createElement("label");
    //             endLabel.innerText = getTranslation('end');
    //             const endTime = document.createElement("input");
    //             endTime.type = "time";
    //             endTime.value = sessionData.end;
    //             endTime.name = `${dayKey}_end_${sessionIndex + 1}`;
    
    //             // Добавляем элементы в блок сессии
    //             sessionBlock.appendChild(eventLabel);
    //             sessionBlock.appendChild(eventInput);
    //             sessionBlock.appendChild(dropdown);
    //             sessionBlock.appendChild(startLabel);
    //             sessionBlock.appendChild(startTime);
    //             sessionBlock.appendChild(endLabel);
    //             sessionBlock.appendChild(endTime);
    
    //             dayBlock.appendChild(sessionBlock); // Добавляем блок сессии в блок дня
    //         }
    
    //         tableBody.appendChild(dayBlock); // Добавляем блок дня в таблицу
    //     });
    // }
    
    
    function findEventKey(value, lang) {
        const entries = Object.entries(translations[lang]);
        const eventEntry = entries.find(([key, translation]) => translation === value);
        return eventEntry ? eventEntry[0] : null; // Возвращаем ключ или null, если не найдено
    }


    async function saveScheduleData() {
        const tableBody = document.querySelector('.schedule-form');
        const dayKeys = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
        const scheduleData = {}; 
        
        console.log(tableBody);
        console.log(tableBody.rows);
        // Инициализируем объект для каждого дня недели
        dayKeys.forEach(day => {
            scheduleData[day] = [];
        });
    
        // Перебираем строки таблицы (начиная со второй строки, так как первая — это заголовок)
        Array.from(tableBody.rows).slice(1).forEach((row, sessionIndex) => {
            dayKeys.forEach((dayKey, dayIndex) => {
                const cell = row.cells[dayIndex + 1]; // Первая ячейка — это номер сессии, поэтому сдвиг на 1
                const eventInput = cell.querySelector("textarea.event-input");
                const startTime = cell.querySelector(`input[name="${dayKey}_start_${sessionIndex + 1}"]`);
                const endTime = cell.querySelector(`input[name="${dayKey}_end_${sessionIndex + 1}"]`);
    
                // Находим ключ события по текущему значению текста
                // Находим ключ события
                let eventKey = findEventKey(eventInput.value, lang);

                console.log(eventKey);
                if (!eventKey) {
                    console.warn(`Событие "${eventInput.value}" не найдено в translations для языка "${lang}"`);
                }

                if (eventKey === "-") {
                    eventKey = "";
                    endTime.value ='';
                    startTime.value ='';
                }

                if (!eventKey || !startTime.value || !endTime.value) {
                    eventKey = "";
                    endTime.value ='';
                    startTime.value ='';
                }
            
                const event = {
                    event: eventKey,
                    start: startTime.value,
                    end: endTime.value,
                };
                // Создаем объект события
                // const event = {
                //     event: eventInput.value,
                //     start: startTime.value,
                //     end: endTime.value,
                // };
                
                // Добавляем событие в расписание дня
                scheduleData[dayKey].push(event);
            });
        });
    
        try {
            // Отправляем данные на сервер
            const response = await fetch('/api/saveSchedule', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ scheduleData, clubId: userId}),
            });
    
                console.log("Расписание успешно сохранено.");
                window.location.href = `/${lang}/dashboard/club/${userId}`;
           if (response.ok) {
             } else {
                console.error("Ошибка сохранения расписания.");
            }
        } catch (error) {
            console.error("Ошибка подключения:", error);
        }
    }


});

