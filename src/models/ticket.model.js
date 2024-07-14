const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const ticketCollection = 'Tickets';

const TicketSchema = new mongoose.Schema({
  amount: Number,
    purchaser: {
        Estado: Number,
        Complete: [{
            product_id: Number,
            quantity: Number,
            product: { type: mongoose.Schema.Types.ObjectId, ref: 'Productos' }, 
            _id: mongoose.Schema.Types.ObjectId
        }],
        Incomplete: [{
            product_id: Number,
            quantity: Number,
            product: { type: mongoose.Schema.Types.ObjectId, ref: 'Productos' }, 
            _id: mongoose.Schema.Types.ObjectId
        }]
    },
    userid: String,
    code: String
}, { versionKey: false });

const ticketModel = mongoose.model(ticketCollection, TicketSchema);

module.exports = ticketModel;
