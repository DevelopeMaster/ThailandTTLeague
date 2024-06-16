import { showErrorModal, fetchAllCoaches, listenerOfButtons, btnGoUp, languageControl, controlTextAreaCoach, fetchCities, fetchAdvertisements, breadCrumb } from './modules.js';
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

    const topBlockAdv = document.querySelector('.filterCoaches');
    fetchAdvertisements(topBlockAdv);

    listenerOfButtons();

    // fetchAllCoaches();

    
    const nameInput = document.getElementById('nameInput');
    const clubInput = document.getElementById('clubInput');
    const cityInput = document.getElementById('cityInput');

    const nameDropdown = document.getElementById('nameDropdown');
    const clubDropdown = document.getElementById('clubDropdown');
    const cityDropdown = document.getElementById('cityDropdown');
    const viewAllButton = document.getElementById('viewAllCoaches');
    
    const languageMap = {
        'russian': 'ru',
        'english': 'en',
        'thai': 'th'
    };

    const currentLang = localStorage.getItem('clientLang') || 'english';
    const langKey = languageMap[currentLang];

    let allCoaches = [];

    fetchAllCoaches();

    function fetchAllCoaches() {
        fetch(`/coaches`)
        .then(response => response.json())
        .then(coaches => {
            allCoaches = coaches;

            // Display first 12 coaches initially
            displayCoaches(coaches.slice(0, 12));
            viewAllButton.style.display = 'block';

            const names = [...new Set(coaches.flatMap(coach => [coach.name, coach.playerName]))];
            const clubs = [...new Set(coaches.map(coach => coach.club))];
            const cities = [...new Set(coaches.map(coach => coach.city[langKey]))];

            createDropdown(nameDropdown, names, nameInput);
            createDropdown(clubDropdown, clubs, clubInput);
            createDropdown(cityDropdown, cities, cityInput);
        })
        .catch(error => {
            console.error('Произошла ошибка:', error);
            showErrorModal('Database connection error');
        });
    }

    function createDropdown(dropdown, options, inputElement) {
        dropdown.innerHTML = '';
        options.forEach(option => {
            const div = document.createElement('div');
            div.textContent = option;
            div.addEventListener('click', () => {
                inputElement.value = option;
                dropdown.style.display = 'none';
                filterCoaches();
            });
            dropdown.appendChild(div);
        });
    }

    function updateDropdownList(dropdown, options, inputElement) {
        dropdown.innerHTML = '';
        const currentText = inputElement.value.toLowerCase();
        const filteredOptions = options.filter(option => option.toLowerCase().includes(currentText));

        filteredOptions.forEach(option => {
            const div = document.createElement('div');
            div.textContent = option;
            div.addEventListener('click', () => {
                inputElement.value = option;
                dropdown.style.display = 'none';
                filterCoaches();
            });
            dropdown.appendChild(div);
        });
        dropdown.style.display = 'block';
    }

    function filterCoaches() {
        const nameValue = nameInput.value.toLowerCase();
        const clubValue = clubInput.value.toLowerCase();
        const cityValue = cityInput.value.toLowerCase();

        const filteredCoaches = allCoaches.filter(coach => {
            const nameMatch = !nameValue || coach.name.toLowerCase().includes(nameValue) || coach.playerName.toLowerCase().includes(nameValue);
            const clubMatch = !clubValue || coach.club.toLowerCase().includes(clubValue);
            const cityMatch = !cityValue || coach.city[langKey].toLowerCase().includes(cityValue);
            return nameMatch && clubMatch && cityMatch;
        });
        displayCoaches(filteredCoaches);
    }

    function displayCoaches(coaches) {
        const container = document.querySelector('.coaches_content');
        container.innerHTML = '';
        coaches.forEach(coach => {
            let coachDiv = document.createElement('div');
            coachDiv.className = 'coaches_content_coach';

            let wrapLogoDiv = document.createElement('div');
            wrapLogoDiv.className = 'coaches_content_coach_wrapLogo';

            let logoDiv = document.createElement('div');
            logoDiv.className = 'coaches_content_coach_wrapLogo_logo';
            logoDiv.style.backgroundImage = `url('${coach.logo}')`;
            logoDiv.style.backgroundPosition = '50%';
            logoDiv.style.backgroundSize = 'cover';
            logoDiv.style.backgroundRepeat = 'no-repeat';

            wrapLogoDiv.appendChild(logoDiv);
            coachDiv.appendChild(wrapLogoDiv);

            let infoDiv = document.createElement('div');
            infoDiv.className = 'coaches_content_coach_info';

            let ratingDiv = document.createElement('div');
            ratingDiv.className = 'coaches_content_coach_info_rating';
            ratingDiv.textContent = coach.rating;

            let nameH4 = document.createElement('h4');
            nameH4.className = 'coaches_content_coach_info_name';
            nameH4.textContent = coach.name;

            let clubDiv = document.createElement('div');
            clubDiv.className = 'coaches_content_coach_info_club';

            let clubTitleSpan = document.createElement('span');
            clubTitleSpan.className = 'coaches_content_coach_info_title';
            let clubTitle = {
                'english': 'Club:',
                'thai': 'ชมรม:',
                'russian': 'Клуб:'
            };
            clubTitleSpan.textContent = clubTitle[localStorage.clientLang] || 'Club:';

            let clubNameP = document.createElement('p');
            clubNameP.textContent = coach.club;

            clubDiv.appendChild(clubTitleSpan);
            clubDiv.appendChild(clubNameP);

            let cityDiv = document.createElement('div');
            cityDiv.className = 'coaches_content_coach_info_city';

            let cityTitleSpan = document.createElement('span');
            cityTitleSpan.className = 'coaches_content_coach_info_title';
            let cityTitle = {
                'english': 'City:',
                'thai': 'เมือง:',
                'russian': 'Город:'
            };
            cityTitleSpan.textContent = cityTitle[localStorage.clientLang] || 'City:';

            let cityNameP = document.createElement('p');
            cityNameP.textContent = coach.city[langKey];

            cityDiv.appendChild(cityTitleSpan);
            cityDiv.appendChild(cityNameP);

            infoDiv.appendChild(ratingDiv);
            infoDiv.appendChild(nameH4);
            infoDiv.appendChild(clubDiv);
            infoDiv.appendChild(cityDiv);

            coachDiv.appendChild(infoDiv);

            container.appendChild(coachDiv);
        });
    }

    nameInput.addEventListener('input', () => {
        updateDropdownList(nameDropdown, [...new Set(allCoaches.flatMap(coach => [coach.name, coach.playerName]))], nameInput);
        filterCoaches();
    });
    clubInput.addEventListener('input', () => {
        updateDropdownList(clubDropdown, [...new Set(allCoaches.map(coach => coach.club))], clubInput);
        filterCoaches();
    });
    cityInput.addEventListener('input', () => {
        updateDropdownList(cityDropdown, [...new Set(allCoaches.map(coach => coach.city[langKey]))], cityInput);
        filterCoaches();
    });

    nameInput.addEventListener('focus', () => nameDropdown.style.display = 'block');
    clubInput.addEventListener('focus', () => clubDropdown.style.display = 'block');
    cityInput.addEventListener('focus', () => cityDropdown.style.display = 'block');

    nameInput.addEventListener('blur', () => setTimeout(() => nameDropdown.style.display = 'none', 200));
    clubInput.addEventListener('blur', () => setTimeout(() => clubDropdown.style.display = 'none', 200));
    cityInput.addEventListener('blur', () => setTimeout(() => cityDropdown.style.display = 'none', 200));

    viewAllButton.addEventListener('click', function(event) {
        console.log('есть');
        event.preventDefault();
        displayCoaches(allCoaches);
        viewAllButton.style.display = 'none';
    });
    
    


});

