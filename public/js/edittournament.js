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
    const tournamentId = document.getElementById('editTournament').dataset.tournamentid;
    const userId = document.getElementById('editTournament').dataset.userid;
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
            'response-ok': 'Tournament changed successfully!',
            'response-bad': 'Something wrong. Please try again.',
            'workingHours': 'Working hours',
            'city': 'City'
        },
        'ru': {
            'response-ok': 'Турнир успешно изменен!',
            'response-bad': 'Что-то пошло не так. Попробуйте еще раз.',
            'workingHours': 'Часы работы',
            'city': 'Город'
        },
        'th': {
            'response-ok': 'การแข่งขันได้รับการเปลี่ยนแปลงเรียบร้อยแล้ว!',
            'response-bad': 'มีบางอย่างผิดพลาด กรุณาลองอีกครั้ง',
            'workingHours': 'ชั่วโมงทำงาน:',
            'city': 'ที่อยู่'
        }
    };
    
    console.log(tournamentId);

    try {
        // Запрос к серверу для получения данных турнира
        const response = await fetch(`/get-data-tournament?tournamentId=${encodeURIComponent(tournamentId)}`);
        if (!response.ok) {
          throw new Error(`Error fetching tournament data: ${response.statusText}`);
        }
    
        const tournament = await response.json();
    
        
        const tournamentDate = new Date(tournament.date || tournament.datetime);
        const formattedDate = tournamentDate.toISOString().split('T')[0]; // Получаем YYYY-MM-DD
        const formattedTime = tournamentDate.getUTCHours().toString().padStart(2, '0') + ':' + tournamentDate.getUTCMinutes().toString().padStart(2, '0'); // HH:MM (время в UTC)
        // const formattedTime = tournamentDate.toTimeString().substring(0, 5); // Получаем HH:MM
        // Заполняем форму
        document.querySelector('#tournamentName').value = tournament.name || '';
        document.querySelector('input[name="tournamentdate"]').value = formattedDate || ''; // Должно быть в формате YYYY-MM-DD
        document.querySelector('input[name="tournamenttime"]').value = formattedTime || ''; // Должно быть в формате HH:MM
        document.querySelector('input[name="ratinglimit"]').value = tournament.ratingLimit || '';
        document.querySelector('input[name="phone"]').value = tournament.contacts || '';
        document.querySelector('input[name="tournamentprice"]').value = tournament.contribution || '';
        document.querySelector('input[name="qtyplayers"]').value = tournament.players?.length || '0'; // Число участников
        document.querySelector('#infoTournaments').value = tournament.prizes[lang] || tournament.prizes['en'] || tournament.prizes['ru'] || tournament.prizes['th'] || '';
    } catch (error) {
        console.error('Error populating the form:', error);
    }

    const form = document.getElementById('editTournamentForm');

    form.addEventListener('submit', async (event) => {
        event.preventDefault(); // Предотвращаем стандартное поведение формы

        const formData = new FormData(form); // Сбор данных из формы
        // const userId = document.querySelector('.addClub.addTournament').dataset.userid; // Получаем userId из атрибута data-userid
        formData.append('userid', userId); // Добавляем userId в данные формы
        formData.append('tournamentid', tournamentId);
        formData.append('language', lang);

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
            const response = await fetch('/edittournament', {
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