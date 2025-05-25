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
    const userId = document.querySelector('.addTournament').dataset.userid;
    // const userType = document.querySelector('.club').dataset.usertype;
    // console.log(userId, userType);
    initializeApp();

    btnGoUp();
    
    languageControl();

    breadCrumb();

    const topBlockAdv = document.querySelector('.addTournament');
    fetchAdvertisements(topBlockAdv);

    listenerOfButtons();

    const currentPath = window.location.pathname;

    const parts = currentPath.split('/');
    const lang = parts[1];

    const translations = {
        'en': {
            'response-ok': 'Tournament created successfully!',
            'response-bad': 'Something wrong. Please try again.',
            'workingHours': 'Working hours',
            'city': 'City'
        },
        'ru': {
            'response-ok': 'Турнир успешно создан!',
            'response-bad': 'Что-то пошло не так. Попробуйте еще раз.',
            'workingHours': 'Часы работы',
            'city': 'Город'
        },
        'th': {
            'response-ok': 'สร้างทัวร์นาเมนต์สำเร็จแล้ว!',
            'response-bad': 'มีบางอย่างผิดพลาด กรุณาลองอีกครั้ง',
            'workingHours': 'ชั่วโมงทำงาน:',
            'city': 'ที่อยู่'
        }
    };

    let club;
    let location;
    // console.log(userId);
    async function fetchClubData() {
        try {
            const response = await fetch(`/get-data-club?lang=${lang}&clubId=${clubId}`);
            if (!response.ok) {
                throw new Error('Club not found');
            }
            club = await response.json();
            location = club.location;
            

        } catch (error) {
            console.error('Error fetching club data:', error);
        }
    }

    const form = document.getElementById('addTournamentForm');

    form.addEventListener('submit', async (event) => {
        event.preventDefault(); // Предотвращаем стандартное поведение формы

        const formData = new FormData(form); // Сбор данных из формы
        // const userId = document.querySelector('.addClub.addTournament').dataset.userid; // Получаем userId из атрибута data-userid
        formData.append('userid', userId); // Добавляем userId в данные формы
        formData.append('language', lang);
        formData.append('location', location);

        // Получение данных о дате и времени из формы
        const date = formData.get('tournamentdate'); // Формат YYYY-MM-DD
        const time = formData.get('tournamenttime'); // Формат HH:MM

        // Создание объекта полной даты
        const datetime = new Date(`${date}T${time}:00Z`); // Объединяем дату и время

        // Добавление даты и времени в данные формы
        formData.append('date', datetime.toISOString());
        formData.append('datetime', datetime.toISOString());
        // Преобразование FormData в JSON
        const jsonData = {};
        formData.forEach((value, key) => {
            jsonData[key] = value;
        });

        try {
            const response = await fetch('/addtournament', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(jsonData), // Отправка данных в формате JSON
            });

            if (response.ok) {
                const result = await response.json();
                alert(`${translations[lang]['response-ok']}`);
                window.location.href = `/${lang}/dashboard/club/${userId}`;
                console.log(result);
                // Дополнительные действия после успешной отправки
            } else {
                const error = await response.json();
                alert(`Error: ${error.message}`);
                console.error(error);
            }
        } catch (err) {
            console.error('Error while sending data:', err);
            alert('Failed to create the tournament. Please try again.');
        }
    });
    
    

});