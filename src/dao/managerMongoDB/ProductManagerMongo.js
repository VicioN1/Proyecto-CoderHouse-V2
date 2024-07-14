const productsModel = require("../../models/products.model");

class ProductManagerMongo {
  async addProduct(productData) {
    try {
      const lastProduct = await productsModel.findOne().sort({ idProduct: -1 });
      const nextId = (lastProduct && lastProduct.idProduct + 1) || 1;

      const existingProduct = await productsModel.findOne({ code: productData.code });
      if (existingProduct) {
        return `Ya existe un producto con este código: ${productData.code}`;
      }

      const newProduct = await productsModel.create({
        idProduct: nextId,
        title: productData.title,
        description: productData.description,
        code: productData.code,
        price: productData.price,
        status: true,
        stock: productData.stock,
        category: productData.category,
        thumbnails: productData.thumbnails || []
      });
      return "Producto agregado exitosamente";
    } catch (error) {
      console.error("Error al agregar producto", error);
      return "Error al agregar producto";
    }
  }

  async getProductById(productId) {
    try {
      const product = await productsModel.findOne({ idProduct: productId });
      if (!product) {
        return "Not found";
      }
      return product;
    } catch (error) {
      console.error("Error al consultar producto", error);
      return null;
    }
  }

  async getProductsQuery(limite,page, sort, query, status) {
    try {

      console.log ("-------------getProductsQuery---------")
      const filtro = {}

      const options = {
        limit: (limite == null ? 10 : parseInt(limite)),
        page: (page == null ? 1 : parseInt(page)),
      };

      
      options.sort = { price: sort === 'asc' ? 1 : -1 }
      
      if (query) {
        filtro.category = { $regex: query, $options: 'i' };
      }
  
      if (status === 'true') {
        filtro.status = true;
      } else if (status === 'false') {
        console.log("entreee")
        filtro.status = false;
      }

        const params = new URLSearchParams();
        if (options.sort) params.append('sort', sort);
        if (filtro.category) params.append('query', query);
        if (filtro.status) params.append('status', status);
        

      const products = await productsModel.paginate(filtro, options )
      products.params= params.toString()
      return products;
    } catch (error) {
      console.error("Error al consultar productos", error);
      return null;
    }
  }

  async getProducts() {
    try {
      const products = await productsModel.find();
      return products;
    } catch (error) {
      console.error("Error al obtener todos los productos", error);
      return [];
    }
  }

  async updateProduct(productId, field, newValue) {
    try {
      // console.log("---------------------updateProduct----------------------")
      // console.log(productId, field, newValue)
      const product = await productsModel.findOne({ idProduct: productId });
      if (!product) {
        return "Producto no encontrado";
      }

      const validFields = Object.keys(product.schema.paths);
      if (!validFields.includes(field)) {
        return "El campo especificado no existe en el producto";
      }

      product[field] = newValue;
      await product.save();
      return "Producto actualizado exitosamente";
    } catch (error) {
      console.error("Error al actualizar producto", error);
      return "Error al actualizar producto";
    }
  }

  async deleteProduct(productId) {
    try {
      const product = await productsModel.findOne({ idProduct: productId });
      if (!product) {
        return "Producto no encontrado";
      }
      await productsModel.findByIdAndDelete(product._id);
      return "Producto eliminado exitosamente";
    } catch (error) {
      console.error("Error al eliminar producto", error);
      return "Error al eliminar producto";
    }
  }
}

module.exports = ProductManagerMongo;
