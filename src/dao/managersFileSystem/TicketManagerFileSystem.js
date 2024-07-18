const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

class TicketManagerFileSystem {
    constructor() {
        this.ticketsFilePath = path.join(__dirname, '../../data/tickets.json');
        this.initializeFile();
    }

    initializeFile = () => {
        if (!fs.existsSync(this.ticketsFilePath)) {
            fs.writeFileSync(this.ticketsFilePath, JSON.stringify([]));
        }
    }

    readTicketsFromFile = () => {
        try {
            const data = fs.readFileSync(this.ticketsFilePath, 'utf8');
            return JSON.parse(data);
        } catch (error) {
            throw error;
        }
    }

    writeTicketsToFile = (tickets) => {
        try {
            fs.writeFileSync(this.ticketsFilePath, JSON.stringify(tickets, null, 2));
        } catch (error) {
            throw error;
        }
    }

    getTickets = () => {
        return this.readTicketsFromFile();
    }

    getTicketById = (ticketId) => {
        const tickets = this.readTicketsFromFile();
        return tickets.find(ticket => ticket.code === ticketId);
    }

    async addTicket(ticketData) {
        const tickets = this.readTicketsFromFile();

        const ticketCode = uuidv4();
        ticketData.code = ticketCode;

        tickets.push(ticketData);

        this.writeTicketsToFile(tickets);
        return ticketData;
    }

    updateTicket = (ticketId, ticket) => {
        const tickets = this.readTicketsFromFile();
        const ticketIndex = tickets.findIndex(t => t.code === ticketId);

        if (ticketIndex !== -1) {
            tickets[ticketIndex] = { ...tickets[ticketIndex], ...ticket };
            this.writeTicketsToFile(tickets);
            return tickets[ticketIndex];
        } else {
            throw new Error('Ticket not found');
        }
    }

    deleteTicket = (ticketId) => {
        let tickets = this.readTicketsFromFile();
        tickets = tickets.filter(ticket => ticket.code !== ticketId);
        this.writeTicketsToFile(tickets);
        return { message: 'Ticket deleted' };
    }
}

module.exports = TicketManagerFileSystem;
