<template>
  <div class="container mt-4">
    <h2>Categories</h2>
    <button @click="$router.push('/categories/create')" class="btn btn-primary mb-3">Create New Category</button>

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
          <button @click="$router.push(`/categories/update/${category.id}`)" class="btn btn-sm btn-warning me-2">Edit</button>
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

onMounted(fetchCategories)
</script>
