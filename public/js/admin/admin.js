import { listenerOfButtons } from '../versioned-modules.js';
import { getAllPlayers, createHeaderandSidebarForAdmin } from './adminmodules.js';
document.addEventListener('DOMContentLoaded', () => {
    createHeaderandSidebarForAdmin('manageAllPlayers');
    listenerOfButtons();        
   

        

    getAllPlayers();

});


