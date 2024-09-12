const multer = require('multer');
const path = require('path');

function ensureAuthenticated(req, res, next) {
    // console.log(req.isAuthenticated());
    if (req.isAuthenticated()) {
        return next();
    }
    res.status(401).json({ message: 'Unauthorized' });
  }

// Настройка хранения файлов с указанием пути
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
      if (file.fieldname === 'logo') {
          cb(null, path.join(__dirname, '../public/icons/clubslogo'));
      } else if (file.fieldname === 'photos') {
          cb(null, path.join(__dirname, '../public/icons/clubsphotos'));
      } else if ( file.fieldname === 'userLogo') {
          cb(null, path.join(__dirname, '../public/icons/playerslogo'));
      }
  },
  filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, uniqueSuffix + path.extname(file.originalname)); // указываем уникальное имя файла
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
      fileSize: 1 * 1024 * 1024 // 1 МБ
  }
});

// module.exports = upload;
module.exports = {
    ensureAuthenticated,
    upload
  };