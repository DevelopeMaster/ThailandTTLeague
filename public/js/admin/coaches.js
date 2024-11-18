import { listenerOfButtons } from '../modules.js';
import { createHeaderandSidebarForAdmin, getAllCoaches } from './adminmodules.js';
document.addEventListener('DOMContentLoaded', () => {
    createHeaderandSidebarForAdmin('manageAllCoaches');
    listenerOfButtons();        
   

    getAllCoaches();  

    // const newAdvBtn = document.querySelector('#addNewAdvertisement');
    // newAdvBtn.addEventListener('click', () => {
    //     window.location = '/ru/dashboard/admin/editadv/create-new'
    // })
});