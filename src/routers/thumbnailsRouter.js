const { Router } = require('express');
const { Logger} = require('../utils/logger.js');
const { getThumbnails, uploadImage} = require('../controllers/thumbnailsController.js');
const { isAuthenticated, ensureAdmin } = require('../middleware/auth.js');
const upload = require('../middleware/multerProduct.js');

const router = Router();

router.use(Logger);


// Usar el router para las rutas relacionadas con thumbnails
router.get('/', ensureAdmin, getThumbnails);

router.post('/upload', upload.single('image'), uploadImage);

module.exports = router;
