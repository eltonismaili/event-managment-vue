// ticketRouter.js
import TicketView from '@/views/ticket/TicketView.vue'


export default [
    {
        path: '/tickets',
        name: 'tickets',
        component: TicketView,
        meta: { requiresAuth: true }
    },
    // {
    //     path: '/tickets/create',
    //     name: 'ticket-create',
    //     component: CreateTicketView,
    //     meta: { requiresAuth: true }
    // },
    // {
    //     path: '/tickets/update/:id',
    //     name: 'ticket-update',
    //     component: UpdateTicketView,
    //     meta: { requiresAuth: true }
    // },
    // {
    //     path: '/tickets/:id',
    //     name: 'ticket-details',
    //     component: TicketDetails,
    //     meta: { requiresAuth: true }
    // }
]
