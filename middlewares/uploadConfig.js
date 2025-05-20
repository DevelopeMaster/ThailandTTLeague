const multer = require('multer');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const cloudinary = require('../cloudinaryConfiq');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// function ensureAuthenticated(req, res, next) {
//     // console.log(req.isAuthenticated());
//     if (req.isAuthenticated()) {
//         return next();
//     }
//     res.status(401).json({ message: 'Unauthorized' });
// };
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }

    // Определяем тип пользователя из URL
    const urlParts = req.originalUrl.split('/');
    const userType = urlParts.includes('club') ? 'allclubs' :
                     urlParts.includes('coach') ? 'allcoaches' :
                     urlParts.includes('player') ? 'allplayers' : null;

    // Проверяем, куда перенаправить пользователя
    if (userType) {
        // Если в URL есть указание типа (club, coach, player), перенаправляем на общедоступную страницу
        // return res.redirect(`/${req.lang || 'en'}/${userType}/${urlParts[urlParts.length - 1]}`);
        return res.redirect(`/${req.lang || 'en'}`);
    } else {
        // Если тип пользователя не определен, редирект на страницу ошибки
        return res.redirect(`404`);
    }
}

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

function ensureClub(req, res, next) {
    if (
      req.isAuthenticated() &&
      req.user &&
      req.user.workingHours &&
      req.user.supplements
    ) {
      return next(); // это точно клуб
    }
  
    // иначе — редирект или запрет
    return res.redirect('404'); // или res.status(403).send('Access denied');
}

function ensureClubOrAdmin(req, res, next) {
    if (
      req.isAuthenticated() &&
      req.user &&
      (
        (req.user.workingHours && req.user.supplements) || // клуб
        req.user.role === 'admin'                          // админ
      )
    ) {
      return next();
    }
  
    return res.redirect('404'); // или res.status(403).send('Access denied');
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
    limits: { fileSize: 2 * 1024 * 1024 },
});


// module.exports = upload;
module.exports = {
    ensureAuthenticated,
    upload,
    ensureAdmin,
    ensureAuthenticatedOrAdmin,
    ensureClubOrAdmin,
    ensureClub
    // deleteFile
};