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

app.get('/en', (req, res) => {
  res.render('en');
});

app.get('/:lang(en|ru|th)/:page', function(req, res) {
  const lang = req.params.lang;
  const page = req.params.page;
  res.render(`${lang}/${page}`);
});

app.get('/', (req, res) => {
  res.render('en');
});

app.get('/account', (req, res) => {
  res.render('account');
});

app.get('/en', (req, res) => {
  res.render('en');
});

app.get('/ru', function(req, res) {
  res.render('ru');
});

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



// добавление турнира
  // async function addTournaments() {
  //   const tournamentsCollection = db.collection('tournaments');

  //   const tournaments = [
  //     {
  //       date: new Date('2024-04-12'),
  //       datetime: new Date('2024-04-12T11:00:00'),
  //       club: {
  //         name: 'HurricTT',
  //         logo: '/icons/clubslogo/HarricaneTT-logo.png',
  //       },
  //       restrictions: 287,
  //       rating: 304,
  //       players: [
  //         {
  //           id: '665500ed32ca3e3a47517872',
  //           place: 1,
  //           rating: 300
  //         },
  //         {
  //           id: '66564038f448d43a091cb5cd',
  //           place: 2,
  //           rating: 310
  //         },
  //         {
  //           id: '665ca0a6ff770cc63cbb0e95',
  //           place: 3,
  //           rating: 305
  //         },
  //       ], 
  //     },
  //     {
  //       date: new Date('2024-05-24'),
  //       datetime: new Date('2024-05-24T12:00:00'),
  //       club: {
  //         name: 'TT-Wonder',
  //         logo: '/icons/clubslogo/TTL-savel-logo.png',
  //       },
  //       restrictions: 350,
  //       rating: 424,
  //       players: [
  //         {
  //           id: '665500ed32ca3e3a47517872',
  //           place: 1,
  //           rating: 360
  //         },
  //         {
  //           id: '66564038f448d43a091cb5cd',
  //           place: 2,
  //           rating: 370
  //         },
  //         {
  //           id: '665ca0a6ff770cc63cbb0e95',
  //           place: 3,
  //           rating: 365
  //         },
  //       ],
  //     },
  //     {
  //       date: new Date('2024-06-01'),
  //       datetime: new Date('2024-06-01T12:00:00'),
  //       club: {
  //         name: 'ThaiTT',
  //         logo: '/icons/club3.jpg',
  //       },
  //       restrictions: 277,
  //       rating: 344,
  //       players: [
  //         {
  //           id: '665500ed32ca3e3a47517872',
  //           place: 1,
  //           rating: 300
  //         },
  //         {
  //           id: '66564038f448d43a091cb5cd',
  //           place: 2,
  //           rating: 310
  //         },
  //         {
  //           id: '665ca0a6ff770cc63cbb0e95',
  //           place: 3,
  //           rating: 305
  //         },
  //       ],
  //     }
  //   ];

  //   try {
  //     const result = await tournamentsCollection.insertMany(tournaments);
  //     console.log(`Successfully inserted ${result.insertedCount} items!`);
  //   } catch (err) {
  //     console.error(`Failed to insert items: ${err}`);
  //   }
  // }


// Хеширование паролей
  // async function hashPassword(plaintextPassword, additionPath) {
  //   try {
  //       const personalSalt = generateRandomString(10);
  //       const combinedSalt = additionPath + personalSalt + plaintextPassword;
  //       console.log(combinedSalt);
  //       const saltRounds = bcrypt.genSaltSync(10);
  //       const hashedPassword = bcrypt.hashSync( combinedSalt, saltRounds);
  //       console.log(hashedPassword);
  //       return hashedPassword;
  //   } catch (error) {
  //       console.error('Ошибка при хешировании пароля:', error);
  //       throw error;
  //   }
  // }
  // console.log(generateRandomString());
  // hashPassword('12345QweКЕНН', 'AlexO');


// Добавление клубов

// async function addClubs() {

//   try {
//       await client.connect();
//       const clubsCollection = db.collection("clubs");

//       const clubs = [
//           {
//               name: "TT-Savel",
//               city: "Bangkok",
//               logo: "/icons/clubslogo/TT-savel.svg",
//               phoneNumber: "+1234567890"
//           },
//           {
//               name: "HarricaneTT",
//               city: "Bangkok",
//               logo: "/icons/clubslogo/HarricaneTT.svg",
//               phoneNumber: "+0987654321"
//           },
//           {
//               name: "ThaiTT",
//               city: "Bangkok",
//               logo: "/icons/clubslogo/ThaiTT.svg",
//               phoneNumber: "+1122334455"
//           }
//       ];

//       await clubsCollection.insertMany(clubs);
//       console.log("Clubs added successfully");
//   } catch (err) {
//       console.error(err);
//   } 
// }

// добавление тренеров 
// async function addCoaches() {
 
//   try {
//       const coachesCollection = db.collection("coaches");

//       const coaches = [
//           {
//               name: "Petrov Alexander",
//               city: "Phuket",
//               club: "TTL-Savel",
//               logo: "/icons/playerslogo/petrov_aleksandr.svg",
//               phoneNumber: "+1234567890",
//               rating: 754
//           },
//           {
//               name: "Aleksandr Ohar",
//               city: "Bangkok",
//               club: "PHUKET TT CLUB",
//               logo: "/icons/playerslogo/default_avatar.svg",
//               phoneNumber: "+0987654321",
//               rating: 800
//           },
//           {
//               name: "Svetlana Ohar",
//               city: "Bangkok",
//               club: "PHUKET TT CLUB",
//               logo: "/icons/playerslogo/default_avatar.svg",
//               phoneNumber: "+1122334455",
//               rating: 850
//           }
//       ];

//       await coachesCollection.insertMany(coaches);
//       console.log("Coaches added successfully");
//   } catch (err) {
//       console.error(err);
//   }
// }

// добавление рекламы
// async function addAdv() {
//   try {
//       const advCollection = db.collection("adv");

//       const adv = [
//           {
//               customer: "TTL-Savel",
//               link: "#",
//               image: "/icons/ads/TTLeague.svg"
//           },
//           {
//             customer: "HarricaneTT",
//             link: "#",
//             image: "/icons/ads/TTLeague.svg"
//           }
//       ];

//       await advCollection.insertMany(adv);
//       console.log("Adv added successfully");
//   } catch (err) {
//       console.error(err);
//   }
// }



async function createRoutes() {
  
  app.post('/register', [
    // check passwords
    body('password')
      .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
      .matches(/^(?=.*\d)(?=.*[a-zа-яё\u0E01-\u0E5B])(?=.*[A-ZА-ЯЁ]).{8,}$/).withMessage('Password must contain at least one number, one lowercase and one uppercase letter')
  
  ], async function(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ status: 'error', errors: errors.array() });
    }
    
    const defaultLogo = '/icons/playerslogo/default_avatar.svg';

    const { email, login, password, confirm_password, city, fullname, hand, date, registeredDate, policy } = req.body;
    
    if (!email || !login || !password || !confirm_password || !city || !fullname || !hand || !date || !registeredDate || !policy ) {
      res.status(400).json({ error: 'Something wrong. Please come back to homepage and try again' });
      return;
    }
    
    const parts = date.split(".");
    const birthdayDate = new Date(`${parts[1]}/${parts[0]}/${parts[2]}`);

    try {
      
      await db.collection('users').insertOne({ email, 
                                              login, 
                                              password, 
                                              city, 
                                              fullname,
                                              logo: defaultLogo, 
                                              hand, 
                                              birthdayDate, 
                                              registeredDate, 
                                              policy 
      });
      console.log("Данные успешно вставлены");

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
            Login: ${login},  
            City: ${city}, 
            Name: ${fullname}, 
            Plaing hand: ${hand}, 
            Burthday: ${birthdayDate}, 
            Registered date: ${registeredDate}, 
            Policy: 'Agreed'
        `
      };
      const mailOptionsForUser = {
        from: notificateEmail,
        to: `${email}`,
        subject: 'Congratulation!',
        text: `
          You have successfully registered at https://thailandttleague.com
            E-mail: ${email}, 
            Login: ${login}
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
      console.error('Ошибка при вставке в MongoDB:', err);
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

  app.get('/tournament/:id', async function(req, res) {
    const tournamentId = req.params.id;
    const tournament = await db.collection('tournaments').findOne({ _id: tournamentId });
    if (tournament) {
      res.render('tournament', { tournament: tournament });
    } else {
      res.status(404).json({ error: 'Tournament not found' });
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

  app.get('/coaches', async function(req, res) {
    const coaches = await db.collection('coaches').find().toArray();
    if (coaches) {
      res.json(coaches);
    } else {
      res.status(404).json({ error: 'Coaches not found' });
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



//  отправка email
// let transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: 'your-email@gmail.com',
//     pass: 'your-password' 
//   }
// });

// function sendEmail(userEmail) {
//   let mailOptions = {
//     from: 'your-email@gmail.com',
//     to: userEmail,
//     subject: 'Спасибо за регистрацию!',
//     text: 'Благодарим вас за регистрацию на нашем сайте!'
//   };

//   transporter.sendMail(mailOptions, function(error, info){
//     if (error) {
//       console.log(error);
//     } else {
//       console.log('Email sent: ' + info.response);
//     }
//   });
// }

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