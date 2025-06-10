<template>
  <div class="container mt-4">
    <h2>Categories</h2>

    <ul class="list-group">
      <li
          v-for="category in categories"
          :key="category.id"
          class="list-group-item d-flex justify-content-between align-items-center"
      >
        <span @click="$router.push(`/categories/${category.id}`)" style="cursor:pointer;">
          {{ category.name }}
        </span>
        <div>
          <button
              @click="$router.push(`/categories/update/${category.id}`)"
              class="btn btn-sm btn-warning me-2"
          >
            Edit
          </button>
          <button
              @click="deleteCategory(category.id)"
              class="btn btn-sm btn-danger"
          >
            Delete
          </button>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import CategoryService from '@/services/categoryService'

const categories = ref([])

const fetchCategories = async () => {
  categories.value = await CategoryService.getAll()
}

const deleteCategory = async (id) => {
  if (confirm('Are you sure you want to delete this category?')) {
    try {
      await CategoryService.delete(id)
      categories.value = categories.value.filter(c => c.id !== id)
      alert('Category deleted successfully.')
    } catch (error) {
      alert('Failed to delete category.')
      console.error(error)
    }
  }
}

onMounted(fetchCategories)
</script>
