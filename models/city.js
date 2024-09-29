const mongoose = require('mongoose');

const citySchema = new mongoose.Schema({
  english: {
    type: String,
    required: true,  // Поле обязательно для заполнения
  },
  russian: {
    type: String,
    required: true,  // Поле обязательно для заполнения
  },
  thai: {
    type: String,
    required: true,  // Поле обязательно для заполнения
  }
}, {
  timestamps: true  // Опционально: Добавляет поля createdAt и updatedAt
});

module.exports = mongoose.model('City', citySchema);