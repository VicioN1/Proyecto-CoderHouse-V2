const { Router } = require('express');
const { Logger} = require('../utils/logger.js');
const { premiumController, getUsers, deleteUser, uploadDocuments } = require('../controllers/usersController.js');
const { isAuthenticated } = require('../middleware/auth');
const upload  = require('../middleware/multerConfig.js');

const router = Router();

router.use(Logger);

router.put('/premium/:uid', isAuthenticated, premiumController);

router.post('/:uid/documents', upload.array('documents', 10), uploadDocuments);

module.exports = router;
