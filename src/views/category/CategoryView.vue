<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import CategoryService from '@/services/categoryService'
import ItemList from "@/components/app/ItemList.vue"
import Swal from 'sweetalert2'
import { useAuthStore } from '@/stores/authStore.js'

const router = useRouter()
const authStore = useAuthStore()

const categories = ref([])

const fetchCategories = async () => {
  categories.value = await CategoryService.getAll()
}

const goToDetails = (category) => {
  router.push(`/categories/${category.id}`)
}

const editCategory = (category) => {
  router.push(`/categories/update/${category.id}`)
}

const deleteCategory = async (category) => {
  const result = await Swal.fire({
    title: 'Are you sure?',
    text: `You are about to delete category "${category.name}". This action cannot be undone!`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, delete it!',
    cancelButtonText: 'Cancel',
  })

  if (result.isConfirmed) {
    try {
      await CategoryService.delete(category.id)
      categories.value = categories.value.filter(c => c.id !== category.id)
      await Swal.fire({
        icon: 'success',
        title: 'Deleted!',
        text: 'Category deleted successfully.',
        timer: 2000,
        showConfirmButton: false,
      })
    } catch (error) {
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to delete category.',
      })
      console.error(error)
    }
  }
}


const canEditOrDelete = computed(() => {
  return authStore.loggedInUser?.role !== 'USER'
})

onMounted(fetchCategories)
</script>

<template>
  <ItemList
      title="Categories"
      :items="categories"
      :enableEdit="canEditOrDelete"
      :enableDelete="canEditOrDelete"
      @click="goToDetails"
      @edit="editCategory"
      @delete="deleteCategory"
  />
</template>
