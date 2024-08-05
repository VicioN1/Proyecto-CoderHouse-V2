
const CartsRepository = require('./carts.repository.js');
const ProductsRepository = require('./products.repository.js');
const UsersRepository = require('./users.repository.js');
const ChatRepository = require('./chat.repository.js');
const TicketsRepository = require('./tickets.repository.js');
const ResetTokensRepository = require('./resetPassCodes.repository.js');

const cartService = new CartsRepository();
const productService = new ProductsRepository();
const userService = new UsersRepository();
const chatService = new ChatRepository();
const ticketService = new TicketsRepository();
const ResetPassCodeService = new ResetTokensRepository();

module.exports = {
    cartService,
    productService,
    userService,
    chatService,
    ticketService,
    ResetPassCodeService
};
