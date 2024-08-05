const { carts, products, users, chat} = require('../dao/factory.js');
class UsersRepository {
  constructor() {
    this.dao = users;
  }

  async getCartsById(userId) {
    return await this.dao.getCartsById(userId);
  }

  async getUserById(email) {
    return await this.dao.getUserById(email);
  }
  async updateUserByEmail(email, updates) {
    return await this.dao.updateUserByEmail(email, updates);
  }

  async addUser(first_name, last_name, email, age, password, idcarrito) {
    return await this.dao.addUser(first_name, last_name, email, age, password, idcarrito);
  }
}



module.exports = UsersRepository;
