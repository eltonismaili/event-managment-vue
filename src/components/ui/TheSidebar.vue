<template>
  <div class="sidebar d-flex flex-column p-3 shadow-sm">
    <h4 class="text-dark fw-bold mb-4">📊 Dashboard</h4>
    <ul class="nav nav-pills flex-column gap-1">
      <li v-for="item in menuItems" :key="item.label" class="nav-item">
        <a :class="['nav-link d-flex align-items-center gap-2', { active: item.active }]" href="#">
          <i :class="[item.icon, 'text-accent']"></i>{{ item.label }}
        </a>
      </li>
    </ul>
  </div>
</template>

<script setup>
const menuItems = [
  {label: "Home", icon: "bi bi-house", active: true},
  {label: "Events", icon: "bi bi-calendar-event", active: false},
  {label: "Participants", icon: "bi bi-people", active: false},
  {label: "Settings", icon: "bi bi-gear", active: false},
];
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
