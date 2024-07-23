function generarErrorUsuario(user) {
    return `Uno o más campos estaban incompletos o no eran válidos.
    Lista de campos requeridos:
    *nombre     : debe ser una Cadena, recibió ${user.first_name}
    *apellido   : debe ser una Cadena, recibió ${user.last_name}
    *correo     : debe ser una Cadena, recibió ${user.email}
    *edad       : debe ser un Número, recibió ${user.age}`;
}

function generarErrorProducto(product) {
    return `Uno o más campos estaban incompletos o no eran válidos.
    Lista de campos requeridos:
    *título       : debe ser una Cadena, recibió ${product.title}
    *descripción  : debe ser una Cadena, recibió ${product.description}
    *código       : debe ser una Cadena, recibió ${product.code}
    *precio       : debe ser un Número, recibió ${product.price}
    *stock        : debe ser un Número, recibió ${product.stock}
    *categoría    : debe ser una Cadena, recibió ${product.category}`;
}

module.exports = {
    generarErrorUsuario,
    generarErrorProducto
};
