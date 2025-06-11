<template>
  <div class="container mt-5">
    <h2 class="mb-4">{{ isEdit ? 'Update Event' : 'Create New Event' }}</h2>

    <form @submit.prevent="handleSubmit">
      <!-- Event Name -->
      <div class="mb-3">
        <label for="name" class="form-label">Event Name</label>
        <input v-model="form.name" type="text" id="name" class="form-control" required />
      </div>

      <!-- Description -->
      <div class="mb-3">
        <label for="description" class="form-label">Description</label>
        <textarea v-model="form.description" id="description" class="form-control" rows="3"></textarea>
      </div>

      <!-- Start Date -->
      <div class="mb-3">
        <label for="startDate" class="form-label">Start Date</label>
        <input v-model="form.startDate" type="datetime-local" id="startDate" class="form-control" required />
      </div>

      <!-- End Date -->
      <div class="mb-3">
        <label for="endDate" class="form-label">End Date</label>
        <input v-model="form.endDate" type="datetime-local" id="endDate" class="form-control" required />
      </div>

      <!-- Ticket Price -->
      <div class="mb-3">
        <label for="ticketPrice" class="form-label">Ticket Price ($)</label>
        <input v-model.number="form.ticketPrice" type="number" min="0" step="0.01" id="ticketPrice" class="form-control" required />
      </div>

      <!-- Image URL -->
      <div class="mb-3">
        <label for="imageUrl" class="form-label">Image URL</label>
        <input v-model="form.imageUrl" type="url" id="imageUrl" class="form-control" />
      </div>

      <!-- Event Type -->
      <div class="mb-3">
        <label for="eventType" class="form-label">Event Type</label>
        <select v-model="form.eventType" id="eventType" class="form-select" required>
          <option value="CONFERENCE">Conference</option>
          <option value="MEETUP">Meetup</option>
          <option value="WORKSHOP">Workshop</option>
          <option value="WEBINAR">Webinar</option>
        </select>
      </div>

      <!-- Category Selector -->
      <div class="mb-3">
        <label class="form-label">Category</label>
        <select v-if="!creatingNewCategory" v-model="form.categoryId" @change="onCategoryChange" class="form-select">
          <option value="">Select category</option>
          <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
          <option value="__new__">+ Create New Category</option>
        </select>

        <div v-else>
          <input v-model="newCategoryName" type="text" class="form-control mb-2" placeholder="New category name" />
          <button @click.prevent="createCategory" class="btn btn-sm btn-primary me-2">Save Category</button>
          <button @click.prevent="cancelNewCategory" class="btn btn-sm btn-secondary">Cancel</button>
        </div>
      </div>

      <!-- Venue Selector -->
      <div class="mb-3">
        <label class="form-label">Venue</label>
        <select v-if="!creatingNewVenue" v-model="form.venueId" @change="onVenueChange" class="form-select">
          <option value="">Select venue</option>
          <option v-for="venue in venues" :key="venue.id" :value="venue.id">{{ venue.name }}</option>
          <option value="__new__">+ Create New Venue</option>
        </select>

        <div v-else class="mt-3">
          <label for="newVenueName" class="form-label">Venue Name</label>
          <input
              id="newVenueName"
              v-model="newVenue.name"
              type="text"
              class="form-control"
              placeholder="Venue name"
          />

          <label for="venueCapacity" class="form-label mt-3">Venue Capacity</label>
          <input
              id="venueCapacity"
              v-model.number="newVenue.capacity"
              type="number"
              min="1"
              required
              class="form-control"
              placeholder="Enter capacity"
          />

          <label class="form-label mt-3">Address</label>
          <input
              v-model="newVenue.address.street"
              type="text"
              class="form-control mb-2"
              placeholder="Street"
          />
          <input
              v-model="newVenue.address.city"
              type="text"
              class="form-control mb-2"
              placeholder="City"
          />
          <input
              v-model="newVenue.address.zipCode"
              type="text"
              class="form-control mb-2"
              placeholder="Zip Code"
          />
          <input
              v-model="newVenue.address.country"
              type="text"
              class="form-control"
              placeholder="Country"
          />

          <button
              type="button"
              class="btn btn-secondary mt-2"
              @click.prevent="createVenue"
          >
            Create Venue
          </button>
          <button
              type="button"
              class="btn btn-outline-secondary mt-2 ms-2"
              @click.prevent="cancelNewVenue"
          >
            Cancel
          </button>
        </div>
      </div>

      <!-- Submit Button -->
      <button type="submit" class="btn btn-primary" :disabled="isSubmitting">
        {{ isSubmitting ? (isEdit ? 'Updating...' : 'Creating...') : (isEdit ? 'Update Event' : 'Create Event') }}
      </button>

      <!-- Error message -->
      <div v-if="error" class="alert alert-danger mt-3">{{ error }}</div>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import EventService from '@/services/eventService'
import CategoryService from '@/services/categoryService'
import VenueService from '@/services/venueService'
import { useAuthStore } from '@/stores/authStore.js'
import Swal from 'sweetalert2'

const router = useRouter()
const route = useRoute()
const store = useAuthStore()

const eventId = route.params.id || null
const isEdit = !!eventId

const form = ref({
  name: '',
  description: '',
  userId: store.loggedInUser.id,
  startDate: '',
  endDate: '',
  ticketPrice: 0,
  imageUrl: '',
  eventType: 'CONFERENCE',
  categoryId: '',
  venueId: '',
})

const isSubmitting = ref(false)
const error = ref(null)

const categories = ref([])
const venues = ref([])

const creatingNewCategory = ref(false)
const newCategoryName = ref('')

const creatingNewVenue = ref(false)
const newVenue = ref({
  name: '',
  capacity: 0,
  address: {
    street: '',
    city: '',
    zipCode: '',
    country: ''
  }
})

onMounted(async () => {
  await loadCategories()
  await loadVenues()
  if (isEdit) {
    await loadEvent()
  } else {
    setDefaultDates()
  }
})

async function loadCategories() {
  try {
    categories.value = await CategoryService.getAll()
  } catch (e) {
    console.error('Failed to load categories', e)
  }
}

async function loadVenues() {
  try {
    venues.value = await VenueService.getAll()
  } catch (e) {
    console.error('Failed to load venues', e)
  }
}

async function loadEvent() {
  try {
    const event = await EventService.getEventById(eventId)
    form.value.name = event.name
    form.value.description = event.description
    form.value.startDate = event.startDate.slice(0, 16)
    form.value.endDate = event.endDate.slice(0, 16)
    form.value.ticketPrice = event.ticketPrice || 0
    form.value.imageUrl = event.imageUrl || ''
    form.value.eventType = event.eventType
    form.value.categoryId = event.categoryId
    form.value.venueId = event.venueId
  } catch (e) {
    console.error('Failed to load event', e)
    error.value = 'Failed to load event data.'
  }
}

function setDefaultDates() {
  const now = new Date()
  const start = new Date(now.getTime() + 60 * 60 * 1000)
  const end = new Date(now.getTime() + 3 * 60 * 60 * 1000)
  form.value.startDate = formatDateTimeLocal(start)
  form.value.endDate = formatDateTimeLocal(end)
}

function formatDateTimeLocal(date) {
  return new Date(date.getTime() - date.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 16)
}

function onCategoryChange() {
  if (form.value.categoryId === '__new__') {
    creatingNewCategory.value = true
    form.value.categoryId = ''
  }
}

function cancelNewCategory() {
  creatingNewCategory.value = false
  newCategoryName.value = ''
}

async function createCategory() {
  if (!newCategoryName.value.trim()) {
    Swal.fire('Validation Error', 'Category name cannot be empty', 'warning')
    return
  }
  try {
    const newCat = await CategoryService.create({ name: newCategoryName.value.trim() })
    categories.value.push(newCat)
    form.value.categoryId = newCat.id
    creatingNewCategory.value = false
    newCategoryName.value = ''
    Swal.fire('Success', 'Category created successfully', 'success')
  } catch (e) {
    console.error('Failed to create category', e)
    Swal.fire('Error', 'Failed to create category', 'error')
  }
}

function onVenueChange() {
  if (form.value.venueId === '__new__') {
    creatingNewVenue.value = true
    form.value.venueId = ''
  }
}

function cancelNewVenue() {
  creatingNewVenue.value = false
  newVenue.value = {
    name: '',
    capacity: 0,
    address: {
      street: '',
      city: '',
      zipCode: '',
      country: ''
    }
  }
}

async function createVenue() {
  if (!newVenue.value.name.trim()) {
    Swal.fire('Validation Error', 'Venue name cannot be empty', 'warning')
    return
  }
  if (newVenue.value.capacity < 1 || isNaN(newVenue.value.capacity)) {
    Swal.fire('Validation Error', 'Capacity must be a positive number', 'warning')
    return
  }
  try {
    const newV = await VenueService.create(newVenue.value)
    venues.value.push(newV)
    form.value.venueId = newV.id
    creatingNewVenue.value = false
    cancelNewVenue()
    Swal.fire('Success', 'Venue created successfully', 'success')
  } catch (e) {
    console.error('Failed to create venue', e)
    Swal.fire('Error', 'Failed to create venue', 'error')
  }
}

async function handleSubmit() {
  error.value = null

  if (!form.value.categoryId || isNaN(parseInt(form.value.categoryId))) {
    Swal.fire('Validation Error', 'Please select or create a valid category', 'warning')
    return
  }
  if (!form.value.venueId || isNaN(parseInt(form.value.venueId))) {
    Swal.fire('Validation Error', 'Please select or create a valid venue', 'warning')
    return
  }
  if (form.value.ticketPrice < 0 || isNaN(form.value.ticketPrice)) {
    Swal.fire('Validation Error', 'Ticket price must be a non-negative number', 'warning')
    return
  }

  isSubmitting.value = true

  const payload = {
    name: form.value.name,
    description: form.value.description,
    userId: form.value.userId,
    startDate: new Date(form.value.startDate).toISOString(),
    endDate: new Date(form.value.endDate).toISOString(),
    ticketPrice: form.value.ticketPrice,
    imageUrl: form.value.imageUrl,
    eventType: form.value.eventType,
    category: form.value.categoryId,
    venue: form.value.venueId,
  }

  try {
    if (isEdit) {
      await EventService.update(eventId, payload)
      Swal.fire('Success', 'Event updated successfully', 'success')
    } else {
      await EventService.create(payload)
      Swal.fire('Success', 'Event created successfully', 'success')
      // Reset form after creation
      Object.assign(form.value, {
        name: '',
        description: '',
        startDate: '',
        endDate: '',
        ticketPrice: 0,
        imageUrl: '',
        eventType: 'CONFERENCE',
        categoryId: '',
        venueId: '',
      })
      setDefaultDates()
    }
    router.push('/events')
  } catch (e) {
    console.error('Failed to save event', e)
    error.value = 'Failed to save event. Please try again.'
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
/* Optional extra styling */
</style>
