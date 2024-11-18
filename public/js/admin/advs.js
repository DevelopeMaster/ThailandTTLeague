import { listenerOfButtons } from '../modules.js';
import { createHeaderandSidebarForAdmin, getAllAdv } from './adminmodules.js';
document.addEventListener('DOMContentLoaded', () => {
    createHeaderandSidebarForAdmin('manageAdvertisement');
    listenerOfButtons();        
   

    getAllAdv();   

    const newAdvBtn = document.querySelector('#addNewAdvertisement');
    newAdvBtn.addEventListener('click', () => {
        window.location = '/ru/dashboard/admin/editadv/create-new'
    })
});