import { defineStore } from "pinia";
import { computed, ref } from "vue";
import client from "@/helpers/client.js";
import { jwtDecode } from "jwt-decode";

export const useAuthStore = defineStore('auth', () => {
    const token = ref(localStorage.getItem('token') || null);

    // 🔐 LOGIN
    const logIn = async (user) => {
        const response = await client.post('auth/login', user);

        if (response.data) {
            token.value = response.data.token;
            localStorage.setItem('token', token.value);
        }
    };

    // 🔓 LOGOUT
    const logOut = () => {
        token.value = null;
        localStorage.removeItem('token');
    };

    // 🆕 SIGNUP (REGISTER)
    const signUp = async (userData) => {
        const response = await client.post('auth/register', userData);
        return response.data;
    };

    // ✅ isLoggedIn
    const isLoggedIn = computed(() => !!token.value);

    // 👤 Decode JWT to get user info
    const loggedInUser = computed(() => {
        return token.value ? jwtDecode(token.value) : null;
    });

    return {
        logIn,
        logOut,
        signUp,
        isLoggedIn,
        loggedInUser
    };
});
