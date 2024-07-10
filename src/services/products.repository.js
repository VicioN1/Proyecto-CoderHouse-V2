const { carts, products, users, chat} = require('../dao/factory.js');

class ProductsRepository {
  constructor() {
    this.dao = products;
  }

  async getProductsQuery(limit, page, sort, query, status) {
    const result = await this.dao.getProductsQuery(limit, page, sort, query, status);
    return result;
  }

  async getProducts() {
    const result = await this.dao.readProducts();
    return result;
  }

  async getProductById(productId) {
    const result = await this.dao.getProductById(productId);
    return result;
  }

  async addProduct(title, description, code, price, stock, category, thumbnails) {
    const result = await this.dao.addProduct(
      title,
      description,
      code,
      price,
      stock,
      category,
      thumbnails
    );
    return result;
  }

  async updateProduct(productId, propertiesToUpdate) {
    const result = await this.dao.updateProduct(productId, propertiesToUpdate.field, propertiesToUpdate.newValue);
    return result;
  }

  async deleteProduct(productId) {
    const result = await this.dao.deleteProduct(productId);
    return result;
  }
}

module.exports = ProductsRepository;
