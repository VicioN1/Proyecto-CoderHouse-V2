const { ticket} = require('../dao/factory.js');
class TicketsRepository {
    constructor() {
        this.dao = ticket
    }

    async getTickets() {
        return await this.dao.getTickets();
    }

    async getTicketById(ticketId) {
        if (!ticketId) {
            throw new Error('Ticket ID is required');
        }
        return await this.dao.getTicketById(ticketId);
    }

    async createTicket(ticketData) {
        return await this.dao.addTicket(ticketData);
    }

    async updateTicket(ticketId, ticketData) {
        return await this.dao.updateTicket(ticketId, ticketData);
    }

    async deleteTicket(ticketId) {
        return await this.dao.deleteTicket(ticketId);
    }

}

module.exports = TicketsRepository;