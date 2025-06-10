<template>
  <div class="container mt-5">
    <button class="btn btn-outline-primary mb-4" @click="$router.back()">
      ← Back
    </button>

    <div v-if="event" class="card shadow-lg rounded-lg p-4">
      <h1 class="mb-3 text-primary fw-bold">{{ event.name }}</h1>
      <img
          :src="event.imageUrl || `https://source.unsplash.com/900x450/?concert,festival&sig=${event.id}`"
          alt="Event Image"
          class="img-fluid rounded-4 mb-4 border border-2 border-primary"
      />

      <div class="row mb-3">
        <div class="col-md-6 mb-3 mb-md-0">
          <p class="text-muted mb-1 small">Type</p>
          <p class="fs-5 fw-semibold text-dark">{{ event.eventType }}</p>
        </div>
        <div class="col-md-6">
          <p class="text-muted mb-1 small">Category</p>
          <p class="fs-5 fw-semibold text-dark">{{ categoryName || 'N/A' }}</p>
        </div>
      </div>

      <p class="mb-4 text-secondary fst-italic">
        {{ event.description || 'No description available.' }}
      </p>

      <div class="row mb-3">
        <div class="col-md-6 mb-3 mb-md-0">
          <p class="text-muted mb-1 small">Start Date</p>
          <p class="fs-6 text-success">{{ formatDate(event.startDate) }}</p>
        </div>
        <div class="col-md-6">
          <p class="text-muted mb-1 small">End Date</p>
          <p class="fs-6 text-danger">{{ formatDate(event.endDate) }}</p>
        </div>
      </div>

      <p class="text-muted small mb-0">
        <strong>Venue:</strong> <span class="text-primary">{{ venueName }}</span>
      </p>
    </div>

    <p v-else class="text-center text-secondary fs-5 mt-5">Loading event details...</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import EventService from '@/services/eventService'
import VenueService from '@/services/venueService'
import CategoryService from "@/services/categoryService.js";

const route = useRoute()
const event = ref(null)
const venueName = ref('Unknown Venue')
const allCategories = ref([])
const categoryName = ref('')

const formatDate = (date) => {
  return new Date(date).toLocaleString()
}

const fetchEvent = async () => {
  try {
    const eventId = route.params.id
    event.value = await EventService.getEventById(eventId)

    if (event.value) {
      if (event.value.venueId) {
        const venues = await VenueService.getAll()
        const venue = venues.find((v) => v.id === event.value.venueId)
        venueName.value = venue ? venue.name : 'Unknown Venue'
      }
      if (event.value.categoryId) {
        const cat = allCategories.value.find(c => c.id === event.value.categoryId)
        categoryName.value = cat ? cat.name : 'N/A'
      }
    }
  } catch (error) {
    console.error('Failed to fetch event details:', error)
  }
}

const fetchCategories = async () => {
  try {
    allCategories.value = await CategoryService.getAll()
  } catch (error) {
    console.error('Failed to fetch categories:', error)
  }
}

onMounted(async () => {
  await fetchCategories()
  await fetchEvent()
})
</script>

<style scoped>
img {
  max-height: 450px;
  object-fit: cover;
  transition: transform 0.3s ease;
}
img:hover {
  transform: scale(1.05);
  cursor: pointer;
}

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
