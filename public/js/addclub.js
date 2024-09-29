import { createHeader, createFooter, showErrorModal, listenerOfButtons, btnGoUp, languageControl, controlTextAreaCoach, fetchCities, fetchAdvertisements, breadCrumb } from './modules.js';
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
document.addEventListener('DOMContentLoaded', function() {
    createHeader(localStorage.getItem('clientLang') || 'english');
    createFooter(localStorage.getItem('clientLang') || 'english');
    
    initializeApp();


    btnGoUp();
    
    languageControl();

    breadCrumb();

    const topBlockAdv = document.querySelector('.addClub');
    fetchAdvertisements(topBlockAdv);

    listenerOfButtons();

    controlTextAreaCoach('infoTournaments', '.textareaInfoTournamentsLimit');
    controlTextAreaCoach('info', '.textareaInfoLimit');

    const form = document.querySelector('#addClubForm');
    form.addEventListener('submit', function (event) {
        event.preventDefault();
        
        const translations = {
            english: {
                congratulations: 'Congratulations!',
                successful: "Request has been sent",
                serverError: "The server is not available. Please try again."
            },
            thai: {
                congratulations: 'ยินดีด้วย!',
                successful: "ส่งคำขอแล้ว",
                serverError: "เซิร์ฟเวอร์ไม่พร้อมใช้งาน โปรดลองอีกครั้ง"
            },
            russian: {
                congratulations: 'Поздравляем!',
                successful: "Запрос отправлен",
                serverError: "Сервер недоступен. Пожалуйста, попробуйте позже."
            }
        };

        const clientLang = localStorage.getItem('clientLang') || 'english';
        const translation = translations[clientLang] || translations['english'];

        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        data.requestDate = new Date();

        fetch('/api/addApplicationClub', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(translation.serverError);
            }
            return response.json();
        })
        .then(data => {
            if (data.status === 'error') {
                data.errors.forEach(error => {
                    showErrorModal(translation.serverError);
                    console.log(error.msg)
                });
            } else {
                document.querySelector('form').reset();
                document.querySelector('form').style.display = 'none';
                document.querySelector('.request_successfull').style.display = 'flex';
            }
        })
        .catch(error => {
            console.error('Fetch error:', error);
            showErrorModal(translation.serverError);
        });
    });
});

