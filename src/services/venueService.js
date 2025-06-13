
import client from '@/helpers/client.js'

class VenueService {

    async getAll() {
        const response = await client.get('venues')
        return response.status === 200 ? response.data : []
    }


    async getById(id) {
        const response = await client.get(`venues/${id}`)
        return response.status === 200 ? response.data : null
    }


    async create(venueData) {
        const response = await client.post('venues', venueData)
        return response.data
    }


    async update(id, venueData) {
        const response = await client.put(`venues/${id}`, venueData)
        return response.status === 200 ? response.data : null
    }


    async delete(id) {
        const response = await client.delete(`venues/${id}`)
        return response.status === 204
    }
}

export default new VenueService()
