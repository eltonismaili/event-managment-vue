<template>
  <ItemList
      title="Venues"
      :items="venues"
      :enableView="true"
      :enableEdit="true"
      :enableDelete="true"
      @click="goToDetails"
      @view="goToDetails"
      @edit="editVenue"
      @delete="deleteVenue"
  />
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import VenueService from '@/services/venueService'
import ItemList from "@/components/app/ItemList.vue";

const router = useRouter()
const venues = ref([])

const fetchVenues = async () => {
  venues.value = await VenueService.getAll()
}

const goToDetails = (venue) => {
  router.push(`/venues/details/${venue.id}`)
}

const editVenue = (venue) => {
  router.push(`/venues/update/${venue.id}`)
}

import Swal from 'sweetalert2'

const deleteVenue = async (venue) => {
  const result = await Swal.fire({
    title: 'Are you sure?',
    text: "This venue will be deleted permanently!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Yes, delete it!',
  })

  if (result.isConfirmed) {
    try {
      await VenueService.delete(venue.id)
      venues.value = venues.value.filter(v => v.id !== venue.id)
      await Swal.fire('Deleted!', 'Venue deleted successfully.', 'success')
    } catch (error) {
      console.error(error)
      await Swal.fire('Error', 'Failed to delete venue.', 'error')
    }
  }
}


onMounted(fetchVenues)
</script>
