import { listenerOfButtons, showErrorModal } from '../modules.js';
import { createHeaderandSidebarForAdmin } from './adminmodules.js';

document.addEventListener('DOMContentLoaded', async () => {
    createHeaderandSidebarForAdmin('manageClubApplications');
    listenerOfButtons();

    let allClubsRequests;

    async function fetchClubReauestsData() {
        try {
            const response = await fetch(`/clubsrequest`);
            if (!response.ok) {
                throw new Error('Club requests not found');
            }
            allClubsRequests = await response.json();
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
            item.href = `/ru/dashboard/admin/createclub/${request._id}`;
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
                    <span>${request.clubname || request.name}</span>
                </div>
                <div class="cell club_city" style="width: 140px">${request.city}</div>
                <div class="cell club_city">${formattedDate}</div>
            `;
            container.appendChild(item);
        });
    }
    await fetchClubReauestsData();
    displayClubsRequests(allClubsRequests)



});