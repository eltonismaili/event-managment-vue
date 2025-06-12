// src/services/ticketService.js
import client from '@/helpers/client.js'

class TicketService {
    // Get all tickets (optional: add filters if needed)
    async getAll() {
        const response = await client.get('tickets')
        return response.status === 200 ? response.data : []
    }

    // Get ticket by ID
    async getById(id) {
        const response = await client.get(`tickets/${id}`)
        return response.status === 200 ? response.data : null
    }

    // Get tickets by event ID
    async getByEventId(eventId) {
        const response = await client.get(`tickets/event/${eventId}`)
        return response.status === 200 ? response.data : []
    }

    // Create a new ticket
    async create(ticketData) {
        // ticketData should include eventId, userId, quantity, name, price, startDate, endDate
        const response = await client.post('tickets', ticketData)
        return response.status === 201 ? response.data : null
    }

    // Update ticket by ID
    async update(id, ticketData) {
        const response = await client.put(`tickets/${id}`, ticketData)
        return response.status === 200 ? response.data : null
    }

    // Delete ticket by ID
    async delete(id) {
        const response = await client.delete(`tickets/${id}`)
        return response.status === 204
    }

    async getTicketByUserId(userId) {
        const response = await client.get(`tickets/user/${userId}`)
        return response.status === 200 ? response.data : []
    }
}

export default new TicketService()
