const { productService } = require('../services/repository.js');
const CustomError = require('../services/errors/CustomError.js');
const EErrors = require('../services/errors/enums.js');
const { generarErrorProducto } = require('../services/errors/info.js');
const { deleteProductemail } = require('../utils/nodemailer.js'); 

exports.getProducts = async (req, res) => {
  try {
    const { limit, page, sort, query, status } = req.query;

    const validSortOptions = ['asc', 'desc'];
    if (!validSortOptions.includes(sort)) {
      return res.status(400).json({ message: "Parámetro 'sort' inválido. Debe ser 'asc' o 'desc'." });
    }

    const producto = await productService.getProductsQuery(limit, page, sort, query, status);

    const miurl = `http://localhost:8080/api/products`;

    res.json({
      status: 'success',
      payload: producto.docs,
      totalPages: producto.totalPages,
      prevPage: producto.prevPage,
      nextPage: producto.nextPage,
      page: producto.page,
      hasPrevPage: producto.hasPrevPage,
      hasNextPage: producto.hasNextPage,
      prevLink: producto.hasPrevPage
        ? `${miurl}?page=${producto.prevPage}&limit=${producto.limit}&${producto.params}`
        : null,
      nextLink: producto.hasNextPage
        ? `${miurl}?page=${producto.nextPage}&limit=${producto.limit}&${producto.params}`
        : null,
    });
  } catch (error) {
    console.error('Error al obtener los productos', error);
    res.status(500).json({ message: 'Error al obtener los productos' });
  }
};

exports.getProductById = async (req, res) => {
  const product_id = parseInt(req.params.pid);

  try {
    const product = await productService.getProductById(product_id);
    if (!product) {
      req.logger.info(`Producto no encontrado con ID: ${product_id}`);
      return res.status(404).json({ message: "Producto no encontrado" });
    }
    res.json({ product });
  } catch (error) {
    req.logger.error('Error al obtener el producto por ID:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

exports.addProduct = async (req, res) => {
  try {
    const { user_owner, title, description, code, price, stock, category, thumbnails } = req.body;

    let selectedThumbnail = thumbnails;  
    
    if (req.file) {
        selectedThumbnail = req.file.filename;
    }

    if (!user_owner || !title || !description || !code || !price || !stock || !category) {
      throw CustomError.createError({
        name:"Error al crear Producto",
        cause: generarErrorProducto({title, description, code, price, stock, category}),
        message: "Faltan campos obligatorios",
        code: EErrors.INVALID_TYPES_ERROR
    })
    }

    const product = {
      user_owner,
      title,
      description,
      code,
      price,
      stock,
      category,
      thumbnails: thumbnails || []
    };

    const result = await productService.addProduct(product);

    res.json({ message: result });
  } catch (error) {
    console.error('Error al agregar el producto:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

exports.updateProduct = async (req, res) => {
  const product_id = parseInt(req.params.pid);

  try {
    const {
      user_owner,
      title,
      description,
      code,
      price,
      status,
      stock,
      category,
      thumbnails,
    } = req.body;

    const newProduct = {
      user_owner,
      title,
      description,
      code,
      price,
      status,
      stock,
      category,
      thumbnails,
    };

    const updates = Object.entries(newProduct).filter(([key, value]) => value !== undefined && value !== null);

    for (const [field, newValue] of updates) {
      await productService.updateProduct(product_id, { field, newValue });
    }

    res.json({ message: 'Producto actualizado correctamente' });
  } catch (error) {
    console.error('Error al actualizar el producto:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};



exports.deleteProduct = async (req, res) => {
  const user = req.session.user; // Usuario que está haciendo la solicitud
  const product_id = parseInt(req.params.pid); // ID del producto a eliminar

  try {
    const product = await productService.getProductById(product_id); // Buscar el producto por su ID
    if (!product) {
      req.logger.info(`Producto no encontrado con ID: ${product_id}`);
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    // Verificar si el usuario es el propietario del producto
    if (product.user_owner === user.email) {
      console.log("Es el owner, puede borrar el producto");
      await productService.deleteProduct(product_id);
      return res.status(200).json({ message: "Producto eliminado por el owner." });
    }

    // Verificar si el usuario es admin
    if (user.role === "admin") {
      console.log("Es admin, puede borrar el producto");
      await productService.deleteProduct(product_id);

      // Enviar correo al owner notificando que el admin eliminó el producto
      await deleteProductemail( product, user.email );

      return res.status(200).json({ message: "Producto eliminado por el admin y notificación enviada." });
    }

    // Si el usuario no es ni owner ni admin, no puede eliminar el producto
    return res.status(403).json({ message: "No tienes permiso para eliminar este producto." });

  } catch (error) {
    console.error('Error al eliminar el producto:', error);
    res.status(500).json({ message: error.message });
  }
};

