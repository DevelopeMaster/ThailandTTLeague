import { listenerOfButtons,  getAllTournaments, showErrorModal } from '../modules.js';
import { createHeaderandSidebarForAdmin } from './adminmodules.js';

document.addEventListener('DOMContentLoaded', async () => {
    createHeaderandSidebarForAdmin('manageAllTournaments');
    listenerOfButtons();

    getAllTournaments('admin');
});