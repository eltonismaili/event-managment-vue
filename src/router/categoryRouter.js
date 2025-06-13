
import CategoryView from "@/views/category/CategoryView.vue";
import UpdateCategoryView from "@/views/category/UpdateCategoryView.vue";


export default [
    {
        path: '/categories',
        name: 'categories',
        component: CategoryView,
        meta: { requiresAuth: true }
    },
    {
        path: '/categories/update/:id',
        name: 'category-update',
        component: UpdateCategoryView,
        meta: { requiresAuth: true }
    },
];
