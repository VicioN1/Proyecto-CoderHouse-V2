const fs = require("fs").promises;
const path = require("path");
const bcrypt = require("bcrypt");

class UserServiceFS {
  constructor() {
    this.filePath = path.join(__dirname, "../../data/users.json");
    this.defaultLimit = 5;
  }

  // Método privado para verificar y leer el archivo
  async _ensureFileExists() {
    try {
      await fs.access(this.filePath);
    } catch (error) {
      if (error.code === "ENOENT") {
        await this.writeUsers([]); // Si no existe, crear un archivo vacío
      } else {
        throw new Error("Error al acceder al archivo: " + error.message);
      }
    }
  }

  async _readFile() {
    await this._ensureFileExists();
    const data = await fs.readFile(this.filePath, "utf8");
    return JSON.parse(data);
  }

  async writeUsers(users) {
    try {
      await fs.writeFile(this.filePath, JSON.stringify(users, null, 2));
    } catch (error) {
      throw new Error("Error al escribir los usuarios: " + error.message);
    }
  }

  async getUsers(filter = {}) {
    try {
      const users = await this._readFile();
      return users.filter(user =>
        Object.keys(filter).every(key => user[key] === filter[key])
      );
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
      throw error;
    }
  }

  async addUser(first_name, last_name, email, age, password, idcarrito) {
    try {
      const users = await this._readFile();
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const newUser = {
        id: (users.length > 0 ? parseInt(users[users.length - 1].id) + 1 : 1).toString(),
        first_name,
        last_name,
        email,
        age,
        password: hashedPassword,
        carts: [{ cart_id: idcarrito.id, cart: idcarrito.id }],
        role: "user",
        documents: [],
        hasUploadedDocuments: false,
        last_connection: Date.now(),
      };

      users.push(newUser);
      await this.writeUsers(users);

      return newUser;
    } catch (error) {
      console.error("Error al agregar usuario:", error);
      throw new Error("Error al agregar usuario: " + error.message);
    }
  }

  async getCartsById(userId) {
    try {
      const users = await this.getUsers();
      const user = users.find((user) => user.id === userId);
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

  async getUserByEmail(email) {
    try {
      const users = await this.getUsers({ email });
      return users.length ? users[0] : null;
    } catch (error) {
      console.error("Error al consultar usuario:", error);
      throw error;
    }
  }

  async getUserById(id) {
    try {
      const users = await this.getUsers({ id });
      return users.length ? users[0] : null;
    } catch (error) {
      console.error("Error al consultar usuario:", error);
      throw error;
    }
  }

  async updateUserById(userId, updates) {
    try {
      const users = await this._readFile();
      const userIndex = users.findIndex(user => user.id === userId);

      if (userIndex === -1) throw new Error("Usuario no encontrado");

      users[userIndex] = { ...users[userIndex], ...updates };
      await this.writeUsers(users);

      return users[userIndex];
    } catch (error) {
      console.error("Error al actualizar usuario:", error);
      throw error;
    }
  }

  async deleteUser(userId) {
    try {
      const users = await this._readFile();
      const updatedUsers = users.filter(user => user.id !== userId);

      if (updatedUsers.length === users.length) throw new Error("Usuario no encontrado");

      await this.writeUsers(updatedUsers);
      return updatedUsers;
    } catch (error) {
      console.error("Error al eliminar usuario:", error);
      throw error;
    }
  }

  async getUsersQuery(limit, page = 1, sort, query, minAge, maxAge, role) {
    try {
      let users = await this._readFile();
      limit = parseInt(limit) || this.defaultLimit;

      // Aplicar filtros
      if (query) {
        users = users.filter(user =>
          user.first_name.toLowerCase().includes(query.toLowerCase()) ||
          user.last_name.toLowerCase().includes(query.toLowerCase())
        );
      }

      if (role) {
        users = users.filter(user => user.role === role);
      }

      if (minAge) {
        users = users.filter(user => user.age >= parseInt(minAge));
      }

      if (maxAge) {
        users = users.filter(user => user.age <= parseInt(maxAge));
      }

      // Aplicar orden
      if (sort) {
        users.sort((a, b) => (sort === "asc" ? a.age - b.age : b.age - a.age));
      }

      // Omitir el campo password y formatear last_connection
      users = users.map(user => {
        const { password, ...userWithoutPassword } = user;
        return {
          ...userWithoutPassword,
        };
      });

      // Paginación
      const offset = (page - 1) * limit;
      const paginatedUsers = users.slice(offset, offset + limit);

      return {
        docs: paginatedUsers,
        totalDocs: users.length,
        limit,
        totalPages: Math.ceil(users.length / limit),
        page,
        hasPrevPage: page > 1,
        hasNextPage: page * limit < users.length,
        prevPage: page > 1 ? page - 1 : null,
        nextPage: page * limit < users.length ? page + 1 : null,
      };
    } catch (error) {
      console.error("Error al consultar usuarios:", error);
      throw error;
    }
  }

  async getConectionById(filter) {
    try {
      const users = await this._readFile();
      console.log("filter")
      console.log(filter)
      // Filtrar usuarios según el timestamp Epoch
      const filteredUsers = users.filter(user => user.last_connection < filter);

      return filteredUsers;
    } catch (error) {
      console.error("Error al obtener usuarios por conexión:", error);
      throw error;
    }
  }
}




module.exports = UserServiceFS;
