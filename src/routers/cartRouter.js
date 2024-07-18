const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController");
const { isAuthenticated, isNotAuthenticated, ensureAdmin, ensureUser} = require('../middleware/auth');

router.post("/", isAuthenticated, cartController.addCart);
router.get("/:cid",isAuthenticated, cartController.getCartById);
router.post("/:cid/product/:pid",isAuthenticated, cartController.addProductToCart);
router.delete("/:cid/product/:pid", isAuthenticated, cartController.deleteProductFromCart);
router.put("/:cid", isAuthenticated,cartController.updateCart);
router.put("/:cid/product/:pid", isAuthenticated, cartController.updateProductQuantity);
router.delete("/:cid", isAuthenticated, cartController.deleteAllProductsFromCart);
router.get('/:cid/purchase',isAuthenticated, cartController.purchase);

module.exports = router;
