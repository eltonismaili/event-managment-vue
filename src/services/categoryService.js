
import client from '@/helpers/client.js'

class CategoryService {

    async getAll() {
        const response = await client.get('categories')
        return response.status === 200 ? response.data : []
    }

    async getById(id) {
        const response = await client.get(`categories/${id}`)
        return response.status === 200 ? response.data : null
    }


    async create(categoryData) {
        const response = await client.post('categories', categoryData)
        return response.data
    }


    async update(id, categoryData) {
        const response = await client.put(`categories/${id}`, categoryData)
        return response.status === 200 ? response.data : null
    }


    async delete(id) {
        const response = await client.delete(`categories/${id}`)
        return response.status === 204
    }
}

export default new CategoryService()
