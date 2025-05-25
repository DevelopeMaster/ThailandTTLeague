import { listenerOfButtons } from '../versioned-modules.js';
import { createHeaderandSidebarForAdmin, getAllClubs } from './adminmodules.js';
document.addEventListener('DOMContentLoaded', () => {
    createHeaderandSidebarForAdmin('manageAllClubs');
    listenerOfButtons();        
   

    getAllClubs();   

});