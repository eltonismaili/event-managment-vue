// src/services/venueService.js
import client from '@/helpers/client.js'

class VenueService {
    // Get all venues
    async getAll() {
        const response = await client.get('venues')
        return response.status === 200 ? response.data : []
    }

    // Get venue by ID
    async getById(id) {
        const response = await client.get(`venues/${id}`)
        return response.status === 200 ? response.data : null
    }

    // Create a new venue
    async create(venueData) {
        const response = await client.post('venues', venueData)
        return response.data
    }

    // Update existing venue
    async update(id, venueData) {
        const response = await client.put(`venues/${id}`, venueData)
        return response.status === 200 ? response.data : null
    }

    // Delete venue
    async delete(id) {
        const response = await client.delete(`venues/${id}`)
        return response.status === 204
    }
}

export default new VenueService()
