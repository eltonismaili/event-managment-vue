import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/authStore.js'

import AuthView from '@/views/auth/AuthView.vue'
import Register from '@/views/auth/Register.vue'
import HomeView from '@/components/ui/HomeView.vue'
import TheLayout from "@/components/ui/TheLayout.vue";
import eventRouter from './eventRouter.js'
import homeRouter from "@/router/homeRouter.js";
import categoryRouter from "@/router/categoryRouter.js";
import venueRouter from "@/router/venueRouter.js"; // Importing event routes

const routes = [
    {
        path: '/auth/login',
        name: 'login',
        component: AuthView,
        meta: { requiresAuth: false }
    },
    {
        path: '/auth/register',
        name: 'register',
        component: Register,
        meta: { requiresAuth: false }
    },
    {
        path: '/',
        component: TheLayout,  // <-- Use TheLayout here!
        meta: { requiresAuth: true },
        children: [
            ...homeRouter,
            ...eventRouter,
            ...categoryRouter,
            ...venueRouter
            // other authenticated routes go here
        ]
    }
]

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes
})

// Navigation guard remains the same
router.beforeEach((to, from, next) => {
    const authStore = useAuthStore()

    if (to.meta.requiresAuth && !authStore.isLoggedIn) {
        return next({ name: 'login' })
    }

    if (!to.meta.requiresAuth && authStore.isLoggedIn && (to.name === 'login' || to.name === 'register')) {
        return next({ name: 'home' })
    }

    next()
})

export default router
