import { defineStore } from "pinia";
import { ref, computed } from "vue";
import client from "@/helpers/client.js";
import { jwtDecode } from "jwt-decode";

export const useAuthStore = defineStore("auth", () => {
    const token = ref(localStorage.getItem("token") || null);
    const user = ref(null);

    // Function to decode token and load user info
    const loadUserFromToken = () => {
        if (token.value) {
            user.value = jwtDecode(token.value);
        }
    };

    // Call it once when store initializes
    loadUserFromToken();

    // 🔐 LOGIN
    const logIn = async (userData) => {
        const response = await client.post("auth/login", userData);

        if (response.data) {
            token.value = response.data.token;
            localStorage.setItem("token", token.value);
            user.value = jwtDecode(token.value);
        }
    };

    // 🔓 LOGOUT
    const logOut = () => {
        token.value = null;
        user.value = null;
        localStorage.removeItem("token");
    };

    // 🆕 SIGNUP
    const signUp = async (userData) => {
        const response = await client.post("users/register", userData);
        return response.data;
    };

    const isLoggedIn = computed(() => !!token.value);

    return {
        logIn,
        logOut,
        signUp,
        isLoggedIn,
        loggedInUser: user, // reactive ref
    };
});
