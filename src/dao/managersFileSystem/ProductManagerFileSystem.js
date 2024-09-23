const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, '../../data/products.json');

class ProductManagerFileSystem {
  async _readFile() {
    try {
      await fs.promises.access(filePath);
    } catch (error) {
      if (error.code === 'ENOENT') {
        await this._writeFile([]);
      } else {
        throw error;
      }
    }

    try {
      const data = await fs.promises.readFile(filePath, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      console.error("Error al leer archivo", error);
      return [];
    }
  }

  async _writeFile(data) {
    try {
      await fs.promises.writeFile(filePath, JSON.stringify(data, null, 2));
    } catch (error) {
      console.error("Error al escribir archivo", error);
    }
  }

  async addProduct(user_owner, title, description, code, price, stock, category, thumbnails) {
    try {
      const products = await this._readFile();
      const lastProduct = products[products.length - 1];
      const nextId = (lastProduct && lastProduct.idProduct + 1) || 1;
      console.log(code)
      const existingProduct = products.find(product => product.code === code);
      if (existingProduct) {
        return `Ya existe un producto con este código: ${code}`;
      }

      const newProduct = {
        user_owner,
        idProduct: nextId,
        title, 
        description, 
        code, 
        price, 
        stock, 
        status: true,
        category, 
        thumbnails
      };

      products.push(newProduct);
      await this._writeFile(products);
      return "Producto agregado exitosamente";
    } catch (error) {
      console.error("Error al agregar producto", error);
      return "Error al agregar producto";
    }
  }

  async getProductById(productId) {
    try {
      const products = await this._readFile();
      const product = products.find(product => product.idProduct === productId);
      if (!product) {
        return null;
      }
      return product;
    } catch (error) {
      console.error("Error al consultar producto", error);
      return null;
    }
  }

  async getProductsQuery(limit, page, sort, query, status) {
    try {
      
      limit = parseInt(limit) || 5;
  
      let products = await this._readFile();
  
      if (query) {
        products = products.filter(product => product.category.toLowerCase().includes(query.toLowerCase()));

      }
  
      if (status === 'true') {
        products = products.filter(product => product.status);
      } else if (status === 'false') {
        products = products.filter(product => !product.status);
      }
  
      if (sort) {
        products.sort((a, b) => (sort === 'asc' ? a.price - b.price : b.price - a.price));
      }
  
      const offset = (page - 1) * limit;
      const paginatedProducts = products.slice(offset, offset + limit);
  
      const params = new URLSearchParams({ sort, query, status }).toString();
  
      return {
        docs: paginatedProducts,
        totalDocs: products.length,
        limit: limit,
        totalPages: Math.ceil(products.length / limit),
        page: page,
        pagingCounter: offset + 1,
        hasPrevPage: page > 1,
        hasNextPage: page * limit < products.length,
        prevPage: page > 1 ? page - 1 : null,
        nextPage: page * limit < products.length ? page + 1 : null,
        params
      };
    } catch (error) {
      console.error("Error al consultar productos", error);
      return null;
    }
  }
  
  
  

  async updateProduct(productId, field, newValue) {
    try {
      const products = await this._readFile();
      const productIndex = products.findIndex(product => product.idProduct === productId);
      if (productIndex === -1) {
        return "Producto no encontrado";
      }

      const validFields = Object.keys(products[productIndex]);
      if (!validFields.includes(field)) {
        return "El campo especificado no existe en el producto";
      }

      products[productIndex][field] = newValue;
      await this._writeFile(products);
      return "Producto actualizado exitosamente";
    } catch (error) {
      console.error("Error al actualizar producto", error);
      return "Error al actualizar producto";
    }
  }

  async deleteProduct(productId) {
    try {
      console.log("--------deleteProduct------------------")
      productId = parseInt(productId);
      const products = await this._readFile();
      const productIndex = products.findIndex(product => product.idProduct === productId);
      if (productIndex === -1) {
        console.log("Producto no encontrado")
        return "Producto no encontrado";
      }

      products.splice(productIndex, 1);
      await this._writeFile(products);
      console.log("Producto eliminado exitosamente")
      return "Producto eliminado exitosamente";
    } catch (error) {
      console.error("Error al eliminar producto", error);
      return "Error al eliminar producto";
    }
  }
}

module.exports =  ProductManagerFileSystem;
