const express = require('express');
const router = express.Router();
require('dotenv').config();
const { ObjectId } = require('mongodb');
const { body, validationResult } = require('express-validator');
const nodemailer = require('nodemailer');
const { getDB } = require('../db');
const path = require('path');
const { ensureAuthenticated, deleteFile, ensureAuthenticatedOrAdmin, ensureAdmin, upload } = require('../middlewares/uploadConfig');
// const Player = require('../models/player');
// const mongoose = require('mongoose');

const notificateEmail = process.env.NOTIFICATE_EMAIL;
const notificatePass = process.env.NOTIFICATE_PASSWORD;





//--------------EDIT PROFILES ----------//

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

        if (req.body.rating && req.body.rating !== currentUserData.rating) {
            updates.rating = req.body.rating;
        }
  
        // if (req.body.description && req.body.description !== currentUserData.description) {
        //     updates.description = req.body.description;
        // }
  
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

        if (req.body.descriptioneng && req.body.descriptioneng !== currentUserData.descriptioneng) {
            updates.descriptioneng = req.body.descriptioneng;
        }

        if (req.body.descriptionthai && req.body.descriptionthai !== currentUserData.descriptionthai) {
            updates.descriptionthai = req.body.descriptionthai;
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
    // console.log('Received body:', req.body);
    // Ваш код здесь
  // });
  
  // app.post('/saveClubProfile', ensureAuthenticated, upload.single('logo'), async (req, res) => {
    try {
        console.log('запрос получен', req.body);
        const db = getDB();
        const clubId = new ObjectId(req.body.userId);
        // console.log(clubId);
        // Получение текущих данных клуба
        const currentClubData = await db.collection('clubs').findOne({ _id: clubId });
        if (!currentClubData) {
            return res.status(404).send('Club not found');
        }
        // console.log(currentClubData);
        // Объект для хранения изменений
        const updates = {};
  
  
        // Обновление логотипа (если новый логотип был загружен)
        if (req.files['logo']) {
            const logoPath = `/icons/clubslogo/${req.files['logo'][0].filename}`;
            if (currentClubData.logo !== logoPath) {
                updates.logo = logoPath;
            }
        }
  
        // if (req.files['photos']) {
        //     const currentPhotos = currentClubData.photos || [];
        //     const updatedPhotos = [...currentPhotos];
        
        //     const photoPaths = req.files['photos'].map(file => `/icons/clubsphotos/${file.filename}`);
        //     const photoIndex = req.body.photoIndex;
        //     console.log(req.body.photoIndex);
        //     // Заменяем только ту фотографию, которая была изменена
        //     if (photoIndex !== undefined && photoIndex < updatedPhotos.length) {
        //         updatedPhotos[photoIndex] = photoPaths[0];
        //     }
        
        //     updates.photos = updatedPhotos;
        // }

        if (req.files['photos']) {
            const currentPhotos = currentClubData.photos || []; // Получаем текущие фото или создаем пустой массив
            const updatedPhotos = [...currentPhotos]; // Копируем текущие фото для дальнейшего обновления
        
            // Массив с путями новых фотографий
            const photoPaths = req.files['photos'].map(file => `/icons/clubsphotos/${file.filename}`);
        
            // Если передан индекс фотографии
            const photoIndex = parseInt(req.body.photoIndex, 10);
        
            if (!isNaN(photoIndex) && photoIndex >= 0 && photoIndex < updatedPhotos.length) {
                // Если индекс существует и валиден, заменяем фото по указанному индексу
                updatedPhotos[photoIndex] = photoPaths[0];
            } else {
                // Если индекс отсутствует или некорректен, добавляем новые фото в конец массива
                updatedPhotos.push(...photoPaths);
            }
        
            // Обновляем объект `updates`, который потом будет сохранен в базе данных
            updates.photos = updatedPhotos;
        }
        
  
        if (req.body.name && req.body.name !== currentClubData.name) {
            updates.name = req.body.name;
        }

        if (req.body.representative && req.body.representative !== currentClubData.representative) {
            updates.representative = req.body.representative;
        }

        // if (req.body.location && req.body.location !== currentClubData.location) {
        //     updates.location = req.body.location;
        // }

        let location = req.body.location ? JSON.parse(req.body.location) : null;

        if (Array.isArray(location) && location.length === 2 && location.every(num => typeof num === 'number')) {
            updates.location = location;
        }

        if (req.body.workingHours && req.body.workingHours !== currentClubData.workingHours) {
            updates.workingHours = req.body.workingHours;
        }

        const tables = Number(req.body.tables);
        if (!isNaN(tables) && tables !== currentClubData.tables) {
            updates.tables = tables; // Обновляем, если значение отличается
        }
  
        if (req.body.phoneNumber && req.body.phoneNumber !== currentClubData.phoneNumber) {
            updates.phoneNumber = req.body.phoneNumber;
        }
  
        if (req.body.website && req.body.website !== currentClubData.website) {
            updates.website = req.body.website;
        }

        if (req.body.city && req.body.city !== currentClubData.city) {
            const city = await db.collection('cities').findOne({
                $or: [
                    { english: req.body.city },
                    { russian: req.body.city },
                    { thai: req.body.city }
                ]
            });
  
            if (city) {
                const cityId = city._id;
                // console.log(new ObjectId(cityId));
                updates.city = new ObjectId(cityId);
            } else {
                return res.status(400).send('City not found');
            }
        }

        // Проверка и обновление адреса
        if (req.body.address || req.body.addresseng || req.body.addressthai) {
            const newAddress = {
                ru: req.body.address || currentClubData.address.ru,
                en: req.body.addresseng || currentClubData.address.en,
                th: req.body.addressthai || currentClubData.address.th
            };

            if (newAddress.ru !== currentClubData.address.ru || 
                newAddress.en !== currentClubData.address.en || 
                newAddress.th !== currentClubData.address.th) {
                updates.address = newAddress; // Обновляем адрес, если есть изменения
            }
        }

        if (req.body.info || req.body.infoeng || req.body.infothai) {
            const newInfo = {
                ru: req.body.info || currentClubData.info.ru,
                en: req.body.infoeng || currentClubData.info.en,
                th: req.body.infothai || currentClubData.info.th
            };

            if (newInfo.ru !== currentClubData.info.ru || 
                newInfo.en !== currentClubData.info.en || 
                newInfo.th !== currentClubData.info.th) {
                updates.info = newInfo; // Обновляем адрес, если есть изменения
            }
        }
  
        if (!currentClubData.supplements) {
            currentClubData.supplements = {}; // Создаем объект supplements
        }
        
        // Обработка бесплатных услуг (freeServices)
        if (req.body.freeServices) {
            const newFreeServices = req.body.freeServices.split(',').map(item => item.trim());
            const currentFreeServices = currentClubData.supplements.free || [];
        
            // Сравниваем новые и текущие значения
            if (JSON.stringify(newFreeServices) !== JSON.stringify(currentFreeServices)) {
                updates['supplements.free'] = newFreeServices;
            }
        }
        
        // Обработка платных услуг (paidServices)
        if (req.body.paidServices) {
            const newPaidServices = req.body.paidServices.split(',').map(item => item.trim());
            const currentPaidServices = currentClubData.supplements.paid || [];
        
            // Сравниваем новые и текущие значения
            if (JSON.stringify(newPaidServices) !== JSON.stringify(currentPaidServices)) {
                updates['supplements.paid'] = newPaidServices;
            }
        }
        
  
        console.log(updates);
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
        let link;
        if (req.user.role === 'admin') {
            link = `/ru/dashboard/admin/clubs`;
        } else {
            link = `/${req.body.lang}/dashboard/club/${clubId}`;
        }
        // let link = `/en/dashboard/club/${clubId}`;

        // let link = `/ru/dashboard/admin/clubs`;
        
        res.redirect(link);
    } catch (error) {
        console.error('Ошибка при сохранении профиля клуба:', error);
        res.status(500).send('Internal Server Error');
    }
});


//-------------- FORMS FOR APPLY ----------//

router.post('/applyCoach', [
// Валидация данных
    body('name').notEmpty().withMessage('Name is required'),
    body('phone').notEmpty().withMessage('Phone number is required'),
    body('location').notEmpty().withMessage('Location is required')
    ],    
    async function(req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
        return res.status(400).json({ status: 'error', errors: errors.array() });
        }
        const { name, phone, requestDate, profileLink, info, policy } = req.body;
        if (!name || !phone || !requestDate || !policy ) {
        res.status(400).json({ error: 'Something wrong. Please renew page and try again' });
        return;
        }

        try {
        const db = getDB();
        await db.collection('requestfromcoach')
            .insertOne({ name, phone, requestDate, profileLink, info, policy });
        console.log("Заявка успешно отправлена");

        // Отправка email
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
            user: notificateEmail,
            pass: notificatePass
            }
        });

        const mailOptions = {
            from: notificateEmail,
            to: 'ogarsanya@gmail.com', // получатель ------------------------- ЗАМЕНИТЬ
            subject: 'New Coach Application',
            text: `
            A new coach application has been received:
            Name: ${name}
            Phone: ${phone}
            Date: ${new Date(requestDate).toLocaleString()}
            Profile Link: ${profileLink}
            Info: ${info}
            Policy: 'Agreed'
            `
            // Policy: ${policy ? 'Agreed' : 'Not agreed'}
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
            console.error('Error sending email:', error);
            } else {
            console.log('Email sent:', info.response);
            }
        });

        res.status(200).json({ status: 'success', message: 'Request has been sent' });
        } catch (err) {
        console.error('Ошибка при отправке заявки:', err);
        res.status(500).json({ status: 'error', error: 'Registration error. Please try again.' });
        
        }
    }
);

router.post('/addApplicationClub', [
  // Валидация данных
    body('name').notEmpty().withMessage('Name is required'),
    body('phone').notEmpty().withMessage('Phone number is required'),
    body('city').notEmpty().withMessage('City is required'),
    body('address').notEmpty().withMessage('Address is required'),
    body('clubname').notEmpty().withMessage('clubname is required'),
    body('qtytable').notEmpty().withMessage('Quantity tables is required')
  ],    
  async function(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ status: 'error', errors: errors.array() });
    }
    const { name, phone, requestDate, city, address, clubname, qtytable, infotournaments, info, policy } = req.body;
    if (!name || !phone || !requestDate || !policy || !city || !address || !clubname || !qtytable ) {
      console.log('данные не дошли до сервера');
      res.status(400).json({ error: 'Something wrong. Please renew page and try again' });
      return;
    }

    try {
      const db = getDB();
      await db.collection('requestfromclub')
        .insertOne({ name, phone, requestDate, city, address, clubname, qtytable, infotournaments, info, policy });
      console.log("Заявка успешно отправлена");

      // Отправка email
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: notificateEmail,
          pass: notificatePass
        }
      });

      const mailOptions = {
        from: notificateEmail,
        to: 'ogarsanya@gmail.com', // получатель ------------------------- ЗАМЕНИТЬ
        subject: 'New Club Application',
        text: `
          A new club application has been received:
          Name: ${name}
          Phone: ${phone}
          Date: ${new Date(requestDate).toLocaleString()}
            city, address, clubname, qtytable, infotournaments, info,
          City: ${city}
          Address: ${address}
          Clubname: ${clubname}
          Quantity table: ${qtytable}
          Info about tournaments: ${infotournaments}
          Info about club: ${info}
          Policy: 'Agreed'
        `
        // Policy: ${policy ? 'Agreed' : 'Not agreed'}
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error('Error sending email:', error);
        } else {
          console.log('Email sent:', info.response);
        }
      });

      res.status(200).json({ status: 'success', message: 'Request has been sent' });
    } catch (err) {
      console.error('Ошибка при отправке заявки:', err);
      res.status(500).json({ status: 'error', error: 'Registration error. Please try again.' });
      
    }
});




//---------------------------ADMIN EDIT PROFILES-----------------------//

router.delete('/deletePlayer/:id', async (req, res) => {
    const playerId = req.params.id;

    try {
        // Проверка формата ID, если необходимо
        if (!ObjectId.isValid(playerId)) {
            return res.status(400).json({ success: false, error: 'Invalid ID format' });
        }
        const db = getDB();
        // Удаление игрока из коллекции 'players'
        const result = await db.collection('users').deleteOne({ _id: new ObjectId(playerId) });

        if (result.deletedCount === 0) {
            return res.status(404).json({ success: false, error: 'Player not found' });
        }

        res.json({ success: true, message: 'Player deleted successfully' });
    } catch (error) {
        console.error('Error deleting player:', error);
        res.status(500).json({ success: false, error: 'Failed to delete player' });
    }
});

router.delete('/deleteClub/:id', async (req, res) => {
    const clubId = req.params.id;

    try {
        // Проверка формата ID, если необходимо
        if (!ObjectId.isValid(clubId)) {
            return res.status(400).json({ success: false, error: 'Invalid ID format' });
        }
        const db = getDB();
        
        const club = await db.collection('clubs').findOne({ _id: new ObjectId(clubId) });

        if (!club) {
            return res.status(404).json({ message: 'Клуб не найден' });
        }

        // Удаляем логотип, если он существует
        if (club.logo) {
            const logoPath = path.join(__dirname, '../public', club.logo);
            deleteFile(logoPath);
        }

        // Удаляем все фотографии клуба
        if (club.photos && club.photos.length > 0) {
            club.photos.forEach(photo => {
                const photoPath = path.join(__dirname, '../public', photo);
                deleteFile(photoPath);
            });
        }

        const result = await db.collection('clubs').deleteOne({ _id: new ObjectId(clubId) });

        if (result.deletedCount === 0) {
            return res.status(404).json({ success: false, error: 'Club not found' });
        }

        res.json({ success: true, message: 'Club deleted successfully' });
    } catch (error) {
        console.error('Error deleting club:', error);
        res.status(500).json({ success: false, error: 'Failed to delete club' });
    }
});

router.post('/promoteToCoach/:id', async (req, res) => {
    const userId = req.params.id;

    try {
        // Проверка формата ID
        if (!ObjectId.isValid(userId)) {
            return res.status(400).json({ success: false, error: 'Invalid ID format' });
        }

        // Запрос подтверждения от пользователя (это нужно реализовать на фронтенде)
        const db = getDB();
        // Извлечение данных из коллекции `users`
        const user = await db.collection('users').findOne({ _id: new ObjectId(userId) });

        if (!user) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }

        // Добавление данных в коллекцию `coaches`
        const result = await db.collection('coaches').insertOne(user);

        if (result.insertedCount === 0) {
            return res.status(500).json({ success: false, error: 'Failed to add coach' });
        }

        // Удаление пользователя из коллекции `users`
        const deleteResult = await db.collection('users').deleteOne({ _id: new ObjectId(userId) });

        if (deleteResult.deletedCount === 0) {
            return res.status(500).json({ success: false, error: 'Failed to delete user' });
        }

        res.json({ success: true, message: 'User promoted to coach successfully' });
    } catch (error) {
        console.error('Error promoting user to coach:', error);
        res.status(500).json({ success: false, error: 'Failed to promote user' });
    }
});



module.exports = router;