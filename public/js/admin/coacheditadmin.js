import { listenerOfButtons, showErrorModal } from '../versioned-modules.js';
import { createHeaderandSidebarForAdmin } from './adminmodules.js';

document.addEventListener('DOMContentLoaded', async () => {
    createHeaderandSidebarForAdmin('manageAllCoaches');
    listenerOfButtons();   

    const playerId = document.querySelector('.editPlayer').dataset.coachid;
    let playerData;
    let playerCity;
    let deletedPhoto = false;

    await fetchUserData();
    let isFiltered;

    // const cityDropdown = document.getElementById('cityDropdown');

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

    window.addDots = function(input) {
        let value = input.value;
        let length = value.length;
        
        if (isNaN(value.replace(/\./g, ''))) {
            input.value = value.substring(0, length - 1);
            return;
        }
        if ((length === 2 || length === 5) && !isNaN(value[length - 1])) {
            input.value += '.';
        }
        if (length === 10) {
            let parts = value.split(".");
            const enteredDate = new Date(parts[2], parts[1] - 1, parts[0]);
            const today = new Date().setHours(0, 0, 0, 0);
            if (enteredDate >= today) {
                alert("Date of birth is not correct");
                input.value = "";
            }
        }
    }

    const cityInput = document.getElementById('city');
    const cityDropdown = document.getElementById('cityDropdown');
    const clubInput = document.getElementById('club');
    const clubDropdown = document.getElementById('clubDropdown');
    const bladeInput = document.getElementById('blade');
    const bladeDropdown = document.getElementById('bladeDropdown');
    const forehandInput = document.getElementById('forehand');
    const forehandDropdown = document.getElementById('forehandDropdown');
    const backhandInput = document.getElementById('backhand');
    const backhandDropdown = document.getElementById('backhandDropdown');
    let allClubs;

    fetchData(`/cities?language=${"russian"}`)
        .then(data => {
            const cityOptions = data.cities.sort(); // Преобразуем данные в массив имен городов
            createDropdown(cityDropdown, cityOptions, cityInput); // Создаем выпадающий список с опциями
            setupDropdown(cityInput, cityDropdown, cityOptions); // Настраиваем фильтрацию
        });
    
    fetchData('/clubs')
        .then(data => {
            allClubs = data;
            const clubOptions = data.map(club => club.name || club.fullname); // Преобразуем данные в массив имен тренеров
            createDropdown(clubDropdown, clubOptions, clubInput);
            setupDropdown(clubInput, clubDropdown, clubOptions);

            if (playerData) {
                const club = allClubs.find(club => club._id === playerData.club);
                document.getElementById('club').value = club ? club.name : '';
            }
        });

    fetchData('/rackets')
        .then(data => {
            console.log(data);
            const bladeOptions = data.blade;
            createDropdown(bladeDropdown, bladeOptions, bladeInput);
            setupDropdown(bladeInput, bladeDropdown, bladeOptions);

            const rubberOptions = data.overlays;
            createDropdown(forehandDropdown, rubberOptions, forehandInput);
            setupDropdown(forehandInput, forehandDropdown, rubberOptions);

            createDropdown(backhandDropdown, rubberOptions, backhandInput);
            setupDropdown(backhandInput, backhandDropdown, rubberOptions);
        });

    

    // console.log(playerData);
    if (playerData) {
        const date = new Date(playerData.birthdayDate);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        const formattedDate = `${day}.${month}.${year}`;

        const logoInput = document.getElementById('logoInput');
        const logoPreview = document.getElementById('playerLogo');

        logoInput.addEventListener('change', function(event) {
            const file = event.target.files[0];
        
            // Проверяем, выбран ли файл
            if (!file) {
                showErrorModal(`Файл не выбран`);
                return;
            }
        
            // Проверяем, является ли файл изображением
            if (!file.type.startsWith('image/')) {
                showErrorModal(`${getTranslation('Выбранный файл не является изображением')}`);
                logoInput.value = ''; // Сбрасываем выбор файла
                return;
            }
        
            // Проверяем размер файла
            const maxFileSize = 1 * 1024 * 1024; // 1 МБ
            if (file.size > maxFileSize) {
                showErrorModal(`${getTranslation('Размер файла превышает 1 МБ')}`);
                logoInput.value = ''; // Сбрасываем выбор файла
                return;
            }
        
            // Если все проверки пройдены, отображаем предварительный просмотр
            const reader = new FileReader();
            reader.onload = function(e) {
                logoPreview.src = e.target.result; // Устанавливаем изображение в предварительный просмотр
            };
            reader.readAsDataURL(file);
        });

        // document.getElementById('playerLogo').src = playerData.logo; // || "/icons/playerslogo/default_avatar.svg";
        document.getElementById('playerName').value = playerData.name || playerData.fullname;
        document.getElementById('city').value = playerCity || '';
        document.getElementById('date').value = formattedDate || '';
        document.getElementById('emailRegInput').value = playerData.email || '';
        document.getElementById('phoneNumber').value = playerData.phoneNumber || '';
        document.getElementById('raiting').value = playerData.rating || '';
        document.getElementById('trainingDuration').value = playerData.trainingDuration || '';
        document.getElementById('oneTrainingPrice').value = playerData.oneTrainingPrice || '';
        document.getElementById('blade').value = playerData.blade || '';
        document.getElementById('forehand').value = playerData.forehandRubber || '';
        document.getElementById('backhand').value = playerData.backhandRubber || '';
        document.getElementById('description').value = playerData.trainingInfo ? playerData.trainingInfo['ru'] : '';
        document.getElementById('descriptionEng').value = playerData.trainingInfo ? playerData.trainingInfo['en'] : '';
        document.getElementById('descriptionThai').value =playerData.trainingInfo ? playerData.trainingInfo['th'] : '';
    
        const leftHandRadio = document.getElementById('left');
        const rightHandRadio = document.getElementById('right');

        function updateHandSelection() {
            if (leftHandRadio.checked) {
                rightHandRadio.checked = false;
            } else if (rightHandRadio.checked) {
                leftHandRadio.checked = false;
            }
        }
    
        // Проверяем начальное состояние и устанавливаем правильный выбор
        if (playerData.hand === 'left') {
            leftHandRadio.checked = true;
            rightHandRadio.checked = false;
        } else if (playerData.hand === 'right') {
            rightHandRadio.checked = true;
            leftHandRadio.checked = false;
        }
    
        // Добавляем обработчики событий для радиокнопок
        leftHandRadio.addEventListener('change', updateHandSelection);
        rightHandRadio.addEventListener('change', updateHandSelection);

        document.getElementById('playerLogo').src = playerData.logo || '/icons/playerslogo/default_avatar.svg';
    } else {
        console.error('player data is undefined.');
    }
    

    document.getElementById('deleteCoachBtn').addEventListener('click', async function () {
        const isConfirmed = confirm(`Вы уверены что хотите удалить пользователя ${playerData.name || playerData.fullname}?`);
        
        if (isConfirmed) {
            await deleteCoach();
        }
    });

    document.getElementById('deleteCoachBtnTop').addEventListener('click', async function () {
        const isConfirmed = confirm(`Вы уверены что хотите удалить пользователя ${playerData.name || playerData.fullname}?`);
        
        if (isConfirmed) {
            await deleteCoach();
        }
    });

    async function deleteCoach() {
        try {
            const response = await fetch(`/api/deleteCoach/${playerId}`, { // Используйте правильный маршрут для удаления
                method: 'DELETE'
            });
    
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to delete coach');
            }
    
            const data = await response.json();
            if (data.success) {
                window.location.href = '/ru/dashboard/admin/coaches';
            } else {
                throw new Error(data.error || 'Failed to delete coach');
            }
        } catch (error) {
            console.error('Error deleting coach:', error.message);
            showErrorModal(error.message);
        }
    }

    document.getElementById('promoteToUser').addEventListener('click', async function () {
        const isConfirmed = confirm(`Вы уверены, что хотите изменить тип пользователя ${playerData.name || playerData.fullname} без сохранения изменений?`);
        
        if (isConfirmed) {
            await promoteToUser();
        }
    });

    async function promoteToUser() {    
    
        try {
            const response = await fetch(`/api/promoteToUser/${playerId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
    
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to promote coach');
            }
    
            const data = await response.json();
            if (data.success) {
                window.location.href = '/ru/dashboard/admin'; // Перенаправление после успешного перемещения
            } else {
                throw new Error(data.error || 'Failed to promote coach');
            }
        } catch (error) {
            console.error('Error promoting coach to player:', error.message);
            showErrorModal(error.message); // Функция для отображения ошибок
        }
    }
    
    async function fetchUserData() {
        try {
            const response = await fetch(`/get-data-coach?userId=${playerId}`);
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
            // renderPlayerData();
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    }

    

    async function getCityName(cityId) {
        try {
            const response = await fetch(`/cities/${cityId}`);
            if (!response.ok) {
                throw new Error('City data not found');
            }
            const city = await response.json();
            // const languageKeyMap = {
            //     'en': 'english',
            //     'ru': 'russian',
            //     'th': 'thai'
            // };
            // const cityKey = languageKeyMap['ru'] || 'english';
            
            return city['russian'] || city['english'];
        } catch (error) {
            console.error('Ошибка при получении названия города:', error);
            return 'Unknown City'; // Возвращение запасного значения в случае ошибки
        }
    }

    function convertDateToISO(dateString) {
        const [day, month, year] = dateString.split('.');
        const isoDate = new Date(`${year}-${month}-${day}T00:00:00.000Z`);
        return isoDate.toISOString(); // Возвращаем ISO строку
    }

    
    window.removePhoto = function(event) {
        event.stopPropagation(); // Предотвращаем открытие проводника при удалении фото

        const preview = document.getElementById(`playerLogo`);
        const defaultImage = '/icons/playerslogo/default_avatar.svg'; 
        deletedPhoto = true;
        // Устанавливаем дефолтное изображение
        preview.setAttribute('src', defaultImage);

        // Очищаем значение input
        document.getElementById(`logoInput`).value = '';
    }

    async function saveCoachData() {
        try {
            const formData = new FormData();
            if (deletedPhoto) {
                formData.append('useDefaultImage', true);
            }
            formData.append('name', document.getElementById('playerName').value);
            formData.append('city', document.getElementById('city').value);
            formData.append('birthdayDate', convertDateToISO(document.getElementById('date').value));
            formData.append('email', document.getElementById('emailRegInput').value);
            formData.append('phoneNumber', document.getElementById('phoneNumber').value);
            formData.append('rating', document.getElementById('raiting').value);
            formData.append('club', document.getElementById('club').value);
            formData.append('trainingDuration', document.getElementById('trainingDuration').value);
            formData.append('oneTrainingPrice', document.getElementById('oneTrainingPrice').value);
            formData.append('hand', document.getElementById('left').checked ? document.getElementById('left').value : document.getElementById('right').value);
            formData.append('blade', document.getElementById('blade').value);
            formData.append('forehandRubber', document.getElementById('forehand').value);
            formData.append('backhandRubber', document.getElementById('backhand').value);
            formData.append('description', document.getElementById('description').value);
            formData.append('descriptioneng', document.getElementById('descriptionEng').value);
            formData.append('descriptionthai', document.getElementById('descriptionThai').value);
            // formData.append('lang', lang); // Отправляем текущий язык на сервер
            formData.append('userId', playerId);

            // // Добавление логотипа
            const logoInput = document.getElementById('logoInput');
            // console.log(logoInput.files[0]);
            if (logoInput.files[0]) {
                formData.append('userLogo', logoInput.files[0]);
            }
    
            

    
            // Отправка данных на сервер
            const response = await fetch(`/api/saveCoachProfile`, { 
                method: 'POST',
                body: formData
            });
    
            if (!response.ok) {
                // throw new Error('Failed to save club data');
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to save coach data');
            }

            try {
                // Преобразование ответа в JSON один раз
                const data = await response.json();
            
                if (data.success) {
                    // Если логотип был обновлен, сохраняем его в localStorage
                    // if (data.logoUrl) {
                    //     localStorage.setItem('userLogo', data.logoUrl);
                    // }
                    // Перенаправляем пользователя на новую страницу
                    window.location.href = '/ru/dashboard/admin/coaches';
                } else {
                    throw new Error(data.error || 'Failed to save coach data');
                }
            } catch (error) {
                console.error('Error parsing response:', error);
                throw new Error('Failed to parse response');
            }
    
        } catch (error) {
            console.error('Error saving coach data:', error.message);
            showErrorModal(error.message);
        }
    }
    
    document.getElementById('editclub_formContainer_submit').addEventListener('click', function(event) {
        event.preventDefault();
        saveCoachData();
    });

    document.getElementById('editclub_formContainer_submitTop').addEventListener('click', function(event) {
        event.preventDefault();
        saveCoachData();
    });
    
    // console.log(playerId);
});