const fs = require('fs').promises;
const path = require('path');

class ChatManagerFileSystem {
  constructor() {
    this.filePath = path.join(__dirname, '../../data/chats.json');
    this.ensureFileExists();
  }

  async ensureFileExists() {
    try {
      await fs.access(this.filePath);
    } catch (error) {
      if (error.code === 'ENOENT') {
        await this.writeChatsToFile([]); 
      } else {
        throw new Error('Error al verificar el archivo de chats: ' + error.message);
      }
    }
  }

  async readChatsFromFile() {
    try {
      const data = await fs.readFile(this.filePath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      if (error.code === 'ENOENT') {
        return [];
      } else {
        throw new Error('Error al leer los chats: ' + error.message);
      }
    }
  }

  async writeChatsToFile(chats) {
    try {
      await fs.writeFile(this.filePath, JSON.stringify(chats, null, 2));
    } catch (error) {
      throw new Error('Error al escribir los chats: ' + error.message);
    }
  }

  async addChat(user, message) {
    try {
      const chats = await this.readChatsFromFile();
      const newChat = { user, message, timestamp: new Date().toISOString() };
      chats.push(newChat);
      await this.writeChatsToFile(chats);
      console.log("Mensaje guardado");
      return "Mensaje guardado";
    } catch (error) {
      console.error("Error al agregar chat:", error);
      throw new Error('Error al agregar chat: ' + error.message);
    }
  }

  async readChat() {
    try {
      const chats = await this.readChatsFromFile();
      return chats;
    } catch (error) {
      console.error("Error al obtener todos los chats", error);
      return [];
    }
  }
}

module.exports = ChatManagerFileSystem;
