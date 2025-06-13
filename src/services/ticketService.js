
import client from '@/helpers/client.js'

class TicketService {

    async getAll() {
        const response = await client.get('tickets')
        return response.status === 200 ? response.data : []
    }


    async getById(id) {
        const response = await client.get(`tickets/${id}`)
        return response.status === 200 ? response.data : null
    }


    async getByEventId(eventId) {
        const response = await client.get(`tickets/event/${eventId}`)
        return response.status === 200 ? response.data : []
    }


    async create(ticketData) {

        const response = await client.post('tickets', ticketData)
        return response.status === 201 ? response.data : null
    }


    async update(id, ticketData) {
        const response = await client.put(`tickets/${id}`, ticketData)
        return response.status === 200 ? response.data : null
    }


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
