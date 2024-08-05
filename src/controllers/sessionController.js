const bcrypt = require("bcrypt");
const passport = require("passport");
const { userService } = require("../services/repository.js");
const { cartService } = require("../services/repository.js");
const { ResetPassCodeService } = require("../services/repository.js");
const UserDTO = require("../dao/DTOs/userDTO.js");
const CustomError = require("../services/errors/CustomError.js");
const EErrors = require("../services/errors/enums.js");
const { generarErrorUsuario } = require("../services/errors/info.js");
const { mailing_Reset_Pass } = require("../utils/nodemailer.js");
const crypto = require("crypto");

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

exports.resetPassword = async (req, res) => {
  const email = req.body.email;
  req.logger.info(`Restableciendo contraseña para el usuario: ${email}`);

  try {
    const user = await userService.getUserById(email);
    if (!user) {
      req.logger.warning("El correo electrónico no está registrado");
      return res
        .status(400)
        .json({ message: "El correo electrónico no está registrado" });
    }

    const generateRandomCode = async () => {
      return new Promise((resolve, reject) => {
        crypto.randomBytes(4, (err, buffer) => {
          if (err) {
            reject(err);
          } else {
            resolve(buffer.toString("hex"));
          }
        });
      });
    };

    const code = await generateRandomCode();
    console.log(code);
    req.logger.info(`Código generado: ${code}`);
    const newCode = await ResetPassCodeService.saveCode(email, code);
    req.logger.info(`Código guardado: ${newCode}`);

    try {
      req.logger.info(
        `Envio de correo line162 ${(newCode.email, newCode.code)}`
      );
      const enviandomail = await mailing_Reset_Pass(
        newCode.email,
        newCode.code
      );
      req.logger.info(`${enviandomail}`);
    } catch (error) {
      req.logger.warning("Error enviando correo electrónico  ", error);
      return res
        .status(500)
        .json({ message: "Error enviando correo electrónico" });
    }

    res.status(200).json({
      status: "success",
      message: "Código de recuperación enviado exitosamente",
    });
  } catch (error) {
    req.logger.error(error.message);
    res.status(500).json({ status: "error", message: "Error del servidor" });
  }
};

exports.newPassword = async function (req, res) {
  // req.logger.info("Reiniciando la contraseña");
  // try {
  //   const { code, password } = req.body;
  //   const resetCode = await ResetPassCodeService.getCode(code);

  //   if (!resetCode) {
  //     req.logger.warn("Código de recuperación inválido");
  //     return res
  //       .status(400)
  //       .json({ status: "error", message: "Código de recuperación inválido" });
  //   }

  //   const passwordHash = createHash(password);
  //   const updates = { password: passwordHash };
  //   const updatedUser = await userService.updateUserByEmail(
  //     resetCode.email,
  //     updates
  //   );

  //   if (!updatedUser) {
  //     req.logger.error("Error al actualizar la contraseña del usuario");
  //     return res.status(500).json({
  //       status: "error",
  //       message: "Error al actualizar la contraseña del usuario",
  //     });
  //   }

  //   req.logger.info("Contraseña actualizada con éxito");
  //   res.json({
  //     status: "success",
  //     message: "Contraseña actualizada con éxito",
  //   });
  // } catch (error) {
  //   req.logger.error(`Error al reiniciar la contraseña: ${error}`);
  //   res.status(500).json({ status: "error", message: "Error del servidor" });
  // }
  req.logger.info("Reiniciando la contraseña");
  try {
    const { code, password } = req.body;
    const resetCode = await ResetPassCodeService.getCode(code);

    if (!resetCode) {
      req.logger.warning("Código de recuperación inválido");
      return res
        .status(400)
        .json({ status: "error", message: "Código de recuperación inválido" });
    }

    const updatedUser = await userService.updateUserByEmail(
      resetCode.email,
      password
    );

    if (!updatedUser) {
      req.logger.error("Error al actualizar la contraseña del usuario");
      return res.status(500).json({
        status: "error",
        message: "Error al actualizar la contraseña del usuario",
      });
    }

    req.logger.info("Contraseña actualizada con éxito");
    res.json({
      status: "success",
      message: "Contraseña actualizada con éxito",
    });
  } catch (error) {
    req.logger.error(`Error al reiniciar la contraseña: ${error}`);
    res.status(500).json({ status: "error", message: "Error del servidor" });
  }
};
