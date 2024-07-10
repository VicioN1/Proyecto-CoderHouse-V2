class ChatRepository {
    async addChat(user, message) {
      return await chatService.addChat(user, message);
    }
  
    async readChat() {
      return await chatService.readChat();
    }
  }
  
  module.exports = ChatRepository;