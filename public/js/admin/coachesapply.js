import { listenerOfButtons, showErrorModal } from '../modules.js';
import { createHeaderandSidebarForAdmin } from './adminmodules.js';

document.addEventListener('DOMContentLoaded', async () => {
    createHeaderandSidebarForAdmin('manageCoachApplications');
    listenerOfButtons();

    let allCoachesRequests;

    async function fetchClubReauestsData() {
        try {
            const response = await fetch(`/coachesrequest`);
            if (!response.ok) {
                throw new Error('Club requests not found');
            }
            allCoachesRequests = await response.json();
            // console.log(player);
            // playerCity = await getCityName(player.city);
            // console.log(allClubsRequests);

            // console.log('id клуба', clubId);
            // await fetchClubData();
            // renderPlayerData();
        } catch (error) {
            console.error('Error fetching player data:', error);
        }
    }

    async function displayClubsRequests(requests) {
        const container = document.querySelector('.clubsRequestsTable_content');
        container.innerHTML = '';
    
        // Сортировка заявок по дате: от новых к старым
        requests.sort((a, b) => new Date(b.requestDate) - new Date(a.requestDate));
    
        requests.forEach((request, i) => {
            const item = document.createElement('a');
            // item.href = `/ru/dashboard/admin/createclub/${request._id}`;
            item.href = '#';
            item.style = 'padding: 15px 20px';
            item.classList.add('clubsTable_club');
    
            const date = new Date(request.requestDate);
            const formattedDate = date.toLocaleDateString('ru-RU', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
            });
    
            item.innerHTML = `
                <div class="cell club_club" style="width: 250px">
                    <div class="clubLogo" style="background-image: url('/icons/check-circle.svg'); border: none; background-position: 50% center; background-size: cover; background-repeat: no-repeat;"></div>
                    <span class="fullName">${request.name || 'Имя не указано'}</span>
                </div>
                <div class="cell club_city" style="width: 220px">${request.phone || 'Номер не указан'}</div>
                <div class="cell club_city">${formattedDate}</div>
                <div class="additionalInfo" style="display: none; position: absolute; top: 55px; left: 20px;">
                    <div class="club_city" style="font-size: 12px; display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 3; overflow: hidden; text-overflow: ellipsis;">${request.info || 'Информация не указана'}</div>
                    <a href="${request.profileLink || "#"}" class="cell club_city" style="font-size: 12px; display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 1; overflow: hidden; text-overflow: ellipsis;">${request.profileLink || 'Без ссылки'}</a>
                </div>
                <div class="buttonsTopWrapp" style="display: none; position: absolute; bottom: 20px; top: auto; right: 20px;">
                    <a id="deleteCoachRequestBtn" class="deletePlayer" href="#">удалить</a>
                    <button type="submit" id="copyInfo" class="header_btn-sign editclub_formContainer_submit" style="width: 250px">Перейти к пользователю</button>
                </div>
                
            `;

            item.addEventListener('click', (e) => {
                e.preventDefault();
        
                // Закрываем все другие элементы
                document.querySelectorAll('.clubsTable_club').forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.style.paddingBottom = '15px';
                        const otherAdditionalInfo = otherItem.querySelector('.additionalInfo');
                        if (otherAdditionalInfo) {
                            otherAdditionalInfo.style.display = 'none'; 
                        }
                        const otherBtns = otherItem.querySelector('.buttonsTopWrapp');
                        if (otherBtns) {
                            otherBtns.style.display = 'none';
                        }
                    }
                });
        
                // Переключение padding-bottom на 150px
                if (item.style.paddingBottom === '150px') {
                    item.style.paddingBottom = '15px'; // Сбрасываем, если уже открыто
                } else {
                    item.style.paddingBottom = '150px';
                }
        
                // Переключение стиля display у additionalInfo
                const additionalInfo = item.querySelector('.additionalInfo');
                if (additionalInfo.style.display === 'block') {
                    additionalInfo.style.display = 'none';
                } else {
                    additionalInfo.style.display = 'block';
                }

                const btns = item.querySelector('.buttonsTopWrapp');
                if (btns.style.display === 'flex') {
                    btns.style.display = 'none'; 
                } else {
                    btns.style.display = 'flex';
                }
            });

            // Кнопка для копирования имени
            item.querySelector('#copyInfo').addEventListener('click', (e) => {
                e.stopPropagation();
                e.preventDefault();
                const playerInfo = item.querySelector('.additionalInfo').textContent;
                navigator.clipboard.writeText(playerInfo).then(() => {
                    alert('Информация о пользователе скопирована');
                    window.location.href = `/ru/dashboard/admin/edit/${request.playerId}`;
                }).catch(err => {
                    console.error('Ошибка при копировании информации или пользователь не найден', err);
                });
                
            });

            // Кнопка для удаления записи
            item.querySelector('#deleteCoachRequestBtn').addEventListener('click', async (e) => {
                e.preventDefault();
                e.stopPropagation();

                const confirmation = confirm('Вы уверены, что хотите удалить эту запись?');
                if (confirmation) {
                    try {
                        const response = await fetch(`/api/deleteRequestCoach/${request._id}`, {
                            method: 'DELETE',
                        });

                        if (response.ok) {
                            alert('Запись успешно удалена');
                            item.remove(); // Удаляем элемент из DOM
                        } else {
                            throw new Error('Не удалось удалить запись');
                        }
                    } catch (error) {
                        console.error('Ошибка при удалении записи:', error);
                        alert('Ошибка при удалении записи');
                    }
                }
            });
            container.appendChild(item);
        });
    }
    await fetchClubReauestsData();
    console.log(allCoachesRequests);
    displayClubsRequests(allCoachesRequests)



});