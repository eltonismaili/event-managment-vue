<script setup>
import { onErrorCaptured } from 'vue'
import { useAppToast } from '@/composables/useAppToast.js'
import { useAuthStore } from '@/stores/authStore.js'
import { useRouter } from 'vue-router'

const { showError } = useAppToast()
const store = useAuthStore()
const router = useRouter()

onErrorCaptured((err) => {
  console.error('Error captured in ErrorBoundary:', err)

  const response = err?.response
  const status = response?.status
  const message = response?.data?.message || err.message || 'An unexpected error occurred'

  if (status === 401 || status === 403) {
    store.logOut()
    showError('Session expired or unauthorized. Please log in again.')
    setTimeout(() => router.push({ name: 'login' }), 100)
    return
  }


  if (status === 400) {
    showError(`Validation error: ${message}`)
    return
  }


  if (status === 404) {
    showError('The requested resource was not found.')
    return
  }


  if (status === 500) {
    showError('A server error occurred. Please try again later.')
    return
  }


  if (!response && err.message?.includes('Network Error')) {
    showError('Network error. Please check your internet connection.')
    return
  }


  if (err.code === 'ECONNABORTED') {
    showError('Request timed out. Please try again.')
    return
  }


  showError(`An error occurred: ${message}`)

  return false
})
</script>

<template>
  <slot />
</template>

<style scoped>
</style>
