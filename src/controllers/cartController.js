const CartsManager = require("../services/CartsService.js");
const manager = new CartsManager();

exports.addCart = async (req, res) => {
  try {
    const message = await manager.addCarts();
    res.json({ message });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

exports.getCartById = async (req, res) => {
  const cart_id = req.params.cid;
  try {
    const cart = await manager.getCartsById(cart_id);
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
    const updatedCart = await manager.updateProduct(cart_id, product_id);
    res.json({ message: updatedCart });
  } catch (error) {
    console.error("Error al agregar el producto:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

exports.deleteProductFromCart = async (req, res) => {
  try {
    const result = await manager.deleteProductFromCart(req.params.cid, req.params.pid);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateCart = async (req, res) => {
  try {
    const result = await manager.updateCart(req.params.cid, req.body.products);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateProductQuantity = async (req, res) => {
  try {
    const result = await manager.updateProductQuantity(req.params.cid, req.params.pid, req.body.quantity);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteAllProductsFromCart = async (req, res) => {
  try {
    const result = await manager.deleteAllProductsFromCart(req.params.cid);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
