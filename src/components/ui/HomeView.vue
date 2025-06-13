

  <script setup>
  import { ref, onMounted } from 'vue'
  import EventCard from "@/components/app/EventCard.vue"
  import EventService from '@/services/eventService'
  import VenueService from '@/services/venueService'

  const events = ref([])
  const venues = ref([])

  const fetchData = async () => {
    try {
      events.value = await EventService.getAllEvents()
      venues.value = await VenueService.getAll()
    } catch (error) {
      console.error('Failed to fetch data:', error)
    }
  }

  const getVenueName = (venueId) => {
    const venue = venues.value.find(v => v.id === venueId)
    return venue ? venue.name : 'Unknown Venue'
  }

  onMounted(fetchData)
  </script>
  <template>
    <div class="container mt-4">
      <h1 class="display-5 mb-4">Welcome to Event Manager 🎉</h1>
      <p class="lead mb-5">Manage your concerts, festivals, and more!</p>

      <div class="row">
        <div
            class="col-md-6 col-lg-4 mb-4"
            v-for="event in events"
            :key="event.id"
        >
          <EventCard :event="event" :venueName="getVenueName(event.venueId)" />
        </div>
      </div>
    </div>
  </template>
