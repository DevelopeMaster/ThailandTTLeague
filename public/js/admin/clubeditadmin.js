import { listenerOfButtons, showErrorModal } from '../versioned-modules.js';
import { createHeaderandSidebarForAdmin } from './adminmodules.js';

document.addEventListener('DOMContentLoaded', async () => {
    createHeaderandSidebarForAdmin('manageAllClubs');
    listenerOfButtons();   

    const userId = document.querySelector('.editClub').dataset.clubid;
    let clubdata;
    let clubCity;
    const lang = 'ru';

    console.log(userId);

    await fetchClubData();

    function createDropdown(dropdown, options, inputElement) {
        dropdown.innerHTML = '';
        options.forEach(option => {
            const div = document.createElement('div');
            div.textContent = option;
            div.addEventListener('click', () => {
                inputElement.value = option;
                dropdown.style.display = 'none';
                isFiltered = true; // Устанавливаем состояние фильтрации
                // filterPlayers(); // Предположим, что у тебя есть функция для фильтрации игроков
            });
            dropdown.appendChild(div);
        });
    }

    function updateDropdownList(dropdown, options, inputElement) {
        dropdown.innerHTML = '';
        const currentText = (inputElement.value || '').toLowerCase();
    
        // Фильтрация опций по введенному тексту
        const filteredOptions = options.filter(option => option && option.toLowerCase().includes(currentText));
    
        filteredOptions.forEach(option => {
            const div = document.createElement('div');
            div.textContent = option;
            div.addEventListener('click', () => {
                inputElement.value = option;
                dropdown.style.display = 'none';
                isFiltered = true;
                // filterPlayers(); // Предположим, что эта функция у тебя уже есть
            });
            dropdown.appendChild(div);
        });
        dropdown.style.display = filteredOptions.length > 0 ? 'block' : 'none'; // Показать дропдаун, если есть совпадения
    }
    
    function setupDropdown(inputElement, dropdown, options) {
        inputElement.addEventListener('input', () => {
            updateDropdownList(dropdown, options, inputElement);
        });
    
        inputElement.addEventListener('focus', () => {
            updateDropdownList(dropdown, options, inputElement);
        });
    
        document.addEventListener('click', (e) => {
            if (!inputElement.contains(e.target) && !dropdown.contains(e.target)) {
                dropdown.style.display = 'none';
            }
        });
    }

    // Общая функция для получения данных с сервера
    async function fetchData(url) {
        return fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Error fetching data from ${url}`);
                }
                return response.json();
            })
            .catch(error => {
                console.error("Error fetching data:", error);
            });
    }

    const cityInput = document.getElementById('city');
    const cityDropdown = document.getElementById('cityDropdown');

    fetchData(`/cities?language=${"russian"}`)
        .then(data => {
            const cityOptions = data.cities.sort();
            createDropdown(cityDropdown, cityOptions, cityInput);
            setupDropdown(cityInput, cityDropdown, cityOptions);
        });

    console.log(clubdata);
    if (clubdata) {
        document.getElementById('clubName').value = clubdata.name || '';
        document.getElementById('city').value = clubCity || '';
        document.getElementById('address').value = (clubdata.address && clubdata.address['ru']) || '';
        document.getElementById('addressEng').value = (clubdata.address && clubdata.address['en']) || '';
        document.getElementById('addressThai').value = (clubdata.address && clubdata.address['th']) || '';
        if (clubdata.location) {
            if (Array.isArray(clubdata.location)) {
                document.getElementById('location').value = clubdata.location.join(', ');
            } 
        }
        document.getElementById('workingHours').value = clubdata.workingHours || '';
        document.getElementById('numberOfTables').value = clubdata.tables || '';
        document.getElementById('representative').value = clubdata.representative || '';
        document.getElementById('phoneNumber').value = clubdata.phoneNumber || '';
        document.getElementById('website').value = clubdata.website || '';
        document.getElementById('description').value = (clubdata.info && clubdata.info['ru']) || '';
        document.getElementById('descriptionEng').value = (clubdata.info && clubdata.info['en']) || '';
        document.getElementById('descriptionThai').value = (clubdata.info && clubdata.info['th']) || '';
        document.getElementById('clubLogo').src = clubdata.logo || '/icons/playerslogo/default_avatar.svg';

        const logoInput = document.getElementById('logoInput');
        const logoPreview = document.getElementById('clubLogo');

        logoInput.addEventListener('change', function(event) {
            const file = event.target.files[0];
        
            if (file && file.type.startsWith('image/')) {
                if (file.size > 1 * 1024 * 1024) {
                    showErrorModal(`Файл слишком большой. Максимальный размер: 1 MB`);
                    logoInput.value = ''; 
                    return;
                }
                const reader = new FileReader();
                reader.onload = function(e) {
                    logoPreview.src = e.target.result;
                };
        
                reader.readAsDataURL(file);
            } else {
                showErrorModal(`Пожалуйста, выберите корректный файл изображения`);
                logoInput.value = '';
            }
        });
        
        if (clubdata.supplements && clubdata.supplements.free) {
            clubdata.supplements.free.forEach(service => {
                const checkbox = document.querySelector(`.freeServices input[value="${service}"]`);
                if (checkbox) {
                    checkbox.checked = true;
                }
            });
        }
        
        if (clubdata.supplements && clubdata.supplements.paid) {
            clubdata.supplements.paid.forEach(service => {
                const checkbox = document.querySelector(`.paidServices input[value="${service}"]`);
                if (checkbox) {
                    checkbox.checked = true;
                }
            });
        }
        
        if (clubdata.photos && Array.isArray(clubdata.photos)) {
            clubdata.photos.forEach((photo, index) => {
                if (index < 4) { 
                    const preview = document.getElementById(`preview${index + 1}`);
                    if (preview) {
                        preview.src = photo; 
                    }
                }
            });
        }

        

    } else {
        console.error('Клуб не найден.');
    }

    window.triggerFileInput = function(index) {
        document.getElementById(`photoInput${index}`).click();
    }

    window.removePhoto = function(index, event) {
        event.stopPropagation();

        const preview = document.getElementById(`preview${index}`);
        const defaultImage = '/icons/defaultClubPicture.svg'; 

        preview.setAttribute('src', defaultImage);

        document.getElementById(`photoInput${index}`).value = '';
    }

    const MAX_FILE_SIZE = 2 * 1024 * 1024; // 1 МБ
    const DEFAULT_CLUB_PHOTO = '/icons/defaultClubPicture.svg';
    const DEFAULT_PLAYER_LOGO = '/icons/clubslogo/default_avatar.svg';

    // Функция для проверки файла
    function validateFile(file) {
        if (!file) {
            return false;
        }
        if (!file.type.startsWith('image/')) {
            showErrorModal('Выбранный файл не является изображением');
            return false;
        }
        if (file.size > MAX_FILE_SIZE) {
            showErrorModal('Размер файла превышает 2 МБ');
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
    // Функция для изменения изображения при выборе файла
    // window.previewPhoto = function(index) {
    //     const fileInput = document.getElementById(`photoInput${index}`);
    //     const preview = document.getElementById(`preview${index}`);
    //     const file = fileInput.files[0];
    
    //     if (file) {
    //         if (file.type.startsWith('image/')) {
    //             if (file.size > 1 * 1024 * 1024) { 
    //                 showErrorModal(`Файл слишком большой. Максимальный размер: 1 MB`);
    //                 fileInput.value = '';
    //                 return;
    //             }
    //             const reader = new FileReader();
    //             reader.onload = function(e) {
    //                 preview.setAttribute('src', e.target.result);
    //             };
    
    //             reader.readAsDataURL(file);
    //         } else {
    //             showErrorModal(`Пожалуйста, выберите корректный файл изображения`);
    //             fileInput.value = '';
    //         }
    //     }
    // };

    async function deleteClub() {
        try {
            const response = await fetch(`/api/deleteClub/${userId}`, {
                method: 'DELETE'
            });
    
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to delete player');
            }
    
            const data = await response.json();
            if (data.success) {
                window.location.href = '/ru/dashboard/admin/clubs';
            } else {
                throw new Error(data.error || 'Failed to delete club');
            }
        } catch (error) {
            console.error('Error deleting club:', error.message);
            showErrorModal(error.message);
        }
    }


    
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

    async function saveClubData() {
        try {
            const formData = new FormData();
            
            formData.append('name', document.getElementById('clubName').value);
            formData.append('city', document.getElementById('city').value);
            formData.append('address', document.getElementById('address').value);
            formData.append('addresseng', document.getElementById('addressEng').value);
            formData.append('addressthai', document.getElementById('addressThai').value);
            formData.append('workingHours', document.getElementById('workingHours').value);
            formData.append('tables', document.getElementById('numberOfTables').value);
            formData.append('representative', document.getElementById('representative').value);
            formData.append('phoneNumber', document.getElementById('phoneNumber').value);
            formData.append('website', document.getElementById('website').value);
            formData.append('info', document.getElementById('description').value);
            formData.append('infoeng', document.getElementById('descriptionEng').value);
            formData.append('infothai', document.getElementById('descriptionThai').value);
            formData.append('lang', lang);
            formData.append('userId', userId);

            const locationArray = document.getElementById('location').value.split(', ').map(Number);
            formData.append('location', JSON.stringify(locationArray));

            const logoInput = document.getElementById('logoInput');
            if (logoInput.files[0]) {
                formData.append('logo', logoInput.files[0]);
            }
    
            for (let i = 1; i <= 4; i++) {
                const photoInput = document.getElementById(`photoInput${i}`);
                if (photoInput.files[0]) {
                    formData.append('photos', photoInput.files[0]);
                    formData.append('photoIndex', i - 1);
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
            const response = await fetch(`/api/saveClubProfile`, {
                method: 'POST',
                body: formData
            });
    
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to save club data');
            }

            const data = await response.json();
           
            if (data.redirectUrl) {
                window.location.href = data.redirectUrl;
            }
    
        } catch (error) {
            console.error('Error saving club data:', error.message);
            showErrorModal(error.message);
        }
    }
    
    
    document.getElementById('editclub_formContainer_submit').addEventListener('click', function(event) {
        event.preventDefault();
        saveClubData();
    });

    document.getElementById('editclub_formContainer_submitTop').addEventListener('click', function(event) {
        event.preventDefault();
        saveClubData();
    });

    document.getElementById('deleteClubBtn').addEventListener('click', async function () {
        const isConfirmed = confirm(`Вы уверены что хотите удалить клуб ${clubdata.name || clubdata.fullname}?`);
        
        if (isConfirmed) {
            await deleteClub();
        }
    });

    document.getElementById('deleteClubBtnTop').addEventListener('click', async function () {
        const isConfirmed = confirm(`Вы уверены что хотите удалить клуб ${clubdata.name || clubdata.fullname}?`);
        
        if (isConfirmed) {
            await deleteClub();
        }
    });
    
  

});