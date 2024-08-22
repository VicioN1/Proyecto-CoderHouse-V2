const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController.js');
const {  isAdmin} = require('../middleware/auth');
const { Logger} = require('../utils/logger.js');

router.use(Logger);

router.get('/', productController.getProducts);
router.get('/:pid', productController.getProductById);
router.post('/', isAdmin , productController.addProduct);
router.put('/:pid', isAdmin,  productController.updateProduct);
router.delete('/:pid', isAdmin, productController.deleteProduct);

module.exports = router;
