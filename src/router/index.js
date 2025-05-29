import AuthView from "@/views/auth/AuthView.vue"
import {createRouter, createWebHistory} from "vue-router";
import HomeView from "@/components/ui/HomeView.vue";
import Register from "@/views/auth/Register.vue";
import {useAuthStore} from "@/stores/authStore.js";

const routes = [
    {
        path: '/auth',
        component: AuthView,
        children: [
            {
                path: 'login',
                name: 'login',
                component: AuthView,
                meta: { requiresAuth: false }
            },
            {
                path: 'register',
                name: 'register',
                component: Register,
                meta: { requiresAuth: false }
            }
        ]
    }, {
        path: "/",
        name: "home",
        component: HomeView,
        meta: {
            requiresAuth: true
        }
    }
];

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
});
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