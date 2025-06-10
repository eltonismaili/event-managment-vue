<template>
  <div class="container mt-4">
    <h2>Update Venue</h2>
    <form @submit.prevent="handleSubmit">
      <div class="mb-3">
        <label for="name" class="form-label">Venue Name</label>
        <input id="name" v-model="venue.name" type="text" class="form-control" required />
      </div>

      <h4>Address</h4>
      <div class="mb-3">
        <label for="street" class="form-label">Street</label>
        <input id="street" v-model="venue.address.street" type="text" class="form-control" required />
      </div>
      <div class="mb-3">
        <label for="city" class="form-label">City</label>
        <input id="city" v-model="venue.address.city" type="text" class="form-control" required />
      </div>
      <div class="mb-3">
        <label for="country" class="form-label">Country</label>
        <input id="country" v-model="venue.address.country" type="text" class="form-control" required />
      </div>
      <div class="mb-3">
        <label for="zipCode" class="form-label">Zip Code</label>
        <input id="zipCode" v-model="venue.address.zipCode" type="text" class="form-control" required />
      </div>

      <button type="submit" class="btn btn-primary">Save Changes</button>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import VenueService from '@/services/venueService'
import AddressService from '@/services/addressService'

const route = useRoute()
const router = useRouter()

const venue = ref({
  name: '',
  address: {
    street: '',
    city: '',
    country: '',
    zipCode: ''
  }
})

const fetchVenue = async () => {
  try {
    const id = route.params.id
    const data = await VenueService.getById(id)
    if (data) {
      // Sigurohu që data ka formatin e pritur, veçanërisht 'address'
      venue.value.name = data.name || ''
      venue.value.address = data.address || {
        street: '',
        city: '',
        country: '',
        zipCode: ''
      }
    }
  } catch (err) {
    console.error('Failed to fetch venue:', err)
  }
}

const handleSubmit = async () => {
  try {
    const id = route.params.id
    if (!id) {
      throw new Error("Venue ID is missing in route params")
    }

    // Update address first
    if (venue.value.address && venue.value.address.id) {
      await AddressService.update(venue.value.address.id, venue.value.address)
    } else {
      throw new Error("Address ID is missing, cannot update")
    }

    // Update venue with full address object or just addressId, varion sipas backend
    const venuePayload = {
      name: venue.value.name,
      address: venue.value.address
    }

    const updatedVenue = await VenueService.update(id, venuePayload)

    if (updatedVenue) {
      await router.push('/venues')  // Redirect to venues list
    } else {
      console.error("Venue update failed: no data returned")
    }
  } catch (err) {
    console.error('Failed to update venue:', err)
  }
}



onMounted(fetchVenue)
</script>
