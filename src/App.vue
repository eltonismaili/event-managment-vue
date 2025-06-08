<script setup>
import ErrorBoundary from "@/components/shared/ErrorBoundary.vue";
import AuthView from "@/views/auth/AuthView.vue";
import TheLayout from "@/components/ui/TheLayout.vue";
import {useAuthStore} from "@/stores/authStore.js";


const authStore = useAuthStore();
</script>
<template>
  <error-boundary>

      <router-view/>


  </error-boundary>
</template>


