<template>
  <TheLayout>
    <div class="container">
      <h1 class="display-5 mb-4">Welcome to Event Manager 🎉</h1>
      <p class="lead mb-5">Manage your concerts, festivals, and more!</p>

      <div class="row">
        <div class="col-md-6 col-lg-4 mb-4" v-for="n in 3" :key="n">
          <div class="card event-card h-100 shadow-sm">
            <img
                :src="`https://source.unsplash.com/400x250/?concert,festival&sig=${n}`"
                class="card-img-top"
                alt="Event Image"
            />
            <div class="card-body">
              <h5 class="card-title fw-bold text-primary">Music Festival {{ n }}</h5>
              <p class="mb-1">
                <i class="bi bi-tags-fill text-secondary me-1"></i>
                <span class="badge bg-info text-dark">Concert</span>
              </p>
              <p class="mb-1">
                <i class="bi bi-calendar-event me-2 text-secondary"></i>
                <strong>Start:</strong> June {{ 10 + n }}, 2025
              </p>
              <p class="mb-3">
                <i class="bi bi-calendar-check me-2 text-secondary"></i>
                <strong>End:</strong> June {{ 11 + n }}, 2025
              </p>
              <p class="mb-3">
                <i class="bi bi-geo-alt-fill me-2 text-secondary"></i>
                Grand Venue Hall {{ n }}
              </p>
              <button class="btn btn-outline-primary w-100">View Details</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </TheLayout>
</template>

<script setup>
import TheLayout from "@/components/ui/TheLayout.vue";
</script>

<style scoped>
.event-card {
  border-radius: 16px;
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.event-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.08);
}

.card-img-top {
  height: 200px;
  object-fit: cover;
}
</style>
