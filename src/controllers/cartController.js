const { cartService } = require("../services/repository.js");
const { mailingController } = require('../utils/nodemailer.js');

exports.addCart = async (req, res) => {
  try {
    const message = await cartService.addCart();
    res.json({ message });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

exports.getCartById = async (req, res) => {
  const cart_id = req.params.cid;
  try {
    const cart = await cartService.getCartById(cart_id);
    const products = cart ? cart.products : "Not found";
    res.json({ products });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

exports.addProductToCart = async (req, res) => {
  try {
    const cart_id = req.params.cid;
    const product_id = req.params.pid;
    const updatedCart = await cartService.addProductToCart(cart_id, product_id);
    res.json({ message: updatedCart });
  } catch (error) {
    console.error("Error al agregar el producto:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

exports.deleteProductFromCart = async (req, res) => {
  try {
    const result = await cartService.deleteProductFromCart(
      req.params.cid,
      req.params.pid
    );
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateCart = async (req, res) => {
  try {
    const result = await cartService.updateCart(
      req.params.cid,
      req.body.products
    );
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateProductQuantity = async (req, res) => {
  try {
    const result = await cartService.updateProductQuantity(
      req.params.cid,
      req.params.pid,
      req.body.quantity
    );
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteAllProductsFromCart = async (req, res) => {
  try {
    const result = await cartService.deleteAllProductsFromCart(req.params.cid);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.purchase = async (req, res) => {
  try {
    const cartId = req.query.email;
    const emailId = cartId.replace(/^\$/, "");
    const userId = req.params.userId;
    const datapurchase = await cartService.purchase(emailId);

    await mailingController(emailId, datapurchase);
    const datapurchasePure = JSON.parse(JSON.stringify(datapurchase));
    console.log("---------------datapurchase---------------");
    console.log(datapurchasePure);
    console.log(datapurchasePure.code);

    res.redirect(`/purchase/${userId}?datapurchase=${encodeURIComponent(JSON.stringify(datapurchasePure))}`);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

