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
    initializeApp();

    btnGoUp();
    
    languageControl();

    breadCrumb();

    listenerOfButtons();

    const topBlockAdv = document.querySelector('.tournament');
    fetchAdvertisements(topBlockAdv);

    const currentPath = window.location.pathname;

    const parts = currentPath.split('/');
    const lang = parts[1];
    window.lang = lang;
    const tournamentId = parts[3];
    

    

    const tournamentData = await fetchTournament(tournamentId);
    window.tournamentData = tournamentData;

    if (tournamentData.finished) {
        // console.log(tournamentData);
        renderPastTournamentResults(tournamentData);
        // renderPastTournament(tournamentData);
    }

    const clubNameBlock = document.querySelector('.tournament_mainInfo_info_name');
    const logoBlock = document.querySelector('.tournament_mainInfo_logo');
    const playersAndGames = document.querySelector('.tournament_mainInfo_info_descr_path_wrapp span');
    const restrictionsBlock = document.querySelector('.restriction');
    const avrRatingBlock = document.querySelector('.tournament_mainInfo_info_descr_path_avrRating');
    const coefficientBlock = document.querySelector('.tournament_mainInfo_info_descr_path_coefficient');
    const cityBlock = document.querySelector('.tournament_mainInfo_info_descr_path_city');
    const popularScoreBlock = document.querySelector('.tournament_mainInfo_info_descr_path_wrapp_popularScore');

    // console.log('averageRating', tournamentData.averageRating);
    clubNameBlock.textContent = `${tournamentData.club.name}`;
    logoBlock.style = `background-image: url(${tournamentData.club.logo}); background-position: 50% center; background-size: cover; background-repeat: no-repeat;`;
    playersAndGames.textContent = `${tournamentData.players.length} participants/${tournamentData.finishedPairs.length} games`;
    restrictionsBlock.textContent = `${tournamentData.restrictions || tournamentData.ratingLimit}`;
    
    avrRatingBlock.textContent = `${tournamentData.averageRating}`;
    coefficientBlock.textContent = `${tournamentData.coefficient}`;

    
    let mostPopular = findMostPopularScore(tournamentData.results) || calculatePopularScoreTwoRounds(tournamentData.round1Results, tournamentData.round2Results) || calculatePopularScoreOlympic(tournamentData.finishedPairs) || ' - ';
    popularScoreBlock.textContent =`${mostPopular}`;

    const curCity = await getCityName(tournamentData.city._id || tournamentData.city);
    // console.log(curCity);
    cityBlock.textContent = `${curCity}`;


    if (window.tournamentData.recordId) {
        renderTournamentVideo(window.tournamentData.recordId);
    } else {
        renderTournamentVideo(null);
    }



    // const mediaBlock = document.getElementById('mediaBlock');






    if (window.tournamentData.typeOfTournament === 'roundRobin') {
        if (window.tournamentData.screenshotRoundRobin) {
            createMediaCard(window.tournamentData.screenshotRoundRobin, "Group");
        }
    } else {
        const mediaBlock = document.getElementById('mediaBlock');
        mediaBlock.innerHTML = `
            <span style="font-family: Inter; font-size: 16px; font-weight: 400; align-content: center; color: #adadad;">No media files available.</span>
        `;
    }
    

    const mediaBlock = document.getElementById('mediaBlock');
    const images = [...mediaBlock.querySelectorAll('img')];
    let currentIndex = 0;
  
    // Создаём overlay
    const overlay = document.createElement('div');
    overlay.id = 'mediaViewerOverlay';
    overlay.innerHTML = `
      <img src="/icons/x-circle.svg" id="mediaViewerClose">
      
      <img src="/icons/arrow_left_btn.svg" id="mediaViewerPrev" class="mediaViewerArrow">
      <img id="mediaViewerImage" src="" alt="">
      <img src="/icons/arrow_right_btn.svg" id="mediaViewerNext" class="mediaViewerArrow">
      <div class="counter" id="mediaViewerCounter"></div>
    `;
    document.body.appendChild(overlay);
  
    const viewerImg = overlay.querySelector('#mediaViewerImage');
    const closeBtn = overlay.querySelector('#mediaViewerClose');
    const prevBtn = overlay.querySelector('#mediaViewerPrev');
    const nextBtn = overlay.querySelector('#mediaViewerNext');
    const counter = overlay.querySelector('#mediaViewerCounter');
  
    function updateViewer() {
      viewerImg.src = images[currentIndex].src;
      counter.textContent = `${currentIndex + 1} / ${images.length}`;
    }
  
    function openViewer(index) {
      currentIndex = index;
      updateViewer();
      overlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  
    function closeViewer() {
      overlay.classList.add('fadeOut');
      setTimeout(() => {
        overlay.classList.remove('active', 'fadeOut');
        document.body.style.overflow = '';
      }, 200);
    }
  
    function showPrev() {
      currentIndex = (currentIndex - 1 + images.length) % images.length;
      updateViewer();
    }
  
    function showNext() {
      currentIndex = (currentIndex + 1) % images.length;
      updateViewer();
    }
  
    images.forEach((img, index) => {
      img.style.cursor = 'pointer';
      img.addEventListener('click', () => openViewer(index));
    });
  
    closeBtn.addEventListener('click', closeViewer);
    prevBtn.addEventListener('click', e => {
      e.stopPropagation();
      showPrev();
    });
    nextBtn.addEventListener('click', e => {
      e.stopPropagation();
      showNext();
    });
  
    // Escape и стрелки
    document.addEventListener('keydown', e => {
      if (!overlay.classList.contains('active')) return;
      if (e.key === 'Escape') closeViewer();
      if (e.key === 'ArrowLeft') showPrev();
      if (e.key === 'ArrowRight') showNext();
    });
  
    // Закрытие по клику вне изображения
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeViewer();
    });
  
    // Swipe для мобильных
    let startX = null;
    viewerImg.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
    });
  
    viewerImg.addEventListener('touchend', (e) => {
      if (startX === null) return;
      const endX = e.changedTouches[0].clientX;
      const diff = endX - startX;
      if (Math.abs(diff) > 50) {
        if (diff > 0) showPrev();
        else showNext();
      }
      startX = null;
    });
    

});


// function updateYoutubePlayerSrcOnResize(videoId) {
//     const iframe = document.getElementById('youtubePlayer');
  
//     function setSrcForViewport() {
//       const isMobile = window.innerWidth <= 768;
  
//       const base = `https://www.youtube.com/embed/${videoId}`;
//       const params = new URLSearchParams({
//         rel: 0,
//         controls: 0,
//         modestbranding: 1,
//         disablekb: 1,
//         iv_load_policy: 3,
//         fs: isMobile ? 1 : 0, // fullscreen только на мобильных
//       });
  
//       const newSrc = `${base}?${params.toString()}`;
  
//       // Обновляем только если адрес реально изменился
//       if (iframe.src !== newSrc) {
//         iframe.src = newSrc;
//       }
//     }
  
//     setSrcForViewport(); // Установим при загрузке
//     window.addEventListener('resize', setSrcForViewport); // Обновим при изменении размера
//   }
  


async function getCityName(cityId) {
    let currentLang = localStorage.getItem('clientLang');
    
    try {
        const response = await fetch(`/cities/${cityId}`);
        if (!response.ok) {
            throw new Error('City data not found');
        }
        const city = await response.json();
       
        return city[currentLang] || city['english'];
    } catch (error) {
        console.error('Ошибка при получении названия города:', error);
        return 'Unknown City';
    }
}

function calculatePopularScoreOlympic(finishedPairs) {
    const scoreMap = {};
    console.log('finishedPairs', finishedPairs);
    finishedPairs.forEach(pair => {
        const s1 = pair.score1 ?? 0;
        const s2 = pair.score2 ?? 0;

        const score = s1 > s2 ? `${s1}:${s2}` : `${s2}:${s1}`; // Победный счёт
        scoreMap[score] = (scoreMap[score] || 0) + 1;
    });

    // Найдём самый популярный счёт
    let mostPopular = null;
    let maxCount = 0;
    for (const [score, count] of Object.entries(scoreMap)) {
        if (count > maxCount) {
            mostPopular = score;
            maxCount = count;
        }
    }
    return mostPopular || null;
}

function calculatePopularScoreTwoRounds(round1Results, round2Results) {
    if (!round1Results || !round2Results) {
        // console.log("⚠️ Нет данных о результатах матчей.");
        return null;
    }
    const allScores = {};

    const processRound = (round) => {
        for (const [rowIndex, row] of Object.entries(round)) {
            if (rowIndex === 'sets') continue;

            for (const [colIndex, score] of Object.entries(row)) {
                if (colIndex === 'sets' || colIndex === 'points') continue;
                if (typeof score !== 'string' || !score.includes(':')) continue;

                const [s1, s2] = score.split(':').map(Number);
                if (isNaN(s1) || isNaN(s2)) continue;

                const normalized = s1 >= s2 ? `${s1}:${s2}` : `${s2}:${s1}`;
                allScores[normalized] = (allScores[normalized] || 0) + 1;
            }
        }
    };

    processRound(round1Results);
    processRound(round2Results);

    let mostPopular = null;
    let maxCount = 0;

    for (const [score, count] of Object.entries(allScores)) {
        if (count > maxCount) {
            mostPopular = score;
            maxCount = count;
        }
    }

    return mostPopular || null;
}

function findMostPopularScore(results) {
    if (!results || Object.keys(results).length === 0) {
        // console.log("⚠️ Нет данных о результатах матчей.");
        return null;
    }

    const scoreCount = {}; // Объект для подсчета встречаемости счетов

    // Перебираем все результаты
    Object.values(results).forEach(matches => {
        Object.entries(matches).forEach(([opponentId, score]) => {
            if (opponentId === "sets" || opponentId === "points") return; // Пропускаем технические поля

            let [score1, score2] = score.split(":").map(Number);
            if (isNaN(score1) || isNaN(score2)) return;

            // Всегда записываем счет в формате "большее:меньшее"
            const normalizedScore = score1 > score2 ? `${score1}:${score2}` : `${score2}:${score1}`;

            scoreCount[normalizedScore] = (scoreCount[normalizedScore] || 0) + 1;
        });
    });

    // Найти самый частый счет
    let mostPopularScore = null;
    let maxCount = 0;

    Object.entries(scoreCount).forEach(([score, count]) => {
        if (count > maxCount) {
            mostPopularScore = score;
            maxCount = count;
        }
    });

    return mostPopularScore || null; // Возвращаем только счет
}



async function fetchTournament(tournamentId) {
    
    try {
        const response = await fetch(`/get-data-tournament?tournamentId=${tournamentId}`);
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to fetch tournament data.');
        }

        if (response.ok) {
            const tournament = await response.json();
            console.log('Tournament data:', tournament);
            return tournament;
        }

    } catch (error) {
      console.error('Error fetching tournament:', error.message);
      showErrorModal(error.message || 'Failed to fetch tournament data.');
      return null;
    }
    
}

function renderPastTournamentResults(tournamentData) {
    const container = document.querySelector(".pastTournament_table_content");
    if (!container) {
        console.error("❌ Элемент .pastTournament_table_content не найден!");
        return;
    }
    container.innerHTML = "";

    const ratedPlayers = tournamentData.players || [];
    const unratedPlayers = tournamentData.unratedPlayers || [];

    const allPlayers = [...ratedPlayers, ...unratedPlayers];

    if (allPlayers.length === 0) {
        console.warn("⚠️ Нет данных для рендеринга завершенного турнира.");
        return;
    }

    const playerStats = allPlayers.map(player => {
        console.log('player', player);
        const city = player.city || player.cityName || "Unknown";
        const ratingBefore = tournamentData.initialRatings?.find(p => p.id === player.id)?.rating ?? 0;
        const ratingAfter = player.rating ?? ratingBefore;
        const ratingChange = (ratingAfter - ratingBefore).toFixed(1);
        const ratingColor = ratingChange > 0 ? "#007026" : ratingChange < 0 ? "#F00" : "#666877";

        const wins = player.wins || 0;
        const losses = player.losses || 0;
        const setsWon = player.setsWon || 0;
        const setsLost = player.setsLost || 0;
        const totalGames = wins + losses;
        const totalSets = setsWon + setsLost;

        return {
            id: player.id,
            place: player.place || 0,
            name: player.name || player.fullname,
            city,
            totalGames,
            wins,
            losses,
            totalSets,
            wonSets: setsWon,
            lostSets: setsLost,
            ratingChange,
            ratingBefore: ratingBefore.toFixed(1),
            ratingAfter: ratingAfter.toFixed(1),
            ratingColor,
            logo: player.logo
        };
    });

    console.log('playerStats', playerStats);
    playerStats.sort((a, b) => a.place - b.place);

    playerStats.forEach(player => {
        const playerDiv = document.createElement("a");
        playerDiv.classList.add("pastTournament_table_player");
        playerDiv.href = `/${window.lang}/allplayers/${player.id || player._id}`;

        playerDiv.innerHTML = `
            <div class="pastTournament_number">${player.place}</div>
            <div class="cell pastTournament_player">
                <div class="playerLogo" style="background-image: url('${player.logo}'); background-position: 50%; background-size: cover; background-repeat: no-repeat;"></div>
                <span>${player.name}</span>
            </div>
            <div class="cell pastTournament_city">${player.city}</div>
            <div class="cell pastTournament_games">${player.totalGames} (${player.wins}-${player.losses})</div>
            <div class="cell pastTournament_sets">${player.totalSets} (${player.wonSets}-${player.lostSets})</div>
            <div class="cell pastTournament_avarage" style="color: ${player.ratingColor}; font-weight: bold;">
                ${player.ratingChange > 0 ? `+${player.ratingChange}` : player.ratingChange}
            </div>
            <div class="cell pastTournament_before">${player.ratingBefore}</div>
            <div class="cell pastTournament_after">${player.ratingAfter}</div>
        `;

        container.appendChild(playerDiv);
    });

    console.log("📊 Завершенный турнир успешно отрендерен!");
}


let ytPlayer = null; // глобальная переменная, чтобы избежать дублирования

function renderTournamentVideo(videoId = null) {
    console.log('📺 videoId =', videoId);
    const container = document.getElementById('recordBlock');
    container.innerHTML = '';

    if (!videoId) {
        const placeholder = document.createElement('div');
        placeholder.className = 'videoPlaceholder';
        placeholder.innerHTML = '🎥 The tournament recording is not yet available.';
        container.appendChild(placeholder);
        return;
    }

    // Контейнер для API-плеера
    const playerDiv = document.createElement('div');
    playerDiv.id = 'youtubePlayer';
    container.appendChild(playerDiv);

    // Кнопка "Смотреть на YouTube"
    const button = document.createElement('button');
    button.className = 'youtubeBtn';
    button.textContent = 'Смотреть на YouTube';
    button.onclick = () => window.open(`https://youtu.be/${videoId}`, '_blank');
    container.appendChild(button);

    // Проверяем, был ли уже инициализирован плеер
    if (typeof YT === 'undefined' || typeof YT.Player === 'undefined') {
        // Ждём, пока API загрузится
        window.onYouTubeIframeAPIReady = () => {
            createYoutubePlayer(videoId);
        };
    } else {
        createYoutubePlayer(videoId);
    }
}

function createYoutubePlayer(videoId) {
    // const isMobile = window.innerWidth <= 768;

    ytPlayer = new YT.Player('youtubePlayer', {
        width: '100%',
        height: '100%',
        videoId: videoId,
        playerVars: {
            rel: 0,
            controls: 1,
            modestbranding: 1,
            disablekb: 1,
            iv_load_policy: 3,
            fs: 1,
            playsinline: 1
        },
        events: {
        onReady: (event) => {
            console.log('✅ YouTube API готов');
            // event.target.playVideo(); // можешь включить автозапуск
        }
    }
  });

    // Пересоздаём плеер при ресайзе (переключение fullscreen)
    // window.addEventListener('resize', () => {
    //     if (!ytPlayer || !ytPlayer.getVideoData) return;
    //     const currentVideo = ytPlayer.getVideoData().video_id;
    //     renderTournamentVideo(currentVideo); // пересоздаём плеер
    // }, { once: true }); // только один раз на смену
}




// function renderTournamentVideo(videoId = null) {
//     const container = document.getElementById('recordBlock');
//     container.innerHTML = '';
  
//     if (!videoId) {
//       const placeholder = document.createElement('div');
//       placeholder.className = 'videoPlaceholder';
//       placeholder.innerHTML = '🎥 The tournament recording is not yet available.';
//       container.appendChild(placeholder);
//       return;
//     }
  
//     const iframe = document.createElement('iframe');
//     iframe.id = 'youtubePlayer';
//     iframe.title = 'Tournament recording';
//     iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen');
//     iframe.setAttribute('allowfullscreen', '');
  
//     const button = document.createElement('button');
//     button.className = 'youtubeBtn';
//     button.textContent = 'Смотреть на YouTube';
//     button.onclick = () => window.open(`https://youtu.be/${videoId}`, '_blank');
  
//     container.appendChild(iframe);
//     container.appendChild(button);
  
//     // 👇 Вставляем src в зависимости от ширины экрана
//     function updatePlayerSrc() {
//         const isMobile = window.innerWidth <= 768;
//         const base = `https://www.youtube.com/embed/${videoId}`;
//         const params = new URLSearchParams({
//             rel: 0,
//             controls: 0,
//             modestbranding: 1,
//             disablekb: 1,
//             iv_load_policy: 3,
//             fs: isMobile ? 1 : 0
//         });
//         iframe.src = `${base}?${params.toString()}`;
//     }
  
//     updatePlayerSrc();
//     window.addEventListener('resize', updatePlayerSrc);
// }
  

function createMediaCard(url, name) {
    const mediaBlock = document.getElementById('mediaBlock');
    const card = document.createElement('div');
    card.classList.add('mediaBlock_card');
    card.innerHTML = `
        <img src="${url}" alt="">
        <span class="nameOfScreenshot">${name}</span>
    `;
    mediaBlock.appendChild(card);
}


