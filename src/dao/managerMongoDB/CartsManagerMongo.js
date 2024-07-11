const cartsModel = require('../../models/carts.model.js');
const ProductManagerMongo = require('./ProductManagerMongo.js');
const UserManagerMongo = require('./UserManagerMongo.js');

const productService = new ProductManagerMongo();
const userService = new UserManagerMongo();

class CartsManagerMongo {
  constructor() {
    this.Carts = {};
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

  async getCartById(cart_id) {
    try {
      const cart = await cartsModel
        .findOne({ id: cart_id })
        .populate('products.product');
      return cart.products;
    } catch (error) {
      console.error("Error al consultar Carrito", error);
      throw new Error("Error al consultar Carrito: " + error.message);
    }
  }
  async getCartId(cart_id) {
    try {
      const cart = await cartsModel
        .findOne({ id: cart_id })
        .populate('products.product');
      return cart.products;
    } catch (error) {
      console.error("Error al consultar Carrito", error);
      throw new Error("Error al consultar Carrito: " + error.message);
    }
  }

  async readCarts() {
    try {
      const carts = await cartsModel.find().populate('products.product');
      return carts;
    } catch (error) {
      throw new Error("Error al leer carritos: " + error.message);
    }
  }

  async addProductToCart(cartId, productId) {
    try {
      const product = await productService.getProductById(productId);
      if (!product) {
        throw new Error("El producto no existe");
      }
      const cart = await cartsModel.findOne({ id: cartId });
      if (!cart) {
        throw new Error("ID de carrito no encontrado");
      }

      const productInCart = cart.products.find((item) =>
        item.product.equals(product._id)
      );

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
      throw new Error(
        "Error al actualizar el producto en el carrito: " + error.message
      );
    }
  }

  async deleteProductFromCart(cartId, productId) {
    try {
      const cart = await cartsModel.findOne({ id: cartId });
      if (!cart) {
        throw new Error("ID de carrito no encontrado");
      }
      cart.products = cart.products.filter(
        (item) => item.product_id != productId
      );
      await cart.save();
      return cart;
    } catch (error) {
      console.error("Error al eliminar el producto del carrito", error);
      throw new Error(
        "Error al eliminar el producto del carrito: " + error.message
      );
    }
  }

  async updateCart(cartId, products) {
    try {
      const cart = await cartsModel
        .findOneAndUpdate({ id: cartId }, { products }, { new: true })
        .populate('products.product');
      if (!cart) {
        throw new Error("ID de carrito no encontrado");
      }
      return cart;
    } catch (error) {
      console.error("Error al actualizar el carrito", error);
      throw new Error("Error al actualizar el carrito: " + error.message);
    }
  }

  async updateProductQuantity(cartId, productId, quantity) {
    try {
      const cart = await cartsModel.findOne({ id: cartId });
      if (!cart) {
        throw new Error("ID de carrito no encontrado");
      }
      const product = cart.products.find(
        (item) => item.product_id.toString() === productId
      );
      if (product) {
        product.quantity = parseInt(quantity);
        await cart.save();
        return cart;
      } else {
        throw new Error("Producto no encontrado en el carrito");
      }
    } catch (error) {
      console.error("Error al actualizar la cantidad del producto", error);
      throw new Error(
        "Error al actualizar la cantidad del producto: " + error.message
      );
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
      throw new Error(
        "Error al eliminar todos los productos del carrito: " + error.message
      );
    }
  }

  async purchase(userid) {
    let purchaseComplete = []; //array para los productos procesados correctamente.
    let purchaseError = []; //array para los productos que no pudieron procesarse por falta de stock.
    let precioTotal = 0;
    // console.log("userid: ",userid)
    const findUser = await userService.getUserById(userid);
    // console.log("finduser: ", findUser)
    const cartId = findUser.carts[0].cart_id; //cart[0] porque es el primer elemento dentro del array.
    const cart = await this.getCartById(cartId);
    // console.log(cart)

    try {
      for (const product of cart) {
        const idproduct = product.product_id;
        const quantity = product.quantity;
        const productInDB = product.product;
        console.log(productInDB)
        
    
        if (quantity > productInDB.stock) {
          // Verificamos que la cantidad comprada no sea mayor a nuestro stock
          purchaseError.push(product); // Agregamos el producto al array de productos que no pudieron procesarse para la compra.
        } else {
          let productUpdate = productInDB;
          const quantityUpdate = productInDB.stock - quantity;
          productUpdate.stock = quantityUpdate; // Actualizamos el stock del producto
          await productService.updateProduct(idproduct, "stock", productUpdate); // Actualizamos el stock en nuestra base de datos luego de la compra
          purchaseComplete.push(product); // Agregamos el producto al array para proceder con la compra.
          const monto = productInDB.price * quantity;
          precioTotal = precioTotal + monto;
        }
      }

      // //Eliminamos los productos que se procesaron correctamente del carrito, e insertamos el array de productos no procesados:
      // const notPurchasedcart =
      //   await cartService.insertArrayOfProducts(cartId, purchaseError);

      // Solo creamos el ticket si hay productos en purchaseComplete
      if (purchaseComplete.length > 0) {
        //definimos los datos que necesitamos para el ticket:
        const ticketData = {
          amount: precioTotal,
          purchaser: userid,
        };
        console.log("-----------purchase complete-----------------")
        console.log(purchaseComplete)
        console.log("-----------purchase incomplete-----------------")
        console.log(purchaseError)
        //creamos el ticket en la base de datos.
        // const ticket = await ticketService.createTicket(ticketData);
      } else {
        console.log( "No se generó ningún ticket ya que no hubo productos procesados." );
      }
    } catch (error) {
      console.error("Error al procesar la compra", error);
      throw new Error("Error al procesar la compra: " + error.message);
    }
  }
}

module.exports = CartsManagerMongo;
