const mongoose = require("mongoose");

const cartsCollection = "Carts";

const cartsSchema = new mongoose.Schema({
  id: String,
  products: [{
    product_id: Number,
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Productos' 
    },
    quantity: Number
  }]
});

const cartsModel = mongoose.model(cartsCollection, cartsSchema);

module.exports = cartsModel;
