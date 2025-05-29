<script setup>
import {onErrorCaptured} from "vue";
import {useAppToast} from "@/composables/useAppToast.js";
import {useAuthStore} from "@/stores/authStore.js";
import {useRouter} from "vue-router";

const {showError} = useAppToast()
const store = useAuthStore()
const router = useRouter()

onErrorCaptured((err) => {
  console.error('Error captured in ErrorBoundary:', err);
  // Handle the error, e.g., log it or show a notification

  // Check if the error is related to authentication
  if (err.response && (err.response.status === 401 || err.response.status === 403)) {
    store.logOut()
    showError(err.response?.data?.message || 'Session expired, please log in again')
    // Redirect to login page after a short delay
    setTimeout(() => {
      router.push({name: 'login'})
    }, 100)

    return
  }

  showError(err.response?.data?.message || 'An error occurred')

  return false; // Returning false allows the error to propagate further
});
</script>

<template>
  <slot/>
</template>

<style scoped>

</style>