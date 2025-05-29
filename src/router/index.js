import {createRouter, createWebHistory} from 'vue-router';
import {useAuthStore} from '@/stores/authStore.js';

import AuthView from '@/views/auth/AuthView.vue';     // your login view
import Register from '@/views/auth/Register.vue';     // your register view
import HomeView from '@/components/ui/HomeView.vue';  // your home view

const routes = [
    {
        path: '/auth/login',
        name: 'login',
        component: AuthView,
        meta: {requiresAuth: false}
    },
    {
        path: '/auth/register',
        name: 'register',
        component: Register,
        meta: {requiresAuth: false}
    },
    {
        path: '/',
        name: 'home',
        component: HomeView,
        meta: {requiresAuth: true}
    }
];

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes
});

// Navigation guard
router.beforeEach((to, from, next) => {
    const authStore = useAuthStore();

    if (to.meta.requiresAuth       && !authStore.isLoggedIn) {
        return next({name: 'login'});
    }

    if (!to.meta.requiresAuth && authStore.isLoggedIn && (to.name === 'login' || to.name === 'register')) {
        return next({name: 'home'});
    }

    next();
});

export default router;
