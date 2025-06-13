<script setup>
import ErrorBoundary from "@/components/shared/ErrorBoundary.vue";
import {useAuthStore} from "@/stores/authStore.js";


const authStore = useAuthStore();
</script>
<template>
  <error-boundary>

      <router-view/>


  </error-boundary>
</template>


