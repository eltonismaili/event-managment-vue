// eventRouter.js
import EventView from "@/views/event/EventView.vue";
import CreateEventView from "@/views/event/CreateEventView.vue";
import UpdateEventView from "@/views/event/UpdateEventView.vue";
import EventDetails from "@/views/event/EventDetails.vue";

export default [
    {
        path: '/events',
        name: 'events',
        component: EventView,
        meta: { requiresAuth: true }
    },
    {
        path: '/events/create', // 👈 new route for create
        name: 'event-create',
        component: CreateEventView,
        meta: { requiresAuth: true }
    },
    {
        path: '/events/update/:id',
        name: 'event-update',
        component: UpdateEventView,
        meta: { requiresAuth: true }
    },
    {
        path: '/events/:id',
        name: 'event-details',
        component: EventDetails,
        meta: { requiresAuth: true }
    }
];
