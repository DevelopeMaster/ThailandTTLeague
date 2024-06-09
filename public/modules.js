// dbRequests.js

// fetchAdv.js
export function fetchAdvertisements() {
    fetch(`/adv`)
      .then(response => response.json())
      .then(adv => {
          const advContent = document.querySelector('.adv');
          const containerElement = document.querySelector('.container');
          const tournamentsElement = document.querySelector('.tournaments');
          const rightDistance = document.documentElement.clientWidth - containerElement.getBoundingClientRect().right;
          const topDistance = tournamentsElement.getBoundingClientRect().top + window.pageYOffset;
          advContent.style.right = rightDistance + 'px';
          advContent.style.top = topDistance + 'px';
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
}
  

import { updateCitiesList } from './index.js';

export function fetchCities(curLang) {
    fetch(`/cities?language=${curLang}`)
    .then(response => response.json())
    .then(cities => {
        let citiesList = cities.sort();
        updateCitiesList(citiesList);
       
    })
    .catch(error => {
        console.error('Произошла ошибка:', error);
        // showErrorModal('Database connection error');
    });
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
                winnerSpan.textContent = player.name;
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
            pastPlayersSpan.textContent = tournament.players.length; // -1
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

            let moreDetailsLink = document.createElement('a');
            moreDetailsLink.href = '#';
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
}


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

            let tournamentDiv = document.createElement('a');
            tournamentDiv.className = 'upcommingTable_tournament';
            tournamentDiv.href = `/tournament/${tournament._id}`;

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
            playersSpan.textContent = tournament.players.length;
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
        moreButton.textContent = showMore[localStorage.clientLang] || 'See more'; // Установите текст кнопки на нужном языке
        document.querySelector('.upcommingTable_content').appendChild(moreButton);
    })
    .catch(error => console.error('Error:', error));
}


export function fetchClub() {
    fetch(`/clubs`)
    .then(response => response.json())
    .then(clubs => {
        const clubsContent = document.querySelector('.clubs_content');
        clubsContent.innerHTML = '';

        let clubsList = clubs.slice(0, 6);
        clubsList.sort().forEach(club => {
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
            citySpan.textContent = club.city;

            let phoneNumberLink = document.createElement('a');
            phoneNumberLink.className = 'clubs_content_club_info_phoneNumber';
            phoneNumberLink.href = `tel:${club.phoneNumber}`;
            phoneNumberLink.textContent = club.phoneNumber;

            infoDiv.appendChild(nameH4);
            infoDiv.appendChild(citySpan);
            infoDiv.appendChild(phoneNumberLink);

            clubDiv.appendChild(logoImg);
            clubDiv.appendChild(infoDiv);

            clubsContent.appendChild(clubDiv);
        });
    })
    .catch(error => {
        console.error('Произошла ошибка:', error);
        showErrorModal('Database connection error');
    });
}


export function fetchCoaches() {
    fetch(`/coaches`)
    .then(response => response.json())
    .then(coaches => {
        const coachesContent = document.querySelector('.coaches_content');
        coachesContent.innerHTML = '';

        let coachesList = coaches.slice(0, 6);
        coachesList.sort().forEach(coach => {
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
            cityNameP.textContent = coach.city;

            cityDiv.appendChild(cityTitleSpan);
            cityDiv.appendChild(cityNameP);

            infoDiv.appendChild(ratingDiv);
            infoDiv.appendChild(nameH4);
            infoDiv.appendChild(clubDiv);
            infoDiv.appendChild(cityDiv);

            coachDiv.appendChild(infoDiv);

            coachesContent.appendChild(coachDiv);
        });
    })
    .catch(error => {
        console.error('Произошла ошибка:', error);
        showErrorModal('Database connection error');
    });
}