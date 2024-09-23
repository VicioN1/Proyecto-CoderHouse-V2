const mongoose = require("mongoose");

const CartsMongo = require("./managerMongoDB/CartsManagerMongo.js");
const ProductsMongo = require("./managerMongoDB/ProductManagerMongo.js");
const UsersMongo = require("./managerMongoDB/UserManagerMongo.js");
const ChatMongo = require("./managerMongoDB/ChatManagerMongo.js");
const TicketMongo = require("./TicketManagerMongo.js");
const ResetPass = require("./managerMongoDB/ResetPassCodeManagerMongo.js");

const CartsFS = require("./managersFileSystem/CartManagerFileSystem.js");
const ProductsFS = require("./managersFileSystem/ProductManagerFileSystem.js");
const UsersFS = require("./managersFileSystem/UserManagerFileSystem");
const ChatFS = require("./managersFileSystem/ChatManagerFileSystem.js");
const TicketFS = require("./managersFileSystem/TicketManagerFileSystem.js");
const ResetPassFS = require("./managersFileSystem/ResetPassCodeManagerFileSystem");



let carts;
let products;
let users;
let chat;
let ticket;
let ResetPassCode;

switch ("FILE_SYSTEM") {
  case "MONGO":
    console.log("---------------Estoy Usando MONGO--------------");

    carts = new CartsMongo();
    products = new ProductsMongo();
    users = new UsersMongo();
    chat = new ChatMongo();
    ticket = new TicketMongo();
    ResetPassCode = new ResetPass();
    break;
    
    case "FILE_SYSTEM":
      console.log("---------------Estoy Usando FS--------------");
      
      carts = new CartsFS();
      products = new ProductsFS();
      users = new UsersFS();
      chat = new ChatFS();
      ticket = new TicketFS();
      ResetPassCode = new ResetPassFS();
    break;
}

module.exports = {
  carts,
  products,
  users,
  chat,
  ticket,
  ResetPassCode
};
