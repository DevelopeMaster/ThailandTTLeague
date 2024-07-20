// const browserSync = require('browser-sync');
const express = require('express');
const { body, validationResult } = require('express-validator');
const app = express();
const path = require('path');
require('dotenv').config();
const { ObjectId } = require('mongodb');
const nodemailer = require('nodemailer');
// const bcrypt = require('bcryptjs');
// const crypto = require('crypto');
const port = 3000;


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Middleware для перенаправления URL с завершающим слэшем
app.use((req, res, next) => {
  if (req.path !== '/' && req.path.endsWith('/')) {
    const query = req.url.slice(req.path.length);
    const redirectPath = req.path.slice(0, -1) + query;
    return res.redirect(301, redirectPath);
  }
  next();
});

app.get('/', (req, res) => {
  res.render('en');
});

app.get('/en', (req, res) => {
  res.render('en');
});

app.get('/account', (req, res) => {
  res.render('account');
});

app.get('/ru', function(req, res) {
  res.render('ru');
});

app.get('/:lang/allclubs/:clubId', (req, res) => {
  const { lang } = req.params;
  // , { club: clubId, lang: lang }
  res.render(`${lang}/allclubs/club`);
});

app.get('/:lang/trainings/:trainingId', async (req, res) => {
  try {
    const { lang, trainingId } = req.params;
    // console.log('Route matched:', lang, tournamentId);
    res.render(`${lang}/trainings/training`);
  } catch (error) {
    console.error('Error in route handler:', error);
    res.status(500).send('Server error');
  }
});

app.get('/:lang/trainings', async (req, res) => {
  try {
    const { lang } = req.params;

    res.render(`${lang}/alltrainings`);
  } catch (error) {
    console.error('Error in route handler:', error);
    res.status(500).send('Server error');
  }
});

app.use((req, res, next) => {
  console.log('Incoming request:', req.url);
  next();
});


app.get('/:lang/tournaments/:tournamentId', async (req, res) => {
  try {
    const { lang, tournamentId } = req.params;
    // console.log('Route matched:', lang, tournamentId);
    await renderTournament(tournamentId, lang, res);
  } catch (error) {
    console.error('Error in route handler:', error);
    res.status(500).send('Server error');
  }
});

async function renderTournament(id, lang, res) {
  // console.log("язык в рендере", lang);
  try {
    const tournament = await db.collection('tournaments').findOne({ _id: new ObjectId(id) });

    if (!tournament) {
      return res.status(404).send('Tournament not found');
    }

    if (tournament.datetime < new Date()) {
      return res.render(`${lang}/tournaments/past-tournament`);
    } 
    if (tournament.datetime > new Date()) {
      // console.log(`ссылка правильная${lang}/tournaments/upcoming-tournament`);
      return res.render(`${lang}/tournaments/upcoming-tournament`);
    }
  } catch (error) {
    console.error('Error fetching tournament:', error);
    res.status(500).send('Error fetching tournament');
  }
}

app.get('/th', function(req, res) {
  res.render('th');
});

app.get('/error', function(req, res) {
  res.render('error');
});

app.get('/check-email', async function(req, res) {
  const email = req.query.email;
  const user = await db.collection('users').findOne({ email: email });
  if (user) {
    res.json({ unique: false });
  } else {
    res.json({ unique: true });
  }
});

app.get('/check-login', async function(req, res) {
  const login = req.query.login;
  const user = await db.collection('users').findOne({ login: login });
  if (user) {
    res.json({ unique: false });
  } else {
    res.json({ unique: true });
  }
});

app.get('/:lang(en|ru|th)/tournaments', function(req, res) {
  const lang = req.params.lang;
  res.render(`${lang}/alltournaments`);
});

app.get('/:lang(en|ru|th)/alltrainings', function(req, res) {
  const lang = req.params.lang;
  res.render(`${lang}/alltrainings`);
});

app.use((req, res, next) => {
  if (req.url.includes('undefined')) {
      console.error(`Undefined route accessed: ${req.url}`);
  }
  next();
});

app.get('/:lang(en|ru|th)/:page', function(req, res) {
  const lang = req.params.lang;
  const page = req.params.page;
  res.render(`${lang}/${page}`);
});


app.use((req, res, next) => {
  res.setHeader('Content-Type', 'application/json');
  next();
});
app.use(express.json());

const { MongoClient, ServerApiVersion } = require('mongodb');
const user = process.env.DB_USER;
const password = process.env.DB_PASSWORD;
const host = process.env.DB_HOST;
const notificateEmail = process.env.NOTIFICATE_EMAIL;
const notificatePass = process.env.NOTIFICATE_PASSWORD;

const uri = `mongodb+srv://${user}:${password}@${host}/?retryWrites=true&w=majority&appName=Users`;

let db;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});
async function run() {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log("Подключение к БД успешно!");
    db = client.db('ttleague');
    await createRoutes();

    // app.listen(port, function () {
    //   browserSync({
    //     proxy: `localhost:${port}`,
    //     files: ['public/**/*.{js,css}', 'views/**/*.ejs']
    //   });
    // });
    app.listen(8080, function () {
      console.log(`Server is running on port ${8080}`);
    });
  } catch (err) {
    console.error('Ошибка подключения к MongoDB:', err);
  }
}



async function createRoutes() {

  app.get('/get-data-training', async (req, res) => {
    const { lang, trainingId } = req.query;
    // console.log(lang, trainingId);
    // res.render(`/${lang}/club`);
    try {
        const dataTraining = await db.collection('trainings').findOne({ _id: new ObjectId(trainingId) });
        if (!dataTraining) {
            return res.status(404).send('Training not found');
        }

        res.json(dataTraining);
        // , { clubId }
    } catch (error) {
        console.error('Error fetching training data:', error);
        res.status(500).send('Internal Server Error');
    }
  });
  
  app.get('/get-data-club', async (req, res) => {
    const { lang, clubId } = req.query;
    // console.log(lang, clubId);
    // res.render(`/${lang}/club`);
    try {
        const dataClub = await db.collection('clubs').findOne({ _id: new ObjectId(clubId) });
        if (!dataClub) {
            return res.status(404).send('Club not found');
        }

        res.json(dataClub);
        // , { clubId }
    } catch (error) {
        console.error('Error fetching club data:', error);
        res.status(500).send('Internal Server Error');
    }
  });

  app.get('/get-data-tournament', async (req, res) => {
    const { lang, tournamentId } = req.query;
    // console.log(lang, clubId);
    // res.render(`/${lang}/club`);
    try {
        const dataTournament = await db.collection('tournaments').findOne({ _id: new ObjectId(tournamentId) });
        if (!dataTournament) {
            return res.status(404).send('Tournament not found');
        }

        res.json(dataTournament);
        // , { clubId }
    } catch (error) {
        console.error('Error fetching tournament data:', error);
        res.status(500).send('Internal Server Error');
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
      const cityExists = await db.collection('cities').findOne({ [clientLang]: city });
      if (cityExists) {
        cityId = cityExists._id;
      } else {
        const newCity = { [clientLang]: city };
        const result = await db.collection('cities').insertOne(newCity);
        cityId = result.insertedId;
      }
  
      await db.collection('users').insertOne({
        email,
        nickname,
        password,
        city: cityId,
        fullname,
        logo: defaultLogo,
        hand,
        birthdayDate,
        registeredDate,
        policy
      });
  
      console.log("User data inserted successfully");
  
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: notificateEmail,
          pass: notificatePass
        }
      });
  
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

  app.get('/get-past-tournaments', async function(req, res) {
    try {
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

  app.get('/get-future-tournaments', async function(req, res) {
    try {
      const tournaments = await db.collection('tournaments').find().toArray();
      res.json(tournaments);
    } catch (err) {
      console.error(`Failed to retrieve tournaments: ${err}`);
      res.status(500).json({ error: 'An error occurred while retrieving tournaments' });
    }
  });

  // app.get('/tournament/:id', async function(req, res) {
  //   const tournamentId = req.params.id;
  //   const tournament = await db.collection('tournaments').findOne({ _id: tournamentId });
  //   if (tournament) {
  //     res.render('tournament', { tournament: tournament });
  //   } else {
  //     res.status(404).json({ error: 'Tournament not found' });
  //   }
  // });
  


  app.get('/get-trainings', async function(req, res) {
    const trainings = await db.collection('trainings').find().toArray();
    if (trainings) {
      res.json(trainings);
    } else {
      res.status(404).json({ error: 'Trainings not found' });
    }
  });

  app.get('/get-players', async function(req, res) {
    const players = await db.collection('users').find().toArray();
    if (players) {
      res.json(players);
    } else {
      res.status(404).json({ error: 'Players not found' });
    }
  });
  
  app.get('/clubs', async function(req, res) {
    const clubs = await db.collection('clubs').find().toArray();
    if (clubs) {
      res.json(clubs);
    } else {
      res.status(404).json({ error: 'Clubs not found' });
    }
  });

  // app.get('/clubs/clubId', async function(req, res) {
  //   const club = await db.collection('clubs').findOne({ _id: new ObjectId(clubId) });
  //   if (club) {
  //     res.json(club);
  //   } else {
  //     res.status(404).json({ error: 'Clubs not found' });
  //   }
  // });

  app.get('/coaches', async function(req, res) {
    const coaches = await db.collection('coaches').find().toArray();
    if (coaches) {
      res.json(coaches);
    } else {
      res.status(404).json({ error: 'Coaches not found' });
    }
  });

  app.get('/trainer/:trainerId', async (req, res) => {
    const trainerId = req.params.trainerId;

    try {
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
  
  app.get('/cities/:cityId', async (req, res) => {
    const cityId = req.params.cityId;

    try {
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
      const cities = await db.collection('cities').find({}, { projection: { _id: 0, [language]: 1 } }).toArray();
      
      res.json(cities.map(city => city[language]));
    } catch (err) {
      console.error('Error when loading the list of cities from the database:', err);
    }
  });

  


  app.get('/adv', async function(req, res) {
    try {
      const adv = await db.collection('adv').find().toArray();
      
      res.json(adv);
    } catch (err) {
      console.error('Ads not found:', err);
    }
  });

   
  app.post('/applyCoach', [
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

  app.post('/addApplicationClub', [
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
    }
  );


}


run().catch(console.dir);












// //настройка сессий

// // const session = require('express-session');


// // app.use(session({
// //   secret: 'your secret key',
// //   resave: false,
// //   saveUninitialized: true
// // }));

// // app.post('/login', function(req, res) {
// //   // Аутентификация пользователя...
  
// //   // Если аутентификация прошла успешно:
// //   req.session.user = {
// //     id: user.id,
// //     name: user.name,
// //     avatar: user.avatar
// //   };
  
// //   res.redirect('/');
// // });

// // app.get('/', function(req, res) {
// //   if (req.session.user) {
// //     res.send(`Добро пожаловать, ${req.session.user.name}!`);
// //   } else {
// //     res.send('Пожалуйста, войдите в систему.');
// //   }
// // });


// const express = require('express');
// const app = express();
// const port = 3000;

// app.set('view engine', 'ejs');

// app.use(express.static('public'));

// app.use(express.urlencoded({ extended: true })); // Для обработки данных формы

// app.get('/', (req, res) => {
//   res.render('EN');
// });

// app.get('/EN', (req, res) => {
//   res.render('EN');
// });

// app.get('/RUS', function(req, res) {
//   res.render('RUS');
// });

// app.get('/register', function(req, res) {
//   res.render('register');
// });

// app.listen(port, () => {
//   console.log(`Server is running at http://localhost:${port}`);
// });


// // подключение базы данных
// const MongoClient = require('mongodb').MongoClient;
// // const uri = "mongodb+srv://ogarsanya:8vqaZGni2pH3jhgu@users.oo0uq2k.mongodb.net/";
// const uri = "mongodb+srv://ogarsanya:8vqaZGni2pH3jhgu@users.oo0uq2k.mongodb.net//ttleague?retryWrites=true&w=majority&appName=Users";
// // const uri = "mongodb+srv://ogarsanya:8vqaZGni2pH3jhgu@users.mongodb.net/ttleague?retryWrites=true&w=majority";
// const client = new MongoClient(uri);
// let db;

// client.connect(err => {
//   if (err) {
//     console.error('Ошибка подключения к MongoDB:', err);
//     return;
//   }
  
//   console.log('Успешно подключено к MongoDB');

//   db = client.db('ttleague');
//   console.log(db);

// });








// app.post('/register', function(req, res) {
//   const { username, password, name, avatar } = req.body;
//   db.collection('users').insertOne({ username, password, name, avatar }, function(err, res) {
//     if (err) {
//       console.error('Ошибка при вставке в MongoDB:', err);
//       return;
//     }
//     console.log("Данные успешно вставлены");
//   });

//   res.redirect('/profile');
// });