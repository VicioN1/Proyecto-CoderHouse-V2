const express = require('express');
const router = express.Router();
const sessionController = require('../controllers/sessionController.js');


router.post('/register', sessionController.register);
router.post('/login', sessionController.login);
router.post('/logout', sessionController.logout);

router.get('/github', sessionController.github);
router.get('/githubcallback', sessionController.githubCallback);

module.exports = router;
