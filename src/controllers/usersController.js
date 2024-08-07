const { userService } = require("../services/repository.js");

exports.premiumController = async (req, res) => {
  const { uid } = req.params;
  try {
    req.logger.info(
      `Manejando lógica de usuarios premium para el usuario con ID: ${uid}`
    );
    const user = await userService.getUserById(uid);
    if (!user) {
      req.logger.info(`Usuario no encontrado`);
      return res.status(401).send("Id de Usuario no encontrado");
    } else {
      switch (user.role) {
        case "user":
          user.role = "premium";
          break;
        case "premium":
          user.role = "user";
          break;
      }
      const updateUser = await userService.updateUserById(uid, user.role);
      req.logger.info(`Usuario actualizado a rol: ${user.role}`);
      res.status(200).send({ status: "success", user: user }); 
    }
  } catch (error) {
    req.logger.info(`Usuario actualizado a rol: ${user.role}`);
    res.status(500).send("Error al intentar cambiar rol usuario");
  }
};

exports.getUsers = async (req, res) => {
  const users = await userService.getUsers();
  req.logger.error(`Usuarios obtenidos: ${users.length}`);
  res.status(200).send({ status: "success", users: users });
};
