const { Router } = require('express');
const { Logger} = require('../utils/logger.js');
const { premiumController, getUsers, deleteUser } = require('../controllers/usersController.js');
const { isAuthenticated } = require('../middleware/auth');

const router = Router();

router.use(Logger);

router.put('/premium/:uid', isAuthenticated, premiumController);

module.exports = router;
