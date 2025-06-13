<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import EventService from '@/services/eventService'
import ItemTable from "@/components/app/ItemTable.vue";
import Swal from "sweetalert2";
import { useAuthStore } from "@/stores/authStore.js"

const router = useRouter()
const authStore = useAuthStore()

const events = ref([])

const fetchEvents = async () => {
  try {
    const data = await EventService.getAllEvents()
    events.value = data.map(event => ({
      ...event,
      startDate: new Date(event.startDate).toLocaleDateString()
    }))
  } catch (error) {
    console.error('Failed to fetch events:', error)
  }
}


const columns = [
  { key: 'name', label: 'Name' },
  { key: 'startDate', label: 'Start Date' },
  { key: 'description', label: 'Description' },
]


const canAddEvent = computed(() => {
  return authStore.loggedInUser && authStore.loggedInUser.role !== 'USER'
})
const canEditDelete = computed(() => {
  return authStore.loggedInUser && authStore.loggedInUser.role !== 'USER'
})

function handleAdd() {
  router.push({ name: 'event-create' })
}

function handleUpdate(event) {
  router.push({ name: 'event-update', params: { id: event.id } })
}

function handleViewDetails(event) {
  router.push({ name: 'event-details', params: { id: event.id } })
}

async function handleDelete(event) {
  const result = await Swal.fire({
    title: 'Are you sure?',
    text: "You won't be able to revert this!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Yes, delete it!'
  })

  if (result.isConfirmed) {
    try {
      await EventService.deleteEvent(event.id)
      events.value = events.value.filter(e => e.id !== event.id)
      await Swal.fire('Deleted!', 'Your event has been deleted.', 'success')
    } catch (error) {
      console.error('Failed to delete event:', error)
      Swal.fire('Error', 'Failed to delete event', 'error')
    }
  }
}

onMounted(fetchEvents)
</script>

<template>
  <div class="container mt-5">
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h2 class="h4 fw-bold text-primary">📅 Upcoming Events</h2>
      <button
          v-if="canAddEvent"
          @click="handleAdd"
          class="btn btn-success"
      >
        <i class="bi bi-plus-lg"></i> Add Event
      </button>
    </div>

    <ItemTable
        title="Events"
        :items="events"
        :columns="columns"
        :enableUpdate="canEditDelete"
        :enableDelete="canEditDelete"
        :enableView="true"
        @edit="handleUpdate"
        @delete="handleDelete"
        @view="handleViewDetails"
    />
  </div>
</template>
