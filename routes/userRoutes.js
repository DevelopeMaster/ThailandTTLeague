const express = require('express');
const router = express.Router();
exports.router = router;
require('dotenv').config();
const { ObjectId } = require('mongodb');
const { body, validationResult } = require('express-validator');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const { getDB } = require('../db');
const path = require('path');
const { ensureAuthenticated, deleteFile, ensureAuthenticatedOrAdmin, ensureAdmin, upload } = require('../middlewares/uploadConfig');
// const Player = require('../models/player');
// const mongoose = require('mongoose');

const notificateEmail = process.env.NOTIFICATE_EMAIL;
const notificatePass = process.env.NOTIFICATE_PASSWORD;


// router.post('/upload', upload.fields([
//     { name: 'logo', maxCount: 1 },
//     { name: 'photos', maxCount: 10 },
//     { name: 'userLogo', maxCount: 1 },
//     { name: 'banner', maxCount: 1 }
//   ]), (req, res) => {
//     if (!req.files) {
//       return res.status(400).json({ error: 'Файлы не были загружены' });
//     }
  
//     const uploadedFiles = {};
  
//     // Обрабатываем загруженные файлы
//     for (const fieldName in req.files) {
//       uploadedFiles[fieldName] = req.files[fieldName].map(file => file.path); // Сохраняем пути к файлам
//     }
  
//     res.json({
//       message: 'Файлы успешно загружены',
//       uploadedFiles, // Отправляем ссылки на загруженные файлы
//     });
//   });

router.post('/upload/user-logo', upload.single('userLogo'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'Логотип не был загружен' });
        }

        res.json({
            message: 'Логотип успешно загружен',
            logoUrl: req.file.path // Ссылка на файл в Cloudinary
        });
    } catch (error) {
        console.error('Ошибка при загрузке логотипа:', error);
        res.status(500).json({ error: 'Ошибка при загрузке логотипа' });
    }
});

router.post('/upload/club-logo', upload.single('logo'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'Логотип клуба не был загружен' });
        }

        res.json({
            message: 'Логотип клуба успешно загружен',
            logoUrl: req.file.path // Ссылка на файл в Cloudinary
        });
    } catch (error) {
        console.error('Ошибка при загрузке логотипа клуба:', error);
        res.status(500).json({ error: 'Ошибка при загрузке логотипа клуба' });
    }
});

router.post('/upload/club-photos', upload.array('photos', 10), (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ error: 'Фотографии клуба не были загружены' });
        }

        const photosUrls = req.files.map(file => file.path);

        res.json({
            message: 'Фотографии клуба успешно загружены',
            photos: photosUrls // Ссылки на фотографии в Cloudinary
        });
    } catch (error) {
        console.error('Ошибка при загрузке фотографий клуба:', error);
        res.status(500).json({ error: 'Ошибка при загрузке фотографий клуба' });
    }
});



router.get('/check-auth', ensureAuthenticated, (req, res) => {
    // Возвращаем ID авторизованного пользователя
    res.json({ userId: req.user._id });
});

// Маршрут для добавления игрока в турнир
router.post('/tournaments/:tournamentId/register-player', ensureAuthenticated, async (req, res) => {
    try {
        const db = getDB();
        const tournamentId = req.params.tournamentId;
        const playerId = req.body.playerId;
        let playerData;
        playerData = await db.collection('users').findOne({ _id: new ObjectId(playerId) });
        if (!playerData) {
            playerData = await db.collection('coaches').findOne({ _id: new ObjectId(playerId) });

            if (!playerData) {
                // Обновляем массив игроков в турнире
                await db.collection('tournaments').updateOne(
                    { _id: new ObjectId(tournamentId) },
                    { $addToSet: { players: { id: playerId } } } // Добавляем игрока, если его ещё нет в списке
                );
            }
        }

        // Обновляем массив игроков в турнире
        // await db.collection('tournaments').updateOne(
        //     { _id: new ObjectId(tournamentId) },
        //     { $addToSet: { players: { id: playerId } } } // Добавляем игрока, если его ещё нет в списке
        // );
        
        if (playerData) {
            await db.collection('tournaments').updateOne(
                { _id: new ObjectId(tournamentId) },
                {
                    $addToSet: {
                        players: {
                            id: playerId,
                            fullname: playerData.fullname || playerData.name,
                            rating: playerData.rating || 0,
                            logo: playerData.logo || '/icons/playerslogo/default_avatar.svg',
                            city: playerData.city
                        }
                    }
                }
            );
        }

        

        res.status(200).send('Player registered successfully');
    } catch (error) {
        console.error('Ошибка при добавлении игрока в турнир:', error);
        res.status(500).send('Ошибка при добавлении игрока');
    }
});

router.post('/tournaments/:tournamentId/unregister-player', ensureAuthenticated, async (req, res) => {
    try {
        const db = getDB();
        const tournamentId = req.params.tournamentId;
        const playerId = req.body.playerId;

        // Удаляем игрока из массива зарегистрированных и добавляем в выбывшие
        await db.collection('tournaments').updateOne(
            { _id: new ObjectId(tournamentId) },
            {
                $pull: { players: { id: playerId } },
                $addToSet: { retiredPlayers: { id: playerId } } // Добавляем игрока в выбывшие, если его там ещё нет
            }
        );

        res.status(200).send('Player unregistered successfully and added to retired players');
    } catch (error) {
        console.error('Ошибка при отказе от участия:', error);
        res.status(500).send('Ошибка при отмене регистрации');
    }
});



router.get('/clubtournaments', ensureAuthenticated, async (req, res) => {
    const { clubName, clubLogo, upcoming } = req.query; // Извлечение параметров из строки запроса

    let filter = {};
    if (clubName) {
        // filter['club.name'] = clubName; // Фильтр по названию клуба
        filter['club.name'] = { $regex: new RegExp(`^${clubName}$`, 'i') };
    }
    if (clubLogo) {
        // filter['club.name'] = clubName; // Фильтр по названию клуба
        filter['club.logo'] = { $regex: new RegExp(`^${clubLogo}$`, 'i') };
    }
    if (upcoming === 'true') {
        filter.datetime = { $gte: new Date() }; // Фильтр по дате
    }

    try {
        const db = getDB();
        // Поиск турниров в базе данных
        const tournaments = await db
            .collection('tournaments')
            .find(filter)
            .sort({ datetime: 1 })
            .toArray();

        res.status(200).json(tournaments); // Возврат найденных турниров
    } catch (error) {
        console.error('Ошибка при поиске турниров:', error);
        res.status(500).send('Error retrieving tournaments');
    }
});

function normalizeFullName(name) {
    if (!name || typeof name !== 'string') return '';
  
    return name
      .trim()
      .split(/\s+/) // разделяет по пробелам
      .map(word => {
        return word
          .split(/([-'])/) // разбиваем на части по дефису или апострофу, но сохраняем их
          .map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
          .join('');
      })
      .join(' ');
  }

//--------------EDIT PROFILES ----------//

router.post('/savePlayerProfile', ensureAuthenticated, upload.fields([
    { name: 'userLogo', maxCount: 1 }
  ]), async (req, res) => {
    // console.log('Received files:', req.files);
    // console.log('Received body:', req.body);
  
    try {
        const db = getDB();
        const userId = new ObjectId(req.body.userId);
        // console.log(userId);
        const currentUserData = await db.collection('users').findOne({ _id: userId });
        if (!currentUserData) {
            return res.status(404).send('User not found');
        }

        // if (!currentUserData) {
        //     currentUserData = await db.collection('coaches').findOne({ _id: userId });
        //     if (!currentUserData) {
        //         return res.status(404).send('User not found');
        //     }
        // }
        // console.log(currentUserData);
        const updates = {};
  
        // Обновление логотипа (если новый логотип был загружен)
        // if (req.files['userLogo']) {
        //     const logoPath = `/icons/playerslogo/${req.files['userLogo'][0].filename}`;
        //     if (currentUserData.logo !== logoPath) {
        //         updates.logo = logoPath;
        //     }
        // }
        if (req.files?.userLogo?.[0]) {
            const logoUrl = req.files.userLogo[0].path; // Ссылка на файл в Cloudinary
            if (currentUserData.logo !== logoUrl) {
                updates.logo = logoUrl; // Сохраняем ссылку на файл в БД
            }
        }
  
        if ((req.body.name && req.body.name !== currentUserData.name) || (req.body.fullname && req.body.fullname !== currentUserData.name)) {
            updates.fullname = normalizeFullName(req.body.fullname) || normalizeFullName(req.body.name) || req.body.fullname || req.body.name;
            
        }
  
        console.log(req.body);
        console.log(currentUserData);
        // if (req.body.cityName && req.body.cityName !== currentUserData.cityName) {
        //     const city = await db.collection('cities').findOne({
        //         $or: [
        //             { english: req.body.cityName },
        //             { russian: req.body.cityName },
        //             { thai: req.body.cityName }
        //         ]
        //     });
  
        //     if (city) {
        //         const cityId = city._id;
        //         console.log(new ObjectId(cityId));
        //         updates.city = new ObjectId(cityId);
        //     } else {
        //         return res.status(400).send('City not found');
        //     }
        // } else if (req.body.cityName?.trim() === '') {
        //     updates.city = null; 
        // }
        // if (!req.body.city) {
        //     console.log('пустой');
        // }

        if (req.body.city && req.body.city !== currentUserData.city) {
            const cityName = req.body.city.trim();
            console.log('полученный город', cityName);
            // Проверяем наличие города в базе
            let city = await db.collection('cities').findOne({
                $or: [
                    { english: cityName },
                    { russian: cityName },
                    { thai: cityName }
                ]
            });
        
            if (city) {
                // Город найден, используем его ID
                updates.city = new ObjectId(city._id);
            } else if(!city) {
                // Город не найден, добавляем его в базу
                let newCity; 
                if(req.body.lang === 'en') {
                    newCity = {
                        english: cityName, // Здесь можно адаптировать структуру, если нужно
                        russian: null,
                        thai: null,
                    };
                } else if(req.body.lang === 'ru') {
                    newCity = {
                        english: null, // Здесь можно адаптировать структуру, если нужно
                        russian: cityName,
                        thai: null,
                    };
                } else if(req.body.lang === 'th') {
                    newCity = {
                        english: null, // Здесь можно адаптировать структуру, если нужно
                        russian: null,
                        thai: cityName,
                    };
                }
                console.log(newCity);
        
                const result = await db.collection('cities').insertOne(newCity);
        
                if (result.insertedId) {
                    console.log('id добавленого города', result.insertedId);
                    // Используем ID нового города
                    updates.city = new ObjectId(result.insertedId);
                } else {
                    return res.status(500).send('Error creating new city');
                }
            } 
        } else {
            updates.city = ''; // Поле пустое, записываем null
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
        } else  if (req.body.blade !== undefined && req.body.blade.trim() === '') {
            updates.blade = '';
        }
  
        if (req.body.forehandRubber && req.body.forehandRubber !== currentUserData.forehandRubber) {
            updates.forehandRubber = req.body.forehandRubber;
        } else  if (req.body.forehandRubber !== undefined && req.body.forehandRubber.trim() === '') {
            updates.forehandRubber = '';
        }
  
        if (req.body.backhandRubber && req.body.backhandRubber !== currentUserData.backhandRubber) {
            updates.backhandRubber = req.body.backhandRubber;
        } else if (req.body.backhandRubber !== undefined && req.body.backhandRubber.trim() === '') {
            updates.backhandRubber = '';
        }
  
        if (req.body.description && req.body.description !== currentUserData.description) {
            updates.description = req.body.description;
        } else if (req.body.description !== undefined && req.body.description.trim() === '') {
            updates.description = '';
        }

        if (req.body.descriptioneng && req.body.descriptioneng !== currentUserData.descriptioneng) {
            updates.descriptioneng = req.body.descriptioneng;
        } else if (req.body.descriptioneng !== undefined && req.body.descriptioneng.trim() === '') {
            updates.descriptioneng = '';
        }

        if (req.body.descriptionthai && req.body.descriptionthai !== currentUserData.descriptionthai) {
            updates.descriptionthai = req.body.descriptionthai;
        } else if (req.body.descriptionthai !== undefined && req.body.descriptionthai.trim() === '') {
            updates.descriptionthai = '';
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

        // if (updates.logo) {
        //     localStorage.setItem('userLogo', updates.logo);
        // }
  
        res.json({
          success: true,
          logoUrl: updates.logo || '/icons/playerslogo/default_avatar.svg', 
          redirectUrl: `/dashboard/user/${userId}` 
        });
    } catch (error) {
        console.error('Ошибка при сохранении профиля пользователя:', error);
        res.status(500).send('Internal Server Error');
    }
  });


  router.post('/saveCoachProfile', ensureAuthenticated, upload.fields([
    { name: 'userLogo', maxCount: 1 }
  ]), async (req, res) => {
    console.log('Received files:', req.files);
    console.log('Received body:', req.body);
  
    try {
        const db = getDB();
        const userId = new ObjectId(req.body.userId);
        // console.log(userId);
        
        const currentUserData = await db.collection('coaches').findOne({ _id: userId });
        if (!currentUserData) {
            return res.status(404).send('Coach not found');
        }
        // console.log(currentUserData);
        const updates = {};
  
        // Обновление логотипа (если новый логотип был загружен)
        if (req.body.useDefaultImage === 'true') {
            const defaultLogoPath = '/icons/playerslogo/default_avatar.svg';
            if (currentUserData.logo !== defaultLogoPath) {
                updates.logo = defaultLogoPath;
            }
        } else if (req.files?.userLogo?.[0]) {
            const logoUrl = req.files.userLogo[0].path; // Ссылка на файл в Cloudinary
            if (currentUserData.logo !== logoUrl) {
                updates.logo = logoUrl; // Сохраняем ссылку на файл в БД
            }
        }
  
        if ((req.body.name && req.body.name !== currentUserData.name) || (req.body.fullname && req.body.fullname !== currentUserData.name)) {
            // updates.fullname = req.body.name || req.body.fullname;
            updates.fullname = normalizeFullName(req.body.fullname) || normalizeFullName(req.body.name) || req.body.fullname || req.body.name;
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
                // console.log(new ObjectId(cityId));
                updates.city = new ObjectId(cityId);
            } else {
                return res.status(400).send('City not found');
            }
        }
  
        if (req.body.club && req.body.club !== currentUserData.club) {
            const club = await db.collection('clubs').findOne({name: req.body.club });
  
            if (club) {
                const clubId = club._id;
                // console.log(new ObjectId(clubId));
                updates.club = new ObjectId(clubId);
            } else {
                return res.status(400).send('Club not found');
            }
            // updates.club = req.body.coach;
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

        if (req.body.trainingDuration && req.body.trainingDuration !== currentUserData.trainingDuration) {
            updates.trainingDuration = req.body.trainingDuration;
        }

        if (req.body.oneTrainingPrice && req.body.oneTrainingPrice !== currentUserData.oneTrainingPrice) {
            updates.oneTrainingPrice = req.body.oneTrainingPrice;
        }
        if (req.body.trainingDuration && req.body.trainingDuration !== currentUserData.trainingDuration) {
            updates.trainingDuration = req.body.trainingDuration;
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
  
        let trainingInfo = { ...currentUserData.trainingInfo }; // Начинаем с текущих данных

        if (req.body.userType === 'coach') {
            if (req.body.trainingInfo && req.body.lang === 'ru' && req.body.trainingInfo !== currentUserData.trainingInfo['ru']) {
                trainingInfo['en'] = req.body.trainingInfo || '';
                if (currentUserData.trainingInfo['en'] === '') {
                    trainingInfo['en'] = req.body.trainingInfo || '';
                }
                if (currentUserData.trainingInfo['th'] === '') {
                    trainingInfo['th'] = req.body.trainingInfo || '';
                }
            }
    
            if (req.body.trainingInfo && req.body.lang === 'en' && req.body.trainingInfo !== currentUserData.trainingInfo['en']) {
                trainingInfo['en'] = req.body.trainingInfo || '';
                if (currentUserData.trainingInfo['ru'] === '') {
                    trainingInfo['ru'] = req.body.trainingInfo || '';
                }
                if (currentUserData.trainingInfo['th'] === '') {
                    trainingInfo['th'] = req.body.trainingInfo || '';
                }
            }
    
            if (req.body.trainingInfo && req.body.lang === 'th' && req.body.trainingInfo !== currentUserData.trainingInfo['th']) {
                trainingInfo['th'] = req.body.trainingInfo || '';
                if (currentUserData.trainingInfo['ru'] === '') {
                    trainingInfo['ru'] = req.body.trainingInfo || '';
                }
                if (currentUserData.trainingInfo['en'] === '') {
                    trainingInfo['en'] = req.body.trainingInfo || '';
                }
            }

            if (JSON.stringify(trainingInfo) !== JSON.stringify(currentUserData.trainingInfo)) {
                updates.trainingInfo = trainingInfo;
            }

            if (req.body.description && req.body.description !== currentUserData.description) {
                updates.description = req.body.description || '';
            }
    
            if (req.body.descriptioneng && req.body.descriptioneng !== currentUserData.descriptioneng) {
                updates.descriptioneng = req.body.descriptioneng || '';
            }
    
            if (req.body.descriptionthai && req.body.descriptionthai !== currentUserData.descriptionthai) {
                updates.descriptionthai = req.body.descriptionthai || '';
            }
        } else {
            if (req.body.description && req.body.description !== currentUserData.trainingInfo['ru']) {
                trainingInfo['ru'] = req.body.description || '';
            }
    
            if (req.body.descriptioneng && req.body.descriptioneng !== currentUserData.trainingInfo['en']) {
                trainingInfo['en'] = req.body.descriptioneng || '';
            }
    
            if (req.body.descriptionthai && req.body.descriptionthai !== currentUserData.trainingInfo['th']) {
                trainingInfo['th'] = req.body.descriptionthai || '';
            }
    
            if (JSON.stringify(trainingInfo) !== JSON.stringify(currentUserData.trainingInfo)) {
                updates.trainingInfo = trainingInfo;
            }
        }
       
        console.log('updatesu', updates);
        if (Object.keys(updates).length > 0) {
            await db.collection('coaches').updateOne(
                { _id: new ObjectId(userId) },
                { $set: updates }
            );
            console.log(`Тренер ${userId} успешно обновлен`);
        } else {
            console.log(`Нет изменений для обновления пользователя ${userId}`);
        }

        // if (updates.logo) {
        //     localStorage.setItem('userLogo', updates.logo);
        // }

        
  
        res.json({
            success: true,
            logoUrl: updates.logo || '/icons/playerslogo/default_avatar.svg', 
            // redirectUrl: `/en/dashboard/user/${userId}`,
            redirectUrl: `/dashboard`,
            userId: userId,
            userType: 'coach'
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
            const logoPath = req.files['logo'][0].path; // Используем путь Cloudinary
            if (currentClubData.logo !== logoPath) {
                updates.logo = logoPath;
            }
        }

        if (req.files['photos']) {
            const currentPhotos = currentClubData.photos || []; // Получаем текущие фото или создаем пустой массив
            const updatedPhotos = [...currentPhotos]; // Копируем текущие фото для дальнейшего обновления
        
            // Массив с путями новых фотографий (полученных из Cloudinary)
            const photoPaths = req.files['photos'].map(file => file.path); // `file.path` уже содержит корректный путь из Cloudinary
        
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
        res.json({
            success: true,
            logoUrl: updates.logo || currentClubData.logo,
            redirectUrl: link // Указываем ссылку для редиректа
        });
    } catch (error) {
        console.error('Ошибка при сохранении профиля клуба:', error);
        res.status(500).send('Internal Server Error');
    }
});

router.post('/saveSchedule', ensureAuthenticated, async (req, res) => {
    const { scheduleData, clubId } = req.body;
    console.log('маршрут есть');
    try {
        const db = getDB();
        const clubObjectId = new ObjectId(clubId);
        
        // Получаем текущие данные клуба
        const currentClubData = await db.collection('clubs').findOne({ _id: clubObjectId });
        if (!currentClubData) {
            return res.status(404).send('Club not found');
        }

        // Подготовка изменений
        const updates = { scheduleData };

        // Обновление расписания в базе данных
        await db.collection('clubs').updateOne(
            { _id: clubObjectId },
            { $set: updates }
        );

        console.log(`Расписание для клуба ${clubId} успешно обновлено`);
        res.status(200).send('Schedule saved successfully');
    } catch (error) {
        console.error('Ошибка при сохранении расписания:', error);
        res.status(500).send('Internal Server Error');
    }
});
  

router.post('/createClub', ensureAuthenticated, upload.fields([
    { name: 'logo', maxCount: 1 },
    { name: 'photos', maxCount: 4 }
]), async (req, res) => {
    console.log('Received files:', req.files);

    try {
        console.log('запрос получен', req.body);
        const db = getDB();

        // Создание нового объекта для клуба
        const newClub = {};

        // Сохранение логотипа, если он был загружен
        // if (req.files['logo']) {
        //     const logoPath = `/icons/clubslogo/${req.files['logo'][0].filename}`;
        //     newClub.logo = logoPath;
        // }

        if (req.files['logo']) {
            const logoPath = req.files['logo'][0].path; // Используем путь Cloudinary
            newClub.logo = logoPath;
        } else {
            newClub.logo = 'https://res.cloudinary.com/dth8nfmhk/image/upload/v1737006491/icons/clubslogo/1736971457829-c43675875c6e59d8';
        }

        // Сохранение фотографий, если они были загружены
        if (req.files['photos']) {
            newClub.photos = req.files['photos'].map(file => `/icons/clubsphotos/${file.filename}`);
        }

        // Установка других параметров клуба из запроса
        newClub.name = req.body.name || '';
        newClub.representative = req.body.representative || '';

        let location = req.body.location ? JSON.parse(req.body.location) : null;
        if (Array.isArray(location) && location.length === 2 && location.every(num => typeof num === 'number')) {
            newClub.location = location;
        }

        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        newClub.workingHours = req.body.workingHours || '';
        newClub.tables = Number(req.body.tables) || 0;
        newClub.phoneNumber = req.body.phoneNumber || '';
        newClub.email = req.body.email.toLowerCase() || '';
        newClub.password = hashedPassword || '';
        newClub.website = req.body.website || '';

        const existingClub = await db.collection('clubs').findOne({ email: newClub.email });
        const existingPlayer = await db.collection('users').findOne({ email: newClub.email });
        const existingCoach = await db.collection('coaches').findOne({ email: newClub.email });
        if (existingClub || existingPlayer || existingCoach) {
            return res.status(400).json({ status: 'error', message: 'Клуб или пользователь с таким email уже существует!' });
        }

       

        if (req.body.city) {
            const city = await db.collection('cities').findOne({
                $or: [
                    { english: req.body.city },
                    { russian: req.body.city },
                    { thai: req.body.city }
                ]
            });

            if (city) {
                newClub.city = new ObjectId(city._id);
            } else {
                const newCity = { 'english': city };
                const result = await db.collection('cities').insertOne(newCity);
                if (result.insertedId) {
                    newClub.city = new ObjectId(result.insertedId);
                } else {
                    newClub.city = '';
                    console.error('Ошибка при создании нового города:', error);
                    // return res.status(500).send('Error creating new city');
                }
            }
        }

        // Сохранение адреса клуба
        newClub.address = {
            ru: req.body.address || '',
            en: req.body.addresseng || '',
            th: req.body.addressthai || ''
        };

        // Сохранение информации о клубе
        newClub.info = {
            ru: req.body.info || '',
            en: req.body.infoeng || '',
            th: req.body.infothai || ''
        };

        // Обработка дополнительных услуг
        newClub.supplements = {
            free: req.body.freeServices ? req.body.freeServices.split(',').map(item => item.trim()) : [],
            paid: req.body.paidServices ? req.body.paidServices.split(',').map(item => item.trim()) : []
        };
        newClub.scheduleData = {
            monday: [],
            tuesday: [],
            wednesday: [],
            thursday: [],
            friday: [],
            saturday: [],
            sunday: []
        };

        // Сохранение нового клуба в базу данных
        const result = await db.collection('clubs').insertOne(newClub);
        console.log(`Новый клуб создан с ID: ${result.insertedId}`);

        const requestId = req.body.userId;
        console.log(requestId);
        const request = await db.collection('requestfromclub').deleteOne({ _id: new ObjectId(requestId) })
        
        if (request.deletedCount === 0) {
            console.error('Ошибка при удалении запроса клуба:', error);
        } else {
            console.log('Запрос клуба успешно удален')
        }
    
       
        // Перенаправление после успешного создания клуба
        let link;
        if (req.user.role === 'admin') {
            link = `/ru/dashboard/admin/clubapply`;
        } else {
           link = false;
        }

        res.redirect(link);
    } catch (error) {
        console.error('Ошибка при создании клуба:', error);
        res.status(500).send('Internal Server Error');
    }
});

router.post('/updatecity/:cityId', ensureAdmin, async (req, res) => {
    const cityId = req.params.cityId;
    const { russian, english, thai } = req.body;

    if (!russian || !english || !thai) {
        return res.status(400).send('Все языковые поля должны быть заполнены.');
    }

    try {
        const db = getDB();
        const result = await db.collection('cities').updateOne(
            { _id: new ObjectId(cityId) },
            { $set: { russian, english, thai } }
        );

        if (result.modifiedCount === 0) {
            return res.status(404).send('Город не найден.');
        }

        res.status(200).send('Город успешно обновлен.');
    } catch (error) {
        console.error('Ошибка при обновлении города:', error);
        res.status(500).send('Ошибка сервера при обновлении города.');
    }
});

router.post('/addnewcity', async (req, res) => {
    const { russian, english, thai } = req.body;

    // Проверка на наличие данных
    if (!russian || !english || !thai) {
        return res.status(400).json({ error: 'Все поля должны быть заполнены' });
    }

    try {
        // Добавление нового города в базу данных
        const newCity = {
            russian,
            english,
            thai
        };
        const db = getDB();
        await db.collection('cities').insertOne(newCity);

        // Возвращаем ответ с данными нового города
        res.status(200).json({ message: 'Город успешно добавлен'});
    } catch (error) {
        console.error('Ошибка при добавлении города:', error);
        res.status(500).json({ error: 'Не удалось сохранить город' });
    }
});



router.post('/saveAdvProfile', ensureAuthenticated, upload.fields([
    { name: 'banner', maxCount: 1 },
  ]), async (req, res) => {
    console.log('Received files:', req.files);
    
    try {
        console.log('запрос получен', req.body);
        const db = getDB();
        const advId = new ObjectId(req.body.advId);
        // console.log(clubId);
        // Получение текущих данных клуба
        const currentAdvData = await db.collection('adv').findOne({ _id: advId });
        if (!currentAdvData) {
            return res.status(404).send('Adv not found');
        }
        
        const updates = {};
  
  
        // Обновление логотипа (если новый логотип был загружен)
        // if (req.files['banner']) {
        //     const logoPath = `/icons/advbanners/${req.files['banner'][0].filename}`;
        //     if (currentAdvData.image !== logoPath) {
        //         updates.image = logoPath;
        //     }
        // }
        if (req.files['banner']) {
            const logoPath = req.files['banner'][0].path; // Используем путь Cloudinary
            if (currentAdvData.image !== logoPath) {
                updates.image = logoPath;
            }
        }
        
  
        if (req.body.customer && req.body.customer !== currentAdvData.customer) {
            updates.customer = req.body.customer;
        }

        if (req.body.link && req.body.link !== currentAdvData.link) {
            updates.link = req.body.link;
        }
  
        if (req.body.expire && req.body.expire !== currentAdvData.expire) {
            updates.expire = new Date(req.body.expire);
        }

        const newGoldValue = req.body.gold === 'true' || req.body.gold === true ? true : false;

        if (newGoldValue !== currentAdvData.gold) {
            updates.gold = newGoldValue;
        }

        // if (req.body.gold !== undefined && req.body.gold !== currentAdvData.gold) {
        //     updates.gold = req.body.gold === 'true' || req.body.gold === true;
        // }
  
        console.log(updates);
        // Обновление данных в базе, если есть изменения
        if (Object.keys(updates).length > 0) {
            await db.collection('adv').updateOne(
                { _id: advId },
                { $set: updates }
            );
            console.log(`Реклама ${advId} успешно обновлена`);
        } else {
            console.log(`Нет изменений для обновления ${advId}`);
        }
  
        let link = `/ru/dashboard/admin/adv`;
       
        res.redirect(link);
    } catch (error) {
        console.error('Ошибка при сохранении рекламы:', error);
        res.status(500).send('Internal Server Error');
    }
});

router.post('/createAdv', ensureAuthenticated, upload.fields([
    { name: 'banner', maxCount: 1 },
]), async (req, res) => {
    try {
        console.log('Получен запрос на создание новой рекламы', req.body);
        const db = getDB();

        const newAdv = {
            customer: req.body.customer,
            link: req.body.link,
            expire: new Date(req.body.expire),
            createdday: new Date(),
            // image: req.files['banner'] ? `/icons/advbanners/${req.files['banner'][0].filename}` : null,
        };

        if (req.files['banner']) {
            const logoPath = req.files['banner'][0].path; // Используем путь Cloudinary
            // if (currentClubData.logo !== logoPath) {
                newAdv.image = logoPath;
            // }
        }

        const result = await db.collection('adv').insertOne(newAdv);
        console.log(`Новая реклама создана с ID: ${result.insertedId}`);

        res.redirect(`/ru/dashboard/admin/adv`);
    } catch (error) {
        console.error('Ошибка при создании новой рекламы:', error);
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
        const { name, phone, requestDate, playerId, profileLink, info, policy } = req.body;
        if (!name || !phone || !requestDate || !policy || !playerId ) {
        res.status(400).json({ error: 'Something wrong. Please renew page and try again' });
        return;
        }

        try {
        const db = getDB();
        await db.collection('requestfromcoach')
            .insertOne({ name, phone, requestDate, profileLink, playerId, info, policy });
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
            Player Id: ${playerId}
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
    body('mail').notEmpty().withMessage('E-mail is required'),
    body('password').notEmpty().withMessage('Password is required'),
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
    const { name, phone, requestDate, city, address, mail, password, clubname, qtytable, infotournaments, info, policy } = req.body;
    if (!name || !phone || !requestDate || !policy || !mail || !password || !city || !address || !clubname || !qtytable ) {
      console.log('данные не дошли до сервера');
      res.status(400).json({ error: 'Something wrong. Please renew page and try again' });
      return;
    }

    try {
      const db = getDB();
      await db.collection('requestfromclub')
        .insertOne({ name, phone, requestDate, city, address, mail, password, clubname, qtytable, infotournaments, info, policy });
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
        to: 'asianttleague@gmail.com', // получатель ------------------------- ЗАМЕНИТЬ
        subject: 'New Club Application',
        text: `
          A new club application has been received:
          Name: ${name}
          Phone: ${phone}
          E-mail: ${mail}
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

// router.post('/save-tournament', ensureAuthenticated, async (req, res) => {
//     try {
//         const db = getDB();
//         const { _id, ...updatedData } = req.body;
//         await db.collection('tournaments').updateOne(
//             { _id: new ObjectId(_id) },
//             { $set: updatedData }
//         );
//         res.status(200).send('Tournament data saved successfully');
//     } catch (err) {
//         console.error('Error saving tournament data:', err);
//         res.status(500).send('An error occurred while saving tournament data');
//     }
// });

router.post('/save-tournament', ensureAuthenticated, async (req, res) => {
    console.log('маршрут найден');
    try {
        const db = getDB();
        const { tournamentId, ...updatedData } = req.body;
        const tournamentObjectId = new ObjectId(tournamentId);
        console.log('Данные для обновления:', updatedData);

        // Получение текущих данных турнира из базы
        const currentData = await db.collection('tournaments').findOne({ _id: tournamentObjectId });
        if (!currentData) {
            return res.status(404).send('Tournament not found');
        }

        // Проверка изменений
        const changesToUpdate = {};

        if (updatedData.deposit && updatedData.deposit !== currentData.contribution) {
            changesToUpdate.contribution = updatedData.deposit;
        }

        if (updatedData.ratingLimit && updatedData.ratingLimit !== currentData.restrictions) {
            changesToUpdate.restrictions = updatedData.ratingLimit;
        }

        if (updatedData.startTournament) {
            // Разделение строки с датой и временем
            const [datePart, timePart] = updatedData.startTournament.split(', ');
            const [year, month, day] = datePart.split('-').map(Number);
            const [hours, minutes] = timePart.split(':').map(Number);
        
            // Создание строки в формате UTC, чтобы сохранить точное время без сдвигов
            const utcDateString = new Date(Date.UTC(year, month - 1, day, hours, minutes)).toISOString();
            console.log(utcDateString);
            console.log(new Date(utcDateString));
            console.log(new Date(currentData.datetime).toISOString());
            // Проверка и обновление только при изменении данных
            if (utcDateString !== new Date(currentData.datetime).toISOString()) {
                changesToUpdate.datetime = new Date(utcDateString);
            }
        }

        if (updatedData.prizes) {
            const newPrizes = {
                ru: updatedData.prizes.ru.join('\n'),
                en: updatedData.prizes.en.join('\n'),
                th: updatedData.prizes.th.join('\n')
            };

            const oldPrizes = {
                ru: currentData.prizes.ru,
                en: currentData.prizes.en,
                th: currentData.prizes.th
            };

            if (JSON.stringify(newPrizes) !== JSON.stringify(oldPrizes)) {
                changesToUpdate.prizes = newPrizes;
            }
        }

        if (Array.isArray(updatedData.registeredPlayers)) {
            const registeredPlayersWithId = updatedData.registeredPlayers.map(id => ({ id }));
            const currentRegisteredPlayersWithId = Array.isArray(currentData.players)
                ? currentData.players.map(player => ({ id: player.toString() }))
                : [];
        
            if (JSON.stringify(registeredPlayersWithId.sort((a, b) => a.id.localeCompare(b.id))) !==
                JSON.stringify(currentRegisteredPlayersWithId.sort((a, b) => a.id.localeCompare(b.id)))) {
                changesToUpdate.players = registeredPlayersWithId;
            }
        }
        
        if (Array.isArray(updatedData.retiredPlayers)) {
            const retiredPlayersWithId = updatedData.retiredPlayers.map(id => ({ id }));
            const currentRetiredPlayersWithId = Array.isArray(currentData.retiredPlayers)
                ? currentData.retiredPlayers.map(player => ({ id: player.toString() }))
                : [];
        
            if (JSON.stringify(retiredPlayersWithId.sort((a, b) => a.id.localeCompare(b.id))) !==
                JSON.stringify(currentRetiredPlayersWithId.sort((a, b) => a.id.localeCompare(b.id)))) {
                changesToUpdate.retiredPlayers = retiredPlayersWithId;
            }
        }

        // Выполнение обновления, если есть изменения
        if (Object.keys(changesToUpdate).length > 0) {
            await db.collection('tournaments').updateOne(
                { _id: tournamentObjectId },
                { $set: changesToUpdate }
            );
            console.log(`Турнир ${tournamentObjectId} успешно обновлен`);
            res.status(200).send('Tournament data saved successfully');
        } else {
            console.log(`Нет изменений для обновления турнира ${tournamentObjectId}`);
            res.status(200).send('No changes detected in tournament data');
        }
    } catch (err) {
        console.error('Error saving tournament data:', err);
        res.status(500).send('An error occurred while saving tournament data');
    }
});




//---------------------------ADMIN EDIT PROFILES-----------------------//

router.delete('/deletecity/:cityId', ensureAdmin, async (req, res) => {
    const cityId = req.params.cityId;

    try {
        const db = getDB();
        const result = await db.collection('cities').deleteOne({ _id: new ObjectId(cityId) });

        if (result.deletedCount === 0) {
            return res.status(404).send('Город не найден.');
        }

        res.status(200).send('Город успешно удален.');
    } catch (error) {
        console.error('Ошибка при удалении города:', error);
        res.status(500).send('Ошибка сервера при удалении города.');
    }
});

router.delete('/delete-tournament/:id', async (req, res) => {
    try {
        const db = getDB();
        const tournamentId = req.params.id;
        await db.collection('tournaments').deleteOne({ _id: new ObjectId(tournamentId) });
        res.status(200).send('Tournament deleted successfully');
    } catch (err) {
        console.error('Error deleting tournament:', err);
        res.status(500).send('An error occurred while deleting the tournament');
    }
});

router.delete('/deleteAdv/:id', async (req, res) => {
    const advId = req.params.id;

    try {
        // Проверка формата ID, если необходимо
        if (!ObjectId.isValid(advId)) {
            return res.status(400).json({ success: false, error: 'Invalid ID format' });
        }
        const db = getDB();
        // Удаление игрока из коллекции 'players'
        const result = await db.collection('adv').deleteOne({ _id: new ObjectId(advId) });

        if (result.deletedCount === 0) {
            return res.status(404).json({ success: false, error: 'Player not found' });
        }

        res.json({ success: true, message: 'Adv deleted successfully' });
    } catch (error) {
        console.error('Error deleting adv:', error);
        res.status(500).json({ success: false, error: 'Failed to delete adv' });
    }
});

router.delete('/deleteRequestCoach/:id', async (req, res) => {
    const advId = req.params.id;

    try {
        // Проверка формата ID, если необходимо
        if (!ObjectId.isValid(advId)) {
            return res.status(400).json({ success: false, error: 'Invalid ID format' });
        }
        const db = getDB();
        // Удаление игрока из коллекции 'players'
        const result = await db.collection('requestfromcoach').deleteOne({ _id: new ObjectId(advId) });

        if (result.deletedCount === 0) {
            return res.status(404).json({ success: false, error: 'Request not found' });
        }

        res.json({ success: true, message: 'Request deleted successfully' });
    } catch (error) {
        console.error('Error deleting request:', error);
        res.status(500).json({ success: false, error: 'Failed to delete request' });
    }
});

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

router.delete('/deleteCoach/:id', async (req, res) => {
    const playerId = req.params.id;

    try {
        // Проверка формата ID, если необходимо
        if (!ObjectId.isValid(playerId)) {
            return res.status(400).json({ success: false, error: 'Invalid ID format' });
        }
        const db = getDB();
        // Удаление игрока из коллекции 'players'
        const result = await db.collection('coaches').deleteOne({ _id: new ObjectId(playerId) });

        if (result.deletedCount === 0) {
            return res.status(404).json({ success: false, error: 'Coach not found' });
        }

        res.json({ success: true, message: 'Coach deleted successfully' });
    } catch (error) {
        console.error('Error deleting coach:', error);
        res.status(500).json({ success: false, error: 'Failed to delete coach' });
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
        // if (club.logo) {
        //     const logoPath = path.join(__dirname, '../public', club.logo);
        //     deleteFile(logoPath);
        // }

        // Удаляем все фотографии клуба
        // if (club.photos && club.photos.length > 0) {
        //     club.photos.forEach(photo => {
        //         const photoPath = path.join(__dirname, '../public', photo);
        //         deleteFile(photoPath);
        //     });
        // }

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

router.delete('/deleteClubRequest/:id', async (req, res) => {
    const clubId = req.params.id;

    try {
        // Проверка формата ID, если необходимо
        if (!ObjectId.isValid(clubId)) {
            return res.status(400).json({ success: false, error: 'Invalid ID format' });
        }
        const db = getDB();
        
        // const club = await db.collection('requestfromclub').findOne({ _id: new ObjectId(clubId) });

        // if (!club) {
        //     return res.status(404).json({ message: 'Запрос на добавлление клуба не найден' });
        // }

        const result = await db.collection('requestfromclub').deleteOne({ _id: new ObjectId(clubId) });

        if (result.deletedCount === 0) {
            return res.status(404).json({ success: false, error: 'Club request not found' });
        }

        res.json({ success: true, message: 'Club request deleted successfully' });
    } catch (error) {
        console.error('Error deleting club request:', error);
        res.status(500).json({ success: false, error: 'Failed to delete club request' });
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

router.post('/promoteToUser/:id', async (req, res) => {
    const userId = req.params.id;

    try {
        // Проверка формата ID
        if (!ObjectId.isValid(userId)) {
            return res.status(400).json({ success: false, error: 'Invalid ID format' });
        }

        // Запрос подтверждения от пользователя (это нужно реализовать на фронтенде)
        const db = getDB();
        // Извлечение данных из коллекции `users`
        const user = await db.collection('coaches').findOne({ _id: new ObjectId(userId) });

        if (!user) {
            return res.status(404).json({ success: false, error: 'Coach not found' });
        }

        // Добавление данных в коллекцию `coaches`
        const result = await db.collection('users').insertOne(user);

        if (result.insertedCount === 0) {
            return res.status(500).json({ success: false, error: 'Failed to add user' });
        }

        // Удаление пользователя из коллекции `users`
        const deleteResult = await db.collection('coaches').deleteOne({ _id: new ObjectId(userId) });

        if (deleteResult.deletedCount === 0) {
            return res.status(500).json({ success: false, error: 'Failed to delete coach' });
        }

        res.json({ success: true, message: 'Coach promoted to user successfully' });
    } catch (error) {
        console.error('Error promoting coach to user:', error);
        res.status(500).json({ success: false, error: 'Failed to promote coach' });
    }
});



module.exports = router;