const fs = require('fs');
const path = require('path');

exports.getThumbnails = (req, res) => {
    const directoryPath = path.join(__dirname, '../public/carts/assets/img');

    fs.readdir(directoryPath, (err, files) => {
        if (err) {
            return res.status(500).json({ message: 'Unable to scan directory' });
        }

        // Filtrar solo archivos con extensión de imagen (jpg, jpeg, png, gif)
        const images = files.filter(file => /\.(jpg|jpeg|png|gif)$/.test(file));
        res.json(images);
    });
};

