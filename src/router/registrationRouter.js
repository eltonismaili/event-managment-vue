// registrationRouter.js

import RegistrationView from "@/views/registration/RegistrationView.vue";

export default [
    {
        path: '/registrations',
        name: 'registration-list',
        component: RegistrationView,
        meta: { requiresAuth: true }
    }
]
