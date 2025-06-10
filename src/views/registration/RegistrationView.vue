<template>
  <div class="container mt-5">
    <h2 class="h4 fw-bold text-primary mb-4">📋 Registrations List</h2>

    <div v-if="registrations.length" class="table-responsive">
      <table class="table table-striped table-bordered align-middle">
        <thead class="table-light">
        <tr>
          <th>ID</th>
          <th>User ID</th>
          <th>Event ID</th>
          <th>Actions</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="registration in registrations" :key="registration.id">
          <td>{{ registration.id }}</td>
          <td>{{ registration.userId }}</td>
          <td>{{ registration.eventId }}</td>
          <td>
            <!-- Example action buttons -->
            <button @click="handleDelete(registration.id)" class="btn btn-sm btn-danger">
              Delete
            </button>
          </td>
        </tr>
        </tbody>
      </table>
    </div>

    <div v-else class="alert alert-info">No registrations found.</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import RegistrationService from '@/services/registrationService.js'

const registrations = ref([])

const fetchRegistrations = async () => {
  try {
    registrations.value = await RegistrationService.getAll()
  } catch (error) {
    console.error('Failed to fetch registrations:', error)
  }
}

const handleDelete = async (id) => {
  if (confirm('Are you sure you want to delete this registration?')) {
    try {
      const success = await RegistrationService.delete(id)
      if (success) {
        registrations.value = registrations.value.filter(r => r.id !== id)
      }
    } catch (error) {
      console.error('Failed to delete registration:', error)
    }
  }
}

onMounted(fetchRegistrations)
</script>
