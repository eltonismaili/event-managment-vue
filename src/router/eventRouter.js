// eventRouter.js
import EventView from "@/views/event/EventView.vue";
import CreateEventView from "@/views/event/CreateEventView.vue";

export default [
    {
        path: 'events',
        name: 'events',
        component: EventView,
        meta: { requiresAuth: true }
    },
    {
        path: 'events/create', // 👈 new route for create
        name: 'event-create',
        component: CreateEventView,
        meta: { requiresAuth: true }
    }
];
