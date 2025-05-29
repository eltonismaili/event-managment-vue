
<script setup>
import ErrorBoundary from "@/components/shared/ErrorBoundary.vue";
import AuthView from "@/views/auth/AuthView.vue";
import TheLayout from "@/components/ui/TheLayout.vue";
import {useAuthStore} from "@/stores/authStore.js";

const authStore = useAuthStore();
</script>
<template>
  <error-boundary>
    <!-- Keto dy komponenta renderohen te error boundary -->
    <auth-view v-if="!authStore.isLoggedIn"/>
    <the-layout v-else/>
  </error-boundary>
</template>


