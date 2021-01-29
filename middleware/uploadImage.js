const multer = require('multer');
const path = require('path');


const storage = multer.diskStorage({
  destination: function(req, file, cb) {
      cb(null, 'images');
  },

  // By default, multer removes file extensions so let's add them back
  filename: function(req, file, cb) {
      cb(null, file.originalname + '-' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage }).single('img');

module.exports=upload