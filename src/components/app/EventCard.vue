<script setup>
import {computed} from 'vue'
import {useRouter} from 'vue-router'

const props = defineProps({
  event: Object,
  venueName: String,
})

const router = useRouter()

const imageUrl = computed(() => {
  const baseUrl = 'http://localhost:8080/'
  return props.event.imagePath
      ? baseUrl + props.event.imagePath
      : `https://source.unsplash.com/400x250/?concert,festival&sig=${props.event.id}`
})

const formatDate = (date) => new Date(date).toLocaleDateString()

const goToEventDetails = () => {
  router.push({name: 'event-details', params: {id: props.event.id}})
}
</script>
<template>
  <div class="card event-card h-100 shadow-sm">
    <img
        :src="imageUrl"
        class="card-img-top"
        alt="Event Image"
    />
    <div class="card-body">
      <h5 class="card-title fw-bold text-primary">{{ event.name }}</h5>
      <p class="mb-1">
        <i class="bi bi-tags-fill text-secondary me-1"></i>
        <span class="badge bg-info text-dark">{{ event.eventType }}</span>
      </p>
      <p class="mb-1">
        <i class="bi bi-calendar-event me-2 text-secondary"></i>
        <strong>Start:</strong> {{ formatDate(event.startDate) }}
      </p>
      <p class="mb-3">
        <i class="bi bi-calendar-check me-2 text-secondary"></i>
        <strong>End:</strong> {{ formatDate(event.endDate) }}
      </p>
      <p class="mb-3">
        <i class="bi bi-geo-alt-fill me-2 text-secondary"></i>
        {{ venueName }}
      </p>
      <button class="btn btn-outline-primary w-100" @click="goToEventDetails">
        View Details
      </button>
    </div>
  </div>
</template>

<style scoped>
.event-card {
  border-radius: 16px;
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.event-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.08);
}

.card-img-top {
  height: 200px;
  object-fit: cover;
}
</style>
