const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const ticketCollection = 'Tickets';

const TicketSchema = new mongoose.Schema({
  code: { 
    type: String,
    default: () => uuidv4(), 
    required: true, 
    unique: true 
  },
  purchase_datetime: { 
    type: Date, 
    default: Date.now 
  },
  amount: { 
    type: Number, 
    required: true 
  },
  purchaser: {
    type: String, 
    required: true 
  }
});

const ticketModel = mongoose.model(ticketCollection, TicketSchema);

module.exports = ticketModel;
