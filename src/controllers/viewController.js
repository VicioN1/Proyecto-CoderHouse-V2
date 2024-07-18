const UserDTO = require('../dao/DTOs/userDTO.js');

exports.getCurrentUser = (req, res, next) => {
    const userDTO = new UserDTO(req.session.user);
    req.userDTO = userDTO;
    next();
  };