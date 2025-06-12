<template>
  <div class="container mt-5">
    <h2 class="mb-4">Update Event</h2>

    <form @submit.prevent="handleSubmit">
      <!-- Event Name -->
      <div class="mb-3">
        <label for="name" class="form-label">Event Name</label>
        <input id="name" v-model="form.name" type="text" class="form-control" required/>
      </div>

      <!-- Description -->
      <div class="mb-3">
        <label for="description" class="form-label">Description</label>
        <textarea id="description" v-model="form.description" class="form-control" rows="3" required></textarea>
      </div>

      <!-- Start & End Date -->
      <div class="mb-3">
        <label for="startDate" class="form-label">Start Date</label>
        <input id="startDate" v-model="form.startDate" type="datetime-local" class="form-control" required/>
      </div>

      <div class="mb-3">
        <label for="endDate" class="form-label">End Date</label>
        <input id="endDate" v-model="form.endDate" type="datetime-local" class="form-control" required/>
      </div>

      <!-- Image Upload -->
      <div class="mb-3">
        <label for="imageFile" class="form-label">Change Event Image (optional)</label>
        <input
            id="imageFile"
            type="file"
            class="form-control"
            @change="handleFileUpload"
            accept="image/*"
        />
        <div v-if="previewImage" class="mt-3">
          <img
              :src="previewImage"
              alt="Event Image Preview"
              style="max-width: 100%; max-height: 300px; object-fit: contain;"
          />
        </div>
      </div>

      <!-- Ticket Price -->
      <div class="mb-3">
        <label for="ticketPrice" class="form-label">Ticket Price (€)</label>
        <input id="ticketPrice" v-model.number="form.ticketPrice" type="number" class="form-control" required min="0"
               step="0.01"/>
      </div>

      <!-- Event Type -->
      <div class="mb-3">
        <label for="eventType" class="form-label">Event Type</label>
        <select id="eventType" v-model="form.eventType" class="form-select" required>
          <option value="CONCERT">Concert</option>
          <option value="CONFERENCE">Conference</option>
          <option value="MATCH">Match</option>
          <option value="DEBATE">Debate</option>
          <option value="WORKSHOP">Workshop</option>
          <option value="OTHER">Other</option>
        </select>
      </div>

      <!-- Category -->
      <div class="mb-3">
        <label for="category" class="form-label">Category</label>
        <select id="category" v-model="form.category" class="form-select" required @change="onCategoryChange">
        <option  value="" disabled>Select category</option>
          <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
          <option value="new">-- Create New Category --</option>
        </select>
      </div>

      <div v-if="creatingNewCategory" class="mb-3">
        <label class="form-label">New Category Name</label>
        <input v-model="newCategoryName" type="text" class="form-control"/>
        <button type="button" class="btn btn-secondary mt-2" @click="createCategory">Create Category</button>
      </div>

      <!-- Venue -->
      <div class="mb-3">
        <label for="venue" class="form-label">Venue</label>
        <select id="venue" v-model="form.venue" class="form-select" required @change="onVenueChange">
          <option value="" disabled>Select venue</option>
          <option v-for="venue in venues" :key="venue.id" :value="venue.id">{{ venue.name }}</option>
          <option value="new">-- Create New Venue --</option>
        </select>
      </div>

      <div v-if="creatingNewVenue" class="mb-3">
        <label class="form-label">Venue Name</label>
        <input v-model="newVenue.name" type="text" class="form-control"/>

        <label class="form-label mt-3">Venue Capacity</label>
        <input v-model.number="newVenue.capacity" type="number" class="form-control" min="1"/>

        <label class="form-label mt-3">Address</label>
        <input v-model="newVenue.address.street" type="text" class="form-control mb-2" placeholder="Street"/>
        <input v-model="newVenue.address.city" type="text" class="form-control mb-2" placeholder="City"/>
        <input v-model="newVenue.address.zipCode" type="text" class="form-control mb-2" placeholder="Zip Code"/>
        <input v-model="newVenue.address.country" type="text" class="form-control" placeholder="Country"/>

        <button type="button" class="btn btn-secondary mt-2" @click="createVenue">Create Venue</button>
      </div>

      <button type="submit" class="btn btn-success" :disabled="isSubmitting">
        {{ isSubmitting ? 'Updating...' : 'Update Event' }}
      </button>

      <div v-if="error" class="alert alert-danger mt-3">{{ error }}</div>
    </form>
  </div>
</template>

<script setup>
import {ref, onMounted} from 'vue'
import {useRoute, useRouter} from 'vue-router'
import EventService from '@/services/eventService'
import CategoryService from '@/services/categoryService'
import VenueService from '@/services/venueService'
import Swal from 'sweetalert2'
import data from "bootstrap/js/src/dom/data.js";

const route = useRoute()
const router = useRouter()
const eventId = route.params.id

const form = ref({
  name: '',
  description: '',
  startDate: '',
  endDate: '',
  eventType: '',
  category: '',
  venue: '',
  ticketPrice: 0,
  imagePath: ''
})

const existingImagePath = ref('')

const imageFile = ref(null)
const previewImage = ref('')

const isSubmitting = ref(false)
const error = ref(null)
const categories = ref([])
const venues = ref([])
const creatingNewCategory = ref(false)
const newCategoryName = ref('')
const creatingNewVenue = ref(false)

const newVenue = ref({
  name: '',
  capacity: null,
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
  await loadEvent()
  console.log('Category',categories)
  previewImage.value = existingImagePath.value ? getFullImageUrl(existingImagePath.value) : ''
})

async function loadEvent() {
  try {
    const data = await EventService.getEventById(eventId)
    form.value = {
      name: data.name,
      description: data.description,
      startDate: formatDateTimeLocal(data.startDate),
      endDate: formatDateTimeLocal(data.endDate),
      eventType: data.eventType,
      category: data.category,
      venue: data.venue,
      ticketPrice: data.ticketPrice,
      imagePath: data.imagePath || ''
    }


  } catch (e) {
    console.error('Failed to load event', e)
    error.value = 'Failed to load event.'
  }
}

function formatDateTimeLocal(date) {
  return new Date(new Date(date).getTime() - new Date(date).getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 16)
}

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

function handleFileUpload(e) {
  imageFile.value = e.target.files[0]
  if (imageFile.value) {
    previewImage.value = URL.createObjectURL(imageFile.value)
  } else {
    previewImage.value = existingImagePath.value ? getFullImageUrl(existingImagePath.value) : ''
  }
}

function getFullImageUrl(path) {
  if (!path) return ''
  return `http://localhost:8080/${path}`
}

function onCategoryChange() {
  creatingNewCategory.value = form.value.category === 'new'
  if (creatingNewCategory.value) form.value.category = ''
}

async function createCategory() {
  if (!newCategoryName.value.trim()) {
    alert('Category name is required')
    return
  }
  try {
    const created = await CategoryService.create({name: newCategoryName.value.trim()})
    categories.value.push(created)
    form.value.category = created.id
    newCategoryName.value = ''
    creatingNewCategory.value = false
  } catch (e) {
    alert('Failed to create category')
  }
}

function onVenueChange() {
  creatingNewVenue.value = form.value.venue === 'new'
  if (creatingNewVenue.value) form.value.venue = ''
}

async function createVenue() {
  const v = newVenue.value
  if (!v.name.trim() || !v.capacity || !v.address.street.trim() || !v.address.city.trim() || !v.address.zipCode.trim() || !v.address.country.trim()) {
    alert('Please complete all venue fields')
    return
  }

  try {
    const created = await VenueService.create(v)
    venues.value.push(created)
    form.value.venue = created.id
    creatingNewVenue.value = false
    newVenue.value = {name: '', capacity: null, address: {street: '', city: '', zipCode: '', country: ''}}
  } catch (e) {
    alert('Failed to create venue')
  }
}

async function handleSubmit() {
  error.value = null

  if (!form.value.category || !form.value.venue) {
    error.value = 'Please select or create both a category and a venue'
    return
  }

  const eventPayload = {
    name: form.value.name,
    description: form.value.description,
    startDate: form.value.startDate,
    endDate: form.value.endDate,
    eventType: form.value.eventType,
    category: Number(form.value.category),
    venue: Number(form.value.venue),
    ticketPrice: form.value.ticketPrice,
    imagePath: form.value.imagePath
  }


  // if (!imageFile.value) {
  //   eventPayload.imagePath = existingImagePath.value
  // }

  const formData = new FormData()
  const blob = new Blob([JSON.stringify(eventPayload)], {type: 'application/json'})
  formData.append('data', blob)

  const symbolInput = document.querySelector("#imageFile");
  if (symbolInput?.files?.length) {
    formData.append("image", symbolInput.files[0]);
  }


  isSubmitting.value = true
  try {
    await EventService.updateEvent(eventId, formData)
    await Swal.fire({
      icon: 'success',
      title: 'Event Updated!',
      timer: 2000,
      showConfirmButton: false
    })
    router.push('/events')
  } catch (e) {
    console.error('Update failed', e)
    error.value = 'Failed to update event. Try again.'
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
