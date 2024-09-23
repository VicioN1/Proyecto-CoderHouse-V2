const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController.js');
const {  isAdmin, isAuthorized} = require('../middleware/auth');
const { Logger} = require('../utils/logger.js');
const upload  = require('../middleware/multerProduct.js');

router.use(Logger);

router.get('/', productController.getProducts);
router.get('/:pid', productController.getProductById);
router.post('/', isAdmin,  upload.single('image'), productController.addProduct);
router.put('/:pid', isAdmin,  productController.updateProduct);
router.delete('/:pid', isAuthorized, productController.deleteProduct);

module.exports = router;
