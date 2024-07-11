const UserModel = require('../../models/user.model.js');

class UserManagerMongo {
  constructor() {
    this.User = {};
  }

  async addUser(first_name, last_name, email, age, password, idcarrito) {
    try {
      const newUser = new UserModel({
        first_name,
        last_name,
        email,
        age,
        password,
        carts: [{
          cart_id: idcarrito.id,
          cart: idcarrito._id
        }],
        role: 'user',
      });
      await newUser.save();
      return newUser;
    } catch (error) {
      console.error("Error al agregar Usuario:", error);
      return "Error al agregar Usuario: " + error.message;
    }
  }

  async getUserById(email) {
    try {
      const user = await UserModel.findOne({ email });
      return user;
    } catch (error) {
      console.error("Error al consultar Usuario", error);
      return null;
    }
  }

  async getCartsById(userId) {
    try {
      const user = await UserModel.findOne({ _id: userId }).populate('carts.cart');
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

module.exports = UserManagerMongo;
