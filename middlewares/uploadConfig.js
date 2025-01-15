const multer = require('multer');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const cloudinary = require('../cloudinaryConfiq');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

function ensureAuthenticated(req, res, next) {
    // console.log(req.isAuthenticated());
    if (req.isAuthenticated()) {
        return next();
    }
    res.status(401).json({ message: 'Unauthorized' });
};

function ensureAdmin(req, res, next) {
    if (req.isAuthenticated() && req.user.role === 'admin') {
      return next(); // Если пользователь администратор, продолжить выполнение
    } else {
    //   return res.status(403).send('Access denied. Admins only.');
        return res.redirect(`404`);
    }
};

function ensureAuthenticatedOrAdmin(req, res, next) {
    if (req.isAuthenticated() || (req.user && req.user.role === 'admin')) {
        return next();
    }
    res.status(403).send('Forbidden');
}

// Настройка хранения файлов с указанием пути
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//       if (file.fieldname === 'logo') {
//           cb(null, path.join(__dirname, '../public/icons/clubslogo'));
//       } else if (file.fieldname === 'photos') {
//           cb(null, path.join(__dirname, '../public/icons/clubsphotos'));
//       } else if ( file.fieldname === 'userLogo') {
//           cb(null, path.join(__dirname, '../public/icons/playerslogo'));
//       } else if ( file.fieldname === 'banner') {
//           cb(null, path.join(__dirname, '../public/icons/advbanners'));
//       }
      
//   },
//   filename: (req, file, cb) => {
//       const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//       cb(null, uniqueSuffix + path.extname(file.originalname)); // указываем уникальное имя файла
//   }
// });

// function deleteFile(filePath) {
//     fs.unlink(filePath, (err) => {
//         if (err) {
//             console.error(`Ошибка при удалении файла: ${filePath}`, err);
//         } else {
//             console.log(`Файл успешно удален: ${filePath}`);
//         }
//     });
// }


// const upload = multer({ 
//   storage: storage,
//   limits: {
//       fileSize: 1 * 1024 * 1024 // 1 МБ
//   }
// });


  
// Настройка хранилища для Multer
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
        let folder;
        switch (file.fieldname) {
            case 'logo':
                folder = 'icons/clubslogo';
                break;
            case 'photos':
                folder = 'icons/clubsphotos';
                break;
            case 'userLogo':
                folder = 'icons/playerslogo';
                break;
            case 'banner':
                folder = 'icons/advbanners';
                break;
            default:
                folder = 'misc';
        }
        return {
            folder: folder,
            public_id: `${Date.now()}-${crypto.randomBytes(8).toString('hex')}`,
            resource_type: 'auto',
        };
    },
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 1 * 1024 * 1024 },
});


// module.exports = upload;
module.exports = {
    ensureAuthenticated,
    upload,
    ensureAdmin,
    ensureAuthenticatedOrAdmin,
    // deleteFile
};