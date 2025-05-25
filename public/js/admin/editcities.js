import { listenerOfButtons,  getAllTournaments, showErrorModal } from '../versioned-modules.js';
import { createHeaderandSidebarForAdmin } from './adminmodules.js';

document.addEventListener('DOMContentLoaded', async () => {
    createHeaderandSidebarForAdmin('manageCities');
    listenerOfButtons();

    

    await renderCities();

    document.getElementById('citiesTable_content').addEventListener('click', async (event) => {
        const target = event.target;
        const cityId = target.dataset.cityId;
    
        if (target.classList.contains('editCities_city_btns_save')) {
            // Обработка сохранения
            const cityRow = target.closest('.editCities_city');
            const russianName = cityRow.querySelector('.editCities_city_ru').value;
            const englishName = cityRow.querySelector('.editCities_city_en').value;
            const thaiName = cityRow.querySelector('.editCities_city_th').value;
    
            try {
                await fetch(`/api/updatecity/${cityId}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ russian: russianName, english: englishName, thai: thaiName })
                });
                alert('Город успешно обновлен!');
                renderCities();
            } catch (error) {
                console.error('Ошибка при обновлении города:', error);
            }
        } else if (target.classList.contains('editCities_city_btns_cross')) {
            // Обработка удаления
            const isConfirmed = confirm('Вы уверены, что хотите удалить этот город?');
            if (isConfirmed) {
                try {
                    await fetch(`/api/deletecity/${cityId}`, { method: 'DELETE' });
                    target.closest('.editCities_city').remove();
                    alert('Город успешно удален!');
                    renderCities();
                } catch (error) {
                    console.error('Ошибка при удалении города:', error);
                }
            }
            
        }
    });

    document.getElementById('addNewCity').addEventListener('click', async () => {
        const cityRu = document.getElementById('cityRu').value.trim();
        const cityEn = document.getElementById('cityEn').value.trim();
        const cityTh = document.getElementById('cityTh').value.trim();
    
        document.getElementById('cityRu').style.borderColor = '';
        document.getElementById('cityEn').style.borderColor = '';
        document.getElementById('cityTh').style.borderColor = '';

        if (!cityRu || !cityEn || !cityTh) {
            if (!cityRu) document.getElementById('cityRu').style.border = '1px solid red';
            if (!cityEn) document.getElementById('cityEn').style.border = '1px solid red';
            if (!cityTh) document.getElementById('cityTh').style.border = '1px solid red';
            alert('Пожалуйста, заполните все поля');
            return;
        }
    
        // Отправка данных на сервер
        try {
            const response = await fetch('/api/addnewcity', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ russian: cityRu, english: cityEn, thai: cityTh })
            });
    
            if (response.ok) {
                alert('Город успешно добавлен!');
                document.getElementById('cityRu').value = '';
                document.getElementById('cityEn').value = '';
                document.getElementById('cityTh').value = '';
                renderCities(); // Обновление списка городов
            } else {
                alert('Ошибка при добавлении города');
            }
        } catch (error) {
            console.error('Ошибка при отправке данных на сервер:', error);
        }
    });
    
    
});


async function renderCities() {
    try {
        const response = await fetch('/allcities');
        const cities = await response.json();
        
        // cities.sort((a, b) => a.russian.localeCompare(b.russian));
        cities.sort((a, b) => {
            const aHasRussian = !!a.russian;
            const bHasRussian = !!b.russian;
        
            if (!aHasRussian && !bHasRussian) {
                // Если у обоих городов нет русского названия, сортируем по английскому названию
                return a.english.localeCompare(b.english);
            }
        
            if (!aHasRussian) return -1; // Город без русского названия в начало
            if (!bHasRussian) return 1;  // Город с русским названием после
        
            // Сортировка по русскому названию
            return a.russian.localeCompare(b.russian);
        });
        
        const citiesTableContent = document.getElementById('citiesTable_content');
        citiesTableContent.innerHTML = ''; // Очистка перед добавлением новых данных

        cities.forEach(city => {
            const cityRow = document.createElement('div');
            cityRow.classList.add('editCities_city');

            const ruClass = city.russian ? '' : 'input-error';
            const enClass = city.english ? '' : 'input-error';
            const thClass = city.thai ? '' : 'input-error';
        
            cityRow.innerHTML = `
                <div class="editCities_city_inputs">
                    <input class="editCities_city_ru ${ruClass}" type="text" placeholder="${city.russian || 'Город на русском'}" value="${city.russian || ''}">
                    <input class="editCities_city_en ${enClass}" type="text" placeholder="${city.english || 'Город на английском'}" value="${city.english || ''}">
                    <input class="editCities_city_th ${thClass}" type="text" placeholder="${city.thai || 'Город на тайском'}" value="${city.thai || ''}">
                </div>
                <div class="editCities_city_btns">
                    <div class="editCities_city_btns_save" data-city-id="${city._id}" style="background-image: url('/icons/save.svg'); background-repeat: no-repeat;"></div>
                    <div class="editCities_city_btns_cross" data-city-id="${city._id}" style="background-image: url('/icons/cross.svg'); background-repeat: no-repeat;"></div>
                </div>
            `;

            citiesTableContent.appendChild(cityRow);
        });
    } catch (error) {
        console.error('Ошибка при загрузке данных городов:', error);
    }
}