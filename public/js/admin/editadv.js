import { listenerOfButtons, showErrorModal } from '../modules.js';
import { createHeaderandSidebarForAdmin, getAllAdv } from './adminmodules.js';
document.addEventListener('DOMContentLoaded', async () => {
    createHeaderandSidebarForAdmin('manageAdvertisement');
    listenerOfButtons();        
   

    const advId = document.querySelector('.editAdv').dataset.advid;
    let advdata;

    console.log(advId);
    if (advId !== 'create-new') {
        await fetchAdvertisements();
    } else if (advId === 'create-new') {
        const saveDelBlock = document.querySelector('#saveDelBlock');
        saveDelBlock.innerHTML = '';
        saveDelBlock.innerHTML = `
            <button type="submit" id="editAdv_formContainer_submit" class="header_btn-sign editclub_formContainer_submit">Создать</button>
        `;

        document.getElementById('editAdv_formContainer_submit').addEventListener('click', function(event) {
            event.preventDefault();
            saveAdvData('create');
        });
    };

    

    async function fetchAdvertisements() {
        try {
            const response = await fetch(`/get-data-adv?advId=${advId}`);
            if (!response.ok) {
                throw new Error('Adv not found');
            }
            advdata = await response.json();
            
            // console.log(advdata);
            renderAdvData();
        } catch (error) {
            console.error('Error fetching adv data:', error);
        }
    }


    function renderAdvData() {
        console.log(advdata);

        if(advdata.image) {
            document.querySelector('#advLogo').src = advdata.image;
        }

        if(advdata.customer) {
            document.querySelector('#customer').value = advdata.customer;
        }

        if(advdata.link) {
            document.querySelector('#link').value = advdata.link;
        }

        if(advdata.expire) {
            // const date = new Date(advdata.expire);

            // const formattedDate = date.toLocaleDateString('ru-RU', {
            //     day: '2-digit',
            //     month: '2-digit',
            //     year: 'numeric'
            // });

            // document.querySelector('#expire').value = formattedDate;

            const date = new Date(advdata.expire);

            const day = String(date.getUTCDate()).padStart(2, '0');
            const month = String(date.getUTCMonth() + 1).padStart(2, '0'); 
            const year = date.getUTCFullYear();
            
            const formattedDate = `${day}.${month}.${year}`;
            document.querySelector('#expire').value = formattedDate;
        }

        if(advdata.gold) {
            document.querySelector('#gold').checked = true;
        }

        const banner = document.getElementById('banner');
        const logoPreview = document.getElementById('advLogo');

        banner.addEventListener('change', function(event) {
            const file = event.target.files[0];
        
            if (file && file.type.startsWith('image/')) {
                if (file.size > 1 * 1024 * 1024) {
                    showErrorModal(`Файл слишком большой. Максимальный размер: 1 MB`);
                    banner.value = ''; 
                    return;
                }
                const reader = new FileReader();
                reader.onload = function(e) {
                    logoPreview.src = e.target.result;
                };
        
                reader.readAsDataURL(file);
            } else {
                showErrorModal(`Пожалуйста, выберите корректный файл изображения`);
                banner.value = '';
            }
        });

        document.getElementById('editAdv_formContainer_submit').addEventListener('click', function(event) {
            event.preventDefault();
            saveAdvData();
        });
    
        document.getElementById('deleteAdvBtn').addEventListener('click', async function () {
            const isConfirmed = confirm(`Вы уверены что хотите удалить рекламу ${advdata.customer}?`);
            
            if (isConfirmed) {
                await deleteAdv();
            }
        });
    }


    async function saveAdvData(descr) {
        try {
            const formData = new FormData();
            
            formData.append('customer', document.getElementById('customer').value);
            formData.append('link', document.getElementById('link').value);
            const expireDate = document.getElementById('expire').value;
            if (/^\d{2}\.\d{2}\.\d{4}$/.test(expireDate)) {
                const [day, month, year] = expireDate.split('.');
                // const dateToSave = new Date(`${year}-${month}-${day}T23:59:00Z`);
                const dateToSave = new Date(Date.UTC(year, month - 1, day, 23, 59, 59));
                formData.append('expire', dateToSave.toISOString());
            } else {
                console.error('Неверный формат даты. Ожидается формат dd.mm.yyyy');
            }
            formData.append('advId', advId);

            const banner = document.getElementById('banner');

            if (banner.files[0]) {
                formData.append('banner', banner.files[0]);
            }

            if (document.querySelector('#gold').checked) {
                formData.append('gold', true);
            } else {
                formData.append('gold', false);
            }

            let response;

            if (descr === 'create') {
                response = await fetch(`/api/createAdv`, {
                    method: 'POST',
                    body: formData
                });
            } else {
                response = await fetch(`/api/saveAdvProfile`, {
                    method: 'POST',
                    body: formData
                });
        
            }

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to save adv data');
            }

            if (response.url) {                
                window.location.href = response.url;
            }
        
        } catch (error) {
            console.error('Error saving adv data:', error.message);
            showErrorModal(error.message);
        }

    }

    async function deleteAdv() {
        try {
            const response = await fetch(`/api/deleteAdv/${advId}`, {
                method: 'DELETE'
            });
    
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to delete advertisement');
            }
    
            const data = await response.json();
            if (data.success) {
                window.location.href = '/ru/dashboard/admin/adv';
            } else {
                throw new Error(data.error || 'Failed to delete adv');
            }
        } catch (error) {
            console.error('Error deleting adv:', error.message);
            showErrorModal(error.message);
        }
    }

    




});