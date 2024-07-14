const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

class TicketManagerFileSystem {
    constructor() {
        this.ticketsFilePath = path.join(__dirname, '../../data/tickets.json');
        this.initializeFile();
    }

    // Inicializar el archivo si no existe
    initializeFile = () => {
        if (!fs.existsSync(this.ticketsFilePath)) {
            fs.writeFileSync(this.ticketsFilePath, JSON.stringify([]));
        }
    }

    // Leer los tickets desde el archivo
    readTicketsFromFile = () => {
        try {
            const data = fs.readFileSync(this.ticketsFilePath, 'utf8');
            return JSON.parse(data);
        } catch (error) {
            throw error;
        }
    }

    // Escribir los tickets en el archivo
    writeTicketsToFile = (tickets) => {
        try {
            fs.writeFileSync(this.ticketsFilePath, JSON.stringify(tickets, null, 2));
        } catch (error) {
            throw error;
        }
    }

    // Método para obtener todos los tickets
    getTickets = () => {
        return this.readTicketsFromFile();
    }

    // Método para obtener un ticket por ID
    getTicketById = (ticketId) => {
        const tickets = this.readTicketsFromFile();
        return tickets.find(ticket => ticket.code === ticketId);
    }

    // Agrega un nuevo ticket a la base de datos
    async addTicket(ticketData) {
        const tickets = this.readTicketsFromFile();

        // Generar un código único para el ticket
        const ticketCode = uuidv4();
        ticketData.code = ticketCode;

        // Crear un nuevo ticket
        tickets.push(ticketData);

        this.writeTicketsToFile(tickets);
        return ticketData;
    }

    // Actualiza un ticket existente por su ID
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

    // Elimina un ticket existente por su ID
    deleteTicket = (ticketId) => {
        let tickets = this.readTicketsFromFile();
        tickets = tickets.filter(ticket => ticket.code !== ticketId);
        this.writeTicketsToFile(tickets);
        return { message: 'Ticket deleted' };
    }
}

module.exports = TicketManagerFileSystem;
