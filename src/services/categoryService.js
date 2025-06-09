// src/services/categoryService.js
import client from '@/helpers/client.js'

class CategoryService {
    // Get all categories
    async getAll() {
        const response = await client.get('categories')
        return response.status === 200 ? response.data : []
    }

    // Get category by ID
    async getById(id) {
        const response = await client.get(`categories/${id}`)
        return response.status === 200 ? response.data : null
    }

    // Create a new category
    async create(categoryData) {
        const response = await client.post('categories', categoryData)
        return response.data
    }

    // Update category
    async update(id, categoryData) {
        const response = await client.put(`categories/${id}`, categoryData)
        return response.status === 200 ? response.data : null
    }

    // Delete category
    async delete(id) {
        const response = await client.delete(`categories/${id}`)
        return response.status === 204
    }
}

export default new CategoryService()
