<script setup>
import TheSidebar from "@/components/ui/TheSidebar.vue";
import TheNavbar from "@/components/ui/TheNavbar.vue";
</script>
<template>
  <div>
    <TheNavbar/>
    <div class="d-flex">
      <TheSidebar/>
      <main class="flex-fill p-4 layout-bg">
        <router-view/>
        <slot/>
      </main>
    </div>
  </div>
</template>

<style scoped>
.layout-bg {
  background-color: #F9FAFB;
  min-height: 100vh;
}
</style>
