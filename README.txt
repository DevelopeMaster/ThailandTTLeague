"browser-sync": "^3.0.2",

const cities = [
  { english: "Bangkok", russian: "Бангкок", thai: "กรุงเทพมหานคร" },
  { english: "Chiang Mai", russian: "Чиангмай", thai: "เชียงใหม่" },
  { english: "Pattaya", russian: "Паттайя", thai: "พัทยา" },
  { english: "Phuket", russian: "Пхукет", thai: "ภูเก็ต" },
  { english: "Nakhon Ratchasima", russian: "Накхонратчасима", thai: "นครราชสีมา" },
  { english: "Udon Thani", russian: "Удонтхани", thai: "อุดรธานี" },
  { english: "Hat Yai", russian: "Хатъяй", thai: "หาดใหญ่" },
  { english: "Surat Thani", russian: "Сураттхани", thai: "สุราษฎร์ธานี" },
  { english: "Nong Khai", russian: "Нонгкхай", thai: "หนองคาย" },
  { english: "Khon Kaen", russian: "Кхонкэн", thai: "ขอนแก่น" },
  { english: "Ubon Ratchathani", russian: "Убонратчатхани", thai: "อุบลราชธานี" },
  { english: "Phitsanulok", russian: "Пхитсанулок", thai: "พิษณุโลก" },
  { english: "Chonburi", russian: "Чонбури", thai: "ชลบุรี" },
  { english: "Ayutthaya", russian: "Аюттхая", thai: "อยุธยา" },
  { english: "Lampang", russian: "Лампанг", thai: "ลำปาง" },
  { english: "Koh Samui", russian: "Остров Самуи", thai: "เกาะสมุย" },
  { english: "Koh Phangan", russian: "Остров Пханган", thai: "เกาะพะงัน" },
  { english: "Satun", russian: "Сатун", thai: "สตูล" },
  
];

// добавление турнира
  // async function addTournaments() {
  //   const tournamentsCollection = db.collection('tournaments');

  //   const tournaments = [
  //     {
  //       date: new Date('2024-04-12'),
  //       datetime: new Date('2024-04-12T11:00:00'),
  //       club: {
  //         name: 'HurricTT',
  //         logo: '/icons/clubslogo/HarricaneTT-logo.png',
  //       },
  //       restrictions: 287,
  //       rating: 304,
  //       players: [
  //         {
  //           id: '665500ed32ca3e3a47517872',
  //           place: 1,
  //           rating: 300
  //         },
  //         {
  //           id: '66564038f448d43a091cb5cd',
  //           place: 2,
  //           rating: 310
  //         },
  //         {
  //           id: '665ca0a6ff770cc63cbb0e95',
  //           place: 3,
  //           rating: 305
  //         },
  //       ], 
  //     },
  //     {
  //       date: new Date('2024-05-24'),
  //       datetime: new Date('2024-05-24T12:00:00'),
  //       club: {
  //         name: 'TT-Wonder',
  //         logo: '/icons/clubslogo/TTL-savel-logo.png',
  //       },
  //       restrictions: 350,
  //       rating: 424,
  //       players: [
  //         {
  //           id: '665500ed32ca3e3a47517872',
  //           place: 1,
  //           rating: 360
  //         },
  //         {
  //           id: '66564038f448d43a091cb5cd',
  //           place: 2,
  //           rating: 370
  //         },
  //         {
  //           id: '665ca0a6ff770cc63cbb0e95',
  //           place: 3,
  //           rating: 365
  //         },
  //       ],
  //     },
  //     {
  //       date: new Date('2024-06-01'),
  //       datetime: new Date('2024-06-01T12:00:00'),
  //       club: {
  //         name: 'ThaiTT',
  //         logo: '/icons/club3.jpg',
  //       },
  //       restrictions: 277,
  //       rating: 344,
  //       players: [
  //         {
  //           id: '665500ed32ca3e3a47517872',
  //           place: 1,
  //           rating: 300
  //         },
  //         {
  //           id: '66564038f448d43a091cb5cd',
  //           place: 2,
  //           rating: 310
  //         },
  //         {
  //           id: '665ca0a6ff770cc63cbb0e95',
  //           place: 3,
  //           rating: 305
  //         },
  //       ],
  //     }
  //   ];

  //   try {
  //     const result = await tournamentsCollection.insertMany(tournaments);
  //     console.log(`Successfully inserted ${result.insertedCount} items!`);
  //   } catch (err) {
  //     console.error(`Failed to insert items: ${err}`);
  //   }
  // }

  

//  отправка email
// let transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: 'your-email@gmail.com',
//     pass: 'your-password' 
//   }
// });

// function sendEmail(userEmail) {
//   let mailOptions = {
//     from: 'your-email@gmail.com',
//     to: userEmail,
//     subject: 'Спасибо за регистрацию!',
//     text: 'Благодарим вас за регистрацию на нашем сайте!'
//   };

//   transporter.sendMail(mailOptions, function(error, info){
//     if (error) {
//       console.log(error);
//     } else {
//       console.log('Email sent: ' + info.response);
//     }
//   });
// }


// Хеширование паролей
  // async function hashPassword(plaintextPassword, additionPath) {
  //   try {
  //       const personalSalt = generateRandomString(10);
  //       const combinedSalt = additionPath + personalSalt + plaintextPassword;
  //       console.log(combinedSalt);
  //       const saltRounds = bcrypt.genSaltSync(10);
  //       const hashedPassword = bcrypt.hashSync( combinedSalt, saltRounds);
  //       console.log(hashedPassword);
  //       return hashedPassword;
  //   } catch (error) {
  //       console.error('Ошибка при хешировании пароля:', error);
  //       throw error;
  //   }
  // }
  // console.log(generateRandomString());
  // hashPassword('12345QweКЕНН', 'AlexO');


// Добавление клубов

// async function addClubs() {

//   try {
//       await client.connect();
//       const clubsCollection = db.collection("clubs");

//       const clubs = [
//           {
//               name: "TT-Savel",
//               city: "Bangkok",
//               logo: "/icons/clubslogo/TT-savel.svg",
//               phoneNumber: "+1234567890"
//           },
//           {
//               name: "HarricaneTT",
//               city: "Bangkok",
//               logo: "/icons/clubslogo/HarricaneTT.svg",
//               phoneNumber: "+0987654321"
//           },
//           {
//               name: "ThaiTT",
//               city: "Bangkok",
//               logo: "/icons/clubslogo/ThaiTT.svg",
//               phoneNumber: "+1122334455"
//           }
//       ];

//       await clubsCollection.insertMany(clubs);
//       console.log("Clubs added successfully");
//   } catch (err) {
//       console.error(err);
//   } 
// }

// добавление тренеров 
// async function addCoaches() {
 
//   try {
//       const coachesCollection = db.collection("coaches");

//       const coaches = [
//           {
//               name: "Petrov Alexander",
//               city: "Phuket",
//               club: "TTL-Savel",
//               logo: "/icons/playerslogo/petrov_aleksandr.svg",
//               phoneNumber: "+1234567890",
//               rating: 754
//           },
//           {
//               name: "Aleksandr Ohar",
//               city: "Bangkok",
//               club: "PHUKET TT CLUB",
//               logo: "/icons/playerslogo/default_avatar.svg",
//               phoneNumber: "+0987654321",
//               rating: 800
//           },
//           {
//               name: "Svetlana Ohar",
//               city: "Bangkok",
//               club: "PHUKET TT CLUB",
//               logo: "/icons/playerslogo/default_avatar.svg",
//               phoneNumber: "+1122334455",
//               rating: 850
//           }
//       ];

//       await coachesCollection.insertMany(coaches);
//       console.log("Coaches added successfully");
//   } catch (err) {
//       console.error(err);
//   }
// }

// добавление рекламы
// async function addAdv() {
//   try {
//       const advCollection = db.collection("adv");

//       const adv = [
//           {
//               customer: "TTL-Savel",
//               link: "#",
//               image: "/icons/ads/TTLeague.svg"
//           },
//           {
//             customer: "HarricaneTT",
//             link: "#",
//             image: "/icons/ads/TTLeague.svg"
//           }
//       ];

//       await advCollection.insertMany(adv);
//       console.log("Adv added successfully");
//   } catch (err) {
//       console.error(err);
//   }
// }



// window.btnFogot = function() {
    //     const modal = document.getElementById("myModal");
    //     modal.style.display = "none";
    //     content.innerHTML = `<button class="modal_close" onclick="closeModal()">
    //                             <img src="/icons/x-circle.svg" alt="кнопка закрыть">
    //                         </button>
    //                         <h2>RESTORE Access</h2>
    //                         <form action="/forgot-password" onsubmit="return validateForm()" method="POST" enctype="application/x-www-form-urlencoded">
    //                             <p>If you have forgotten your password, enter your username or email and we will send you a link to reset your password.</p>
    //                             <label for="login">E-mail or login*</label>
    //                             <input type="text" placeholder="Enter your email or login" id="email" name="email" required>
    //                             <button id="restor" class='header_btn-sign btnSbmt' type="submit">Restore</button>
    //                         </form>`;
    //     document.body.style = 'overflow: hidden;';
    //     modal.style.display = "block";
    // }







//     if (event.target.classList.contains('btnRegister')) {
            
    //         // onsubmit="return validateForm()"
    //         content.innerHTML = `<button class="modal_close" onclick="closeModal()">
    //                                 <img src="/icons/x-circle.svg" alt="кнопка закрыть">
    //                             </button>
    //                             <h2>Registration on the WEBsite</h2> 
    //                             <form action="/register" method="POST"  enctype="application/x-www-form-urlencoded">
    //                                 <label for="email">Email*</label>
    //                                 <input type="email" id="emailRegInput" placeholder="Enter email" id="email" name="email" required>
    //                                 <div id="emailError"  class="error-message"></div>
    //                                 <label for="login">Login*</label>
    //                                 <input type="text" id="loginRegInput" placeholder="Enter login" id="login" name="login" autocomplete="username" required>
    //                                 <div id="loginError" class="error-message"></div>
    //                                 <span>from 3 to 15 characters</span>
    //                                 <label for="password">Password*</label>
    //                                 <input type="password" placeholder="Enter password" id="password" name="password" autocomplete="new-password" required>
    //                                 <input type="password" placeholder="Confirm password" id="confirm_password" name="confirm_password" autocomplete="new-password" required>
    //                                 <div id="passwordError" class="error-message"></div>
    //                                 <label for="city">City*</label>
    //                                 <input type="text" placeholder="Not chosen" id="city" name="city" style="background-image: url('/icons/chevron-down.svg'); background-repeat: no-repeat; background-position: right 8px center; padding-right: 30px;">
    //                                 <div class="dropdownForm">
    //                                     <div class="dropdown-content" id="dropdown-content">
    //                                     <!-- options add from JS -->
    //                                     </div>
    //                                 </div>
    //                                 <label for="fullname">Player name*</label>
    //                                 <input type="text" placeholder="Enter your first and last name" id="fullname" name="fullname" required><br>
    //                                 <label>Playing hand*</label>
    //                                 <div class="hands">
    //                                     <div class="hands_left">
    //                                         <input class="hands_radio" type="radio" id="left" name="hand" value="left" required>
    //                                         <label for="left">Left</label>
    //                                     </div>
    //                                     <div class="hands_right">
    //                                         <input class="hands_radio" type="radio" id="right" name="hand" value="right" required>
    //                                         <label for="right">Right</label>
    //                                     </div>
    //                                 </div>
    //                                 <label for="date">Date of Birth*</label>
    //                                 <input type="text" name="date" id="date" placeholder="DD.MM.YYYY" oninput="addDots(this)" maxlength="10" required>
    //                                 <div class="policy">
    //                                     <input class="checkbox" type="checkbox" id="policy" name="policy" required>
    //                                     <label for="policy"><a href="\policy">Agree to the processing of personal data</a></label>
    //                                 </div>
    //                                 <button id="signIn" class='header_btn-sign btnSbmt' type="submit">Sign in</button>
    //                             </form>`;
            
    //         document.body.style = 'overflow: hidden;';
    //         modal.style.display = "block";

    //         // cities dropdown
    //         const listOfCities = document.getElementById('dropdown-content');
    //         // console.log(citiesList);
    //         citiesList.forEach(city => {
    //             const option = document.createElement('div');
    //             option.value = city;
    //             option.innerText = city;
    //             listOfCities.appendChild(option);
    //         });

    //         const cityInput = document.getElementById('city');

    //         function updateCityList() {
    //             listOfCities.innerHTML = '';
    //             const currentText = cityInput.value.toLowerCase();

    //             const filteredCities = citiesList.filter(city => city.toLowerCase().startsWith(currentText));

    //             filteredCities.forEach(city => {
    //                 const div = document.createElement('div');
    //                 div.textContent = city;
    //                 div.addEventListener('click', function(event) {
    //                     event.stopPropagation();
    //                     cityInput.value = event.target.textContent;
    //                     listOfCities.style.display = 'none';
    //                 });
    //                 listOfCities.appendChild(div);
    //             });
    //             listOfCities.style.display = 'block';
    //         }

    //         // update list cities
    //         cityInput.addEventListener('input', updateCityList);

    //         // show dropdown cities
    //         cityInput.addEventListener('focus', () => {
    //             updateCityList();
    //             listOfCities.style.display = 'block';
    //         });

    //         // hiden dropdown cities
    //         cityInput.addEventListener('blur', () => {
    //             setTimeout(() => { listOfCities.style.display = 'none'; }, 200);
    //         });

    //         //dates
    //         window.addDots = function(input) {
    //             let value = input.value;
    //             let length = value.length;
                
    //             if (isNaN(value.replace(/\./g, ''))) {
    //                 input.value = value.substring(0, length - 1);
    //                 return;
    //             }
    //             if ((length === 2 || length === 5) && !isNaN(value[length - 1])) {
    //                 input.value += '.';
    //             }
    //             if (length === 10) {
    //                 let parts = value.split(".");
    //                 const enteredDate = new Date(parts[2], parts[1] - 1, parts[0]);
    //                 const today = new Date().setHours(0, 0, 0, 0);
    //                 if (enteredDate >= today) {
    //                     alert("Date of birth is not correct");
    //                     input.value = "";
    //                 }
    //             }
    //         }

    //         //passwords
    //         const password = document.getElementById('password');
    //         const confirm_password = document.getElementById('confirm_password');
    //         const passwordError = document.getElementById('passwordError');
    //         const submitButton = document.querySelector('.btnSbmt');

    //         submitButton.addEventListener('click', validateForm);
    //         function formErrorMessage(text, block) {
    //             block.textContent = text;
    //             block.style.display = 'block';
    //             submitButton.disabled = true;
    //         }
    //         function formClearMessage(block) {
    //             block.textContent = '';
    //             block.style.display = 'none';
    //             submitButton.disabled = false;
    //         }

    //         function validatePasswordMatch() {
    //             if (password.value && confirm_password.value) {
    //                 if (password.value !== confirm_password.value) {
    //                     formErrorMessage("Passwords don't match", passwordError);
    //                     password.classList.add('error');
    //                     confirm_password.classList.add('error');
    //                 } else {
    //                     formClearMessage(passwordError);
    //                     password.classList.remove('error');
    //                     confirm_password.classList.remove('error');
    //                 }
    //             }
    //         }
            
    //         function validatePasswordStrength() {
    //             const passwordRegex = /^(?=.*\d)(?=.*[a-zа-яё\u0E01-\u0E5B])(?=.*[A-ZА-ЯЁ]).{8,}$/;
                                        
            
    //             if (password.value.length < 8) {
    //                 formErrorMessage('Password must be at least 8 characters', passwordError);
    //                 password.classList.add('error');
    //                 confirm_password.classList.add('error');
    //             } else if (!passwordRegex.test(password.value)) {
    //                 formErrorMessage('Password must contain at least one number, one lowercase and one uppercase letter', passwordError);
    //                 password.classList.add('error');
    //                 confirm_password.classList.add('error');
    //             } else {
    //                 formClearMessage(passwordError);
    //                 password.classList.remove('error');
    //                 confirm_password.classList.remove('error');
    //             }
    //         }
            
    //         password.addEventListener('blur', validatePasswordStrength);
    //         confirm_password.addEventListener('blur', validatePasswordMatch);

    //         // check unique email and password
    //         const emailRegInput = document.querySelector('#emailRegInput');
    //         const loginRegInput = document.querySelector('#loginRegInput');
    //         const emailError = document.querySelector('#emailError');
    //         const loginError = document.querySelector('#loginError');

    //         emailRegInput.addEventListener('input', function() {
    //             fetch(`/check-email?email=${this.value}`)
    //             .then(response => response.json())
    //             .then(data => {
    //                 if (!data.unique) {
    //                     formErrorMessage('This e-mail is already registered!', emailError);
    //                 } else {
    //                     formClearMessage(emailError);
    //                 }
    //             });
    //         });
            
    //         loginRegInput.addEventListener('input', function() {
    //         fetch(`/check-login?login=${this.value}`)
    //             .then(response => response.json())
    //             .then(data => {
    //                 if (!data.unique) {
    //                     formErrorMessage('This login is already registered!', loginError);
    //                 } else {
    //                     formClearMessage(loginError);
    //                 }
    //             });
    //         });
                    
    //         document.querySelector('form').addEventListener('submit', function(event) {
    //             event.preventDefault();
    //             const data = {
    //                 email: document.getElementById('emailRegInput').value,
    //                 login: document.getElementById('loginRegInput').value,
    //                 password: document.getElementById('password').value,
    //                 confirm_password: document.getElementById('confirm_password').value,
    //                 city: document.getElementById('city').value,
    //                 fullname: document.getElementById('fullname').value,
    //                 hand: document.querySelector('input[name="hand"]:checked').value,
    //                 date: document.getElementById('date').value,
    //                 registeredDate: new Date(),
    //                 policy: document.getElementById('policy').checked
    //             };

            
    //             fetch('/register', {
    //                 method: 'POST',
    //                 headers: {'Content-Type': 'application/json'},
    //                 body: JSON.stringify(data)
    //             })
    //             // .then(response => response.json())
    //             .then(response => {
    //                 if (!response.ok) {
    //                     // Если сервер вернул статус ошибки, выбросить ошибку
    //                     throw new Error('The server is not available. Please try again.');
    //                 }
    //                 return response.json();
    //             })
    //             .then(data => {
    //             if (data.status === 'error') {
    //                 // showErrorModal(data.error);
    //                 data.errors.forEach(error => {
    //                     showErrorModal(error.msg);
    //                 });
    //             } else {
    //                 document.querySelector('form').reset();
    //                 redirectToPersonalAccount();
    //             }
    //             })
    //             .catch(error => {
    //                 showErrorModal('The server is not available. Please try later.');
    //             });
    //         });
    //     }







 // if(event.target.classList.contains('btnLogin')) {
        //     content.innerHTML = `<button class="modal_close" onclick="closeModal()">
        //                             <img src="/icons/x-circle.svg" alt="кнопка закрыть">
        //                         </button>
        //                         <h2>Log in</h2>
        //                         <form action="/login" onsubmit="return validateForm()" method="POST" enctype="application/x-www-form-urlencoded">
        //                             <label for="username">E-mail or login*</label>
        //                             <input type="text" name="username" autocomplete="username" placeholder="Enter your email or login" id="email" required>
        //                             <label for="password">Password*</label>
        //                             <input type="password" placeholder="Enter password" id="password" name="password" autocomplete="new-password" required>
        //                             <button class='btnFogot' type="button">Forgot your password?</button>
        //                             <button id="logIn" class='header_btn-sign btnSbmt header_btn-login' type="submit">Log in</button>
        //                         </form>`;
        //     document.body.style = 'overflow: hidden;';
        //     modal.style.display = "block";
        //     document.querySelector('.btnFogot').onclick = window.btnFogot;
        // }









    // fetch(`/adv`)
    // .then(response => response.json())
    // .then(adv => {
    //     const advContent = document.querySelector('.adv');
    //     const containerElement = document.querySelector('.container');
    //     const tournamentsElement = document.querySelector('.tournaments');
    //     const rightDistance = document.documentElement.clientWidth - containerElement.getBoundingClientRect().right;
    //     const topDistance = tournamentsElement.getBoundingClientRect().top + window.pageYOffset;
    //     advContent.style.right = rightDistance + 'px';
    //     advContent.style.top = topDistance + 'px';
    //     advContent.innerHTML = '';
    //     advContent.style.visibility = 'visible';

    //     adv.forEach(item => {
    //         const advBlock = document.createElement('a');
    //         advBlock.href = item.link;
    //         const advImg = document.createElement('img');
    //         advImg.alt = 'adv';
    //         advImg.src = item.image;
    //         advBlock.appendChild(advImg);
    //         advContent.appendChild(advBlock);
    //     })
    // })
    // .catch(error => {
    //     console.error('Произошла ошибка:', error);
    //     showErrorModal('Database connection error');
    // });


    // fetch(`/coaches`)
    // .then(response => response.json())
    // .then(coaches => {
    //     const coachesContent = document.querySelector('.coaches_content');
    //     coachesContent.innerHTML = '';

    //     let coachesList = coaches.slice(0, 6);
    //     coachesList.sort().forEach(coach => {
    //         let coachDiv = document.createElement('div');
    //         coachDiv.className = 'coaches_content_coach';

    //         let wrapLogoDiv = document.createElement('div');
    //         wrapLogoDiv.className = 'coaches_content_coach_wrapLogo';

    //         let logoDiv = document.createElement('div');
    //         logoDiv.className = 'coaches_content_coach_wrapLogo_logo';
    //         logoDiv.style.backgroundImage = `url('${coach.logo}')`;
    //         logoDiv.style.backgroundPosition = '50%';
    //         logoDiv.style.backgroundSize = 'cover';
    //         logoDiv.style.backgroundRepeat = 'no-repeat';

    //         wrapLogoDiv.appendChild(logoDiv);
    //         coachDiv.appendChild(wrapLogoDiv);

    //         let infoDiv = document.createElement('div');
    //         infoDiv.className = 'coaches_content_coach_info';

    //         let ratingDiv = document.createElement('div');
    //         ratingDiv.className = 'coaches_content_coach_info_rating';
    //         ratingDiv.textContent = coach.rating;

    //         let nameH4 = document.createElement('h4');
    //         nameH4.className = 'coaches_content_coach_info_name';
    //         nameH4.textContent = coach.name;

    //         let clubDiv = document.createElement('div');
    //         clubDiv.className = 'coaches_content_coach_info_club';

    //         let clubTitleSpan = document.createElement('span');
    //         clubTitleSpan.className = 'coaches_content_coach_info_title';
    //         let clubTitle = {
    //             'english': 'Club:',
    //             'thai': 'ชมรม:',
    //             'russian': 'Клуб:'
    //         };
    //         clubTitleSpan.textContent = clubTitle[localStorage.clientLang] || 'Club:';

    //         let clubNameP = document.createElement('p');
    //         clubNameP.textContent = coach.club;

    //         clubDiv.appendChild(clubTitleSpan);
    //         clubDiv.appendChild(clubNameP);

    //         let cityDiv = document.createElement('div');
    //         cityDiv.className = 'coaches_content_coach_info_city';

    //         let cityTitleSpan = document.createElement('span');
    //         cityTitleSpan.className = 'coaches_content_coach_info_title';
    //         let cityTitle = {
    //             'english': 'City:',
    //             'thai': 'เมือง:',
    //             'russian': 'Город:'
    //         };
    //         cityTitleSpan.textContent = cityTitle[localStorage.clientLang] || 'City:';

    //         let cityNameP = document.createElement('p');
    //         cityNameP.textContent = coach.city;

    //         cityDiv.appendChild(cityTitleSpan);
    //         cityDiv.appendChild(cityNameP);

    //         infoDiv.appendChild(ratingDiv);
    //         infoDiv.appendChild(nameH4);
    //         infoDiv.appendChild(clubDiv);
    //         infoDiv.appendChild(cityDiv);

    //         coachDiv.appendChild(infoDiv);

    //         coachesContent.appendChild(coachDiv);
    //     });
    // })
    // .catch(error => {
    //     console.error('Произошла ошибка:', error);
    //     showErrorModal('Database connection error');
    // });


 // fetch('/get-future-tournaments')
    //     .then(response => response.json())
    //     .then(data => {
    //         let futureTournaments = data.filter(tournament => new Date(tournament.datetime) > new Date());
    //         futureTournaments.sort((a, b) => new Date(a.datetime) - new Date(b.datetime));
    //         futureTournaments = futureTournaments.slice(0, 10);
    //         // рендер будущих турниров
    //         let currentDay = '';
    //         futureTournaments.forEach(tournament => {

    //         // Расчет среднего рейтинга
    //         let totalRating = 0;
    //         tournament.players.forEach(player => {
    //             totalRating += player.rating;
    //         });
    //         let averageRating = Math.round(totalRating / tournament.players.length);
    //         tournament.rating = averageRating;

    //         let tournamentDate = new Date(tournament.datetime);
    //         let langMap = {'english': 'en-US', 'thai': 'th-TH', 'russian': 'ru-RU'};
        
    //         let lang = langMap[localStorage.clientLang] || 'en-US';
    //         let dayOfWeek = tournamentDate.toLocaleDateString(lang, { weekday: 'long' });
    //         let formattedDate = `${dayOfWeek} ${String(tournamentDate.getDate()).padStart(2, '0')}.${String(tournamentDate.getMonth() + 1).padStart(2, '0')}.${tournamentDate.getFullYear()}`;
    //         if (formattedDate !== currentDay) {
    //             currentDay = formattedDate;
    //             let weekdayDiv = document.createElement('div');
    //             weekdayDiv.className = 'upcommingTable_weekday';
    //             let dateSpan = document.createElement('span');
    //             dateSpan.textContent = currentDay;
    //             weekdayDiv.appendChild(dateSpan);
    //             // weekdayDiv.textContent = currentDay;
    //             document.querySelector('.upcommingTable_content').appendChild(weekdayDiv);
    //         }

    //         let tournamentDiv = document.createElement('a');
    //         tournamentDiv.className = 'upcommingTable_tournament';
    //         tournamentDiv.href = `/tournament/${tournament._id}`;

    //         let timeDiv = document.createElement('div');
    //         timeDiv.className = 'cell tournament_time';
    //         timeDiv.textContent = tournament.datetime.split('T')[1].substring(0, 5);
    //         tournamentDiv.appendChild(timeDiv);

    //         let clubDiv = document.createElement('div');
    //         clubDiv.className = 'cell tournament_club';
    //         let clubLogoDiv = document.createElement('div');
    //         clubLogoDiv.className = 'clubLogo';
    //         clubLogoDiv.style.cssText = `background-image: url('${tournament.club.logo}'); background-position: 50%; background-size: cover; background-repeat: no-repeat;`;
    //         clubDiv.appendChild(clubLogoDiv);

    //         let clubNameSpan = document.createElement('span');
    //         clubNameSpan.textContent = tournament.club.name;
    //         clubDiv.appendChild(clubNameSpan);
    //         tournamentDiv.appendChild(clubDiv);

    //         let restrictionsDiv = document.createElement('div');
    //         restrictionsDiv.className = 'cell tournament_restrict';
    //         let restrictionStatusDiv = document.createElement('div');
    //         restrictionStatusDiv.className = 'restrictionStatus';
            
    //         if (new Date(tournament.datetime) > new Date()) {
    //             restrictionStatusDiv.style.background = '#007026';
    //         } else {
    //             restrictionStatusDiv.style.background = '#ADADAD';
    //         }

    //         let restrictionDiv = document.createElement('div');
    //         restrictionDiv.className = 'restriction';
    //         restrictionDiv.textContent = tournament.restrictions;
    //         restrictionStatusDiv.appendChild(restrictionDiv);
    //         restrictionsDiv.appendChild(restrictionStatusDiv);
    //         tournamentDiv.appendChild(restrictionsDiv);

    //         let ratingDiv = document.createElement('div');
    //         ratingDiv.className = 'cell tournament_rating';
    //         ratingDiv.textContent = tournament.rating;
    //         tournamentDiv.appendChild(ratingDiv);

    //         let playersDiv = document.createElement('a');
    //         playersDiv.className = 'cell tournament_players';
    //         let playersImg = document.createElement('img');
    //         playersImg.src = '/icons/user.svg';
    //         playersImg.alt = 'person';
    //         playersDiv.appendChild(playersImg);
    //         let playersSpan = document.createElement('span');
    //         playersSpan.textContent = tournament.players.length;
    //         playersDiv.appendChild(playersSpan);
    //         tournamentDiv.appendChild(playersDiv);
            
    //         document.querySelector('.upcommingTable_content').appendChild(tournamentDiv);
    //     });

    //     let moreButton = document.createElement('a');
    //     moreButton.className = 'upcommingTable_btn';
    //     moreButton.href = '#';
    //     let showMore = {
    //         'english': 'See more',
    //         'thai': 'ดูเพิ่มเติม',
    //         'russian': 'Смотреть еще'
    //     };
    //     moreButton.textContent = showMore[localStorage.clientLang] || 'See more'; // Установите текст кнопки на нужном языке
    //     document.querySelector('.upcommingTable_content').appendChild(moreButton);
    // })
    // .catch(error => console.error('Error:', error));



    // fetch(`/clubs`)
    // .then(response => response.json())
    // .then(clubs => {
    //     const clubsContent = document.querySelector('.clubs_content');
    //     clubsContent.innerHTML = '';

    //     let clubsList = clubs.slice(0, 6);
    //     clubsList.sort().forEach(club => {
    //         let clubDiv = document.createElement('div');
    //         clubDiv.className = 'clubs_content_club';

    //         let logoImg = document.createElement('img');
    //         logoImg.className = 'clubs_content_club_logo';
    //         logoImg.src = club.logo;
    //         logoImg.alt = 'logo';

    //         let infoDiv = document.createElement('div');
    //         infoDiv.className = 'clubs_content_club_info';

    //         let nameH4 = document.createElement('h4');
    //         nameH4.className = 'clubs_content_club_info_name';
    //         nameH4.textContent = club.name;

    //         let citySpan = document.createElement('span');
    //         citySpan.className = 'clubs_content_club_info_city';
    //         citySpan.textContent = club.city;

    //         let phoneNumberLink = document.createElement('a');
    //         phoneNumberLink.className = 'clubs_content_club_info_phoneNumber';
    //         phoneNumberLink.href = `tel:${club.phoneNumber}`;
    //         phoneNumberLink.textContent = club.phoneNumber;

    //         infoDiv.appendChild(nameH4);
    //         infoDiv.appendChild(citySpan);
    //         infoDiv.appendChild(phoneNumberLink);

    //         clubDiv.appendChild(logoImg);
    //         clubDiv.appendChild(infoDiv);

    //         clubsContent.appendChild(clubDiv);
    //     });
    // })
    // .catch(error => {
    //     console.error('Произошла ошибка:', error);
    //     showErrorModal('Database connection error');
    // });




 // fetch('/get-past-tournaments')
    //   .then(response => response.json())
    //   .then(data => {
        
    //     let pastTournaments = data.filter(tournament => new Date(tournament.datetime) <= new Date());
    //     pastTournaments.sort((a, b) => new Date(b.datetime) - new Date(a.datetime)).slice(0, 6);
    //     pastTournaments = pastTournaments.slice(0, 6);

    //     pastTournaments.forEach(tournament => {
    //         let pastTournamentDiv = document.createElement('div');
    //         pastTournamentDiv.className = 'last_tournaments_tournament';

    //         let clubDateDiv = document.createElement('div');
    //         clubDateDiv.className = 'last_tournaments_tournament_clubDate';

    //         let dateDiv = document.createElement('div');
    //         dateDiv.className = 'last_tournaments_tournament_clubDate_date';

    //         let img = document.createElement('img');
    //         img.src = '/icons/ttrocket.svg';
    //         img.alt = 'table tennis rocket';

    //         let langMap = {'english': 'en-US', 'thai': 'th-TH', 'russian': 'ru-RU'};
    //         let lang = langMap[localStorage.clientLang] || 'en-US';
    //         let span = document.createElement('span');
    //         let tournamentDate = new Date(tournament.datetime);
    //         let dayOfWeek = tournamentDate.toLocaleDateString(lang, { weekday: 'long' });
    //         let formattedDate = `${dayOfWeek} ${String(tournamentDate.getDate()).padStart(2, '0')}.${String(tournamentDate.getMonth() + 1).padStart(2, '0')}.${tournamentDate.getFullYear()}`;
    //         span.textContent = formattedDate;

    //         dateDiv.appendChild(img);
    //         dateDiv.appendChild(span);

    //         let pastClubDiv = document.createElement('div');
    //         pastClubDiv.className = 'last_tournaments_tournament_clubDate_club';

    //         let pastClubLogoDiv = document.createElement('div');
    //         pastClubLogoDiv.className = 'clubLogo';
    //         pastClubLogoDiv.style.cssText = `background-image: url('${tournament.club.logo}'); background-position: 50%; background-size: cover; background-repeat: no-repeat;`;

    //         let pastClubNameSpan = document.createElement('span');
    //         pastClubNameSpan.textContent = tournament.club.name;

    //         pastClubDiv.appendChild(pastClubLogoDiv);
    //         pastClubDiv.appendChild(pastClubNameSpan);

    //         clubDateDiv.appendChild(dateDiv);
    //         clubDateDiv.appendChild(pastClubDiv);

    //         pastTournamentDiv.appendChild(clubDateDiv);

    //         let winnersDiv = document.createElement('div');
    //         winnersDiv.className = 'last_tournaments_tournament_winners';

    //         tournament.players.sort((a, b) => a.place - b.place).forEach(player => {
    //             let winnerLink = document.createElement('a');
    //             winnerLink.href = `/${player.id}`;  // ------------------------------------------------------------------ссылка на лк
    //             winnerLink.className = `last_tournaments_tournament_winners_${player.place}`;
    //             let winnerImg = document.createElement('img');
    //             winnerImg.src = `/icons/${player.place}st-medal.svg`;
    //             winnerImg.alt = `${player.place} place`;
    //             let winnerSpan = document.createElement('span');
    //             winnerSpan.textContent = player.name;
    //             winnerLink.appendChild(winnerImg);
    //             winnerLink.appendChild(winnerSpan);
    //             winnersDiv.appendChild(winnerLink);
    //         });
            
    //         pastTournamentDiv.appendChild(winnersDiv);

    //         let aditInfoDiv = document.createElement('div');
    //         aditInfoDiv.className = 'last_tournaments_tournament_aditInfo';

    //         let playersLimitDiv = document.createElement('div');
    //         playersLimitDiv.className = 'last_tournaments_tournament_aditInfo_playersLimit';

    //         let pastPlayersDiv = document.createElement('div');
    //         pastPlayersDiv.className = 'last_tournaments_tournament_aditInfo_playersLimit_players';
    //         let pastPlayersImg = document.createElement('img');
    //         pastPlayersImg.src = '/icons/user.svg';
    //         pastPlayersImg.alt = 'person';
    //         let pastPlayersSpan = document.createElement('span');
    //         pastPlayersSpan.textContent = tournament.players.length - 1;
    //         pastPlayersDiv.appendChild(pastPlayersImg);
    //         pastPlayersDiv.appendChild(pastPlayersSpan);

    //         let pastRestrictionStatusDiv = document.createElement('div');
    //         pastRestrictionStatusDiv.className = 'restrictionStatus';
    //         pastRestrictionStatusDiv.style.background = '#ADADAD';
    //         let pastRestrictionDiv = document.createElement('div');
    //         pastRestrictionDiv.className = 'restriction';
    //         pastRestrictionDiv.textContent = tournament.restrictions;
    //         pastRestrictionStatusDiv.appendChild(pastRestrictionDiv);

    //         playersLimitDiv.appendChild(pastPlayersDiv);
    //         playersLimitDiv.appendChild(pastRestrictionStatusDiv);

    //         let moreDetailsLink = document.createElement('a');
    //         moreDetailsLink.href = '#';
    //         let moreDetailsText = {
    //             'english': 'More details',
    //             'thai': 'รายละเอียดเพิ่มเติม',
    //             'russian': 'Подробнее'
    //         };
    //         moreDetailsLink.textContent = moreDetailsText[localStorage.clientLang] || 'More details';

    //         aditInfoDiv.appendChild(playersLimitDiv);
    //         aditInfoDiv.appendChild(moreDetailsLink);

    //         pastTournamentDiv.appendChild(aditInfoDiv);
    //         document.querySelector('.last_tournaments').appendChild(pastTournamentDiv);

    //     });
    //   })
    // .catch(error => console.error('Error:', error));






// fetch(`/cities?language=${language}`)
//     .then(response => response.json())
//     .then(cities => {
//         citiesList = cities.sort();
//     })
//     .catch(error => {
//         console.error('Произошла ошибка:', error);
//         showErrorModal('Database connection error');
// });














    // контроль языков первый вариант

    // let statusLangsMenu = false;
    // let baseUrl = window.location.origin;

    // const languageMap = {
    // 'russian': 'ru',
    // 'english': 'en',
    // 'thai': 'th'
    // };

    // document.querySelectorAll('.selectedLanguage').forEach(function(button) {
    //     button.addEventListener('click', function() {
    //         this.nextElementSibling.classList.toggle('openLangsMenu');
    //         this.querySelector('.arrowLangs').style.transform = 'rotateX(180deg)';
    //         statusLangsMenu = true;
    //     });
    // });

    // document.querySelectorAll('.dropdown a').forEach(function(element) {
    //     element.addEventListener('click', function() {
    //         let selectedLang = this.getAttribute('data-lang');
    //         let shortLang = languageMap[selectedLang];

    //         localStorage.setItem('clientLang', selectedLang);
    //         let dropdown = this.parentElement;

    //         dropdown.previousElementSibling.querySelector('.languageText').innerText = shortLang;
    //         dropdown.style.display = 'none';
    //         dropdown.previousElementSibling.querySelector('.arrowLangs').style.transform = 'rotateX(360deg)';
    //         statusLangsMenu = false;

    //         let currentPath = window.location.pathname;
    //         let newPath = currentPath.replace(/\/(en|ru|th)/, '/' + shortLang);
    //         window.location.href = baseUrl + newPath;
    //     });
    // });






// добавление рекламы первый не адаптированый вариант

// export function fetchAdvertisements() {
//     fetch(`/adv`)
//       .then(response => response.json())
//       .then(adv => {
//           const advContent = document.querySelector('.adv');
//           const containerElement = document.querySelector('.container');
//           const tournamentsElement = document.querySelector('.tournaments');
//           const rightDistance = document.documentElement.clientWidth - containerElement.getBoundingClientRect().right;
//           const topDistance = tournamentsElement.getBoundingClientRect().top + window.pageYOffset;
//           advContent.style.right = rightDistance + 'px';
//           advContent.style.top = topDistance + 'px';
//           advContent.innerHTML = '';
//           advContent.style.visibility = 'visible';
  
//           adv.forEach(item => {
//               const advBlock = document.createElement('a');
//               advBlock.href = item.link;
//               const advImg = document.createElement('img');
//               advImg.alt = 'adv';
//               advImg.src = item.image;
//               advBlock.appendChild(advImg);
//               advContent.appendChild(advBlock);
//           });
//       })
//       .catch(error => {
//           console.error('Произошла ошибка:', error);
//           showErrorModal('Database connection error');
//       });
// }










/   app.get('/:lang/allclubs/:clubId', async (req, res) => {
//     const { lang, clubId } = req.params;

//     try {
//         const dataClub = await db.collection('clubs').findOne({ _id: new ObjectId(clubId) });
//         if (!dataClub) {
//             return res.status(404).send('Club not found');
//         }

//         res.render(`${lang}/club`, { clubId }); // Передаем только clubId в шаблон
//     } catch (error) {
//         console.error('Error fetching club data:', error);
//         res.status(500).send('Internal Server Error');
//     }
// });

// app.get('/api/:lang/allclubs/:clubId', async (req, res) => {
//     const { lang, clubId } = req.params;

//     try {
//         const dataClub = await db.collection('clubs').findOne({ _id: new ObjectId(clubId) });
//         if (!dataClub) {
//             return res.status(404).send('Club not found');
//         }

//         res.json(dataClub);
//     } catch (error) {
//         console.error('Error fetching club data:', error);
//         res.status(500).send('Internal Server Error');
//     }
// });



  // app.get('/:lang/allclubs/:clubId', async (req, res) => {
  //   const { lang, clubId } = req.params;
    
  //   try {
  //       const dataClub = await db.collection('clubs').findOne({ _id: new ObjectId(clubId) });
  //       // console.log(dataClub);
  //       if (!dataClub) {
  //           return res.status(404).send('Club not found');
  //       }

  //       res.render(`${lang}/club`);
  //   } catch (error) {
  //       console.error('Error fetching club data:', error);
  //       res.status(500).send('Internal Server Error');
  //   }
  // });
  

  //код без добавления новых городов в бд
  // app.post('/register', [
  //   // check passwords
  //   body('password')
  //     .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
  //     .matches(/^(?=.*\d)(?=.*[a-zа-яё\u0E01-\u0E5B])(?=.*[A-ZА-ЯЁ]).{8,}$/).withMessage('Password must contain at least one number, one lowercase and one uppercase letter')
  
  // ], async function(req, res) {
  //   const errors = validationResult(req);
  //   if (!errors.isEmpty()) {
  //     return res.status(400).json({ status: 'error', errors: errors.array() });
  //   }
    
  //   const defaultLogo = '/icons/playerslogo/default_avatar.svg';

  //   console.log(req.body);
  //   const { email, login, password, confirm_password, city, fullname, hand, date, registeredDate, policy, clientLang } = req.body;
    
  //   if (!email || !login || !password || !confirm_password || !city || !fullname || !hand || !date || !registeredDate || !policy ) {
  //     res.status(400).json({ error: 'Something wrong. Please come back to homepage and try again' });
  //     return;
  //   }
    
  //   const parts = date.split(".");
  //   const birthdayDate = new Date(`${parts[1]}/${parts[0]}/${parts[2]}`);
    
  //   try {
  //     // Check if the city already exists
  //     const cityExists = await db.collection('cities').findOne({ [clientLang]: city });
  //     console.log(clientLang);

  //     if (!cityExists) {
  //       // If city does not exist, add it
  //       const newCity = { [clientLang]: city };
  //       console.log('Inserting new city:', newCity);
  //       await db.collection('cities').insertOne(newCity);
  //     } else {
  //         console.log('City already exists:', cityExists);
  //     }

      
  //     await db.collection('users').insertOne({ email, 
  //                                             login, 
  //                                             password, 
  //                                             city, 
  //                                             fullname,
  //                                             logo: defaultLogo, 
  //                                             hand, 
  //                                             birthdayDate, 
  //                                             registeredDate, 
  //                                             policy 
  //     });
  //     console.log("Данные успешно вставлены");

  //     const transporter = nodemailer.createTransport({
  //       service: 'gmail',
  //       auth: {
  //         user: notificateEmail,
  //         pass: notificatePass
  //       }
  //     });

  //     const mailOptionsForOwner = {
  //       from: notificateEmail,
  //       to: 'ogarsanya@gmail.com',
  //       subject: 'New User Application',
  //       text: `
  //         A new user has registered
  //           E-mail: ${email}, 
  //           Login: ${login},  
  //           City: ${city}, 
  //           Name: ${fullname}, 
  //           Plaing hand: ${hand}, 
  //           Burthday: ${birthdayDate}, 
  //           Registered date: ${registeredDate}, 
  //           Policy: 'Agreed'
  //       `
  //     };
  //     const mailOptionsForUser = {
  //       from: notificateEmail,
  //       to: `${email}`,
  //       subject: 'Congratulation!',
  //       text: `
  //         You have successfully registered at https://thailandttleague.com
  //           E-mail: ${email}, 
  //           Login: ${login}
  //       `
  //     };

  //     transporter.sendMail(mailOptionsForOwner, (error, info) => {
  //       if (error) {
  //         console.error('Error sending email:', error);
  //       } else {
  //         console.log('Email sent:', info.response);
  //       }
  //     });

  //     transporter.sendMail(mailOptionsForUser, (error, info) => {
  //       if (error) {
  //         console.error('Error sending email:', error);
  //       } else {
  //         console.log('Email sent:', info.response);
  //       }
  //     });

  //     res.status(200).json({ status: 'success', message: 'Registration successful!' });
  //   } catch (err) {
  //     console.error('Ошибка при вставке в MongoDB:', err);
  //     res.status(500).json({ status: 'error', error: 'Registration error. Please try again.' });
  //   }
  
  // });