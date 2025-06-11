<template>
  <ItemTable
      title="Registrations"
      :items="formattedRegistrations"
      :columns="columns"
      :enableDelete="true"
      @click="() => {}"
      @delete="handleDelete"
  />
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import RegistrationService from '@/services/registrationService.js'
import ItemTable from "@/components/app/ItemTable.vue"
import Swal from 'sweetalert2'

const registrations = ref([])

const fetchRegistrations = async () => {
  try {
    registrations.value = await RegistrationService.getAll()
  } catch (error) {
    console.error('Failed to fetch registrations:', error)
    Swal.fire('Error', 'Failed to load registrations.', 'error')
  }
}

// Define columns expected by ItemTable
const columns = [
  { key: 'userName', label: 'User Name' },
  { key: 'userEmail', label: 'User Email' },
  { key: 'eventName', label: 'Event Name' }
]

// Format registrations matching the columns keys
const formattedRegistrations = computed(() =>
    registrations.value.map(r => ({
      id: r.id,
      userName: r.userId?.name ?? 'Unknown',
      userEmail: r.userId?.email ?? 'No email',
      eventName: r.eventId?.name ?? 'Unknown'
    }))
)

const handleDelete = async (registration) => {
  const result = await Swal.fire({
    title: 'Are you sure?',
    text: 'Do you want to delete this registration?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Yes, delete it!'
  })

  if (result.isConfirmed) {
    try {
      const success = await RegistrationService.delete(registration.id)
      if (success) {
        registrations.value = registrations.value.filter(r => r.id !== registration.id)
        Swal.fire('Deleted!', 'Registration has been deleted.', 'success')
      }
    } catch (error) {
      console.error('Failed to delete registration:', error)
      Swal.fire('Error', 'Failed to delete registration.', 'error')
    }
  }
}

onMounted(fetchRegistrations)
</script>
