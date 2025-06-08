import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import EventService from '@/services/eventService'  // your API client for events

export const useEventStore = defineStore('event', () => {
    const events = ref([])
    const loading = ref(false)
    const error = ref(null)

    // Load all events from backend
    async function fetchEvents() {
        loading.value = true
        error.value = null
        try {
            const data = await EventService.getAllEvents()
            events.value = data
        } catch (err) {
            error.value = 'Failed to fetch events'
            console.error(err)
        } finally {
            loading.value = false
        }
    }

    // Create event
    async function createEvent(eventData) {
        loading.value = true
        error.value = null
        try {
            const newEvent = await EventService.createEvent(eventData)
            events.value.push(newEvent)
            return newEvent
        } catch (err) {
            error.value = 'Failed to create event'
            console.error(err)
            throw err
        } finally {
            loading.value = false
        }
    }

    // Update event
    async function updateEvent(id, eventData) {
        loading.value = true
        error.value = null
        try {
            const updatedEvent = await EventService.updateEvent(id, eventData)
            const index = events.value.findIndex(e => e.id === id)
            if (index !== -1) {
                events.value[index] = updatedEvent
            }
            return updatedEvent
        } catch (err) {
            error.value = 'Failed to update event'
            console.error(err)
            throw err
        } finally {
            loading.value = false
        }
    }

    // Delete event
    async function deleteEvent(id) {
        loading.value = true
        error.value = null
        try {
            const success = await EventService.deleteEvent(id)
            if (success) {
                events.value = events.value.filter(e => e.id !== id)
            }
            return success
        } catch (err) {
            error.value = 'Failed to delete event'
            console.error(err)
            throw err
        } finally {
            loading.value = false
        }
    }

    // Computed getter for events count
    const eventsCount = computed(() => events.value.length)

    return {
        events,
        loading,
        error,
        fetchEvents,
        createEvent,
        updateEvent,
        deleteEvent,
        eventsCount
    }
})
