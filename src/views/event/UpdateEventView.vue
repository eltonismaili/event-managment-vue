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

        <div v-else>
          <input v-model="newVenue.name" type="text" class="form-control mb-2" placeholder="Venue name" />

          <input v-model="newVenue.address.street" type="text" class="form-control mb-2" placeholder="Street" />
          <input v-model="newVenue.address.city" type="text" class="form-control mb-2" placeholder="City" />
          <input v-model="newVenue.address.zipCode" type="text" class="form-control mb-2" placeholder="Zip Code" />
          <input v-model="newVenue.address.country" type="text" class="form-control mb-2" placeholder="Country" />

          <button @click.prevent="createVenue" class="btn btn-sm btn-primary me-2">Save Venue</button>
          <button @click.prevent="cancelNewVenue" class="btn btn-sm btn-secondary">Cancel</button>
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
    alert('Category name cannot be empty')
    return
  }
  try {
    const newCat = await CategoryService.create({ name: newCategoryName.value.trim() })
    categories.value.push(newCat)
    form.value.categoryId = newCat.id
    creatingNewCategory.value = false
    newCategoryName.value = ''
  } catch (e) {
    console.error('Failed to create category', e)
    alert('Failed to create category')
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
    alert('Venue name cannot be empty')
    return
  }
  try {
    const newV = await VenueService.create(newVenue.value)
    venues.value.push(newV)
    form.value.venueId = newV.id
    creatingNewVenue.value = false
    cancelNewVenue()
  } catch (e) {
    console.error('Failed to create venue', e)
    alert('Failed to create venue')
  }
}

async function handleSubmit() {
  error.value = null

  if (!form.value.categoryId || isNaN(parseInt(form.value.categoryId))) {
    error.value = 'Please select or create a valid category'
    return
  }
  if (!form.value.venueId || isNaN(parseInt(form.value.venueId))) {
    error.value = 'Please select or create a valid venue'
    return
  }

  const selectedCategory = categories.value.find(c => c.id === form.value.categoryId)
  const selectedVenue = venues.value.find(v => v.id === form.value.venueId)

  if (!selectedCategory || !selectedVenue) {
    error.value = 'Selected category or venue is invalid'
    return
  }

  isSubmitting.value = true

  const payload = {
    name: form.value.name,
    description: form.value.description,
    userId: form.value.userId,
    startDate: new Date(form.value.startDate).toISOString(),
    endDate: new Date(form.value.endDate).toISOString(),
    imageUrl: form.value.imageUrl,
    eventType: form.value.eventType,
    categoryId: form.value.categoryId,
    venueId: form.value.venueId,
  }

  try {
    if (isEdit) {
      await EventService.updateEvent(eventId, payload) // <--- fixed method name
      alert('Event updated successfully')
    } else {
      await EventService.createEvent(payload)
      alert('Event created successfully')
    }
    router.push({ name: 'EventList' }) // or wherever you want to go
  } catch (e) {
    console.error('Failed to submit event', e)
    error.value = 'Failed to submit event. Please try again.'
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
/* Add any scoped CSS you need here */
</style>
