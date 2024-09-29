import { listenerOfButtons } from '../modules.js';
import { getAllPlayers, createHeaderandSidebarForAdmin } from './adminmodules.js';
document.addEventListener('DOMContentLoaded', () => {
    createHeaderandSidebarForAdmin('manageAllPlayers');
    listenerOfButtons();        
   

        

    getAllPlayers();

});


