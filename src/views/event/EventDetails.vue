<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import EventService from '@/services/eventService'
import VenueService from '@/services/venueService'
import CategoryService from "@/services/categoryService.js"
import TicketService from '@/services/ticketService.js'
import Swal from 'sweetalert2'
import { useAuthStore } from "@/stores/authStore.js"

const authStore = useAuthStore()
const route = useRoute()

const event = ref(null)
const venueName = ref('Unknown Venue')
const venueCapacity = ref(0)
const allCategories = ref([])
const categoryName = ref('')
const ticketsSold = ref(0)

const showForm = ref(false)
const ticketData = ref({
  name: '',
  quantity: 1,
  startDate: '',
  endDate: ''
})

const availableTickets = computed(() => {
  return Math.max(venueCapacity.value - ticketsSold.value, 0)
})

const getFullImageUrl = (path) => {
  if (!path || typeof path !== "string") return null
  const baseUrl = "http://localhost:8080/"
  return baseUrl + path
}

const imageUrl = computed(() => {
  return event.value?.imagePath ? getFullImageUrl(event.value.imagePath) : null
})

const formatDate = (date) => new Date(date).toLocaleString()

const toDateTimeLocal = (dateString) => {
  if (!dateString) return ''
  const dt = new Date(dateString)
  dt.setMinutes(dt.getMinutes() - dt.getTimezoneOffset())
  return dt.toISOString().slice(0,16)
}

const fetchCategories = async () => {
  try {
    allCategories.value = await CategoryService.getAll()
  } catch (error) {
    console.error('Failed to fetch categories:', error)
  }
}

const fetchEvent = async () => {
  try {
    const eventId = route.params.id
    const evt = await EventService.getEventById(eventId)

    evt.ticketPrice = Number(evt.ticketPrice) || 0
    event.value = evt

    if (event.value.venueId) {
      const venues = await VenueService.getAll()
      const venue = venues.find(v => v.id === event.value.venueId)
      venueName.value = venue ? venue.name : 'Unknown Venue'
      venueCapacity.value = venue?.capacity || 0
    }

    if (event.value.categoryId) {
      const cat = allCategories.value.find(c => c.id === event.value.categoryId)
      categoryName.value = cat?.name || 'N/A'
    }

    // Initialize form dates
    ticketData.value.startDate = toDateTimeLocal(event.value.startDate)
    ticketData.value.endDate = toDateTimeLocal(event.value.endDate)

    // Fetch sold tickets for this event
    const allTickets = await TicketService.getAll()
    const ticketsForThisEvent = allTickets.filter(t => t.eventId === event.value.id)
    ticketsSold.value = ticketsForThisEvent.reduce((sum, t) => sum + t.quantity, 0)

  } catch (error) {
    console.error('Failed to fetch event details:', error)
  }
}

const toggleForm = () => {
  showForm.value = !showForm.value
}

const submitTicket = async () => {
  try {
    if (!event.value) return

    if (ticketData.value.quantity > availableTickets.value) {
      await Swal.fire({
        icon: 'warning',
        title: 'Not Enough Tickets',
        text: `Only ${availableTickets.value} tickets are available.`
      })
      return
    }

    const payload = {
      name: ticketData.value.name,
      quantity: ticketData.value.quantity,
      ticketPrice: Number(event.value.ticketPrice) || 0,
      startDate: new Date(ticketData.value.startDate).toISOString(),
      endDate: new Date(ticketData.value.endDate).toISOString(),
      eventId: event.value.id,
      userId: authStore.loggedInUser?.id
    }

    await TicketService.create(payload)

    await Swal.fire({
      icon: 'success',
      title: 'Ticket Purchased!',
      html: `Successfully bought a ticket.<br><a href="/tickets" style="color:#3085d6;text-decoration:underline;">Go to tickets</a>`,
      timer: 6000
    })

    showForm.value = false
    await fetchEvent() // refresh available tickets
  } catch (error) {
    console.error('Purchase failed:', error)
    await Swal.fire({
      icon: 'error',
      title: 'Purchase Failed',
      text: 'Try again later.'
    })
  }
}

onMounted(async () => {
  await fetchCategories()
  await fetchEvent()
})
</script>

<template>
  <div class="container mt-5">
    <button class="btn btn-outline-primary mb-4" @click="$router.back()">
      ← Back
    </button>

    <div v-if="event" class="card shadow-lg rounded-lg p-4">
      <h1 class="mb-3 text-primary fw-bold">{{ event.name }}</h1>

      <img
          v-if="imageUrl"
          :src="imageUrl"
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

      <p class="mb-4 text-secondary fst-italic">{{ event.description || 'No description available.' }}</p>

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

      <p class="text-muted small mb-3">
        <strong>Capacity:</strong> <span class="text-primary">{{ venueCapacity }}</span>
      </p>

      <p class="text-muted small mb-3">
        <strong>Available Tickets:</strong>
        <span :class="availableTickets > 0 ? 'text-success' : 'text-danger'">
          {{ availableTickets }}
        </span>
      </p>

      <p class="text-muted small mb-3">
        <strong>Price:</strong> <span class="text-primary">${{ event.ticketPrice?.toFixed(2) ?? '0.00' }}</span>
      </p>

      <!-- Ticket purchase button -->
      <button
          class="btn btn-success"
          @click="toggleForm"
          :disabled="availableTickets === 0"
          :title="availableTickets === 0 ? 'Sold Out' : ''"
      >
        {{ showForm ? 'Cancel' : 'Buy Tickets' }}
      </button>

      <!-- Ticket purchase form -->
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
              :max="availableTickets"
              min="1"
              class="form-control"
              required
          />
          <small class="text-muted">Max available: {{ availableTickets }}</small>
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
}
</style>
