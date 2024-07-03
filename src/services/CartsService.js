const cartsModel = require("../models/carts.model.js");
const ProductService = require('./ProductService.js');

const serviceProduct = new ProductService();

class CartService {
  constructor() {
    this.products = {};
    this.countId = 1;
  }

  async addCarts() {
    try {
      const lastCart = await cartsModel.findOne().sort({ id: -1 });
      const nextId = (lastCart && parseInt(lastCart.id) + 1) || 1;

      const newCart = await cartsModel.create({
        id: String(nextId),
        products: [],
      });
      return String(nextId);
    } catch (error) {
      throw new Error("Error al agregar carrito: " + error.message);
    }
  }

  async getCartsById(cart_id) {
    try {
      const cart = await cartsModel.findOne({ id: cart_id }).populate("products.product");
      return cart;
    } catch (error) {
      console.error("Error al consultar Carrito", error);
      throw new Error("Error al consultar Carrito: " + error.message);
    }
  }

  async readCarts() {
    try {
      const datos = await cartsModel.find().populate("products.product");
      return datos;
    } catch (error) {
      throw new Error("Error al leer carritos: " + error.message);
    }
  }

  async updateProduct(cartId, productId) {
    try {
      const product = await serviceProduct.getProductById(productId);
      if (!product) {
        throw new Error("El producto no existe");
      }
      const cart = await cartsModel.findOne({ id: cartId });
      if (!cart) {
        throw new Error("ID de carrito no encontrado");
      }

      const productInCart = cart.products.find((item) => item.product.equals(product._id));

      if (productInCart) {
        productInCart.quantity += 1;
      } else {
        cart.products.push({
          product_id: product.idProduct,
          product: product._id,
          quantity: 1,
        });
      }

      await cart.save();
      return cart;
    } catch (error) {
      console.error("Error al actualizar el producto en el carrito", error);
      throw error;
    }
  }

  async deleteProductFromCart(cartId, productId) {
    try {
      const cart = await cartsModel.findOne({ id: cartId });
      if (!cart) {
        throw new Error("ID de carrito no encontrado");
      }
      cart.products = cart.products.filter((item) => item.product_id != productId);
      await cart.save();
      return cart;
    } catch (error) {
      console.error("Error al eliminar el producto del carrito", error);
      throw error;
    }
  }

  async updateCart(cartId, products) {
    try {
      const cart = await cartsModel.findOneAndUpdate(
        { id: cartId },
        { products },
        { new: true }
      );
      if (!cart) {
        throw new Error("ID de carrito no encontrado");
      }
      return cart;
    } catch (error) {
      console.error("Error al actualizar el carrito", error);
      throw error;
    }
  }

  async updateProductQuantity(cartId, productId, quantity) {
    try {
      const cart = await cartsModel.findOne({ id: cartId });
      if (!cart) {
        throw new Error("ID de carrito no encontrado");
      }
      const product = cart.products.find((item) => item.product_id.toString() === productId);
      if (product) {
        product.quantity = parseInt(quantity);
        await cart.save();
        return cart;
      } else {
        throw new Error("Producto no encontrado en el carrito");
      }
    } catch (error) {
      console.error("Error al actualizar la cantidad del producto", error);
      throw error;
    }
  }

  async deleteAllProductsFromCart(cartId) {
    try {
      const cart = await cartsModel.findOne({ id: cartId });
      if (!cart) {
        throw new Error("ID de carrito no encontrado");
      }
      cart.products = [];
      await cart.save();
      return cart;
    } catch (error) {
      console.error("Error al eliminar todos los productos del carrito", error);
      throw error;
    }
  }
}

module.exports = CartService;
