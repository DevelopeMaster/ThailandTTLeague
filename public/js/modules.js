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
                const advBlock = document.createElement('a');
                advBlock.href = item.link;
                const advImg = document.createElement('img');
                advImg.alt = 'adv';
                advImg.src = item.image;
                advBlock.appendChild(advImg);
                advContent.appendChild(advBlock);
            });
        })
        .catch(error => {
            console.error('Произошла ошибка:', error);
            showErrorModal('Database connection error');
        });
};

export function createHeader(language) {
    const headerTag = document.querySelector('.header');
    // console.log(language);
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
                                <input class="header_top_left_input" type="text" placeholder="Search for a player">
                                <button type="submit" class="header_top_left_search">
                                    <img src="/icons/search.svg" alt="search icon">
                                </button>
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
                    <a class="header_bottom_category">
                        <img class="header_bottom_category-icon" src="/icons/train.svg" alt="">
                        <p class="header_bottom_category-text">
                            Training
                        </p>
                    </a>
                    <a class="header_bottom_category">
                        <img class="header_bottom_category-icon" src="/icons/about.svg" alt="">
                        <p class="header_bottom_category-text goToAboutUs">
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
                <input class="header_top_left_input" type="text" placeholder="Search for a player">
                <button class="header_top_left_search">
                    <img src="/icons/search.svg" alt="search icon">
                </button>
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

            <a class="header_bottom_category logedIn">
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
            <a class="header_bottom_category">
                <img class="header_bottom_category-icon" src="/icons/train.svg" alt="">
                <p class="header_bottom_category-text">
                    Training
                </p>
            </a>
            <a class="header_bottom_category">
                <img class="header_bottom_category-icon" src="/icons/about.svg" alt="">
                <p class="header_bottom_category-text goToAboutUs">
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
                                <input class="header_top_left_input" type="text" placeholder="Поиск игрока">
                                <button type="submit" class="header_top_left_search">
                                    <img src="/icons/search.svg" alt="search icon">
                                </button>
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
                    <a class="header_bottom_category">
                        <img class="header_bottom_category-icon" src="/icons/train.svg" alt="">
                        <p class="header_bottom_category-text">
                        Тренировки
                        </p>
                    </a>
                    <a class="header_bottom_category goToAboutUs">
                        <img class="header_bottom_category-icon" src="/icons/about.svg" alt="">
                        <p class="header_bottom_category-text goToAboutUs">
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
                <input class="header_top_left_input" type="text" placeholder="Search for a player">
                <button class="header_top_left_search">
                    <img src="/icons/search.svg" alt="search icon">
                </button>
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

            <a class="header_bottom_category logedIn">
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
            <a class="header_bottom_category">
                <img class="header_bottom_category-icon" src="/icons/train.svg" alt="">
                <p class="header_bottom_category-text">
                    Тренировки
                </p>
            </a>
            <a class="header_bottom_category">
                <img class="header_bottom_category-icon" src="/icons/about.svg" alt="">
                <p class="header_bottom_category-text goToAboutUs">
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
                                <input class="header_top_left_input" type="text" placeholder="ค้นหาผู้เล่น">
                                <button type="submit" class="header_top_left_search">
                                    <img src="/icons/search.svg" alt="search icon">
                                </button>
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
                    <a class="header_bottom_category">
                        <img class="header_bottom_category-icon" src="/icons/train.svg" alt="">
                        <p class="header_bottom_category-text">
                            เทรนกับโค้ช
                        </p>
                    </a>
                    <a class="header_bottom_category">
                        <img class="header_bottom_category-icon" src="/icons/about.svg" alt="">
                        <p class="header_bottom_category-text goToAboutUs">
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
                <input class="header_top_left_input" type="text" placeholder="Search for a player">
                <button class="header_top_left_search">
                    <img src="/icons/search.svg" alt="search icon">
                </button>
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

            <a class="header_bottom_category logedIn">
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
            <a class="header_bottom_category">
                <img class="header_bottom_category-icon" src="/icons/train.svg" alt="">
                <p class="header_bottom_category-text">
                    เทรนกับโค้ช
                </p>
            </a>
            <a class="header_bottom_category">
                <img class="header_bottom_category-icon" src="/icons/about.svg" alt="">
                <p class="header_bottom_category-text goToAboutUs">
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
    
};

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
                        <a href="#">Training</a>
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
                        <a href="#">Тренировки</a>
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
                        <a href="#">เทรนกับโค้ช</a>
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

export function fetchPastTournaments() {
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

            let langMap = {'english': 'en-US', 'thai': 'th-TH', 'russian': 'ru-RU'};
            let lang = langMap[localStorage.clientLang] || 'en-US';
            let span = document.createElement('span');
            let tournamentDate = new Date(tournament.datetime);
            let dayOfWeek = tournamentDate.toLocaleDateString(lang, { weekday: 'long' });
            let formattedDate = `${dayOfWeek} ${String(tournamentDate.getDate()).padStart(2, '0')}.${String(tournamentDate.getMonth() + 1).padStart(2, '0')}.${tournamentDate.getFullYear()}`;
            span.textContent = formattedDate;

            dateDiv.appendChild(img);
            dateDiv.appendChild(span);

            let pastClubDiv = document.createElement('div');
            pastClubDiv.className = 'last_tournaments_tournament_clubDate_club';

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

            tournament.players.sort((a, b) => a.place - b.place).forEach(player => {
                let winnerLink = document.createElement('a');
                winnerLink.href = `/${player.id}`;  // ------------------------------------------------------------------ссылка на лк
                winnerLink.className = `last_tournaments_tournament_winners_${player.place}`;
                let winnerImg = document.createElement('img');
                winnerImg.src = `/icons/${player.place}st-medal.svg`;
                winnerImg.alt = `${player.place} place`;
                let winnerSpan = document.createElement('span');
                winnerSpan.textContent = player.fullname;
                winnerLink.appendChild(winnerImg);
                winnerLink.appendChild(winnerSpan);
                winnersDiv.appendChild(winnerLink);
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

            const languageMap = {
                'russian': 'ru',
                'english': 'en',
                'thai': 'th'
            };
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


export function fetchFutureTournaments() {
    fetch('/get-future-tournaments')
        .then(response => response.json())
        .then(data => {
            let futureTournaments = data.filter(tournament => new Date(tournament.datetime) > new Date());
            futureTournaments.sort((a, b) => new Date(a.datetime) - new Date(b.datetime));
            futureTournaments = futureTournaments.slice(0, 10);
            // рендер будущих турниров
            let currentDay = '';
            futureTournaments.forEach(tournament => {

            // Расчет среднего рейтинга
            let totalRating = 0;
            tournament.players.forEach(player => {
                totalRating += player.rating;
            });
            let averageRating = Math.round(totalRating / tournament.players.length);
            tournament.rating = averageRating;

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
                // weekdayDiv.textContent = currentDay;
                document.querySelector('.upcommingTable_content').appendChild(weekdayDiv);
            }

            const languageMap = {
                'russian': 'ru',
                'english': 'en',
                'thai': 'th'
            };
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
            playersSpan.textContent = tournament.players.length - 1;
            playersDiv.appendChild(playersSpan);
            tournamentDiv.appendChild(playersDiv);
            
            document.querySelector('.upcommingTable_content').appendChild(tournamentDiv);
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
    })
    .catch(error => console.error('Error:', error));
};


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

        const currentLang = localStorage.getItem('clientLang') || 'english';
        
        let coachesList = coaches.slice(0, 6);
        for (const coach of coachesList) {
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
            clubTitleSpan.textContent = clubTitle[currentLang] || 'Club:';

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

    await fetchAllCoaches();

    async function fetchAllCoaches() {
        try {
            const response = await fetch(`/coaches`);
            const coaches = await response.json();
            allCoaches = coaches;

            // Display first 12 coaches initially
            displayCoaches(coaches.slice(0, 12));
            viewAllButton.style.display = 'block';

            const names = [...new Set(coaches.flatMap(coach => coach.name))];
            const clubs = [...new Set(coaches.map(coach => coach.club))];
            const cityIds = [...new Set(coaches.map(coach => coach.city))]; // Now storing city _id

            names.sort();
            clubs.sort();

            // Retrieve city names from MongoDB collection 'cities'
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
        updateDropdownList(nameDropdown, [...new Set(allCoaches.flatMap(coach => coach.name))], nameInput);
    }

    function updateClubDropdown() {
        updateDropdownList(clubDropdown, [...new Set(allCoaches.map(coach => coach.club))], clubInput);
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
            const clubMatch = !clubValue || coach.club.toLowerCase().includes(clubValue);

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
            const coachDiv = document.createElement('div');
            coachDiv.className = 'coaches_content_coach';

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
            nameH4.textContent = coach.name;

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
            clubNameP.textContent = coach.club;

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
            filterCoaches(); // Выполнить фильтрацию при загрузке данных
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
            this.nextElementSibling.classList.toggle('openLangsMenu');
            this.querySelector('.arrowLangs').style.transform = 'rotateX(180deg)';
            statusLangsMenu = true;
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
            dropdown.previousElementSibling.querySelector('.arrowLangs').style.transform = 'rotateX(360deg)';
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

export async function fetchCities(curLang) {
    try {
        const response = await fetch(`/cities?language=${curLang}`);
        const cities = await response.json();
        citiesList = cities.sort();
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

    content.innerHTML = `<button class="modal_close" onclick="closeModal()">
                            <img src="/icons/x-circle.svg" alt="кнопка закрыть">
                        </button>
                        <h2>${translation.title}</h2>
                        <form action="/login" method="POST" enctype="application/x-www-form-urlencoded">
                            <label for="username">${translation.emailLabel}</label>
                            <input type="text" name="username" autocomplete="username" placeholder="${translation.emailPlaceholder}" id="email" required>
                            <label for="password">${translation.passwordLabel}</label>
                            <input type="password" placeholder="${translation.passwordPlaceholder}" id="password" name="password" autocomplete="new-password" required>
                            <button class='btnFogot' type="button">${translation.forgotPassword}</button>
                            <button id="logIn" class='header_btn-sign btnSbmt header_btn-login' type="submit">${translation.submitButton}</button>
                        </form>`;
    document.body.style = 'overflow: hidden;';
    modal.style.display = "block";
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
                        <form action="/forgot-password" method="POST" enctype="application/x-www-form-urlencoded">
                            <p>${translation.description}</p>
                            <label for="login">${translation.label}</label>
                            <input type="text" placeholder="${translation.placeholder}" id="email" name="email" required>
                            <button id="restor" class='header_btn-sign btnSbmt' type="submit">${translation.button}</button>
                        </form>`;
    document.body.style = 'overflow: hidden;';
    modal.style.display = "block";
}

export function registrationForm() {
    // const modal = document.getElementById("myModal");
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
                            <input type="text" placeholder="${translation.playerNamePlaceholder}" id="fullname" name="fullname" required><br>
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
                            <button id="signIn" class='header_btn-sign btnSbmt' type="submit">${translation.submitButton}</button>
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

    // submitButton.addEventListener('click', validateForm);
    function formErrorMessage(text, block) {
        block.textContent = text;
        block.style.display = 'block';
        submitButton.disabled = true;
    }
    function formClearMessage(block) {
        block.textContent = '';
        block.style.display = 'none';
        submitButton.disabled = false;
    }

    function validatePasswordMatch() {
        if (password.value && confirm_password.value) {
            if (password.value !== confirm_password.value) {
                formErrorMessage(translation.passwordMatchError, passwordError);
                password.classList.add('error');
                confirm_password.classList.add('error');
            } else {
                formClearMessage(passwordError);
                password.classList.remove('error');
                confirm_password.classList.remove('error');
            }
        }
    }

    function validatePasswordStrength() {
        const passwordRegex = /^(?=.*\d)(?=.*[a-zа-яё\u0E01-\u0E5B])(?=.*[A-ZА-ЯЁ]).{8,}$/;
                                
    
        if (password.value.length < 8) {
            formErrorMessage(translation.passwordLengthError, passwordError);
            password.classList.add('error');
            confirm_password.classList.add('error');
        } else if (!passwordRegex.test(password.value)) {
            formErrorMessage(translation.passwordStrengthError, passwordError);
            password.classList.add('error');
            confirm_password.classList.add('error');
        } else {
            formClearMessage(passwordError);
            password.classList.remove('error');
            confirm_password.classList.remove('error');
        }
    }
    
    password.addEventListener('blur', validatePasswordStrength);
    confirm_password.addEventListener('blur', validatePasswordMatch);

    // check unique email and login
    const emailRegInput = document.querySelector('#emailRegInput');
    // const loginRegInput = document.querySelector('#loginRegInput');
    const emailError = document.querySelector('#emailError');
    const loginError = document.querySelector('#loginError');

    emailRegInput.addEventListener('input', function() {
        fetch(`/check-email?email=${this.value}`)
        .then(response => response.json())
        .then(data => {
            if (!data.unique) {
                formErrorMessage(translation.emailRegisteredError, emailError);
            } else {
                formClearMessage(emailError);
            }
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
        'ru': 'Russian',
        'en': 'English',
        'th': 'Thai'
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
            'allplayers': 'Players'
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
            'allplayers': 'Игроки'
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
            'allplayers': 'ผู้เล่น'
        }
    };

    const currentLang = Object.keys(languageMap).find(lang => pathArray.includes(lang)) || 'en';
    const filteredPathArray = pathArray.filter(part => !Object.keys(languageMap).includes(part));

    let breadcrumbHTML = `<li class="navigate_breadcrumb_item"><a href="/${currentLang}">${translations[currentLang]['home']}</a></li>`;

    filteredPathArray.forEach((path, index) => {
        const isLast = index === filteredPathArray.length - 1;
        const containsNumbers = /\d/.test(path); // Check if the path contains numbers
        const urlPath = '/' + [currentLang, ...filteredPathArray.slice(0, index + 1)].join('/');

        let translatedPath;

        if (containsNumbers && filteredPathArray[index - 1] === 'allclubs') {
            translatedPath = translations[currentLang]['club'];
        } else if (containsNumbers && filteredPathArray[index - 1] === 'players') {
            translatedPath = translations[currentLang]['player'];
        } else if (containsNumbers && filteredPathArray[index - 1] === 'tournaments') {
            translatedPath = translations[currentLang]['tournament'];
        } else {
            translatedPath = translations[currentLang][path] || capitalize(path);
        }

        if (isLast) {
            breadcrumbHTML += `<li class="navigate_breadcrumb_item navigate_breadcrumb_item_active" aria-current="page">${translatedPath}</li>`;
        } else {
            breadcrumbHTML += `<li class="navigate_breadcrumb_item"><a href="${urlPath}">${translatedPath}</a></li>`;
        }
    });

    breadcrumbContainer.innerHTML = breadcrumbHTML;
}

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

export function listenerOfButtons() {
    const languageMap = {
        'russian': 'ru',
        'english': 'en',
        'thai': 'th'
    };
    document.addEventListener('click', function(event) {
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

        // if (event.target.classList.contains('header_bottom_mob_cross')) {
        //     console.log('cross');
        //     document.getElementById('headerMob').style.display = 'none';
        // }

        if (event.target.id === 'becomeCoach') {
            window.location.href = `/${languageMap[localStorage.clientLang]}/becomeacoach`;
        }

        if (event.target.id === 'btnAddClub') {
            window.location.href = `/${languageMap[localStorage.clientLang]}/addclub`;
        }

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
            document.querySelector('.header_bottom_mob').classList.toggle('header_bottom_mob_openMenu');
        }
        

        if (event.target.closest('.header_bottom_mob_cross')) {
            document.querySelector('.header_bottom_mob').classList.toggle('header_bottom_mob_openMenu');
        }
        
        // if (event.target.classList.contains('header_bottom_mob_cross')) {
        //     event.preventDefault();
        //     document.querySelector('.header_bottom_mob').classList.toggle('header_bottom_mob_openMenu');
        // }
    });

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


export async function getAllTournaments() {
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

    await fetchAllTournaments();
    await fetchCities();

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
            cities = data.sort();
            
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
            const cityMatch = !cityValue || cityValue === 'all' || cities.includes(tournament.city._id) && cities[tournament.city._id].toLowerCase().includes(cityValue);

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

            const renderTournament = async (tournament, container, className) => {
                let tournamentDate = new Date(tournament.datetime);
                let langMap = { 'english': 'en-US', 'thai': 'th-TH', 'russian': 'ru-RU' };

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
                tournamentDiv.href = `/${languageMap[currentLang]}/tournaments/${tournament._id}`;

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
                playersSpan.textContent = tournament.players.length - 1;
                playersDiv.appendChild(playersSpan);
                tournamentDiv.appendChild(playersDiv);

                container.appendChild(tournamentDiv);
            };

            // Функция для отображения турниров по частям
            const displayTournamentsInParts = async (tournaments, container, className, start, end) => {
                container.dataset.currentDay = '';
                for (let i = start; i < end; i++) {
                    if (i >= tournaments.length) break;
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




export async function getAllPlayers() {
    const ratingFromInput = document.getElementById('dateFromInput');
    const ratingUntilInput = document.getElementById('dateUntilInput');
    const nameInput = document.getElementById('clubInput');
    const cityInput = document.getElementById('cityInput');

    const nameDropdown = document.getElementById('clubDropdown');
    const cityDropdown = document.getElementById('cityDropdown');
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
        cityDropdown.style.display = 'none'; // Скрыть дропдаун городов при фокусе на поле имени
    });

    cityInput.addEventListener('focus', () => {
        cityDropdown.style.display = 'block';
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
            nameDropdown.style.display = 'none';
            cityDropdown.style.display = 'none';

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

        dropdown.style.display = filteredOptions.length > 0 ? 'block' : 'none'; // Отображаем дропдаун только если есть совпадения
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
        try {
            container.innerHTML = '';
    
            const cityNamesPromises = players.map(player => getCityName(player.city));
            const cityNames = await Promise.all(cityNamesPromises);
    
            players.forEach((player, index) => {
                let playerDiv = document.createElement('a');
                playerDiv.className = 'playersTable_player';
                playerDiv.href = `/en/players/${player._id}`;
    
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
















