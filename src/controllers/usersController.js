const { userService } = require("../services/repository.js");

exports.premiumController = async (req, res) => {
  const { uid } = req.params;
  req.logger.info(
    `Manejando lógica de usuarios premium para el usuario con ID: ${uid}`
  );
  const user = await userService.getUserById(uid);

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
};

exports.getUsers = async (req, res) => {
  const users = await userService.getUsers();
  req.logger.info(`Usuarios obtenidos: ${users.length}`);
  res.status(200).send({ status: "success", users: users });
};
