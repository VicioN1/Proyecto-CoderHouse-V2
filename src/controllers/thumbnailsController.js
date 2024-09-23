const fs = require('fs');
const path = require('path');

exports.getThumbnails = (req, res) => {
    const directoryPath = path.join(__dirname, '../public/product/img');

    fs.readdir(directoryPath, (err, files) => {
        if (err) {
            return res.status(500).json({ message: 'Unable to scan directory' });
        }

        // Filtrar solo archivos con extensión de imagen (jpg, jpeg, png, gif)
        const images = files.filter(file => /\.(jpg|jpeg|png|gif)$/.test(file));
        res.json(images);
    });
};

exports.uploadImage = (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No image file was uploaded' });
    }

    // Puedes acceder a la ruta completa del archivo usando req.file.path
    res.status(200).json({
        message: 'Image uploaded successfully',
        file: req.file.filename, // Devuelve el nombre de la imagen cargada
        path: req.file.path // Devuelve la ruta completa donde se guardó la imagen
    });
};



