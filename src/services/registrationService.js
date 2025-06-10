// src/services/registrationService.js
import client from '@/helpers/client.js'

class RegistrationService {
    // Get all registrations
    async getAll() {
        const response = await client.get('registrations')
        return response.status === 200 ? response.data : []
    }

    // Get registration by ID
    async getById(id) {
        const response = await client.get(`registrations/${id}`)
        return response.status === 200 ? response.data : null
    }

    // Create a new registration
    async create(registrationData) {
        // registrationData should include userId, eventId
        const response = await client.post('registrations', registrationData)
        return response.status === 201 ? response.data : null
    }

    // Update registration by ID
    async update(id, registrationData) {
        const response = await client.put(`registrations/${id}`, registrationData)
        return response.status === 200 ? response.data : null
    }

    // Delete registration by ID
    async delete(id) {
        const response = await client.delete(`registrations/${id}`)
        return response.status === 204
    }
}

export default new RegistrationService()
