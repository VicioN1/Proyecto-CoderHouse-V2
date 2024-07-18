const fs = require('fs');
const path = require('path');
const productManager = require("./ProductManagerFileSystem");
const UserManagerMongo = require('./UserManagerFileSystem');
const TicketManagerMongo = require('./TicketManagerFileSystem');

const userService = new UserManagerMongo();
const ticketService = new TicketManagerMongo();
const productoMag = new productManager();

class CartManagerFileSystem {
  constructor() {
    this.filePath = path.join(__dirname, '../../data/carts.json');
  }

  async _readFile() {
    try {
      await fs.promises.access(this.filePath);
    } catch (error) {
      if (error.code === 'ENOENT') {
        await this._writeFile([]); 
      } else {
        throw error;
      }
    }

    try {
      const data = await fs.promises.readFile(this.filePath, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      console.error("Error al leer archivo", error);
      return [];
    }
  }

  async _writeFile(data) {
    try {
      await fs.promises.writeFile(this.filePath, JSON.stringify(data, null, 2));
    } catch (error) {
      console.error("Error al escribir archivo", error);
    }
  }

  async addCarts() {
    try {
      const carts = await this._readFile();
      const lastCart = carts[carts.length - 1];
      const nextId = (lastCart && parseInt(lastCart.id) + 1) || 1;

      const newCart = {
        id: String(nextId),
        products: [],
      };

      carts.push(newCart);
      await this._writeFile(carts);
      return String(nextId);
    } catch (error) {
      throw new Error("Error al agregar carrito: " + error.message);
    }
  }

  async getCartById(cart_id) {
    try {
      let cartsId = cart_id.toString();
      const carts = await this._readFile();
      const cart = carts.find(cart => cart.id === cartsId);
  
      if (!cart) {
        throw new Error("Carrito no encontrado");
      }

      const updatedProducts = await Promise.all(
        cart.products.map(async (product) => {
          const productDetails = await productoMag.getProductById(product.product_id);
          return {
            ...product,
            product: productDetails
          };
        })
      );
  
      cart.products = updatedProducts;
      return cart.products;
    } catch (error) {
      console.error("Error al consultar Carrito", error);
      throw new Error("Error al consultar Carrito: " + error.message);
    }
  }
  async getCartId(cart_id) {
    try {
      let cartsId = cart_id.toString();
      const carts = await this._readFile();
      const cart = carts.find(cart => cart.id === cartsId);
  
      if (!cart) {
        throw new Error("Carrito no encontrado");
      }

      const updatedProducts = await Promise.all(
        cart.products.map(async (product) => {
          console.log(product.product_id)
          const productDetails = await productoMag.getProductById(product.product_id);
          console.log(productDetails)
          return {
            ...product,
            product: productDetails
          };
        })
      );
  
      cart.products = updatedProducts;
  
      console.log(cart);
      return cart;
    } catch (error) {
      console.error("Error al consultar Carrito", error);
      throw new Error("Error al consultar Carrito: " + error.message);
    }
  }
  

  async readCarts() {
    try {
      return await this._readFile();
    } catch (error) {
      throw new Error("Error al leer carritos: " + error.message);
    }
  }

  async addProductToCart(cartId, productId) {
    try {
      let cartsId = cartId.toString();
      let productsID = parseInt(productId, 10);
      const carts = await this._readFile();
      const cart = carts.find(cart => cart.id === cartsId);
      
      if (!cart) {
        throw new Error("ID de carrito no encontrado");
      }
  
      const productInCart = cart.products.find(item => item.product_id === productsID);
  
      if (productInCart) {
        productInCart.quantity += 1;
      } else {
        cart.products.push({
          product_id: productsID,
          quantity: 1,
        });
      }
  
      await this._writeFile(carts);
      return cart;
    } catch (error) {
      console.error("Error al actualizar el producto en el carrito", error);
      throw error;
    }
  }
  

  async deleteProductFromCart(cartId, productId) {
    try {
      let cartsId = cartId.toString();
      let productsID = parseInt(productId, 10);
      const carts = await this._readFile();
      const cart = carts.find(cart => cart.id === cartsId);
  
      if (!cart) {
        throw new Error("ID de carrito no encontrado");
      }
  
      cart.products = cart.products.filter(item => item.product_id !== productsID);
  
      await this._writeFile(carts);
      return cart;
    } catch (error) {
      console.error("Error al eliminar el producto del carrito", error);
      throw error;
    }
  }
  

  async updateCart(cartId, products) {
    try {
      const carts = await this._readFile();
      const cart = carts.find(cart => cart.id === cartId);
      if (!cart) {
        throw new Error("ID de carrito no encontrado");
      }

      cart.products = products;
      await this._writeFile(carts);
      return cart;
    } catch (error) {
      console.error("Error al actualizar el carrito", error);
      throw error;
    }
  }

  async updateProductQuantity(cartId, productId, quantity) {
    try {
      const carts = await this._readFile();
      const cart = carts.find(cart => cart.id === cartId);
      console.log(cart)
      if (!cart) {
        throw new Error("ID de carrito no encontrado");
      }

      let num = parseInt(productId, 10);

      const product = cart.products.find(item => item.product_id === num);
      if (product) {
        product.quantity = parseInt(quantity);
        await this._writeFile(carts);
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
      const carts = await this._readFile();
      const cart = carts.find(cart => cart.id === cartId);
      if (!cart) {
        throw new Error("ID de carrito no encontrado");
      }

      cart.products = [];
      await this._writeFile(carts);
      return cart;
    } catch (error) {
      console.error("Error al eliminar todos los productos del carrito", error);
      throw error;
    }
  }
  async purchase(userid) {
    let purchaseComplete = []; 
    let purchaseError = []; 
    let precioTotal = 0;

    const findUser = await userService.getUserById(userid);
    const cartId = findUser.carts[0].cart_id; 
    const cart = await this.getCartById(cartId);

    try {
      for (const product of cart) {
        const idproduct = product.product_id;
        const quantity = product.quantity;
        const productInDB = product.product;

        if (quantity > productInDB.stock) {
          purchaseError.push(product);
        } else {
          let productUpdate = productInDB;
          const quantityUpdate = productInDB.stock - quantity;
          productUpdate.stock = quantityUpdate; 
          await productoMag.updateProduct(idproduct, "stock", productUpdate.stock); 
          product.product.cantcompra = quantity;
          console.log(product);
          purchaseComplete.push(product); 
          const monto = productInDB.price * quantity;
          precioTotal = precioTotal + monto;
          this.deleteProductFromCart(cartId,idproduct)
        }
      }

      if (purchaseComplete.length > 0) {
        
        const Purchase = {
          Estado: 1,
          Complete: purchaseComplete,
          Incomplete: purchaseError
        };

        const ticketData = {
          amount: precioTotal,
          purchaser: Purchase,
          userid: userid
        };
        const ticket = await ticketService.addTicket(ticketData);

        return ticket;
      } else {
        const Purchase = {
          Estado: 1,
          Complete: [],
          Incomplete: purchaseError
        };

        const ticketData = {
          amount: 0,
          purchaser: Purchase,
          userid: userid
        };
        const ticket = await ticketService.addTicket(ticketData);
        this.deleteAllProductsFromCart(cartId);
        return ticket;
      }
    } catch (error) {
      console.error("Error al procesar la compra", error);
      throw new Error("Error al procesar la compra: " + error.message);
    }
  }


}

module.exports = CartManagerFileSystem;
