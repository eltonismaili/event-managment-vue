// src/services/addressService.js
import client from '@/helpers/client.js'

class AddressService {
    // Get all addresses
    async getAll() {
        const response = await client.get('addresses')
        return response.status === 200 ? response.data : []
    }

    // Get address by ID
    async getById(id) {
        const response = await client.get(`addresses/${id}`)
        return response.status === 200 ? response.data : null
    }

    // Create a new address
    async create(addressData) {
        const response = await client.post('addresses', addressData)
        return response.data
    }

    // Update address
    async update(id, addressData) {
        const response = await client.put(`addresses/${id}`, addressData)
        return response.status === 200 ? response.data : null
    }

    // Delete address
    async delete(id) {
        const response = await client.delete(`addresses/${id}`)
        return response.status === 204
    }
}

export default new AddressService()
