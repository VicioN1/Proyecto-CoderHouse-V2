const productsModel = require("../models/products.model");

class ProductService {
  constructor() {
    this.products = {};
    this.countId = 1;
  }

  async addProduct(title, description, code, price, stock, category, thumbnails) {
    try {
      const lastProduct = await productsModel.findOne().sort({ idProduct: -1 });
      const nextId = (lastProduct && lastProduct.idProduct + 1) || 1;

      const existingProduct = await productsModel.findOne({ code });
        if (existingProduct) {
          return `Ya existe un producto con este código: ${code}`;
        }

      const newProduct = await productsModel.create({
        idProduct : nextId,
        title,
        description,
        code,
        price,
        status: true,
        stock,
        category,
        thumbnails: thumbnails || []
      });
      return "Producto agregado exitosamente";
    } catch (error) {
      console.error("Error al agregar producto", error);
      return "Error al agregar producto";
    }
  }

  async getProductById(product_id) {
    try {
      const id_encontrado = await productsModel.findOne({ idProduct: product_id})
      if (!id_encontrado) {
        return "Not found";
      }
      console.log("get", id_encontrado)
      return id_encontrado;
    } catch (error) {
      console.error("Error al consultar producto", error);
      return [];
    }
  }

  async getProducts(limite,page, sort, query, status) {
    try {
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

      const productos = await this.readProducts();
      if (sort) {
        products.sort.price( sort === 'asc' ? 1 : -1)
        // const products = await productsModel.paginate()
        return products;
      } else {
        const products = await productsModel.find();
        return products;
      }
    } catch (error) {
      console.error("Error al consultar usuarios", error);
      return [];
    }
  }

  async readProducts() {
    try {
      const products = await productsModel.find();
      return products;
    } catch (error) {
      console.error("Error al obtener todos los productos", error);
      return [];
    }
  }

  async updateProduct(product_id, camp, newvalue) {
    try {
      const existeProduct = await productsModel.findOne().sort({ idProduct: product_id})
      if (!existeProduct) {
        return "Producto no encontrado";
      }

      const validFields = Object.keys(existeProduct.schema.paths);
      if (!validFields.includes(camp)) {
          return "El campo especificado no existe en el producto";
      }

      existeProduct[camp] = newvalue;
      await existeProduct.save();

      return "Producto actualizado exitosamente";
    } catch (error) {
      console.error("Error al ejecutar la operacion", error);
    }
  }

  async deleteProduct(product_id) {
    try {
      const existeProduct = await productsModel.findOne({ idProduct: product_id})
      if (!existeProduct) {
        return "Producto no encontrado";
      }
      const deleteProduct = await productsModel.findByIdAndDelete(existeProduct._id);
      return "Producto eliminado exitosamente";
    } catch (error) {
      console.log("Error al ejecutar la operacion deleteProduct", error)
      return("Error al ejecutar la operacion deleteProduct", error);
    }
  }

}

module.exports = ProductService;
