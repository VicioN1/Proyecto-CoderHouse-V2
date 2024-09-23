const moment = require('moment');
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




exports.readUsers = async (req, res) => {
  try {
    // Parámetros de consulta (paginación y filtros)
    const { page = 1, limit = 10, role, minAge, maxAge, query, sort } = req.query;

    // Obtener los usuarios paginados y filtrados
    const result = await userManager.getUsersQuery(limit, page, sort, query, minAge, maxAge, role);

    res.json(result);
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    res.status(500).json({ message: 'Error al obtener usuarios' });
  }
};

exports.uploadDocuments = async (req, res) => {
  try {
    const user = await userService.getUserById(req.params.uid);
    if (!user) {
      return res.status(404).send('Usuario no encontrado');
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).send({ status: 'error', error: 'No se puede guardar el archivo' });
    }
    

    const documents = req.files.map(doc => ({
      name: doc.originalname,
      reference: doc.path
    }));

    const updates = {
      documents: [...user.documents, ...documents],
      hasUploadedDocuments: true
    };

    const updatedUser = await userService.updateUserById(req.params.uid, updates);

    res.status(200).send({ status: 'success', message: 'Documentos subidos y usuario actualizado', user: updatedUser });
  } catch (error) {
    console.error('Error al subir documentos:', error);
    res.status(500).send('Error al subir documentos');
  }
};


exports.deleteUsers = async (req, res) => {
  try {
      const emailUser = req.session.user.email;
      if (!emailUser) {
          return res.status(401).json({ message: 'Usuario no autenticado o sesión inválida' });
      }

      // Calcula la fecha de hace 2 días
      const twoDaysAgo = Date.now() - (2 * 24 * 60 * 60 * 1000); 
      req.logger.info(`Fecha y hora de hace 2 días: ${new Date(twoDaysAgo).toISOString()}`);

      // Recupera una lista de usuarios cuya última conexión fue antes de 'twoDaysAgo'
      const usersToDelete = await userService.getConectionById({ last_connection: { $lt: new Date(twoDaysAgo) } });
      req.logger.info(`Usuarios a eliminar: ${usersToDelete.length}`);

      // Eliminar cada usuario inactivo
      for (const user of usersToDelete) {
          req.logger.info(`Eliminando usuario inactivo: ${user.email}`);

          // Eliminar el carrito asociado al usuario
          if (user.carts && user.carts.length > 0) {
              const cartId = user.carts[0].cart_id;
              req.logger.info(`Eliminando carrito con ID: ${cartId}`);
              await cartService.deleteCartById(cartId);
          }

          // Eliminar el usuario
          await userService.deleteUser(user._id);
          req.logger.info(`Usuario eliminado: ${user.email}`);

          // Enviar correo electrónico de eliminación, utilizando el email del usuario autenticado
          await deleteUseremail(user.email, emailUser);
          req.logger.info(`Correo de eliminación enviado desde ${emailUser} a: ${user.email}`);
      }

      // Responder que la operación fue exitosa
      req.logger.info(`Usuarios eliminados correctamente. Total eliminados: ${usersToDelete.length}`);
      res.json({ message: 'Usuarios eliminados correctamente' });

  } catch (error) {
      req.logger.error(`Error al eliminar usuarios: ${error}`);
      res.status(500).json({ message: 'Hubo un error al eliminar los usuarios' });
  }
};




