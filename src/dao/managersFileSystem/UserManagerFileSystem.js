const fs = require('fs').promises;
const path = require('path');
const bcrypt = require('bcrypt');

class UserServiceFS {
  constructor() {
    this.filePath = path.join(__dirname, '../../data/users.json');
  }

  async readUsers() {
    try {
      await fs.access(this.filePath);
    } catch (error) {
      if (error.code === 'ENOENT') {
        await this.writeUsers([]); 
      } else {
        throw new Error('Error al acceder al archivo de usuarios: ' + error.message);
      }
    }

    try {
      const data = await fs.readFile(this.filePath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      throw new Error('Error al leer los usuarios: ' + error.message);
    }
  }

  async writeUsers(users) {
    try {
      await fs.writeFile(this.filePath, JSON.stringify(users, null, 2));
    } catch (error) {
      throw new Error('Error al escribir los usuarios: ' + error.message);
    }
  }

  async addUser(first_name, last_name, email, age, password, idcarrito) {
    try {
      const users = await this.readUsers();
      console.log("-------------------------idcarrito------------------")
      console.log(idcarrito)

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const newUser = {
        id: (users.length > 0 ? parseInt(users[users.length - 1].id) + 1 : 1).toString(),
        first_name,
        last_name,
        email,
        age,
        password: hashedPassword,
        carts: [{
          cart_id: idcarrito.id,
          cart: idcarrito.id
        }],
        role: 'user'
      };

      users.push(newUser);
      await this.writeUsers(users);

      return newUser;
    } catch (error) {
      console.error("Error al agregar Usuario:", error);
      return "Error al agregar Usuario: " + error.message;
    }
  }

  async getUserById(email) {
    try {
      const users = await this.readUsers();
      return users.find(user => user.email === email);
    } catch (error) {
      console.error("Error al consultar Usuario", error);
      return null;
    }
  }

  async getCartsById(userId) {
    try {
      const users = await this.readUsers();
      const user = users.find(user => user.id === userId);
      if (!user) {
        throw new Error('Usuario no encontrado');
      }
      const firstCart = user.carts[0];
      return firstCart;
    } catch (error) {
      console.error("Error al consultar Carrito", error);
      return null;
    }
  }
}

module.exports = UserServiceFS;
