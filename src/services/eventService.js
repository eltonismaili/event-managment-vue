import client from '@/helpers/client.js'

class EventService {

    async getAllEvents() {
        const response = await client.get('events/active')
        return response.status === 200 ? response.data : []
    }


    async getEventById(id) {
        const response = await client.get(`events/${id}`)
        return response.status === 200 ? response.data : null
    }


    async createEvent(eventData) {

        const response = await client.post("events", eventData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    }


    async updateEvent(id, eventData) {
        const response = await client.put(`events/${id}`, eventData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
        return response.status === 200 ? response.data : null
    }


    async deleteEvent(id) {
        const response = await client.delete(`events/${id}`)
        return response.status === 204
    }
}

export default new EventService()
