<template>
  <div class="container mt-5">
    <h2 class="mb-4">Create New Event</h2>

    <form @submit.prevent="handleSubmit">
      <!-- Event name -->
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

      <!-- Description -->
      <div class="mb-3">
        <label for="description" class="form-label">Description</label>
        <textarea
            id="description"
            v-model="form.description"
            class="form-control"
            rows="3"
            required
        ></textarea>
      </div>

      <!-- Start date -->
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

      <!-- End date -->
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

      <!-- Image URL -->
      <div class="mb-3">
        <label for="imageUrl" class="form-label">Image URL (Optional)</label>
        <input
            id="imageUrl"
            v-model="form.imageUrl"
            type="url"
            class="form-control"
            placeholder="https://example.com/image.jpg"
        />
      </div>

      <!-- Event Type -->
      <div class="mb-3">
        <label for="eventType" class="form-label">Event Type</label>
        <select
            id="eventType"
            v-model="form.eventType"
            class="form-select"
            required
        >
          <option value="CONCERT">Concert</option>
          <option value="CONFERENCE">Conference</option>
          <option value="MATCH">Match</option>
          <option value="DEBATE">Debate</option>
          <option value="WORKSHOP">Workshop</option>
          <option value="OTHER">Other</option>
        </select>
      </div>

      <!-- Category select + create -->
      <div class="mb-3">
        <label for="category" class="form-label">Category</label>
        <select
            id="category"
            v-model="form.categoryId"
            class="form-select"
            required
            @change="onCategoryChange"
        >
          <option value="" disabled>Select category</option>
          <option v-for="cat in categories" :key="cat.id" :value="cat.id">
            {{ cat.name }}
          </option>
          <option value="new">-- Create New Category --</option>
        </select>
      </div>

      <!-- New Category input -->
      <div v-if="creatingNewCategory" class="mb-3">
        <label for="newCategory" class="form-label">New Category Name</label>
        <input
            id="newCategory"
            v-model="newCategoryName"
            type="text"
            class="form-control"
            placeholder="Enter new category name"
        />
        <button type="button" class="btn btn-secondary mt-2" @click="createCategory">
          Create Category
        </button>
      </div>

      <!-- Venue select + create -->
      <div class="mb-3">
        <label for="venue" class="form-label">Venue</label>
        <select
            id="venue"
            v-model="form.venueId"
            class="form-select"
            required
            @change="onVenueChange"
        >
          <option value="" disabled>Select venue</option>
          <option v-for="venue in venues" :key="venue.id" :value="venue.id">
            {{ venue.name }}
          </option>
          <option value="new">-- Create New Venue --</option>
        </select>
      </div>

      <!-- New Venue inputs -->
      <div v-if="creatingNewVenue" class="mb-3">
        <label for="newVenueName" class="form-label">Venue Name</label>
        <input
            id="newVenueName"
            v-model="newVenue.name"
            type="text"
            class="form-control"
            placeholder="Venue name"
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

        <button type="button" class="btn btn-secondary mt-2" @click="createVenue">
          Create Venue
        </button>
      </div>

      <!-- Submit button -->
      <button type="submit" class="btn btn-primary" :disabled="isSubmitting">
        {{ isSubmitting ? 'Creating...' : 'Create Event' }}
      </button>

      <!-- Error message -->
      <div v-if="error" class="alert alert-danger mt-3">{{ error }}</div>
    </form>
  </div>
</template>

<script setup>
import {ref, onMounted} from 'vue'
import {useRouter} from 'vue-router'
import EventService from '@/services/eventService'
import CategoryService from '@/services/categoryService'
import VenueService from '@/services/venueService'
import {useAuthStore} from "@/stores/authStore.js";

const router = useRouter()

const store = useAuthStore()

const form = ref({
  name: '',
  description: '',
  userId: store.loggedInUser.id, // Set dynamically as needed
  startDate: '',
  endDate: '',
  imageUrl: '',
  eventType: 'CONFERENCE',
  categoryId: '',
  venueId: '',
  createdBy: 'admin',
  createdAt: new Date().toISOString()
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
  setDefaultDates()
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
  if (form.value.categoryId === 'new') {
    creatingNewCategory.value = true
    form.value.categoryId = ''
  } else {
    creatingNewCategory.value = false
  }
}

async function createCategory() {
  if (!newCategoryName.value.trim()) {
    alert('Category name is required')
    return
  }
  try {
    const created = await CategoryService.create({name: newCategoryName.value.trim()})
    categories.value.push(created)
    form.value.categoryId = created.id
    newCategoryName.value = ''
    creatingNewCategory.value = false
  } catch (e) {
    console.error('Error creating category', e)
    alert('Failed to create category')
  }
}

function onVenueChange() {
  if (form.value.venueId === 'new') {
    creatingNewVenue.value = true
    form.value.venueId = ''
  } else {
    creatingNewVenue.value = false
  }
}

async function createVenue() {
  if (!newVenue.value.name.trim()) {
    alert('Venue name is required')
    return
  }
  const addr = newVenue.value.address
  if (!addr.street.trim() || !addr.city.trim() || !addr.zipCode.trim() || !addr.country.trim()) {
    alert('Complete address is required')
    return
  }
  try {
    const created = await VenueService.create(newVenue.value)
    venues.value.push(created)
    form.value.venueId = created.id
    // Reset new venue inputs
    newVenue.value = {
      name: '',
      address: {
        street: '',
        city: '',
        zipCode: '',
        country: ''
      }
    }
    creatingNewVenue.value = false
  } catch (e) {
    console.error('Error creating venue', e)
    alert('Failed to create venue')
  }
}

async function handleSubmit() {
  error.value = null

  if (!form.value.categoryId) {
    error.value = 'Please select or create a category'
    return
  }
  if (!form.value.venueId) {
    error.value = 'Please select or create a venue'
    return
  }

  const selectedCategory = categories.value.find(c => c.id === form.value.categoryId)
  const selectedVenue = venues.value.find(v => v.id === form.value.venueId)

  if (!selectedCategory || !selectedVenue) {
    error.value = 'Invalid category or venue selected'
    return
  }

  const payload = {
        name: form.value.name.trim(),
        description: form.value.description.trim(),
        startDate: form.value.startDate,
        endDate: form.value.endDate,
        imageUrl: form.value.imageUrl?.trim() || null,
        eventType: form.value.eventType,
        categoryId: form.value.categoryId,
        venueId: form.value.venueId,            // ✅ full object
      user: { id: store.loggedInUser.id }, // ✅ wrap as object

      createdBy: form.value.createdBy,
      createdAt: form.value.createdAt
}

  isSubmitting.value = true
  try {
    await EventService.createEvent(payload)
    alert('Event created successfully')
    await router.push('/events')
  } catch (e) {
    console.error('Failed to create event', e)
    error.value = 'Failed to create event, please try again.'
  } finally {
    isSubmitting.value = false
  }
}

</script>

<style scoped>
.container {
  max-width: 600px;
}
</style>
