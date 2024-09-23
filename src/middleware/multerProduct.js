const multer = require('multer');
const path = require('path');

// Configuración de almacenamiento de Multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Definir la carpeta donde se guardarán las imágenes
        cb(null, path.join(__dirname, '../public/product/img'));
    },
    filename: function (req, file, cb) {
        // Guardar la imagen con el nombre original o puedes modificarlo según tu preferencia
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

// Filtros de archivos (aceptar solo imágenes)
const fileFilter = (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png|gif/;
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = fileTypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb(new Error('Only images are allowed'));
    }
};

// Configuración de Multer
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 1024 * 1024 * 5 } // Limitar el tamaño de la imagen a 5MB
});

module.exports = upload;
