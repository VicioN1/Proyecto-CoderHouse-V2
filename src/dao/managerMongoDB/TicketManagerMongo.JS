const mongoose = require('mongoose');
const ticketModel = require("../../models/ticket.model.js");
const { v4: uuidv4 } = require('uuid');

class TicketManager {
    constructor() {
        this.ticket = {};
    }

    // Método para obtener todos los tickets
    getTickets = async () => {
        try {
            return await ticketModel.find().lean();
        } catch (error) {
            console.log(error);
        }
    }

    // Método para obtener un ticket por ID
    getTicketById = async (ticketId) => {
        try {
            return await ticketModel
                .findOne({ code: ticketId })
                .populate('purchaser.Complete.product') // Para productos completos
                .populate('purchaser.Incomplete.product') // Para productos incompletos
                .lean();
        } catch (error) {
            console.log(error);
        }
    }

    // Agrega un nuevo ticket a la base de datos
    addTicket = async (ticketData) => {
        try {
            // Generar un código único para el ticket
            const ticketCode = uuidv4();
            ticketData.code = ticketCode;

            // Crear un nuevo ticket
            return await ticketModel.create(ticketData);
        } catch (error) {
            console.log(error);
        }
    }

    // Actualiza un ticket existente por su ID
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

    // Elimina un ticket existente por su ID
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
