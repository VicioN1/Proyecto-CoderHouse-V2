const { carts } = require("../dao/factory.js");
class CartsRepository {
  constructor() {
    this.dao = carts;
  }

  async addCarts() {
    return await this.dao.addCarts();
  }

  async getCartById(cartId) {
    return await this.dao.getCartById(cartId);
  }
  async getCartId(cartId) {
    return await this.dao.getCartId(cartId);
  }

  async purchase(userId) {
    return await this.dao.purchase(userId);
  }

  async addProductToCart(cartId, productId) {
    return await this.dao.addProductToCart(cartId, productId);
  }

  async deleteProductFromCart(cartId, productId) {
    return await this.dao.deleteProductFromCart(cartId, productId);
  }

  async updateCart(cartId, products) {
    return await this.dao.updateCart(cartId, products);
  }

  async updateProductQuantity(cartId, productId, quantity) {
    return await this.dao.updateProductQuantity(cartId, productId, quantity);
  }

  async deleteAllProductsFromCart(cartId) {
    return await this.dao.deleteAllProductsFromCart(cartId);
  }
}

module.exports = CartsRepository;
