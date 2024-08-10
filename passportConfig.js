const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const { ObjectId } = require('mongodb');
const { getDB } = require('./db');
// const bcrypt = require('bcrypt');

// Модель пользователя
// const userSchema = new mongoose.Schema({
//     _id: Object,
//     email: String,
//     nickname: String,
//     password: String,
//     city: Object,
//     fullname: String,
//     logo: String,
//     hand: String,
//     birthdayDate: Object,
//     registeredDate: String,
//     policy: Boolean
// });
  
// const User = mongoose.model('User', userSchema);






// passport.use(new LocalStrategy(
//     {
//         usernameField: 'email', // Указываем, что имя пользователя будет передаваться как email
//         passwordField: 'password' // Указываем, что пароль будет передаваться как password
//     },
//   async function(email, password, done) {
//     try {
//         const db = getDB();
//         const user = await db.collection('users').findOne({ email: email });
//         console.log(user);
//         if (!user) {
//             return done(null, false, { message: 'Incorrect email.' });
//         }

//         const isMatch = await bcrypt.compare(password, user.password);
//         if (!isMatch) {
//             return done(null, false, { message: 'Incorrect password.' });
//         }

//         return done(null, user);
//     } catch (err) {
//         return done(err);
//     }
//   }
// ));




// // Сериализация пользователя в сессию
// passport.serializeUser(function(user, done) {
//   done(null, user._id);
// });

// // Десериализация пользователя из сессии
// passport.deserializeUser(async function(id, done) {
//   try {
//     const db = getDB();
//     const user = await db.collection('users').findOne({ _id: new ObjectId(id) });
//     done(null, user);
//   } catch (err) {
//     done(err);
//   }
// });


passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
  },
  async (email, password, done) => {
    const db = getDB();
    let user = await db.collection('users').findOne({ email });

    if (!user) {
      user = await db.collection('coaches').findOne({ email });
      if (!user) {
        user = await db.collection('clubs').findOne({ email });
      }
    }

    if (!user) {
      return done(null, false, { message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return done(null, false, { message: 'Incorrect password.' });
    }

    return done(null, user);

    // Проверка пароля (добавьте свою логику проверки пароля)
    // const isPasswordValid = /* ваш метод проверки пароля */;

    // if (!isPasswordValid) {
    //   return done(null, false, { message: 'Invalid email or password' });
    // }

    // return done(null, user);
  }
));

// Сериализация пользователя для хранения в сессии
passport.serializeUser((user, done) => {
  done(null, user._id);
});

// Десериализация пользователя из сессии
passport.deserializeUser(async (id, done) => {
  const db = getDB();
  const user = await db.collection('users').findOne({ _id: id }) ||
               await db.collection('coaches').findOne({ _id: id }) ||
               await db.collection('clubs').findOne({ _id: id });

  done(null, user);
});


module.exports = passport;
