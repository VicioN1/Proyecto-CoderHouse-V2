const { Router } = require('express');
const { Logger} = require('../utils/logger.js');
const { premiumController, readUsers, deleteUsers, uploadDocuments } = require('../controllers/usersController.js');
const { isAuthenticated, ensureAdmin } = require('../middleware/auth');
const upload  = require('../middleware/multerConfig.js');

const router = Router();

router.use(Logger);

router.put('/premium/:uid', isAuthenticated, premiumController);

router.post('/:uid/documents', upload.array('documents', 10), uploadDocuments);

router.get('/', ensureAdmin, readUsers);

router.get('/deleteAllInactiveUsers', ensureAdmin, deleteUsers);

module.exports = router;
