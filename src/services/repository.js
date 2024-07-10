
const CartsRepository = require('./carts.repository.js');
const ProductsRepository = require('./products.repository.js');
const UsersRepository = require('./users.repository.js');
const ChatRepository = require('./chat.repository.js');

const cartService = new CartsRepository();
const productService = new ProductsRepository();
const userService = new UsersRepository();
const chatService = new ChatRepository();

module.exports = {
    cartService,
    productService,
    userService,
    chatService
};
