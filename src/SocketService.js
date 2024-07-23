const { productService } = require('./services/repository.js');
const { chatService } = require("./services/chat.repository");
const { cartService }= require('./services/repository.js');
const { ticketService }= require('./services/repository.js');
const CustomError = require('./services/errors/CustomError.js');
const EErrors = require('./services/errors/enums.js');
const { generarErrorProducto } = require('./services/errors/info.js');

function handleSocketConnection(socketServer) {
    socketServer.on('connection', socket => {
        console.log("Nuevo cliente conectado");
        socket.on('new', async product => {
            try {
                console.log("----------socket new---------------");
                const products = await productService.getProductsQuery(null , product.page , null, null, null);
                socketServer.emit('realTimeProducts', products);
            } catch (error) {
                console.error('Error adding product:', error);
            }
        });

        socket.on('agregarAlCarrito', async carts => {
            try {
                console.log("agregarAlCarrito")
                console.log(carts)
                const carrito = await cartService.addProductToCart(carts.idcarrot, carts.productCode);
                console.log(carrito)
                return carrito
            } catch (error) {
                console.error('Error adding carrito:', error);
            }
        });


        socket.on('viewcarrito', async carts => {
            try {
                console.log("viewcarrito")
                const carrito = await cartService.getCartById(carts);
                socketServer.emit('realTimeCarts', carrito );
            } catch (error) {
                console.error('Error adding carrito:', error);
            }
        });
        socket.on('viewpurchase', async purchase => {
            try {
                console.log("viewpurchase")
                const Purchase = await ticketService.getTicketById(purchase);
                console.log(Purchase)
                socketServer.emit('realTimePurchase', Purchase );
            } catch (error) {
                console.error('Error adding Purchase:', error);
            }
        });

        socket.on('elimProduccarrito', async carts => {
            try {
                console.log("elimProduccarrito",carts.idcarrot, carts.productCode)
                const elimcarrito = await cartService.deleteProductFromCart(carts.idcarrot, carts.productCode);
                const carrito = await cartService.getCartById(carts.idcarrot);
                socketServer.emit('realTimeCarts', carrito );
            } catch (error) {
                console.error('Error adding carrito:', error);
            }
        });
        
        socket.on('productos', async product => {
            try {
                console.log("----------socket productos---------------");
                await writeProducts(product);
                const products = await readProducts(); 
                socketServer.emit('realTimeProducts', products);
            } catch (error) {
                console.error('Error adding product:', error);
            }
        });
        
        socket.on('updateQuantity', async product => {
            try {
                console.log("----------socket productos---------------");
                console.log(product.idcarrot, product.productCode, product.quantity);
                const carrito = await cartService.updateProductQuantity(product.idcarrot, product.productCode, product.quantity );
            } catch (error) {
                console.error('Error adding product:', error);
            }
        });

        

        socket.on('eliminarProducto', async Data => {
            try {
                console.log(Data.productCode)
                await productService.deleteProduct(Data.productCode);
                const products = await productService.getProductsQuery(null , Data.currentPage , null, null, null); 
                socketServer.emit('realTimeProducts', products);
            } catch (error) {
                console.error('Error deleting product:', error);
            }
        });

        socket.on('cargarmensajes', async data => {
            console.log(`cargo mensaje`)
            chat = await chatService.readChat()
            console.log(chat)
            socketServer.emit('mensaje1', chat)
        })

        socket.on('mensaje', async data => {
            console.log(`Correo electrónico: ${data.email}, Mensaje: ${data.message}`)
            await chatService.addChat(data.email,data.message)
            chat = await chatService.readChat()
            socketServer.emit('mensaje1', chat)
        })

        socket.on('disconnect', () => {
            console.log("Cliente desconectado");
        });
    });
}

async function readProducts() {
    try {
        const products = await productService.getProductsQuery(null , 1 , null, null, null);
        return products;
    } catch (error) {
        throw error; 
    }
}

async function writeProducts(products) {
    try {
        if (!products.title || !products.description || !products.code || !products.price || !products.stock || !products.category) {
            throw CustomError.createError({
              name:"Error al crear Producto",
              cause: generarErrorProducto(products),
              message: "Faltan campos obligatorios",
              code: EErrors.INVALID_TYPES_ERROR
          })
          }
        const producto = await productService.addProduct(products.title, products.description, products.code, products.price, products.stock, products.category, products.thumbnails);
        console.log(producto);
    } catch (error) {
        throw error; 
    }
}
async function deleteProducts(product_id) {
    try {
        const id = parseInt(product_id);
        await productService.deleteProduct(product_id); 
        console.log("Producto eliminado:", id);
    } catch (error) {
        console.error('Error deleting product:', error);
        throw error; 
    }
}

module.exports = { handleSocketConnection };
