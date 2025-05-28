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
      <div class="dropdown">
        <button class="btn btn-outline-light dropdown-toggle" type="button" data-bs-toggle="dropdown">
          <i class="bi bi-person-circle me-1"></i> Profile
        </button>
        <ul class="dropdown-menu dropdown-menu-end">
          <li><a class="dropdown-item" href="#"><i class="bi bi-gear me-2"></i>Settings</a></li>
          <li><hr class="dropdown-divider"></li>
          <li><a class="dropdown-item text-danger" href="#"><i class="bi bi-box-arrow-right me-2"></i>Logout</a></li>
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
