const express = require('express');
const router = express.Router();
const { ObjectId } = require('mongodb');
// require('dotenv').config();
const { getDB } = require('../db');
// const { ensureAuthenticated } = require('../server');
const { ensureAuthenticated, upload } = require('../middlewares/uploadConfig');


router.post('/savePlayerProfile', ensureAuthenticated, upload.fields([
    { name: 'userLogo', maxCount: 1 }
  ]), async (req, res) => {
    console.log('Received files:', req.files);
    console.log('Received body:', req.body);
  
    try {
        const db = getDB();
        const userId = new ObjectId(req.body.userId);
        // console.log(userId);
        
        const currentUserData = await db.collection('users').findOne({ _id: userId });
        if (!currentUserData) {
            return res.status(404).send('User not found');
        }
        // console.log(currentUserData);
        const updates = {};
  
        // Обновление логотипа (если новый логотип был загружен)
        if (req.files['userLogo']) {
            const logoPath = `/icons/playerslogo/${req.files['userLogo'][0].filename}`;
            if (currentUserData.logo !== logoPath) {
                updates.logo = logoPath;
            }
        }
  
        if ((req.body.name && req.body.name !== currentUserData.name) || (req.body.fullname && req.body.fullname !== currentUserData.name)) {
            updates.fullname = req.body.name || req.body.fullname;
        }
  
        if (req.body.cityName && req.body.cityName !== currentUserData.cityName) {
            const city = await db.collection('cities').findOne({
                $or: [
                    { english: req.body.cityName },
                    { russian: req.body.cityName },
                    { thai: req.body.cityName }
                ]
            });
  
            if (city) {
                const cityId = city._id;
                console.log(new ObjectId(cityId));
                updates.city = new ObjectId(cityId);
            } else {
                return res.status(400).send('City not found');
            }
        }
  
        if (req.body.coach && req.body.coach !== currentUserData.coach) {
            updates.coach = req.body.coach;
        }
  
        if (req.body.birthdayDate && req.body.birthdayDate !== currentUserData.birthdayDate) {
            updates.birthdayDate = req.body.birthdayDate;
        }
  
        if (req.body.email && req.body.email !== currentUserData.email) {
            updates.email = req.body.email;
        }
  
        if (req.body.phoneNumber && req.body.phoneNumber !== currentUserData.phoneNumber) {
            updates.phoneNumber = req.body.phoneNumber;
        }
  
        if (req.body.hand && req.body.hand !== currentUserData.hand) {
            updates.hand = req.body.hand;
        }
  
        if (req.body.description && req.body.description !== currentUserData.description) {
            updates.description = req.body.description;
        }
  
        if (req.body.blade && req.body.blade !== currentUserData.blade) {
            updates.blade = req.body.blade;
        }
  
        if (req.body.forehandRubber && req.body.forehandRubber !== currentUserData.forehandRubber) {
            updates.forehandRubber = req.body.forehandRubber;
        }
  
        if (req.body.backhandRubber && req.body.backhandRubber !== currentUserData.backhandRubber) {
            updates.backhandRubber = req.body.backhandRubber;
        }
  
        if (req.body.description && req.body.description !== currentUserData.description) {
            updates.description = req.body.description;
        }
  
        if (Object.keys(updates).length > 0) {
            await db.collection('users').updateOne(
                { _id: userId },
                { $set: updates }
            );
            console.log(`Игрок ${userId} успешно обновлен`);
        } else {
            console.log(`Нет изменений для обновления пользователя ${userId}`);
        }

        if (updates.logo) {
            localStorage.setItem('userLogo', updates.logo);
        }
  
        res.json({
          success: true,
          logoUrl: updates.logo || '/icons/playerslogo/default_avatar.svg', 
          redirectUrl: `/en/dashboard/user/${userId}` 
        });
    } catch (error) {
        console.error('Ошибка при сохранении профиля пользователя:', error);
        res.status(500).send('Internal Server Error');
    }
  });



router.post('/saveClubProfile', ensureAuthenticated, upload.fields([
    { name: 'logo', maxCount: 1 },
    { name: 'photos', maxCount: 4 }
  ]), async (req, res) => {
    console.log('Received files:', req.files);
    console.log('Received body:', req.body);
    // Ваш код здесь
  // });
  
  // app.post('/saveClubProfile', ensureAuthenticated, upload.single('logo'), async (req, res) => {
    try {
        // console.log('запрос получен', req.body);
        const db = getDB();
        const clubId = new ObjectId(req.body.userId);
        console.log(clubId);
        // Получение текущих данных клуба
        const currentClubData = await db.collection('clubs').findOne({ _id: clubId });
        if (!currentClubData) {
            return res.status(404).send('Club not found');
        }
        console.log(currentClubData);
        // Объект для хранения изменений
        const updates = {};
  
  
        // Обновление логотипа (если новый логотип был загружен)
        if (req.files['logo']) {
            const logoPath = `/icons/clubslogo/${req.files['logo'][0].filename}`;
            if (currentClubData.logo !== logoPath) {
                updates.logo = logoPath;
            }
        }
  
        if (req.files['photos']) {
            const currentPhotos = currentClubData.photos || []; // Загрузить текущие фотографии клуба из базы данных
            const updatedPhotos = [...currentPhotos]; // Создаем копию текущего массива фотографий
        
            const photoPaths = req.files['photos'].map(file => `/icons/clubsphotos/${file.filename}`);
            const photoIndex = req.body.photoIndex; // Получаем индекс фотографии, которую нужно заменить
        
            // Заменяем только ту фотографию, которая была изменена
            if (photoIndex !== undefined && photoIndex < updatedPhotos.length) {
                updatedPhotos[photoIndex] = photoPaths[0]; // Меняем фотографию по индексу
            }
        
            updates.photos = updatedPhotos; // Обновляем фотографии в данных клуба
        }
  
        if (req.body.workingHours && req.body.workingHours !== currentClubData.workingHours) {
            updates.workingHours = req.body.workingHours;
        }
  
        if (req.body.numberOfTables && Number(req.body.numberOfTables) !== currentClubData.tables) {
            updates.tables = Number(req.body.numberOfTables);
        }
  
        if (req.body.phoneNumber && req.body.phoneNumber !== currentClubData.phoneNumber) {
            updates.phoneNumber = req.body.phoneNumber;
        }
  
        if (req.body.website && req.body.website !== currentClubData.website) {
            updates.website = req.body.website;
        }
  
        if (req.body.freeServices) {
            const newFreeServices = req.body.freeServices.split(',').map(item => item.trim());
            const currentFreeServices = currentClubData.supplements.free || [];
        
            // Сравниваем новые и текущие значения
            if (JSON.stringify(newFreeServices) !== JSON.stringify(currentFreeServices)) {
                updates['supplements.free'] = newFreeServices;
            }
        }
        
        // Обработка массива платных услуг
        if (req.body.paidServices) {
            // Преобразуем строку с новыми значениями в массив
            const newPaidServices = req.body.paidServices.split(',').map(item => item.trim());
            const currentPaidServices = currentClubData.supplements.paid || [];
        
            // Сравниваем новые и текущие значения
            if (JSON.stringify(newPaidServices) !== JSON.stringify(currentPaidServices)) {
                updates['supplements.paid'] = newPaidServices;
            }
            // console.log('Новые платные услуги:', newPaidServices);
        }
  
        // Обновление данных в базе, если есть изменения
        if (Object.keys(updates).length > 0) {
            await db.collection('clubs').updateOne(
                { _id: clubId },
                { $set: updates }
            );
            console.log(`Клуб ${clubId} успешно обновлен`);
        } else {
            console.log(`Нет изменений для обновления ${clubId}`);
        }
  
        // Перенаправление после успешного обновления
        let link = `/en/dashboard/club/${clubId}`;
        res.redirect(link);
    } catch (error) {
        console.error('Ошибка при сохранении профиля клуба:', error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;