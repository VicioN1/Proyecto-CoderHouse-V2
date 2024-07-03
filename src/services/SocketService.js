const ProductService = require("./ProductService.js");
const ChatService = require("./ChatService");
const CartsService = require("./CartsService.js");

const service_Product = new ProductService();
const service_Chat = new ChatService();
const service_Carts = new CartsService();

function handleSocketConnection(socketServer) {
    socketServer.on('connection', socket => {
        console.log("Nuevo cliente conectado");
        socket.on('new', async product => {
            try {
                const products = await service_Product.getProducts(null , product.page , null, null, null);
                socketServer.emit('realTimeProducts', products);
            } catch (error) {
                console.error('Error adding product:', error);
            }
        });

        socket.on('agregarAlCarrito', async carts => {
            try {
                const carrito = await service_Carts.updateProduct(carts.idcarrot, carts.productCode);
            } catch (error) {
                console.error('Error adding carrito:', error);
            }
        });


        socket.on('viewcarrito', async carts => {
            try {
                console.log("viewcarrito")
                const carrito = await service_Carts.getCartsById(carts);
                socketServer.emit('realTimeCarts', carrito );
            } catch (error) {
                console.error('Error adding carrito:', error);
            }
        });

        socket.on('elimProduccarrito', async carts => {
            try {
                console.log("elimProduccarrito",carts.idcarrot, carts.productCode)
                const elimcarrito = await service_Carts.deleteProductFromCart(carts.idcarrot, carts.productCode);
                const carrito = await service_Carts.getCartsById(carts.idcarrot);
                socketServer.emit('realTimeCarts', carrito );
            } catch (error) {
                console.error('Error adding carrito:', error);
            }
        });

        socket.on('productos', async product => {
            try {
                await writeProducts(product);
                const products = await readProducts(); 
                socketServer.emit('realTimeProducts', products);
            } catch (error) {
                console.error('Error adding product:', error);
            }
        });

        

        socket.on('eliminarProducto', async productId => {
            try {
                console.log(productId)
                await deleteProducts(productId);
                const newproducts = await readProducts(); 
                socketServer.emit('realTimeProducts', newproducts);
            } catch (error) {
                console.error('Error deleting product:', error);
            }
        });

        socket.on('cargarmensajes', async data => {
            console.log(`cargo mensaje`)
            chat = await service_Chat.readChat()
            console.log(chat)
            socketServer.emit('mensaje1', chat)
        })

        socket.on('mensaje', async data => {
            console.log(`Correo electrónico: ${data.email}, Mensaje: ${data.message}`)
            await service_Chat.addChat(data.email,data.message)
            chat = await service_Chat.readChat()
            socketServer.emit('mensaje1', chat)
        })

        socket.on('disconnect', () => {
            console.log("Cliente desconectado");
        });
    });
}

async function readProducts() {
    try {
        const products = await service_Product.getProducts(null , 1 , null, null, null);
        return products;
    } catch (error) {
        throw error; 
    }
}

async function writeProducts(products) {
    try {
        const producto = await service_Product.addProduct(products.title, products.description, products.code, products.price, products.stock, products.category, products.thumbnails);
        console.log(producto);
    } catch (error) {
        throw error; 
    }
}
async function deleteProducts(product_id) {
    try {
        const id = parseInt(product_id);
        await service_Product.deleteProduct(product_id); 
        console.log("Producto eliminado:", id);
    } catch (error) {
        console.error('Error deleting product:', error);
        throw error; 
    }
}

module.exports = { handleSocketConnection };
