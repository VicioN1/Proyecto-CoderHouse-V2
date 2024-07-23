const { generarProducto } = require('../utils/Faker.js');

const mockingProducts = async (req, res) => {
    let products = [];
    for (let i = 0; i < 50; i++) {
        products.push(generarProducto());
    }
    res.send({ status: 'success', payload: products });
};

module.exports = {
    mockingProducts
};
