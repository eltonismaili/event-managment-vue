<template>
  <div class="container mt-5">
    <!-- Header -->
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h2 class="h4 fw-bold text-primary">📅 Upcoming Events</h2>
      <button @click="handleAdd" class="btn btn-success">
        <i class="bi bi-plus-lg"></i> Add Event
      </button>
    </div>

    <!-- Events Table -->
    <div v-if="events.length" class="table-responsive">
      <table class="table table-striped table-bordered align-middle">
        <thead class="table-light">
        <tr>
          <th>Name</th>
          <th>Start Date</th>
          <th>Description</th>
          <th style="width: 150px;">Actions</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="event in events" :key="event.id">
          <td>{{ event.name }}</td>
          <td>{{ formatDate(event.startDate) }}</td>
          <td>{{ event.description }}</td>
          <td>
            <button @click="handleUpdate(event.id)" class="btn btn-sm btn-primary me-2">
              <i class="bi bi-pencil"></i> Update
            </button>
            <button @click="handleDelete(event.id)" class="btn btn-sm btn-danger">
              <i class="bi bi-trash"></i> Delete
            </button>
          </td>
        </tr>
        </tbody>
      </table>
    </div>

    <!-- No Events -->
    <div v-else class="alert alert-info mt-4">
      No events found. Please add events to see them here.
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import EventService from '@/services/eventService'

const router = useRouter()
const events = ref([])

const fetchEvents = async () => {
  try {
    events.value = await EventService.getAllEvents()
  } catch (error) {
    console.error('Failed to fetch events:', error)
  }
}

function handleAdd() {
  router.push({ name: 'event-create' }) // Navigate to event creation page
}

function handleUpdate(id) {
  router.push({ name: 'event-update', params: { id } }) // Navigate to event update page
}

async function handleDelete(id) {
  if (confirm('Are you sure you want to delete this event?')) {
    try {
      await EventService.deleteEvent(id)
      events.value = events.value.filter(e => e.id !== id)
    } catch (error) {
      console.error('Failed to delete event:', error)
    }
  }
}

function formatDate(date) {
  return new Date(date).toLocaleDateString()
}

onMounted(fetchEvents)
</script>
