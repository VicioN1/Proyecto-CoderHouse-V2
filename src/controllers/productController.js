const ProductManager = require('../services/ProductService.js');

const manager = new ProductManager();

exports.getProducts = async (req, res) => {
  try {
    const { limit, page, sort, query, status } = req.query;

    const producto = await manager.getProducts(limit, page, sort, query, status);

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
    res.status(404).json({ message: error });
  }
};

exports.getProductById = async (req, res) => {
  const product_id = parseInt(req.params.pid);

  try {
    const message = await manager.getProductById(product_id);
    res.json({ message });
  } catch (error) {
    res.status(404).json({ message: error });
  }
};

exports.addProduct = async (req, res) => {
  try {
    const { title, description, code, price, stock, category, thumbnails } = req.body;

    if (!title || !description || !code || !price || !stock || !category) {
      return res.status(400).json({ message: 'Faltan campos obligatorios' });
    }

    const producto = await manager.addProduct(title, description, code, price, stock, category, thumbnails);

    res.json(producto);
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
      title: title || null,
      description: description || null,
      code: code || null,
      price: price || null,
      status: status || null,
      stock: stock || null,
      category: category || null,
      thumbnails: thumbnails || null,
    };

    let Promesa = Promise.resolve();

    for (const key in newProduct) {
      if (newProduct.hasOwnProperty(key)) {
        const value = newProduct[key];
        if (value != null) {
          Promesa = Promesa.then(() => {
            return manager.updateProduct(product_id, key, value);
          });
        }
      }
    }

    res.json({ message: 'Se actualizó correctamente' });
  } catch (error) {
    console.error('Error al actualizar el producto:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

exports.deleteProduct = async (req, res) => {
  const product_id = parseInt(req.params.pid);

  try {
    const message = await manager.deleteProduct(product_id);
    res.json({ message });
  } catch (error) {
    res.status(404).json({ message: error });
  }
};
