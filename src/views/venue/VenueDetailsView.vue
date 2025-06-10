<template>
  <div class="container mt-5">
    <button class="btn btn-outline-primary mb-4" @click="$router.back()">
      ← Back
    </button>

    <div v-if="venue" class="card shadow-lg rounded-lg p-4">
      <h1 class="mb-3 text-primary fw-bold">{{ venue.name }}</h1>

      <div class="row mb-3">
        <div class="col-md-6 mb-3 mb-md-0">
          <p class="text-muted mb-1 small">Capacity</p>
          <p class="fs-5 fw-semibold text-dark">{{ venue.capacity }}</p>
        </div>
        <div class="col-md-6">
          <p class="text-muted mb-1 small">Country</p>
          <p class="fs-5 fw-semibold text-dark">{{ venue.address.country }}</p>
        </div>
      </div>

      <div class="row mb-3">
        <div class="col-md-6 mb-3 mb-md-0">
          <p class="text-muted mb-1 small">City</p>
          <p class="fs-6 text-dark">{{ venue.address.city }}</p>
        </div>
        <div class="col-md-6">
          <p class="text-muted mb-1 small">Street</p>
          <p class="fs-6 text-dark">{{ venue.address.street }}</p>
        </div>
      </div>

      <p class="text-muted small mb-0">
        <strong>Zip Code:</strong> <span class="text-primary">{{ venue.address.zipCode }}</span>
      </p>
    </div>

    <p v-else class="text-center text-secondary fs-5 mt-5">Loading venue details...</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import VenueService from '@/services/venueService'

const route = useRoute()
const venue = ref(null)

const fetchVenueDetails = async () => {
  try {
    const id = route.params.id
    const data = await VenueService.getById(id)
    if (data) {
      venue.value = data
    }
  } catch (error) {
    console.error('Failed to load venue details:', error)
  }
}

onMounted(fetchVenueDetails)
</script>

<style scoped>
.card {
  background: #ffffff;
  box-shadow: 0 8px 24px rgba(0, 123, 255, 0.15);
  border: none;
}

.btn-outline-primary {
  font-weight: 600;
  letter-spacing: 0.05em;
  transition: background-color 0.3s ease, color 0.3s ease;
}
.btn-outline-primary:hover {
  background-color: #007bff;
  color: white;
}

p {
  line-height: 1.5;
}
</style>
