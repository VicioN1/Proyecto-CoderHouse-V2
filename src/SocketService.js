const { productService } = require("./services/repository.js");
const { chatService } = require("./services/chat.repository");
const { cartService } = require("./services/repository.js");
const { ticketService } = require("./services/repository.js");
const { userService } = require("./services/repository.js");
const CustomError = require("./services/errors/CustomError.js");
const EErrors = require("./services/errors/enums.js");
const { generarErrorProducto } = require("./services/errors/info.js");
const path = require('path');
const fs = require('fs');
const moment = require('moment');


const { deleteProductemail, deleteUseremail} = require('./utils/nodemailer.js'); 



function handleSocketConnection(socketServer) {
  socketServer.on("connection", (socket) => {
    console.log("Nuevo cliente conectado");
    socket.on("new", async (product) => {
      try {
        console.log("----------socket new---------------");
        const products = await productService.getProductsQuery(
          null,
          product.page,
          null,
          null,
          null
        );
        socketServer.emit("realTimeProducts", products);
      } catch (error) {
        console.error("Error adding product:", error);
      }
    });

    socket.on("agregarAlCarrito", async (carts) => {
      try {
        console.log("agregarAlCarrito");
        console.log(carts);
        const carrito = await cartService.addProductToCart(
          carts.idcarrot,
          carts.productCode
        );
        console.log(carrito);
        return carrito;
      } catch (error) {
        console.error("Error adding carrito:", error);
      }
    });

    socket.on("viewcarrito", async (carts) => {
      try {
        console.log("viewcarrito");
        const carrito = await getCartById(carts);
        socketServer.emit("realTimeCarts", carrito);
      } catch (error) {
        console.error("Error adding carrito:", error);
      }
    });

    socket.on("viewUsers", async (user) => {
      try {
        console.log("viewUsers");
        const Users = await userService.getUsersQuery(
          null,
          user.page,
          null,
          null,
          null
        );

        // console.log(Users)
        socketServer.emit("realTimeUsers", Users);
      } catch (error) {
        console.error("Error read Users:", error);
      }
    });
    socket.on("viewpurchase", async (purchase) => {
      try {
        console.log("viewpurchase");
        const Purchase = await ticketService.getTicketById(purchase);
        console.log(Purchase);
        socketServer.emit("realTimePurchase", Purchase);
      } catch (error) {
        console.error("Error adding Purchase:", error);
      }
    });

    socket.on("elimProduccarrito", async (carts) => {
      try {
        console.log("elimProduccarrito", carts.idcarrot, carts.productCode);
        const elimcarrito = await cartService.deleteProductFromCart(
          carts.idcarrot,
          carts.productCode
        );
        const carrito = await getCartById(carts.idcarrot);
        console.log(carrito);
        socketServer.emit("realTimeCarts", carrito);
      } catch (error) {
        console.error("Error adding carrito:", error);
      }
    });

    socket.on('productos', async (productData) => {
      try {
        console.log("----------cargarproducto productos---------------");
        console.log(productData);
    
        // Manejar imagen si está presente
        if (productData.image && Buffer.isBuffer(productData.image)) {
          const imageName = Date.now() + ".jpg"; // Puedes cambiar la extensión según el formato de la imagen
          saveImage(productData.image, imageName);
          
          // Agrega la ruta de la imagen al producto
          productData.thumbnails = `./public/product/img/${imageName}`;
      }
    
        // Procesar el producto
        await writeProducts(productData);
        
        const products = await productService.getProductsQuery(
          null,
          null,
          null,
          null,
          null
        );
        socketServer.emit('realTimeProducts', products);
        
      } catch (error) {
        console.error("Error adding product:", error);
      }
    });
    

    socket.on("updateQuantity", async (product) => {
      try {
        console.log("----------socket updateQuantity---------------");
        const quantity = await cartService.updateProductQuantity(
          product.idcarrot,
          product.productCode,
          product.quantity
        );
        const carrito = await getCartById(product.idcarrot);
        console.log(carrito);
        socketServer.emit("realTimeCarts", carrito);
      } catch (error) {
        console.error("Error adding product:", error);
      }
    });

    socket.on("deleteAllInactiveUsers", async (Data) => {
      try {
        console.log("--------deleteAllInactiveUsers-------");
        await deleteUsers(Data.emailUser);
        console.log("viewUsers");
        const Users = await userService.getUsersQuery(
          null,
          Data.page,
          null,
          null,
          null
        );
        socketServer.emit("realTimeUsers", Users);
      } catch (error) {
        console.error("Error deleting product:", error);
      }
    });

    socket.on("updateUserRole", async (Data) => {
      try {
        console.log("--------updateUserRole-------");
        console.log (Data)
        await asingrol(Data)
        console.log("viewUsers");
        const Users = await userService.getUsersQuery(
          null,
          1,
          null,
          null,
          null
        );
        socketServer.emit("realTimeUsers", Users);
      } catch (error) {
        console.error("Error deleting product:", error);
      }
    });
    socket.on("eliminarProducto", async (Data) => {
      try {
        console.log(Data.productCode);
        await deleteProducts(Data.productCode, Data.emailUser, Data.rol);
        const products = await productService.getProductsQuery(
          null,
          Data.currentPage,
          null,
          null,
          null
        );
        socketServer.emit("realTimeProducts", products);
      } catch (error) {
        console.error("Error deleting product:", error);
      }
    });

    socket.on("cargarmensajes", async (data) => {
      console.log(`cargo mensaje`);
      chat = await chatService.readChat();
      console.log(chat);
      socketServer.emit("mensaje1", chat);
    });

    socket.on("mensaje", async (data) => {
      console.log(
        `Correo electrónico: ${data.email}, Mensaje: ${data.message}`
      );
      await chatService.addChat(data.email, data.message);
      chat = await chatService.readChat();
      socketServer.emit("mensaje1", chat);
    });

    socket.on("disconnect", () => {
      console.log("Cliente desconectado");
    });
  });
}

async function readProducts() {
  try {
    const products = await productService.getProductsQuery(
      null,
      1,
      null,
      null,
      null
    );
    return products;
  } catch (error) {
    throw error;
  }
}

async function writeProducts(products) {
  try {
    if (
      !products.user_owner ||
      !products.title ||
      !products.description ||
      !products.code ||
      !products.price ||
      !products.stock ||
      !products.category
    ) {
      throw CustomError.createError({
        name: "Error al crear Producto",
        cause: generarErrorProducto(products),
        message: "Faltan campos obligatorios",
        code: EErrors.INVALID_TYPES_ERROR,
      });
    }

    const producto = await productService.addProduct(
      products.user_owner,
      products.title,
      products.description,
      products.code,
      products.price,
      products.stock,
      products.category,
      products.thumbnails // Puede ser una imagen subida o las preexistentes
    );
    
    console.log(producto);
  } catch (error) {
    throw error;
  }
}
function saveImage(imageBuffer, imageName) {
  const imagePath = path.join(__dirname, './public/product/img/', imageName);

  if (Buffer.isBuffer(imageBuffer)) {
      try {
          // Guardar la imagen usando writeFileSync
          fs.writeFileSync(imagePath, imageBuffer);
          console.log(`Imagen guardada en: ${imagePath}`);
      } catch (error) {
          console.error('Error al guardar la imagen:', error);
          throw new Error('Error al guardar la imagen');
      }
  } else {
      throw new TypeError('El argumento imageBuffer debe ser de tipo Buffer');
  }
}
async function deleteProducts(id, user_owner, rol) {
  try {
    const product_id = parseInt(id);

    const product = await productService.getProductById(product_id);
    if (!product) {
      return "Producto no encontrado" 
    }

    if (product.user_owner === user_owner) {
      console.log("Es el owner, puede borrar el producto");
      await productService.deleteProduct(product_id);
      return  "Producto eliminado por el owner."
    }

    if (rol === "admin") {
      console.log("Es admin, puede borrar el producto");
      await productService.deleteProduct(product_id);

      await deleteProductemail(product, user_owner );

      return  "Producto eliminado por el admin y notificación enviada."
    }

  } catch (error) {
    console.error("Error deleting product:", error);
    throw error;
  }
}
async function getCartById(cart_id) {
    try{
    const cart = await cartService.getCartById(cart_id);

    if (!cart) {
      return []
    }

    const products = cart || [];
    let totalPrice = 0;

    const updatedProducts = products.map(product => {
      const productTotalPrice = product.product.price * product.quantity; 
      totalPrice += productTotalPrice; 
      product.productTotalPrice= productTotalPrice
      return {
        ...product
      };
    });

    return ({ products: updatedProducts, totalPrice }) 
  } catch (error) {
    return null
  }
};

async function deleteUsers (emailUser) {
  try {
      const twoDaysAgo = Date.now() - (2 * 24 * 60 * 60 * 1000); 

        const usersToDelete = await userService.getConectionById( twoDaysAgo );
            usersToDelete.forEach(async user => {
            console.log(`Eliminar usuario inactivo: `, user);
            console.log(user.carts[0].cart_id);
            await deleteUseremail(user.email,emailUser)
            await cartService.deleteCartById(user.carts[0].cart_id);
            await userService.deleteUser(user.id)
            })

      // Responder que la operación fue exitosa
      console.log('Usuarios eliminados correctamente');
      return true

  } catch (error) {
      console.log( 'Hubo un error al eliminar los usuarios', error);
  }
};

async function asingrol (Data) {
  try {
    const updateUser = await userService.updateRolUserById(Data.userId, Data.role);
    return true

  } catch (error) {
      console.log( 'Hubo un error al cambiar rol al usuario', error);
  }
};

module.exports = { handleSocketConnection };
