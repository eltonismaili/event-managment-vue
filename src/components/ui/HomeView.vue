<template>
  <div class="container mt-4">
    <h1 class="display-5 mb-4">Welcome to Event Manager 🎉</h1>
    <p class="lead mb-5">Manage your concerts, festivals, and more!</p>

    <div class="row">
      <div
          class="col-md-6 col-lg-4 mb-4"
          v-for="event in events"
          :key="event.id"
      >
        <div class="card event-card h-100 shadow-sm">
          <img
              :src="event.imageUrl || `https://source.unsplash.com/400x250/?concert,festival&sig=${event.id}`"
              class="card-img-top"
              alt="Event Image"
          />
          <div class="card-body">
            <h5 class="card-title fw-bold text-primary">{{ event.name }}</h5>
            <p class="mb-1">
              <i class="bi bi-tags-fill text-secondary me-1"></i>
              <span class="badge bg-info text-dark">{{ event.eventType }}</span>
            </p>
            <p class="mb-1">
              <i class="bi bi-calendar-event me-2 text-secondary"></i>
              <strong>Start:</strong> {{ formatDate(event.startDate) }}
            </p>
            <p class="mb-3">
              <i class="bi bi-calendar-check me-2 text-secondary"></i>
              <strong>End:</strong> {{ formatDate(event.endDate) }}
            </p>
            <p class="mb-3">
              <i class="bi bi-geo-alt-fill me-2 text-secondary"></i>
              {{ getVenueName(event.venueId) }}
            </p>
            <button class="btn btn-outline-primary w-100">
              View Details
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import EventService from '@/services/eventService'
import VenueService from '@/services/venueService'

const events = ref([])
const venues = ref([])

const fetchData = async () => {
  try {
    events.value = await EventService.getAllEvents()
    venues.value = await VenueService.getAll()
  } catch (error) {
    console.error('Failed to fetch data:', error)
  }
}

const getVenueName = (venueId) => {
  const venue = venues.value.find(v => v.id === venueId)
  return venue ? venue.name : 'Unknown Venue'
}

const formatDate = (date) => {
  return new Date(date).toLocaleDateString()
}

onMounted(fetchData)
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
