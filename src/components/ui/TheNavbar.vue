<script setup>
import {useAuthStore} from "@/stores/authStore.js";
import {useRouter} from "vue-router";
import {ref} from "vue";

const authStore = useAuthStore();
const router = useRouter();

const onLogout = () => {
  authStore.logOut()
  router.push({name: 'login'})
}

</script>
<template>
  <nav class="navbar navbar-expand-lg px-4 shadow-sm navbar-dark custom-navbar">
    <a class="navbar-brand fw-bold fs-4" href="#">🎟 EventManager</a>
    <div class="ms-auto d-flex align-items-center gap-2">
      <button class="btn btn-outline-light position-relative">
        <i class="bi bi-bell fs-5 text-accent"></i>
        <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
          3
        </span>
      </button>
      <div class="dropdown me-3">
        <button
            class="btn d-flex align-items-center bg-white rounded-pill shadow-sm px-3 py-2 border"
            type="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
        >
          <span class="fs-4 me-2">👤</span>
          <div class="text-start">
            <div class="fw-semibold text-dark small">{{ authStore.loggedInUser?.name }}</div>
            <div class="text-muted small">{{ authStore.loggedInUser?.role }}</div>
          </div>
          <i class="bi bi-chevron-down ms-2 text-secondary"></i>
        </button>

        <ul class="dropdown-menu dropdown-menu-end shadow border-0 mt-2 p-2 rounded-3" style="min-width: 220px;">
          <li class="px-3 py-2 border-bottom">
            <div class="fw-bold">Hello, {{ authStore.loggedInUser?.name }}!</div>
            <div class="text-muted small">{{ authStore.loggedInUser?.sub }}</div>
          </li>
          <li><a class="dropdown-item d-flex align-items-center" href="#"><span class="me-2">🙍‍♂️</span> My Profile</a></li>
          <li><a class="dropdown-item d-flex align-items-center" href="#"><span class="me-2">⚙️</span> Settings</a></li>
          <li><a class="dropdown-item d-flex align-items-center" href="#"><span class="me-2">💳</span> Wallet</a></li>
          <li><hr class="dropdown-divider" /></li>
          <li>
            <button class="dropdown-item d-flex align-items-center text-danger" @click="onLogout">
              <span class="me-2">🚪</span> Logout
            </button>
          </li>
        </ul>
      </div>

    </div>
  </nav>
</template>

<style scoped>
.custom-navbar {
  background-color: #1F2D3D;
}
.text-accent {
  color: #4DD0E1 !important;
}
</style>
