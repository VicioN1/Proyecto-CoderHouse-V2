const {users} = require('../dao/factory.js');
class UsersRepository {
  constructor() {
    this.dao = users;
  }

  async getCartsById(userId) {
    return await this.dao.getCartsById(userId);
  }

  async getUserByEmail(email) {
    return await this.dao.getUserByEmail(email);
  }

  async getUserById(id) {
    return await this.dao.getUserById(id);
  }

  async updateUserByEmail(email, updates) {
    return await this.dao.updateUserByEmail(email, updates);
  }

  async updateRolUserById(userID, newRol) {
    return await this.dao.updateRolUserById(userID, newRol);
  }

  async addUser(first_name, last_name, email, age, password, idcarrito) {
    return await this.dao.addUser(first_name, last_name, email, age, password, idcarrito);
  }
}



module.exports = UsersRepository;
