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
            'Not image': 'Please select a valid image file.'
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
            'Not image': 'Пожалуйста, выберите корректный файл изображения.'
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
            'Not image': 'กรุณาเลือกไฟล์รูปภาพที่ถูกต้อง'
        }
    };

    function getTranslation(key) {
        return translations[lang][key] || translations['en'][key];
    }

    await fetchClubData();

    console.log(clubdata);
    if (clubdata) {
        document.getElementById('clubName').value = clubdata.name || '';
        document.getElementById('city').value = clubCity || '';
        document.getElementById('address').value = clubdata.address[lang] || '';
        document.getElementById('location').value = clubdata.location.join(', ') || '';
        document.getElementById('workingHours').value = clubdata.workingHours || '';
        document.getElementById('numberOfTables').value = clubdata.tables || '';
        document.getElementById('representative').value = clubdata.representative || '';
        document.getElementById('phoneNumber').value = clubdata.phoneNumber || '';
        document.getElementById('website').value = clubdata.website || '';
        // document.getElementById('freeServices').value = clubdata.freeServices || '';
        // document.getElementById('paidServices').value = clubdata.paidServices || '';
        document.getElementById('description').value = clubdata.info[lang] || '';
        document.getElementById('clubLogo').src = clubdata.logo || '/icons/playerslogo/default_avatar.svg';


        const logoInput = document.getElementById('logoInput');
        const logoPreview = document.getElementById('clubLogo');

        // Обработчик события для изменения файла
        // logoInput.addEventListener('change', function(event) {
        //     const file = event.target.files[0];
            
        //     // Проверяем, выбран ли файл и является ли он изображением
        //     if (file && file.type.startsWith('image/')) {
        //         const reader = new FileReader();
                
        //         reader.onload = function(e) {
        //             // Устанавливаем новый src для логотипа-превью
        //             logoPreview.src = e.target.result;
        //         };

        //         // Читаем файл как Data URL
        //         reader.readAsDataURL(file);
        //     } else {
        //         alert('Please select a valid image file.');
        //     }
        // });

        logoInput.addEventListener('change', function(event) {
            const file = event.target.files[0];
        
            // Проверяем, выбран ли файл и является ли он изображением
            if (file && file.type.startsWith('image/')) {
                if (file.size > 1 * 1024 * 1024) {
                    showErrorModal(`${getTranslation('File too large')}`);
                    logoInput.value = ''; 
                    return;
                }
        
                const reader = new FileReader();
        
                reader.onload = function(e) {
                    logoPreview.src = e.target.result;
                };
        
                reader.readAsDataURL(file);
            } else {
                showErrorModal(`${getTranslation('Not image')}`);
                logoInput.value = '';
            }
        });
        
        clubdata.supplements.free.forEach(service => {
            const checkbox = document.querySelector(`.freeServices input[value="${service}"]`);
            if (checkbox) {
                checkbox.checked = true;
            }
        });

        clubdata.supplements.paid.forEach(service => {
            const checkbox = document.querySelector(`.paidServices input[value="${service}"]`);
            if (checkbox) {
                checkbox.checked = true;
            }
        });

        if (clubdata.photos && Array.isArray(clubdata.photos)) {
            clubdata.photos.forEach((photo, index) => {
                if (index < 4) { // Учитываем, что у нас только 4 миниатюры
                    const preview = document.getElementById(`preview${index + 1}`);
                    if (preview) {
                        preview.src = photo; // Устанавливаем URL фотографии
                    }
                }
            });
        }
    } else {
        console.error('Club data is undefined.');
    }

    window.triggerFileInput = function(index) {
        document.getElementById(`photoInput${index}`).click();
    }

    // Функция для удаления фотографии и установки дефолтной картинки
    window.removePhoto = function(index, event) {
        event.stopPropagation(); // Предотвращаем открытие проводника при удалении фото

        const preview = document.getElementById(`preview${index}`);
        const defaultImage = '/icons/defaultClubPicture.svg'; 

        // Устанавливаем дефолтное изображение
        preview.setAttribute('src', defaultImage);

        // Очищаем значение input
        document.getElementById(`photoInput${index}`).value = '';
    }

    // Функция для изменения изображения при выборе файла
    window.previewPhoto = function(index) {
        const fileInput = document.getElementById(`photoInput${index}`);
        const preview = document.getElementById(`preview${index}`);
        const file = fileInput.files[0];
    
        if (file) {
            // Проверяем, является ли файл изображением
            if (file.type.startsWith('image/')) {
                // Проверка размера файла
                if (file.size > 1 * 1024 * 1024) { 
                    showErrorModal(`${getTranslation('File too large')}`);
                    fileInput.value = '';
                    return;
                }
                
                const reader = new FileReader();
    
                reader.onload = function(e) {
                    preview.setAttribute('src', e.target.result);
                };
    
                reader.readAsDataURL(file);
            } else {
                showErrorModal(`${getTranslation('Not image')}`);
                fileInput.value = '';
                // preview.setAttribute('src', ''); // Очистить превью
            }
        }
    };

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

    for (let i = 1; i <= 4; i++) {
        document.getElementById(`photoInput${i}`).addEventListener('change', function(event) {
            const file = event.target.files[0];
            if (file && file.size > 1 * 1024 * 1024) { // 1 MB = 1 * 1024 * 1024 bytes
                showErrorModal(`${getTranslation('File too large')}`);
                event.target.value = ''; // Сбрасываем выбор файла
            }
        });
    }

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

            if (response.url) {
                if (logoInput.files[0]) {
                    localStorage.setItem('logo', `${response.url}` )
                }
                
                window.location.href = response.url;
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
    
  

    // const container = document.querySelector('.parseContainer');

    // if (container) {
    //     const rows = container.querySelectorAll('tbody tr'); // Находим все tr элементы внутри контейнера
    //     const result = [];

    //     rows.forEach(row => {
    //         const cells = row.querySelectorAll('td'); // Находим все td элементы внутри текущей строки

    //         if (cells.length >= 2) {
    //             const manufacturer = cells[1].textContent.split(' (')[0]; // Извлекаем текст до первой скобки
    //             const modelName = cells[2].textContent.split(' (')[0]; // Аналогично для названия модели

    //             result.push(`"${manufacturer} ${modelName}"`);
    //         }
    //     });

    //     console.log(result); // Вывод массива с производителями и моделями
    //     localStorage.setItem('накладки', result);
    // } else {
    //     console.log('Контейнер .parseContainer не найден');
    // }

});

