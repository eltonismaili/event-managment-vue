<template>
  <div class="container mt-5">
    <h2 class="mb-4">Create New Event</h2>

    <form @submit.prevent="handleSubmit">
      <div class="mb-3">
        <label for="name" class="form-label">Event Name</label>
        <input
            id="name"
            v-model="form.name"
            type="text"
            class="form-control"
            required
        />
      </div>

      <div class="mb-3">
        <label for="description" class="form-label">Description</label>
        <textarea
            id="description"
            v-model="form.description"
            class="form-control"
            rows="3"
        ></textarea>
      </div>

      <div class="mb-3">
        <label for="startDate" class="form-label">Start Date</label>
        <input
            id="startDate"
            v-model="form.startDate"
            type="datetime-local"
            class="form-control"
            required
        />
      </div>

      <div class="mb-3">
        <label for="endDate" class="form-label">End Date</label>
        <input
            id="endDate"
            v-model="form.endDate"
            type="datetime-local"
            class="form-control"
            required
        />
      </div>

      <div class="mb-3">
        <label for="eventType" class="form-label">Event Type</label>
        <select
            id="eventType"
            v-model="form.eventType"
            class="form-select"
            required
        >
          <option value="CONFERENCE">Conference</option>
          <option value="MEETUP">Meetup</option>
          <option value="WORKSHOP">Workshop</option>
        </select>
      </div>

      <!-- Category Select -->
      <div class="mb-3">
        <label for="category" class="form-label">Category</label>
        <select
            id="category"
            v-model="form.categoryId.id"
            class="form-select"
            required
        >
          <option value="" disabled>Select category</option>
          <option
              v-for="cat in categories"
              :key="cat.id"
              :value="cat.id"
          >
            {{ cat.name }}
          </option>
        </select>
      </div>

      <!-- Venue Select -->
      <div class="mb-3">
        <label for="venue" class="form-label">Venue</label>
        <select
            id="venue"
            v-model="form.venueId.id"
            class="form-select"
            required
        >
          <option value="" disabled>Select venue</option>
          <option
              v-for="venue in venues"
              :key="venue.id"
              :value="venue.id"
          >
            {{ venue.name }}
          </option>
        </select>
      </div>

      <button
          type="submit"
          class="btn btn-primary"
          :disabled="isSubmitting"
      >
        {{ isSubmitting ? 'Saving...' : 'Create Event' }}
      </button>

      <div
          v-if="error"
          class="alert alert-danger mt-3"
      >
        {{ error }}
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import EventService from '@/services/eventService'

// Form state
const form = ref({
  name: '',
  description: '',
  startDate: '',
  endDate: '',
  eventType: 'CONFERENCE',
  userId: { id: null },      // will be set from auth store
  categoryId: { id: null },  // selected by user
  venueId: { id: null },     // selected by user
  createdBy: '',
  createdAt: new Date().toISOString()
})

const isSubmitting = ref(false)
const error = ref(null)
const router = useRouter()

const authStore = useAuthStore()

// Mock categories and venues - replace with API calls if needed
const categories = ref([
  { id: 1, name: 'Conference' },
  { id: 2, name: 'Meetup' },
  { id: 3, name: 'Workshop' }
])

const venues = ref([
  { id: 1, name: 'Venue A' },
  { id: 2, name: 'Venue B' },
  { id: 3, name: 'Venue C' }
])

// On mounted, set logged-in user ID automatically
onMounted(() => {
  if (authStore.loggedInUser && authStore.loggedInUser.id) {
    form.value.userId.id = authStore.loggedInUser.id
  }
})

async function handleSubmit() {
  error.value = null
  isSubmitting.value = true

  try {
    // Call your service to create event
    await EventService.createEvent(form.value)

    alert('Event created successfully!')
    router.push({ name: 'events' })  // Adjust route name as needed

  } catch (err) {
    console.error(err)
    error.value = 'Failed to create event. Please check your input and try again.'
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
/* Add any component-specific styles here */
</style>
