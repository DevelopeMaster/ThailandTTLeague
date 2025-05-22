const express = require('express');
const { body, validationResult } = require('express-validator');
const path = require('path');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const nodemailer = require('nodemailer');
const passport = require('./passportConfig'); // Подключаем конфигурацию Passport
// const browserSync = require('browser-sync');
const { ObjectId } = require('mongodb'); // Импортируем ObjectId
const { Types } = require('mongoose');
require('dotenv').config();
const { connectDB, getDB, client } = require('./db'); // Подключаем функцию для получения базы данных
const flash = require('connect-flash');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const crypto = require('crypto');
// const router = express.Router();
const cron = require('node-cron');
const { v4: uuidv4 } = require('uuid');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const { ensureAuthenticated, upload, ensureClub, ensureClubOrAdmin, ensureAdmin } = require('./middlewares/uploadConfig');
const userRoutes = require('./routes/userRoutes');
const fs = require('fs');
const { router } = require('./routes/userRoutes');

// ВЫГРУЗКА ИЗОБРАЖЕНИЙ С КОМПА НА СЕРВЕР

// const path = require('path');
// const cloudinary = require('./cloudinaryConfiq');


// // // Укажите локальную папку с изображениями и иконками
// const rootFolders = [
//   path.join(__dirname, 'public/images'),
//   path.join(__dirname, 'public/icons')
// ];

// // // Функция для загрузки файлов
// // Функция для загрузки файлов
// async function uploadFolder(folderPath, cloudinaryBaseFolder) {
//   fs.readdir(folderPath, async (err, items) => {
//     if (err) {
//       console.error(`Ошибка чтения папки ${folderPath}:`, err);
//       return;
//     }

//     for (const item of items) {
//       const itemPath = path.join(folderPath, item);

//       fs.stat(itemPath, async (err, stats) => {
//         if (err) {
//           console.error(`Ошибка получения данных для ${itemPath}:`, err);
//           return;
//         }

//         if (stats.isDirectory()) {
//           // Рекурсивный вызов для вложенных папок
//           const newCloudinaryFolder = path.join(cloudinaryBaseFolder, item).replace(/\\/g, '/');
//           await uploadFolder(itemPath, newCloudinaryFolder);
//         } else if (stats.isFile()) {
//           try {
//             const relativePath = path.relative(path.join(__dirname, 'public'), itemPath); // Путь относительно public
//             const publicId = relativePath.replace(/\\/g, '/').replace(/\.[^/.]+$/, ''); // Убираем расширение
//             const folderPath = path.dirname(publicId);

//             const result = await cloudinary.uploader.upload(itemPath, {
//               folder: folderPath, // Корректный путь в Cloudinary
//               public_id: path.basename(publicId) // Только имя файла без расширения
//             });

//             console.log(`Загружен: ${itemPath} → ${result.secure_url}`);
//           } catch (uploadError) {
//             console.error(`Ошибка загрузки ${itemPath}:`, uploadError);
//           }
//         }
//       });
//     }
//   });
// }

// // Запуск загрузки
// (async () => {
//   for (const folder of rootFolders) {
//     const baseFolder = path.basename(folder).replace(/\\/g, '/');
//     await uploadFolder(folder, baseFolder);
//   }
// })();
//---------------------------------------------------------



// Функция для удаления непустой папки
// async function deleteFolder(folderPath) {
//   try {
//     // Получаем список ресурсов в папке
//     const resources = await cloudinary.api.resources({
//       type: 'upload',
//       prefix: folderPath, // Указываем путь к папке
//       max_results: 500 // Максимальное число ресурсов за один запрос
//     });

//     // Если есть ресурсы, удаляем их
//     const publicIds = resources.resources.map(resource => resource.public_id);
//     if (publicIds.length > 0) {
//       const deleteResponse = await cloudinary.api.delete_resources(publicIds);
//       console.log(`Удалены ресурсы из папки ${folderPath}:`, deleteResponse);
//     }

//     // Удаляем пустую папку
//     const folderDeleteResponse = await cloudinary.api.delete_folder(folderPath);
//     console.log(`Папка ${folderPath} успешно удалена:`, folderDeleteResponse);
//   } catch (error) {
//     console.error(`Ошибка при удалении папки ${folderPath}:`, error);
//   }
// }

// Пример использования
// deleteFolder('icons/ads');
// deleteFolder('icons/advbanners');
// deleteFolder('icons/clubslogo');
// deleteFolder('icons/clubsphotos');
// deleteFolder('icons/favicons');
// deleteFolder('icons/playerslogo');
// deleteFolder('icons');
// deleteFolder('images/phuketclub');
// deleteFolder('images');

const app = express();
const port = 3000;

const user = process.env.DB_USER;
const password = process.env.DB_PASSWORD;
const host = process.env.DB_HOST;
const notificateEmail = process.env.NOTIFICATE_EMAIL;
const notificatePass = process.env.NOTIFICATE_PASSWORD;
const sessionSecret = process.env.SESSION_SECRET;

const uri = `mongodb+srv://${user}:${password}@${host}/?retryWrites=true&w=majority&appName=Users`;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.set('trust proxy', 1);



// app.get('/images', (req, res) => {
//   // const { fileName } = req.params;
//   console.log('перенаправлено');
//   // Формируем ссылку на Cloudinary
//   const cloudinaryUrl = `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}${req.path}`;

//   // Перенаправляем запрос
//   res.redirect(cloudinaryUrl);
// });

// app.get('/icons', (req, res) => {
//   // const { fileName } = req.params;
//   console.log('перенаправлено');
//   // Формируем ссылку на Cloudinary
//   const cloudinaryUrl = `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}${req.path}`;

//   // Перенаправляем запрос
//   res.redirect(cloudinaryUrl);
// });

// Middleware для обработки запросов к изображениям
app.use('/images', (req, res, next) => {
  const localPath = path.join(__dirname, 'public/images', req.path);

  // Проверяем, существует ли файл локально
  fs.access(localPath, fs.constants.F_OK, (err) => {
    if (err) {
      // Если файла нет, перенаправляем запрос в Cloudinary
      // console.log('Файл отсутствует локально, перенаправлено в Cloudinary:', req.path);
      const cloudinaryUrl = `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/images${req.path}`;
      return res.redirect(cloudinaryUrl);
    }

    // Если файл существует, продолжаем обработку (Express Static его обслужит)
    next();
  });
});

app.use('/icons', (req, res, next) => {
  const localPath = path.join(__dirname, 'public/icons', req.path); // public/icons

  // Проверяем, существует ли файл локально
  fs.access(localPath, fs.constants.F_OK, (err) => {
    if (err) {
      // Если файла нет, перенаправляем запрос в Cloudinary
      // console.log('Файл отсутствует локально, перенаправлено в Cloudinary:', req.path);
      const cloudinaryUrl = `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/icons${req.path}`;
      return res.redirect(cloudinaryUrl);
    }

    // Если файл существует, продолжаем обработку (Express Static его обслужит)
    next();
  });
});

app.post('/uploadResultImage', ensureAuthenticated, async (req, res) => {
  try {
      const { base64Image } = req.body;

      if (!base64Image) {
          return res.status(400).json({ error: 'Нет изображения для загрузки' });
      }
      if (!base64Image.startsWith('data:image/')) {
        return res.status(400).json({ error: 'Некорректный формат изображения' });
    }

      const result = await cloudinary.uploader.upload(base64Image, {
          folder: 'results/share',
          resource_type: 'image',
      });

      res.json({ imageUrl: result.secure_url });
  } catch (error) {
      console.error('❌ Ошибка загрузки изображения в Cloudinary:', error);
      res.status(500).json({ error: 'Ошибка сервера при загрузке изображения' });
  }
});

// app.use(helmet());

// app.use(helmet({
//   contentSecurityPolicy: {
//     useDefaults: true,
//     directives: {
//       defaultSrc: ["'self'"],
//       scriptSrc: [
//         "'self'",
//         "'unsafe-inline'",
//         "https://cdn.jsdelivr.net",
//         "https://unpkg.com" // ✅ Leaflet.js
//       ],
//       styleSrc: [
//         "'self'",
//         "'unsafe-inline'",
//         "https://fonts.googleapis.com",
//         "https://unpkg.com" // ✅ Leaflet.css
//       ],
//       fontSrc: [
//         "'self'",
//         "https://fonts.gstatic.com",
//         "data:"
//       ],
//       imgSrc: [
//         "'self'",
//         "data:",
//         "https://res.cloudinary.com"
//       ],
//       connectSrc: ["'self'"],
//       objectSrc: ["'none'"],
//       upgradeInsecureRequests: []
//     }
//   }
// }));

app.disable('x-powered-by');

app.use('/api/', rateLimit({
  windowMs: 15 * 60 * 1000, // 15 минут
  max: 100, // 100 запросов на IP
  standardHeaders: true,
  legacyHeaders: false
}));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static(path.join(__dirname, 'public'), {
  extensions: ['html'], // не отдаёт .php, .conf и пр.
  dotfiles: 'ignore',
  maxAge: '30d'
}));




// middleware для запрета подозрительных путей
app.use((req, res, next) => {
  const blockedPaths = [
    '/wp-login', '/wp-admin', '/wordpress', '/wp-login.php', '/setup-config.php', '/wordpress', '/config', '/.env', '/.git', '/.htaccess', '/install.php'
  ];

  if (blockedPaths.some(path => req.originalUrl.toLowerCase().includes(path))) {
    console.warn('❌ Блокировка подозрительного запроса:', req.originalUrl);
    return res.status(404).render('404');
  }

  next();
});

const store = MongoStore.create({
  mongoUrl: uri,
  dbName: 'ttleague',
  resave: false,
  collectionName: 'sessions',
  stringify: false,
  autoRemove: 'native',
  // cookie: { secure: true, httpOnly: true },
  ttl: 14 * 24 * 60 * 60 // Время жизни сессии в секундах (14 дней)
});


// потом включить 
store.on('create', (sid) => {
  console.log(`Session created: ${sid}`);
});

// store.on('touch', (sid) => {
//   console.log(`Session touched: ${sid}`);
// });

store.on('destroy', (sid) => {
  console.log(`Session destroyed: ${sid}`);
});

app.use(session({
  secret: sessionSecret,
  resave: false,
  saveUninitialized: false,
  store: store,
  cookie: {
      secure: process.env.NODE_ENV === 'production', // Используйте secure куки в продакшн
      maxAge: 14 * 24 * 60 * 60 * 1000 // 14 days
  }
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

// Middleware для перенаправления URL с завершающим слэшем
app.use((req, res, next) => {
  if (req.path !== '/' && req.path.endsWith('/')) {
    const query = req.url.slice(req.path.length);
    const redirectPath = req.path.slice(0, -1) + query;
    return res.redirect(301, redirectPath);
  }
  next();
});

function logAction(req, action, extra = {}) {
  const log = {
    time: new Date().toISOString(),
    ip: req.headers['x-forwarded-for'] || req.ip,
    url: req.originalUrl,
    method: req.method,
    user: req.user?.id || req.user?._id || 'guest',
    role: req.user?.role || 'unknown',
    action,
    ...extra
  };
  console.log('[LOG]', JSON.stringify(log));
}


// function requireLogin(req, res, next) {
//   if (req.session && req.session.userId) {
//     return next(); // всё ок
//   }

//   console.warn('🔒 Попытка доступа без сессии:', req.originalUrl);
//   return res.redirect('/'); // или '/login' — в зависимости от логики
// }


// Основные маршруты
app.get('/', (req, res) => {
  res.render('en');
});

app.get('/en', (req, res) => {
  res.render('en');
});

app.get('/ru', (req, res) => {
  res.render('ru');
});



app.get('/becomeacoach', userAuthenticated, (req, res) => {
  // const { lang } = req.params;
  res.sendStatus(200);
});

app.get('/:lang/becomeacoach', userAuthenticated, (req, res) => {
  const { lang } = req.params;
  res.render(`${lang}/becomeacoach`);
});

// Middleware для проверки авторизации
function userAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
      return next();
  }
  const language = req.path.match(/^\/(en|ru|th)/)?.[1] || 'en';

  // Перенаправляем с учетом языка
  res.redirect(`/${language}?loginRequired=true`);
}

app.get('/ru/dashboard/admin', ensureAdmin, (req, res) => {
  res.render('ru/dashboard/admin');
});

app.get('/ru/dashboard/admin/:page', ensureAdmin, (req, res) => {
  const { page } = req.params;
  res.render(`ru/dashboard/admin/${page}`);
});



app.get('/ru/dashboard/admin/edit/:playerId', userAuthenticated, ensureAdmin, (req, res) => {
  const { playerId } = req.params;
  const link = `ru/dashboard/admin/edit/player`;

  try {  
    console.log(`Rendering: ${link} for userId: ${playerId}`);
    res.render(link, {
      playerId: playerId
    });
  } catch (error) {
    console.error('Error rendering template:', error.message);
    res.status(500).send('Server error');
  }
});

app.get('/:lang/share/result', (req, res) => {
  const { name, image, ratingChange, userPageLink } = req.query;
  const lang = req.params.lang || 'en';

  res.render('result-share', {
      name: decodeURIComponent(name),
      image: decodeURIComponent(image),
      ratingChange: decodeURIComponent(ratingChange),
      userPageLink: decodeURIComponent(userPageLink),
      lang
  });
});

app.get('/allcities', ensureAdmin, async (req, res) => {
  try {
      const db = getDB();
      const cities = await db.collection('cities').find().toArray();
      res.json(cities);
  } catch (error) {
      console.error('Ошибка при получении списка городов:', error);
      res.status(500).send('Ошибка сервера');
  }
});


app.get('/ru/dashboard/admin/editcoach/:playerId', userAuthenticated, ensureAdmin, (req, res) => {
  const { playerId } = req.params;
  const link = `ru/dashboard/admin/editcoach/coach`;

  try {  
    console.log(`Rendering: ${link} for userId: ${playerId}`);
    res.render(link, {
      coachId: playerId
    });
  } catch (error) {
    console.error('Error rendering template:', error.message);
    res.status(500).send('Server error');
  }
});

app.get('/ru/dashboard/admin/editclub/:clubId', userAuthenticated, ensureAdmin, (req, res) => {
  const { clubId } = req.params;
  const link = `ru/dashboard/admin/editclub/club`;

  try {  
    console.log(`Rendering: ${link} for clubId: ${clubId}`);
    res.render(link, { clubId: clubId });
    
  } catch (error) {
    console.error('Error rendering template:', error.message);
    res.status(500).send('Server error');
  }
});

app.get('/ru/dashboard/admin/createclub/:clubId', userAuthenticated, ensureAdmin, (req, res) => {
  const { clubId } = req.params;
  const link = `ru/dashboard/admin/createclub/createclub`;

  try {  
    console.log(`Rendering: ${link} for clubId: ${clubId}`);
    res.render(link, { clubId: clubId });
    
  } catch (error) {
    console.error('Error rendering template:', error.message);
    res.status(500).send('Server error');
  }
});


app.get('/th', (req, res) => {
  res.render('th');
});

app.get('/error', (req, res) => {
  res.render('error');
});

app.use('/api', userRoutes);

// Маршруты для страниц с языковыми параметрами
// app.get('/:lang(en|ru|th)/allclubs/:clubId', (req, res) => {
//   try {
//     const { lang } = req.params;
//     res.render(`${lang}/allclubs/club`);
//   } catch (error) {
//     res.status(404).render('404');
//   }
  
// });

app.get('/:lang(en|ru|th)/allclubs/:clubId', (req, res) => {
  const { lang, clubId } = req.params;

  // Проверка: корректный ли ObjectId
  if (!Types.ObjectId.isValid(clubId)) {
    console.warn(`⛔ Невалидный clubId: ${clubId}`);
    return res.status(404).render('404');
  }

  // Можно дополнительно проверить наличие клуба в базе, если нужно
  // const club = await Club.findById(clubId);
  // if (!club) return res.status(404).render('404');

  res.render(`${lang}/allclubs/club`);
});


app.get('/:lang(en|ru|th)/trainings/:trainingId', async (req, res) => {
  try {
    const { lang, trainingId } = req.params;

    if (!trainingId || !lang) {
      return res.status(404).render('404');
    }
    res.render(`${lang}/trainings/training`);
  } catch (error) {
    console.error('Error in route handler:', error);
    res.status(500).send('Server error');
  }
});

app.get('/:lang(en|ru|th)/allplayers/:userId', async (req, res) => {
  try {
    const { lang, userId } = req.params;
    const link = `${lang}/allplayers/player`;

    if (!userId || !lang) {
      return res.status(404).render('404');
    }
        
    console.log(`Rendering: ${link} for userId: ${userId}`);
    return res.render(link, {
        userId: userId,
    });
    
  } catch (error) {
    console.error('Error in route handler:', error);
    res.status(500).send('Server error');
  }
});

app.get('/:lang(en|ru|th)/allcoaches/:userId', async (req, res) => {
  try {
    const { lang, userId } = req.params;
    const link = `${lang}/allcoaches/coach`;
    
    if (!userId || !lang) {
      return res.status(404).render('404');
    }
        
    console.log(`Rendering: ${link} for userId: ${userId}`);
    return res.render(link, {
        userId: userId,
    });
    
  } catch (error) {
    console.error('Error in route handler:', error);
    res.status(500).send('Server error');
  }
});

app.get('/:lang(en|ru|th)/trainings', async (req, res) => {
  try {
    const { lang } = req.params;
    if (!lang) {
      return res.status(404).render('404');
    }
    res.render(`${lang}/alltrainings`);
  } catch (error) {
    console.error('Error in route handler:', error);
    res.status(500).send('Server error');
  }
});

app.get('/:lang(en|ru|th)/tournaments/:tournamentId', async (req, res) => {
  try {
    const { lang, tournamentId } = req.params;
    if (!tournamentId || !lang) {
      return res.status(404).render('404');
    }
    if (!tournamentId || tournamentId === "undefined") {
      console.log("⚠️ Ошибка: передан некорректный tournamentId:", tournamentId);
      // return res.status(400).send("Invalid tournament ID");
    } else {
      await renderTournament(tournamentId, lang, res);
    }
    
    
  } catch (error) {
    console.error('Error in route handler:', error);
    res.status(500).send('Server error');
  }
});

// app.get('/:lang(en|ru|th)/dashboard/edittournaments/:tournamentId', async (req, res) => {
//   try {
//     const { lang, tournamentId } = req.params;
//     if (!tournamentId || !lang) {
//       return res.status(404).render('404');
//     }
//     return res.render(`${lang}/tournaments/upcoming-tournament`);
    
//   } catch (error) {
//     console.error('Error in route handler:', error);
//     res.status(500).send('Server error');
//   }
// });

app.get('/:lang(en|ru|th)/dashboard/edittournament/:tournamentId/:userId', userAuthenticated, async (req, res) => {
  try {
    const { lang, tournamentId, userId } = req.params;
    // console.log('есть');
    if (!tournamentId || !lang) {
      return res.status(404).render('404');
    }

    // Дополнительно можно запросить данные о турнире из базы
    // const db = getDB(); // Получение объекта базы данных
    // const tournament = await db.collection('tournaments').findOne({ _id: tournamentId });

    // if (!tournament) {
    //   return res.status(404).render('404', { message: 'Tournament not found' });
    // }

    // Передача данных на страницу
    return res.render(`${lang}/dashboard/edittournament`, {
      tournamentId: tournamentId, // Передача ID турнира
      userId: userId
      // tournament: tournament // Передача объекта турнира
    });
  } catch (error) {
    console.error('Error in route handler:', error);
    res.status(500).send('Server error');
  }
});

// async function renderTournament(id, lang, res) {
//   try {
//     const db = getDB();
//     const tournament = await db.collection('tournaments').findOne({ _id: new ObjectId(id) });

//     if (!tournament) {
//       return res.status(404).render('404');
//     }

//     if (tournament.datetime < new Date()) {
//       return res.render(`${lang}/tournaments/past-tournament`);
//     }
//     if (tournament.datetime > new Date()) {
//       return res.render(`${lang}/tournaments/upcoming-tournament`);
//     }
//   } catch (error) {
//     console.error('Error fetching tournament:', error);
//     res.status(500).send('Error fetching tournament');
//   }
// }

async function renderTournament(id, lang, res) {
  try {
    const db = getDB();
    const tournament = await db.collection('tournaments').findOne({ _id: new ObjectId(id) });

    if (!tournament) {
      return res.status(404).render('404');
    }

    const isFinished = tournament.finished === true; // Проверяем статус завершённости
    const isPast = new Date(tournament.datetime) < new Date(); // Проверяем дату

    if (isFinished || isPast) {
      return res.render(`${lang}/tournaments/past-tournament`);
    } else {
      return res.render(`${lang}/tournaments/upcoming-tournament`);
    }
  } catch (error) {
    console.error('Error fetching tournament:', error);
    res.status(500).send('Error fetching tournament');
  }
}



app.get('/:lang(en|ru|th)/alltournaments', (req, res) => {
  const { lang } = req.params;
  if (!lang) {
    return res.status(404).render('404');
  }
  res.render(`${lang}/alltournaments`);
});

app.get('/:lang(en|ru|th)/alltrainings', (req, res) => {
  const { lang } = req.params;
  if (!lang) {
    return res.status(404).render('404');
  }
  res.render(`${lang}/alltrainings`);
});

app.get('/:lang(en|ru|th)/createtournament/:id', userAuthenticated, ensureClubOrAdmin, (req, res) => {
  const { lang, id } = req.params;
  if (!lang) {
    return res.status(404).render('404');
  }
  let link = `${lang}/createtournament`;

  return res.render(link, {
    userId: id,
    // userType: userType
  });
});

app.get('/:lang(en|ru|th)/soft/:id', userAuthenticated, ensureClub, (req, res) => {
  const { lang, id } = req.params;
  if (!lang) {
    return res.status(404).render('404');
  }
  let link = `${lang}/soft`;
  logAction(req, 'SOFT_ACCESS');

  return res.render(link, {
    userId: id,
    // userType: userType
  });
});



// app.get('/:lang/dashboard/editclub/:userId', ensureAuthenticated, (req, res) => {
//   const { lang, userId } = req.params;
//   const userType = req.session.userType; // Получаем тип пользователя из сессии

//   if (userType === 'club') { // Проверяем, что тип пользователя "club"
//       const link = `${lang}/dashboard/editclub`;
      
//       console.log(`Rendering: ${link} for userId: ${userId}`);
//       return res.render(link, {
//           userId: userId,
//           userType: userType
//       });
//   } else {
//       console.log('Access denied: User is not a club');
//       return res.status(403).send('Forbidden');
//   }
// });

// app.post('/get-playerIds', async (req, res) => {
//   // console.log('есть контакт');
//   try {
//       const { playerIds } = req.body;
//       // console.log(playerIds);

//       // Проверка входных данных
//       if (!Array.isArray(playerIds) || playerIds.length === 0) {
//           return res.status(400).json({ error: 'Invalid player IDs' });
//       }

//       // Фильтрация и преобразование идентификаторов
//       const validObjectIds = playerIds
//           .filter(id => ObjectId.isValid(id)) // Только валидные идентификаторы
//           .map(id => new ObjectId(id));

//       // console.log('валидные', validObjectIds);
//       if (validObjectIds.length === 0) {
//           return res.status(400).json({ error: 'No valid player IDs provided' });
//       }

//       // Получение данных из базы
//       const db = getDB(); // Предполагается, что функция getDB() возвращает подключение к базе
//       const players = await db.collection('users')
//           .find({ _id: { $in: validObjectIds } })
//           .toArray();

//       // Возвращаем результат
//       // console.log(players);
//       res.json(players);
//   } catch (error) {
//       console.error('Error fetching players:', error);
//       res.status(500).json({ error: 'Internal server error' });
//   }
// });

app.post('/get-playerIds', async (req, res) => {
  try {
      const { playerIds } = req.body;

      // Проверка входных данных
      if (!Array.isArray(playerIds) || playerIds.length === 0) {
          return res.status(400).json({ error: 'Invalid player IDs' });
      }

      // Фильтрация и преобразование идентификаторов
      const validObjectIds = playerIds
          .filter(id => ObjectId.isValid(id)) // Только валидные идентификаторы
          .map(id => new ObjectId(id));

      if (validObjectIds.length === 0) {
          return res.status(400).json({ error: 'No valid player IDs provided' });
      }

      // Подключение к базе данных
      const db = getDB();

      // Поиск в коллекции users
      const usersPromise = db.collection('users')
          .find({ _id: { $in: validObjectIds } })
          .toArray();

      // Поиск в коллекции coaches
      const coachesPromise = db.collection('coaches')
          .find({ _id: { $in: validObjectIds } })
          .toArray();

      // Ждем завершения обоих запросов
      const [users, coaches] = await Promise.all([usersPromise, coachesPromise]);

      // Объединение результатов
      const players = [...users, ...coaches];

      res.json(players);
  } catch (error) {
      console.error('Error fetching players:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/addtournament', ensureAuthenticated, ensureClubOrAdmin, async (req, res) => {
  const {
      date,
      datetime,
      language,
      tournamentname,
      tournamentdate,
      tournamenttime,
      tournamentprice,
      ratinglimit,
      phone,
      infotournaments,
      userid,
      location,
  } = req.body;

  // Валидация данных
  if (!tournamentname || !tournamentdate || !tournamenttime || !tournamentprice || !ratinglimit || !phone || !userid || !date || !location || !datetime || !language) {
      return res.status(400).json({ message: 'All required fields must be filled.' });
  }

  try {
      const db = getDB();

      // Находим клуб по ID
      const club = await db.collection('clubs').findOne({ _id: new ObjectId(userid) });

      if (!club) {
          // return res.status(404).render('404');
          return res.status(404).json({ message: 'Club not found.' });
      }

      // Формируем данные для турнира
      const tournamentData = {
          name: tournamentname,
          date: new Date(date),  // Дата турнира
          datetime: new Date(datetime), // Полная дата с временем
          contribution: parseFloat(tournamentprice), // Преобразуем цену в число
          ratingLimit: parseInt(ratinglimit, 10), // Преобразуем рейтинг в число
          contact: phone,
          // location: location,
          // info: infotournaments || '',
          // createdBy: userid,
          createdAt: new Date(),
          prizes: {
            [language]: infotournaments || ''
          },
          
          club: {
              name: club.name,
              logo: club.logo,
              _id: userid.toString(),
              location: location || []
          },
          address: club.address || {}, // Адрес клуба
          tables: club.tables || 0, // Количество столов
          location: club.location || location || [], // Географическое положение
          city: club.city ? club.city.toString() : '' // Город клуба
      };

      // Сохраняем данные турнира в базу данных
      const result = await db.collection('tournaments').insertOne(tournamentData);

      res.status(201).json({ message: 'Tournament created successfully!', tournamentId: result.insertedId });
  } catch (err) {
      console.error('Error while saving tournament:', err);
      res.status(500).json({ message: 'Failed to create the tournament. Please try again.' });
  }
});

app.post('/edittournament', ensureAuthenticated, ensureClubOrAdmin, async (req, res) => {
  const {
      date,
      datetime,
      language,
      tournamentname,
      tournamentprice,
      ratinglimit,
      phone,
      infotournaments,
      userid,
      tournamentid,
  } = req.body;

  if (!tournamentname || !date || !datetime || !tournamentprice || !ratinglimit || !phone || !userid || !language || !tournamentid) {
      return res.status(400).json({ message: 'All required fields must be filled.' });
  }

  try {
      const db = getDB();

      // Найти клуб по ID
      const club = await db.collection('clubs').findOne({ _id: new ObjectId(userid) });
      if (!club) return res.status(404).json({ message: 'Club not found.' });

      // Найти турнир по ID
      const tournament = await db.collection('tournaments').findOne({ _id: new ObjectId(tournamentid) });
      if (!tournament) return res.status(404).json({ message: 'Tournament not found.' });

      // Сравнение и формирование изменений
      const tournamentData = {};
      if (tournamentname !== tournament.name) tournamentData.name = tournamentname;
      if (new Date(date).toISOString().split('T')[0] !== tournament.date.toISOString().split('T')[0]) {
          tournamentData.date = new Date(date);
      }
      if (new Date(datetime).toISOString() !== tournament.datetime.toISOString()) {
          tournamentData.datetime = new Date(datetime);
      }
      if (parseFloat(tournamentprice) !== tournament.contribution) {
          tournamentData.contribution = parseFloat(tournamentprice);
      }
      if (parseInt(ratinglimit, 10) !== tournament.ratingLimit) {
          tournamentData.ratingLimit = parseInt(ratinglimit, 10);
      }
      if (phone !== tournament.contact) tournamentData.contact = phone;
      if (!tournament.prizes || tournament.prizes[language] !== infotournaments) {
          tournamentData.prizes = { ...tournament.prizes, [language]: infotournaments || '' };
      }

      // Логи изменений
      // console.log('Changes:', tournamentData);

      // Обновление данных, если есть изменения
      if (Object.keys(tournamentData).length > 0) {
          const result = await db.collection('tournaments').updateOne(
              { _id: new ObjectId(tournamentid) },
              { $set: tournamentData }
          );

          if (result.modifiedCount > 0) {
              return res.status(200).json({ message: 'Tournament updated successfully!' });
          } else {
              return res.status(400).json({ message: 'No changes were made.' });
          }
      } else {
          return res.status(400).json({ message: 'No fields were changed.' });
      }

  } catch (err) {
      console.error('Error while updating tournament:', err);
      res.status(500).json({ message: 'Failed to update the tournament. Please try again.' });
  }
});


// app.get('/:lang/share/result', (req, res) => {
//   const { lang } = req.params; // Язык из маршрута
//   const { name, image, ratingChange } = req.query; // Параметры запроса

//   // Определяем переводы в зависимости от языка
//   const translations = {
//       en: {
//           title: `${name}'s Achievement`,
//           description: `My rating grew by ${ratingChange} this week!`,
//       },
//       ru: {
//           title: `Достижение ${name}`,
//           description: `Мой рейтинг вырос на ${ratingChange} за эту неделю!`,
//       },
//       th: {
//           title: `ความสำเร็จของ ${name}`,
//           description: `คะแนนของฉันเพิ่มขึ้น ${ratingChange} ในสัปดาห์นี้!`,
//       },
//   };

//   const content = translations[lang] || translations['en']; // По умолчанию английский

//   res.send(`
//       <!DOCTYPE html>
//       <html lang="${lang}">
//       <head>
//           <meta property="og:title" content="${content.title}">
//           <meta property="og:description" content="${content.description}">
//           <meta property="og:image" content="${image}">
//           <meta property="og:url" content="${req.protocol}://${req.get('host')}${req.originalUrl}">
//           <meta property="og:type" content="article">
//           <meta property="og:image:width" content="1200">
//           <meta property="og:image:height" content="630">
//           <title>${content.title}</title>
//       </head>
//       <body style="background-color: #000817">
//           <h1 style="color:'#fff">${content.title}</h1>
//           <img src="${image}" alt="Achievement">
//           <p style="color: '#fff">${content.description}</p>
//       </body>
//       </html>
//   `);
// });


app.get('/:lang/share/result', (req, res) => {
  const { lang } = req.params;
  const { name, image, ratingChange, userPageLink } = req.query;

  console.log('Image URL received:', image);
  console.log('Link user:', userPageLink);

  const escapeHtml = (str) =>
      str.replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;");

  const translations = {
      en: { title: `${escapeHtml(name)}'s Achievement`, description: `My rating grew by ${escapeHtml(ratingChange)} this week!` },
      ru: { title: `Достижение ${escapeHtml(name)}`, description: `Мой рейтинг вырос на ${escapeHtml(ratingChange)} за эту неделю!` },
      th: { title: `ความสำเร็จของ ${escapeHtml(name)}`, description: `คะแนนของฉันเพิ่มขึ้น ${escapeHtml(ratingChange)} ในสัปดาห์นี้!` },
  };

  const content = translations[lang] || translations['en'];

  res.send(`
      <!DOCTYPE html>
      <html lang="${lang}">
      <head>
          <meta charset="utf-8">
          <meta property="og:title" content="${content.title}">
          <meta property="og:description" content="${content.description}">
          <meta property="og:image" content="${image}">
          <meta property="og:image:width" content="1200">
          <meta property="og:image:height" content="630">
          <meta property="og:url" content="${userPageLink}">
          <meta property="og:type" content="article">
          <title>${content.title}</title>
      </head>
      <body style="background-color: #000817; color: #fff; text-align: center;">
          <h1>${content.title}</h1>
          <img src="${image}" alt="Achievement" style="max-width: 100%; height: auto;">
          <p>${content.description}</p>
      </body>
      </html>
  `);
});

app.get('/:lang/dashboard/editclub/:userId', ensureAuthenticated, ensureClub, (req, res) => {
  const { lang, userId } = req.params;
  const { userId: sessionUserId, userType } = req.session;

  // Преобразуем строку userId в ObjectId для правильного сравнения
  const userIdObject = new ObjectId(userId);

  // Проверка на совпадение идентификаторов
  if (!sessionUserId.equals(userIdObject)) {
    return res.redirect(`404`); // Редирект на страницу 404 при несовпадении идентификаторов
  }

  // Проверка на тип пользователя (должен быть "club")
  if (userType !== 'club') {
    console.log('Ошибка: Несоответствие типа пользователя');
    return res.redirect(`404`); // Редирект на страницу 404 при несоответствии типа пользователя
  }

  // Если все проверки пройдены, рендерим страницу редактирования клуба
  const link = `${lang}/dashboard/editclub`;

  console.log(`Rendering: ${link} for userId: ${userId}`);

  return res.render(link, {
      userId: userId,
      userType: userType
  });
});


app.get('/:lang/dashboard/edituser/:userId', ensureAuthenticated, (req, res) => {
  const { lang, userId } = req.params;
  const { userId: sessionUserId, userType } = req.session;

  // Преобразуем строку userId в ObjectId для правильного сравнения
  const userIdObject = new ObjectId(userId);

  // Проверка на совпадение идентификаторов
  if (!sessionUserId.equals(userIdObject)) {
    return res.redirect(`404`); // Редирект на страницу 404 при несовпадении идентификаторов
  }

  // Проверка на тип пользователя
  if (userType !== 'user') {
    console.log('Ошибка: Несоответствие типа пользователя');
    return res.redirect(`404`); // Редирект на страницу 404 при несоответствии типа пользователя
  }

  // Если все проверки пройдены, рендерим страницу редактирования
  const link = `${lang}/dashboard/edituser`;

  console.log(`Rendering: ${link} for userId: ${userId}`);

  return res.render(link, {
      userId: userId,
      userType: userType
  });
});

app.get('/:lang/soft/tournament/:userId/:tournamentId', ensureAuthenticated, ensureClubOrAdmin, (req, res) => {
  const { lang, userId, tournamentId } = req.params;
  const { userId: sessionUserId, userType } = req.session;

  // Преобразуем строку userId в ObjectId для правильного сравнения
  const userIdObject = new ObjectId(userId);

  // Проверка на совпадение идентификаторов
  if (!sessionUserId.equals(userIdObject)) {
    console.log('wrong user');
    return res.redirect(`404`); // Редирект на страницу 404 при несовпадении идентификаторов
  }

  // Проверка на тип пользователя
  if (userType !== 'club') {
    console.log('Ошибка: Несоответствие типа пользователя');
    return res.redirect(`404`); // Редирект на страницу 404 при несоответствии типа пользователя
  }

  const link = `${lang}/soft/tournament`;
  let typeOfTournament;

  // if (tournamentId === 'new') {
  //   typeOfTournament = 'new';
  // } else {
  //   typeOfTournament = tournamentId;
  // }

  typeOfTournament = tournamentId;
  // Если все проверки пройдены, рендерим страницу редактирования
  // const link = `${lang}/soft/tournament`;

  // console.log(`Rendering: ${link} for userId: ${userId}`);
  logAction(req, 'SOFT_TOURNAMENT_ACCESS', { tournamentId });


  return res.render(link, {
      userId: userId,
      tournamentId: typeOfTournament,
      userType: userType
  });
});

app.post('/saveTournament', ensureClubOrAdmin, async (req, res) => {
  try {
      const db = getDB();
      const { tournamentId, state } = req.body;
      // console.log(state);
      // Проверяем корректность tournamentId
      let tournamentObjectId = null;
      if (tournamentId) {
          if (ObjectId.isValid(tournamentId)) {
              tournamentObjectId = new ObjectId(tournamentId);
          } else {
              return res.status(400).json({ error: 'Invalid tournament ID' });
          }
      } else {
          return res.status(400).json({ error: 'Tournament ID is required' });
      }

      const { players, retiredPlayers, tables, unratedPlayers, olympicFinalStarted, finalists, groupFinalSettings, groupFinalResults, bonusesApplied, groups, groupStageResults, finalStageBracket, waitingPairs, olympicRounds, finishedPairs, currentPairs, results, finished, coefficient, averageRating, typeOfTournament, roundCounter, round1Results, round2Results } = state;
      // console.log('players from client', players);
      // Обновляем турнирные данные
      const updateData = {};
      // console.log('players', players);
      if (Array.isArray(players)) {
          updateData.players = players.map(player => ({
              id: player.id,
              fullname: player.fullname || player.name,
              place: player.place || 0,
              place_round1: player.place_round1 || 0,
              place_round2: player.place_round2 || 0,
              rating: player.rating,
              wins: player.wins,
              logo: player.logo || "/icons/playerslogo/default_avatar.svg",
              losses: player.losses,
              bonus: player.bonus || 0,
              points_round1: player.points_round1 || 0,
              points_round2: player.points_round2 || 0,
              totalPoints: player.totalPoints,
              setsWon: player.setsWon,
              setsLost: player.setsLost,
              groupPoints : player.groupPoints,
              groupPlace : player.groupPlace,
              groupWins : player.groupWins,
              groupLosses : player.groupLosses,
              groupSetsWon : player.groupSetsWon,
              groupSetsLost : player.groupSetsLost,
              city: player.city
          }));
          // updateData.players = cleanPlayerData(updateData.players);
      }

      if (Array.isArray(retiredPlayers)) {
          updateData.retiredPlayers = retiredPlayers.map(player => ({
              id: player.id,
              fullname: player.fullname || player.name,
              logo: player.logo || "/icons/playerslogo/default_avatar.svg",
              place: player.place || '',
              rating: player.rating,
          }));
      }

      if (Array.isArray(unratedPlayers)) {
          updateData.unratedPlayers = unratedPlayers.map(player => ({
              id: player.id,
              fullname: player.fullname || player.name,
              birthYear: player.birthYear,
              place: player.place || 0,
              place_round1: player.place_round1 || 0,
              place_round2: player.place_round2 || 0,
              wins: player.wins,
              losses: player.losses,
              points_round1: player.points_round1 || 0,
              points_round2: player.points_round2 || 0,
              totalPoints: player.totalPoints,
              setsWon: player.setsWon,
              setsLost: player.setsLost,
              logo: '/icons/playerslogo/default_avatar.svg',
              city: player.city,
              nickname: player.nickname,
              unrated: true,
          }));
      }

      if (Array.isArray(waitingPairs)) {
          updateData.waitingPairs = waitingPairs.map(pair => ({
              player1: pair.player1,
              player2: pair.player2,
              groupIndex: pair?.groupIndex ?? null
          }));
      }

      if (Array.isArray(currentPairs)) {
          updateData.currentPairs = currentPairs.map(pair => ({
              player1: pair.player1,
              player2: pair.player2,
              groupIndex: pair?.groupIndex ?? null,
              table: pair?.table ?? null
          }));
      }
      if (Array.isArray(finishedPairs)) {
        updateData.finishedPairs = finishedPairs.map(pair => ({
            player1: pair.player1,
            player2: pair.player2,
            score1: pair.score1 ?? null,
            score2: pair.score2 ?? null,
            sets: pair.sets || null,
            round: pair.round ?? null,
            groupIndex: pair?.groupIndex ?? null
        }));
      }

      if (results) {
        updateData.results = results;
      }
      if (finished) {
        updateData.finished = finished;
      }
      if (averageRating) {
        updateData.averageRating = averageRating;
      }
      if (coefficient) {
        updateData.coefficient = coefficient;
      }

      if (typeOfTournament) {
        updateData.typeOfTournament = typeOfTournament;
      }

      if (roundCounter) {
        updateData.roundCounter = roundCounter;
      }

      if (round1Results) {
        updateData.round1Results = round1Results;
      }
      if (round2Results) {
        updateData.round2Results = round2Results;
      }
      if (olympicRounds) {
        updateData.olympicRounds = olympicRounds;
      }

      if (bonusesApplied) {
        updateData.bonusesApplied = bonusesApplied;
      }

      if (groups) {
        updateData.groups = groups;
      }

      if (groupStageResults) {
        updateData.groupStageResults = groupStageResults;
      }

      if (groupFinalSettings) {
        updateData.groupFinalSettings = groupFinalSettings;
      }
      if (groupFinalResults) {
        updateData.groupFinalResults = groupFinalResults;
      }

      if (finalStageBracket) {
        updateData.finalStageBracket = finalStageBracket;
      }
      if (olympicFinalStarted) {
        updateData.olympicFinalStarted = olympicFinalStarted;
      }
      if (finalists) {
        updateData.finalists = finalists;
      }

      if (tables) {
        updateData.tables = tables;
      }
      // Проверяем, есть ли уже `initialRatings`
      const existingTournament = await db.collection('tournaments').findOne(
          { _id: tournamentObjectId },
          { projection: { initialRatings: 1 } } // Запрашиваем только initialRatings
      );

      if (!existingTournament?.initialRatings && Array.isArray(state.initialRatings)) {
          updateData.initialRatings = state.initialRatings.map(player => ({
              id: player.id,
              fullname: player.fullname || player.name,
              rating: player.rating, // Сохраняем начальный рейтинг
          }));
          // console.log('рейтинги ДО сохранены');
      }
      

      const updateQuery = { $set: { ...updateData } };

      // Добавляем initialRatings только если его еще нет
      if (!existingTournament?.initialRatings && updateData.initialRatings) {
          updateQuery.$set.initialRatings = updateData.initialRatings;
      }

      await db.collection('tournaments').updateOne(
          { _id: tournamentObjectId },
          updateQuery,
          { upsert: true } // Создаёт турнир, если его нет
      );

      // Обновляем документ в базе данных
      // await db.collection('tournaments').updateOne(
      //     { _id: tournamentObjectId },
      //     { $set: { ...updateData},
      //       $setOnInsert: updateData.initialRatings 
      //       ? { initialRatings: updateData.initialRatings } 
      //       : {}
      //      }
      // );
      // // Обновляем документ в базе данных
      // await db.collection('tournaments').updateOne(
      //     { _id: tournamentObjectId },
      //     { $set: updateData }
      // );

      // if (result.modifiedCount === 0) {
      //     return res.status(404).json({ error: 'Tournament not found or no changes applied' });
      // }
      logAction(req, 'TOURNAMENT_UPDATED', { tournamentId });

      res.status(200).json({ message: 'Tournament updated successfully' });
  } catch (error) {
      console.error('Error saving tournament:', error);
      res.status(500).json({ error: 'An error occurred while saving the tournament' });
  }
});

function cleanPlayerData(player) {
  const result = {
      id: player.id,
      fullname: player.fullname || player.name,
      rating: player.rating,
      city: player.city,
      logo: player.logo || "/icons/playerslogo/default_avatar.svg",
  };

  const optionalFields = [
      'place', 'place_round1', 'place_round2',
      'wins', 'losses', 'bonus',
      'points_round1', 'points_round2',
      'totalPoints', 'setsWon', 'setsLost',
      'groupPoints', 'groupPlace',
      'groupWins', 'groupLosses',
      'groupSetsWon', 'groupSetsLost'
  ];

  optionalFields.forEach(field => {
      if (player[field] !== undefined && player[field] !== null) {
          result[field] = player[field];
      }
  });

  return result;
}


app.post("/updateTournamentCounterForPlayers", ensureClubOrAdmin, async (req, res) => {
  try {
    const players = req.body.players;
    const club = req.body.club;
    const clubId = club._id;
    const db = getDB();
    // console.log('club', club);
    if (!Array.isArray(players)) {
      return res.status(400).json({ error: "Неверный формат запроса" });
    }

    const updateTournamentField = async (collection, player) => {
      if (!ObjectId.isValid(player.id)) return null;

      // Пропускаем внерейтинговых игроков
      if (player.unrated) return null;

      const existingPlayer = await db.collection(collection).findOne({ _id: new ObjectId(player.id) });
      if (!existingPlayer) return null;

      const clubKey = `tournaments.${clubId}`;
      const wins = Number(player.wins) || 0;
      const losses = Number(player.losses) || 0;
      

      const updateQuery = {
        $inc: {
          tournamentsPlayed: 1,
          [clubKey]: 1,
          totalWins: wins,
          totalLosses: losses
        }
      };
      
       // 🏅 Добавим награды по местам
      const place = Number(player.place);
      if (place >= 1 && place <= 3) {
        const medalType = place === 1 ? "gold" : place === 2 ? "silver" : "bronze";
        const medalKey = `awards.${clubId}.${medalType}`;
        updateQuery.$inc[medalKey] = 1;
      }

      // 🏷 Название и логотип клуба (если ещё нет)
      if  (
        !existingPlayer.awards || 
        !existingPlayer.awards[clubId] || 
        !existingPlayer.awards[clubId].clubName
      ) {
        updateQuery.$set = {
          ...updateQuery.$set,
          [`awards.${clubId}.clubName`]: club.name,
          [`awards.${clubId}.clubLogo`]: club.logo
        };
      }


      // Если это первый турнир — добавим поле firstTournament
      if (!existingPlayer.firstTournamentDate) {
        updateQuery.$set = {
          firstTournamentDate: new Date()
        };
      }

      // console.log("⛏ Финальный updateQuery", updateQuery);

    
      const result = await db.collection(collection).findOneAndUpdate(
        { _id: new ObjectId(player.id) },
        updateQuery,
        { returnDocument: "after" }
      );

      return result; // возвращаем сразу объект игрока (result без .value)
    };

    let updatedCount = 0;

    for (const player of players) {
      const updated =
        (await updateTournamentField("users", player)) ||
        (await updateTournamentField("coaches", player));

      if (updated) updatedCount++;
    }

    if (updatedCount > 0) {
      logAction(req, 'PLAYERS_DATA_UPDATED', { clubId });

      return res.json({ message: `Обновлено ${updatedCount} игроков` });
    } else {
      return res.status(404).json({ error: "Игроки не найдены или все были нерейтинговыми" });
    }

  } catch (error) {
    console.error("❌ Ошибка при обновлении турниров:", error);
    res.status(500).json({ error: "Ошибка сервера" });
  }
});

// app.post("/updateBestVictories", async (req, res) => {
//   try {
//     const { data } = req.body;
//     const db = getDB();
//     console.log('лучшие победы', data);
//     if (!Array.isArray(data)) {
//       return res.status(400).json({ error: "Некорректный формат данных" });
//     }

//     let updatedCount = 0;

//     for (const entry of data) {
//       const { playerId, victories } = entry;

//       if (!ObjectId.isValid(playerId)) continue;
//       if (!Array.isArray(victories) || victories.length === 0) continue;

//       // Ищем игрока
//       const existingPlayer =
//         (await db.collection("users").findOne({ _id: new ObjectId(playerId) })) ||
//         (await db.collection("coaches").findOne({ _id: new ObjectId(playerId) }));

//       if (!existingPlayer) {
//         console.warn(`⚠️ Игрок с ID ${playerId} не найден`);
//         continue;
//       }

//       const existingVictories = Array.isArray(existingPlayer.bestVictories)
//         ? existingPlayer.bestVictories
//         : [];

//       // Объединяем победы и убираем дубликаты по opponentId
//       const merged = [...existingVictories, ...victories];

//       const uniqueVictoriesMap = new Map();
//       merged.forEach(v => {
//         if (!uniqueVictoriesMap.has(v.opponentId)) {
//           uniqueVictoriesMap.set(v.opponentId, v);
//         } else {
//           const existing = uniqueVictoriesMap.get(v.opponentId);
//           if (v.opponentRating > existing.opponentRating) {
//             uniqueVictoriesMap.set(v.opponentId, v); // Оставляем победу над более сильным рейтингом
//           }
//         }
//       });

//       // Отсортируем по рейтингу побеждённого и оставим топ-10
//       const topVictories = Array.from(uniqueVictoriesMap.values())
//         .sort((a, b) => b.opponentRating - a.opponentRating)
//         .slice(0, 10);

//       // Обновим игрока
//       const result = await db.collection(existingPlayer.type || "users").updateOne(
//         { _id: new ObjectId(playerId) },
//         { $set: { bestVictories: topVictories } }
//       );

//       updatedCount++;
//       console.log(`✅ Игрок ${existingPlayer.fullname || existingPlayer.nickname}: сохранено побед — ${topVictories.length}`);
//     }

//     res.json({ message: `Обновлены данные для ${updatedCount} игроков` });

//   } catch (error) {
//     console.error("❌ Ошибка при обновлении лучших побед:", error);
//     res.status(500).json({ error: "Ошибка сервера" });
//   }
// });

app.post("/updateBestVictories", ensureClubOrAdmin, async (req, res) => {
  try {
    const { data } = req.body;
    const db = getDB();
    // console.log('полученные данные data', data);
    if (!Array.isArray(data)) {
      return res.status(400).json({ error: "Некорректный формат данных" });
    }

    let updatedCount = 0;

    for (const entry of data) {
      const { playerId, victories } = entry;

      if (!ObjectId.isValid(playerId)) continue;
      if (!Array.isArray(victories) || victories.length === 0) continue;

      const objectId = new ObjectId(playerId);

      // Пытаемся найти игрока сначала в users, потом в coaches
      let collectionName = null;
      let existingPlayer = null;

      const user = await db.collection("users").findOne({ _id: objectId });
      if (user) {
        collectionName = "users";
        existingPlayer = user;
      } else {
        const coach = await db.collection("coaches").findOne({ _id: objectId });
        if (coach) {
          collectionName = "coaches";
          existingPlayer = coach;
        }
      }
      if (!existingPlayer || !collectionName) {
        console.warn(`⚠️ Игрок с ID ${playerId} не найден`);
        continue;
      }

      const existingVictories = Array.isArray(existingPlayer.bestVictories)
        ? existingPlayer.bestVictories
        : [];

      // Объединяем и убираем дубликаты по opponentId
      const merged = [...existingVictories, ...victories];

      const uniqueVictoriesMap = new Map();

      for (const victory of merged) {
        const existing = uniqueVictoriesMap.get(victory.opponentId);
        if (!existing || victory.opponentRating > existing.opponentRating) {
          uniqueVictoriesMap.set(victory.opponentId, victory);
        }
      }

      const topVictories = Array.from(uniqueVictoriesMap.values())
        .sort((a, b) => b.opponentRating - a.opponentRating)
        .slice(0, 10);

      await db.collection(collectionName).updateOne(
        { _id: objectId },
        { $set: { bestVictories: topVictories } }
      );

      updatedCount++;
      console.log(`✅ Игрок ${existingPlayer.fullname || existingPlayer.nickname}: сохранено побед — ${topVictories.length}`);
    }

    res.json({ message: `Обновлены данные для ${updatedCount} игроков` });
  } catch (error) {
    console.error("❌ Ошибка при обновлении лучших побед:", error);
    res.status(500).json({ error: "Ошибка сервера" });
  }
});





app.post("/updatePlayerRatings", ensureClubOrAdmin, async (req, res) => {
    try {
      const { players } = req.body;
      // console.log('players', players);
      const db = getDB();
  
      if (!players || players.length !== 2) {
        console.log("Ошибка обновления рейтинга! Нужно передать двух игроков!");
        return res.status(400).json({ error: "Нужно передать двух игроков" });
      }
  
      const [player1, player2] = players;
  
      // Проверяем, что объекты игроков не пустые
      if (!player1 || !player2) {
        console.log("Ошибка обновления рейтинга! Игроки не переданы!");
        return res.status(400).json({ error: "Игроки не переданы" });
      }

      // Проверяем, что у игроков есть ID
      if (!player1.id || !player2.id) {
        console.log("Ошибка обновления рейтинга! Отсутствует ID у одного из игроков");
        return res.status(400).json({ error: "Отсутствует ID у одного из игроков" });
      }

  
      // Функция поиска игрока в коллекции и обновления рейтинга
      const updatePlayerRating = async (collection, player) => {
        // console.log("обьект игрока", player);
        if (player.unrated) {
          console.log(`Игрок ${player.name} внерейтинговый (unrated), обновление пропущено.`);
          return player; // Просто возвращаем игрока, ничего не меняя
        }

        // Проверяем, что ID валидные
        if (!ObjectId.isValid(player.id)) {
          console.log("Некорректный ID игрока");
          return res.status(400).json({ error: "Некорректный ID игрока" });
        }
  
        const existingPlayer = await db.collection(collection).findOne({ _id: new ObjectId(player.id) });
  
        if (!existingPlayer) return null; // Если игрока нет в коллекции, возвращаем null
  
        // console.log("Игрок найден:", existingPlayer);
        
        const newRating = Number(player.rating) || 0;
        const currentMax = existingPlayer.maxRating ?? 0;

        const updateQuery = {
          $set: { rating: newRating },
        };
  
        if (newRating > currentMax) {
          updateQuery.$set.maxRating = newRating;
        }

        const result = await db.collection(collection).findOneAndUpdate(
          { _id: new ObjectId(player.id) },
          updateQuery,
          { returnDocument: "after", upsert: true }
        );

        return result || null; // Возвращаем обновленного игрока
      };
  
      // Ищем и обновляем рейтинг для обоих игроков
      const updatedPlayer1 =
        (await updatePlayerRating("users", player1)) ||
        (await updatePlayerRating("coaches", player1));
  
      const updatedPlayer2 =
        (await updatePlayerRating("users", player2)) ||
        (await updatePlayerRating("coaches", player2));
  
      // Проверяем, были ли найдены и обновлены игроки (или они были unrated)
      if (!updatedPlayer1 || !updatedPlayer2) {
        return res.status(404).json({ error: "Один или оба игрока не найдены в базе данных." });
      }
  
      console.log("Рейтинг обновлен:", updatedPlayer1, updatedPlayer2);
      logAction(req, 'PLAYERS_RATING_UPDATED', { clubId });
  
      res.json({ message: "Рейтинг игроков успешно обновлён", players: [updatedPlayer1, updatedPlayer2] });
  
    } catch (error) {
      console.error("Ошибка обновления рейтинга:", error);
      res.status(500).json({ error: "Ошибка сервера при обновлении рейтинга" });
    }
});

app.post("/updateRatingsAfterBonuses", ensureClubOrAdmin, async (req, res) => {
  try {
      const { players } = req.body;
      const db = getDB();

      if (!Array.isArray(players) || players.length === 0) {
          return res.status(400).json({ error: "Передан пустой список игроков" });
      }

      const updatedPlayers = [];

      const updatePlayerRating = async (collection, player) => {
          if (player.unrated) return null; // Пропускаем внерейтинговых

          if (!ObjectId.isValid(player.id)) {
              console.warn(`Некорректный ID игрока: ${player.id}`);
              return null;
          }

          const existingPlayer = await db.collection(collection).findOne({ _id: new ObjectId(player.id) });
          if (!existingPlayer) return null;

          const newRating = Number(player.rating) || Number(existingPlayer.rating) || 0;
          const currentMax = existingPlayer.maxRating ?? 0;
          // console.log("Игрок найден:", existingPlayer, "Новый рейтинг:", newRating, "Текущий максимум:", currentMax); 
          const updateQuery = {
              $set: { rating: newRating }
          };

          if (newRating > currentMax) {
              updateQuery.$set.maxRating = newRating;
          }

          const result = await db.collection(collection).findOneAndUpdate(
              { _id: new ObjectId(player.id) },
              updateQuery,
              { returnDocument: "after" }
          );

          return result?.value || null;
      };

      for (const player of players) {
          const updated =
              (await updatePlayerRating("users", player)) ||
              (await updatePlayerRating("coaches", player));
          if (updated) {
              updatedPlayers.push(updated);
          }
      }

      // if (updatedPlayers.length === 0) {
      //     return res.status(404).json({ error: "Ни один игрок не был обновлён" });
      // }

      res.json({
          message: `Обновлено рейтингов у ${updatedPlayers.length} игроков`,
          updatedPlayers
      });

  } catch (error) {
      console.error("Ошибка при обновлении рейтингов:", error);
      res.status(500).json({ error: "Ошибка сервера при обновлении рейтингов" });
  }
});


app.get('/:lang/dashboard/:userType/:userId', ensureAuthenticated, (req, res) => {
  const { lang, userType, userId } = req.params;
  const { userId: sessionUserId } = req.session;

  // Преобразуем строку userId в ObjectId для правильного сравнения
  const userIdObject = new ObjectId(userId);
  let link;
  // Проверка на совпадение идентификаторов
  if (!sessionUserId.equals(userIdObject)) {
    if (userType === 'user') {
      link = `/${lang}/allplayers/${userId}`;
    } else if (userType === 'club') {
      link = `/${lang}/allclubs/${userId}`;
    } else if (userType === 'coach') {
      link = `/${lang}/allcoaches/${userId}`;
    } else {
        return res.status(404).render('404');
    }
    
    return res.redirect(link);
  }

  // Проверка на совпадение типа пользователя
  if (req.session.userType !== userType) {
    console.log('Ошибка: Несоответствие типа пользователя');
    return res.status(404).render('404');
  }


  link = `${lang}/dashboard/${userType}`;
  // console.log(`Доступ к профилю пользователя ${userId}`);
  logAction(req, 'PLAYER_PROFILE_ACCESS', { userId });

  return res.render(link, {
    userId: userId,
    userType: userType
  });
});


app.use((err, req, res, next) => {
  if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File too large. Maximum size is 1 MB.' });
  }
  res.status(500).json({ error: 'Internal Server Error' });
});


// Маршрут для запроса восстановления пароля
app.post('/api/restore-password', async (req, res) => {
  const { clientLang } = req.body;
  let { email } = req.body;
  
  email = email.trim().toLowerCase();
  try {
      const db = getDB();
      let collection;

      // Поиск в коллекции пользователей
      let user = await db.collection('users').findOne({ email });

      if (user) {
          collection = 'users';
      } else {
          // Если не найдено, поиск в коллекции тренеров
          user = await db.collection('coaches').findOne({ email });

          if (user) {
              collection = 'coaches';
          } else {
            // Если не найдено, поиск в коллекции тренеров
            user = await db.collection('clubs').findOne({ email });
    
            if (user) {
                collection = 'clubs';
            } else {
                return res.status(404).json({ message: 'User with this email not found' });
            }
        }
          // } else {
          //     return res.status(404).json({ message: 'User with this email not found' });
          // }
      } 

      // Генерация токена для восстановления пароля
      const token = crypto.randomBytes(20).toString('hex');
      const resetPasswordToken = token;
      const resetPasswordExpires = Date.now() + 3600000; // 1 час

      await db.collection(collection).updateOne(
          { email },
          { $set: { resetPasswordToken, resetPasswordExpires } }
      );

      // Создание ссылки для восстановления пароля
      const resetUrl = `http://${req.headers.host}/reset-password/${token}`;

      // Отправка письма
      let mailOptions = {
          to: email,
          from: notificateEmail,
          subject: 'Password Reset',
          text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n
                 Please click on the following link, or paste this into your browser to complete the process:\n
                 ${resetUrl}\n
                 If you did not request this, please ignore this email and your password will remain unchanged.\n`
        };

      if (clientLang === 'russian') {
        mailOptions = {
          to: email,
          from: notificateEmail,
          subject: 'Сброс пароля',
          text: `Вы получили это сообщение, потому что вы (или кто-то другой) запросили сброс пароля для вашего аккаунта.\n
                Пожалуйста, нажмите на следующую ссылку или вставьте её в браузер, чтобы завершить процесс:\n
                ${resetUrl}\n
                Если вы не запрашивали это, просто проигнорируйте это письмо, и ваш пароль останется без изменений.\n`
        };
      };

      if (clientLang === 'thai') {
        mailOptions = {
          to: email,
          from: notificateEmail,
          subject: 'รีเซ็ตรหัสผ่าน',
          text: `คุณได้รับอีเมลนี้เนื่องจากคุณ (หรือบุคคลอื่น) ได้ร้องขอให้รีเซ็ตรหัสผ่านสำหรับบัญชีของคุณ\n
                โปรดคลิกที่ลิงก์ต่อไปนี้หรือวางลิงก์นี้ในเบราว์เซอร์ของคุณเพื่อดำเนินการให้เสร็จสิ้น:\n
                ${resetUrl}\n
                หากคุณไม่ได้ร้องขอสิ่งนี้ โปรดเพิกเฉยต่ออีเมลนี้และรหัสผ่านของคุณจะยังคงไม่เปลี่ยนแปลง\n`
        };
      };

      try {
          const info = await transporter.sendMail(mailOptions);
          // console.log('Email sent:', info.response);
      } catch (error) {
          console.error('Error sending email:', error);
      }
      logAction(req, 'PASSWORD_RESET_REQUEST', { email, user });

      res.status(200).json({ message: 'Password reset link sent to your email' });
  } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ message: 'Internal server error' });
  }
});

// Маршрут для рендеринга формы сброса пароля
app.get('/reset-password/:token', async (req, res) => {
  const { token } = req.params;

  try {
      const db = getDB();

      // Поиск в коллекции пользователей
      let user = await db.collection('users').findOne({
          resetPasswordToken: token,
          resetPasswordExpires: { $gt: Date.now() }
      });

      if (!user) {
          // Если не найдено, поиск в коллекции тренеров
          user = await db.collection('coaches').findOne({
              resetPasswordToken: token,
              resetPasswordExpires: { $gt: Date.now() }
          });
          if (!user) {
              user = await db.collection('clubs').findOne({
                  resetPasswordToken: token,
                  resetPasswordExpires: { $gt: Date.now() }
              });

              if (!user) {
                  return res.status(400).json({ message: 'Password reset token is invalid or has expired.' });
              }
        }
      }

      // Рендеринг формы сброса пароля
      res.render('reset-password', { token });
  } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ message: 'Internal server error' });
  }
});

// Маршрут для сброса пароля
app.post('/reset-password/:token', async (req, res) => {
  const { token } = req.params;
  const { password, confirmPassword } = req.body;
  let collection;
  try {
      const db = getDB();

      // Поиск в коллекции пользователей
      let user = await db.collection('users').findOne({
          resetPasswordToken: token,
          resetPasswordExpires: { $gt: Date.now() }
      });

      collection = 'users';

      if (!user) {
          // Если не найдено, поиск в коллекции тренеров
          user = await db.collection('coaches').findOne({
              resetPasswordToken: token,
              resetPasswordExpires: { $gt: Date.now() }
          });
          collection = 'coaches';
          if (!user) {
              user = await db.collection('clubs').findOne({
                  resetPasswordToken: token,
                  resetPasswordExpires: { $gt: Date.now() }
              });
              collection = 'clubs';
              if (!user) {
                  return res.status(400).json({ message: 'Password reset token is invalid or has expired.' });
              }
          }
      }

      if (password !== confirmPassword) {
          return res.status(400).json({ message: 'Passwords do not match.' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      // const collection = user.collection === 'users' ? 'users' : 'coaches';
      // console.log(collection);
      // await db.collection(collection).updateOne(
      //     { resetPasswordToken: token },
      //     {
      //         $set: { password: hashedPassword },
      //         $unset: { resetPasswordToken: "", resetPasswordExpires: "" }
      //     }
      // );

      // res.status(200).json({ message: 'Password has been successfully reset.' });

      // Обновляем пароль и удаляем токен
      const updateResult = await db.collection(collection).updateOne(
          { resetPasswordToken: token },
          {
              $set: { password: hashedPassword },
              $unset: { resetPasswordToken: " ", resetPasswordExpires: " " } // Удаляем токен и срок его действия
          }
      );

      if (updateResult.modifiedCount === 1) {
          logAction(req, 'PASSWORD_SUCCESSFULLY_RESET');
          res.status(200).json({ message: 'Password has been successfully reset.' });
      } else {
          res.status(500).json({ message: 'Failed to update the password. Please try again.' });
      }
  } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ message: 'Internal server error' });
  }
});




// app.get('/:lang(en|ru|th)/:page', (req, res) => {
//   const { lang, page } = req.params;
//   if (!lang) {
//     return res.status(404).render('404');
//   }
//   res.render(`${lang}/${page}`);
// });

app.get('/:lang(en|ru|th)/:page', (req, res) => {
  const { lang, page } = req.params;

  if (!lang) {
    return res.status(404).render('404');
  }

  res.render(`${lang}/${page}`, (err, html) => {
    if (err) {
      console.warn(`Страница не существует - 404 /${lang}/${page}`);
      return res.status(404).render('404');
    }
    res.send(html);
  });
});


// Проверка данных
app.get('/check-email', async (req, res) => {
  const email = req.query.email;
  const db = getDB();
  const user = await db.collection('users').findOne({ email });
  res.json({ unique: !user });
});

app.get('/check-login', async (req, res) => {
  const login = req.query.login;
  const db = getDB();
  const user = await db.collection('users').findOne({ login });
  const coach = await db.collection('coaches').findOne({ login });
  const club = await db.collection('clubs').findOne({ login });
  const admin = await db.collection('admin').findOne({ login });
  if (user) {
    return res.json({ unique: false });
  }
  
  if (coach) {
    return res.json({ unique: false });
  }

  if (club) {
    // console.log(club);
    return res.json({ unique: false });
  }
  
  if (admin) {
    return res.json({ unique: false });
  }

  // Если логин не найден ни в одной из коллекций
  res.json({ unique: true });
});

// API маршруты
app.get('/cities/:cityId', async (req, res) => {
  const cityId = req.params.cityId;
  // console.log(cityId);
  if (cityId === 'english' || cityId === 'russian' || cityId === 'thai') {
    return next();
  }
  try {
    const db = getDB();
    const city = await db.collection('cities').findOne({ _id: new ObjectId(cityId) });
    // console.log(city);
    if (!city) {
        return res.status(404).json({ error: 'City not found' });
    }

    res.json(city);
  } catch (err) {
    console.error('Error fetching city:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/cities', async function(req, res) {
  const language = req.query.language || 'english';
  try {
    const db = getDB();
     // Извлекаем все города с нужными проекциями
     const allcities = await db.collection('cities').find({}, { projection: { _id: 0, [language]: 1 } }).toArray();
     const citiesObjects = await db.collection('cities').find({}).toArray();
     const cities = allcities.map(city => city[language]); // Массив с названиями на нужном языке
 
     res.json({
        citiesObjects,  // Массив названий городов на нужном языке
        cities          // Оригинальный массив объектов городов
     });

    // const cities = await db.collection('cities').find({}, { projection: { _id: 0, [language]: 1 } }).toArray();
    // // console.log(cities);
    // res.json(cities.map(city => city[language]));
  } catch (err) {
    console.error('Error when loading the list of cities from the database:', err);
  }
});

app.get('/rackets', async function(req, res) {
  try {
    const db = getDB();
    const rackets = await db.collection('rockets').findOne();
    // console.log(cities);
    res.json(rackets);
  } catch (err) {
    console.error('Error when loading the list of rackets from the database:', err);
  }
});

app.get('/userForHeader/:userId/:userType', async (req, res) => {
  const userId = req.params.userId;
  const userType = req.params.userType;

  try {
    const db = getDB();
    let user;
    if (userType === 'user') {
      user = await db.collection('users').findOne({ _id: new ObjectId(userId) });
    } else if (userType === 'coach') {
      user = await db.collection('coaches').findOne({ _id: new ObjectId(userId) });
    } else if (userType === 'club') {
      user = await db.collection('clubs').findOne({ _id: new ObjectId(userId) });
    }
    
    
    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }
    // console.log(user.fullname);
    res.json(user);
  } catch (err) {
    console.error('Error fetching user:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});


app.get('/coaches', async function(req, res) {
  const db = getDB();
  const coaches = await db.collection('coaches').find().toArray();
  if (coaches) {
    res.json(coaches);
  } else {
    res.status(404).json({ error: 'Coaches not found' });
  }
});

app.get('/adv', async function(req, res) {
  try {
    const db = getDB();
    const adv = await db.collection('adv').find().toArray();
    
    res.json(adv);
  } catch (err) {
    console.error('Ads not found:', err);
  }
});

app.get('/clubs', async function(req, res) {
  const db = getDB();
  const clubs = await db.collection('clubs').find().toArray();
  if (clubs) {
    res.json(clubs);
  } else {
    res.status(404).json({ error: 'Clubs not found' });
  }
});

app.get('/advs', ensureAdmin, async function(req, res) {
  const db = getDB();
  const advs = await db.collection('adv').find().toArray();
  if (advs) {
    res.json(advs);
  } else {
    res.status(404).json({ error: 'Advs not found' });
  }
});

app.get('/clubsrequest', ensureAdmin, async function(req, res) {
  const db = getDB();
  const requests = await db.collection('requestfromclub').find().toArray();
  if (requests) {
    res.json(requests);
  } else {
    res.status(404).json({ error: 'Requests not found' });
  }
});

app.get('/coachesrequest', ensureAdmin, async function(req, res) {
  const db = getDB();
  const requests = await db.collection('requestfromcoach').find().toArray();
  if (requests) {
    res.json(requests);
  } else {
    res.status(404).json({ error: 'Requests not found' });
  }
});

app.get('/ru/dashboard/admin/editadv/:advId', ensureAdmin, (req, res) => {
  const { advId } = req.params;
  const userType = req.session.userType; // Получаем тип пользователя из сессии
  // console.log(advId, userType);
  if (userType) { 
      const link = `ru/dashboard/admin/editadv/editadv`;
      // console.log(link);
      return res.render(link, {
        advId: advId,
      });
  } else {
      console.log('Access denied: only for admin');
      return res.status(403).send('Forbidden');
  }
});

app.get('/ru/dashboard/admin/edittournament/:tournamentId', ensureAdmin, (req, res) => {
  const { tournamentId } = req.params;
  const userType = req.session.userType; // Получаем тип пользователя из сессии
  // console.log(tournamentId, userType, 'есть контакт');
  if (userType === "admin") { 
      const link = `ru/dashboard/admin/edittournament/tournament`;
      // console.log(link);
      return res.render(link, {
        tournamentId: tournamentId,
      });
  } else {
      console.log('Access denied: only for admin');
      return res.status(403).send('Forbidden');
  }
});

app.get('/clubs/:clubId', async function(req, res) {
  const clubId = req.params.clubId;
  const db = getDB();
  const club = await db.collection('clubs').findOne({ _id: new ObjectId(clubId) });
  if (club) {
    res.json(club);
  } else {
    res.status(404).json({ error: 'Clubs not found' });
  }
});

app.get('/get-data-training', async (req, res) => {
  const { trainingId } = req.query;
  try {
    const db = getDB();
    const dataTraining = await db.collection('trainings').findOne({ _id: new ObjectId(trainingId) });
    if (!dataTraining) {
      return res.status(404).send('Training not found');
    }
    res.json(dataTraining);
  } catch (error) {
    console.error('Error fetching training data:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/trainer/:trainerId', async (req, res) => {
  const trainerId = req.params.trainerId;

  try {
    const db = getDB();
      const trainer = await db.collection('coaches').findOne({ _id: new ObjectId(trainerId) });
      // console.log(trainer);
      if (!trainer) {
          return res.status(404).json({ error: 'Trainer not found' });
      }

      res.json(trainer);
  } catch (err) {
      console.error('Error fetching trainer:', err);
      res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/get-data-club', async (req, res) => {
  const { clubId } = req.query;
  try {
    if (!ObjectId.isValid(clubId)) {
      return res.status(400).send('Invalid Club ID');
    }
    // console.log(ObjectId.isValid(clubId));
    const db = getDB();
    const dataClub = await db.collection('clubs').findOne({ _id: new ObjectId(clubId) });
    if (!dataClub) {
      return res.status(404).send('Club not found');
    }
    res.json(dataClub);
  } catch (error) {
    console.error('Error fetching club data:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/get-data-clubrequest', async (req, res) => {
  const { clubId } = req.query;
  try {
    if (!ObjectId.isValid(clubId)) {
      return res.status(400).send('Invalid Club ID');
    }
    // console.log(ObjectId.isValid(clubId));
    const db = getDB();
    const dataClub = await db.collection('requestfromclub').findOne({ _id: new ObjectId(clubId) });
    if (!dataClub) {
      return res.status(404).send('Club not found');
    }
    res.json(dataClub);
  } catch (error) {
    console.error('Error fetching club data:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/get-data-adv', async (req, res) => {
  const { advId } = req.query;
  try {
    if (!ObjectId.isValid(advId)) {
      return res.status(400).send('Invalid Club ID');
    }
    // console.log(ObjectId.isValid(clubId));
    const db = getDB();
    const dataAdv = await db.collection('adv').findOne({ _id: new ObjectId(advId) });
    if (!dataAdv) {
      return res.status(404).send('Adv not found');
    }
    res.json(dataAdv);
  } catch (error) {
    console.error('Error fetching club data:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/get-data-tournament', async (req, res) => {
  
  const { tournamentId } = req.query;
  // console.log("🔍 Получен запрос с ID:", tournamentId);
  try {
    const db = getDB();
    const dataTournament = await db.collection('tournaments').findOne({ _id: new ObjectId(tournamentId) });
    if (!dataTournament) {
      return res.status(404).send('Tournament not found');
    }
    // console.log('турнир получен');
    res.json(dataTournament);
  } catch (error) {
    console.error('Error fetching tournament data:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/tournaments-by-club/:clubId',  ensureClubOrAdmin, async (req, res) => {
  const { clubId } = req.params;

  try {
      
      // Убедитесь, что переданный ID корректный
      if (!ObjectId.isValid(clubId)) {
          return res.status(400).json({ error: 'Invalid club ID format' });
      }
      const db = getDB();
      // Запрос к базе данных для получения турниров с указанным клубом
      const tournaments = await db.collection('tournaments')
      .find({
        'club._id': clubId,
        $or: [
          { finished: false },
          { finished: { $exists: false } }
        ]
      })
      .sort({ datetime: 1 })
      .toArray();

      if (!tournaments.length) {
          return res.status(404).json({ message: 'No tournaments found for this club ID' });
      }

      // Возвращаем найденные турниры
      res.status(200).json(tournaments);
  } catch (error) {
      console.error('Error fetching tournaments:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
});


app.get('/get-data-player', async (req, res) => {
  const { userId } = req.query;
  // console.log(userId);
  try {
    const db = getDB();
    const dataPlayer = await db.collection('users').findOne({ _id: new ObjectId(userId) });
    // console.log(dataPlayer);
    if (!dataPlayer) {
      return res.status(404).send('Player not found');
    }
    res.json(dataPlayer);
  } catch (error) {
    console.error('Error fetching player data:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/get-data-coach', async (req, res) => {
  const { userId } = req.query;
  // console.log(userId);
  try {
    const db = getDB();
    const dataPlayer = await db.collection('coaches').findOne({ _id: new ObjectId(userId) });
    // console.log(dataPlayer);
    if (!dataPlayer) {
      return res.status(404).send('Player not found');
    }
    res.json(dataPlayer);
  } catch (error) {
    console.error('Error fetching player data:', error);
    res.status(500).send('Internal Server Error');
  }
});


app.get('/get-past-tournaments', async (req, res) => {
  try {
    const db = getDB();

    // Запрос к MongoDB с фильтром по дате и параметру finished
    const pastTournaments = await db.collection('tournaments')
      .find({
        datetime: { $lte: new Date() }, // Только прошедшие турниры
        finished: true // Только завершенные турниры
      })
      .toArray();

    // Дополнительная обработка данных о игроках
    await Promise.all(pastTournaments.map(async (tournament) => {
      if (tournament.players && Array.isArray(tournament.players)) {
        tournament.players = await Promise.all(tournament.players.map(async (player) => {
          const user = await db.collection('users').findOne({ _id: new ObjectId(player.id) });
          return {
            ...player,
            name: user ? user.fullname : 'Unknown User'
          };
        }));
      }
      return tournament;
    }));

    res.status(200).json(pastTournaments);
  } catch (err) {
    console.error(`Failed to retrieve past tournaments: ${err}`);
    res.status(500).json({ error: 'An error occurred while retrieving past tournaments' });
  }
});

app.get('/get-future-tournaments', async (req, res) => {
  try {
    const db = getDB();
    const tournaments = await db.collection('tournaments').find().toArray();
    res.json(tournaments);
  } catch (err) {
    console.error(`Failed to retrieve tournaments: ${err}`);
    res.status(500).json({ error: 'An error occurred while retrieving tournaments' });
  }
});

app.get('/get-trainings', async (req, res) => {
  try {
    const db = getDB();
    const trainings = await db.collection('trainings').find().toArray();
    res.json(trainings);
  } catch (err) {
    console.error('Trainings not found:', err);
    res.status(404).json({ error: 'Trainings not found' });
  }
});

app.get('/get-players', async (req, res) => {
  try {
    const db = getDB();
    const players = await db.collection('users').find({ role: { $ne: 'admin' } }).toArray();
      res.json(players);
    } catch (err) {
      console.error('Error fetching players:', err);
      res.status(500).json({ error: 'An error occurred while retrieving players' });
    }
});

app.get('/get-players-coaches', async (req, res) => {
  try {
    const db = getDB();
    const players = await db.collection('users').find({ role: { $ne: 'admin' } }).toArray();
    const coaches = await db.collection('coaches').find({ role: { $ne: 'admin' } }).toArray();
    
    if (!players || !coaches) {
      throw new Error('Failed to retrieve players or coaches');
    }

    const allplayers = [...players, ...coaches];  
    res.json(allplayers);
    } catch (err) {
      console.error('Error fetching players:', err);
      res.status(500).json({ error: 'An error occurred while retrieving players' });
    }
});


app.post('/getClubPlayersFull', async (req, res) => {
  try {
    const { clubId } = req.body;
    if (!clubId) {
      return res.status(400).json({ error: "Не передан clubId" });
    }

    const db = getDB();
    const tournaments = await db.collection("tournaments").find({ "club._id": clubId, finished: true }).toArray();

    const allPlayerIds = new Set();
    const prizePlayerIds = new Set();

    tournaments.forEach(t => {
      const players = t.players || [];
      players.forEach(p => allPlayerIds.add(p));
      
      // Призёры
      
      (t.players || []).forEach(player => {
        if (player.place && player.place >= 1 && player.place <= 3) {
          prizePlayerIds.add(player.id);
        }
      });
      
      // const finalResults = t.finalResults || [];
      // finalResults.forEach(p => {
      //   if (p.place && p.place >= 1 && p.place <= 3) {
      //     prizePlayerIds.add(p.id);
      //   }
      // });

    });

    const allIds = Array.from(allPlayerIds).map(id => new ObjectId(id));
    const prizeIds = Array.from(prizePlayerIds);

    const users = await db.collection("users").find({ _id: { $in: allIds } }).toArray();
    const coaches = await db.collection("coaches").find({ _id: { $in: allIds } }).toArray();
    const allPlayers = [...users, ...coaches];

    res.json({
      players: allPlayers,
      prizePlayerIds: prizeIds, // 👈 используем на клиенте для фильтрации победителей
    });

  } catch (error) {
    console.error("❌ Ошибка при получении игроков клуба:", error);
    res.status(500).json({ error: "Ошибка сервера" });
  }
});




app.get('/get-players-with-city/', async (req, res) => {
  const lang = req.query.lang || 'english';
  try {
    const db = getDB();

    // Получаем всех игроков и тренеров
    const players = await db.collection('users').find({ role: { $ne: 'admin' } }).toArray();
    const coaches = await db.collection('coaches').find({ role: { $ne: 'admin' } }).toArray();

    if (!players && !coaches) {
      return res.status(404).json({ error: 'No players or coaches found' });
    }

    const allPlayers = [...players, ...coaches];

    const cityIds = allPlayers
      .map(player => player.city) // Извлекаем $oid
      .filter(cityId => cityId) // Исключаем пустые значения
      .map(cityId => new ObjectId(cityId)); // Преобразуем в ObjectId

    if (!cityIds.length) {
      return res.status(200).json(allPlayers.map(player => ({
        id: player._id,
        name: player.fullname || player.name,
        logo: player.logo,
        birthYear: player.birthdayDate ? new Date(player.birthdayDate).getFullYear() : '',
        cityName: 'Unknown City',
        role: player.role,
      })));
    }

    // Получаем данные городов
    const cities = await db.collection('cities').find({ _id: { $in: cityIds } }).toArray();
    
    const cityMap = cities.reduce((acc, city) => {
      acc[city._id.toString()] = city[lang] || city['english'] ||  city.english || 'Unknown City';
      return acc;
    }, {});


    // Добавляем название города в данные игроков и тренеров
    const enrichedPlayers = allPlayers.map(player => ({
      id: player._id,
      name: player.fullname || player.name,
      nickname: player.nickname,
      logo: player.logo,
      rating: player.rating,
      birthYear: player.birthdayDate ? new Date(player.birthdayDate).getFullYear() : ' ',
      cityName: cityMap[player.city?.toString()] || ' '
    }));

    res.status(200).json(enrichedPlayers);
  } catch (err) {
    console.error('Error fetching players with city:', err);
    res.status(500).json({ error: 'An error occurred while retrieving players' });
  }
});

app.post('/createTournament', ensureClubOrAdmin, async (req, res) => {
  try {
      const db = getDB();
      // console.log(req.body);
      // Получаем данные из тела запроса
      const { tournamentname, infotournaments, tournamentprice, phone, datetime, date, ratinglimit, language, clubId } = req.body;

      // Проверяем, что все необходимые поля заполнены
      if (!tournamentname || !tournamentprice || !datetime || !date || !clubId || !ratinglimit) {
          return res.status(400).json({ error: 'All fields are required.' });
      }

      // Проверяем, что clubId корректный
      if (!ObjectId.isValid(clubId)) {
          return res.status(400).json({ error: 'Invalid club ID.' });
      }

      // Находим клуб по clubId
      const club = await db.collection('clubs').findOne({ _id: new ObjectId(clubId) });
      // console.log('найдет клуб', club);
      if (!club) {
          return res.status(404).json({ error: 'Club not found.' });
      }

      // Создаем объект турнира
      const newTournament = {
          name: tournamentname,
          datetime: new Date(datetime),
          date: new Date(date),
          price: parseFloat(tournamentprice),
          restrictions: parseFloat(ratinglimit),
          ratingLimit: parseFloat(ratinglimit),
          prizes: {
              [language]: infotournaments || ''
          },
          contact: phone || '',
          createdAt: new Date(), // Дата создания турнира
          players: [], // Список игроков (пустой по умолчанию)
          unratedPlayers: [], // Список внерейтинговых игроков (пустой по умолчанию)
          club: {
              name: club.name,
              logo: club.logo,
              _id: club._id.toString(),
              location: club.location || []
          },
          address: club.address || {}, // Адрес клуба
          tables: club.tables || 0, // Количество столов
          location: club.location || [], // Географическое положение
          city: {
            _id: club.city ? club.city.toString() : '' // Город клуба
          }
      };

      // console.log('отправляемый обьект', newTournament);
      // Сохраняем турнир в базе данных
      const result = await db.collection('tournaments').insertOne(newTournament);
      // Возвращаем ответ с данными о созданном турнире
      logAction(req, 'TOURNAMENT_CREATED', { clubId });

      res.status(201).json({
          message: 'Tournament created successfully!',
          tournamentId: result.insertedId,
      });
  } catch (error) {
      console.error('Error creating tournament:', error.message, error.stack);
      res.status(500).json({ error: 'An error occurred while creating the tournament.' });
  }
});



app.get('/get-playerData', async (req, res) => {
  // const userId = req.params.userId;
  const { playerId, lang } = req.query;
  // console.log(playerId);
  try {
    const db = getDB();
    const player = await db.collection('users').findOne({ _id: new ObjectId(playerId) });
    res.json(player);
  } catch (err) {
    console.error('Error fetching player:', err);
    res.status(500).json({ error: 'An error occurred while retrieving player' });
  }
});


const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: notificateEmail,
    pass: notificatePass
  }
});

app.post('/register', [
  body('password')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
    .matches(/^(?=.*\d)(?=.*[a-zа-яё\u0E01-\u0E5B])(?=.*[A-ZА-ЯЁ]).{8,}$/).withMessage('Password must contain at least one number, one lowercase, and one uppercase letter')
], async function (req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ status: 'error', errors: errors.array() });
  }

  const defaultLogo = '/icons/playerslogo/default_avatar.svg';

  const { email, nickname, password, confirm_password, city, fullname, hand, date, registeredDate, policy, clientLang } = req.body;

  if (!email || !password || !confirm_password || !city || !fullname || !hand || !date || !registeredDate || !policy) {
    res.status(400).json({ error: 'Something wrong. Please come back to homepage and try again' });
    return;
  }

  

  const parts = date.split(".");
  const birthdayDate = new Date(`${parts[1]}/${parts[0]}/${parts[2]}`);

  try {
    // Check if the city already exists
    let cityId;
    const db = getDB();

    const existingClub = await db.collection('clubs').findOne({ email });
    const existingPlayer = await db.collection('users').findOne({ email });
    const existingCoach = await db.collection('coaches').findOne({ email });
    if (existingClub || existingPlayer || existingCoach) {
        return res.status(400).json({ status: 'error', message: 'A club or user with this email already exists!' });
    }
    const cityExists = await db.collection('cities').findOne({ [clientLang]: city });
    if (cityExists) {
      cityId = cityExists._id;
    } else {
      const newCity = { [clientLang]: city };
      const result = await db.collection('cities').insertOne(newCity);
      cityId = result.insertedId;
    }

    // Хешируем пароль перед сохранением
    const hashedPassword = await bcrypt.hash(password, 10);

    await db.collection('users').insertOne({
      email,
      nickname,
      password: hashedPassword,
      city: cityId,
      fullname,
      logo: defaultLogo,
      hand,
      birthdayDate,
      registeredDate,
      policy
    });

    // console.log("User data inserted successfully");

    // const transporter = nodemailer.createTransport({
    //   service: 'gmail',
    //   auth: {
    //     user: notificateEmail,
    //     pass: notificatePass
    //   }
    // });

    const mailOptionsForOwner = {
      from: notificateEmail,
      to: 'asianttleague@gmail.com',
      subject: 'New User Application',
      text: `
        A new user has registered
        E-mail: ${email}, 
        Nickname: ${nickname},  
        City: ${city}, 
        Name: ${fullname}, 
        Playing hand: ${hand}, 
        Birthday: ${birthdayDate}, 
        Registered date: ${registeredDate}, 
        Policy: 'Agreed'
      `
    };

    const mailOptionsForUser = {
      from: notificateEmail,
      to: email,
      subject: 'Congratulations!',
      text: `
        You have successfully registered at https://asianttleague.com
        E-mail: ${email}
      `
    };

    transporter.sendMail(mailOptionsForOwner, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
      } else {
        console.log('Email sent:', info.response);
      }
    });

    transporter.sendMail(mailOptionsForUser, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
      } else {
        console.log('Email sent:', info.response);
      }
    });
    logAction(req, 'REGISTRATION_SUCCESSFULL');

    res.status(200).json({ status: 'success', message: 'Registration successful!' });
  } catch (err) {
    console.error('Error inserting into MongoDB:', err);
    res.status(500).json({ status: 'error', error: 'Registration error. Please try again.' });
  }
});


passport.use(new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
  const db = getDB();

  try {
    let user = await db.collection('users').findOne({ email });
    let userType = user ? (user.role === 'admin' ? 'admin' : 'user') : null;

    if (!user) {
      user = await db.collection('coaches').findOne({ email });
      userType = user ? 'coach' : null;
    }

    if (!user) {
      user = await db.collection('clubs').findOne({ email });
      userType = user ? 'club' : null;
    }

    if (!user) {
      return done(null, false, { message: 'Invalid email or password' });
    }

    // Проверяем пароль с использованием bcrypt
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return done(null, false, { message: 'Invalid email or password' });
    }

    return done(null, { user, userType }); // Возвращаем пользователя и тип
  } catch (err) {
    return done(err);
  }
}));

// Сериализация пользователя
passport.serializeUser((userObj, done) => {
  done(null, { id: userObj.user._id, userType: userObj.userType });
});

// Десериализация пользователя
passport.deserializeUser(async (userObj, done) => {
  const db = getDB();
  try {
    let user;

    if (userObj.userType === 'admin' || userObj.userType === 'user') {
      user = await db.collection('users').findOne({ _id: userObj.id });
    } else if (userObj.userType === 'coach') {
      user = await db.collection('coaches').findOne({ _id: userObj.id });
    } else if (userObj.userType === 'club') {
      user = await db.collection('clubs').findOne({ _id: userObj.id });
    }

    done(null, { user, userType: userObj.userType });
  } catch (err) {
    done(err);
  }
});


app.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, userObj, info) => {
    if (err) {
      return res.status(500).json({ message: 'Internal Server Error' });
    }
    if (!userObj) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    req.logIn(userObj.user, (err) => {
      if (err) {
        return res.status(500).json({ message: 'Internal Server Error' });
      }

      // Сохраняем информацию в сессии
      req.session.userId = userObj.user._id;
      req.session.userType = userObj.userType;
      logAction(req, 'LOGIN_SUCCESS');
      res.status(200).json({
        userId: userObj.user._id,
        name: userObj.user.fullname || userObj.user.name,
        logo: userObj.user.logo,
        userType: userObj.userType,
      });
    });
  })(req, res, next);
});

app.get('/session', async (req, res) => {
  console.log('проверка сессии');
  if (req.session && req.session.user) {
      res.json({ loggedIn: true, user: req.session.user });
  } else {
      res.json({ loggedIn: false });
  }
});

app.get('/check-session', (req, res) => {
  if (req.isAuthenticated()) {
      res.json({ loggedIn: true });
  } else {
      res.json({ loggedIn: false });
  }
});

app.get('/api/session', async (req, res) => {
  try {
      const db = getDB();
      const session = await db.collection('sessions').findOne({ sessionId: req.sessionID });
      if (session) {
          res.json({ loggedIn: Boolean(session.userId) });
      } else {
          res.json({ loggedIn: false });
      }
  } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).send('Error logging out');
    }
    res.clearCookie('connect.sid'); // Удаляем куку сессии
    // res.send('Logged out');
    res.redirect('/');
  });
});


const cronTask = async () => {
  console.log('⏰ Запуск задачи обновления sundaysRating');

  try {
    const db = await getDB();

    const updateCollection = async (collectionName) => {
      const players = await db.collection(collectionName).find().toArray();

      const bulkOps = players.map(player => ({
        updateOne: {
          filter: { _id: player._id },
          update: {
            $set: { sundaysRating: player.rating }
          }
        }
      }));

      if (bulkOps.length > 0) {
        await db.collection(collectionName).bulkWrite(bulkOps);
        console.log(`✅ Обновление sundaysRating завершено для ${collectionName} (${bulkOps.length})`);
      } else {
        console.log(`⚠️ Нет игроков для обновления в ${collectionName}`);
      }
    };

    await updateCollection('users');
    await updateCollection('coaches');

  } catch (error) {
    console.error('❌ Ошибка при обновлении sundaysRating:', error);
  }
};


// Расписание задачи
cron.schedule('1 0 * * 0', cronTask);

// Временный вызов задачи
// (async () => {
//   setTimeout(cronTask, 10000)
// })();



app.use((req, res, next) => {
  console.log('Страница не существует - 404', req.originalUrl);
  res.status(404).render('404');
  // res.redirect('/404');
});

// 🟥 Глобальный обработчик ошибок (если что-то упадёт)
app.use((err, req, res, next) => {
  console.error('💥 Error occurred:', err);
  res.status(500).send('Internal Server Error'); // или res.send('Internal Server Error')
});

// Обработка ошибок сервера
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).send('Internal Server Error'); // Выводит сообщение об ошибке на случай непредвиденных сбоев
// });

// Запуск сервера и инициализация базы данных
connectDB().then(() => {
  // app.listen(port, () => {
  //   console.log(`Server is running on http://localhost:${port}`);
  //   browserSync.init({
  //     proxy: `http://localhost:${port}`,
  //     files: ['./views/**/*.ejs', './public/**/*.*'],
  //     port: 3001
  //   });
  // });

  app.listen(8080, function () {
    console.log(`Server is running on port ${8080}`);
  });
}).catch(err => {
  console.error('Failed to connect to database:', err);
});

process.on('SIGTERM', async () => {
  console.log("Closing MongoDB connection for production...");
  try {
      await client.close();
      console.log("MongoDB connection closed");
  } catch (err) {
      console.error("Error closing MongoDB connection", err);
  } finally {
      process.exit(0);
  }
});

// Дополнительно можно добавить обработчик для SIGINT (например, для завершения при нажатии Ctrl+C)
process.on('SIGINT', async () => {
  console.log("Application interrupted. Closing MongoDB connection...");
  try {
      await client.close();
      console.log("MongoDB connection closed");
  } catch (err) {
      console.error("Error closing MongoDB connection", err);
  } finally {
      process.exit(0);
  }
});