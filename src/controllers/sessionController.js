const bcrypt = require("bcrypt");
const passport = require("passport");
const { userService } = require("../services/repository.js");
const { cartService } = require("../services/repository.js");
const UserDTO = require("../dao/DTOs/userDTO.js");
const CustomError = require("../services/errors/CustomError.js");
const EErrors = require("../services/errors/enums.js");
const { generarErrorUsuario } = require("../services/errors/info.js");

exports.register = async (req, res) => {
  const { first_name, last_name, email, age, password } = req.body;
  try {
    if (!first_name || !last_name || !email || !age) {
      throw CustomError.createError({
        name: "Error al crear el usuario",
        cause: generarErrorUsuario({ first_name, last_name, email, age }),
        message: "Faltan campos obligatorios",
        code: EErrors.INVALID_TYPES_ERROR,
      });
    }
    const carrito = await cartService.addCarts();
    const idcarrito = await cartService.getCartId(carrito);
    console.log(carrito);
    console.log("---------------register idcarrito---------------");
    console.log(idcarrito);
    await userService.addUser(
      first_name,
      last_name,
      email,
      age,
      password,
      idcarrito
    );
    res.redirect("/login");
  } catch (err) {
    console.log(err);
    res.status(500).send("Error al registrar usuario");
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await userService.getUserById(email);
    if (!user) {
      req.logger.info(`Usuario no encontrado con email: ${email}`);
      return res.status(404).send("Usuario no encontrado");
    } 

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      req.logger.info(`Contraseña incorrecta Usuario email: ${email} `);
      return res.status(401).send("Contraseña incorrecta");
    }
    const carts = await userService.getCartsById(user._id || user.id);
    req.logger.debug(`Carrito id: ${carts} `);

    req.session.user = {
      id: user._id || user.id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      age: user.age,
      cart: carts.cart_id,
      role: user.role,
    };

    if (user.role === "admin") {
      res.redirect("/realtimeproductsAdmin");
    } else {
      res.redirect("/realtimeproductsUser");
    }
  } catch (err) {
    req.logger.error(`Error al inciar sesión: ${err}`);
    res.status(500).send("Error al iniciar sesión");
  }
};

exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      req.logger.error(`Error al cerrar sesión: ${err}`);
      return res.status(500).send("Error al cerrar sesión");
    }
    res.redirect("/login");
  });
};

(exports.github = passport.authenticate("github", { scope: ["user:email"] })),
  async (req, res) => {};

exports.githubCallback = (req, res, next) => {
  passport.authenticate(
    "github",
    { failureRedirect: "/login" },
    async (err, user, info) => {
      if (err) {
        req.logger.error(`githubCallback - ${err}`);
        return next(err);
      }
      if (!user) {
        return res.redirect("/login");
      }
      req.logIn(user, async (err) => {
        if (err) {
          return next(err);
        }
        const carts = await userService.getCartsById(user._id);

        req.session.user = {
          id: user._id || user.id,
          first_name: user.first_name,
          last_name: user.last_name,
          email: user.email,
          age: user.age,
          cart: carts.cart_id,
          role: user.role,
        };

        if (user.role === "admin") {
          res.redirect("/realtimeproductsAdmin");
        } else {
          res.redirect("/realtimeproductsUser");
        }
      });
    }
  )(req, res, next);
};

exports.getCurrentUser = (req, res) => {
  const userDTO = new UserDTO(req.session.user);
  console.log(userDTO);
  res.json(userDTO);
};
