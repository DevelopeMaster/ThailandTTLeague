const express = require('express');
const { body, validationResult } = require('express-validator');
const path = require('path');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const nodemailer = require('nodemailer');
const passport = require('./passportConfig'); // Подключаем конфигурацию Passport
// const browserSync = require('browser-sync');
const { ObjectId } = require('mongodb'); // Импортируем ObjectId
require('dotenv').config();
const { connectDB, getDB } = require('./db'); // Подключаем функцию для получения базы данных
const flash = require('connect-flash');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const crypto = require('crypto');
// const router = express.Router();
const { v4: uuidv4 } = require('uuid');

const { ensureAuthenticated, upload, ensureAdmin } = require('./middlewares/uploadConfig');
const userRoutes = require('./routes/userRoutes');

// const passport = require('passport');
// require('./passportConfig'); // Подключаем конфигурацию Passport



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

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const store = MongoStore.create({
  mongoUrl: uri,
  dbName: 'ttleague',
  resave: false,
  collectionName: 'sessions',
  stringify: false,
  autoRemove: 'native',
  // cookie: { secure: true, httpOnly: true },
  ttl: 7 * 24 * 60 * 60 // Время жизни сессии в секундах (14 дней)
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
  saveUninitialized: true,
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

app.get('/ru/dashboard/admin', ensureAdmin, (req, res) => {
  res.render('ru/dashboard/admin');
});

app.get('/ru/dashboard/admin/:page', ensureAdmin, (req, res) => {
  const { page } = req.params;
  res.render(`ru/dashboard/admin/${page}`);
});



app.get('/ru/dashboard/admin/edit/:playerId', ensureAuthenticated, ensureAdmin, (req, res) => {
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

app.get('/ru/dashboard/admin/editclub/:clubId', ensureAuthenticated, ensureAdmin, (req, res) => {
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

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});



app.get('/th', (req, res) => {
  res.render('th');
});

app.get('/error', (req, res) => {
  res.render('error');
});

app.use('/api', userRoutes);

// Маршруты для страниц с языковыми параметрами
app.get('/:lang(en|ru|th)/allclubs/:clubId', (req, res) => {
  const { lang } = req.params;
  res.render(`${lang}/allclubs/club`);
});


app.get('/:lang(en|ru|th)/trainings/:trainingId', async (req, res) => {
  try {
    const { lang } = req.params;
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
    res.render(`${lang}/alltrainings`);
  } catch (error) {
    console.error('Error in route handler:', error);
    res.status(500).send('Server error');
  }
});

app.get('/:lang(en|ru|th)/tournaments/:tournamentId', async (req, res) => {
  try {
    const { lang, tournamentId } = req.params;
    await renderTournament(tournamentId, lang, res);
  } catch (error) {
    console.error('Error in route handler:', error);
    res.status(500).send('Server error');
  }
});

async function renderTournament(id, lang, res) {
  try {
    const db = getDB();
    const tournament = await db.collection('tournaments').findOne({ _id: new ObjectId(id) });

    if (!tournament) {
      return res.status(404).send('Tournament not found');
    }

    if (tournament.datetime < new Date()) {
      return res.render(`${lang}/tournaments/past-tournament`);
    }
    if (tournament.datetime > new Date()) {
      return res.render(`${lang}/tournaments/upcoming-tournament`);
    }
  } catch (error) {
    console.error('Error fetching tournament:', error);
    res.status(500).send('Error fetching tournament');
  }
}


app.get('/:lang(en|ru|th)/alltournaments', (req, res) => {
  const { lang } = req.params;
  res.render(`${lang}/alltournaments`);
});

app.get('/:lang(en|ru|th)/alltrainings', (req, res) => {
  const { lang } = req.params;
  res.render(`${lang}/alltrainings`);
});


app.get('/:lang/dashboard/editclub/:userId', ensureAuthenticated, (req, res) => {
  const { lang, userId } = req.params;
  const userType = req.session.userType; // Получаем тип пользователя из сессии

  if (userType === 'club') { // Проверяем, что тип пользователя "club"
      const link = `${lang}/dashboard/editclub`;
      
      console.log(`Rendering: ${link} for userId: ${userId}`);
      return res.render(link, {
          userId: userId,
          userType: userType
      });
  } else {
      console.log('Access denied: User is not a club');
      return res.status(403).send('Forbidden');
  }
});

app.get('/:lang/dashboard/edituser/:userId', ensureAuthenticated, (req, res) => {
  const { lang, userId } = req.params;
  const userType = req.session.userType; // Получаем тип пользователя из сессии

  if (userType === 'user') { // Проверяем, что тип пользователя "club"
      const link = `${lang}/dashboard/edituser`;
      
      console.log(`Rendering: ${link} for userId: ${userId}`);
      return res.render(link, {
          userId: userId,
          userType: userType
      });
  } else {
      console.log('Access denied: User is not a club');
      return res.status(403).send('Forbidden');
  }
});

app.get('/:lang/dashboard/:userType/:userId', ensureAuthenticated, (req, res) => {
  const { lang, userType, userId } = req.params;
  const link = `${lang}/dashboard/${userType}`;
  
  if (req.session.userType === userType) {
    console.log(link);
    return res.render(link, {
      userId: userId,
      userType: userType
    });
    
  } else {
    console.log('ошибка');
    return res.status(403).send('Forbidden');
  }
});


app.use((err, req, res, next) => {
  if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File too large. Maximum size is 1 MB.' });
  }
  res.status(500).json({ error: 'Internal Server Error' });
});


// app.get('/:lang/:userType_dashboard', ensureAuthenticated, (req, res) => {
//   const { lang, userType } = req.params;
//   console.log('используется второй маршрут');
//   // Проверка типа пользователя
//   if (['user', 'admin', 'coach', 'club'].includes(userType)) {
//     // Проверка авторизации
//     if (req.session.userType === userType) {
//       // Рендерим страницу дешборда
//       const link = `/${lang}/${userType}_dashboard`;
//       res.redirect(link);
//     } 
//   }
// });


// Маршрут для запроса восстановления пароля
app.post('/api/restore-password', async (req, res) => {
  const { email, clientLang } = req.body;
  
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
              return res.status(404).json({ message: 'User with this email not found' });
          }
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
              return res.status(400).json({ message: 'Password reset token is invalid or has expired.' });
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
              return res.status(400).json({ message: 'Password reset token is invalid or has expired.' });
          }
      }

      if (password !== confirmPassword) {
          return res.status(400).json({ message: 'Passwords do not match.' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      // const collection = user.collection === 'users' ? 'users' : 'coaches';
      console.log(collection);
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
          res.status(200).json({ message: 'Password has been successfully reset.' });
      } else {
          res.status(500).json({ message: 'Failed to update the password. Please try again.' });
      }
  } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ message: 'Internal server error' });
  }
});




app.get('/:lang(en|ru|th)/:page', (req, res) => {
  const { lang, page } = req.params;
  res.render(`${lang}/${page}`);
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
    const cities = await db.collection('cities').find({}, { projection: { _id: 0, [language]: 1 } }).toArray();
    // console.log(cities);
    res.json(cities.map(city => city[language]));
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
    console.log(user.fullname);
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

app.get('/get-data-tournament', async (req, res) => {
  const { tournamentId } = req.query;
  try {
    const db = getDB();
    const dataTournament = await db.collection('tournaments').findOne({ _id: new ObjectId(tournamentId) });
    if (!dataTournament) {
      return res.status(404).send('Tournament not found');
    }
    res.json(dataTournament);
  } catch (error) {
    console.error('Error fetching tournament data:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/get-data-player', async (req, res) => {
  const { userId } = req.query;
  console.log(userId);
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
    const tournaments = await db.collection('tournaments').find().toArray();
    const pastTournaments = tournaments.filter(tournament => new Date(tournament.datetime) <= new Date());

    await Promise.all(pastTournaments.map(async (tournament) => {
      tournament.players = await Promise.all(tournament.players.map(async (player) => {
        const user = await db.collection('users').findOne({ _id: new ObjectId(player.id) });
        player.name = user ? user.fullname : 'Unknown User';
        return player;
      }));
      return tournament;
    }));

    res.status(200).json(pastTournaments);
  } catch (err) {
    console.error(`Failed to retrieve tournaments: ${err}`);
    res.status(500).json({ error: 'An error occurred while retrieving tournaments' });
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

app.get('/get-playerData', async (req, res) => {
  // const userId = req.params.userId;
  const { playerId, lang } = req.query;
  console.log(playerId);
  try {
    const db = getDB();
    const player = await db.collection('users').findOne({ _id: new ObjectId(playerId) });
    res.json(player);
  } catch (err) {
    console.error('Error fetching player:', err);
    res.status(500).json({ error: 'An error occurred while retrieving player' });
  }
});





// Обработка входа и регистрации
// app.post('/register', [
//   body('password')
//     .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
//     .matches(/^(?=.*\d)(?=.*[a-zа-яё\u0E01-\u0E5B])(?=.*[A-ZА-ЯЁ]).{8,}$/).withMessage('Password must contain at least one number, one lowercase, and one uppercase letter')
// ], async function (req, res) {
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     return res.status(400).json({ status: 'error', errors: errors.array() });
//   }

//   const defaultLogo = '/icons/playerslogo/default_avatar.svg';

//   const { email, nickname, password, confirm_password, city, fullname, hand, date, registeredDate, policy, clientLang } = req.body;

//   if (!email || !password || !confirm_password || !city || !fullname || !hand || !date || !registeredDate || !policy) {
//     res.status(400).json({ error: 'Something wrong. Please come back to homepage and try again' });
//     return;
//   }

//   const parts = date.split(".");
//   const birthdayDate = new Date(`${parts[1]}/${parts[0]}/${parts[2]}`);

//   try {
//     // Check if the city already exists
//     let cityId;
//     const db = getDB();
//     const cityExists = await db.collection('cities').findOne({ [clientLang]: city });
//     if (cityExists) {
//       cityId = cityExists._id;
//     } else {
//       const newCity = { [clientLang]: city };
//       const result = await db.collection('cities').insertOne(newCity);
//       cityId = result.insertedId;
//     }

//     await db.collection('users').insertOne({
//       email,
//       nickname,
//       password,
//       city: cityId,
//       fullname,
//       logo: defaultLogo,
//       hand,
//       birthdayDate,
//       registeredDate,
//       policy
//     });

//     console.log("User data inserted successfully");

//     const transporter = nodemailer.createTransport({
//       service: 'gmail',
//       auth: {
//         user: notificateEmail,
//         pass: notificatePass
//       }
//     });

//     const mailOptionsForOwner = {
//       from: notificateEmail,
//       to: 'ogarsanya@gmail.com',
//       subject: 'New User Application',
//       text: `
//         A new user has registered
//         E-mail: ${email}, 
//         Nickname: ${nickname},  
//         City: ${city}, 
//         Name: ${fullname}, 
//         Playing hand: ${hand}, 
//         Birthday: ${birthdayDate}, 
//         Registered date: ${registeredDate}, 
//         Policy: 'Agreed'
//       `
//     };

//     const mailOptionsForUser = {
//       from: notificateEmail,
//       to: email,
//       subject: 'Congratulations!',
//       text: `
//         You have successfully registered at https://thailandttleague.com
//         E-mail: ${email}
//       `
//     };

//     transporter.sendMail(mailOptionsForOwner, (error, info) => {
//       if (error) {
//         console.error('Error sending email:', error);
//       } else {
//         console.log('Email sent:', info.response);
//       }
//     });

//     transporter.sendMail(mailOptionsForUser, (error, info) => {
//       if (error) {
//         console.error('Error sending email:', error);
//       } else {
//         console.log('Email sent:', info.response);
//       }
//     });

//     res.status(200).json({ status: 'success', message: 'Registration successful!' });
//   } catch (err) {
//     console.error('Error inserting into MongoDB:', err);
//     res.status(500).json({ status: 'error', error: 'Registration error. Please try again.' });
//   }
// });

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

    console.log("User data inserted successfully");

    // const transporter = nodemailer.createTransport({
    //   service: 'gmail',
    //   auth: {
    //     user: notificateEmail,
    //     pass: notificatePass
    //   }
    // });

    const mailOptionsForOwner = {
      from: notificateEmail,
      to: 'ogarsanya@gmail.com',
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
        You have successfully registered at https://thailandttleague.com
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

    res.status(200).json({ status: 'success', message: 'Registration successful!' });
  } catch (err) {
    console.error('Error inserting into MongoDB:', err);
    res.status(500).json({ status: 'error', error: 'Registration error. Please try again.' });
  }
});



// правильный код только для юзеров
// app.post('/login', (req, res, next) => {
//   // const { username, password } = req.body;
//   // const user = await authenticateUser(username, password);
//   passport.authenticate('local', (err, user, info) => {
//       if (err) {
//           return res.status(500).json({ message: 'Internal Server Error' });
//       }
//       if (!user) {
//           return res.status(401).json({ message: 'Invalid email or password' });
//       }
      
//       req.logIn(user, (err) => {
//           if (err) {
//             return res.status(500).json({ message: 'Internal Server Error' });
//           }
//           if (user) {
//             req.session.userId = user._id;
//             res.status(200).json(
//               { userId: user._id,
//                 name: user.fullname,
//                 logo: user.logo
//               }
//             );
//           } else {
//             res.status(401).json({ error: 'Invalid credentials' });
//           }
//           // return res.json({ status: 'success' });
//       });
//   })(req, res, next);
// });

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

      res.status(200).json({
        userId: userObj.user._id,
        name: userObj.user.fullname || userObj.user.name,
        logo: userObj.user.logo,
        userType: userObj.userType,
      });
    });
  })(req, res, next);
});

// app.post('/login', async (req, res, next) => {
//   const { email, password } = req.body;  // Исправляем на email и password
//   const db = getDB();
//   console.log(req.body);
//   console.log('полученные данные на сервере:', email, password );
  
//   let user = await db.collection('users').findOne({ email });
//   let userType = user ? (user.role === 'admin' ? 'admin' : 'user') : null;

//   if (!user) {
//     user = await db.collection('coaches').findOne({ email });
//     userType = 'coach';
//   }

//   if (!user) {
//     user = await db.collection('clubs').findOne({ email });
//     userType = 'club';
//   }

//   // Если пользователь не найден ни в одной из коллекций
//   if (!user) {
//     return res.status(401).json({ message: 'Invalid email or password' });
//   }

//   // Аутентификация с использованием найденного пользователя
//   passport.authenticate('local', (err, user, info) => {
//     if (err) {
//       return res.status(500).json({ message: 'Internal Server Error' });
//     }
//     if (!user) {
//       return res.status(401).json({ message: 'Invalid email or password' });
//     }
//     // console.log('если есть user:', user, userType, user.logo, user.fullname || user.name, user._id);
//     req.logIn(user, (err) => {
//       if (err) {
//         return res.status(500).json({ message: 'Internal Server Error' });
//       }
      
//       if (user) {
//         req.session.userId = user._id;
//         req.session.userType = userType;  // Сохранение типа пользователя в сессии
//         res.status(200).json({
//           userId: user._id,
//           name: user.fullname || user.name,
//           logo: user.logo,
//           userType: userType  // Возвращение типа пользователя в ответе
//         });
//       } else {
//         res.status(401).json({ error: 'Invalid credentials' });
//       }
//     });
//   })(req, res, next);
// });




// Middleware для проверки аутентификации
// function ensureAuthenticated(req, res, next) {
//   // console.log(req.isAuthenticated());
//   if (req.isAuthenticated()) {
//       return next();
//   }
//   res.status(401).json({ message: 'Unauthorized' });
// }

// module.exports = {
//   ensureAuthenticated
// };
// Создание схемы сессий
// const sessionSchema =  new mongoose.Schema({
//   sessionId: String,
//   userId: String,
//   // Другие поля по необходимости
// });
// const Session = mongoose.model('Session', sessionSchema);

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

// Защищенный маршрут для /dashboard
// app.get('/dashboard', ensureAuthenticated, (req, res) => {
//   console.log('на сервере переход есть');
//   res.json({ message: 'Welcome to your dashboard' });
// });


// app.get('/dashboard', (req, res) => {
//   // Проверка сессии
//   if (req.session.sessionId) {
//     res.send('Profile page');
//   } else {
//     res.redirect('/login');
//   }
// });

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


app.use((req, res, next) => {
  res.status(404).render('404');
});

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
