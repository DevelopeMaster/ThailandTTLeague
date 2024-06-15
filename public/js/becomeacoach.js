import { showErrorModal, listenerOfButtons, btnGoUp, languageControl, controlTextAreaCoach, fetchCities, fetchAdvertisements, breadCrumb } from './modules.js';
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
    initializeApp();

    btnGoUp();
    
    languageControl();

    breadCrumb();

    const topBlockAdv = document.querySelector('.applyCoach');
    fetchAdvertisements(topBlockAdv);

    listenerOfButtons();


    controlTextAreaCoach('info', '.textareaInfoLimit');

    const form = document.querySelector('#applyCoachForm');
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

        fetch('/applyCoach', {
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
                // showErrorModal(translation.successful, translation.congratulations);
                // setTimeout(() => {
                //     const modal = document.getElementById("myModal");
                //     modal.style.display = "none";
                // }, 2000);
            }
        })
        .catch(error => {
            console.error('Fetch error:', error);
            showErrorModal(translation.serverError);
        });
    });
});

