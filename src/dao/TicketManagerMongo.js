const mongoose = require('mongoose');
const ticketModel = require("../models/ticket.model.js");
const { v4: uuidv4 } = require('uuid');

class TicketManager {
    constructor() {
        this.ticket = {};
    }

    getTickets = async () => {
        try {
            return await ticketModel.find().lean();
        } catch (error) {
            console.log(error);
        }
    }
    getTicketById = async (ticketId) => {
        try {
            return await ticketModel
                .findOne({ code: ticketId })
                .populate('purchaser.Complete.product') 
                .populate('purchaser.Incomplete.product') 
                .lean();
        } catch (error) {
            console.log(error);
        }
    }

    addTicket = async (ticketData) => {
        try {
            const ticketCode = uuidv4();
            ticketData.code = ticketCode;

            return await ticketModel.create(ticketData);
        } catch (error) {
            console.log(error);
        }
    }

    updateTicket = async (ticketId, ticket) => {
        try {
            if (!mongoose.Types.ObjectId.isValid(ticketId)) {
                throw new Error('Invalid ticket ID');
            }
            return await ticketModel.updateOne({ _id: ticketId }, ticket);
        } catch (error) {
            console.log(error);
        }
    }

    deleteTicket = async (ticketId) => {
        try {
            if (!mongoose.Types.ObjectId.isValid(ticketId)) {
                throw new Error('Invalid ticket ID');
            }
            return await ticketModel.deleteOne({ _id: ticketId });
        } catch (error) {
            console.log(error);
        }
    }
}

module.exports = TicketManager;
