const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController");

router.post("/", cartController.addCart);
router.get("/:cid", cartController.getCartById);
router.post("/:cid/product/:pid", cartController.addProductToCart);
router.delete("/:cid/product/:pid", cartController.deleteProductFromCart);
router.put("/:cid", cartController.updateCart);
router.put("/:cid/product/:pid", cartController.updateProductQuantity);
router.delete("/:cid", cartController.deleteAllProductsFromCart);

module.exports = router;
