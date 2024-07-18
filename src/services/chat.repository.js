const { chat} = require('../dao/factory.js');
class ChatRepository {
    constructor() {
      this.dao = chat;
    }
    async addChat(user, message) {
      return await this.dao.addChat(user, message);
    }
  
    async readChat() {
      return await this.dao.readChat();
    }
  }
  
  module.exports = ChatRepository;