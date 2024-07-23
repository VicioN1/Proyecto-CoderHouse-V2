const { Faker, es } = require('@faker-js/faker');

const faker = new Faker({ locale: [es] });

function generarProducto() {
    return {
        title: faker.commerce.productName(), 
        description: faker.commerce.productAdjective(), 
        code: faker.string.alphanumeric(10),
        price: faker.commerce.price(), 
        stock: +faker.string.numeric(1), 
        category: faker.commerce.department()
    };
}

module.exports = {
    generarProducto
};
