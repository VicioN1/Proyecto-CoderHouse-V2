const { Router } = require('express');
const { Logger} = require('../utils/logger.js');
const { getThumbnails} = require('../controllers/thumbnailsController.js');
const { isAuthenticated, ensureAdmin } = require('../middleware/auth.js');
const upload  = require('../middleware/multerConfig.js');

const router = Router();

router.use(Logger);


// Usar el router para las rutas relacionadas con thumbnails
router.get('/', ensureAdmin, getThumbnails);

module.exports = router;
