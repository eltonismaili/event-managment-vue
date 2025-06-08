// eventRouter.js


import HomeView from "@/components/ui/HomeView.vue";

export default [
    {
        path: '',
        name: 'home',
        component: HomeView,
        meta: { requiresAuth: true }
    }
];
