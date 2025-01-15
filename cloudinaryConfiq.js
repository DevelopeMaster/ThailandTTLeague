const cloudinary = require('cloudinary').v2;

// Настраиваем Cloudinary с данными аккаунта
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, // Ваш Cloud Name
  api_key: process.env.CLOUDINARY_API_KEY,      // Ваш API Key
  api_secret: process.env.CLOUDINARY_API_SECRET // Ваш API Secret
});

module.exports = cloudinary;