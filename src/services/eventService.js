import client from '@/helpers/client.js'

class EventService {
    // Fetch all events
    async getAllEvents() {
        const response = await client.get('events')
        return response.status === 200 ? response.data : []
    }

    // Get a single event by ID
    async getEventById(id) {
        const response = await client.get(`events/${id}`)
        return response.status === 200 ? response.data : null
    }

    // Create a new event (send JSON)
    async createEvent(eventData) {
        // POST to your backend endpoint for creating events
        const response = await client.post("api/v1/events", eventData);
        return response.data;
    }

    // Update an existing event (optional, if you want to match backend)
    async updateEvent(id, eventData) {
        const response = await client.put(`events/${id}`, eventData) // send JSON object
        return response.status === 200 ? response.data : null
    }

    // Delete event
    async deleteEvent(id) {
        const response = await client.delete(`events/${id}`)
        return response.status === 204
    }
}

export default new EventService()
