// передавать в блок на который нужно ровняться по высоте
export function fetchAdvertisements(block) {
    fetch(`/adv`)
        .then(response => response.json())
        .then(adv => {
            const advContent = document.querySelector('.adv');
            const containerElement = document.querySelector('.container');
            
            function updateAdvPosition() {
                const rightDistance = document.documentElement.clientWidth - containerElement.getBoundingClientRect().right;
                const topDistance = block.getBoundingClientRect().top + window.pageYOffset;
                advContent.style.right = rightDistance + 'px';
                advContent.style.top = topDistance + 'px';
            }

            window.addEventListener('resize', updateAdvPosition);
            updateAdvPosition();


            advContent.innerHTML = '';
            advContent.style.visibility = 'visible';

            adv.forEach(item => {

                if (new Date(item.expire) >= new Date()) {
                    const advBlock = document.createElement('a');
                    advBlock.href = item.link;
                    const advImg = document.createElement('img');
                    advImg.alt = 'adv';
                    advImg.src = item.image;
                    advBlock.appendChild(advImg);
                    advContent.appendChild(advBlock);

                }

                
            });
        })
        .catch(error => {
            console.error('Произошла ошибка:', error);
            showErrorModal('Database connection error');
        });
};

const languageMap = {
    'russian': 'ru',
    'english': 'en',
    'thai': 'th'
};

async function checkSession() {
    try {
        const response = await fetch('/check-session');
        if (!response.ok) {
            throw new Error('Failed to fetch session status');
        }
        const data = await response.json();
        // console.log('чек сессион', data);
        return data;
    } catch (error) {
        console.error('Error fetching session status:', error);
        return { loggedIn: false };
    }
}


export async function createHeader(language) {
    const headerTag = document.querySelector('.header');

    // Запрос к серверу для получения информации о сессии
    const sessionStatus = await checkSession();
    
    // console.log(sessionStatus.loggedIn);
    // console.log(language);
    const langMap = {
        'english': 'en',
        'thai': 'th',
        'russian': 'ru'
    }
    
    if (!sessionStatus.loggedIn) {
        if (language === 'english') {
            headerTag.innerHTML = `
                <div class="header_wrapper">
                    <div class="container">
                        <div class="header_top">
                            <div class="header_top_left">
                                <a class="logo" href="/">
                                    <img class="logo_img" src="/icons/logo.svg" alt="logo">
                                </a>
                                <label class="header_top_left_label" id="headerPC">
                                    <input id="playerSearchInput" class="header_top_left_input" type="text" placeholder="Search for a player">
                                    <button id="playerSearchButton" type="submit" class="header_top_left_search">
                                        <img src="/icons/search.svg" alt="search icon">
                                    </button>
                                    <div class="headerDropdownForm">
                                        <div class="headerDropdown-content" id="headerPlayerDropdown">
                                        <!-- options add from JS -->
                                        </div>
                                    </div>
                                </label>
                                
                            </div>
                            <div class="header_top_right" id="headerPC">
                                
                                <div class="header_langs">
                                    <button class="header_langs_dropbtnLangs selectedLanguage" id="selectedLanguage">
                                        <span class="languageText">ENG</span>
                                        <img src="/icons/chevron-down.svg" class="arrowLangs" alt="arrow">
                                    </button>
                                    <div class="header_langs_dropbtnLangs_content dropdown">
                                    <a href="#" data-lang="english">ENG</a>
                                    <a href="#" data-lang="russian">RUS</a>
                                    <a href="#" data-lang="thai">ไทย</a>
                                    </div>
                                </div>
                                <div class="header_buttons">
                                    <button class="header_btn-log btnLogin">
                                        Log in
                                    </button>
                                    <button class="header_btn-sign btnRegister">
                                        Sign in
                                    </button>
                                </div>
                            </div>
                            <button class="burger-btn" id="burger">
                                <span></span>
                                <span></span>
                                <span></span>
                            </button>
                        </div>
                    </div>
                </div>
                <div class="container">
                    <div class="header_bottom header_bottom_pc" id="headerPC">
                        <a class="header_bottom_category goToAllTournaments">
                            <img class="header_bottom_category-icon" src="/icons/tour.svg" alt="">
                            <p class="header_bottom_category-text">
                                Tournaments
                            </p>
                        </a>
                        <a class="header_bottom_category goToAllClubs">
                            <img class="header_bottom_category-icon" src="/icons/clubs.svg" alt="">
                            <p class="header_bottom_category-text">
                                Clubs
                            </p>
                        </a>
                        <a class="header_bottom_category goToAllPlayers">
                            <img class="header_bottom_category-icon" src="/icons/players.svg" alt="">
                            <p class="header_bottom_category-text">
                                Players
                            </p>
                        </a>
                        <a class="header_bottom_category goToAllCoaches">
                            <img class="header_bottom_category-icon" src="/icons/train.svg" alt="">
                            <p class="header_bottom_category-text">
                                Coaches
                            </p>
                        </a>
                        <a class="header_bottom_category goToAboutUs">
                            <img class="header_bottom_category-icon" src="/icons/about.svg" alt="">
                            <p class="header_bottom_category-text">
                                About Us
                            </p>
                        </a>                
                    </div>
    
                    
                </div>
                <div class="header_bottom header_bottom_mob" id="headerMob">
                <button class="header_bottom_mob_cross">
                    <img  src="/icons/x-circle.svg" alt="cross">
                </button>
                
                <label class="header_top_left_label">
                    <input id="playerSearchInput" class="header_top_left_input" type="text" placeholder="Search for a player">
                    <button id="playerSearchButton" class="header_top_left_search">
                        <img src="/icons/search.svg" alt="search icon">
                    </button>
                    <div class="headerDropdownForm">
                        <div class="headerDropdown-content" id="headerPlayerDropdown">
                        <!-- options add from JS -->
                        </div>
                    </div>
                </label>
                <a class="header_bottom_category guest">
                    <p class="header_category-text btnLogin">
                        Log in
                    </p>
                </a>
                <a class="header_bottom_category guest">
                    <p class="header_bottom_category-text btnRegister">
                        Sign in
                    </p>
                </a>
    
              
                <a class="header_bottom_category goToAllTournaments">
                    <img class="header_bottom_category-icon" src="/icons/tour.svg" alt="">
                    <p class="header_bottom_category-text">
                        Tournaments
                    </p>
                </a>
                <a class="header_bottom_category goToAllClubs">
                    <img class="header_bottom_category-icon" src="/icons/clubs.svg" alt="">
                    <p class="header_bottom_category-text">
                        Clubs
                    </p>
                </a>
                <a class="header_bottom_category goToAllPlayers">
                    <img class="header_bottom_category-icon" src="/icons/players.svg" alt="">
                    <p class="header_bottom_category-text">
                        Players
                    </p>
                </a>
                <a class="header_bottom_category goToAllCoaches">
                    <img class="header_bottom_category-icon" src="/icons/train.svg" alt="">
                    <p class="header_bottom_category-text">
                        Coaches
                    </p>
                </a>
                <a class="header_bottom_category goToAboutUs">
                    <img class="header_bottom_category-icon" src="/icons/about.svg" alt="">
                    <p class="header_bottom_category-text">
                        About Us
                    </p>
                </a>
                <div class="header_langs">
                    <button class="header_langs_dropbtnLangs header_bottom_category selectedLanguage" id="selectedLanguage">
                        <img class="header_bottom_category-icon" src="/icons/globe.svg" alt="">
                        <span class="languageText">ENG</span>
                        <img src="/icons/chevron-down.svg" class="arrowLangs" alt="arrow">
                    </button>
                    <div class="header_langs_dropbtnLangs_content dropdown">
                        <a href="#" data-lang="english">ENG</a>
                        <a href="#" data-lang="russian">RUS</a>
                        <a href="#" data-lang="thai">ไทย</a>
                    </div>
                </div>
                <div class="header_footer_contacts">
                    <div class="header_footer_contacts_title">
                        contacts
                    </div>
                    <a class="header_footer_contacts-mail" href="mailto:thailandttleague@gmail.com">
                        thailandttleague@gmail.com
                    </a>
                    <a class="footer_cantacts-phone" href="tel:+66951954053">
                        +66 95 195 4053
                    </a>
                </div>
            </div>
            `;
        } else if ( language === 'russian') {
            headerTag.innerHTML = `
                <div class="header_wrapper">
                    <div class="container">
                        <div class="header_top">
                            <div class="header_top_left">
                                <a class="logo" href="/">
                                    <img class="logo_img" src="/icons/logo.svg" alt="logo">
                                </a>
                                <label class="header_top_left_label" id="headerPC">
                                    <input id="playerSearchInput" class="header_top_left_input" type="text" placeholder="Поиск игрока">
                                    <button id="playerSearchButton" type="submit" class="header_top_left_search">
                                        <img src="/icons/search.svg" alt="search icon">
                                    </button>
                                    <div class="headerDropdownForm">
                                        <div class="headerDropdown-content" id="headerPlayerDropdown">
                                        <!-- options add from JS -->
                                        </div>
                                    </div>
                                </label>
                            </div>
                            <div class="header_top_right" id="headerPC">
                                
                                <div class="header_langs">
                                    <button class="header_langs_dropbtnLangs selectedLanguage" id="selectedLanguage">
                                        <span class="languageText">RUS</span>
                                        <img src="/icons/chevron-down.svg" class="arrowLangs" alt="arrow">
                                    </button>
                                    <div class="header_langs_dropbtnLangs_content dropdown">
                                    <a href="#" data-lang="english">ENG</a>
                                    <a href="#" data-lang="russian">RUS</a>
                                    <a href="#" data-lang="thai">ไทย</a>
                                    </div>
                                </div>
                                <div class="header_buttons">
                                    <button class="header_btn-log btnLogin">
                                        Войти
                                    </button>
                                    <button class="header_btn-sign btnRegister">
                                        Регистрация
                                    </button>
                                </div>
                            </div>
                            <button class="burger-btn" id="burger">
                                <span></span>
                                <span></span>
                                <span></span>
                            </button>
                        </div>
                    </div>
                </div>
                <div class="container">
                    <div class="header_bottom header_bottom_pc" id="headerPC">
                        <a class="header_bottom_category goToAllTournaments">
                            <img class="header_bottom_category-icon" src="/icons/tour.svg" alt="">
                            <p class="header_bottom_category-text">
                            Турниры
                            </p>
                        </a>
                        <a class="header_bottom_category goToAllClubs">
                            <img class="header_bottom_category-icon" src="/icons/clubs.svg" alt="">
                            <p class="header_bottom_category-text">
                            Клубы
                            </p>
                        </a>
                        <a class="header_bottom_category goToAllPlayers">
                            <img class="header_bottom_category-icon" src="/icons/players.svg" alt="">
                            <p class="header_bottom_category-text">
                            Игроки
                            </p>
                        </a>
                        <a class="header_bottom_category goToAllCoaches">
                            <img class="header_bottom_category-icon" src="/icons/train.svg" alt="">
                            <p class="header_bottom_category-text">
                            Тренеры
                            </p>
                        </a>
                        <a class="header_bottom_category goToAboutUs">
                            <img class="header_bottom_category-icon" src="/icons/about.svg" alt="">
                            <p class="header_bottom_category-text">
                            О Нас
                            </p>
                        </a>                
                    </div>
    
                    
                </div>
                <div class="header_bottom header_bottom_mob" id="headerMob">
                <button class="header_bottom_mob_cross">
                    <img  src="/icons/x-circle.svg" alt="cross">
                </button>
                
                <label class="header_top_left_label">
                    <input id="playerSearchInput" class="header_top_left_input" type="text" placeholder="Search for a player">
                    <button id="playerSearchButton" class="header_top_left_search">
                        <img src="/icons/search.svg" alt="search icon">
                    </button>
                    <div class="headerDropdownForm">
                        <div class="headerDropdown-content" id="headerPlayerDropdown">
                        <!-- options add from JS -->
                        </div>
                    </div>
                </label>
                <a class="header_bottom_category guest">
                    <p class="header_category-text btnLogin">
                        Войти
                    </p>
                </a>
                <a class="header_bottom_category guest">
                    <p class="header_bottom_category-text btnRegister">
                        Регистрация
                    </p>
                </a>
    
                
                <a class="header_bottom_category goToAllTournaments">
                    <img class="header_bottom_category-icon" src="/icons/tour.svg" alt="">
                    <p class="header_bottom_category-text">
                        Турниры
                    </p>
                </a>
                <a class="header_bottom_category goToAllClubs">
                    <img class="header_bottom_category-icon" src="/icons/clubs.svg" alt="">
                    <p class="header_bottom_category-text">
                        Клубы
                    </p>
                </a>
                <a class="header_bottom_category goToAllPlayers">
                    <img class="header_bottom_category-icon" src="/icons/players.svg" alt="">
                    <p class="header_bottom_category-text">
                        Игроки
                    </p>
                </a>
                <a class="header_bottom_category goToAllCoaches">
                    <img class="header_bottom_category-icon" src="/icons/train.svg" alt="">
                    <p class="header_bottom_category-text">
                        Тренеры
                    </p>
                </a>
                <a class="header_bottom_category goToAboutUs">
                    <img class="header_bottom_category-icon" src="/icons/about.svg" alt="">
                    <p class="header_bottom_category-text">
                        О Нас
                    </p>
                </a>
                <div class="header_langs">
                    <button class="header_langs_dropbtnLangs header_bottom_category selectedLanguage" id="selectedLanguage">
                        <img class="header_bottom_category-icon" src="/icons/globe.svg" alt="">
                        <span class="languageText">RUS</span>
                        <img src="/icons/chevron-down.svg" class="arrowLangs" alt="arrow">
                    </button>
                    <div class="header_langs_dropbtnLangs_content dropdown">
                        <a href="#" data-lang="english">ENG</a>
                        <a href="#" data-lang="russian">RUS</a>
                        <a href="#" data-lang="thai">ไทย</a>
                    </div>
                </div>
                <div class="header_footer_contacts">
                    <div class="header_footer_contacts_title">
                        Контакты
                    </div>
                    <a class="header_footer_contacts-mail" href="mailto:thailandttleague@gmail.com">
                        thailandttleague@gmail.com
                    </a>
                    <a class="footer_cantacts-phone" href="tel:+66951954053">
                        +66 95 195 4053
                    </a>
                </div>
            </div>
            `;
        } else if ( language === 'thai') {
            headerTag.innerHTML = `
                <div class="header_wrapper">
                    <div class="container">
                        <div class="header_top">
                            <div class="header_top_left">
                                <a class="logo" href="/">
                                    <img class="logo_img" src="/icons/logo.svg" alt="logo">
                                </a>
                                <label class="header_top_left_label" id="headerPC">
                                    <input id="playerSearchInput" class="header_top_left_input" type="text" placeholder="ค้นหาผู้เล่น">
                                    <button id="playerSearchButton" type="submit" class="header_top_left_search">
                                        <img src="/icons/search.svg" alt="search icon">
                                    </button>
                                    <div class="headerDropdownForm">
                                        <div class="headerDropdown-content" id="headerPlayerDropdown">
                                        <!-- options add from JS -->
                                        </div>
                                    </div>
                                </label>
                            </div>
                            <div class="header_top_right" id="headerPC">
                                
                                <div class="header_langs">
                                    <button class="header_langs_dropbtnLangs selectedLanguage" id="selectedLanguage">
                                        <span class="languageText">ไทย</span>
                                        <img src="/icons/chevron-down.svg" class="arrowLangs" alt="arrow">
                                    </button>
                                    <div class="header_langs_dropbtnLangs_content dropdown">
                                    <a href="#" data-lang="english">ENG</a>
                                    <a href="#" data-lang="russian">RUS</a>
                                    <a href="#" data-lang="thai">ไทย</a>
                                    </div>
                                </div>
                                <div class="header_buttons">
                                    <button class="header_btn-log btnLogin">
                                        เข้าสู่ระบบ
                                    </button>
                                    <button class="header_btn-sign btnRegister">
                                        ลงทะเบียน
                                    </button>
                                </div>
                            </div>
                            <button class="burger-btn" id="burger">
                                <span></span>
                                <span></span>
                                <span></span>
                            </button>
                        </div>
                    </div>
                </div>
                <div class="container">
                    <div class="header_bottom header_bottom_pc" id="headerPC">
                        <a class="header_bottom_category goToAllTournaments">
                            <img class="header_bottom_category-icon" src="/icons/tour.svg" alt="">
                            <p class="header_bottom_category-text">
                                การแข่งขัน
                            </p>
                        </a>
                        <a class="header_bottom_category goToAllClubs">
                            <img class="header_bottom_category-icon" src="/icons/clubs.svg" alt="">
                            <p class="header_bottom_category-text">
                                สโมสร
                            </p>
                        </a>
                        <a class="header_bottom_category goToAllPlayers">
                            <img class="header_bottom_category-icon" src="/icons/players.svg" alt="">
                            <p class="header_bottom_category-text">
                                ผู้เล่น
                            </p>
                        </a>
                        <a class="header_bottom_category goToAllCoaches">
                            <img class="header_bottom_category-icon" src="/icons/train.svg" alt="">
                            <p class="header_bottom_category-text">
                                โค้ชปิงปอง
                            </p>
                        </a>
                        <a class="header_bottom_category goToAboutUs">
                            <img class="header_bottom_category-icon" src="/icons/about.svg" alt="">
                            <p class="header_bottom_category-text">
                                เกี่ยวกับเรา
                            </p>
                        </a>                
                    </div>
    
                    
                </div>
                <div class="header_bottom header_bottom_mob" id="headerMob">
                <button class="header_bottom_mob_cross">
                    <img  src="/icons/x-circle.svg" alt="cross">
                </button>
                
                <label class="header_top_left_label">
                    <input id="playerSearchInput" class="header_top_left_input" type="text" placeholder="Search for a player">
                    <button id="playerSearchButton" class="header_top_left_search">
                        <img src="/icons/search.svg" alt="search icon">
                    </button>
                    <div class="headerDropdownForm">
                        <div class="headerDropdown-content" id="headerPlayerDropdown">
                        <!-- options add from JS -->
                        </div>
                    </div>
                </label>
                <a class="header_bottom_category guest">
                    <p class="header_category-text btnLogin">
                        เข้าสู่ระบบ
                    </p>
                </a>
                <a class="header_bottom_category guest">
                    <p class="header_bottom_category-text btnRegister">
                        ลงทะเบียน
                    </p>
                </a>
    
                <a class="header_bottom_category goToAllTournaments">
                    <img class="header_bottom_category-icon" src="/icons/tour.svg" alt="">
                    <p class="header_bottom_category-text">
                        การแข่งขัน
                    </p>
                </a>
                <a class="header_bottom_category goToAllClubs">
                    <img class="header_bottom_category-icon" src="/icons/clubs.svg" alt="">
                    <p class="header_bottom_category-text">
                        สโมสร
                    </p>
                </a>
                <a class="header_bottom_category goToAllPlayers">
                    <img class="header_bottom_category-icon" src="/icons/players.svg" alt="">
                    <p class="header_bottom_category-text">
                        ผู้เล่น
                    </p>
                </a>
                <a class="header_bottom_category goToAllCoaches">
                    <img class="header_bottom_category-icon" src="/icons/train.svg" alt="">
                    <p class="header_bottom_category-text">
                        โค้ชปิงปอง
                    </p>
                </a>
                <a class="header_bottom_category goToAboutUs">
                    <img class="header_bottom_category-icon" src="/icons/about.svg" alt="">
                    <p class="header_bottom_category-text">
                        เกี่ยวกับเรา
                    </p>
                </a>
                <div class="header_langs">
                    <button class="header_langs_dropbtnLangs header_bottom_category selectedLanguage" id="selectedLanguage">
                        <img class="header_bottom_category-icon" src="/icons/globe.svg" alt="">
                        <span class="languageText">ไทย</span>
                        <img src="/icons/chevron-down.svg" class="arrowLangs" alt="arrow">
                    </button>
                    <div class="header_langs_dropbtnLangs_content dropdown">
                        <a href="#" data-lang="english">ENG</a>
                        <a href="#" data-lang="russian">RUS</a>
                        <a href="#" data-lang="thai">ไทย</a>
                    </div>
                </div>
                <div class="header_footer_contacts">
                    <div class="header_footer_contacts_title">
                        ติดต่อเรา
                    </div>
                    <a class="header_footer_contacts-mail" href="mailto:thailandttleague@gmail.com">
                        thailandttleague@gmail.com
                    </a>
                    <a class="footer_cantacts-phone" href="tel:+66951954053">
                        +66 95 195 4053
                    </a>
                </div>
            </div>
            `;
        };

    } 
    
    else if (sessionStatus.loggedIn) {
        // console.log('хедер залогинен');
        const userId = localStorage.getItem('userId');
        const userType = localStorage.getItem('userType');
        
        
        if (userType === 'admin') {
            headerTag.style = 'position: fixed; background-color: #F8F8F8; width: 100%; height: 76px; display: flex; justify-content: space-between; z-index: 1000;';
            headerTag.classList.remove('header');
            headerTag.classList.add('admin_header');
            headerTag.innerHTML = `
                <div class="admin_logoWrapp">
                    <a class="adminlogo" href="/ru/dashboard/admin">
                        <img class="adminlogo_img" src="/icons/darklogo.svg" alt="logo">
                    </a>
                </div>
                <div class="admin_user">
                    <img src='/icons/adminLogo.svg' class="admin_user_img" alt="admin logo">
                </div>
                <div class="admin_profileMenu">
                    <a href="#" id="adminHome" class="logOut">Домой</a>
                    <a href="#" id="logOut" class="logOut">Выход</a>
                </div>
            `;
            const adminMenuBtn = document.querySelector('.admin_user');
            const adminMenu = document.querySelector('.admin_profileMenu');
            const logoutBtn = document.querySelector('#logOut');
            const adminHomeBtn = document.querySelector('#adminHome');
            
            adminMenuBtn.addEventListener('click', (e) => {
                e.preventDefault();
                adminMenu.classList.toggle('admin_profileMenu_openMenu');
            });

            adminHomeBtn.addEventListener('click', (e) => {
                e.preventDefault();
                window.location.href = '/ru/dashboard/admin';
            });

            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                logout();
            });
            return;
        };

        const userData = await getUserData(userId, userType);
        if (language === 'english') {
            headerTag.innerHTML = `
                <div class="header_wrapper">
                    <div class="container">
                        <div class="header_top">
                            <div class="header_top_left">
                                <a class="logo" href="/">
                                    <img class="logo_img" src="/icons/logo.svg" alt="logo">
                                </a>
                                <label class="header_top_left_label" id="headerPC">
                                    <input id="playerSearchInput" class="header_top_left_input" type="text" placeholder="Search for a player">
                                    <button id="playerSearchButton" type="submit" class="header_top_left_search">
                                        <img src="/icons/search.svg" alt="search icon">
                                    </button>
                                    <div class="headerDropdownForm">
                                        <div class="headerDropdown-content" id="headerPlayerDropdown">
                                        <!-- options add from JS -->
                                        </div>
                                    </div>
                                </label>
                            </div>
                            <div class="header_top_right" id="headerPC">
                        
                                <div class="header_langs">
                                    <button class="header_langs_dropbtnLangs selectedLanguage" id="selectedLanguage">
                                        <span class="languageText">ENG</span>
                                        <img src="/icons/chevron-down.svg" class="arrowLangs" alt="arrow">
                                    </button>
                                    <div class="header_langs_dropbtnLangs_content dropdown">
                                        <a href="#" data-lang="english">ENG</a>
                                        <a href="#" data-lang="russian">RUS</a>
                                        <a href="#" data-lang="thai">ไทย</a>
                                    </div>
                                </div>
                                <div class="header_buttons">
                                    <button class="header_account">
                                        <span class="accountName">${userData.fullname || userData.name || localStorage.getItem('userName')}</span>
                                        <img src="/icons/chevron-down.svg" class="arrowLangs" alt="arrow">
                                        <img class="header_account_avatar" src="${userData.logo || localStorage.getItem('userLogo') || '/icons/playerslogo/default_avatar.svg'}" alt="avatar">
                                    </button>
                                    
                                    <div class="header_account_content profileMenu">
                                        <a href="#" class="header_bottom_category logedIn myProfile" id="myProfile">
                                            <img class="header_bottom_category-icon" src="/icons/players.svg" alt="">
                                            <p class="header_bottom_category-text">
                                                My profile
                                            </p>
                                        </a>
                                        <a href="#" class="logOut">Log out</a>
                                    </div>
                                </div>
                            </div>
                            <button class="burger-btn" id="burger">
                                <span></span>
                                <span></span>
                                <span></span>
                            </button>
                        </div>
                    </div>
                </div>
                <div class="container">
                    <div class="header_bottom header_bottom_pc" id="headerPC">
                        <a class="header_bottom_category goToAllTournaments">
                            <img class="header_bottom_category-icon" src="/icons/tour.svg" alt="">
                            <p class="header_bottom_category-text">
                                Tournaments
                            </p>
                        </a>
                        <a class="header_bottom_category goToAllClubs">
                            <img class="header_bottom_category-icon" src="/icons/clubs.svg" alt="">
                            <p class="header_bottom_category-text">
                                Clubs
                            </p>
                        </a>
                        <a class="header_bottom_category goToAllPlayers">
                            <img class="header_bottom_category-icon" src="/icons/players.svg" alt="">
                            <p class="header_bottom_category-text">
                                Players
                            </p>
                        </a>
                        <a class="header_bottom_category goToAllCoaches">
                            <img class="header_bottom_category-icon" src="/icons/train.svg" alt="">
                            <p class="header_bottom_category-text">
                                Coaches
                            </p>
                        </a>
                        <a class="header_bottom_category goToAboutUs">
                            <img class="header_bottom_category-icon" src="/icons/about.svg" alt="">
                            <p class="header_bottom_category-text">
                                About Us
                            </p>
                        </a>                
                    </div>
    
                    
                </div>
                <div class="header_bottom header_bottom_mob" id="headerMob">
                <button class="header_bottom_mob_cross">
                    <img  src="/icons/x-circle.svg" alt="cross">
                </button>
                
                <label class="header_top_left_label">
                    <input id="playerSearchInput" class="header_top_left_input" type="text" placeholder="Search for a player">
                    <button id="playerSearchButton" class="header_top_left_search">
                        <img src="/icons/search.svg" alt="search icon">
                    </button>
                    <div class="headerDropdownForm">
                        <div class="headerDropdown-content" id="headerPlayerDropdown">
                        <!-- options add from JS -->
                        </div>
                    </div>
                </label>
    
                <a class="header_bottom_category logedIn myProfile">
                    <img class="header_bottom_category-icon" src="/icons/players.svg" alt="">
                    <p class="header_bottom_category-text">
                        My profile
                    </p>
                </a>
                <a class="header_bottom_category goToAllTournaments">
                    <img class="header_bottom_category-icon" src="/icons/tour.svg" alt="">
                    <p class="header_bottom_category-text">
                        Tournaments
                    </p>
                </a>
                <a class="header_bottom_category goToAllClubs">
                    <img class="header_bottom_category-icon" src="/icons/clubs.svg" alt="">
                    <p class="header_bottom_category-text">
                        Clubs
                    </p>
                </a>
                <a class="header_bottom_category goToAllPlayers">
                    <img class="header_bottom_category-icon" src="/icons/players.svg" alt="">
                    <p class="header_bottom_category-text">
                        Players
                    </p>
                </a>
                <a class="header_bottom_category goToAllCoaches">
                    <img class="header_bottom_category-icon" src="/icons/train.svg" alt="">
                    <p class="header_bottom_category-text">
                        Coaches
                    </p>
                </a>
                <a class="header_bottom_category goToAboutUs">
                    <img class="header_bottom_category-icon" src="/icons/about.svg" alt="">
                    <p class="header_bottom_category-text">
                        About Us
                    </p>
                </a>
                <a href="#" class="logOut">Log out</a>
                <div class="header_langs">
                    <button class="header_langs_dropbtnLangs header_bottom_category selectedLanguage" id="selectedLanguage">
                        <img class="header_bottom_category-icon" src="/icons/globe.svg" alt="">
                        <span class="languageText">ENG</span>
                        <img src="/icons/chevron-down.svg" class="arrowLangs" alt="arrow">
                    </button>
                    <div class="header_langs_dropbtnLangs_content dropdown">
                        <a href="#" data-lang="english">ENG</a>
                        <a href="#" data-lang="russian">RUS</a>
                        <a href="#" data-lang="thai">ไทย</a>
                    </div>
                </div>
                <div class="header_footer_contacts">
                    <div class="header_footer_contacts_title">
                        contacts
                    </div>
                    <a class="header_footer_contacts-mail" href="mailto:thailandttleague@gmail.com">
                        thailandttleague@gmail.com
                    </a>
                    <a class="footer_cantacts-phone" href="tel:+66951954053">
                        +66 95 195 4053
                    </a>
                </div>
            </div>
            `;
        } else if ( language === 'russian') {
            headerTag.innerHTML = `
                <div class="header_wrapper">
                    <div class="container">
                        <div class="header_top">
                            <div class="header_top_left">
                                <a class="logo" href="/">
                                    <img class="logo_img" src="/icons/logo.svg" alt="logo">
                                </a>
                                <label class="header_top_left_label" id="headerPC">
                                    <input id="playerSearchInput" class="header_top_left_input" type="text" placeholder="Поиск игрока">
                                    <button id="playerSearchButton" type="submit" class="header_top_left_search">
                                        <img src="/icons/search.svg" alt="search icon">
                                    </button>
                                    <div class="headerDropdownForm">
                                        <div class="headerDropdown-content" id="headerPlayerDropdown">
                                        <!-- options add from JS -->
                                        </div>
                                    </div>
                                </label>
                            </div>
                            <div class="header_top_right" id="headerPC">
                                
                                <div class="header_langs">
                                    <button class="header_langs_dropbtnLangs selectedLanguage" id="selectedLanguage">
                                        <span class="languageText">RUS</span>
                                        <img src="/icons/chevron-down.svg" class="arrowLangs" alt="arrow">
                                    </button>
                                    <div class="header_langs_dropbtnLangs_content dropdown">
                                    <a href="#" data-lang="english">ENG</a>
                                    <a href="#" data-lang="russian">RUS</a>
                                    <a href="#" data-lang="thai">ไทย</a>
                                    </div>
                                </div>
                                <div class="header_buttons">
                                    <button class="header_account">
                                        <span class="accountName">${userData.fullname || userData.name || localStorage.getItem('userName')}</span>
                                        <img src="/icons/chevron-down.svg" class="arrowLangs" alt="arrow">
                                        <img class="header_account_avatar" src="${userData.logo || localStorage.getItem('userLogo') || '/icons/playerslogo/default_avatar.svg'}" alt="avatar">
                                    </button>
                                    
                                    <div class="header_account_content profileMenu">
                                        <a href="#" class="header_bottom_category logedIn myProfile" id="myProfile">
                                            <img class="header_bottom_category-icon" src="/icons/players.svg" alt="">
                                            <p class="header_bottom_category-text">
                                                Мой профиль
                                            </p>
                                        </a>
                                        <a href="#" class="logOut">Выход</a>
                                    </div>
                                </div>
                            </div>
                            <button class="burger-btn" id="burger">
                                <span></span>
                                <span></span>
                                <span></span>
                            </button>
                        </div>
                    </div>
                </div>
                <div class="container">
                    <div class="header_bottom header_bottom_pc" id="headerPC">
                        <a class="header_bottom_category goToAllTournaments">
                            <img class="header_bottom_category-icon" src="/icons/tour.svg" alt="">
                            <p class="header_bottom_category-text">
                            Турниры
                            </p>
                        </a>
                        <a class="header_bottom_category goToAllClubs">
                            <img class="header_bottom_category-icon" src="/icons/clubs.svg" alt="">
                            <p class="header_bottom_category-text">
                            Клубы
                            </p>
                        </a>
                        <a class="header_bottom_category goToAllPlayers">
                            <img class="header_bottom_category-icon" src="/icons/players.svg" alt="">
                            <p class="header_bottom_category-text">
                            Игроки
                            </p>
                        </a>
                        <a class="header_bottom_category goToAllCoaches">
                            <img class="header_bottom_category-icon" src="/icons/train.svg" alt="">
                            <p class="header_bottom_category-text">
                            Тренеры
                            </p>
                        </a>
                        <a class="header_bottom_category goToAboutUs">
                            <img class="header_bottom_category-icon" src="/icons/about.svg" alt="">
                            <p class="header_bottom_category-text">
                            О Нас
                            </p>
                        </a>                
                    </div>
    
                    
                </div>
                <div class="header_bottom header_bottom_mob" id="headerMob">
                <button class="header_bottom_mob_cross">
                    <img  src="/icons/x-circle.svg" alt="cross">
                </button>
                
                <label class="header_top_left_label">
                    <input id="playerSearchInput" class="header_top_left_input" type="text" placeholder="Search for a player">
                    <button id="playerSearchButton" class="header_top_left_search">
                        <img src="/icons/search.svg" alt="search icon">
                    </button>
                    <div class="headerDropdownForm">
                        <div class="headerDropdown-content" id="headerPlayerDropdown">
                        <!-- options add from JS -->
                        </div>
                    </div>
                </label>
    
                <a class="header_bottom_category logedIn myProfile">
                    <img class="header_bottom_category-icon" src="/icons/players.svg" alt="">
                    <p class="header_bottom_category-text">
                        Мой профиль
                    </p>
                </a>
                <a class="header_bottom_category goToAllTournaments">
                    <img class="header_bottom_category-icon" src="/icons/tour.svg" alt="">
                    <p class="header_bottom_category-text">
                        Турниры
                    </p>
                </a>
                <a class="header_bottom_category goToAllClubs">
                    <img class="header_bottom_category-icon" src="/icons/clubs.svg" alt="">
                    <p class="header_bottom_category-text">
                        Клубы
                    </p>
                </a>
                <a class="header_bottom_category goToAllPlayers">
                    <img class="header_bottom_category-icon" src="/icons/players.svg" alt="">
                    <p class="header_bottom_category-text">
                        Игроки
                    </p>
                </a>
                <a class="header_bottom_category goToAllCoaches">
                    <img class="header_bottom_category-icon" src="/icons/train.svg" alt="">
                    <p class="header_bottom_category-text">
                        Тренеры
                    </p>
                </a>
                <a class="header_bottom_category goToAboutUs">
                    <img class="header_bottom_category-icon" src="/icons/about.svg" alt="">
                    <p class="header_bottom_category-text">
                        О Нас
                    </p>
                </a>
                <a href="#" class="logOut">Выход</a>
                <div class="header_langs">
                    <button class="header_langs_dropbtnLangs header_bottom_category selectedLanguage" id="selectedLanguage">
                        <img class="header_bottom_category-icon" src="/icons/globe.svg" alt="">
                        <span class="languageText">RUS</span>
                        <img src="/icons/chevron-down.svg" class="arrowLangs" alt="arrow">
                    </button>
                    <div class="header_langs_dropbtnLangs_content dropdown">
                        <a href="#" data-lang="english">ENG</a>
                        <a href="#" data-lang="russian">RUS</a>
                        <a href="#" data-lang="thai">ไทย</a>
                    </div>
                </div>
                <div class="header_footer_contacts">
                    <div class="header_footer_contacts_title">
                        Контакты
                    </div>
                    <a class="header_footer_contacts-mail" href="mailto:thailandttleague@gmail.com">
                        thailandttleague@gmail.com
                    </a>
                    <a class="footer_cantacts-phone" href="tel:+66951954053">
                        +66 95 195 4053
                    </a>
                </div>
            </div>
            `;
        } else if ( language === 'thai') {
            headerTag.innerHTML = `
                <div class="header_wrapper">
                    <div class="container">
                        <div class="header_top">
                            <div class="header_top_left">
                                <a class="logo" href="/">
                                    <img class="logo_img" src="/icons/logo.svg" alt="logo">
                                </a>
                                <label class="header_top_left_label" id="headerPC">
                                    <input id="playerSearchInput" class="header_top_left_input" type="text" placeholder="ค้นหาผู้เล่น">
                                    <button id="playerSearchButton" type="submit" class="header_top_left_search">
                                        <img src="/icons/search.svg" alt="search icon">
                                    </button>
                                    <div class="headerDropdownForm">
                                        <div class="headerDropdown-content" id="headerPlayerDropdown">
                                        <!-- options add from JS -->
                                        </div>
                                    </div>
                                </label>
                            </div>
                            <div class="header_top_right" id="headerPC">
                                
                                <div class="header_langs">
                                    <button class="header_langs_dropbtnLangs selectedLanguage" id="selectedLanguage">
                                        <span class="languageText">ไทย</span>
                                        <img src="/icons/chevron-down.svg" class="arrowLangs" alt="arrow">
                                    </button>
                                    <div class="header_langs_dropbtnLangs_content dropdown">
                                    <a href="#" data-lang="english">ENG</a>
                                    <a href="#" data-lang="russian">RUS</a>
                                    <a href="#" data-lang="thai">ไทย</a>
                                    </div>
                                </div>
                                <div class="header_buttons">
                                    <button class="header_account">
                                        <span class="accountName">${userData.fullname || userData.name || localStorage.getItem('userName')}</span>
                                        <img src="/icons/chevron-down.svg" class="arrowLangs" alt="arrow">
                                        <img class="header_account_avatar" src="${userData.logo || localStorage.getItem('userLogo') || '/icons/playerslogo/default_avatar.svg'}" alt="avatar">
                                    </button>
                                    
                                    <div class="header_account_content profileMenu">
                                        <a href="#" class="header_bottom_category logedIn myProfile" id="myProfile">
                                            <img class="header_bottom_category-icon" src="/icons/players.svg" alt="">
                                            <p class="header_bottom_category-text">
                                                ประวัติของฉัน
                                            </p>
                                        </a>
                                        <a href="#" class="logOut">ออก</a>
                                    </div>
                                </div>
                            </div>
                            <button class="burger-btn" id="burger">
                                <span></span>
                                <span></span>
                                <span></span>
                            </button>
                        </div>
                    </div>
                </div>
                <div class="container">
                    <div class="header_bottom header_bottom_pc" id="headerPC">
                        <a class="header_bottom_category goToAllTournaments">
                            <img class="header_bottom_category-icon" src="/icons/tour.svg" alt="">
                            <p class="header_bottom_category-text">
                                การแข่งขัน
                            </p>
                        </a>
                        <a class="header_bottom_category goToAllClubs">
                            <img class="header_bottom_category-icon" src="/icons/clubs.svg" alt="">
                            <p class="header_bottom_category-text">
                                สโมสร
                            </p>
                        </a>
                        <a class="header_bottom_category goToAllPlayers">
                            <img class="header_bottom_category-icon" src="/icons/players.svg" alt="">
                            <p class="header_bottom_category-text">
                                ผู้เล่น
                            </p>
                        </a>
                        <a class="header_bottom_category goToAllCoaches">
                            <img class="header_bottom_category-icon" src="/icons/train.svg" alt="">
                            <p class="header_bottom_category-text">
                                โค้ชปิงปอง
                            </p>
                        </a>
                        <a class="header_bottom_category goToAboutUs">
                            <img class="header_bottom_category-icon" src="/icons/about.svg" alt="">
                            <p class="header_bottom_category-text">
                                เกี่ยวกับเรา
                            </p>
                        </a>                
                    </div>
    
                    
                </div>
                <div class="header_bottom header_bottom_mob" id="headerMob">
                <button class="header_bottom_mob_cross">
                    <img  src="/icons/x-circle.svg" alt="cross">
                </button>
                
                <label class="header_top_left_label">
                    <input id="playerSearchInput" class="header_top_left_input" type="text" placeholder="Search for a player">
                    <button id="playerSearchButton" class="header_top_left_search">
                        <img src="/icons/search.svg" alt="search icon">
                    </button>
                    <div class="headerDropdownForm">
                        <div class="headerDropdown-content" id="headerPlayerDropdown">
                        <!-- options add from JS -->
                        </div>
                    </div>
                </label>
    
                <a class="header_bottom_category logedIn myProfile" >
                    <img class="header_bottom_category-icon" src="/icons/players.svg" alt="">
                    <p class="header_bottom_category-text">
                        ประวัติของฉัน
                    </p>
                </a>
                <a class="header_bottom_category goToAllTournaments">
                    <img class="header_bottom_category-icon" src="/icons/tour.svg" alt="">
                    <p class="header_bottom_category-text">
                        การแข่งขัน
                    </p>
                </a>
                <a class="header_bottom_category goToAllClubs">
                    <img class="header_bottom_category-icon" src="/icons/clubs.svg" alt="">
                    <p class="header_bottom_category-text">
                        สโมสร
                    </p>
                </a>
                <a class="header_bottom_category goToAllPlayers">
                    <img class="header_bottom_category-icon" src="/icons/players.svg" alt="">
                    <p class="header_bottom_category-text">
                        ผู้เล่น
                    </p>
                </a>
                <a class="header_bottom_category goToAllCoaches">
                    <img class="header_bottom_category-icon" src="/icons/train.svg" alt="">
                    <p class="header_bottom_category-text">
                        โค้ชปิงปอง
                    </p>
                </a>
                <a class="header_bottom_category goToAboutUs">
                    <img class="header_bottom_category-icon" src="/icons/about.svg" alt="">
                    <p class="header_bottom_category-text">
                        เกี่ยวกับเรา
                    </p>
                </a>
                <a href="#" class="logOut">ออก</a>
                <div class="header_langs">
                    <button class="header_langs_dropbtnLangs header_bottom_category selectedLanguage" id="selectedLanguage">
                        <img class="header_bottom_category-icon" src="/icons/globe.svg" alt="">
                        <span class="languageText">ไทย</span>
                        <img src="/icons/chevron-down.svg" class="arrowLangs" alt="arrow">
                    </button>
                    <div class="header_langs_dropbtnLangs_content dropdown">
                        <a href="#" data-lang="english">ENG</a>
                        <a href="#" data-lang="russian">RUS</a>
                        <a href="#" data-lang="thai">ไทย</a>
                    </div>
                </div>
                <div class="header_footer_contacts">
                    <div class="header_footer_contacts_title">
                        ติดต่อเรา
                    </div>
                    <a class="header_footer_contacts-mail" href="mailto:thailandttleague@gmail.com">
                        thailandttleague@gmail.com
                    </a>
                    <a class="footer_cantacts-phone" href="tel:+66951954053">
                        +66 95 195 4053
                    </a>
                </div>
            </div>
            `;
        };
    }

    // function chevronRotate(chevron) {
    //     chevron.style.transform = 'rotateZ(180deg)';
    // }

    let allPlayers = [];

    // Функция для загрузки всех игроков при загрузке страницы
    async function loadAllPlayers() {
        try {
            const response = await fetch('/get-players');
            if (!response.ok) {
                throw new Error('Failed to load players');
            }

            allPlayers = await response.json();
        } catch (error) {
            console.error('Error loading all players:', error);
        }
    }
    
    // Загружаем всех игроков при загрузке страницы
    // document.addEventListener('DOMContentLoaded', loadAllPlayers);
    await loadAllPlayers();
    // console.log(allPlayers);
    const searchInput = document.getElementById('playerSearchInput');
    const searchDropdown = document.getElementById('headerPlayerDropdown');
    
    // Обработчик ввода в инпут
    searchInput.addEventListener('input', handleInput(searchInput, searchInput.nextElementSibling.nextElementSibling));

    document.addEventListener('input', function(event) {
        if (event.target.id === 'playerSearchInput') {
            console.log(event.target.nextElementSibling.nextElementSibling);
            const dropDownWrapp = event.target.nextElementSibling.nextElementSibling;
            handleInput(event.target, dropDownWrapp);
        }
    });


    function handleInput(searchInput, dropDownWrapp) {
        // console.log(allPlayers);
        const query = searchInput.value.trim().toLowerCase();
        const searchDropdown = dropDownWrapp.querySelector('#headerPlayerDropdown');
        // console.log(query);
        // console.log(dropDownWrapp.querySelector('#headerPlayerDropdown'));
        if (query) {
            const filteredPlayers = allPlayers.filter(player => player.name ? player.name.toLowerCase().includes(query) : player.fullname.toLowerCase().includes(query) || (player.nickname ? player.nickname.toLowerCase().includes(query) : false));
            updateDropdown(filteredPlayers, searchDropdown);
        } else {
            searchDropdown.innerHTML = '';
            searchDropdown.style.display = 'none';
        }
    }
    const translation = {
        'Нет совпадений': {
            'english': 'No matches',
            'russian': 'Нет совпадений',
            'thai': 'ไม่มีการจับคู่'
        }
    }

    function updateDropdown(players, searchDropdown) {
        searchDropdown.innerHTML = '';
    
        // console.log(players);
        if (players.length > 0) {
            players.forEach(player => {
                const option = document.createElement('div');
                option.textContent = `${player.name || player.fullname}`; // Отображаем имя игрока
                if (player.nickname) {
                    const optionSpan = document.createElement('span');
                    optionSpan.textContent = `(${player.nickname})`;
                    option.appendChild(optionSpan);
                }
                option.addEventListener('click', () => {
                    searchInput.value = player.name || player.fullname;
                    searchDropdown.style.display = 'none';
                    window.location.href = `/${langMap[language]}/allplayers/${player._id}`;
                    // console.log(langMap[language]);
                });
                searchDropdown.appendChild(option);
            });
    
            searchDropdown.style.display = 'block'; // Показываем список
        } else {
            // Если совпадений нет
            const noMatchOption = document.createElement('div');
            noMatchOption.textContent = translation['Нет совпадений'][language];
            searchDropdown.appendChild(noMatchOption);
            searchDropdown.style.display = 'block'; // Показываем список с уведомлением
        }
    }
    
    // Закрытие выпадающего списка при клике вне его области
    // document.addEventListener('click', (event) => {
    //     if (!searchInput.contains(event.target) && !searchDropdown.contains(event.target)) {
    //         searchDropdown.style.display = 'none';
    //     }
    // });
    
    

    document.addEventListener('click', function(event) {
        if (event.target.closest('.logOut')) {
            event.preventDefault();
            logout();
        }

        if (!searchInput.contains(event.target) && !searchDropdown.contains(event.target)) {
            searchDropdown.style.display = 'none';
        }
        
        if (event.target.closest('.header_account')) {
            if (document.querySelector('.profileMenu').classList.contains('header_account_content_openMenu')) {
                chevronRotate(document.querySelector('.header_account img'), false);
            } else {
                chevronRotate(document.querySelector('.header_account img'), true);
            }
            document.querySelector('.profileMenu').classList.toggle('header_account_content_openMenu');
        }
        if (event.target.closest('.myProfile')) {
            event.preventDefault();
            const userType = localStorage.getItem('userType');
            if (userType === 'user') {
                redirectToDashboard(userType);
                // window.location.href = `/${languageMap[localStorage.clientLang]}/user_dashboard`;
            } else if (userType === 'coach') {
                redirectToDashboard(userType);
                // window.location.href = `/${languageMap[localStorage.clientLang]}/coach_dashboard`;
            } else if (userType === 'club') {
                redirectToDashboard(userType);
                // window.location.href = `/${languageMap[localStorage.clientLang]}/club_dashboard`;
            } else if (userType === 'admin') {
                redirectToDashboard(userType);
                // window.location.href = `/${languageMap[localStorage.clientLang]}/admin_dashboard`;
            }
            
        }
    })
    languageControl();
};



function chevronRotate(chevron, rotate = true) {
    chevron.style.transform = rotate ? 'rotateX(180deg)' : 'rotateX(0deg)';
    
}

async function getUserData(userId, userType) {
    const cachedUser = localStorage.getItem('userData');

    if (cachedUser) {
        const userData = JSON.parse(cachedUser);
        if (userData.userId === userId) {
            // console.log("Using cached data");
            // return userData;
            if (userData.logo === localStorage.getItem('userLogo')) {
                // console.log("Using cached data");
                return userData;
            }
        }

        // if (userData.logo !== localStorage.getItem('userLogo')) {
        //     console.log("Using cached data");
        //     return userData;
        // }
    }

    try {
        const response = await fetch(`/userForHeader/${userId}/${userType}`);
        if (!response.ok) {
            throw new Error('Failed to fetch user data');
        }

        const userData = await response.json();

        // Сохраняем данные в localStorage
        localStorage.setItem('userData', JSON.stringify({
            userId: userId,
            fullname: userData.fullname || userData.name,
            nickname: userData.nickname,
            logo: userData.logo
        }));

        return userData;
    } catch (error) {
        console.error('Error fetching user data:', error.message);
        return null; // Можно обработать ошибку, если требуется
    }
}

function redirectToDashboard(userType) {
    const languageMap = {
        'russian': 'ru',
        'english': 'en',
        'thai': 'th'
    };
    const clientLang = localStorage.getItem('clientLang') || 'english';
    const userId = localStorage.getItem('userId');
    // Логи для проверки значений
    console.log('Client Language:', languageMap[clientLang]);
    console.log('User Type:', userType);
    window.location.href = `/${languageMap[clientLang]}/dashboard/${userType}/${userId}`;
}

export function createFooter(language) {
    const footerTag = document.querySelector('.footer');
    if (language === 'english') {
        footerTag.innerHTML = `
            <div class="container">
                <div class="footer_wrap">
                    <a class="logo" href="#">
                    <img class="logo_img" src="/icons/logo.svg" alt="logo">
                    </a>
                    <div class="footer_menu">
                    <div class="footer_menu_path">
                        <a class="goToAllTournaments" href="#">Tournaments</a>
                        <a class="goToAllClubs" href="#">Clubs</a>
                        <a class="goToAllPlayers" href="#">Players</a>
                    </div>
                    <div class="footer_menu_path">
                        <a class="goToAllCoaches" href="#">Coaches</a>
                        <a href="#" class='goToAboutUs'>About Us</a>
                    </div>
                    </div>
                    <div class="footer_right">
                    <div class="footer_right_contacts">
                        <h4>Contacts</h4>
                        <a class="footer_mail" href="mailto:thailandttleague@gmail.com">thailandttleague@gmail.com</a>
                        <a href="tel:+66951954053">+66 95 195 4053</a>
                    </div>
                    <div class="footer_right_social">
                        <h4>Social media</h4>
                        <div class="footer_right_social_list">
                        <a href="#">
                            <img src="/icons/instagram.svg" alt="instagram">
                        </a>
                        <a href="#">
                            <img src="/icons/facebook.svg" alt="facebook">
                        </a>
                        <a href="#">
                            <img src="/icons/line-orange.svg" alt="">
                        </a>
                        </div>
                    </div>
                    </div>
                    
                </div>
                <span class="footer_laws">© 2024 Thailand TT League. All Rights Reserved</span>
            </div>
        `;
    } else if (language === 'russian') {
        footerTag.innerHTML = `
            <div class="container">
                <div class="footer_wrap">
                    <a class="logo" href="#">
                    <img class="logo_img" src="/icons/logo.svg" alt="logo">
                    </a>
                    <div class="footer_menu">
                    <div class="footer_menu_path">
                        <a class="goToAllTournaments" href="#">Турниры</a>
                        <a class="goToAllClubs" href="#">Клубы</a>
                        <a class="goToAllPlayers" href="#">Игроки</a>
                    </div>
                    <div class="footer_menu_path">
                        <a class="goToAllCoaches" href="#">Тренеры</a>
                        <a href="#" class='goToAboutUs'>О Нас</a>
                    </div>
                    </div>
                    <div class="footer_right">
                    <div class="footer_right_contacts">
                        <h4>Контакты</h4>
                        <a class="footer_mail" href="mailto:thailandttleague@gmail.com">thailandttleague@gmail.com</a>
                        <a href="tel:+66951954053">+66 95 195 4053</a>
                    </div>
                    <div class="footer_right_social">
                        <h4>Социальные сети</h4>
                        <div class="footer_right_social_list">
                        <a href="#">
                            <img src="/icons/instagram.svg" alt="instagram">
                        </a>
                        <a href="#">
                            <img src="/icons/facebook.svg" alt="facebook">
                        </a>
                        <a href="#">
                            <img src="/icons/line-orange.svg" alt="">
                        </a>
                        </div>
                    </div>
                    </div>
                    
                </div>
                <span class="footer_laws">© 2024 Thailand TT League. All Rights Reserved</span>
            </div>
        `;
    } else if (language === 'thai') {
        footerTag.innerHTML = `
            <div class="container">
                <div class="footer_wrap">
                    <a class="logo" href="#">
                    <img class="logo_img" src="/icons/logo.svg" alt="logo">
                    </a>
                    <div class="footer_menu">
                    <div class="footer_menu_path">
                        <a class="goToAllTournaments" href="#">การแข่งขัน</a>
                        <a class="goToAllClubs" href="#">สโมสร</a>
                        <a class="goToAllPlayers" href="#">ผู้เล่น</a>
                    </div>
                    <div class="footer_menu_path">
                        <a class="goToAllCoaches" href="#">โค้ชปิงปอง</a>
                        <a href="#" class='goToAboutUs'>รูปภาพและวิดีโอ</a>
                    </div>
                    </div>
                    <div class="footer_right">
                    <div class="footer_right_contacts">
                        <h4>ติดต่อเรา</h4>
                        <a class="footer_mail" href="mailto:thailandttleague@gmail.com">thailandttleague@gmail.com</a>
                        <a href="tel:+66951954053">+66 95 195 4053</a>
                    </div>
                    <div class="footer_right_social">
                        <h4>ช่องทางออนไลน์</h4>
                        <div class="footer_right_social_list">
                        <a href="#">
                            <img src="/icons/instagram.svg" alt="instagram">
                        </a>
                        <a href="#">
                            <img src="/icons/facebook.svg" alt="facebook">
                        </a>
                        <a href="#">
                            <img src="/icons/line-orange.svg" alt="">
                        </a>
                        </div>
                    </div>
                    </div>
                    
                </div>
                <span class="footer_laws">© 2024 Thailand TT League. All Rights Reserved</span>
            </div>
        `;
    }

    
}

let allClubs;
async function fetchAllClubs() {
    try {
        const response = await fetch(`/clubs`);
        const clubs = await response.json();
        allClubs = clubs;

    } catch (error) {
        console.error('Произошла ошибка:', error);
        showErrorModal('Database connection error');
    }
}

export async function fetchPastTournaments() {
   
    await fetchAllClubs();

    fetch('/get-past-tournaments')
      .then(response => response.json())
      .then(data => {
        
        let pastTournaments = data.filter(tournament => new Date(tournament.datetime) <= new Date());
        pastTournaments.sort((a, b) => new Date(b.datetime) - new Date(a.datetime)).slice(0, 6);
        pastTournaments = pastTournaments.slice(0, 6);

        pastTournaments.forEach(tournament => {
            let pastTournamentDiv = document.createElement('div');
            pastTournamentDiv.className = 'last_tournaments_tournament';

            let clubDateDiv = document.createElement('div');
            clubDateDiv.className = 'last_tournaments_tournament_clubDate';

            let dateDiv = document.createElement('div');
            dateDiv.className = 'last_tournaments_tournament_clubDate_date';

            let img = document.createElement('img');
            img.src = '/icons/ttrocket.svg';
            img.alt = 'table tennis rocket';

            const languageMap = {
                'russian': 'ru',
                'english': 'en',
                'thai': 'th'
            };
            let langMap = {'english': 'en-US', 'thai': 'th-TH', 'russian': 'ru-RU'};
            let lang = langMap[localStorage.getItem('clientLang')] || 'en-US';
            let span = document.createElement('span');
            let tournamentDate = new Date(tournament.datetime);
            let dayOfWeek = tournamentDate.toLocaleDateString(lang, { weekday: 'long' });
            let formattedDate = `${dayOfWeek} ${String(tournamentDate.getDate()).padStart(2, '0')}.${String(tournamentDate.getMonth() + 1).padStart(2, '0')}.${tournamentDate.getFullYear()}`;
            span.textContent = formattedDate;

            dateDiv.appendChild(img);
            dateDiv.appendChild(span);

            const clientLang = languageMap[localStorage.getItem('clientLang')];

            let club;
            if (allClubs) {
                club = allClubs.find(obj => obj.name.toLowerCase() === tournament.club.name.toLowerCase());
            }
            let pastClubDiv = document.createElement('a');

            if (club && club._id) {
                pastClubDiv.href = `/${clientLang}/allclubs/${club._id}`;
            } else {
                console.log('Клуб не найден или у клуба нет ID');
                // Можете добавить альтернативное действие, если клуб не найден
            }
           
            pastClubDiv.className = 'last_tournaments_tournament_clubDate_club';
            pastClubDiv.style = `color: #fff; text-decoration: none;`;
            let pastClubLogoDiv = document.createElement('div');
            pastClubLogoDiv.className = 'clubLogo';
            pastClubLogoDiv.style.cssText = `background-image: url('${tournament.club.logo}'); background-position: 50%; background-size: cover; background-repeat: no-repeat;`;

            let pastClubNameSpan = document.createElement('span');
            pastClubNameSpan.textContent = tournament.club.name;

            pastClubDiv.appendChild(pastClubLogoDiv);
            pastClubDiv.appendChild(pastClubNameSpan);

            clubDateDiv.appendChild(dateDiv);
            clubDateDiv.appendChild(pastClubDiv);

            pastTournamentDiv.appendChild(clubDateDiv);

            let winnersDiv = document.createElement('div');
            winnersDiv.className = 'last_tournaments_tournament_winners';

            

            // tournament.players.sort((a, b) => a.place - b.place).forEach(player => {
            //     let winnerLink = document.createElement('a');
            //     winnerLink.href = `/${clientLang}/allplayers//${player.id}`;  // ------------------------------------------------------------------ссылка на лк
            //     winnerLink.className = `last_tournaments_tournament_winners_${player.place}`;
            //     let winnerImg = document.createElement('img');
            //     winnerImg.src = `/icons/${player.place}st-medal.svg`;
            //     winnerImg.alt = `${player.place} place`;
            //     let winnerSpan = document.createElement('span');
            //     winnerSpan.textContent = player.fullname;
            //     winnerLink.appendChild(winnerImg);
            //     winnerLink.appendChild(winnerSpan);
            //     winnersDiv.appendChild(winnerLink);
            // });

            tournament.players
            .sort((a, b) => a.place - b.place) // Сортируем по месту
            .forEach(player => {
                if (player.place >= 1 && player.place <= 3) { // Проверяем, входит ли место в топ-3
                    let winnerLink = document.createElement('a');
                    winnerLink.href = `/${clientLang}/allplayers/${player.id}`; // Ссылка на личный кабинет
                    winnerLink.className = `last_tournaments_tournament_winners_${player.place}`;
                    
                    let winnerImg = document.createElement('img');
                    winnerImg.src = `/icons/${player.place}st-medal.svg`;
                    winnerImg.alt = `${player.place} place`;
                    
                    let winnerSpan = document.createElement('span');
                    winnerSpan.textContent = player.fullname;
                    
                    winnerLink.appendChild(winnerImg);
                    winnerLink.appendChild(winnerSpan);
                    winnersDiv.appendChild(winnerLink);
                }
            });
            
            pastTournamentDiv.appendChild(winnersDiv);

            let aditInfoDiv = document.createElement('div');
            aditInfoDiv.className = 'last_tournaments_tournament_aditInfo';

            let playersLimitDiv = document.createElement('div');
            playersLimitDiv.className = 'last_tournaments_tournament_aditInfo_playersLimit';

            let pastPlayersDiv = document.createElement('div');
            pastPlayersDiv.className = 'last_tournaments_tournament_aditInfo_playersLimit_players';
            let pastPlayersImg = document.createElement('img');
            pastPlayersImg.src = '/icons/user.svg';
            pastPlayersImg.alt = 'person';
            let pastPlayersSpan = document.createElement('span');
            pastPlayersSpan.textContent = tournament.players.length;
            pastPlayersDiv.appendChild(pastPlayersImg);
            pastPlayersDiv.appendChild(pastPlayersSpan);

            let pastRestrictionStatusDiv = document.createElement('div');
            pastRestrictionStatusDiv.className = 'restrictionStatus';
            pastRestrictionStatusDiv.style.background = '#ADADAD';
            let pastRestrictionDiv = document.createElement('div');
            pastRestrictionDiv.className = 'restriction';
            pastRestrictionDiv.textContent = tournament.restrictions;
            pastRestrictionStatusDiv.appendChild(pastRestrictionDiv);

            playersLimitDiv.appendChild(pastPlayersDiv);
            playersLimitDiv.appendChild(pastRestrictionStatusDiv);

            // const languageMap = {
            //     'russian': 'ru',
            //     'english': 'en',
            //     'thai': 'th'
            // };
            const currentLang = localStorage.getItem('clientLang');

            let moreDetailsLink = document.createElement('a');
            moreDetailsLink.href = `/${languageMap[currentLang]}/tournaments/${tournament._id}`;
            let moreDetailsText = {
                'english': 'More details',
                'thai': 'รายละเอียดเพิ่มเติม',
                'russian': 'Подробнее'
            };
            moreDetailsLink.textContent = moreDetailsText[localStorage.clientLang] || 'More details';

            aditInfoDiv.appendChild(playersLimitDiv);
            aditInfoDiv.appendChild(moreDetailsLink);

            pastTournamentDiv.appendChild(aditInfoDiv);
            document.querySelector('.last_tournaments').appendChild(pastTournamentDiv);

        });
      })
    .catch(error => console.error('Error:', error));
};

async function fetchPlayerDetails(playerIds) {
    return fetch('/get-playerIds', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ playerIds }),
    })
    .then(response => response.json())
    .catch(error => {
        console.error('Error fetching player details:', error);
        return [];
    });
}

export async function fetchFutureTournaments() {
    const languageMap = {
        'russian': 'ru',
        'english': 'en',
        'thai': 'th'
    };

    fetch('/get-future-tournaments')
        .then(response => response.json())
        .then(data => {
            // let allClubs;
            // fetchAllClubs();
            let futureTournaments = data.filter(tournament => new Date(tournament.datetime) > new Date());
            futureTournaments.sort((a, b) => new Date(a.datetime) - new Date(b.datetime));
            futureTournaments = futureTournaments.slice(0, 10);
 
            let currentDay = '';
            let allPlayerIds = [...new Set(
                futureTournaments.flatMap(tournament =>
                    Array.isArray(tournament.players) 
                        ? tournament.players.map(player => player._id)
                        : [] // Возвращаем пустой массив, если игроков нет
                )
            )];
            
           
            console.log(allPlayerIds);
            fetchPlayerDetails(allPlayerIds).then(allPlayers => {
                console.log(allPlayers);
                let playerMap = Object.fromEntries(allPlayers.map(player => [player._id, player]));
                console.log(playerMap);

                

                futureTournaments.forEach(tournament => {
                    // Преобразуем идентификаторы в строковый формат
                    // console.log(tournament.players);
                    // let players = tournament.players
                    //     .map(id => playerMap[String(id)]) // Преобразование `id` в строку
                    //     .filter(player => player);  
                    let players;

                    if (tournament.players && Array.isArray(tournament.players)) {
                        let tournamentPlayerIds = tournament.players.map(player => player._id); // Массив всех _id игроков турнира

                        players = allPlayers.filter(player => tournamentPlayerIds.includes(player._id));// Исключаем игроков, которые не найдены
                    
                        if (players.length > 0) {
                            // Исключаем игроков без рейтинга
                            let playersWithRating = players.filter(player => +player.rating !== null && +player.rating !== undefined  && +player.rating !== 0);
                        
                            if (playersWithRating.length > 0) {
                                let totalRating = playersWithRating.reduce((sum, player) => sum + player.rating, 0);
                                let averageRating = Math.round(totalRating / playersWithRating.length);
                                console.log(averageRating);
                                tournament.rating = averageRating;
                            } else {
                                tournament.rating = 0; // Если ни у одного игрока нет рейтинга
                            }
                        } else {
                            tournament.rating = 0; // Если игроков нет
                        }
                    } else {
                        players = [];
                    }

                    console.log(players);
                    renderTournament(tournament, players);
                });
                let moreButton = document.createElement('a');
                moreButton.className = 'upcommingTable_btn';
                moreButton.href = '#';
                let showMore = {
                    'english': 'See more',
                    'thai': 'ดูเพิ่มเติม',
                    'russian': 'Смотреть еще'
                };
                moreButton.textContent = showMore[localStorage.clientLang] || 'See more';
                document.querySelector('.upcommingTable_content').appendChild(moreButton);
            });

            // futureTournaments.forEach(tournament => {
            function renderTournament(tournament, players) {
                let qty = (players && Array.isArray(players)) ? players.length : 0;
                let avgRating = tournament.rating || 0;

                let tournamentDate = new Date(tournament.datetime);
                let langMap = {'english': 'en-US', 'thai': 'th-TH', 'russian': 'ru-RU'};
            
                let lang = langMap[localStorage.clientLang] || 'en-US';
                let dayOfWeek = tournamentDate.toLocaleDateString(lang, { weekday: 'long' });
                let formattedDate = `${dayOfWeek} ${String(tournamentDate.getDate()).padStart(2, '0')}.${String(tournamentDate.getMonth() + 1).padStart(2, '0')}.${tournamentDate.getFullYear()}`;
                if (formattedDate !== currentDay) {
                    currentDay = formattedDate;
                    let weekdayDiv = document.createElement('div');
                    weekdayDiv.className = 'upcommingTable_weekday';
                    let dateSpan = document.createElement('span');
                    dateSpan.textContent = currentDay;
                    weekdayDiv.appendChild(dateSpan);
                    document.querySelector('.upcommingTable_content').appendChild(weekdayDiv);
                }

                
                const currentLang = localStorage.getItem('clientLang');
                let tournamentDiv = document.createElement('a');
                tournamentDiv.className = 'upcommingTable_tournament';
                tournamentDiv.href = `${languageMap[currentLang]}/tournaments/${tournament._id}`;

                let timeDiv = document.createElement('div');
                timeDiv.className = 'cell tournament_time';
                timeDiv.textContent = tournament.datetime.split('T')[1].substring(0, 5);
                tournamentDiv.appendChild(timeDiv);

                let clubDiv = document.createElement('div');
                clubDiv.className = 'cell tournament_club';
                let clubLogoDiv = document.createElement('div');
                clubLogoDiv.className = 'clubLogo';
                clubLogoDiv.style.cssText = `background-image: url('${tournament.club.logo}'); background-position: 50%; background-size: cover; background-repeat: no-repeat;`;
                clubDiv.appendChild(clubLogoDiv);

                let clubNameSpan = document.createElement('span');
                clubNameSpan.textContent = tournament.club.name;
                clubDiv.appendChild(clubNameSpan);
                tournamentDiv.appendChild(clubDiv);

                let restrictionsDiv = document.createElement('div');
                restrictionsDiv.className = 'cell tournament_restrict';
                let restrictionStatusDiv = document.createElement('div');
                restrictionStatusDiv.className = 'restrictionStatus';
                
                if (new Date(tournament.datetime) > new Date()) {
                    restrictionStatusDiv.style.background = '#007026';
                } else {
                    restrictionStatusDiv.style.background = '#ADADAD';
                }

                let restrictionDiv = document.createElement('div');
                restrictionDiv.className = 'restriction';
                restrictionDiv.textContent = tournament.ratingLimit || tournament.restrictions;
                restrictionStatusDiv.appendChild(restrictionDiv);
                restrictionsDiv.appendChild(restrictionStatusDiv);
                tournamentDiv.appendChild(restrictionsDiv);

                let ratingDiv = document.createElement('div');
                ratingDiv.className = 'cell tournament_rating';
                ratingDiv.textContent = avgRating;
                tournamentDiv.appendChild(ratingDiv);

                let playersDiv = document.createElement('a');
                playersDiv.className = 'cell tournament_players';
                let playersImg = document.createElement('img');
                playersImg.src = '/icons/user.svg';
                playersImg.alt = 'person';
                playersDiv.appendChild(playersImg);
                let playersSpan = document.createElement('span');
                // let qty = 0
                // if (players && Array.isArray(players)) {
                //     qty = players.length - 1
                // }
                playersSpan.textContent = qty;
                playersDiv.appendChild(playersSpan);
                tournamentDiv.appendChild(playersDiv);
                
                document.querySelector('.upcommingTable_content').appendChild(tournamentDiv);
            }
        // );

        
    })
    .catch(error => console.error('Error:', error));
};

// export function fetchFutureTournaments() {
//     fetch('/get-future-tournaments')
//         .then(response => response.json())
//         .then(data => {
//             // let allClubs;
//             // fetchAllClubs();
//             let futureTournaments = data.filter(tournament => new Date(tournament.datetime) > new Date());
//             futureTournaments.sort((a, b) => new Date(a.datetime) - new Date(b.datetime));
//             futureTournaments = futureTournaments.slice(0, 10);
//             // рендер будущих турниров
//             let currentDay = '';

//             futureTournaments.forEach(tournament => {

//                 // Расчет среднего рейтинга
//                 // let totalRating = 0;
//                 // if(tournament.players && Array.isArray(tournament.players)) {
//                 //     tournament.players.forEach(player => {
//                 //         totalRating += player.rating;
//                 //     });
//                 // }
//                 // let averageRating = Math.round(totalRating / tournament.players.length);
//                 // tournament.rating = averageRating;

//                 let totalRating = 0;
//                 if (tournament.players && Array.isArray(tournament.players) && tournament.players.length > 0) {
//                     tournament.players.forEach(player => {
//                         totalRating += player.rating || 0;
//                     });
//                     let averageRating = Math.round(totalRating / tournament.players.length);
//                     tournament.rating = averageRating;
//                 } else {
//                     console.warn(`Players array is missing or empty for tournament ID: ${tournament._id}`);
//                     tournament.rating = 0; // Значение по умолчанию
//                 }

//                 let tournamentDate = new Date(tournament.datetime);
//                 let langMap = {'english': 'en-US', 'thai': 'th-TH', 'russian': 'ru-RU'};
            
//                 let lang = langMap[localStorage.clientLang] || 'en-US';
//                 let dayOfWeek = tournamentDate.toLocaleDateString(lang, { weekday: 'long' });
//                 let formattedDate = `${dayOfWeek} ${String(tournamentDate.getDate()).padStart(2, '0')}.${String(tournamentDate.getMonth() + 1).padStart(2, '0')}.${tournamentDate.getFullYear()}`;
//                 if (formattedDate !== currentDay) {
//                     currentDay = formattedDate;
//                     let weekdayDiv = document.createElement('div');
//                     weekdayDiv.className = 'upcommingTable_weekday';
//                     let dateSpan = document.createElement('span');
//                     dateSpan.textContent = currentDay;
//                     weekdayDiv.appendChild(dateSpan);
//                     // weekdayDiv.textContent = currentDay;
//                     document.querySelector('.upcommingTable_content').appendChild(weekdayDiv);
//                 }

//                 const languageMap = {
//                     'russian': 'ru',
//                     'english': 'en',
//                     'thai': 'th'
//                 };
//                 const currentLang = localStorage.getItem('clientLang');
//                 let tournamentDiv = document.createElement('a');
//                 tournamentDiv.className = 'upcommingTable_tournament';
//                 tournamentDiv.href = `${languageMap[currentLang]}/tournaments/${tournament._id}`;

//                 let timeDiv = document.createElement('div');
//                 timeDiv.className = 'cell tournament_time';
//                 timeDiv.textContent = tournament.datetime.split('T')[1].substring(0, 5);
//                 tournamentDiv.appendChild(timeDiv);

//                 let clubDiv = document.createElement('div');
//                 clubDiv.className = 'cell tournament_club';
//                 let clubLogoDiv = document.createElement('div');
//                 clubLogoDiv.className = 'clubLogo';
//                 clubLogoDiv.style.cssText = `background-image: url('${tournament.club.logo}'); background-position: 50%; background-size: cover; background-repeat: no-repeat;`;
//                 clubDiv.appendChild(clubLogoDiv);

//                 let clubNameSpan = document.createElement('span');
//                 clubNameSpan.textContent = tournament.club.name;
//                 clubDiv.appendChild(clubNameSpan);
//                 tournamentDiv.appendChild(clubDiv);

//                 let restrictionsDiv = document.createElement('div');
//                 restrictionsDiv.className = 'cell tournament_restrict';
//                 let restrictionStatusDiv = document.createElement('div');
//                 restrictionStatusDiv.className = 'restrictionStatus';
                
//                 if (new Date(tournament.datetime) > new Date()) {
//                     restrictionStatusDiv.style.background = '#007026';
//                 } else {
//                     restrictionStatusDiv.style.background = '#ADADAD';
//                 }

//                 let restrictionDiv = document.createElement('div');
//                 restrictionDiv.className = 'restriction';
//                 restrictionDiv.textContent = tournament.restrictions;
//                 restrictionStatusDiv.appendChild(restrictionDiv);
//                 restrictionsDiv.appendChild(restrictionStatusDiv);
//                 tournamentDiv.appendChild(restrictionsDiv);

//                 let ratingDiv = document.createElement('div');
//                 ratingDiv.className = 'cell tournament_rating';
//                 ratingDiv.textContent = tournament.rating;
//                 tournamentDiv.appendChild(ratingDiv);

//                 let playersDiv = document.createElement('a');
//                 playersDiv.className = 'cell tournament_players';
//                 let playersImg = document.createElement('img');
//                 playersImg.src = '/icons/user.svg';
//                 playersImg.alt = 'person';
//                 playersDiv.appendChild(playersImg);
//                 let playersSpan = document.createElement('span');
//                 let qty = 0
//                 if (tournament.players && Array.isArray(tournament.players)) {
//                     qty = tournament.players.length - 1
//                 }
//                 playersSpan.textContent = qty;
//                 playersDiv.appendChild(playersSpan);
//                 tournamentDiv.appendChild(playersDiv);
                
//                 document.querySelector('.upcommingTable_content').appendChild(tournamentDiv);
//             }
//         );

//         let moreButton = document.createElement('a');
//         moreButton.className = 'upcommingTable_btn';
//         moreButton.href = '#';
//         let showMore = {
//             'english': 'See more',
//             'thai': 'ดูเพิ่มเติม',
//             'russian': 'Смотреть еще'
//         };
//         moreButton.textContent = showMore[localStorage.clientLang] || 'See more';
//         document.querySelector('.upcommingTable_content').appendChild(moreButton);
//     })
//     .catch(error => console.error('Error:', error));
// };


// export function fetchClub() {
//     fetch(`/clubs`)
//     .then(response => response.json())
//     .then(clubs => {
//         const clubsContent = document.querySelector('.clubs_content');
//         clubsContent.innerHTML = '';

//         let clubsList = clubs.slice(0, 6);
//         clubsList.sort().forEach(club => {
//             let clubDiv = document.createElement('div');
//             clubDiv.className = 'clubs_content_club';

//             let logoImg = document.createElement('img');
//             logoImg.className = 'clubs_content_club_logo';
//             logoImg.src = club.logo;
//             logoImg.alt = 'logo';

//             let infoDiv = document.createElement('div');
//             infoDiv.className = 'clubs_content_club_info';

//             let nameH4 = document.createElement('h4');
//             nameH4.className = 'clubs_content_club_info_name';
//             nameH4.textContent = club.name;

//             let citySpan = document.createElement('span');
//             citySpan.className = 'clubs_content_club_info_city';
//             citySpan.textContent = club.city;

//             let phoneNumberLink = document.createElement('a');
//             phoneNumberLink.className = 'clubs_content_club_info_phoneNumber';
//             phoneNumberLink.href = `tel:${club.phoneNumber}`;
//             phoneNumberLink.textContent = club.phoneNumber;

//             infoDiv.appendChild(nameH4);
//             infoDiv.appendChild(citySpan);
//             infoDiv.appendChild(phoneNumberLink);

//             clubDiv.appendChild(logoImg);
//             clubDiv.appendChild(infoDiv);

//             clubsContent.appendChild(clubDiv);
//         });
//     })
//     .catch(error => {
//         console.error('Произошла ошибка:', error);
//         showErrorModal('Database connection error');
//     });
// };


export function fetchClub() {
    let language = localStorage.getItem('clientLang');
    const languageMap = {
        'russian': 'ru',
        'english': 'en',
        'thai': 'th'
    };
    fetch(`/clubs`)
    .then(response => response.json())
    .then(clubs => {
        const clubsContent = document.querySelector('.clubs_content');
        clubsContent.innerHTML = '';

        let clubsList = clubs.slice(0, 6);
        clubsList.sort().forEach(club => {
            fetch(`/cities/${club.city}`)
            .then(response => response.json())
            .then(city => {
                let cityName = city[language]; // Получаем название города на выбранном языке

                let clubDiv = document.createElement('div');
                clubDiv.className = 'clubs_content_club';

                let logoImg = document.createElement('img');
                logoImg.className = 'clubs_content_club_logo';
                logoImg.src = club.logo;
                logoImg.alt = 'logo';

                let infoDiv = document.createElement('div');
                infoDiv.className = 'clubs_content_club_info';

                let nameH4 = document.createElement('h4');
                nameH4.className = 'clubs_content_club_info_name';
                nameH4.textContent = club.name;

                let citySpan = document.createElement('span');
                citySpan.className = 'clubs_content_club_info_city';
                citySpan.textContent = cityName;

                let phoneNumberLink = document.createElement('a');
                phoneNumberLink.className = 'clubs_content_club_info_phoneNumber';
                phoneNumberLink.href = `tel:${club.phoneNumber}`;
                phoneNumberLink.textContent = club.phoneNumber;

                infoDiv.appendChild(nameH4);
                infoDiv.appendChild(citySpan);
                infoDiv.appendChild(phoneNumberLink);

                clubDiv.appendChild(logoImg);
                clubDiv.appendChild(infoDiv);

                // Добавляем обработчик события для перехода на страницу клуба
                clubDiv.addEventListener('click', () => {
                    const currentLang = localStorage.getItem('clientLang') || 'en';
                    window.location.href = `/${languageMap[currentLang]}/allclubs/${club._id}`;
                });

                clubsContent.appendChild(clubDiv);
            })
            .catch(error => {
                console.error('Произошла ошибка при получении города:', error);
                showErrorModal('Database connection error');
            });
        });
    })
    .catch(error => {
        console.error('Произошла ошибка при получении клубов:', error);
        showErrorModal('Database connection error');
    });
}

export async function getAllClubs() {
    const clubInput = document.getElementById('clubInput');
    const cityInput = document.getElementById('cityInput');

    const clubDropdown = document.getElementById('clubDropdown');
    const cityDropdown = document.getElementById('cityDropdown');
    const viewAllButton = document.querySelector('.clubs_down a');

    const languageMap = {
        'russian': 'ru',
        'english': 'en',
        'thai': 'th'
    };

    const currentLang = localStorage.getItem('clientLang') || 'english';
    const langKey = languageMap[currentLang];

    let allClubs = [];
    let cityMap = {};

    await fetchAllClubs();

    async function fetchAllClubs() {
        try {
            const response = await fetch(`/clubs`);
            const clubs = await response.json();
            allClubs = clubs;

            const cityIds = [...new Set(clubs.map(club => club.city))];
            const cityNames = await Promise.all(cityIds.map(cityId => getCityName(cityId)));

            cityIds.forEach((cityId, index) => {
                cityMap[cityId] = cityNames[index];
            });

            // Display first 12 clubs initially
            displayClubs(clubs.slice(0, 12));
            viewAllButton.style.display = 'block';

            const clubNames = [...new Set(clubs.map(club => club.name))];
            clubNames.sort();
            cityNames.sort();

            createDropdown(clubDropdown, clubNames, clubInput);
            createDropdown(cityDropdown, cityNames, cityInput);
        } catch (error) {
            console.error('Произошла ошибка:', error);
            showErrorModal('Database connection error');
        }
    }

    async function getCityName(cityId) {
        try {
            const response = await fetch(`/cities/${cityId}`);
            if (!response.ok) {
                throw new Error('City data not found');
            }
            const city = await response.json();
            return city[currentLang]; // Возвращает имя города на выбранном языке
        } catch (error) {
            console.error('Ошибка при получении названия города:', error);
            return 'Unknown City'; // Возвращение запасного значения в случае ошибки
        }
    }

    function createDropdown(dropdown, options, inputElement) {
        dropdown.innerHTML = '';
        options.forEach(option => {
            const div = document.createElement('div');
            div.textContent = option;
            div.addEventListener('click', () => {
                inputElement.value = option;
                dropdown.style.display = 'none';
                filterClubs();
            });
            dropdown.appendChild(div);
        });
    }

    function updateDropdownList(dropdown, options, inputElement) {
        dropdown.innerHTML = '';
        const currentText = inputElement.value.toLowerCase();
        const filteredOptions = options
            .filter(option => typeof option === 'string' && option.toLowerCase().includes(currentText))
            .map(option => option.toString()); // Преобразуем все опции в строки

        filteredOptions.forEach(option => {
            const div = document.createElement('div');
            div.textContent = option;
            div.addEventListener('click', () => {
                inputElement.value = option;
                dropdown.style.display = 'none';
                filterClubs();
            });
            dropdown.appendChild(div);
        });
        dropdown.style.display = 'block';
    }

    function filterClubs() {
        const clubValue = clubInput.value.toLowerCase();
        const cityValue = cityInput.value.toLowerCase();

        const filteredClubs = allClubs.filter(club => {
            const clubMatch = !clubValue || club.name.toLowerCase().includes(clubValue);
            const cityMatch = !cityValue || cityMap[club.city].toLowerCase().includes(cityValue);
            return clubMatch && cityMatch;
        });
        displayClubs(filteredClubs);
    }

    async function displayClubs(clubs) {
        const container = document.querySelector('.clubs_content');
        container.innerHTML = '';
        const languageMap = {
            'russian': 'ru',
            'english': 'en',
            'thai': 'th'
        };

        for (const club of clubs) {
            const clubDiv = document.createElement('div');
            clubDiv.className = 'clubs_content_club';

            const logoImg = document.createElement('img');
            logoImg.className = 'clubs_content_club_logo';
            logoImg.src = club.logo;
            logoImg.alt = 'logo';

            const infoDiv = document.createElement('div');
            infoDiv.className = 'clubs_content_club_info';

            const nameH4 = document.createElement('h4');
            nameH4.className = 'clubs_content_club_info_name';
            nameH4.textContent = club.name;

            const citySpan = document.createElement('span');
            citySpan.className = 'clubs_content_club_info_city';
            citySpan.textContent = cityMap[club.city]; // Используем кешированное имя города

            const phoneNumberLink = document.createElement('a');
            phoneNumberLink.className = 'clubs_content_club_info_phoneNumber';
            phoneNumberLink.href = `tel:${club.phoneNumber}`;
            phoneNumberLink.textContent = club.phoneNumber;

            infoDiv.appendChild(nameH4);
            infoDiv.appendChild(citySpan);
            infoDiv.appendChild(phoneNumberLink);

            clubDiv.appendChild(logoImg);
            clubDiv.appendChild(infoDiv);

            // Добавляем обработчик события для перехода на страницу клуба
            clubDiv.addEventListener('click', () => {
                const currentLang = localStorage.getItem('clientLang') || 'en';
                window.location.href = `/${languageMap[currentLang]}/allclubs/${club._id}`;
            });

            container.appendChild(clubDiv);
        }
    }

    clubInput.addEventListener('input', () => {
        updateDropdownList(clubDropdown, [...new Set(allClubs.map(club => club.name))], clubInput);
        filterClubs();
    });
    cityInput.addEventListener('input', () => {
        const cityNames = Object.values(cityMap);
        updateDropdownList(cityDropdown, cityNames, cityInput);
        filterClubs();
    });

    clubInput.addEventListener('focus', () => clubDropdown.style.display = 'block');
    cityInput.addEventListener('focus', () => cityDropdown.style.display = 'block');

    clubInput.addEventListener('blur', () => setTimeout(() => clubDropdown.style.display = 'none', 200));
    cityInput.addEventListener('blur', () => setTimeout(() => cityDropdown.style.display = 'none', 200));

    viewAllButton.addEventListener('click', function(event) {
        event.preventDefault();
        displayClubs(allClubs);
        viewAllButton.style.display = 'none';
    });
}




export async function fetchCoaches() {
    try {
        const response = await fetch('/coaches');
        if (!response.ok) {
            throw new Error('Failed to fetch coaches');
        }
        const coaches = await response.json();
        const coachesContent = document.querySelector('.coaches_content');
        coachesContent.innerHTML = '';
        const languageMap = {
            'russian': 'ru',
            'english': 'en',
            'thai': 'th'
        };

        const currentLang = localStorage.getItem('clientLang') || 'english';
        const langKey = languageMap[currentLang];

        let allClubs = [];

        await fetchAllClubs();

        async function fetchAllClubs() {
            try {
                const response = await fetch(`/clubs`);
                const clubs = await response.json();
                allClubs = clubs;

                // const clubNames = [...new Set(clubs.map(club => club.name))];
                

            } catch (error) {
                console.error('Произошла ошибка:', error);
                showErrorModal('Database connection error');
            }
        }

        async function getCityName(cityId) {
            try {
                const response = await fetch(`/cities/${cityId}`);
                if (!response.ok) {
                    throw new Error('City data not found');
                }
                const city = await response.json();
                const currentLang = localStorage.getItem('clientLang') || 'english';
                return city[currentLang]; // Возвращает имя города на выбранном языке
            } catch (error) {
                console.error('Ошибка при получении названия города:', error);
                return 'Unknown City'; // Возвращение запасного значения в случае ошибки
            }
        }


        let coachesList = coaches.slice(0, 6);
        for (const coach of coachesList) {
            let coachDiv = document.createElement('a');
            coachDiv.className = 'coaches_content_coach';
        
            coachDiv.href = `${languageMap[currentLang]}/allcoaches/${coach._id}`;

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
            nameH4.textContent = coach.name || coach.fullname;

            let clubDiv = document.createElement('div');
            clubDiv.className = 'coaches_content_coach_info_club';

            let clubTitleSpan = document.createElement('span');
            clubTitleSpan.className = 'coaches_content_coach_info_title';
            let clubTitle = {
                'english': 'Club:',
                'thai': 'ชมรม:',
                'russian': 'Клуб:'
            };
            clubTitleSpan.textContent = clubTitle[currentLang] || 'Club:';

            const club = allClubs.find(obj => obj._id === coach.club);
            
            let clubNameP = document.createElement('p');

            if (club) {
                clubNameP.textContent = club.name;
            } else {
                clubNameP.textContent = coach.club;
            }
            

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
            cityTitleSpan.textContent = cityTitle[currentLang] || 'City:';

            let cityNameP = document.createElement('p');
            // Убедитесь, что передается правильный идентификатор города
            if (coach.city) {
                cityNameP.textContent = await getCityName(coach.city);
            } else {
                cityNameP.textContent = 'Unknown City';
            }

            cityDiv.appendChild(cityTitleSpan);
            cityDiv.appendChild(cityNameP);

            infoDiv.appendChild(ratingDiv);
            infoDiv.appendChild(nameH4);
            infoDiv.appendChild(clubDiv);
            infoDiv.appendChild(cityDiv);

            coachDiv.appendChild(infoDiv);

            coachesContent.appendChild(coachDiv);
        }
    } catch (error) {
        console.error('Произошла ошибка:', error);
        showErrorModal('Database connection error');
    }
};


export async function getAllCoaches() {
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
    let allClubs = [];

    await fetchAllClubs();

    await fetchAllCoaches();

    async function fetchAllClubs() {
        try {
            const response = await fetch(`/clubs`);
            const clubs = await response.json();
            allClubs = clubs;       
        } catch (error) {
            console.error('Произошла ошибка:', error);
            showErrorModal('Database connection error');
        }
    }
    

    async function fetchAllCoaches() {
        try {
            const response = await fetch(`/coaches`);
            const coaches = await response.json();
            allCoaches = coaches;

            // Display first 12 coaches initially
            displayCoaches(coaches.slice(0, 12));
            viewAllButton.style.display = 'block';

            const names = [...new Set(coaches.flatMap(coach => coach.name || coach.fullname))];
            
            const cityIds = [...new Set(coaches.map(coach => coach.city))]; // Now storing city _id
            names.sort();

            const clubs = [...new Set(
                coaches
                    .map(coach => {
                        const club = allClubs.find(c => String(c._id) === String(coach.club));
                        return club ? club.name : null;
                    })
                    .filter(name => name)
            )];
            
            clubs.sort();

            const cityNames = await Promise.all(cityIds.map(cityId => getCityName(cityId)));

            cityNames.sort();

            createDropdown(nameDropdown, names, nameInput);
            createDropdown(clubDropdown, clubs, clubInput);
            createDropdown(cityDropdown, cityNames, cityInput);
        } catch (error) {
            console.error('Произошла ошибка:', error);
            showErrorModal('Database connection error');
        }
    }

    let debounceTimeout; // Переменная для хранения таймера дебаунсинга


    nameInput.addEventListener('input', () => debounceFilterCoaches(updateNameDropdown));
    clubInput.addEventListener('input', () => debounceFilterCoaches(updateClubDropdown));
    cityInput.addEventListener('input', () => debounceFilterCoaches(updateCityDropdown));

    nameInput.addEventListener('focus', () => nameDropdown.style.display = 'block');
    clubInput.addEventListener('focus', () => clubDropdown.style.display = 'block');
    cityInput.addEventListener('focus', () => cityDropdown.style.display = 'block');

    nameInput.addEventListener('blur', () => setTimeout(() => nameDropdown.style.display = 'none', 200));
    clubInput.addEventListener('blur', () => setTimeout(() => clubDropdown.style.display = 'none', 200));
    cityInput.addEventListener('blur', () => setTimeout(() => cityDropdown.style.display = 'none', 200));

    viewAllButton.addEventListener('click', function(event) {
        event.preventDefault();
        displayCoaches(allCoaches);
        viewAllButton.style.display = 'none';
    });

    function debounceFilterCoaches(updateDropdown) {
        clearTimeout(debounceTimeout);
        debounceTimeout = setTimeout(() => {
            updateDropdown();
            filterCoaches();
        }, 300); // Задержка в 300 мс
    }

    function updateNameDropdown() {
        updateDropdownList(nameDropdown, [...new Set(allCoaches.flatMap(coach => coach.name || coach.fullname))], nameInput);
    }

    // function updateClubDropdown() {
    //     updateDropdownList(clubDropdown, [...new Set(allCoaches.map(coach => coach.club))], clubInput);
    // }

    function updateClubDropdown() {
        const clubNames = [...new Set(
            allCoaches
                .map(coach => {
                    const club = allClubs.find(c => String(c._id) === String(coach.club));
                    return club ? club.name : null;
                })
                .filter(name => name)
        )];

        updateDropdownList(clubDropdown, clubNames, clubInput);
    }

    function updateCityDropdown() {
        Promise.all(allCoaches.map(coach => getCityName(coach.city)))
            .then(cityNames => {
                updateDropdownList(cityDropdown, [...new Set(cityNames)], cityInput);
            });
    }

    async function getCityName(cityId) {
        try {
            const response = await fetch(`/cities/${cityId}`);
            if (!response.ok) {
                throw new Error('City data not found');
            }
            const city = await response.json();
            return city[currentLang]; // Возвращает имя города на выбранном языке
        } catch (error) {
            console.error('Ошибка при получении названия города:', error);
            return 'Unknown City'; // Возвращение запасного значения в случае ошибки
        }
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

    async function filterCoaches() {
        const nameValue = nameInput.value.toLowerCase();
        const clubValue = clubInput.value.toLowerCase();
        const cityValue = cityInput.value.toLowerCase();

        const filteredCoaches = await Promise.all(allCoaches.map(async coach => {
            const nameMatch = !nameValue || coach.name.toLowerCase().includes(nameValue) || coach.playerName.toLowerCase().includes(nameValue);
            // const clubMatch = !clubValue || coach.club.toLowerCase().includes(clubValue);
            const coachClub = allClubs.find(c => String(c._id) === String(coach.club));
            const clubMatch = !clubValue || (coachClub && coachClub.name.toLowerCase().includes(clubValue));

            const cityName = await getCityName(coach.city);
            const cityMatch = !cityValue || cityValue === 'all' || cityName.toLowerCase().includes(cityValue);

            return nameMatch && clubMatch && cityMatch ? coach : null;
        }));

        // Убираем null значения из массива
        const validCoaches = filteredCoaches.filter(coach => coach !== null);

        displayCoaches(validCoaches);
    }

    async function displayCoaches(coaches) {
        const container = document.querySelector('.coaches_content');
        container.innerHTML = '';

        for (const coach of coaches) {
            // const coachDiv = document.createElement('div');
            // coachDiv.className = 'coaches_content_coach';
            let coachDiv = document.createElement('a');
            coachDiv.className = 'coaches_content_coach';
            coachDiv.href = `/${languageMap[currentLang]}/allcoaches/${coach._id}`;

            const wrapLogoDiv = document.createElement('div');
            wrapLogoDiv.className = 'coaches_content_coach_wrapLogo';

            const logoDiv = document.createElement('div');
            logoDiv.className = 'coaches_content_coach_wrapLogo_logo';
            logoDiv.style.backgroundImage = `url('${coach.logo}')`;
            logoDiv.style.backgroundPosition = '50%';
            logoDiv.style.backgroundSize = 'cover';
            logoDiv.style.backgroundRepeat = 'no-repeat';

            wrapLogoDiv.appendChild(logoDiv);
            coachDiv.appendChild(wrapLogoDiv);

            const infoDiv = document.createElement('div');
            infoDiv.className = 'coaches_content_coach_info';

            const ratingDiv = document.createElement('div');
            ratingDiv.className = 'coaches_content_coach_info_rating';
            ratingDiv.textContent = coach.rating;

            const nameH4 = document.createElement('h4');
            nameH4.className = 'coaches_content_coach_info_name';
            nameH4.textContent = coach.name || coach.fullname;

            const clubDiv = document.createElement('div');
            clubDiv.className = 'coaches_content_coach_info_club';

            const clubTitleSpan = document.createElement('span');
            clubTitleSpan.className = 'coaches_content_coach_info_title';
            let clubTitle = {
                'english': 'Club:',
                'thai': 'ชมรม:',
                'russian': 'Клуб:'
            };
            clubTitleSpan.textContent = clubTitle[currentLang] || 'Club:';

            const clubNameP = document.createElement('p');

            const coachClub = allClubs.find(c => String(c._id) === String(coach.club));

            // Если клуб найден, записываем его название, иначе оставляем пустым
            clubNameP.textContent = coachClub ? coachClub.name : ' - ';
            

            clubDiv.appendChild(clubTitleSpan);
            clubDiv.appendChild(clubNameP);

            const cityDiv = document.createElement('div');
            cityDiv.className = 'coaches_content_coach_info_city';

            const cityTitleSpan = document.createElement('span');
            cityTitleSpan.className = 'coaches_content_coach_info_title';
            let cityTitle = {
                'english': 'City:',
                'thai': 'เมือง:',
                'russian': 'Город:'
            };
            cityTitleSpan.textContent = cityTitle[currentLang] || 'City:';

            const cityNameP = document.createElement('p');
            cityNameP.textContent = await getCityName(coach.city); // Retrieve city name

            cityDiv.appendChild(cityTitleSpan);
            cityDiv.appendChild(cityNameP);

            infoDiv.appendChild(ratingDiv);
            infoDiv.appendChild(nameH4);
            infoDiv.appendChild(clubDiv);
            infoDiv.appendChild(cityDiv);

            coachDiv.appendChild(infoDiv);

            container.appendChild(coachDiv);
        }
    }

    // Инициализация данных тренеров и вызов начальной фильтрации
    fetchCoachesData();

    async function fetchCoachesData() {
        try {
            const response = await fetch('/coaches');
            allCoaches = await response.json();
            // filterCoaches(); // Выполнить фильтрацию при загрузке данных
        } catch (error) {
            console.error('Ошибка при загрузке данных тренеров:', error);
        }
    }
}

export function btnGoUp() {
    const body = document.querySelector('body');
    const aGoUp = document.createElement('a');
    aGoUp.classList.add('goUp');
    aGoUp.href = '#';
    const imgGoUp = document.createElement('img');
    imgGoUp.src = '/icons/arrow-go-up.svg';
    imgGoUp.alt = 'button go up';
    aGoUp.appendChild(imgGoUp);
    body.appendChild(aGoUp);

    const container = document.querySelector('.container');
    const footer = document.querySelector('.footer');

    function updateButtonPosition() {
        const containerRect = container.getBoundingClientRect();
        const footerRect = footer.getBoundingClientRect();
        const buttonRight = window.innerWidth - containerRect.right;

        if (footerRect.top < window.innerHeight - 80) {
            aGoUp.style.bottom = `${window.innerHeight - footerRect.top + 80}px`;
        } else {
            aGoUp.style.bottom = '80px';
        }

        aGoUp.style.right = `${buttonRight}px`;
    }

    function toggleButtonVisibility() {
        if (window.innerWidth < 769) {
            aGoUp.style.display = 'none';
            return;
        }

        if (window.scrollY > window.innerHeight) {
            aGoUp.style.display = 'block';
        } else {
            aGoUp.style.display = 'none';
        }
    }

    window.addEventListener('resize', updateButtonPosition);
    window.addEventListener('scroll', () => {
        toggleButtonVisibility();
        updateButtonPosition();
    });

    aGoUp.addEventListener('click', function(event) {
        event.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    updateButtonPosition();
    toggleButtonVisibility();
};

export function checkLanguage() {
    let language = localStorage.getItem('clientLang') || 'english';
    return language;
}
checkLanguage();

// export function languageControl() {
//     let baseUrl = window.location.origin;
//     let newPath = baseUrl;
//     let statusLangsMenu = false;

//     document.querySelectorAll('.selectedLanguage').forEach(function(button) {
//         button.addEventListener('click', function() {
//             this.nextElementSibling.classList.toggle('openLangsMenu');
//             this.querySelector('.arrowLangs').style.transform = 'rotateX(180deg)';
//             statusLangsMenu = true;
//         });
//     });


//     const languageMap = {
//         'russian': 'ru',
//         'english': 'en',
//         'thai': 'th'
//     };

//     document.querySelectorAll('.dropdown a').forEach(function(element) {
//         element.addEventListener('click', function() {
//             let selectedLang = this.getAttribute('data-lang');

            
//             let shortLang = languageMap[selectedLang];

//             localStorage.setItem('clientLang', selectedLang);
//             let dropdown = this.parentElement;

//             dropdown.previousElementSibling.querySelector('.languageText').innerText = shortLang;
//             dropdown.style.display = 'none';
//             dropdown.previousElementSibling.querySelector('.arrowLangs').style.transform = 'rotateX(360deg)';
//             statusLangsMenu = false;

//             newPath += '/' + shortLang;
//             window.location.href = newPath;
//         });
//     });
// };

export function languageControl() {
    let baseUrl = window.location.origin;
    let currentPath = window.location.pathname;
    let statusLangsMenu = false;

    document.querySelectorAll('.selectedLanguage').forEach(function(button) {
        button.addEventListener('click', function() {
            // this.nextElementSibling.classList.toggle('openLangsMenu');
            // this.querySelector('.arrowLangs').style.transform = 'rotateX(180deg)';
            // statusLangsMenu = true;

            this.nextElementSibling.classList.toggle('openLangsMenu');

            const arrowElement = this.querySelector('.arrowLangs');
            statusLangsMenu = !statusLangsMenu; // Меняем статус меню
            chevronRotate(arrowElement, statusLangsMenu);
        });
    });

    const languageMap = {
        'russian': 'ru',
        'english': 'en',
        'thai': 'th'
    };

    document.querySelectorAll('.dropdown a').forEach(function(element) {
        element.addEventListener('click', function() {
            let selectedLang = this.getAttribute('data-lang');
            let shortLang = languageMap[selectedLang];
            if (!shortLang) {
                shortLang = 'en';
            }

            localStorage.setItem('clientLang', selectedLang);
            let dropdown = this.parentElement;

            dropdown.previousElementSibling.querySelector('.languageText').innerText = shortLang;
            dropdown.style.display = 'none';

            // dropdown.previousElementSibling.querySelector('.arrowLangs').style.transform = 'rotateX(0deg)';
            // statusLangsMenu = false;
            const arrowElement = dropdown.previousElementSibling.querySelector('.arrowLangs');
            chevronRotate(arrowElement, false); // Возвращаем стрелку в начальное положение

            statusLangsMenu = false;

            // Replace the current language in the path with the selected language
            let newPath = currentPath.replace(/^\/(ru|en|th)/, '/' + shortLang);
            
            // If no language is present in the path, prepend the selected language
            if (!newPath.startsWith('/' + shortLang)) {
                newPath = '/' + shortLang + newPath;
            }

            window.location.href = baseUrl + newPath;
        });
    });
}

// export function languageControl() {
//     let baseUrl = window.location.origin;
//     let currentPath = window.location.pathname;
//     let statusLangsMenu = false;

//     document.querySelectorAll('.selectedLanguage').forEach(function(button) {
//         button.addEventListener('click', function() {
//             this.nextElementSibling.classList.toggle('openLangsMenu');
//             this.querySelector('.arrowLangs').style.transform = 'rotateX(180deg)';
//             statusLangsMenu = true;
//         });
//     });

//     const languageMap = {
//         'russian': 'ru',
//         'english': 'en',
//         'thai': 'th'
//     };

//     document.querySelectorAll('.dropdown a').forEach(function(element) {
//         element.addEventListener('click', function() {
//             let selectedLang = this.getAttribute('data-lang');
//             let shortLang = languageMap[selectedLang];

//             localStorage.setItem('clientLang', selectedLang);
//             document.cookie = `clientLang=${selectedLang}; path=/`;

//             let dropdown = this.parentElement;
//             dropdown.previousElementSibling.querySelector('.languageText').innerText = shortLang;
//             dropdown.style.display = 'none';
//             dropdown.previousElementSibling.querySelector('.arrowLangs').style.transform = 'rotateX(360deg)';
//             statusLangsMenu = false;

//             // Заменить текущий язык в пути на выбранный язык
//             let newPath = currentPath.replace(/^\/(ru|en|th)/, '/' + shortLang);

//             // Если язык не указан в пути, добавить выбранный язык в начало пути
//             if (!newPath.startsWith('/' + shortLang)) {
//                 newPath = '/' + shortLang + newPath;
//             }

//             window.location.href = baseUrl + newPath;
//         });
//     });
// }




let citiesList = [];
let namesOfCitie = [];

export async function fetchCities(curLang) {
    try {
        const response = await fetch(`/cities?language=${curLang}`);
        const cities = await response.json();
        citiesList = cities.citiesObjects.sort();
        namesOfCitie = cities.cities.sort();
    } catch (error) {
        console.error('Произошла ошибка:', error);
    }
};

// export function getCitiesList() {
//     return citiesList;
// };

export function loginForm() {
    const modal = document.getElementById("myModal");
    const content = document.querySelector('.modal-content');
    const translations = {
        english: {
            title: "Log in",
            emailLabel: "E-mail*",
            emailPlaceholder: "Enter your email",
            passwordLabel: "Password*",
            passwordPlaceholder: "Enter password",
            forgotPassword: "Forgot your password?",
            submitButton: "Log in"
        },
        thai: {
            title: "เข้าสู่ระบบ",
            emailLabel: "อีเมล์หรือ*",
            emailPlaceholder: "กรอกอีเมลหรือ",
            passwordLabel: "รหัสผ่าน*",
            passwordPlaceholder: "ใส่รหัสผ่าน",
            forgotPassword: "คุณลืมรหัสผ่านหรือไม่?",
            submitButton: "เข้าสู่ระบบ"
        },
        russian: {
            title: "Вход",
            emailLabel: "E-mail*",
            emailPlaceholder: "Введите e-mail",
            passwordLabel: "Пароль*",
            passwordPlaceholder: "Введите пароль",
            forgotPassword: "Забыли пароль?",
            submitButton: "Вход"
        }
    };

    const clientLang = localStorage.getItem('clientLang') || 'english';
    const translation = translations[clientLang] || translations['english'];

    // content.innerHTML = `<button class="modal_close" onclick="closeModal()">
    //                         <img src="/icons/x-circle.svg" alt="кнопка закрыть">
    //                     </button>
    //                     <h2>${translation.title}</h2>
    //                     <form  id="loginForm" action="/login" method="POST" enctype="application/x-www-form-urlencoded">
    //                         <label for="username">${translation.emailLabel}</label>
    //                         <input type="text" name="username" autocomplete="username" placeholder="${translation.emailPlaceholder}" id="email" required>
    //                         <label for="password">${translation.passwordLabel}</label>
    //                         <input type="password" placeholder="${translation.passwordPlaceholder}" id="password" name="password" autocomplete="new-password" required>
    //                         <button class='btnFogot' type="button">${translation.forgotPassword}</button>
    //                         <button id="logIn" class='header_btn-sign btnSbmt header_btn-login' type="submit">${translation.submitButton}</button>
    //                     </form>`;
    content.innerHTML = `<button class="modal_close" onclick="closeModal()">
                            <img src="/icons/x-circle.svg" alt="кнопка закрыть">
                        </button>
                        <h2>${translation.title}</h2>
                        <form id="loginForm" action="/login" method="POST" enctype="application/x-www-form-urlencoded">
                            <label for="email">${translation.emailLabel}</label>
                            <input type="text" name="email" autocomplete="username" placeholder="${translation.emailPlaceholder}" id="email" required>
                            <label for="password">${translation.passwordLabel}</label>
                            <input type="password" placeholder="${translation.passwordPlaceholder}" id="password" name="password" autocomplete="new-password" required>
                            <div class="loginFormError" id="error-message" style="color: red; display: none;"></div>
                            <button class='btnFogot' type="button">${translation.forgotPassword}</button>
                            <button id="logIn" class='header_btn-sign btnSbmt header_btn-login' type="submit">${translation.submitButton}</button>
                        </form>`;
    document.body.style = 'overflow: hidden;';
    modal.style.display = "block";


    const languageMap = {
        'russian': 'ru',
        'english': 'en',
        'thai': 'th'
    };

    // async function login(data) {
    //     console.log('есть');

    //     try {
    //         const response = await fetch('/login', {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json'
    //             },
    //             body: JSON.stringify(data),
    //             credentials: 'same-origin'
    //         });
    //         // console.log(data);
    //         if (response.ok) {
    //             console.log('есть ответ', data);
    //             const data = await response.json();
    //             const userId = data.userId;
    //             const name = data.name;
    //             const logo = data.logo;
    //             localStorage.setItem('userId', userId);
    //             localStorage.setItem('userName', name);
    //             localStorage.setItem('userLogo', logo);
                
    //             window.location.href = `/${languageMap[clientLang]}/dashboard`;
    //         } else {
    //             console.error('Login failed');
    //         }
    //     } catch (error) {
    //         console.error('Error during login:', error);
    //     }
    // }

    // document.getElementById('loginForm').addEventListener('submit', function(event) {
    //     event.preventDefault(); // Отменяем стандартное поведение формы


    //     const formData = new FormData(event.target);
    //     const data = {
    //         email: formData.get('username'),
    //         password: formData.get('password'),
    //         language: languageMap[clientLang] // Передаем выбранный язык
            
    //     };
    //     // console.log(data);
    //     login(data);

    // });

    async function login(data) {
        console.log('Sending login request with data:', data);

        try {
            const response = await fetch('/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data),
                credentials: 'same-origin'
            });
            if (response.ok) {
                console.log('Login successful');
                const responseData = await response.json(); 
                const userId = responseData.userId;
                const name = responseData.name;
                const logo = responseData.logo;
                const userType = responseData.userType;
                localStorage.setItem('userId', userId);
                localStorage.setItem('userName', name);
                localStorage.setItem('userLogo', logo);
                localStorage.setItem('userType', userType);
                console.log(userType);
                let redirectUrl = `/${languageMap[clientLang]}/dashboard/${userType}/${userId}`;
                
                if (userType === 'admin') {
                    redirectUrl = `/ru/dashboard/${userType}`;
                    console.log(redirectUrl);
                }
                console.log(redirectUrl);
                window.location.href = redirectUrl;
            } else {
                const errorData = await response.json();
                displayError(errorData.message);
            }
                
        } catch (error) {
            console.error('Error during login:', error);
            displayError(errorData.message);
        }
    }

    function displayError(message) {
        const errorMessageElement = document.getElementById('error-message');
        errorMessageElement.textContent = message;
        errorMessageElement.style.display = 'block';
    }

    document.getElementById('loginForm').addEventListener('submit', function(event) {
        event.preventDefault(); // Отменяем стандартное поведение формы

        const formData = new FormData(event.target);
        const data = {
            email: formData.get('email'),
            password: formData.get('password'),
            language: languageMap[clientLang] // Передаем выбранный язык
        };

        console.log('Form data:', data);
        login(data);
    });
}



export function restoreAccesForm() {
    const content = document.querySelector('.modal-content');
    const translations = {
        english: {
            title: "RESTORE Access",
            description: "If you have forgotten your password, enter your email and we will send you a link to reset your password.",
            label: "E-mail*",
            placeholder: "Enter your email",
            button: "Restore"
        },
        thai: {
            title: "คืนค่าการเข้าถึง",
            description: "หากคุณลืมรหัสผ่าน ให้กรอกอีเมลของคุณ แล้วเราจะส่งลิงก์เพื่อรีเซ็ตรหัสผ่านไปให้คุณ.",
            label: "อีเมล์หรือ*",
            placeholder: "กรอกอีเมลหรือ",
            button: "คืนค่า"
        },
        russian: {
            title: "Восстановление доступа",
            description: "Если вы забыли свой пароль, введите свой e-mail и мы отправим вам ссылку для восстановления пароля.",
            label: "E-mail*",
            placeholder: "Введите email",
            button: "Восстановить"
        }
    };

    const clientLang = localStorage.getItem('clientLang') || 'english';
    const translation = translations[clientLang] || translations['english'];

    const modal = document.getElementById("myModal");
    modal.style.display = "none";
    content.innerHTML = `<button class="modal_close" onclick="closeModal()">
                            <img src="/icons/x-circle.svg" alt="кнопка закрыть">
                        </button>
                        <h2>${translation.title}</h2>
                        <form id="restoreForm">
                            <p>${translation.description}</p>
                            <label for="login">${translation.label}</label>
                            <input type="text" placeholder="${translation.placeholder}" id="email" name="email" required>
                            <button id="restor" class='header_btn-sign btnSbmt' type="submit">${translation.button}</button>
                        </form>`;
    document.body.style = 'overflow: hidden;';
    modal.style.display = "block";

    document.getElementById('restoreForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        try {
            const response = await fetch('/api/restore-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, clientLang })
            });

            if (response.ok) {
                alert('A link to reset your password has been sent to your email.');
                closeModal(); // Закрыть модальное окно
            } else {
                const errorData = await response.json();
                alert(`Error: ${errorData.message}`);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred. Please try again later.');
        }
    });
}

function closeModal() {
    const modal = document.getElementById("myModal");
    modal.style.display = "none";
    document.body.style = 'overflow: auto;';
}

export function registrationForm() {
    // const modal = document.getElementById("myModal");
    const citiesList = namesOfCitie;
    let handChecked = false;
    const content = document.querySelector('.modal-content');
    const translations = {
        english: {
            title: "Registration on the WEBsite",
            emailLabel: "Email*",
            emailPlaceholder: "Enter email",
            nicknameLabel: "Nickname",
            loginPlaceholder: "Enter nickname",
            passwordLabel: "Password*",
            passwordPlaceholder: "Enter password",
            confirmPasswordPlaceholder: "Confirm password",
            parameterPassword: "from 3 to 15 characters",
            cityLabel: "City*",
            cityPlaceholder: "Not chosen",
            playerNameLabel: "Player name*",
            playerNamePlaceholder: "Enter your first and last name",
            playingHandLabel: "Playing hand*",
            leftHand: "Left",
            rightHand: "Right",
            dobLabel: "Date of Birth*",
            dobPlaceholder: "DD.MM.YYYY",
            policyText: "Agree to the processing of personal data",
            submitButton: "Sign in",
            passwordMatchError: "Passwords don't match",
            passwordLengthError: "Password must be at least 8 characters",
            passwordStrengthError: "Password must contain at least one number, one lowercase and one uppercase letter",
            emailRegisteredError: "This e-mail is already registered!",
            loginRegisteredError: "This login is already registered!",
            serverError: "The server is not available. Please try again."
        },
        thai: {
            title: "การลงทะเบียนบนเว็บไซต์",
            emailLabel: "อีเมลล์*",
            emailPlaceholder: "กรอกอีเมลล์",
            nicknameLabel: "ชือเล่น",
            loginPlaceholder: "กด ชือเล่น",
            passwordLabel: "รหัสผ่าน*",
            passwordPlaceholder: "ใส่รหัสผ่าน",
            confirmPasswordPlaceholder: "ยืนยันรหัสผ่าน",
            parameterPassword: "จาก 3 ถึง 15 ตัวอักษร",
            cityLabel: "เมือง*",
            cityPlaceholder: "กดเลือกเมือง",
            playerNameLabel: "ชื่อผู้เล่น*",
            playerNamePlaceholder: "กรอกชื่อและนามสกุลของคุณ ",
            playingHandLabel: "มือที่เล่น*",
            leftHand: "ซ้าย",
            rightHand: "ขวา",
            dobLabel: "วันเกิด*",
            dobPlaceholder: "ป้อนวันที่",
            policyText: "ยินยอมให้มีการเข้าถึงข้อมูลส่วนบุคคล",
            submitButton: "ลงทะเบียน",
            passwordMatchError: "รหัสผ่านไม่ตรงกัน",
            passwordLengthError: "รหัสผ่านต้องมีอย่างน้อย 8 อักขระ",
            passwordStrengthError: "รหัสผ่านต้องมีอย่างน้อยหนึ่งตัวเลข หนึ่งตัวพิมพ์เล็ก และหนึ่งตัวพิมพ์ใหญ่",
            emailRegisteredError: "อีเมลนี้ได้ลงทะเบียนไว้แล้ว!",
            loginRegisteredError: "การเข้าสู่ระบบนี้ได้ลงทะเบียนไว้แล้ว!",
            serverError: "เซิร์ฟเวอร์ไม่พร้อมใช้งาน โปรดลองอีกครั้ง"
        },
        russian: {
            title: "Регистрация на сайте",
            emailLabel: "E-mail*",
            emailPlaceholder: "Введите e-mail",
            nicknameLabel: "Никнейм",
            loginPlaceholder: "Введите никнейм",
            passwordLabel: "Пароль*",
            passwordPlaceholder: "Введите пароль",
            confirmPasswordPlaceholder: "Подтвердите пароль",
            parameterPassword: "от 3 до 15 символов",
            cityLabel: "Город*",
            cityPlaceholder: "Не выбран",
            playerNameLabel: "Имя игрока*",
            playerNamePlaceholder: "ФИО",
            playingHandLabel: "Игровая рука*",
            leftHand: "Левая",
            rightHand: "Правая",
            dobLabel: "Дата рождения*",
            dobPlaceholder: "ДД.ММ.ГГГГ",
            policyText: "Согласиться на обработку персональных данных",
            submitButton: "Регистрация",
            passwordMatchError: "Пароли не совпадают",
            passwordLengthError: "Пароль должен быть не менее 8 символов",
            passwordStrengthError: "Пароль должен содержать хотя бы одну цифру, одну строчную и одну заглавную букву",
            emailRegisteredError: "Этот e-mail уже зарегистрирован!",
            loginRegisteredError: "Этот логин уже зарегистрирован!",
            serverError: "Сервер недоступен. Пожалуйста, попробуйте позже."
        }
    };

    const clientLang = localStorage.getItem('clientLang') || 'english';
    const translation = translations[clientLang] || translations['english'];

    const modal = document.getElementById("myModal");
    modal.style.display = "none";
    content.innerHTML = `<button class="modal_close" onclick="closeModal()">
                            <img src="/icons/x-circle.svg" alt="кнопка закрыть">
                        </button>
                        <h2>${translation.title}</h2> 
                        <form action="/register" method="POST"  enctype="application/x-www-form-urlencoded">
                            <label for="email">${translation.emailLabel}</label>
                            <input type="email" id="emailRegInput" placeholder="${translation.emailPlaceholder}" name="email" required>
                            <div id="emailError"  class="error-message"></div>
                            <label for="login">${translation.nicknameLabel}</label>
                            <input type="text" id="loginRegInput" placeholder="${translation.loginPlaceholder}" name="login" autocomplete="username">
                            <div id="loginError" class="error-message"></div>
                            <span>${translation.parameterPassword}</span>
                            <label for="password">${translation.passwordLabel}</label>
                            <input type="password" placeholder="${translation.passwordPlaceholder}" id="password" name="password" autocomplete="new-password" required>
                            <input type="password" placeholder="${translation.confirmPasswordPlaceholder}" id="confirm_password" name="confirm_password" autocomplete="new-password" required>
                            <div id="passwordError" class="error-message"></div>
                            <label for="city">${translation.cityLabel}</label>
                            <input type="text" placeholder="${translation.cityPlaceholder}" id="city" name="city" style="background-image: url('/icons/chevron-down.svg'); background-repeat: no-repeat; background-position: right 8px center; padding-right: 30px;">
                            <div class="dropdownForm">
                                <div class="dropdown-content" id="dropdown-content">
                                <!-- options add from JS -->
                                </div>
                            </div>
                            <label for="fullname">${translation.playerNameLabel}</label>
                            <input type="text" placeholder="${translation.playerNamePlaceholder}" id="fullname" name="fullname" required>
                            <label>${translation.playingHandLabel}</label>
                            <div class="hands">
                                <div class="hands_left">
                                    <input class="hands_radio" type="radio" id="left" name="hand" value="left" required>
                                    <label for="left">${translation.leftHand}</label>
                                </div>
                                <div class="hands_right">
                                    <input class="hands_radio" type="radio" id="right" name="hand" value="right" required>
                                    <label for="right">${translation.rightHand}</label>
                                </div>
                            </div>
                            <label for="date">${translation.dobLabel}</label>
                            <input type="text" name="date" id="date" placeholder="${translation.dobPlaceholder}" oninput="addDots(this)" maxlength="10" required>
                            <div class="policy">
                                <input class="checkbox" type="checkbox" id="policy" name="policy" required>
                                <label for="policy"><a href="\policy">${translation.policyText}</a></label>
                            </div>
                            <button  class='header_btn-sign btnSbmt' type="submit">${translation.submitButton}</button>
                        </form>`;

    document.body.style = 'overflow: hidden;';
    modal.style.display = "block";

    // cities dropdown
    
    const listOfCities = document.getElementById('dropdown-content');
    citiesList.forEach(city => {
        const option = document.createElement('div');
        option.value = city;
        option.innerText = city;
        listOfCities.appendChild(option);
    });

    const cityInput = document.getElementById('city');
    // const clubCityInput = document.getElementById('clubcity');

    function updateCityList() {
        listOfCities.innerHTML = '';
        const currentText = cityInput.value.toLowerCase();

        const filteredCities = citiesList.filter(city => city.toLowerCase().startsWith(currentText));

        filteredCities.forEach(city => {
            const div = document.createElement('div');
            div.textContent = city;
            div.addEventListener('click', function(event) {
                event.stopPropagation();
                cityInput.value = event.target.textContent;
                listOfCities.style.display = 'none';
            });
            listOfCities.appendChild(div);
        });
        listOfCities.style.display = 'block';
    }

    // update list cities
    cityInput.addEventListener('input', updateCityList);

    // show dropdown cities
    cityInput.addEventListener('focus', () => {
        updateCityList();
        listOfCities.style.display = 'block';
    });

    // hide dropdown cities
    cityInput.addEventListener('blur', () => {
        setTimeout(() => { listOfCities.style.display = 'none'; }, 200);
    });

    //dates
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

    //passwords
    const password = document.getElementById('password');
    const confirm_password = document.getElementById('confirm_password');
    const passwordError = document.getElementById('passwordError');
    const submitButton = document.querySelector('.btnSbmt');

    let hasPasswordError = false;
    let hasEmailError = false;

    function updateSubmitButtonState() {
        // Отключаем кнопку, если есть хотя бы одна ошибка
        submitButton.disabled = hasPasswordError || hasEmailError;
    }

    // submitButton.addEventListener('click', validateForm);
    function formErrorMessage(text, block) {
        block.textContent = text;
        block.style.display = 'block';
        // submitButton.disabled = true;
        // console.log(submitButton.disabled);
    }
    function formClearMessage(block) {
        block.textContent = '';
        block.style.display = 'none';
        // submitButton.disabled = false;
    }

    function validatePasswordMatch() {
        if (password.value && confirm_password.value) {
            if (password.value !== confirm_password.value) {
                formErrorMessage(translation.passwordMatchError, passwordError);
                password.classList.add('error');
                confirm_password.classList.add('error');
                hasPasswordError = true;
            } else {
                formClearMessage(passwordError);
                password.classList.remove('error');
                confirm_password.classList.remove('error');
                hasPasswordError = false;
            }
        }
        updateSubmitButtonState();
    }

    function validatePasswordStrength() {
        const passwordRegex = /^(?=.*\d)(?=.*[a-zа-яё\u0E01-\u0E5B])(?=.*[A-ZА-ЯЁ]).{8,}$/;
                                
    
        if (password.value.length < 8) {
            formErrorMessage(translation.passwordLengthError, passwordError);
            password.classList.add('error');
            confirm_password.classList.add('error');
            hasPasswordError = true;
        } else if (!passwordRegex.test(password.value)) {
            formErrorMessage(translation.passwordStrengthError, passwordError);
            password.classList.add('error');
            confirm_password.classList.add('error');
            hasPasswordError = true;
        } else {
            formClearMessage(passwordError);
            password.classList.remove('error');
            confirm_password.classList.remove('error');
            hasPasswordError = false;
        }
        updateSubmitButtonState();
    }
    
    password.addEventListener('blur', validatePasswordStrength);
    confirm_password.addEventListener('blur', validatePasswordMatch);
    

    // check unique email and login
    const emailRegInput = document.querySelector('#emailRegInput');
    // const loginRegInput = document.querySelector('#loginRegInput');
    const emailError = document.querySelector('#emailError');
    // const loginError = document.querySelector('#loginError');

    emailRegInput.addEventListener('input', function() {
        fetch(`/check-email?email=${this.value}`)
        .then(response => response.json())
        .then(data => {
            if (!data.unique) {
                formErrorMessage(translation.emailRegisteredError, emailError);
                hasEmailError = true;

            } else {
                formClearMessage(emailError);
                hasEmailError = false;
            }
            updateSubmitButtonState();
        });
    });
    
    // loginRegInput.addEventListener('input', function() {
    //     fetch(`/check-login?login=${this.value}`)
    //     .then(response => response.json())
    //     .then(data => {
    //         if (!data.unique) {
    //             formErrorMessage(translation.loginRegisteredError, loginError);
    //         } else {
    //             formClearMessage(loginError);
    //         }
    //     });
    // });

    document.querySelector('form').addEventListener('submit', function(event) {
        event.preventDefault();
        
        if (submitButton.disabled) {
            console.log('не отправляем форму');
            return; // Прекращаем выполнение, если кнопка отключена
        }
        
        const city = document.getElementById('city').innerText;

        if (city === 'Not chosen' || city === 'Не выбрано' || city === 'ไม่ได้ถูกเลือก') {
            const cityParentElement = document.getElementById('dropdown-content').parentNode;
            cityParentElement.classList.add('error');
            return false;
        }
        let clientLanguage = localStorage.getItem('clientLang') || 'english';
        // console.log(clientLang);
        const data = {
            email: document.getElementById('emailRegInput').value,
            nickname: document.getElementById('loginRegInput').value,
            password: document.getElementById('password').value,
            confirm_password: document.getElementById('confirm_password').value,
            city: document.getElementById('city').value,
            fullname: document.getElementById('fullname').value,
            hand: document.querySelector('input[name="hand"]:checked').value,
            date: document.getElementById('date').value,
            registeredDate: new Date(),
            policy: document.getElementById('policy').checked,
            clientLang: clientLanguage,
        };
        // console.log(data);

        fetch('/register', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
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
                    showErrorModal(error.msg);
                });
            } else {
                document.querySelector('form').reset();
                redirectToPersonalAccount();
            }
        })
        .catch(error => {
            showErrorModal(translation.serverError);
        });
    });
}

export function showErrorModal(message, tittle) {
    let h2;
    if (!tittle) {
        h2 = 'Ops!';
    } else {
        h2 = tittle;
    }
    const modal = document.getElementById('myModal');
    const modalContent = modal.querySelector('.modal-content');
    modalContent.innerHTML = `
                        <button class="modal_close" onclick="closeModal()">
                            <img src="/icons/x-circle.svg" alt="кнопка закрыть">
                        </button>
                        <h2>${h2}</h2> 
                        <p>${message}</p>
                        `;
    modal.style.display = 'block';
};

function redirectToPersonalAccount() {
    // window.location.href = '/';
    loginForm();

    // console.log('регистрация успешна');
}

export function breadCrumb() {
    const breadcrumbContainer = document.getElementById('breadcrumb');
    const currentUrl = window.location.pathname;
    const pathArray = currentUrl.split('/').filter(el => el);

    const languageMap = {
        'ru': 'russian',
        'en': 'english',
        'th': 'thai'
    };

    const translations = {
        'en': {
            'home': 'Home',
            'becomeacoach': 'Become a Coach',
            'addclub': 'Application to add a club',
            'allcoaches': 'Coaches',
            'allclubs': 'Clubs',
            'club': 'About the club',
            'players': 'Players',
            'player': 'Player Profile',
            'aboutus': 'About us',
            'tournament': 'About the Tournament',
            'tournaments': 'Tournaments',
            'alltournaments': 'Tournaments',
            'allplayers': 'Players',
            'alltrainings': 'Trainings',
            'training': 'About the Training',
            'trainings': 'Trainings',
            'dashboard': 'My profile',
            'user_dashboard': 'My profile',
            'admin_dashboard': 'Admin Dashboard',
            'club_dashboard': 'Club Dashboard',
            'trainer_dashboard': 'Coach Dashboard',
            'editclub': 'Edit club data',
            'createtournament': 'Create a tournament'
        },
        'ru': {
            'home': 'Главная',
            'becomeacoach': 'Стать тренером',
            'addclub': 'Заявка на добавление клуба',
            'allcoaches': 'Тренеры',
            'allclubs': 'Клубы',
            'club': 'О клубе',
            'players': 'Игроки',
            'player': 'Профиль игрока',
            'aboutus': 'О нас',
            'tournament': 'О Турнире',
            'tournaments': 'Турниры',
            'alltournaments': 'Турниры',
            'allplayers': 'Игроки',
            'alltrainings': 'Тренировки',
            'training': 'О Тренировке',
            'trainings': 'Тренировки',
            'dashboard': 'Мой профиль',
            'user_dashboard': 'Мой профиль',
            'admin_dashboard': 'Панель администратора',
            'club_dashboard': 'Панель клуба',
            'trainer_dashboard': 'Панель тренера',
            'editclub': 'Редактирование данных клуба'
        },
        'th': {
            'home': 'หน้าหลัก',
            'becomeacoach': 'สมัครเป็นโค้ช',
            'addclub': 'การสมัครเพื่อเพิ่มสโมสร',
            'allcoaches': 'โค้ชปิงปอง',
            'allclubs': 'สโมสร',
            'club': 'เกี่ยวกับสโมสร',
            'players': 'ผู้เล่น',
            'player': 'โปรไฟล์ผู้เล่น',
            'aboutus': 'เกี่ยวกับเรา',
            'tournament': 'เกี่ยวกับการแข่งขัน',
            'tournaments': 'การแข่งขัน',
            'alltournaments': 'การแข่งขัน',
            'allplayers': 'ผู้เล่น',
            'alltrainings': 'เทรนกับโค้ช',
            'training': 'เกี่ยวกับการฝึกอบรม',
            'trainings': 'เทรนกับโค้ช',
            'dashboard': 'ข้อมูลส่วนบุคคล',
            'user_dashboard': 'ข้อมูลส่วนบุคคล',
            'admin_dashboard': 'แดชบอร์ดผู้ดูแลระบบ',
            'club_dashboard': 'แดชบอร์ดสโมสร',
            'trainer_dashboard': 'แดชบอร์ดโค้ช',
            'editclub': 'แก้ไขรายละเอียดสโมสร'
            
        }
    };

    const currentLang = Object.keys(languageMap).find(lang => pathArray.includes(lang)) || 'en';
    const filteredPathArray = pathArray.filter(part => !Object.keys(languageMap).includes(part));
    
    let breadcrumbHTML = `<li class="navigate_breadcrumb_item"><a href="/${currentLang}">${translations[currentLang]['home']}</a></li>`;

    const dashboardIndex = filteredPathArray.indexOf('dashboard');

    if (dashboardIndex !== -1) {
        const nextSegment = filteredPathArray[dashboardIndex + 1]; // Сегмент после "dashboard"

        let translatedPath;
        const dashboardPath = `/${currentLang}/dashboard`;

        if (nextSegment === 'club') {
            translatedPath = translations[currentLang]['club_dashboard'];
        } else if (nextSegment === 'player' || nextSegment === 'trainer') {
            translatedPath = translations[currentLang]['user_dashboard'];
        } else if (nextSegment === 'editclub') {
            translatedPath = translations[currentLang]['editclub'];
        }else {
            translatedPath = translations[currentLang]['dashboard'];
        }

        breadcrumbHTML += `<li class="navigate_breadcrumb_item"><a href="${dashboardPath}/${nextSegment}">${translatedPath}</a></li>`;
    } else {
        filteredPathArray.forEach((path, index) => {
            const isLast = index === filteredPathArray.length - 1;
            const containsNumbers = /\d/.test(path);
            const urlPath = '/' + [currentLang, ...filteredPathArray.slice(0, index + 1)].join('/');

            let translatedPath;

            if (containsNumbers && filteredPathArray[index - 1] === 'allclubs') {
                translatedPath = translations[currentLang]['club'];
            } else if (containsNumbers && filteredPathArray[index - 1] === 'allplayers') {
                translatedPath = translations[currentLang]['player'];
            } else if (containsNumbers && filteredPathArray[index - 1] === 'tournaments') {
                translatedPath = translations[currentLang]['tournament'];
            } else if (containsNumbers && filteredPathArray[index - 1] === 'trainings') {
                translatedPath = translations[currentLang]['training'];
            } else if (containsNumbers && filteredPathArray[index - 1] === 'createtournament') {
                translatedPath = '...';
            } else {
                translatedPath = translations[currentLang][path] || capitalize(path);
            }

            if (isLast) {
                breadcrumbHTML += `<li class="navigate_breadcrumb_item navigate_breadcrumb_item_active" aria-current="page">${translatedPath}</li>`;
            } else {
                breadcrumbHTML += `<li class="navigate_breadcrumb_item"><a href="${urlPath}">${translatedPath}</a></li>`;
            }
        });
    }
    breadcrumbContainer.innerHTML = breadcrumbHTML;
}

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}


async function logout() {
    try {
        const response = await fetch('/logout', {
            method: 'POST',
            credentials: 'same-origin' // Убедитесь, что куки отправляются с запросом
        });
        if (!response.ok) {
            throw new Error('Logout failed');
        }
        window.location.href = '/'; // Перенаправление на главную страницу
    } catch (error) {
        console.error('Error during logout:', error);
    }
}


export function listenerOfButtons() {
    const languageMap = {
        'russian': 'ru',
        'english': 'en',
        'thai': 'th'
    };

    

    if (document.querySelector('#myProfile')) {
        const accountBtnMenu = document.querySelector('#myProfile');
        const accountMenu = document.querySelector('.profileMenu');
        accountBtnMenu.addEventListener('click', (event) => {
            event.preventDefault();
            accountMenu.classList.toggle('header_account_content_openMenu');
        })
    }


    document.addEventListener('click', async function(event) {
        
        // console.log(event.target);
        if (event.target.classList.contains('btnRegister')) {
            registrationForm();
        }

        if (event.target.classList.contains('btnFogot')) {
            restoreAccesForm();
        }

        if (event.target.classList.contains('btnLogin')) {
            loginForm();
        }

        if (event.target.closest('.goToAllClubs')) {
            window.location.href = `/${languageMap[localStorage.clientLang]}/allclubs`;
        }

        if (event.target.closest('.goToAllPlayers')) {
            window.location.href = `/${languageMap[localStorage.clientLang]}/allplayers`;
        }

        if (event.target.closest('.goToAllTournaments')) {
            window.location.href = `/${languageMap[localStorage.clientLang]}/alltournaments`;
        }
        
        if (event.target.closest('.goToAboutUs')) {
            window.location.href = `/${languageMap[localStorage.clientLang]}/aboutus`;
        }

        // if (event.target.closest('.goToAllTrainings')) {
        //     event.preventDefault();
        //     window.location.href = `/${languageMap[localStorage.clientLang]}/alltrainings`;
        // }

        if (event.target.closest('.goToAllCoaches')) {
            event.preventDefault();
            window.location.href = `/${languageMap[localStorage.clientLang]}/allcoaches`;
        }
        
        // if (event.target.closest('.admin_user') || event.target.closest('.admin_user_img')) {
        //     event.preventDefault();
        //     document.querySelector('.admin_profileMenu').classList.toggle('admin_profileMenu_openMenu');
        // } else

        // if (document.querySelector('.admin_profileMenu').classList.contains('admin_profileMenu_openMenu') && !event.target.closest('.admin_user') && !event.target.closest('.admin_user_img')) {
        //     document.querySelector('.admin_profileMenu').classList.toggle('admin_profileMenu_openMenu');
        // } else

        
        // if (event.target.id === 'logOut') {
        //     event.preventDefault();
        //     logout();
        // }
        const needRegisterTranslate = {
            "ru": "Пожалуйста, зарегистрируйтесь, чтобы подать заявку.",
            "en": "Please register to submit an application.",
            "th": "กรุณาลงทะเบียนเพื่อส่งใบสมัคร."
        }

        if (event.target.id === 'becomeCoach') {
            // const lang = localStorage.clientLang;
            try {
                const response = await fetch(`/becomeacoach`);
    
                if (response.ok) {
                    window.location.href = `/${languageMap[localStorage.clientLang]}/becomeacoach`;
                } else if (response.status === 401) {
                    const data = await response.json();
                    // console.log(data);
                    if(data.message === 'Need register') {
                        alert(needRegisterTranslate[languageMap[localStorage.clientLang]]);
                    }
                    
                }
            } catch (error) {
                console.error('Ошибка при переходе на страницу тренера:', error);
                alert('Error. Please try again later.');
            }
        }

        // if (event.target.id === 'becomeCoach') {
        //     window.location.href = `/${languageMap[localStorage.clientLang]}/becomeacoach`;
        // }

        if (event.target.id === 'btnAddClub') {
            window.location.href = `/${languageMap[localStorage.clientLang]}/addclub`;
        }

        // if (event.target.id === 'createTournament') {
        //     window.location.href = `/${languageMap[localStorage.clientLang]}/createtournament`;
        // }

        if (event.target.closest('.clubs_down')) {
            event.preventDefault();
            if (event.target.id === 'goToAllCoaches') {
                const selectedLanguage = localStorage.getItem('clientLang') || 'english';
                const homeUrl = `/${languageMap[selectedLanguage] || 'en'}`;
                window.location.href = homeUrl + '/allcoaches';
            }
           
        }

        if (event.target.closest('.logo')) {
            event.preventDefault();
            const selectedLanguage = localStorage.getItem('clientLang') || 'english';
            const homeUrl = `/${languageMap[selectedLanguage] || 'en'}`;
            window.location.href = homeUrl;
        }

        if (event.target.closest('#burger')) {
            document.querySelector('.header_bottom_mob')?.classList.toggle('header_bottom_mob_openMenu');
        }
        
        if (event.target.closest('.header_bottom_mob_cross')) {
            document.querySelector('.header_bottom_mob')?.classList.toggle('header_bottom_mob_openMenu');
        }

        if (!event.target.closest('#burger') && !event.target.closest('.header_bottom header_bottom_mob') && !event.target.closest('#playerSearchInput')) {
            if ( document.querySelector('.header_bottom_mob')) {
                document.querySelector('.header_bottom_mob').classList.remove('header_bottom_mob_openMenu');
            }
        }

        // if (event.target.closest('.manageAllPlayers')) {
        //     event.preventDefault();
        //     console.log('/ru/dashboard/admin');
        //     window.location.href = '/ru/dashboard/admin';
        // } else

        // if (event.target.closest('.manageAllClubs')) {
        //     event.preventDefault();
        //     console.log('/ru/dashboard/admin/clubs');
        //     window.location.href = '/ru/dashboard/admin/clubs';
        // } else

        // if (event.target.closest('.manageAllCoaches')) {
        //     event.preventDefault();
        //     console.log('/ru/dashboard/admin/clubs');
        //     window.location.href = '/ru/dashboard/admin/coaches';
        // } else

        // if (event.target.closest('.manageAllTournaments')) {
        //     event.preventDefault();
        //     console.log('/ru/dashboard/admin/clubs');
        //     window.location.href = '/ru/dashboard/admin/tournaments';
        // } else

        // if (event.target.closest('.manageAllTrainings')) {
        //     event.preventDefault();
        //     console.log('/ru/dashboard/admin/clubs');
        //     window.location.href = '/ru/dashboard/admin/trainings';
        // } else

        // if (event.target.closest('.manageCoachApplications')) {
        //     event.preventDefault();
        //     console.log('/ru/dashboard/admin/clubs');
        //     window.location.href = '/ru/dashboard/admin/coachapply';
        // } else

        // if (event.target.closest('.manageClubApplications')) {
        //     event.preventDefault();
        //     console.log('/ru/dashboard/admin/clubs');
        //     window.location.href = '/ru/dashboard/admin/clubapply';
        // } else

        // if (event.target.closest('.manageAdvertisement')) {
        //     event.preventDefault();
        //     console.log('/ru/dashboard/admin/clubs');
        //     window.location.href = '/ru/dashboard/admin/adv';
        // } else

        // if (event.target.closest('.admin_user')) {
        //     event.preventDefault();
        //     document.querySelector('.admin_profileMenu').classList.toggle('admin_profileMenu_openMenu');
        // }

        // if (document.querySelector('.admin_profileMenu').classList.contains('admin_profileMenu_openMenu') && !event.target.closest('.admin_user')) {
        //     document.querySelector('.admin_profileMenu').classList.toggle('admin_profileMenu_openMenu');
        // }
        // if (document.querySelector('.admin_profileMenu').classList.contains('admin_profileMenu_openMenu') && !event.target.closest('.admin_user') && !event.target.closest('.admin_user_img')) {
        //     document.querySelector('.admin_profileMenu').classList.toggle('admin_profileMenu_openMenu');
        // }

        // if (document.querySelector('.admin_profileMenu')) {
        //     if (document.querySelector('.admin_profileMenu').classList.contains('admin_profileMenu_openMenu') && !event.target.closest('.admin_user') && !event.target.closest('.admin_user_img')) {
        //         document.querySelector('.admin_profileMenu').classList.toggle('admin_profileMenu_openMenu');
        //     }
        // }
        if (document.querySelector('.admin_profileMenu')) {
            if (document.querySelector('.admin_profileMenu').classList.contains('admin_profileMenu_openMenu') && !event.target.closest('.admin_user')) {
                document.querySelector('.admin_profileMenu').classList.remove('admin_profileMenu_openMenu');
            }
        }
        
    });

    if (document.querySelector('.admin_header')) {
        document.querySelector('.admin_header').addEventListener('click', (event) => {
            if (event.target.closest('.admin_user')) {
                event.preventDefault();
                document.querySelector('.admin_profileMenu').classList.toggle('admin_profileMenu_openMenu');
            }
            

            if (event.target.id === 'adminHome') {
                event.preventDefault();
                window.location.href = '/ru/dashboard/admin';
            }
            if (event.target.id === 'logOut') {
                event.preventDefault();
                logout();
            }
    
        });
    }
    
    if (document.querySelector('.admin_sidebar')) {
        document.querySelector('.admin_sidebar').addEventListener('click', (event) => {
            if (event.target.closest('.manageAllPlayers')) {
                event.preventDefault();
                console.log('/ru/dashboard/admin');
                window.location.href = '/ru/dashboard/admin';
            } else if (event.target.closest('.manageAllClubs')) {
                event.preventDefault();
                console.log('/ru/dashboard/admin/clubs');
                window.location.href = '/ru/dashboard/admin/clubs';
            } else if (event.target.closest('.manageAllCoaches')) {
                event.preventDefault();
                console.log('/ru/dashboard/admin/coaches');
                window.location.href = '/ru/dashboard/admin/coaches';
            } else if (event.target.closest('.manageAllTournaments')) {
                event.preventDefault();
                console.log('/ru/dashboard/admin/tournaments');
                window.location.href = '/ru/dashboard/admin/tournaments';
            } else if (event.target.closest('.manageAllTrainings')) {
                event.preventDefault();
                console.log('/ru/dashboard/admin/trainings');
                window.location.href = '/ru/dashboard/admin/trainings';
            } else if (event.target.closest('.manageCoachApplications')) {
                event.preventDefault();
                console.log('/ru/dashboard/admin/coachapply');
                window.location.href = '/ru/dashboard/admin/coachapply';
            } else if (event.target.closest('.manageClubApplications')) {
                event.preventDefault();
                console.log('/ru/dashboard/admin/clubapply');
                window.location.href = '/ru/dashboard/admin/clubapply';
            } else if (event.target.closest('.manageAdvertisement')) {
                event.preventDefault();
                console.log('/ru/dashboard/admin/adv');
                window.location.href = '/ru/dashboard/admin/adv';
            } else if (event.target.closest('.manageCities')) {
                event.preventDefault();
                console.log('/ru/dashboard/admin/cities');
                window.location.href = '/ru/dashboard/admin/cities';
            }
        });
    }
    

    // Modal window
    const modal = document.getElementById("myModal");
    const content = modal.querySelector('.modal-content');

    window.closeModal = function() {
        const modal = document.getElementById("myModal");
        modal.style.display = "none";
        document.body.style = 'overflow: auto;';
        content.innerHTML = ``;
    }
    
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
            document.body.style = 'overflow: auto;';
            content.innerHTML = ``;
        }
    }

}


export function controlTextAreaCoach(area, note) {
    const textarea = document.getElementById(`${area}`);
    const textareaLimit = document.querySelector(`${note}`);
    const maxChars = 3000;

    function autoResize() {
        if (this.value.length > maxChars) {
            this.value = this.value.slice(0, maxChars);
            showCharLimitNotification();
        }
        this.style.height = 'auto';
        this.style.height = this.scrollHeight + 'px';
    }

    const showCharLimitNotification = () => {
        textareaLimit.style.display = 'flex';
        setTimeout(() => {
            textareaLimit.style.display = 'none';
        }, 3000);
    };

    textarea.addEventListener('input', () => {
        autoResize.call(textarea);
    });
}

// function validateDates() {
//     const dateFromInput = document.getElementById('dateFromInput');
//     const dateUntilInput = document.getElementById('dateUntilInput');

//     const dateFromParts = dateFromInput.value.split('.');
//     const dateUntilParts = dateUntilInput.value.split('.');

//     const dateFrom = new Date(`${dateFromParts[2]}-${dateFromParts[1]}-${dateFromParts[0]}`);
//     const dateUntil = new Date(`${dateUntilParts[2]}-${dateUntilParts[1]}-${dateUntilParts[0]}`);

//     if (dateFrom > dateUntil) {
//         alert('The "From" date cannot be later than the "Until" date.');
//         return false;
//     }
//     return true;
// }


// export async function getAllTournaments() {
//     const dateFromInput = document.getElementById('dateFromInput');
//     const dateUntilInput = document.getElementById('dateUntilInput');
//     const clubInput = document.getElementById('clubInput');
//     const cityInput = document.getElementById('cityInput');

//     const clubDropdown = document.getElementById('clubDropdown');
//     const cityDropdown = document.getElementById('cityDropdown');
//     const searchButton = document.getElementById('filterTournaments_btnSearch');

//     const upcomingBlock = document.querySelector('.upcommingTable_content');
//     const pastBlock = document.querySelector('.lastTournamentsTable_content');

//     if (!upcomingBlock) {
//         console.error('Контейнеры будущих турниров не найден');
//         return;
//     }
//     if (!pastBlock) {
//         console.error('Контейнеры прошедших турниров не найден');
//         return;
//     }

    
//     const languageMap = {
//         'russian': 'ru',
//         'english': 'en',
//         'thai': 'th'
//     };

//     const currentLang = localStorage.getItem('clientLang') || 'english';
//     const langKey = languageMap[currentLang];

//     let allTournaments = [];
//     let cities = {};

//     await fetchAllTournaments();
//     await fetchCities();

//     async function fetchAllTournaments() {
//         try {
//             const response = await fetch(`/get-future-tournaments`);
//             const tournaments = await response.json();
//             allTournaments = tournaments;

//             // Display first 12 tournaments initially
//             displayTournaments(tournaments.slice(0, 12), upcomingBlock, pastBlock);

//             const clubs = [...new Set(tournaments.map(tournament => tournament.club.name))];
//             const cityIds = [...new Set(tournaments.map(tournament => tournament.city._id))];
//             clubs.sort();
//             // console.log(cityIds);
//             // Retrieve city names from MongoDB collection 'cities'
//             const cityNames = await Promise.all(cityIds.map(cityId => getCityName(cityId)));
//             cityNames.sort();
            

//             createDropdown(clubDropdown, clubs, clubInput);
//             createDropdown(cityDropdown, cityNames, cityInput);
//         } catch (error) {
//             console.error('Произошла ошибка:', error);
//             showErrorModal('Database connection error', 'Ops!');
//         }
//     }

//     let debounceTimeout;

//     dateFromInput.addEventListener('input', () => formatInputDate(dateFromInput));
//     dateUntilInput.addEventListener('input', () => formatInputDate(dateUntilInput));
//     clubInput.addEventListener('input', () => debounceFilterTournaments(updateClubDropdown));
//     cityInput.addEventListener('input', () => debounceFilterTournaments(updateCityDropdown));

//     dateFromInput.addEventListener('blur', validateDates);
//     dateUntilInput.addEventListener('blur', validateDates);

//     clubInput.addEventListener('focus', () => clubDropdown.style.display = 'block');
//     cityInput.addEventListener('focus', () => cityDropdown.style.display = 'block');

//     clubInput.addEventListener('blur', () => setTimeout(() => clubDropdown.style.display = 'none', 200));
//     cityInput.addEventListener('blur', () => setTimeout(() => cityDropdown.style.display = 'none', 200));

//     searchButton.addEventListener('click', function(event) {
//         event.preventDefault();
//         filterTournaments();
//     });

//     function debounceFilterTournaments(updateDropdown) {
//         clearTimeout(debounceTimeout);
//         debounceTimeout = setTimeout(() => {
//             updateDropdown();
//             filterTournaments();
//         }, 300);
//     }

//     function updateClubDropdown() {
//         updateDropdownList(clubDropdown, [...new Set(allTournaments.map(tournament => tournament.club.name))], clubInput);
//     }

//     function updateCityDropdown() {
//         const cityNames = Object.values(cities);
//         updateDropdownList(cityDropdown, cityNames, cityInput);
//     }

//     async function getCityName(cityId) {
//         try {
//             const response = await fetch(`/cities/${cityId}`);
//             if (!response.ok) {
//                 throw new Error('City data not found');
//             }
//             const city = await response.json();
    
//             return city[currentLang] || city['english']; // Возвращаем название города на заданном языке или английском (по умолчанию)
//         } catch (error) {
//             console.error('Ошибка при получении названия города:', error);
//             return 'Unknown City'; // Возвращение запасного значения в случае ошибки
//         }
//     }

//     function createDropdown(dropdown, options, inputElement) {
//         dropdown.innerHTML = '';
//         options.forEach(option => {
//             const div = document.createElement('div');
//             div.textContent = option;
//             div.addEventListener('click', () => {
//                 inputElement.value = option;
//                 dropdown.style.display = 'none';
//                 filterTournaments();
//             });
//             dropdown.appendChild(div);
//         });
//     }

//     function updateDropdownList(dropdown, options, inputElement) {
//         dropdown.innerHTML = '';
//         const currentText = inputElement.value.toLowerCase();
//         const filteredOptions = options.filter(option => option.toLowerCase().includes(currentText));

//         filteredOptions.forEach(option => {
//             const div = document.createElement('div');
//             div.textContent = option;
//             div.addEventListener('click', () => {
//                 inputElement.value = option;
//                 dropdown.style.display = 'none';
//                 filterTournaments();
//             });
//             dropdown.appendChild(div);
//         });
//         dropdown.style.display = 'block';
//     }

//     async function filterTournaments() {
//         const dateFromValue = dateFromInput.value;
//         const dateUntilValue = dateUntilInput.value;
//         const clubValue = clubInput.value.toLowerCase();
//         const cityValue = cityInput.value.toLowerCase();

//         const filteredTournaments = await Promise.all(allTournaments.map(async tournament => {
//             const dateFromMatch = !dateFromValue || new Date(tournament.date) >= new Date(dateFromValue.split('.').reverse().join('-'));
//             const dateUntilMatch = !dateUntilValue || new Date(tournament.date) <= new Date(dateUntilValue.split('.').reverse().join('-'));
//             const clubMatch = !clubValue || tournament.club.name.toLowerCase().includes(clubValue);

//             const cityName = await getCityName(tournament.city._id, langKey);
//             const cityMatch = !cityValue || cityValue === 'all' || cityName.toLowerCase().includes(cityValue);

//             return dateFromMatch && dateUntilMatch && clubMatch && cityMatch ? tournament : null;
//         }));

//         const validTournaments = filteredTournaments.filter(tournament => tournament !== null);
//         displayTournaments(validTournaments, upcomingBlock, pastBlock);
//     }

//     function validateDates() {
//         const dateFromInput = document.getElementById('dateFromInput');
//         const dateUntilInput = document.getElementById('dateUntilInput');

//         const dateFromParts = dateFromInput.value.split('.');
//         const dateUntilParts = dateUntilInput.value.split('.');

//         const dateFrom = new Date(`${dateFromParts[2]}-${dateFromParts[1]}-${dateFromParts[0]}`);
//         const dateUntil = new Date(`${dateUntilParts[2]}-${dateUntilParts[1]}-${dateUntilParts[0]}`);

//         if (dateFrom > dateUntil) {
//             alert('The "From" date cannot be later than the "Until" date.');
//             return false;
//         }
//         return true;
//     }

//     function formatInputDate(input) {
//         input.addEventListener('input', function (e) {
//             let value = e.target.value.replace(/\D/g, '');
//             if (value.length > 2 && value.length <= 4) {
//                 value = value.replace(/^(\d{2})(\d{1,2})$/, '$1.$2');
//             } else if (value.length > 4) {
//                 value = value.replace(/^(\d{2})(\d{2})(\d{1,4})$/, '$1.$2.$3');
//             }
//             e.target.value = value;
//         });
//     }

//     async function displayTournaments(tournaments, upcomingContainer, pastContainer) {
//         try {
//             // Очистим содержимое контейнеров перед отрисовкой новых данных
//             upcomingContainer.innerHTML = '';
//             pastContainer.innerHTML = '';
    
//             const languageMap = {
//                 'russian': 'ru',
//                 'english': 'en',
//                 'thai': 'th'
//             };
    
//             const currentLang = localStorage.getItem('clientLang') || 'english';
//             const langKey = languageMap[currentLang];
    
//             let upcomingTournaments = tournaments.filter(tournament => new Date(tournament.datetime) >= new Date());
//             let pastTournaments = tournaments.filter(tournament => new Date(tournament.datetime) < new Date());
    
//             // Сортируем турниры по дате
//             upcomingTournaments.sort((a, b) => new Date(a.datetime) - new Date(b.datetime));
//             pastTournaments.sort((a, b) => new Date(b.datetime) - new Date(a.datetime));
    
//             const renderTournament = async (tournament, container, className) => {
//                 let tournamentDate = new Date(tournament.datetime);
//                 let langMap = { 'english': 'en-US', 'thai': 'th-TH', 'russian': 'ru-RU' };
                
//                 let lang = langMap[localStorage.clientLang] || 'en-US';
//                 let dayOfWeek = tournamentDate.toLocaleDateString(lang, { weekday: 'long' });
//                 let formattedDate = `${dayOfWeek} ${String(tournamentDate.getDate()).padStart(2, '0')}.${String(tournamentDate.getMonth() + 1).padStart(2, '0')}.${tournamentDate.getFullYear()}`;
    
//                 if (container.dataset.currentDay !== formattedDate) {
//                     container.dataset.currentDay = formattedDate;
//                     let weekdayDiv = document.createElement('div');
//                     weekdayDiv.className = `${className}_weekday`;
//                     let dateSpan = document.createElement('span');
//                     dateSpan.textContent = formattedDate;
//                     weekdayDiv.appendChild(dateSpan);
//                     container.appendChild(weekdayDiv);
//                 }
    
//                 let tournamentDiv = document.createElement('a');
//                 tournamentDiv.className = `${className}_tournament`;
//                 tournamentDiv.href = `/${languageMap[currentLang]}/tournaments/${tournament._id}`;
    
//                 let timeDiv = document.createElement('div');
//                 timeDiv.className = 'cell tournament_time';
//                 timeDiv.textContent = tournament.datetime.split('T')[1].substring(0, 5);
//                 tournamentDiv.appendChild(timeDiv);
    
//                 let clubDiv = document.createElement('div');
//                 clubDiv.className = 'cell tournament_club';
//                 let clubLogoDiv = document.createElement('div');
//                 clubLogoDiv.className = 'clubLogo';
//                 clubLogoDiv.style.cssText = `background-image: url('${tournament.club.logo}'); background-position: 50%; background-size: cover; background-repeat: no-repeat;`;
//                 clubDiv.appendChild(clubLogoDiv);
    
//                 let clubNameSpan = document.createElement('span');
//                 clubNameSpan.textContent = tournament.club.name;
//                 clubDiv.appendChild(clubNameSpan);
//                 tournamentDiv.appendChild(clubDiv);
    
//                 let restrictionsDiv = document.createElement('div');
//                 restrictionsDiv.className = 'cell tournament_restrict';
//                 let restrictionStatusDiv = document.createElement('div');
//                 restrictionStatusDiv.className = 'restrictionStatus';
    
//                 if (new Date(tournament.datetime) > new Date()) {
//                     restrictionStatusDiv.style.background = '#007026';
//                 } else {
//                     restrictionStatusDiv.style.background = '#ADADAD';
//                 }
    
//                 let restrictionDiv = document.createElement('div');
//                 restrictionDiv.className = 'restriction';
//                 restrictionDiv.textContent = tournament.restrictions;
//                 restrictionStatusDiv.appendChild(restrictionDiv);
//                 restrictionsDiv.appendChild(restrictionStatusDiv);
//                 tournamentDiv.appendChild(restrictionsDiv);
    
//                 let ratingDiv = document.createElement('div');
//                 ratingDiv.className = 'cell tournament_rating';
//                 ratingDiv.textContent = tournament.rating;
//                 tournamentDiv.appendChild(ratingDiv);
    
//                 let playersDiv = document.createElement('a');
//                 playersDiv.className = 'cell tournament_players';
//                 let playersImg = document.createElement('img');
//                 playersImg.src = '/icons/user.svg';
//                 playersImg.alt = 'person';
//                 playersDiv.appendChild(playersImg);
//                 let playersSpan = document.createElement('span');
//                 playersSpan.textContent = tournament.players.length - 1;
//                 playersDiv.appendChild(playersSpan);
//                 tournamentDiv.appendChild(playersDiv);
    
//                 container.appendChild(tournamentDiv);
//             };
    
//             // Функция для отображения турниров по частям
//             const displayTournamentsInParts = async (tournaments, container, className, start, end) => {
//                 container.dataset.currentDay = '';
//                 for (let i = start; i < end; i++) {
//                     if (i >= tournaments.length) break;
//                     await renderTournament(tournaments[i], container, className);
//                 }
//             };
    
//             // Изначально отображаем по 12 турниров
//             await displayTournamentsInParts(upcomingTournaments, upcomingContainer, 'upcommingTable', 0, 12);
//             await displayTournamentsInParts(pastTournaments, pastContainer, 'lastTournamentsTable', 0, 12);
    
//             // Добавляем кнопки "See more"
//             let moreButtonUpcoming = document.createElement('a');
//             moreButtonUpcoming.className = 'upcommingTable_btn';
//             moreButtonUpcoming.href = '#';
//             let showMore = {
//                 'english': 'See more',
//                 'thai': 'ดูเพิ่มเติม',
//                 'russian': 'Смотреть еще'
//             };
//             moreButtonUpcoming.textContent = showMore[localStorage.clientLang] || 'See more';
//             upcomingContainer.appendChild(moreButtonUpcoming);
    
//             let moreButtonPast = document.createElement('a');
//             moreButtonPast.className = 'lastTournamentsTable_btn';
//             moreButtonPast.href = '#';
//             moreButtonPast.textContent = showMore[localStorage.clientLang] || 'See more';
//             pastContainer.appendChild(moreButtonPast);
    
//             // Обработчики кликов на кнопки "See more"
//             moreButtonUpcoming.addEventListener('click', async (event) => {
//                 event.preventDefault();
//                 upcomingContainer.innerHTML = '';
//                 await displayTournamentsInParts(upcomingTournaments, upcomingContainer, 'upcommingTable', 0, upcomingTournaments.length);
//                 moreButtonUpcoming.style.display = 'none';
//             });
    
//             moreButtonPast.addEventListener('click', async (event) => {
//                 event.preventDefault();
//                 pastContainer.innerHTML = '';
//                 await displayTournamentsInParts(pastTournaments, pastContainer, 'lastTournamentsTable', 0, pastTournaments.length);
//                 moreButtonPast.style.display = 'none';
//             });
    
//         } catch (error) {
//             console.error('Произошла ошибка при отображении турниров:', error);
//             showErrorModal('Error while displaying tournaments', 'Ops!');
//         }
//     } 
// }


export async function getAllTournaments(user) {
    const dateFromInput = document.getElementById('dateFromInput');
    const dateUntilInput = document.getElementById('dateUntilInput');
    const clubInput = document.getElementById('clubInput');
    const cityInput = document.getElementById('cityInput');

    const clubDropdown = document.getElementById('clubDropdown');
    const cityDropdown = document.getElementById('cityDropdown');
    const searchButton = document.getElementById('filterTournaments_btnSearch');

    const upcomingBlock = document.querySelector('.upcommingTable_content');
    const pastBlock = document.querySelector('.lastTournamentsTable_content');

    if (!upcomingBlock) {
        console.error('Контейнеры будущих турниров не найден');
        return;
    }
    if (!pastBlock) {
        console.error('Контейнеры прошедших турниров не найден');
        return;
    }

    const languageMap = {
        'russian': 'ru',
        'english': 'en',
        'thai': 'th'
    };

    const currentLang = localStorage.getItem('clientLang') || 'english';
    const langKey = languageMap[currentLang];

    let allTournaments = [];
    let cities = [];
    let citiesObjects = [];

    await fetchCities();
    await fetchAllTournaments();
    

    async function fetchAllTournaments() {
        try {
            const response = await fetch(`/get-future-tournaments`);
            const tournaments = await response.json();
            allTournaments = tournaments;

            // Display first 12 tournaments initially
            displayTournaments(tournaments.slice(0, 12), upcomingBlock, pastBlock);

            const clubs = [...new Set(tournaments.map(tournament => tournament.club.name))];
            clubs.sort();

            createDropdown(clubDropdown, clubs, clubInput);
        } catch (error) {
            console.error('Произошла ошибка:', error);
            showErrorModal('Database connection error', 'Ops!');
        }
    }

    async function fetchCities() {
        try {
            const response = await fetch(`/cities?language=${currentLang}`);
            const data = await response.json();
            cities = data.cities;
            // console.log(cities);
            citiesObjects = data.citiesObjects;
            
            createDropdown(cityDropdown, cities, cityInput);
        } catch (error) {
            console.error('Произошла ошибка при получении городов:', error);
        }
    }

    let debounceTimeout;

    dateFromInput.addEventListener('input', () => formatInputDate(dateFromInput));
    dateUntilInput.addEventListener('input', () => formatInputDate(dateUntilInput));
    clubInput.addEventListener('input', () => debounceFilterTournaments(updateClubDropdown));
    cityInput.addEventListener('input', () => debounceFilterTournaments(updateCityDropdown));

    dateFromInput.addEventListener('blur', validateDates);
    dateUntilInput.addEventListener('blur', validateDates);

    clubInput.addEventListener('focus', () => clubDropdown.style.display = 'block');
    cityInput.addEventListener('focus', () => cityDropdown.style.display = 'block');

    clubInput.addEventListener('blur', () => setTimeout(() => clubDropdown.style.display = 'none', 200));
    cityInput.addEventListener('blur', () => setTimeout(() => cityDropdown.style.display = 'none', 200));

    searchButton.addEventListener('click', function(event) {
        event.preventDefault();
        filterTournaments();
    });

    function debounceFilterTournaments(updateDropdown) {
        clearTimeout(debounceTimeout);
        debounceTimeout = setTimeout(() => {
            updateDropdown();
            filterTournaments();
        }, 300);
    }

    function updateClubDropdown() {
        updateDropdownList(clubDropdown, [...new Set(allTournaments.map(tournament => tournament.club.name))], clubInput);
    }

    function updateCityDropdown() {
        updateDropdownList(cityDropdown, cities, cityInput);
    }

    function createDropdown(dropdown, options, inputElement) {
        dropdown.innerHTML = '';
        options.forEach(option => {
            const div = document.createElement('div');
            div.textContent = option;
            div.addEventListener('click', () => {
                inputElement.value = option;
                dropdown.style.display = 'none';
                filterTournaments();
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
                filterTournaments();
            });
            dropdown.appendChild(div);
        });
        dropdown.style.display = 'block';
    }

    async function filterTournaments() {
        const dateFromValue = dateFromInput.value;
        const dateUntilValue = dateUntilInput.value;
        const clubValue = clubInput.value.toLowerCase();
        const cityValue = cityInput.value.toLowerCase();

        const filteredTournaments = await Promise.all(allTournaments.map(async tournament => {
            const dateFromMatch = !dateFromValue || new Date(tournament.date) >= new Date(dateFromValue.split('.').reverse().join('-'));
            const dateUntilMatch = !dateUntilValue || new Date(tournament.date) <= new Date(dateUntilValue.split('.').reverse().join('-'));
            const clubMatch = !clubValue || tournament.club.name.toLowerCase().includes(clubValue);
            // const cityMatch = !cityValue || cityValue === 'all' || cities.includes(tournament.city._id) && cities[tournament.city._id].toLowerCase().includes(cityValue);
            const cityObject = citiesObjects.find(city => city._id.$oid === tournament.city._id); // Найти город по _id
            const cityMatch = !cityValue || cityValue === 'all' || (cityObject && cityObject[languageMap[localStorage.clientLang]].toLowerCase().includes(cityValue));

            return dateFromMatch && dateUntilMatch && clubMatch && cityMatch ? tournament : null;
        }));

        const validTournaments = filteredTournaments.filter(tournament => tournament !== null);
        displayTournaments(validTournaments, upcomingBlock, pastBlock);
    }

    function validateDates() {
        const dateFromInput = document.getElementById('dateFromInput');
        const dateUntilInput = document.getElementById('dateUntilInput');

        const dateFromParts = dateFromInput.value.split('.');
        const dateUntilParts = dateUntilInput.value.split('.');

        const dateFrom = new Date(`${dateFromParts[2]}-${dateFromParts[1]}-${dateFromParts[0]}`);
        const dateUntil = new Date(`${dateUntilParts[2]}-${dateUntilParts[1]}-${dateUntilParts[0]}`);

        if (dateFrom > dateUntil) {
            alert('The "From" date cannot be later than the "Until" date.');
            return false;
        }
        return true;
    }

    function formatInputDate(input) {
        input.addEventListener('input', function (e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 2 && value.length <= 4) {
                value = value.replace(/^(\d{2})(\d{1,2})$/, '$1.$2');
            } else if (value.length > 4) {
                value = value.replace(/^(\d{2})(\d{2})(\d{1,4})$/, '$1.$2.$3');
            }
            e.target.value = value;
        });
    }

    async function displayTournaments(tournaments, upcomingContainer, pastContainer) {
        try {
            // Очистим содержимое контейнеров перед отрисовкой новых данных
            upcomingContainer.innerHTML = '';
            pastContainer.innerHTML = '';

            const languageMap = {
                'russian': 'ru',
                'english': 'en',
                'thai': 'th'
            };

            const currentLang = localStorage.getItem('clientLang') || 'english';
            const langKey = languageMap[currentLang];

            let upcomingTournaments = tournaments.filter(tournament => new Date(tournament.datetime) >= new Date());
            let pastTournaments = tournaments.filter(tournament => new Date(tournament.datetime) < new Date());

            // Сортируем турниры по дате
            upcomingTournaments.sort((a, b) => new Date(a.datetime) - new Date(b.datetime));
            pastTournaments.sort((a, b) => new Date(b.datetime) - new Date(a.datetime));

            // const allPlayerIds = [...new Set(
            //     tournaments.flatMap(tournament => 
            //         tournament.players.map(player => player._id)
            //     )
            // )];
    
            // // Получение данных игроков
            // const allPlayers = await fetchPlayerDetails(allPlayerIds);
            // const playerMap = Object.fromEntries(allPlayers.map(player => [player._id, player]));

            // console.log(allPlayers);
            // console.log(playerMap);

            const renderTournament = async (tournament, container, className) => {
                let tournamentDate = new Date(tournament.datetime);
                let langMap = { 'english': 'en-US', 'thai': 'th-TH', 'russian': 'ru-RU' };

                // console.log(tournament);
                const allPlayerIds = [...new Set(
                    // tournaments.flatMap(tournament => 
                        tournament.players.map(player => player._id || player.id)
                    // )
                )];

                let allPlayers = [];
                try {
                    allPlayers = await fetchPlayerDetails(allPlayerIds);
                    // console.log('Fetched players:', allPlayers);
                } catch (error) {
                    console.error('Error fetching players:', error);
                }
        
                // console.log(allPlayers);
                // Получение данных игроков
                // const allPlayers = await fetchPlayerDetails(allPlayerIds);
                const playerMap = Object.fromEntries(allPlayers.map(player => [player._id, player])) || Object.fromEntries(allPlayers.map(player => [player.id, player]));
                
                // console.log(allPlayers);
                // console.log(playerMap);

                // const players = tournament.players.map(player => playerMap[player._id]).filter(player => player) || tournament.players.map(player => playerMap[player.id]).filter(player => player);
                const players = tournament.players
                    .map(player => playerMap[player._id || player.id])
                    .filter(player => player);

                // console.log(players);

                // const validPlayers = players.filter(player => typeof player.rating === 'number' && !isNaN(player.rating));
                // const totalRating = validPlayers.reduce((sum, player) => {
                //     return player.rating ? sum + player.rating : sum;
                // }, 0);

                const validPlayers = players.filter(player => 
                    player.rating !== undefined && !isNaN(Number(player.rating))
                );
                
                const totalRating = validPlayers.reduce((sum, player) => {
                    return sum + Number(player.rating);
                }, 0);
                
                

                const ratedPlayersCount = validPlayers.filter(player => player.hasOwnProperty('rating') && player.rating).length;
                
                const averageRating = ratedPlayersCount > 0 
                    ? Math.round(totalRating / ratedPlayersCount) 
                    : 0;
                // console.log(averageRating);
                tournament.rating = averageRating;
                // console.log(players);

                let lang = langMap[localStorage.clientLang] || 'en-US';
                let dayOfWeek = tournamentDate.toLocaleDateString(lang, { weekday: 'long' });
                let formattedDate = `${dayOfWeek} ${String(tournamentDate.getDate()).padStart(2, '0')}.${String(tournamentDate.getMonth() + 1).padStart(2, '0')}.${tournamentDate.getFullYear()}`;

                if (container.dataset.currentDay !== formattedDate) {
                    container.dataset.currentDay = formattedDate;
                    let weekdayDiv = document.createElement('div');
                    weekdayDiv.className = `${className}_weekday`;
                    let dateSpan = document.createElement('span');
                    dateSpan.textContent = formattedDate;
                    weekdayDiv.appendChild(dateSpan);
                    container.appendChild(weekdayDiv);
                }

                let tournamentDiv = document.createElement('a');
                tournamentDiv.className = `${className}_tournament`;
                if (user === 'admin') {
                    tournamentDiv.href = `/ru/dashboard/admin/edittournament/${tournament._id}`;
                } else {
                    tournamentDiv.href = `/${languageMap[currentLang]}/tournaments/${tournament._id}`;
                }
                

                let timeDiv = document.createElement('div');
                timeDiv.className = 'cell tournament_time';
                timeDiv.textContent = tournament.datetime.split('T')[1].substring(0, 5);
                tournamentDiv.appendChild(timeDiv);

                let clubDiv = document.createElement('div');
                clubDiv.className = 'cell tournament_club';
                let clubLogoDiv = document.createElement('div');
                clubLogoDiv.className = 'clubLogo';
                clubLogoDiv.style.cssText = `background-image: url('${tournament.club.logo}'); background-position: 50%; background-size: cover; background-repeat: no-repeat;`;
                clubDiv.appendChild(clubLogoDiv);

                let clubNameSpan = document.createElement('span');
                clubNameSpan.textContent = tournament.club.name;
                clubDiv.appendChild(clubNameSpan);
                tournamentDiv.appendChild(clubDiv);

                let restrictionsDiv = document.createElement('div');
                restrictionsDiv.className = 'cell tournament_restrict';
                let restrictionStatusDiv = document.createElement('div');
                restrictionStatusDiv.className = 'restrictionStatus';

                if (new Date(tournament.datetime) > new Date()) {
                    restrictionStatusDiv.style.background = '#007026';
                } else {
                    restrictionStatusDiv.style.background = '#ADADAD';
                }

                let restrictionDiv = document.createElement('div');
                restrictionDiv.className = 'restriction';
                restrictionDiv.textContent = tournament.restrictions;
                restrictionStatusDiv.appendChild(restrictionDiv);
                restrictionsDiv.appendChild(restrictionStatusDiv);
                tournamentDiv.appendChild(restrictionsDiv);

                let ratingDiv = document.createElement('div');
                ratingDiv.className = 'cell tournament_rating';
                ratingDiv.textContent = tournament.rating;
                tournamentDiv.appendChild(ratingDiv);

                let playersDiv = document.createElement('a');
                playersDiv.className = 'cell tournament_players';
                let playersImg = document.createElement('img');
                playersImg.src = '/icons/user.svg';
                playersImg.alt = 'person';
                playersDiv.appendChild(playersImg);
                let playersSpan = document.createElement('span');
                if (players.length && Array.isArray(players)) {
                    playersSpan.textContent = players.length;
                } else {
                    playersSpan.textContent = 0;
                }
                // playersSpan.textContent = players.length;
                playersDiv.appendChild(playersSpan);
                tournamentDiv.appendChild(playersDiv);

                container.appendChild(tournamentDiv);
            };

            // Функция для отображения турниров по частям
            const displayTournamentsInParts = async (tournaments, container, className, start, end) => {
                container.dataset.currentDay = '';
                for (let i = start; i < end; i++) {
                    if (i >= tournaments.length) break;
                    // console.log(tournaments[i]);
                    await renderTournament(tournaments[i], container, className);
                }
            };

            // Изначально отображаем по 12 турниров
            await displayTournamentsInParts(upcomingTournaments, upcomingContainer, 'upcommingTable', 0, 12);
            await displayTournamentsInParts(pastTournaments, pastContainer, 'lastTournamentsTable', 0, 12);

            // Добавляем кнопки "See more"
            let moreButtonUpcoming = document.createElement('a');
            moreButtonUpcoming.className = 'upcommingTable_btn';
            moreButtonUpcoming.href = '#';
            let showMore = {
                'english': 'See more',
                'thai': 'ดูเพิ่มเติม',
                'russian': 'Смотреть еще'
            };
            moreButtonUpcoming.textContent = showMore[localStorage.clientLang] || 'See more';
            upcomingContainer.appendChild(moreButtonUpcoming);

            let moreButtonPast = document.createElement('a');
            moreButtonPast.className = 'lastTournamentsTable_btn';
            moreButtonPast.href = '#';
            moreButtonPast.textContent = showMore[localStorage.clientLang] || 'See more';
            pastContainer.appendChild(moreButtonPast);

            // Обработчики кликов на кнопки "See more"
            moreButtonUpcoming.addEventListener('click', async (event) => {
                event.preventDefault();
                upcomingContainer.innerHTML = '';
                await displayTournamentsInParts(upcomingTournaments, upcomingContainer, 'upcommingTable', 0, upcomingTournaments.length);
                moreButtonUpcoming.style.display = 'none';
            });

            moreButtonPast.addEventListener('click', async (event) => {
                event.preventDefault();
                pastContainer.innerHTML = '';
                await displayTournamentsInParts(pastTournaments, pastContainer, 'lastTournamentsTable', 0, pastTournaments.length);
                moreButtonPast.style.display = 'none';
            });

        } catch (error) {
            console.error('Произошла ошибка при отображении турниров:', error);
            showErrorModal('Error while displaying tournaments', 'Ops!');
        }
    }
}



// оптимизированая функция ниже этой, но ее нужно проверить
export async function getAllPlayers() {
    const ratingFromInput = document.getElementById('dateFromInput');
    const ratingUntilInput = document.getElementById('dateUntilInput');
    const nameInput = document.getElementById('clubInput');
    const cityInput = document.getElementById('cityInput');
    
    const nameDropdown = document.getElementById('clubDropdown');
    const cityDropdown = document.getElementById('cityDropdown');
    // cityDropdown.style.display = 'none';
    const searchButton = document.getElementById('filterPlayers_btnSearch');

    const playersContainer = document.querySelector('.playersTable_content');

    if (!playersContainer) {
        console.error('Контейнер для игроков не найден');
        return;
    }

    let allPlayers = [];
    let cities = {};
    let isFiltered = false; // Логическая переменная для отслеживания состояния фильтрации

    await fetchAllPlayers();

    let debounceTimeout;

    nameInput.addEventListener('input', () => {
        updateNameDropdown();
        debounceFilterPlayers();
    });

    cityInput.addEventListener('input', () => {
        updateCityDropdown();
        debounceFilterPlayers();
    });

    nameInput.addEventListener('focus', () => {
        nameDropdown.style.display = 'block';
        // cityDropdown.style.display = 'none'; // Скрыть дропдаун городов при фокусе на поле имени
        cityDropdown.style = 'display: none !important';
    });

    cityInput.addEventListener('focus', () => {
        // cityDropdown.style.display = 'block';
        cityDropdown.style = 'display: block !important';
        nameDropdown.style.display = 'none'; // Скрыть дропдаун имен при фокусе на поле города
    });

    nameInput.addEventListener('blur', () => setTimeout(() => nameDropdown.style.display = 'none', 200));
    cityInput.addEventListener('blur', () => setTimeout(() => cityDropdown.style.display = 'none', 200));

    searchButton.addEventListener('click', function (event) {
        event.preventDefault();
        isFiltered = true; // Устанавливаем состояние фильтрации
        filterPlayers();
    });

    function debounceFilterPlayers() {
        clearTimeout(debounceTimeout);
        debounceTimeout = setTimeout(() => {
            isFiltered = true; // Устанавливаем состояние фильтрации
            filterPlayers();
        }, 300);
    }

    function updateNameDropdown() {
        const names = [...new Set(allPlayers.map(player => player.fullname).filter(Boolean))];
        const nicknames = [...new Set(allPlayers.map(player => player.nickname).filter(Boolean))];
        updateDropdownList(nameDropdown, [...names, ...nicknames], nameInput);
    }

    function updateCityDropdown() {
        const cityNames = Object.values(cities);
        updateDropdownList(cityDropdown, cityNames, cityInput);
    }

    async function fetchAllPlayers() {
        try {
            const response = await fetch(`/get-players`);
            const players = await response.json();
            allPlayers = players;

            displayPlayers(players.slice(0, 16), playersContainer);

            const names = [...new Set(players.map(player => player.fullname).filter(Boolean))];
            const nicknames = [...new Set(players.map(player => player.nickname).filter(Boolean))];
            const cityIds = [...new Set(players.map(player => player.city))];

            createDropdown(nameDropdown, [...names, ...nicknames], nameInput);

            for (const cityId of cityIds) {
                await getCityName(cityId);
            }

            const cityNames = Object.values(cities).filter(Boolean);
            createDropdown(cityDropdown, cityNames, cityInput);

            // Скрыть дропдаун меню при инициализации
            // nameDropdown.style.display = 'none';
            // cityDropdown.style.display = 'none';

        } catch (error) {
            console.error('Произошла ошибка:', error);
            showErrorModal('Database connection error', 'Ops!');
        }
    }

    async function getCityName(cityId) {
        let currentLang = localStorage.getItem('clientLang');
        if (cities[cityId]) {
            return cities[cityId];
        }
        try {
            const response = await fetch(`/cities/${cityId}`);
            if (!response.ok) {
                throw new Error('City data not found');
            }
            const city = await response.json();
            cities[cityId] = city[currentLang] || city['english'];
            updateCityDropdown(); // Update dropdown as cities are fetched
            return cities[cityId];
        } catch (error) {
            console.error('Ошибка при получении названия города:', error);
            return 'Unknown City';
        }
    }

    function createDropdown(dropdown, options, inputElement) {
        dropdown.innerHTML = '';
        options.forEach(option => {
            const div = document.createElement('div');
            div.textContent = option;
            div.addEventListener('click', () => {
                inputElement.value = option;
                dropdown.style.display = 'none';
                isFiltered = true; // Устанавливаем состояние фильтрации
                filterPlayers();
            });
            dropdown.appendChild(div);
        });
    }

    function updateDropdownList(dropdown, options, inputElement) {
        dropdown.innerHTML = '';
        const currentText = (inputElement.value || '').toLowerCase();
        // console.log('Filtered options:', options);
        const filteredOptions = options.filter(option => option && option.toLowerCase().includes(currentText));

        filteredOptions.forEach(option => {
            const div = document.createElement('div');
            div.textContent = option;
            div.addEventListener('click', () => {
                inputElement.value = option;
                dropdown.style.display = 'none';
                isFiltered = true; // Устанавливаем состояние фильтрации
                filterPlayers();
            });
            dropdown.appendChild(div);
        });
        dropdown.style.display = 'block';

        // dropdown.style.display = filteredOptions.length > 0 ? 'block' : 'none'; // Отображаем дропдаун только если есть совпадения
    }

    async function filterPlayers() {
        const ratingFromValue = ratingFromInput.value;
        const ratingUntilValue = ratingUntilInput.value;
        const nameValue = (nameInput.value || '').toLowerCase();
        const cityValue = (cityInput.value || '').toLowerCase();

        const filteredPlayers = await Promise.all(allPlayers.map(async player => {
            const ratingFromMatch = !ratingFromValue || player.rating >= parseInt(ratingFromValue, 10);
            const ratingUntilMatch = !ratingUntilValue || player.rating <= parseInt(ratingUntilValue, 10);
            const nameMatch = !nameValue || (player.fullname && player.fullname.toLowerCase().includes(nameValue)) || (player.nickname && player.nickname.toLowerCase().includes(nameValue));

            const cityName = await getCityName(player.city);
            const cityMatch = !cityValue || cityValue === 'all' || (cityName && cityName.toLowerCase().includes(cityValue));

            return ratingFromMatch && ratingUntilMatch && nameMatch && cityMatch ? player : null;
        }));

        const validPlayers = filteredPlayers.filter(player => player !== null);
        displayPlayers(validPlayers, playersContainer);
    }

    async function displayPlayers(players, container) {
        let currentLang = localStorage.getItem('clientLang') || 'english';
        const languageMap = {
            'russian': 'ru',
            'english': 'en',
            'thai': 'th'
        };
        try {
            container.innerHTML = '';
    
            const cityNamesPromises = players.map(player => getCityName(player.city));
            const cityNames = await Promise.all(cityNamesPromises);
    
            players.forEach((player, index) => {
                let playerDiv = document.createElement('a');
                playerDiv.className = 'playersTable_player';
                playerDiv.href = `/${languageMap[currentLang]}/allplayers/${player._id}`;
    
                let numberDiv = document.createElement('div');
                numberDiv.className = 'cell player_number';
                numberDiv.textContent = index + 1;
                playerDiv.appendChild(numberDiv);
    
                let nameDiv = document.createElement('div');
                nameDiv.className = 'cell player_player';
                let playerLogoDiv = document.createElement('div');
                playerLogoDiv.className = 'playerLogo';
                playerLogoDiv.style.cssText = `background-image: url('${player.logo}'); background-position: 50%; background-size: cover; background-repeat: no-repeat;`;
                nameDiv.appendChild(playerLogoDiv);
    
                let playerNameSpan = document.createElement('span');
                playerNameSpan.textContent = player.fullname;
                nameDiv.appendChild(playerNameSpan);
                playerDiv.appendChild(nameDiv);
    
                let nicknameDiv = document.createElement('div');
                nicknameDiv.className = 'cell player_login';
                nicknameDiv.textContent = player.nickname ? player.nickname : ' ';
                playerDiv.appendChild(nicknameDiv);
    
                let cityDiv = document.createElement('div');
                cityDiv.className = 'cell player_city';
                cityDiv.textContent = cityNames[index];
                playerDiv.appendChild(cityDiv);
    
                let ratingDiv = document.createElement('div');
                ratingDiv.className = 'cell player_rating';
                ratingDiv.textContent = player.rating ? player.rating : '-';
                playerDiv.appendChild(ratingDiv);
    
                container.appendChild(playerDiv);
            });
    
            // Управление кнопкой "See more"
            if (!isFiltered && players.length < allPlayers.length) {
                // Если не фильтруем и отображаем меньше всех игроков, показываем кнопку "See more"            
                let moreButton = document.createElement('a');
                moreButton.className = 'playersTable_btn';
                moreButton.href = '#';
                let showMore = {
                    'english': 'See more',
                    'thai': 'ดูเพิ่มเติม',
                    'russian': 'Смотреть еще'
                };
                moreButton.textContent = showMore[localStorage.clientLang] || 'See more';
                moreButton.addEventListener('click', function (event) {
                    event.preventDefault();
                    displayAllPlayers();
                    moreButton.remove();
                });
                container.appendChild(moreButton);
            }
    
        } catch (error) {
            console.error('Произошла ошибка при отображении игроков:', error);
            showErrorModal('Error while displaying players', 'Ops!');
        }
    }
    
    async function displayAllPlayers() {
        try {
            displayPlayers(allPlayers, playersContainer);
        } catch (error) {
            console.error('Произошла ошибка при отображении всех игроков:', error);
            showErrorModal('Error while displaying all players', 'Ops!');
        }
    }
}

// export async function getAllPlayers() {
//     const ratingFromInput = document.getElementById('dateFromInput');
//     const ratingUntilInput = document.getElementById('dateUntilInput');
//     const nameInput = document.getElementById('clubInput');
//     const cityInput = document.getElementById('cityInput');
    
//     const nameDropdown = document.getElementById('clubDropdown');
//     const cityDropdown = document.getElementById('cityDropdown');
//     const searchButton = document.getElementById('filterPlayers_btnSearch');

//     const playersContainer = document.querySelector('.playersTable_content');

//     if (!playersContainer) {
//         console.error('Контейнер для игроков не найден');
//         return;
//     }

//     let allPlayers = [];
//     let cities = {};
//     let isFiltered = false;

//     await fetchAllPlayers();

//     let debounceTimeout;

//     nameInput.addEventListener('input', () => {
//         updateNameDropdown();
//         debounceFilterPlayers();
//     });

//     cityInput.addEventListener('input', () => {
//         updateCityDropdown();
//         debounceFilterPlayers();
//     });

//     nameInput.addEventListener('focus', () => {
//         nameDropdown.style.display = 'block';
//         cityDropdown.style = 'display: none !important';
//     });

//     cityInput.addEventListener('focus', () => {
//         cityDropdown.style = 'display: block !important';
//         nameDropdown.style.display = 'none';
//     });

//     nameInput.addEventListener('blur', () => setTimeout(() => nameDropdown.style.display = 'none', 200));
//     cityInput.addEventListener('blur', () => setTimeout(() => cityDropdown.style.display = 'none', 200));

//     searchButton.addEventListener('click', function (event) {
//         event.preventDefault();
//         isFiltered = true;
//         filterPlayers();
//     });

//     function debounceFilterPlayers() {
//         clearTimeout(debounceTimeout);
//         debounceTimeout = setTimeout(() => {
//             isFiltered = true;
//             filterPlayers();
//         }, 300);
//     }

//     function updateNameDropdown() {
//         const names = [...new Set(allPlayers.map(player => player.fullname).filter(Boolean))];
//         const nicknames = [...new Set(allPlayers.map(player => player.nickname).filter(Boolean))];
//         updateDropdownList(nameDropdown, [...names, ...nicknames], nameInput);
//     }

//     function updateCityDropdown() {
//         const cityNames = Object.values(cities);
//         updateDropdownList(cityDropdown, cityNames, cityInput);
//     }

//     async function fetchAllPlayers() {
//         try {
//             const response = await fetch(`/get-players`);
//             const players = await response.json();
//             allPlayers = players;

//             // Загрузка только первых 16 игроков для начального отображения
//             displayPlayers(players.slice(0, 16), playersContainer);

//             const names = [...new Set(players.map(player => player.fullname).filter(Boolean))];
//             const nicknames = [...new Set(players.map(player => player.nickname).filter(Boolean))];
//             const cityIds = [...new Set(players.map(player => player.city))];

//             createDropdown(nameDropdown, [...names, ...nicknames], nameInput);

//             // Одновременное получение всех городов, а не по одному для каждого игрока
//             const cityPromises = cityIds.map(cityId => getCityName(cityId));
//             await Promise.all(cityPromises);

//             const cityNames = Object.values(cities).filter(Boolean);
//             createDropdown(cityDropdown, cityNames, cityInput);
//         } catch (error) {
//             console.error('Произошла ошибка:', error);
//             showErrorModal('Database connection error', 'Ops!');
//         }
//     }

//     async function getCityName(cityId) {
//         if (cities[cityId]) {
//             return cities[cityId];
//         }
//         try {
//             const response = await fetch(`/cities/${cityId}`);
//             if (!response.ok) {
//                 throw new Error('City data not found');
//             }
//             const city = await response.json();
//             cities[cityId] = city[localStorage.getItem('clientLang')] || city['english'];
//             return cities[cityId];
//         } catch (error) {
//             console.error('Ошибка при получении названия города:', error);
//             return 'Unknown City';
//         }
//     }

//     function createDropdown(dropdown, options, inputElement) {
//         dropdown.innerHTML = '';
//         options.forEach(option => {
//             const div = document.createElement('div');
//             div.textContent = option;
//             div.addEventListener('click', () => {
//                 inputElement.value = option;
//                 dropdown.style.display = 'none';
//                 isFiltered = true;
//                 filterPlayers();
//             });
//             dropdown.appendChild(div);
//         });
//     }

//     function updateDropdownList(dropdown, options, inputElement) {
//         dropdown.innerHTML = '';
//         const currentText = (inputElement.value || '').toLowerCase();
//         const filteredOptions = options.filter(option => option && option.toLowerCase().includes(currentText));

//         filteredOptions.forEach(option => {
//             const div = document.createElement('div');
//             div.textContent = option;
//             div.addEventListener('click', () => {
//                 inputElement.value = option;
//                 dropdown.style.display = 'none';
//                 isFiltered = true;
//                 filterPlayers();
//             });
//             dropdown.appendChild(div);
//         });
//         dropdown.style.display = 'block';
//     }

//     async function filterPlayers() {
//         const ratingFromValue = ratingFromInput.value;
//         const ratingUntilValue = ratingUntilInput.value;
//         const nameValue = (nameInput.value || '').toLowerCase();
//         const cityValue = (cityInput.value || '').toLowerCase();

//         const filteredPlayers = await Promise.all(allPlayers.map(async player => {
//             const ratingFromMatch = !ratingFromValue || player.rating >= parseInt(ratingFromValue, 10);
//             const ratingUntilMatch = !ratingUntilValue || player.rating <= parseInt(ratingUntilValue, 10);
//             const nameMatch = !nameValue || (player.fullname && player.fullname.toLowerCase().includes(nameValue)) || (player.nickname && player.nickname.toLowerCase().includes(nameValue));

//             const cityName = await getCityName(player.city);
//             const cityMatch = !cityValue || cityValue === 'all' || (cityName && cityName.toLowerCase().includes(cityValue));

//             return ratingFromMatch && ratingUntilMatch && nameMatch && cityMatch ? player : null;
//         }));

//         const validPlayers = filteredPlayers.filter(player => player !== null);
//         displayPlayers(validPlayers, playersContainer);
//     }

//     async function displayPlayers(players, container) {
//         try {
//             container.innerHTML = '';
//             const fragment = document.createDocumentFragment(); // Используем фрагмент для улучшения производительности
//             const cityNamesPromises = players.map(player => getCityName(player.city));
//             const cityNames = await Promise.all(cityNamesPromises);

//             players.forEach((player, index) => {
//                 let playerDiv = document.createElement('a');
//                 playerDiv.className = 'playersTable_player';
//                 playerDiv.href = `/en/allplayers/${player._id}`;

//                 let numberDiv = document.createElement('div');
//                 numberDiv.className = 'cell player_number';
//                 numberDiv.textContent = index + 1;
//                 playerDiv.appendChild(numberDiv);

//                 let nameDiv = document.createElement('div');
//                 nameDiv.className = 'cell player_player';
//                 let playerLogoDiv = document.createElement('div');
//                 playerLogoDiv.className = 'playerLogo';
//                 playerLogoDiv.style.cssText = `background-image: url('${player.logo}'); background-position: 50%; background-size: cover; background-repeat: no-repeat;`;
//                 nameDiv.appendChild(playerLogoDiv);

//                 let playerNameSpan = document.createElement('span');
//                 playerNameSpan.textContent = player.fullname;
//                 nameDiv.appendChild(playerNameSpan);
//                 playerDiv.appendChild(nameDiv);

//                 let nicknameDiv = document.createElement('div');
//                 nicknameDiv.className = 'cell player_login';
//                 nicknameDiv.textContent = player.nickname ? player.nickname : ' ';
//                 playerDiv.appendChild(nicknameDiv);

//                 let cityDiv = document.createElement('div');
//                 cityDiv.className = 'cell player_city';
//                 cityDiv.textContent = cityNames[index];
//                 playerDiv.appendChild(cityDiv);

//                 let ratingDiv = document.createElement('div');
//                 ratingDiv.className = 'cell player_rating';
//                 ratingDiv.textContent = player.rating ? player.rating : '-';
//                 playerDiv.appendChild(ratingDiv);

//                 fragment.appendChild(playerDiv);
//             });

//             container.appendChild(fragment);

//             // Управление кнопкой "See more"
//             if (!isFiltered && players.length < allPlayers.length) {
//                 let moreButton = document.createElement('a');
//                 moreButton.className = 'playersTable_btn';
//                 moreButton.href = '#';
//                 let showMore = {
//                     'english': 'See more',
//                     'thai': 'ดูเพิ่มเติม',
//                     'russian': 'Смотреть еще'
//                 };
//                 moreButton.textContent = showMore[localStorage.clientLang] || 'See more';
//                 moreButton.addEventListener('click', function (event) {
//                     event.preventDefault();
//                     displayAllPlayers();
//                     moreButton.remove();
//                 });
//                 container.appendChild(moreButton);
//             }

//         } catch (error) {
//             console.error('Произошла ошибка при отображении игроков:', error);
//             showErrorModal('Error while displaying players', 'Ops!');
//         }
//     }

//     async function displayAllPlayers() {
//         try {
//             displayPlayers(allPlayers, playersContainer);
//         } catch (error) {
//             console.error('Произошла ошибка при отображении всех игроков:', error);
//             showErrorModal('Error while displaying all players', 'Ops!');
//         }
//     }
// }




export async function getAllTrainings() {
    const dateFromInput = document.getElementById('dateFromInput');
    const dateUntilInput = document.getElementById('dateUntilInput');
    const clubInput = document.getElementById('clubInput');
    const cityInput = document.getElementById('cityInput');
    const trainerNameInput = document.getElementById('trainerNameInput');

    const clubDropdown = document.getElementById('clubDropdown');
    const cityDropdown = document.getElementById('cityDropdown');
    const trainerNameDropdown = document.getElementById('trainerNameDropdown');
    const searchButton = document.getElementById('filterTrainings_btnSearch');

    const trainingsContainer = document.querySelector('.trainingsTable_content');

    if (!trainingsContainer) {
        console.error('Контейнеры для тренировок не найдены');
        return;
    }

    const languageMap = {
        'russian': 'ru',
        'english': 'en',
        'thai': 'th'
    };

    const currentLang = localStorage.getItem('clientLang') || 'english';
    const langKey = languageMap[currentLang];

    let allTrainings = [];
    let cities = [];
    let trainers = [];
    let checkCities = {};

    await fetchAllTrainings();

    async function fetchAllTrainings() {
        try {
            const response = await fetch(`/get-trainings`);
            const trainings = await response.json();
            allTrainings = trainings;

            // Создание объекта checkCities и получение названий городов
            const cityIds = [...new Set(trainings.map(training => training.city._id))];
            const cityNamesPromises = cityIds.map(cityId => getCityNameById(cityId));
            const cityNames = await Promise.all(cityNamesPromises);

            // Заполнение объекта checkCities
            cityIds.forEach((cityId, index) => {
                checkCities[cityId] = cityNames[index];
            });

            // Заполнение массива городов
            cities = cityNames.filter(city => city !== 'Unknown City'); // Удаление запасного значения

            // Display first 5 trainings initially
            displayTrainings(trainings.slice(0, 5), trainingsContainer);

            const clubs = [...new Set(trainings.map(training => training.club.name))];
            clubs.sort();

            trainers = [...new Set(trainings.map(training => training.trainer.name))];
            trainers.sort();
            
            createDropdown(cityDropdown, cities, cityInput);
            createDropdown(clubDropdown, clubs, clubInput);
            createDropdown(trainerNameDropdown, trainers, trainerNameInput);
        } catch (error) {
            console.error('Произошла ошибка:', error);
            showErrorModal('Database connection error', 'Ops!');
        }
    }

    async function getCityNameById(cityId) {
        try {
            const response = await fetch(`/cities/${cityId}`);
            if (!response.ok) {
                throw new Error('City data not found');
            }
            const city = await response.json();
            return city[currentLang] || 'Unknown City'; // Возвращает имя города на выбранном языке или "Unknown City"
        } catch (error) {
            console.error('Ошибка при получении названия города:', error);
            return 'Unknown City'; // Возвращение запасного значения в случае ошибки
        }
    }

    let debounceTimeout;

    dateFromInput.addEventListener('input', () => formatInputDate(dateFromInput));
    dateUntilInput.addEventListener('input', () => formatInputDate(dateUntilInput));
    clubInput.addEventListener('input', () => debounceFilterTrainings(updateClubDropdown));
    cityInput.addEventListener('input', () => debounceFilterTrainings(updateCityDropdown));
    trainerNameInput.addEventListener('input', () => debounceFilterTrainings(updateTrainerNameDropdown));

    dateFromInput.addEventListener('blur', validateDates);
    dateUntilInput.addEventListener('blur', validateDates);

    clubInput.addEventListener('focus', () => clubDropdown.style.display = 'block');
    cityInput.addEventListener('focus', () => {
        updateCityDropdown();
        cityDropdown.style.display = 'block';
    });
    trainerNameInput.addEventListener('focus', () => trainerNameDropdown.style.display = 'block');

    clubInput.addEventListener('blur', () => setTimeout(() => clubDropdown.style.display = 'none', 200));
    cityInput.addEventListener('blur', () => setTimeout(() => cityDropdown.style.display = 'none', 200));
    trainerNameInput.addEventListener('blur', () => setTimeout(() => trainerNameDropdown.style.display = 'none', 200));

    searchButton.addEventListener('click', function(event) {
        event.preventDefault();
        filterTrainings();
    });

    function debounceFilterTrainings(updateDropdown) {
        clearTimeout(debounceTimeout);
        debounceTimeout = setTimeout(() => {
            updateDropdown();
            filterTrainings();
        }, 300);
    }

    function updateClubDropdown() {
        updateDropdownList(clubDropdown, [...new Set(allTrainings.map(training => training.club.name))], clubInput);
    }

    function updateCityDropdown() {
        updateDropdownList(cityDropdown, cities, cityInput);
    }

    function updateTrainerNameDropdown() {
        updateDropdownList(trainerNameDropdown, trainers, trainerNameInput);
    }

    function createDropdown(dropdown, options, inputElement) {
        dropdown.innerHTML = '';
        options.forEach(option => {
            if (option) {
                const div = document.createElement('div');
                div.textContent = option;
                div.addEventListener('click', () => {
                    inputElement.value = option;
                    dropdown.style.display = 'none';
                    filterTrainings();
                });
                dropdown.appendChild(div);
            }
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
                filterTrainings();
            });
            dropdown.appendChild(div);
        });

        dropdown.style.display = 'block';
    }

    function validateDates() {
        const dateFromValue = new Date(dateFromInput.value.split('.').reverse().join('-'));
        const dateUntilValue = new Date(dateUntilInput.value.split('.').reverse().join('-'));

        if (dateFromValue && dateUntilValue && dateFromValue > dateUntilValue) {
            showErrorModal('Date Until must be later than Date From', 'Ops!');
        }
    }

    function formatInputDate(inputElement) {
        const inputValue = inputElement.value.replace(/\D/g, '').slice(0, 8);
        const formattedDate = inputValue.replace(/(\d{2})(\d{2})(\d{4})/, '$1.$2.$3');
        inputElement.value = formattedDate;
    }

    function filterTrainings() {
        const dateFromValue = dateFromInput.value;
        const dateUntilValue = dateUntilInput.value;
        const clubValue = clubInput.value.toLowerCase();
        const cityValue = cityInput.value.toLowerCase();
        const trainerNameValue = trainerNameInput.value.toLowerCase();

        const filteredTrainings = allTrainings.filter(training => {
            const trainingDate = new Date(training.date).toLocaleDateString('ru-RU');
            const clubName = training.club.name.toLowerCase();
            const cityId = training.city._id;
            const cityName = checkCities[cityId] ? checkCities[cityId].toLowerCase() : 'unknown city';
            const trainerName = training.trainer.name.toLowerCase();

            const isDateMatch = (!dateFromValue || new Date(trainingDate) >= new Date(dateFromValue.split('.').reverse().join('-'))) &&
                (!dateUntilValue || new Date(trainingDate) <= new Date(dateUntilValue.split('.').reverse().join('-')));
            const isClubMatch = !clubValue || clubName.includes(clubValue);
            const isCityMatch = !cityValue || cityName.includes(cityValue);
            const isTrainerNameMatch = !trainerNameValue || trainerName.includes(trainerNameValue);

            return isDateMatch && isClubMatch && isCityMatch && isTrainerNameMatch;
        });

        displayTrainings(filteredTrainings, trainingsContainer);
    }

    function displayTrainings(trainings, container) {
        container.innerHTML = '';

        const langMap = {
            'english': 'en-US',
            'thai': 'th-TH',
            'russian': 'ru-RU'
        };

        const langKey = localStorage.clientLang || 'english';
        const lang = langMap[langKey] || 'en-US';

        const trainingsByWeekday = {};

        trainings.forEach(training => {
            const trainingDate = new Date(training.date);
            const dayOfWeek = trainingDate.toLocaleDateString(lang, { weekday: 'long' });

            const trainingTime = trainingDate.toLocaleTimeString(lang, {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false,
                timeZone: 'UTC'
            });

            const formattedDate = `${dayOfWeek} ${String(trainingDate.getDate()).padStart(2, '0')}.${String(trainingDate.getMonth() + 1).padStart(2, '0')}.${trainingDate.getFullYear()} ${trainingTime}`;

            if (!trainingsByWeekday[formattedDate]) {
                trainingsByWeekday[formattedDate] = [];
            }

            trainingsByWeekday[formattedDate].push(training);
        });

        Object.keys(trainingsByWeekday).forEach(formattedDate => {
            const trainingsOnDay = trainingsByWeekday[formattedDate];

            const weekdayDiv = document.createElement('div');
            weekdayDiv.className = 'trainingsTable_weekday';
            weekdayDiv.innerHTML = `<span>${formattedDate}</span>`;
            container.appendChild(weekdayDiv);

            trainingsOnDay.forEach(training => {
                const trainingDiv = document.createElement('a');
                trainingDiv.className = 'trainingsTable_training';
                trainingDiv.href = `/en/trainings/${training._id}`;

                trainingDiv.innerHTML = `
                    <div class="cell training_club">
                        <div class="clubLogo" style="background-image: url(${training.club.logo}); background-position: 50% center; background-size: cover; background-repeat: no-repeat;"></div>
                        <span>${training.club.name}</span>
                    </div>
                    <div class="cell training_trainer">
                        <div class="trainerLogo" style="background-image: url(${training.trainer.logo || '/icons/playerslogo/default_avatar.svg'}); background-position: 50% center; background-size: cover; background-repeat: no-repeat;"></div>
                        <span>${training.trainer.name}</span>
                    </div>
                    <div class="cell training_rating">${training.trainer.rating}</div>
                    <div class="cell training_price">${training.price}฿</div>
                `;
                container.appendChild(trainingDiv);
            });
        });
    }
}






// export async function getAllTrainings() {
//     const dateFromInput = document.getElementById('dateFromInput');
//     const dateUntilInput = document.getElementById('dateUntilInput');
//     const clubInput = document.getElementById('clubInput');
//     const cityInput = document.getElementById('cityInput');
//     const trainerNameInput = document.getElementById('trainerNameInput');

//     const clubDropdown = document.getElementById('clubDropdown');
//     const cityDropdown = document.getElementById('cityDropdown');
//     const trainerNameDropdown = document.getElementById('trainerNameDropdown');
//     const searchButton = document.getElementById('filterTrainings_btnSearch');

//     const trainingsContainer = document.querySelector('.trainingsTable_content');

//     if (!trainingsContainer) {
//         console.error('Контейнеры для тренировок не найдены');
//         return;
//     }

//     const languageMap = {
//         'russian': 'ru',
//         'english': 'en',
//         'thai': 'th'
//     };

//     const currentLang = localStorage.getItem('clientLang') || 'english';
//     const langKey = languageMap[currentLang];

//     let allTrainings = [];
//     let cities = [];
//     let trainers = [];
//     let checkCities = {};

//     await fetchAllTrainings();

//     async function fetchAllTrainings() {
//         try {
//             const response = await fetch(`/get-trainings`);
//             const trainings = await response.json();
//             allTrainings = trainings;
//             let lang = localStorage.getItem('clientLang');
            

//             // Display first 5 trainings initially
//             displayTrainings(trainings.slice(0, 5), trainingsContainer);

//             const clubs = [...new Set(trainings.map(training => training.club.name))];
//             clubs.sort();

//             trainers = [...new Set(trainings.map(training => training.trainer.name))];
//             trainers.sort();

//             const cityIds = [...new Set(trainings.map(training => training.city._id))];
//             const cityNamesPromises = cityIds.map(cityId => getCityNameById(cityId));
//             cities = await Promise.all(cityNamesPromises);

//             console.log(allTrainings);

//             allTrainings.forEach(training => {
//                 console.log(training);
//                 const cityName = training[lang] || 'Unknown City'; // Если имя города на данном языке не найдено, использовать 'Unknown City'
//                 // checkCities[training._id] = cityName;
//             });
            
//             console.log(checkCities);

//             createDropdown(cityDropdown, cities.filter(city => city !== 'Unknown City'), cityInput);
//             createDropdown(clubDropdown, clubs, clubInput);
//             createDropdown(trainerNameDropdown, trainers, trainerNameInput);
//         } catch (error) {
//             console.error('Произошла ошибка:', error);
//             showErrorModal('Database connection error', 'Ops!');
//         }
//     }

//     async function getCityNameById(cityId) {
//         try {
//             const response = await fetch(`/cities/${cityId}`);
//             if (!response.ok) {
//                 throw new Error('City data not found');
//             }
//             const city = await response.json();
//             return city[currentLang] || 'Unknown City'; // Возвращает имя города на выбранном языке или "Unknown City"
//         } catch (error) {
//             console.error('Ошибка при получении названия города:', error);
//             return 'Unknown City'; // Возвращение запасного значения в случае ошибки
//         }
//     }

//     let debounceTimeout;

//     dateFromInput.addEventListener('input', () => formatInputDate(dateFromInput));
//     dateUntilInput.addEventListener('input', () => formatInputDate(dateUntilInput));
//     clubInput.addEventListener('input', () => debounceFilterTrainings(updateClubDropdown));
//     cityInput.addEventListener('input', () => debounceFilterTrainings(updateCityDropdown));
//     trainerNameInput.addEventListener('input', () => debounceFilterTrainings(updateTrainerNameDropdown));

//     dateFromInput.addEventListener('blur', validateDates);
//     dateUntilInput.addEventListener('blur', validateDates);

//     clubInput.addEventListener('focus', () => clubDropdown.style.display = 'block');
//     cityInput.addEventListener('focus', () => cityDropdown.style.display = 'block');
//     trainerNameInput.addEventListener('focus', () => trainerNameDropdown.style.display = 'block');

//     clubInput.addEventListener('blur', () => setTimeout(() => clubDropdown.style.display = 'none', 200));
//     cityInput.addEventListener('blur', () => setTimeout(() => cityDropdown.style.display = 'none', 200));
//     trainerNameInput.addEventListener('blur', () => setTimeout(() => trainerNameDropdown.style.display = 'none', 200));

//     searchButton.addEventListener('click', function(event) {
//         event.preventDefault();
//         filterTrainings();
//     });

//     function debounceFilterTrainings(updateDropdown) {
//         clearTimeout(debounceTimeout);
//         debounceTimeout = setTimeout(() => {
//             updateDropdown();
//             filterTrainings();
//         }, 300);
//     }

//     function updateClubDropdown() {
//         updateDropdownList(clubDropdown, [...new Set(allTrainings.map(training => training.club.name))], clubInput);
//     }

//     function updateCityDropdown() {
//         updateDropdownList(cityDropdown, cities, cityInput);
//     }

//     function updateTrainerNameDropdown() {
//         updateDropdownList(trainerNameDropdown, trainers, trainerNameInput);
//     }

//     function createDropdown(dropdown, options, inputElement) {
//         dropdown.innerHTML = '';
//         options.forEach(option => {
//             if (option) {
//                 const div = document.createElement('div');
//                 div.textContent = option;
//                 div.addEventListener('click', () => {
//                     inputElement.value = option;
//                     dropdown.style.display = 'none';
//                     filterTrainings();
//                 });
//                 dropdown.appendChild(div);
//             }
//         });
//     }

//     function updateDropdownList(dropdown, options, inputElement) {
//         dropdown.innerHTML = '';
//         const currentText = inputElement.value.toLowerCase();
//         const filteredOptions = options.filter(option => option.toLowerCase().includes(currentText));

//         filteredOptions.forEach(option => {
//             const div = document.createElement('div');
//             div.textContent = option;
//             div.addEventListener('click', () => {
//                 inputElement.value = option;
//                 dropdown.style.display = 'none';
//                 filterTrainings();
//             });
//             dropdown.appendChild(div);
//         });

//         dropdown.style.display = 'block';
//     }

//     function validateDates() {
//         const dateFromValue = new Date(dateFromInput.value.split('.').reverse().join('-'));
//         const dateUntilValue = new Date(dateUntilInput.value.split('.').reverse().join('-'));

//         if (dateFromValue && dateUntilValue && dateFromValue > dateUntilValue) {
//             showErrorModal('Date Until must be later than Date From', 'Ops!');
//         }
//     }

//     function formatInputDate(inputElement) {
//         const inputValue = inputElement.value.replace(/\D/g, ''); // Удаляем все нецифровые символы
//         let formattedValue = '';
    
//         // Добавляем первые два символа, если они есть
//         if (inputValue.length > 0) {
//             formattedValue += inputValue.substring(0, 2);
//         }
    
//         // Добавляем точку после первых двух символов, если есть следующие два символа
//         if (inputValue.length > 2) {
//             formattedValue += '.' + inputValue.substring(2, 4);
//         }
    
//         // Добавляем точку и оставшиеся символы, если они есть
//         if (inputValue.length > 4) {
//             formattedValue += '.' + inputValue.substring(4, inputValue.length);
//         }
    
//         // Устанавливаем отформатированное значение обратно в поле ввода
//         inputElement.value = formattedValue;
//     }

//     // Обновленная функция filterTrainings
//     async function filterTrainings() {
//         const dateFromValue = dateFromInput.value;
//         const dateUntilValue = dateUntilInput.value;
//         const clubValue = clubInput.value.toLowerCase();
//         const cityValue = cityInput.value; // cityInput.value уже приведен к нижнему регистру при фильтрации
//         const trainerValue = trainerNameInput.value.toLowerCase();
    
//         console.log('Filters:', dateFromValue, dateUntilValue, clubValue, cityValue, trainerValue);
    
//         const filteredTrainings = allTrainings.filter(training => {
//             const dateFromMatch = !dateFromValue || new Date(training.date) >= new Date(dateFromValue.split('.').reverse().join('-'));
//             const dateUntilMatch = !dateUntilValue || new Date(training.date) <= new Date(dateUntilValue.split('.').reverse().join('-'));
//             const clubMatch = !clubValue || training.club.name.toLowerCase().includes(clubValue);
//             const cityMatch = !cityValue || cityValue === 'all' || training.city._id === cityValue; // Сравниваем _id города
//             const trainerMatch = !trainerValue || (training.trainer && training.trainer.name.toLowerCase().includes(trainerValue));
    
//             return dateFromMatch && dateUntilMatch && clubMatch && cityMatch && trainerMatch;
//         });
    
//         console.log('Filtered Trainings:', filteredTrainings);
    
//         displayTrainings(filteredTrainings, trainingsContainer);
//     }

//     // Обновленная функция displayTrainings
//     function displayTrainings(trainings, container) {
//         container.innerHTML = '';

//         const langMap = {
//             'english': 'en-US',
//             'thai': 'th-TH',
//             'russian': 'ru-RU'
//         };

//         const langKey = localStorage.clientLang || 'english';
//         const lang = langMap[langKey] || 'en-US';

//         // Создаем объект для группировки тренировок по дням недели
//         const trainingsByWeekday = {};

//         trainings.forEach(training => {
//             const trainingDate = new Date(training.date);
//             const dayOfWeek = trainingDate.toLocaleDateString(lang, { weekday: 'long' });

//             // Форматируем время из UTC в локальное время с учетом языка
//             const trainingTime = trainingDate.toLocaleTimeString(lang, {
//                 hour: '2-digit',
//                 minute: '2-digit',
//                 hour12: false, // Используем 24-часовой формат времени
//                 timeZone: 'UTC' // Указываем, что время в UTC
//             });

//             const formattedDate = `${dayOfWeek} ${String(trainingDate.getDate()).padStart(2, '0')}.${String(trainingDate.getMonth() + 1).padStart(2, '0')}.${trainingDate.getFullYear()} ${trainingTime}`;

//             if (!trainingsByWeekday[formattedDate]) {
//                 trainingsByWeekday[formattedDate] = [];
//             }

//             trainingsByWeekday[formattedDate].push(training);
//         });

//         // Отображаем тренировки с группировкой по дням недели
//         Object.keys(trainingsByWeekday).forEach(formattedDate => {
//             const trainingsOnDay = trainingsByWeekday[formattedDate];

//             // Создаем элемент для дня недели
//             const weekdayDiv = document.createElement('div');
//             weekdayDiv.className = 'trainingsTable_weekday';
//             weekdayDiv.innerHTML = `<span>${formattedDate}</span>`;
//             container.appendChild(weekdayDiv);

//             // Отображаем тренировки в этот день
//             trainingsOnDay.forEach(training => {
//                 const trainingDiv = document.createElement('div');
//                 trainingDiv.className = 'trainingsTable_training';
//                 trainingDiv.setAttribute('data-city-id', training.city._id);
    
//                 trainingDiv.innerHTML = `
//                     <div class="cell training_club">
//                         <div class="clubLogo" style="background-image: url(${training.club.logo}); background-position: 50% center; background-size: cover; background-repeat: no-repeat;"></div>
//                         <span>${training.club.name}</span>
//                     </div>
//                     <div class="cell training_trainer">
//                         <div class="trainerLogo" style="background-image: url(${training.trainer.logo || '/icons/playerslogo/default_avatar.svg'}); background-position: 50% center; background-size: cover; background-repeat: no-repeat;"></div>
//                         <span>${training.trainer.name}</span>
//                     </div>
//                     <div class="cell training_rating">${training.trainer.rating}</div>
//                     <div class="cell training_price">${training.price}฿</div>
//                 `;
//                 container.appendChild(trainingDiv);
//             });
//         });
//     }
// }


