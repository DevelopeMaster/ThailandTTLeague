const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  nickname: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  city: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'City',
    required: true
  },
  fullname: {
    type: String,
    required: true
  },
  logo: {
    type: String
  },
  hand: {
    type: String,
    enum: ['right', 'left'],
    required: true
  },
  rating: {
    type: Number,
    required: true
  },
  resetPasswordToken: {
    type: String
  },
  resetPasswordExpires: {
    type: Date
  },
  forehandRubber: {
    type: String
  },
  backhandRubber: {
    type: String
  },
  blade: {
    type: String
  },
  birthdayDate: {
    type: Date,
    required: true
  },
  tournaments: {
    type: Number,
    default: 0
  },
  club: {
    type: String
  },
  coach: {
    type: String
  },
  registeredDate: {
    type: Date,
    default: Date.now
  },
  policy: {
    type: Boolean,
    required: true
  },
  phoneNumber: {
    type: String
  },
  description: {
    type: String
  }
});

// Создание модели на основе схемы
const Player = mongoose.model('Player', playerSchema);

module.exports = Player;