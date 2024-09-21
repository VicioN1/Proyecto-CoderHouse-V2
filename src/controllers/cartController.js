const { cartService } = require("../services/repository.js");
const { mailingController } = require('../utils/nodemailer.js');

exports.addCart = async (req, res) => {
  try {
    const cart = await cartService.addCarts();
    res.status(200).json({ payload: cart });
  } catch (error) {
    req.logger.error(`Error al agregar producto al carrito: ${error.message}`);
    res.status(404).json({ message: error.message });
  }
};

exports.getCartById = async (req, res) => {
  const cart_id = req.params.cid;
  try {
    const cart = await cartService.getCartById(cart_id);

    if (!cart) {
      req.logger.info(`Carrito con ID ${cart_id} no encontrado`);
      return res.status(404).json({ message: "Carrito no encontrado" });
    }

    const products = cart || [];
    let totalPrice = 0;

    // Recorre los productos para calcular el precio total según la cantidad
    const updatedProducts = products.map(product => {
      const productTotalPrice = product.product.price * product.quantity; // Calcula el precio total del producto
      totalPrice += productTotalPrice; // Suma al precio total del carrito

      return {
        ...product,
        productTotalPrice // Incluye el precio total por producto
      };
    });

    req.logger.info(`Productos obtenidos del carrito ${cart_id}`);
    res.json({ products: updatedProducts, totalPrice }); // Devuelve los productos y el precio total
  } catch (error) {
    req.logger.error(`Error al obtener carrito por ID: ${error.message}`);
    res.status(500).json({ message: "Error al obtener el carrito" });
  }
};


exports.addProductToCart = async (req, res) => {
  const cart_id = req.params.cid;
  const product_id = req.params.pid;
  try {
    const updatedCart = await cartService.addProductToCart(cart_id, product_id);
    if (!updatedCart) {
      req.logger.info(`No se pudo agregar el producto ${product_id} al carrito ${cart_id}. Carrito o producto no encontrado.`);
      return res.status(404).json({ message: "Carrito o producto no encontrado" });
    }
    req.logger.info(`Producto ${product_id} agregado al carrito ${cart_id}`);
    res.json({ message: updatedCart });
  } catch (error) {
    req.logger.error(`Error al agregar el producto al carrito: ${error.message}`);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

exports.deleteProductFromCart = async (req, res) => {
  const cart_id = req.params.cid;
  const product_id = req.params.pid;
  try {
    const result = await cartService.deleteProductFromCart(cart_id, product_id);
    if (!result) {
      req.logger.info(`No se pudo eliminar el producto ${product_id} del carrito ${cart_id}. Carrito o producto no encontrado.`);
      return res.status(404).json({ message: "Carrito o producto no encontrado" });
    }
    req.logger.info(`Producto ${product_id} eliminado del carrito ${cart_id}`);
    res.json(result);
  } catch (error) {
    req.logger.error(`Error al eliminar el producto del carrito: ${error.message}`);
    res.status(500).json({ message: "Error interno del servidor" });
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
    console.log("---------------purchase---------------");
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

