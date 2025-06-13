
import client from '@/helpers/client.js'

class AddressService {

    async getAll() {
        const response = await client.get('addresses')
        return response.status === 200 ? response.data : []
    }


    async getById(id) {
        const response = await client.get(`addresses/${id}`)
        return response.status === 200 ? response.data : null
    }


    async create(addressData) {
        const response = await client.post('addresses', addressData)
        return response.data
    }


    async update(id, addressData) {
        const response = await client.put(`addresses/${id}`, addressData)
        return response.status === 200 ? response.data : null
    }


    async delete(id) {
        const response = await client.delete(`addresses/${id}`)
        return response.status === 204
    }
}

export default new AddressService()
