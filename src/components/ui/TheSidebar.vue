<!-- src/components/Sidebar.vue -->
<template>
  <div class="sidebar d-flex flex-column p-3 shadow-sm">
    <h4 class="text-dark fw-bold mb-4">📊 Dashboard</h4>
    <ul class="nav nav-pills flex-column gap-1">
      <li v-for="item in menuItems" :key="item.label" class="nav-item">
        <router-link
            :to="item.route"
            class="nav-link d-flex align-items-center gap-2"
            :class="{ active: $route.path === item.route }"
        >
          <i :class="[item.icon, 'text-accent']"></i>{{ item.label }}
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script setup>
import {useRoute} from 'vue-router'

const route = useRoute()

const menuItems = [
  { label: "Home", icon: "bi bi-house", route: "/" },
  { label: "Events", icon: "bi bi-calendar-event", route: "/events" },
  { label: "Categories", icon: "bi bi-tags", route: "/categories" },
  { label: "Venues", icon: "bi bi-geo-alt", route: "/venues" },
]
</script>

<style scoped>
.sidebar {
  width: 240px;
  background-color: #F4F6F8;
}

.nav-link {
  color: #1F2D3D;
  transition: background 0.3s, transform 0.2s;
  border-radius: 8px;
}

.nav-link:hover {
  background-color: #E0E7FF;
  transform: translateX(5px);
}

.nav-link.active {
  background-color: #5C6BC0;
  color: white !important;
}

.text-accent {
  color: #4DD0E1;
}
</style>
