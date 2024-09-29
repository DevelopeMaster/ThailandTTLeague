import { listenerOfButtons } from '../modules.js';
import { createHeaderandSidebarForAdmin, getAllClubs } from './adminmodules.js';
document.addEventListener('DOMContentLoaded', () => {
    createHeaderandSidebarForAdmin('manageAllClubs');
    listenerOfButtons();        
   

    getAllClubs();   

});