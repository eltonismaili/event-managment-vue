<template>
  <div class="container mt-4" v-if="category">
    <h2>Update Category</h2>
    <form @submit.prevent="updateCategory">
      <div class="mb-3">
        <label for="name" class="form-label">Category Name</label>
        <input id="name" v-model="category.name" type="text" class="form-control" required />
      </div>

      <button type="submit" class="btn btn-primary">Update Category</button>
      <button type="button" class="btn btn-secondary ms-2" @click="$router.back()">Cancel</button>
    </form>
  </div>
  <div v-else class="container mt-4">Loading category data...</div>
</template>

<script setup>
import { reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import CategoryService from '@/services/categoryService'

const route = useRoute()
const router = useRouter()
const category = reactive({
  id: null,
  name: ''
})

const fetchCategory = async () => {
  try {
    const id = route.params.id
    const data = await CategoryService.getById(id)
    Object.assign(category, data)
  } catch (error) {
    console.error(error)
  }
}

import Swal from 'sweetalert2'

const updateCategory = async () => {
  try {
    await CategoryService.update(category.id, category)
    await Swal.fire({
      icon: 'success',
      title: 'Updated!',
      text: 'Category updated successfully!',
      timer: 2000,
      showConfirmButton: false,
    })
    await router.push('/categories')
  } catch (error) {
    await Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Failed to update category.',
    })
    console.error(error)
  }
}


onMounted(fetchCategory)
</script>
