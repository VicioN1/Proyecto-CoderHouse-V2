const mongoose = require("mongoose");
const dotenv = require("dotenv");
require('dotenv').config();

const connectDB = async () => {
  mongoose
    .connect(process.env.MONGO_URL)
    .then(() => {
      console.log("Conectado a la base de datos");
    })
    .catch((error) => console.error("Error en la conexion", error));
};

module.exports = connectDB;
