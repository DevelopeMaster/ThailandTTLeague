import { createHeader, createFooter, getAllClubs, showErrorModal, getAllCoaches, listenerOfButtons, btnGoUp, languageControl, controlTextAreaCoach, fetchCities, fetchAdvertisements, breadCrumb } from './modules.js';
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
    initializeApp();

    btnGoUp();
    
    languageControl();

    breadCrumb();

    const topBlockAdv = document.querySelector('.player');
    fetchAdvertisements(topBlockAdv);

    listenerOfButtons();

    
    const currentPath = window.location.pathname;

    const parts = currentPath.split('/');
    const lang = parts[1];
    // const userId = parts[3];

    const userId = document.querySelector('.player').dataset.userid;
    let player;
    let playerCity;
    let playedMostOften;
    let mostActiveClub;

    const translations = {
        'en': {
            'city': 'City',
            'contacts': 'Contacts',
            'Playing hand': 'Plaing hand',
            'Rating': 'Rating',
            'Birthday': 'Date of birth',
            'Racket': 'Racket',
            'Blade': 'Blade',
            'Forehand rubber': 'Forehand rubber',
            'Backhand rubber': 'Backhand rubber',
            'years': 'years',
            'Tournaments played': 'Tournaments played',
            'Games': 'Games (wins / losses)',
            'Maximum rating': 'Maximum rating',
            'Rank': 'Rank',
            'First tournament': 'First tournament',
            'Most often in': 'Most often in',
            'tournaments': 'tournaments',
            'left': 'left',
            'right': 'right',
            'Coach': 'Coach'
        },
        'ru': {
            'city': 'Город:',
            'contacts': 'Contacts',
            'Playing hand': 'Игровая рука:',
            'Rating': 'Рейтигн',
            'Birthday': 'Дата рождения',
            'Racket': 'Ракетка:',
            'Blade': 'Основание',
            'Forehand rubber': 'Накладка слева',
            'Backhand rubber': 'Накладка справа',
            'years': 'лет',
            'Tournaments played': 'Сыграно турниров',
            'Games': 'Игры (победы / поражения)',
            'Maximum rating': 'Максимальный рейтинг',
            'Rank': 'Место в рейтинге',
            'First tournament': 'Первый турнир',
            'Most often in': 'Чаще всего в',
            'tournaments': 'турниров',
            'left': 'левая',
            'right': 'правая',
            'Coach': 'Тренер'
        },
        'th': {
            'city': 'เมือง',
            'contacts': 'Contacts',
            'Playing hand': 'มือฝั่งที่เล่น',
            'Rating': 'คะแนน',
            'Birthday': 'วันเกิด',
            'Racket': 'Racket',
            'Blade': 'Blade',
            'Forehand rubber': 'Forehand rubber',
            'Backhand rubber': 'Backhand rubber',
            'years': 'years',
            'Tournaments played': 'จำนวนการแข่งขันที่ผ่านมา',
            'Games': 'จำนวนการแข่ง (ชนะ / แพ้)',
            'Maximum rating': 'คะแนนสูงสุด',
            'Rank': 'อันดับ',
            'First tournament': 'การแข่งขันครั้งแรก',
            'Most often in': 'เล่นประจำที่',
            'tournaments': 'การแข่งขัน',
            'left': 'ซ้าย',
            'right': 'ขวา',
            'Coach': 'โค้ช'
        }
    };

    function getTranslation(key) {
        return translations[lang][key] || translations['en'][key];
    }

    async function fetchPlayerData() {
        try {
            const response = await fetch(`/get-data-player?lang=${lang}&userId=${userId}`);
            if (!response.ok) {
                throw new Error('Player not found');
            }
            player = await response.json();
            console.log(player);
            // mostActiveClub = getClubWithMostTournaments(player.tournaments);
            playerCity = await getCityName(player.city);
            // console.log(mostActiveClub.clubId);
            if (player.tournaments.length > 0) {
                mostActiveClub = getClubWithMostTournaments(player.tournaments);
                await fetchClubData(mostActiveClub.clubId);
            }
            renderPlayerData();
            
        } catch (error) {
            console.error('Error fetching player data:', error);
        }
    }

    function getClubWithMostTournaments(tournaments) {
        if (!tournaments || typeof tournaments !== 'object') return null;
      
        let maxClubId = null;
        let maxCount = -1;
      
        for (const [clubId, count] of Object.entries(tournaments)) {
          if (count > maxCount) {
            maxCount = count;
            maxClubId = clubId;
          }
        }
      
        return { clubId: maxClubId, count: maxCount };
      }
    
    async function getCityName(cityId) {
        try {
            const response = await fetch(`/cities/${cityId}`);
            if (!response.ok) {
                throw new Error('City data not found');
            }
            const city = await response.json();
            const languageKeyMap = {
                'en': 'english',
                'ru': 'russian',
                'th': 'thai'
            };
            const cityKey = languageKeyMap[lang] || 'english';
            
            return city[cityKey] || city['english'];
        } catch (error) {
            console.error('Ошибка при получении названия города:', error);
            return 'Unknown City'; // Возвращение запасного значения в случае ошибки
        }
    }

    async function fetchClubData(clubId) {
        // console.log(clubId)
        try {
            const response = await fetch(`/get-data-club?clubId=${clubId}`);
            if (!response.ok) {
                throw new Error('Club not found');
            }
            const club = await response.json();
            // console.log('club', club)
            playedMostOften = club.name;
            
        } catch (error) {
            console.error('Error fetching club data:', error);
        }
    }

    function formatDate(dateString) {
        if (!dateString) return "—";
        
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0"); // Месяцы начинаются с 0
        const year = date.getFullYear();
    
        return `${day}.${month}.${year}`;
    }

    function formatDateAndAge(dateString, language) {
        const date = new Date(dateString);
    
        // Форматируем дату в формате DD.MM.YYYY
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
    
        // Вычисляем возраст
        const currentDate = new Date();
        let age = currentDate.getFullYear() - year;
    
        if (
            currentDate.getMonth() < date.getMonth() ||
            (currentDate.getMonth() === date.getMonth() && currentDate.getDate() < date.getDate())
        ) {
            age--;
        }
    
        // Определяем форму слова для возраста
        let ageText;
        if (language === 'ru') {
            ageText = getRussianAgeText(age);
        } else if (language === 'en') {
            ageText = `${age} years`;
        } else if (language === 'th') {
            ageText = `${age} ปี`; // "ปี" означает "лет" на тайском
        } else {
            ageText = `${age} years`; // По умолчанию используем английский
        }
    
        return `${day}.${month}.${year} (${ageText})`;
    }
    
    function getRussianAgeText(age) {
        const lastDigit = age % 10;
        const lastTwoDigits = age % 100;
    
        if (lastTwoDigits >= 11 && lastTwoDigits <= 14) {
            return `${age} лет`;
        }
    
        switch (lastDigit) {
            case 1:
                return `${age} год`;
            case 2:
            case 3:
            case 4:
                return `${age} года`;
            default:
                return `${age} лет`;
        }
    }
    

    function renderPlayerData() {
        const formattedDate = formatDateAndAge(player.birthdayDate, lang);
        const firstTournamentDate = formatDate(player.firstTournamentDate);
        const currentRating = player.rating;
        const sundayRating = player.sundaysRating;
        const ratingChange = currentRating - sundayRating;
        let changeRatingColor;
        let changeRatingSymbol;

        if (ratingChange > 0) {
            changeRatingColor = '#007026';  // Рейтинг увеличился
            changeRatingSymbol = '+';
        } else if (ratingChange < 0) {
            changeRatingColor = '#ff0000c7';    // Рейтинг уменьшился
            changeRatingSymbol = '';
        } else {
            changeRatingColor = '#adadada1';   // Рейтинг не изменился
            changeRatingSymbol = '+';
        } 

        const playerMainInfo = document.querySelector('.player_mainInfo');
        playerMainInfo.innerHTML = `
            <div class="player_mainInfo_logo" style="background-image: url(${player.logo || 'icons/playerslogo/default_avatar.svg'}); background-position: 50% center; background-size: cover; background-repeat: no-repeat;"></div>
            <div class="player_mainInfo_info">
                <div class="player_mainInfo_info_name">
                    ${player.name || player.fullname}
                </div>
                <div class="player_mainInfo_info_descr">
                    <div class="player_mainInfo_info_descr_path">
                        <p>${getTranslation('Playing hand')}: <span>${getTranslation(player.hand)}</span></p>
                        <p>${getTranslation('Rating')}: <span style="margin-left: 5px">${Math.round(player.rating) || ' - '}</span> <span style="margin-left: 5px; color: ${changeRatingColor}">${changeRatingSymbol || ''}${ratingChange.toFixed(1) || ''}</span></p>
                        <p>${getTranslation('Coach')}: <span>${player.coach || ' - '}</span></p>
                    </div>
                    <div class="player_mainInfo_info_descr_path">
                        <p>${getTranslation('city')}: <span>${playerCity}</span></p>
                        <p>${getTranslation('Birthday')}: <span>${formattedDate}</span></p>
                    </div>
                </div>
            </div>
        `;

        const playerAbout = document.querySelector('.player_about');
        playerAbout.innerHTML = `
            <h3>${getTranslation('Racket')}</h3>
            <div class="player_about_info_descr">
                <div class="player_about_info_descr_path">
                    <p>${getTranslation('Blade')}: <span>${player.blade || ' - '}</span></p>
                    <p>${getTranslation('Forehand rubber')}: <span>${player.forehandRubber || ' - '}</span></p>
                </div>
                <div class="player_about_info_descr_path">
                    <p>${getTranslation('Backhand rubber')}: <span>${player.backhandRubber || ' - '}</span></p>
                    
                </div>
            </div>
            
        `;

        const playerStatistics = document.querySelector('.player_statistics');
        playerStatistics.innerHTML = `
            <div class="player_statistics_info_descr">
                <div class="player_statistics_info_descr_path">
                    <p>${getTranslation('Tournaments played')}: <span>${player.tournamentsPlayed || 0 }</span></p>
                    <p>${getTranslation('Games')}: <span>${(player.totalWins + player.totalLosses) || 0} (${player.totalWins || 0} / ${player.totalLosses || 0})</span></p>
                    <div class="raitingWrapp"><span>${getTranslation('Maximum rating')}:</span> <span class="coaches_content_coach_info_rating">${Math.round(player.rating) || ' - '}</span></div>
                </div>
                <div class="player_statistics_info_descr_path statisticsSeparateLine">
                    <p>${getTranslation('Rank')}: <span>${Math.round(player.rating) || ' - '}</span></p>
                    <p>${getTranslation('First tournament')}: <span>${player.firstTournamentDate || ' - '}</span></p>
                    <p>${getTranslation('Most often in')}: <span>${playedMostOften ? playedMostOften: ' - '} (${mostActiveClub?.count || ' - '})</span></p>
                    
                </div>
            </div>
            
        `;

        renderBestVictories(player);
        renderPlayerAwards(player);
        // ${getTranslation('tournaments')}: 


        // <div class="player_about_wrapp">
        //         <p><span>${getTranslation('address')}: </span>${player.address[lang] || player.address['en']}</p>
        //         <p>${player.info[lang] || player.info['en']}</p>
        //     </div>
    }


    function renderBestVictories(player) {
        const container = document.querySelector(".bestVictories_table_content");
        if (!container || !Array.isArray(player.bestVictories)) return;
      
        container.innerHTML = ""; // Очистим блок
      
        const victories = [...player.bestVictories].sort(
          (a, b) => b.opponentRating - a.opponentRating
        );
      
        const MAX_VISIBLE = 3;
      
        victories.forEach((victory, index) => {
          const date = new Date(victory.date).toLocaleDateString("ru-RU");
          const opponentRating = Math.round(victory.opponentRating);
          const playerRating = Math.round(victory.playerRating);
          const clubName = victory.club?.name || "Unknown club";
          const clubLogo = victory.club?.logo || "/icons/clubslogo/default.png";
          const opponentName = victory.opponentName || "Unknown opponent";
          const score = victory.score || "-";
      
          const ratingLimit = victory.ratingLimit
            ? `<div class="restrictionStatus bestVictories_before" style="background: rgb(173, 173, 173);">
                <div class="restriction">${victory.ratingLimit}</div>
              </div>`
            : "";
      
          const victoryDiv = document.createElement("div");
          victoryDiv.classList.add("bestVictories_table_victory");
          if (index >= MAX_VISIBLE) {
            victoryDiv.classList.add("hidden-victory"); // Скрываем лишние
            victoryDiv.style.display = "none";
          }
      
          victoryDiv.innerHTML = `
            <div class="bestVictories_table_victory_left">
              <div class="bestVictories_number">${date}</div>
              <div class="cell bestVictories_club">
                <div class="clubLogo" style="background-image: url('${clubLogo}'); background-position: 50%; background-size: cover; background-repeat: no-repeat;"></div>
                <span class="shortcut" title="${clubName}">${clubName}</span>
              </div>
              ${ratingLimit}
              <div class="cell bestVictories_after">${playerRating}</div>
              <div class="cell bestVictories_player shortcut" title="${opponentName}">${opponentName}</div>
            </div>
      
            <div class="bestVictories_table_victory_right">
              <div class="cell bestVictories_oponentsraiting">${opponentRating}</div>
              <div class="cell bestVictories_score">${score}</div>
              <div class="cell bestVictories_avarage">
                <img src="/icons/greenChevronUp.gif" style="width: 16px" alt="green Chevron">
              </div>
            </div>
          `;
      
          container.appendChild(victoryDiv);
        });
      
        if (victories.length > MAX_VISIBLE) {
          const seeMoreBtn = document.createElement("a");
          seeMoreBtn.className = "bestVictories_table_btn";
          seeMoreBtn.href = "#";
          seeMoreBtn.textContent = "See more";
      
          seeMoreBtn.addEventListener("click", (e) => {
            e.preventDefault();
            const hidden = container.querySelectorAll(".hidden-victory");
            hidden.forEach(el => el.style.display = "flex");
            seeMoreBtn.remove();
          });
      
          container.appendChild(seeMoreBtn);
        }
    }
      

    function renderPlayerAwards(player) {
        const container = document.querySelector(".awardsTable");
        if (!container || !player.awards) return;
      
        container.innerHTML = ""; // Очистим предыдущие награды

        let totalGold = 0;
        let totalSilver = 0;
        let totalBronze = 0;
      
        Object.entries(player.awards).forEach(([clubId, award]) => {
          const gold = award.gold || 0;
          const silver = award.silver || 0;
          const bronze = award.bronze || 0;
      
          // Пропустим, если у игрока нет ни одной медали в клубе
          if (gold === 0 && silver === 0 && bronze === 0) return;

          totalGold += gold;
          totalSilver += silver;
          totalBronze += bronze;
      
          const div = document.createElement("div");
          div.classList.add("awardsTable_item");
      
          div.innerHTML = `
            <div class="cell bestVictories_club">
              <div class="clubLogo" style="background-image: url('${award.clubLogo}'); background-position: 50%; background-size: cover; background-repeat: no-repeat;"></div>
              <span class="shortcut" title="${award.clubName}">${award.clubName}</span>
            </div>
            <div class="awardsTable_item_medalBlock">
              <img src="/icons/1st-medal.svg" alt="gold medal">
              <span>(${gold})</span>
              <span>Gold</span>
            </div>
            <div class="awardsTable_item_medalBlock">
              <img src="/icons/2st-medal.svg" alt="silver medal">
              <span>(${silver})</span>
              <span>Silver</span>
            </div>
            <div class="awardsTable_item_medalBlock">
              <img src="/icons/3st-medal.svg" alt="bronze medal">
              <span>(${bronze})</span>
              <span>Bronze</span>
            </div>
          `;
      
          container.appendChild(div);
        });

        // Добавим блок с общей суммой наград
        const totalCount = totalGold + totalSilver + totalBronze;
        const totalDiv = document.createElement("div");
        totalDiv.classList.add("awardsTable_total");
        totalDiv.textContent = `Total awards: ${totalCount}`;
        container.appendChild(totalDiv);
      }
      


    

    fetchPlayerData();



});