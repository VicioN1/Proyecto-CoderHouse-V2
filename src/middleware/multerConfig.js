const multer = require('multer');
const path = require('path');
const fs = require('fs');

const ensureDirExistence = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let folder = 'uploads/';
    if (file.fieldname === 'profile') {
      folder = 'uploads/profiles/';
    } else if (file.fieldname === 'product') {
      folder = 'uploads/products/';
    } else if (file.fieldname === 'documents') {
      folder = 'uploads/documents/';
    }
    ensureDirExistence(folder);
    cb(null, folder);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });
module.exports = upload;
