const UserModel = require('../../models/user.model.js');
const bcrypt = require('bcrypt');

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

  async getUserByEmail(email) {
    try {
      const user = await UserModel.findOne({ email });
      return user;
    } catch (error) {
      console.error("Error al consultar Usuario", error);
      return null;
    }
  }

  async getUserById(id) {
    try {
      const user = await UserModel.findOne({ id });
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

  async updateUserByEmail(email, updates) {
    try {
      let password
      if (updates) {
        const salt = await bcrypt.genSalt(10);
        password = await bcrypt.hash(updates, salt);
      }

      const updatedUser = await UserModel.findOneAndUpdate({ email: email }, {password}, { new: true });
      return updatedUser;
    } catch (error) {
      console.error("Error al actualizar Usuario:", error);
      return null;
    }
  }

  async updateRolUserById(userID, newRol) {
    try {
      const updatedUser = await UserModel.findByIdAndUpdate(
        userID,
        { role: newRol },
        { new: true, runValidators: true }
      );
  
      if (!updatedUser) {
        throw new Error("Usuario no encontrado");
      }
  
      return updatedUser;
    } catch (error) {
      console.error("Error al actualizar Usuario:", error);
      return null;
    }
  }

  async updateUserById(id, updates) {
    try {
      const updatedUser = await UserModel.findByIdAndUpdate(
        id,
        updates,
        { new: true, runValidators: true }
      );

      if (!updatedUser) {
        throw new Error("Usuario no encontrado");
      }

      return updatedUser;
    } catch (error) {
      console.error("Error al actualizar Usuario:", error);
      return null;
    }
  }

  
}

module.exports = UserManagerMongo;
