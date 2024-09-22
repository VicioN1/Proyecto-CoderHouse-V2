const UserModel = require("../../models/user.model.js");
const bcrypt = require("bcrypt");

class UserManagerMongo {
  constructor() {
    this.User = {};
  }

  async getUsers(filter = {}) {
    try {
      const users = await UserModel.find(filter).lean();
      return users;
    } catch (error) {
      console.error("Error al consultar usuarios en MongoDB: ", error);
      throw error;
    }
  }

  async addUser(first_name, last_name, email, age, password, idcarrito) {
    try {
      const newUser = new UserModel({
        first_name,
        last_name,
        email,
        age,
        password,
        carts: [
          {
            cart_id: idcarrito.id,
            cart: idcarrito._id,
          },
        ],
        role: "user",
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
      const user = await UserModel.findOne({ _id: userId }).populate(
        "carts.cart"
      );
      if (!user) {
        throw new Error("Usuario no encontrado");
      }
      const firstCart = user.carts[0];
      return firstCart;
    } catch (error) {
      console.error("Error al consultar Carrito", error);
      return null;
    }
  }

  async getConectionById(last_connection) {
    try {
      const targetDate = new Date(last_connection);
      return await UserModel.findOne({ last_connection: { $gte: targetDate } });
    } catch (error) {
      console.error("Error al consultar Usuario", error);
      return null;
    }
  }

  async updateUserByEmail(email, updates) {
    try {
      let password;
      if (updates) {
        const salt = await bcrypt.genSalt(10);
        password = await bcrypt.hash(updates, salt);
      }

      const updatedUser = await UserModel.findOneAndUpdate(
        { email: email },
        { password },
        { new: true }
      );
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
      const updatedUser = await UserModel.findByIdAndUpdate(id, updates, {
        new: true,
        runValidators: true,
      });

      if (!updatedUser) {
        throw new Error("Usuario no encontrado");
      }

      return updatedUser;
    } catch (error) {
      console.error("Error al actualizar Usuario:", error);
      return null;
    }
  }

  async deleteUser(idUser) {
    try {
      const users = await this.getUsers();
      const updatedUsers = users.filter((u) => u._id !== idUser);
      await fs.promises.writeFile(
        this.path,
        JSON.stringify(updatedUsers, null, 2)
      );
      return updatedUsers;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getUsersQuery(limit = 5, page = 1, sort, query, minAge, maxAge, role) {
    try {
      let filter = {};
  
      // Aplicar filtros
      if (query) {
        filter.$or = [
          { first_name: { $regex: query, $options: "i" } },
          { last_name: { $regex: query, $options: "i" } }
        ];
      }
  
      if (role) {
        filter.role = role;
      }
  
      if (minAge) {
        filter.age = { $gte: parseInt(minAge) };
      }
  
      if (maxAge) {
        filter.age = { ...filter.age, $lte: parseInt(maxAge) };
      }
  
      // Paginación y orden
      const skip = (page - 1) * limit;
      let users = await UserModel.find(filter)
        .select('-password') // Excluir el campo password
        .sort(sort ? { age: sort === 'asc' ? 1 : -1 } : {})
        .skip(skip)
        .limit(limit)
        .lean();
  
      // Formatear last_connection
      users = users.map(user => ({
        ...user,
        last_connection: user.last_connection ? formatDate(user.last_connection) : null,
      }));
  
      const totalDocs = await UserModel.countDocuments(filter);
  
      return {
        docs: users,
        totalDocs: totalDocs,
        limit: limit,
        totalPages: Math.ceil(totalDocs / limit),
        page: page,
        hasPrevPage: page > 1,
        hasNextPage: page * limit < totalDocs,
        prevPage: page > 1 ? page - 1 : null,
        nextPage: page * limit < totalDocs ? page + 1 : null,
      };
    } catch (error) {
      console.error("Error al consultar usuarios en MongoDB:", error);
      throw error;
    }
  }
  
}

function formatDate(date) {
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0'); // Los meses comienzan en 0
  const year = d.getFullYear();
  return `${day}-${month}-${year}`;
}


module.exports = UserManagerMongo;
