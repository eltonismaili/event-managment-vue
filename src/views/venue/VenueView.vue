<template>
  <div class="container mt-4">
    <h2>Venues</h2>

    <ul class="list-group">
      <li
          v-for="venue in venues"
          :key="venue.id"
          class="list-group-item d-flex justify-content-between align-items-center"
      >
        <span @click="$router.push(`/venues/details/${venue.id}`)" style="cursor:pointer;">
          {{ venue.name }}
        </span>
        <div>
          <button
              @click="$router.push(`/venues/details/${venue.id}`)"
              class="btn btn-sm btn-info me-2"
          >
            View
          </button>
          <button
              @click="$router.push(`/venues/update/${venue.id}`)"
              class="btn btn-sm btn-warning me-2"
          >
            Edit
          </button>
          <button @click="deleteVenue(venue.id)" class="btn btn-sm btn-danger">
            Delete
          </button>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import VenueService from '@/services/venueService'

const venues = ref([])

const fetchVenues = async () => {
  venues.value = await VenueService.getAll()
}

const deleteVenue = async (id) => {
  if (confirm('Are you sure you want to delete this venue?')) {
    try {
      await VenueService.delete(id)
      venues.value = venues.value.filter(v => v.id !== id)
      alert('Venue deleted successfully.')
    } catch (error) {
      alert('Failed to delete venue.')
      console.error(error)
    }
  }
}

onMounted(fetchVenues)
</script>
