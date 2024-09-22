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
    

    const documents = req.files.map(doc =>console.log(doc) ({
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
      // Calcula la fecha y hora de hace 30 minutos
      const thirtyMinutesAgo = moment().subtract(30, 'minutes').toDate();
      req.logger.info(`Fecha y hora de hace 30 minutos: ${thirtyMinutesAgo}`);

      // Recupera una lista de usuarios cuya última conexión fue antes de 'thirtyMinutesAgo'
      const usersToDelete = await userService.getConectionById({ last_connection: { $lt: thirtyMinutesAgo } });
      req.logger.info(`Usuarios a eliminar: ${usersToDelete.length}`);

      // Configuración de nodemailer
      const transport = nodemailer.createTransport({
          service: 'gmail',
          port: 587,
          auth: {
              user: process.env.EMAIL_USER,
              pass: process.env.EMAIL_PASSWORD
          }
      });

      // for (const user of usersToDelete) {
      //     // Enviar correo electrónico de notificación
      //     if (user.email) {
      //         await transport.sendMail({
      //             from: `Coder App <${process.env.EMAIL_USER}>`,
      //             to: user.email,
      //             subject: 'Tu cuenta ha sido eliminada',
      //             text: `Hola ${user.first_name}, tu cuenta ha sido eliminada por inactividad de más de 30 minutos.`,
      //         });
      //         req.logger.info(`Correo enviado a: ${user.email}`);
      //     } else {
      //         req.logger.warning(`No se pudo enviar correo a un usuario debido a que no tiene una dirección de correo electrónico definida.`);
      //     }

      //     // Eliminar carrito del usuario
      //     await cartService.deleteCart(user.cart[0]._id);
      //     req.logger.info(`Carrito eliminado para el usuario: ${user._id}`);
      // }

      // Eliminar los usuarios de la base de datos
      await userService.deleteUsers({ _id: { $in: usersToDelete.map(user => user._id) } });
      req.logger.info(`Usuarios eliminados correctamente. Total eliminados: ${usersToDelete.length}`);

      // Responder que la operación fue exitosa
      res.json({ message: 'Usuarios eliminados correctamente' });

  } catch (error) {
      req.logger.error(`Error al eliminar usuarios: ${error}`);
      res.status(500).json({ message: 'Hubo un error al eliminar los usuarios' });
  }
};



