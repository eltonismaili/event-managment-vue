<template>
  <div class="container mt-5">
    <h2 class="h4 fw-bold text-primary mb-4">🎟️ Your Tickets</h2>

    <div v-if="tickets.length" class="row g-4">
      <div
          v-for="ticket in tickets"
          :key="ticket.id"
          class="col-md-6 col-lg-4"
      >
        <div
            class="ticket-card p-4 shadow rounded"
            :id="'ticket-' + ticket.id"
        >
          <div class="ticket-header text-white p-2 rounded-top">
            <h5 class="mb-0">{{ ticket.name }}</h5>
            <small>{{ ticket.eventName || 'Unknown Event' }}</small>
          </div>

          <div class="ticket-body py-3">
            <p><strong>Quantity:</strong> {{ ticket.quantity }}</p>
            <p><strong>Price:</strong> ${{ ticket.price.toFixed(2) }}</p>
            <p><strong>Total:</strong> ${{ (ticket.quantity * ticket.price).toFixed(2) }}</p>
            <p><strong>Start:</strong> {{ formatDate(ticket.startDate) }}</p>
            <p><strong>End:</strong> {{ formatDate(ticket.endDate) }}</p>
            <p><strong>Buyer:</strong> {{ buyerName }}</p>
          </div>

          <div class="ticket-footer text-end">
            <button
                class="btn btn-outline-primary btn-sm"
                @click="downloadTicket(ticket.id)"
            >
              <i class="bi bi-download"></i> PDF
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="alert alert-info">No tickets found.</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import html2pdf from 'html2pdf.js'
import TicketService from '@/services/ticketService'
import EventService from '@/services/eventService'

// Simulated current logged-in user ID and name (replace with real auth info)
const currentUserId = 1
const buyerName = 'Logged-in User' // replace with real user name if available

const tickets = ref([])
const events = ref([])

const formatDate = (date) => new Date(date).toLocaleString()

const fetchEvents = async () => {
  try {
    events.value = await EventService.getAllEvents()
  } catch (error) {
    console.error('Failed to fetch events:', error)
  }
}

const fetchTickets = async () => {
  try {
    const allTickets = await TicketService.getAll()
    // Filter tickets by current user
    const userTickets = allTickets.filter(t => t.userId === currentUserId)
    // Map eventId to eventName
    tickets.value = userTickets.map(ticket => {
      const event = events.value.find(e => e.id === ticket.eventId)
      return {
        ...ticket,
        eventName: event ? event.name : 'Unknown Event',
      }
    })
  } catch (error) {
    console.error('Failed to fetch tickets:', error)
  }
}

const downloadTicket = (ticketId) => {
  const element = document.getElementById(`ticket-${ticketId}`)
  if (!element) return
  html2pdf().from(element).set({
    margin: 0.5,
    filename: `ticket-${ticketId}.pdf`,
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'in', format: 'a5', orientation: 'portrait' }
  }).save()
}

onMounted(async () => {
  await fetchEvents()
  await fetchTickets()
})
</script>

<style scoped>
.ticket-card {
  background: #ffffff;
  border-left: 5px dashed #5c6bc0;
  transition: transform 0.2s ease;
}
.ticket-card:hover {
  transform: scale(1.02);
}
.ticket-header {
  background: #5c6bc0;
}
.ticket-body p {
  margin-bottom: 0.5rem;
}
.ticket-footer {
  margin-top: 1rem;
}
</style>
