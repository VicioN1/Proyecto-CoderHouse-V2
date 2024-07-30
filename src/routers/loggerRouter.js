const express = require('express');
const router = express.Router();
const loggerController = require('../controllers/loggerController.js');
const { Logger} = require('../utils/logger.js');


//Ruta para logger:
router.get('/' , Logger , loggerController.loggerController);

module.exports = router;