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

      <p class="text-muted small mb-3">
        <strong>Venue:</strong> <span class="text-primary">{{ venueName }}</span>
      </p>

      <!-- Buy Tickets Button -->
      <button
          class="btn btn-success"
          @click="toggleForm"
      >
        {{ showForm ? 'Cancel' : 'Buy Tickets' }}
      </button>

      <!-- Buy Tickets Form -->
      <form v-if="showForm" @submit.prevent="submitTicket" class="mt-4">
        <div class="mb-3">
          <label for="ticketName" class="form-label">Name on Ticket</label>
          <input
              type="text"
              id="ticketName"
              v-model="ticketData.name"
              class="form-control"
              required
          />
        </div>

        <div class="mb-3">
          <label for="quantity" class="form-label">Quantity</label>
          <input
              type="number"
              id="quantity"
              v-model.number="ticketData.quantity"
              min="1"
              class="form-control"
              required
          />
        </div>

        <div class="mb-3">
          <label for="price" class="form-label">Price per Ticket ($)</label>
          <input
              type="number"
              id="price"
              v-model.number="ticketData.price"
              min="0"
              step="0.01"
              class="form-control"
              required
          />
        </div>

        <div class="mb-3">
          <label for="startDate" class="form-label">Start Date</label>
          <input
              type="datetime-local"
              id="startDate"
              v-model="ticketData.startDate"
              class="form-control"
              required
          />
        </div>

        <div class="mb-3">
          <label for="endDate" class="form-label">End Date</label>
          <input
              type="datetime-local"
              id="endDate"
              v-model="ticketData.endDate"
              class="form-control"
              required
          />
        </div>

        <button type="submit" class="btn btn-primary">Confirm Purchase</button>
      </form>
    </div>

    <p v-else class="text-center text-secondary fs-5 mt-5">Loading event details...</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import EventService from '@/services/eventService'
import VenueService from '@/services/venueService'
import CategoryService from "@/services/categoryService.js"
import TicketService from '@/services/ticketService.js'

// Simulate logged-in user ID, replace with your auth logic
const currentUserId = ref(1)

const route = useRoute()
const router = useRouter()

const event = ref(null)
const venueName = ref('Unknown Venue')
const allCategories = ref([])
const categoryName = ref('')

const showForm = ref(false)
const ticketData = ref({
  name: '',
  quantity: 1,
  price: 0,
  startDate: '',
  endDate: ''
})

const formatDate = (date) => {
  return new Date(date).toLocaleString()
}

const toDateTimeLocal = (dateString) => {
  if (!dateString) return ''
  const dt = new Date(dateString)
  dt.setMinutes(dt.getMinutes() - dt.getTimezoneOffset())
  return dt.toISOString().slice(0,16)
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

      // Prefill ticket date fields with event dates
      ticketData.value.startDate = toDateTimeLocal(event.value.startDate)
      ticketData.value.endDate = toDateTimeLocal(event.value.endDate)
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

const toggleForm = () => {
  showForm.value = !showForm.value
}

const submitTicket = async () => {
  try {
    if (!event.value) {
      alert('Event not loaded yet.')
      return
    }

    // Prepare payload with plain IDs (not nested objects)
    const payload = {
      name: ticketData.value.name,
      quantity: ticketData.value.quantity,
      price: ticketData.value.price,
      startDate: new Date(ticketData.value.startDate).toISOString(),
      endDate: new Date(ticketData.value.endDate).toISOString(),
      eventId: event.value.id,      // just ID, not object
      userId: currentUserId.value   // just ID, not object
    }

    await TicketService.create(payload)

    alert('Ticket purchase successful!')
    showForm.value = false
  } catch (error) {
    console.error('Failed to purchase ticket:', error)
    alert('Failed to purchase ticket. Please try again.')
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

.btn-success {
  font-weight: 600;
  letter-spacing: 0.05em;
  padding: 0.5rem 1.25rem;
  font-size: 1.1rem;
  border-radius: 0.375rem;
  transition: background-color 0.3s ease, color 0.3s ease;
  cursor: pointer;
}

.btn-success:hover {
  background-color: #218838;
  color: white;
}

p {
  line-height: 1.5;
}

form {
  max-width: 400px;
}
</style>
