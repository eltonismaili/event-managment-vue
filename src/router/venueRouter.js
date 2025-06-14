
import VenueView from "@/views/venue/VenueView.vue";
import UpdateVenueView from "@/views/venue/UpdateVenueView.vue";
import VenueDetailsView from "@/views/venue/VenueDetailsView.vue";

export default [
    {
        path: '/venues',
        name: 'venues',
        component: VenueView,
        meta: {requiresAuth: true, roles: ['ADMIN']}
    },
    {
        path: '/venues/update/:id',
        name: 'venue-update',
        component: UpdateVenueView,
        meta: {requiresAuth: true, roles: ['ADMIN']}
    },
    {
        path: '/venues/details/:id',
        name: 'venue-details',
        component: VenueDetailsView,
        meta: {requiresAuth: true, roles: ['ADMIN', 'USER']}
    }
];
