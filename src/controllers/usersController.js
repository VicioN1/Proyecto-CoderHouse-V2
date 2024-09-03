const { userService } = require("../services/repository.js");

exports.premiumController = async (req, res) => {
  const { uid } = req.params;
  try {
    req.logger.info(`Manejando lógica de usuarios premium para el usuario con ID: ${uid}`);
    const user = await userService.getUserById(uid);

    if (!user) {
      req.logger.info('Usuario no encontrado');
      return res.status(401).json({ status: 'error', message: 'Id de Usuario no encontrado' });
    }

    const requiredDocuments = ['Identificación', 'Comprobante de domicilio', 'Comprobante de estado de cuenta'];
    const userDocuments = user.documents.map(doc => doc.name);

    const hasAllDocuments = requiredDocuments.every(doc => userDocuments.includes(doc));

    if (!hasAllDocuments) {
      return res.status(400).json({ 
        status: 'error', 
        message: 'Faltan documentos requeridos para ser premium', 
        needsDocumentation: true 
      });
    }

    user.role = user.role === 'user' ? 'premium' : 'user';
    const updateUser = await userService.updateRolUserById(uid, user.role);
    req.logger.info(`Usuario actualizado a rol: ${user.role}`);
    res.status(200).json({ status: 'success', user: updateUser });
  } catch (error) {
    req.logger.error('Error al intentar cambiar rol usuario', error);
    res.status(500).json({ status: 'error', message: 'Error al intentar cambiar rol usuario' });
  }
};



exports.getUsers = async (req, res) => {
  const users = await userService.getUsers();
  req.logger.error(`Usuarios obtenidos: ${users.length}`);
  res.status(200).send({ status: "success", users: users });
};

exports.uploadDocuments = async (req, res) => {
  try {
    const user = await userService.getUserById(req.params.uid);
    if (!user) {
      return res.status(404).send('User not found');
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).send({ status: 'error', error: 'No se puede guardar el archivo' });
    }

    req.files.forEach(doc => {
      user.documents.push({
        name: doc.originalname,
        reference: doc.path
      });
    });

    user.hasUploadedDocuments = true; 
    await userService.updateUserById(req.params.uid, user);

    res.status(200).send({ status: 'success', message: 'Documentos subidos y usuario actualizado', user });
  } catch (error) {
    console.error('Error al subir documentos:', error);
    res.status(500).send('Error al subir documentos');
  }
};
