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
  
// export fetchAdvertisements;
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

// export fetchCities;