const express = require('express');
const { mockingProducts } = require('../controllers/mockingController');

const router = express.Router();

router.get('/mockingproducts', mockingProducts);

module.exports = router;
