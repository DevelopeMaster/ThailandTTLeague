import { fetchAdvertisements, fetchCities, fetchPastTournaments, fetchFutureTournaments, fetchClub, fetchCoaches } from './modules.js';

let language;
let citiesList = [];
let handChecked = false;

export function updateCitiesList(newCities) {
    citiesList = newCities.sort();
}

function checkLanguage() {
    language = localStorage.getItem('clientLang') || 'english';
}

checkLanguage();

fetchCities(language);

function validateForm() {
    const city = document.getElementById('city').innerText;

    if (city === 'Not chosen' || city === 'Не выбрано' || city === 'ไม่ได้ถูกเลือก') {
        const cityParentElement = document.getElementById('dropdown-content').parentNode;
        cityParentElement.classList.add('error');
        return false;
    }

    return true;
}


document.addEventListener('DOMContentLoaded', function() {
    // Language control

    let statusLangsMenu = false;
    let baseUrl = window.location.origin;
    let newPath = baseUrl;

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

            localStorage.setItem('clientLang', selectedLang);
            let dropdown = this.parentElement;

            dropdown.previousElementSibling.querySelector('.languageText').innerText = shortLang;
            dropdown.style.display = 'none';
            dropdown.previousElementSibling.querySelector('.arrowLangs').style.transform = 'rotateX(360deg)';
            statusLangsMenu = false;

            newPath += '/' + shortLang;
            window.location.href = newPath;
        });
    });


    document.querySelector('#burger').addEventListener('click', () => {
        document.querySelector('.header_bottom_mob').classList.toggle('header_bottom_mob_openMenu');
    })
    
    document.querySelector('.header_bottom_mob_cross').addEventListener('click', () => {
        document.querySelector('.header_bottom_mob').classList.toggle('header_bottom_mob_openMenu');
    })

    fetchPastTournaments();
   
    fetchFutureTournaments();

    fetchClub();
    
    fetchCoaches();

    fetchAdvertisements();

    // Modal window
    const modal = document.getElementById("myModal");
    const content = modal.querySelector('.modal-content')

    window.closeModal = function() {
        const modal = document.getElementById("myModal");
        modal.style.display = "none";
        document.body.style = 'overflow: auto;';
        content.innerHTML = ``;
    }

    

    // modal restore access
    window.btnFogot = function() {
        const translations = {
            english: {
                title: "RESTORE Access",
                description: "If you have forgotten your password, enter your username or email and we will send you a link to reset your password.",
                label: "E-mail or login*",
                placeholder: "Enter your email or login",
                button: "Restore"
            },
            thai: {
                title: "คืนค่าการเข้าถึง",
                description: "หากคุณลืมรหัสผ่าน ให้กรอกชื่อผู้ใช้หรืออีเมลของคุณ แล้วเราจะส่งลิงก์เพื่อรีเซ็ตรหัสผ่านไปให้คุณ.",
                label: "อีเมล์หรือเข้าสู่ระบบ*",
                placeholder: "กรอกอีเมลหรือข้อมูลเข้าสู่ระบบของคุณ",
                button: "คืนค่า"
            },
            russian: {
                title: "Восстановление доступа",
                description: "Если вы забыли свой пароль, введите свой логин или e-mail и мы отправим вам ссылку для восстановления пароля.",
                label: "E-mail или логин*",
                placeholder: "Введите email или логин",
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
                            <form action="/forgot-password" onsubmit="return validateForm()" method="POST" enctype="application/x-www-form-urlencoded">
                                <p>${translation.description}</p>
                                <label for="login">${translation.label}</label>
                                <input type="text" placeholder="${translation.placeholder}" id="email" name="email" required>
                                <button id="restor" class='header_btn-sign btnSbmt' type="submit">${translation.button}</button>
                            </form>`;
        document.body.style = 'overflow: hidden;';
        modal.style.display = "block";
    }

    // modal registeration
    document.addEventListener('click', function(event) {
        if (event.target.classList.contains('btnRegister')) {
            const translations = {
                english: {
                    title: "Registration on the WEBsite",
                    emailLabel: "Email*",
                    emailPlaceholder: "Enter email",
                    loginLabel: "Login*",
                    loginPlaceholder: "Enter login",
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
                    loginLabel: "เข้าสู่ระบบ*",
                    loginPlaceholder: "กดเข้าสู่ระบบ",
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
                    loginLabel: "Логин*",
                    loginPlaceholder: "Введите логин",
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
                                    <label for="login">${translation.loginLabel}</label>
                                    <input type="text" id="loginRegInput" placeholder="${translation.loginPlaceholder}" name="login" autocomplete="username" required>
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
    
            submitButton.addEventListener('click', validateForm);
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
            const loginRegInput = document.querySelector('#loginRegInput');
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
            
            loginRegInput.addEventListener('input', function() {
                fetch(`/check-login?login=${this.value}`)
                .then(response => response.json())
                .then(data => {
                    if (!data.unique) {
                        formErrorMessage(translation.loginRegisteredError, loginError);
                    } else {
                        formClearMessage(loginError);
                    }
                });
            });
    
            document.querySelector('form').addEventListener('submit', function(event) {
                event.preventDefault();
                const data = {
                    email: document.getElementById('emailRegInput').value,
                    login: document.getElementById('loginRegInput').value,
                    password: document.getElementById('password').value,
                    confirm_password: document.getElementById('confirm_password').value,
                    city: document.getElementById('city').value,
                    fullname: document.getElementById('fullname').value,
                    hand: document.querySelector('input[name="hand"]:checked').value,
                    date: document.getElementById('date').value,
                    registeredDate: new Date(),
                    policy: document.getElementById('policy').checked
                };
    
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

        if (event.target.classList.contains('btnLogin')) {
            const translations = {
                english: {
                    title: "Log in",
                    emailLabel: "E-mail or login*",
                    emailPlaceholder: "Enter your email or login",
                    passwordLabel: "Password*",
                    passwordPlaceholder: "Enter password",
                    forgotPassword: "Forgot your password?",
                    submitButton: "Log in"
                },
                thai: {
                    title: "เข้าสู่ระบบ",
                    emailLabel: "อีเมล์หรือเข้าสู่ระบบ*",
                    emailPlaceholder: "กรอกอีเมลหรือข้อมูลเข้าสู่ระบบของคุณ",
                    passwordLabel: "รหัสผ่าน*",
                    passwordPlaceholder: "ใส่รหัสผ่าน",
                    forgotPassword: "คุณลืมรหัสผ่านหรือไม่?",
                    submitButton: "เข้าสู่ระบบ"
                },
                russian: {
                    title: "Вход",
                    emailLabel: "E-mail или логин*",
                    emailPlaceholder: "Введите e-mail или логин",
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
                                <form action="/login" onsubmit="return validateForm()" method="POST" enctype="application/x-www-form-urlencoded">
                                    <label for="username">${translation.emailLabel}</label>
                                    <input type="text" name="username" autocomplete="username" placeholder="${translation.emailPlaceholder}" id="email" required>
                                    <label for="password">${translation.passwordLabel}</label>
                                    <input type="password" placeholder="${translation.passwordPlaceholder}" id="password" name="password" autocomplete="new-password" required>
                                    <button class='btnFogot' type="button">${translation.forgotPassword}</button>
                                    <button id="logIn" class='header_btn-sign btnSbmt header_btn-login' type="submit">${translation.submitButton}</button>
                                </form>`;
            document.body.style = 'overflow: hidden;';
            modal.style.display = "block";
            document.querySelector('.btnFogot').onclick = window.btnFogot;
        }
    });
    
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
            document.body.style = 'overflow: auto;';
            content.innerHTML = ``;
        }
    }

    window.onload = function() {
        if (!localStorage.getItem('clientLang')) {
            localStorage.setItem('clientLang', 'english');
        }
    };

    function showErrorModal(message) {
        const modal = document.getElementById('myModal');
        const modalContent = modal.querySelector('.modal-content');
        modalContent.innerHTML = `
                            <button class="modal_close" onclick="closeModal()">
                                <img src="/icons/x-circle.svg" alt="кнопка закрыть">
                            </button>
                            <h2>Ops!</h2> 
                            <p>${message}</p>
                            `;
        modal.style.display = 'block';
    };

    function redirectToPersonalAccount() {
        window.location.href = '/account';
    }

    const becomeCoach = document.querySelector('#becomeCoach');
    if (becomeCoach) {
        becomeCoach.addEventListener('click', () => {
            window.location.href = `${languageMap[localStorage.clientLang]}/becomeacoach`;
        })
    }

    // ads
    // window.onload = function() {
    //     setTimeout(function() {
    //         const containerElement = document.querySelector('.container');
    //         const tournamentsElement = document.querySelector('.tournaments');
    //         const adsElement = document.querySelector('.ads');
    //         const rightDistance = document.documentElement.clientWidth - containerElement.getBoundingClientRect().right;
    //         const topDistance = tournamentsElement.getBoundingClientRect().top + window.pageYOffset;
    //         adsElement.style.right = rightDistance + 'px';
    //         adsElement.style.top = topDistance + 'px';
    //         adsElement.style.display = 'flex';
    //     }, 2000);
    // };

    // const containerElement = document.querySelector('.container');
    // const tournamentsElement = document.querySelector('.tournaments');
    // const adsElement = document.querySelector('.ads');
    // const rightDistance = document.documentElement.clientWidth - containerElement.getBoundingClientRect().right;
    // const topDistance = tournamentsElement.getBoundingClientRect().top + window.pageYOffset;
    // adsElement.style.right = rightDistance + 'px';
    // adsElement.style.top = topDistance + 'px';
});