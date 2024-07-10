const { productService } = require('../services/repository.js');

exports.getProducts = async (req, res) => {
  try {
    const { limit, page, sort, query, status } = req.query;

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
    res.status(404).json({ message: error.message });
  }
};

exports.getProductById = async (req, res) => {
  const product_id = parseInt(req.params.pid);

  try {
    const product = await productService.getProductById(product_id);
    res.json({ product });
  } catch (error) {
    console.error('Error al obtener el producto por ID', error);
    res.status(404).json({ message: error.message });
  }
};

exports.addProduct = async (req, res) => {
  try {
    const { title, description, code, price, stock, category, thumbnails } = req.body;

    if (!title || !description || !code || !price || !stock || !category) {
      return res.status(400).json({ message: 'Faltan campos obligatorios' });
    }

    const product = {
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
  const product_id = parseInt(req.params.pid);

  try {
    const message = await productService.deleteProduct(product_id);
    res.json({ message });
  } catch (error) {
    console.error('Error al eliminar el producto:', error);
    res.status(404).json({ message: error.message });
  }
};
