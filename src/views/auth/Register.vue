<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import { useAppToast } from '@/composables/useAppToast'

const router = useRouter()
const authStore = useAuthStore()
const toast = useAppToast()

const name = ref('')
const surname = ref('')
const email = ref('')
const password = ref('')
const age = ref('')
const createdBy = ref('system')
const addressId = ref(1)
const role = ref('USER')

const handleRegister = async () => {
  if (!name.value || !email.value || !password.value) {
    toast.showWarning('Please fill in all required fields')
    return
  }

  try {
    await authStore.signUp({
      name: name.value,
      surname: surname.value,
      email: email.value,
      password: password.value,
      age: age.value,
      createdBy: createdBy.value,
      roles: role.value,
      addressId: { id: addressId.value }
    })
    toast.showSuccess('Registration successful')
    await router.push('/auth/login')
  } catch (error) {
    toast.showError(error.response?.data?.message || 'Registration failed')
  }
}
</script>

<template>
  <div class="signup-wrapper">
    <div class="signup-card shadow-sm">
      <h2 class="mb-4 text-center">Create Your Account</h2>
      <form @submit.prevent="handleRegister" novalidate>
        <div class="form-group mb-3">
          <label for="name">Name <span class="text-danger">*</span></label>
          <input
              v-model="name"
              id="name"
              type="text"
              class="form-control"
              placeholder="Your first name"
              required
              autocomplete="given-name"
          />
        </div>

        <div class="form-group mb-3">
          <label for="surname">Surname</label>
          <input
              v-model="surname"
              id="surname"
              type="text"
              class="form-control"
              placeholder="Your last name"
              autocomplete="family-name"
          />
        </div>

        <div class="form-group mb-3">
          <label for="email">Email <span class="text-danger">*</span></label>
          <input
              v-model="email"
              id="email"
              type="email"
              class="form-control"
              placeholder="example@mail.com"
              required
              autocomplete="email"
          />
        </div>

        <div class="form-group mb-3">
          <label for="password">Password <span class="text-danger">*</span></label>
          <input
              v-model="password"
              id="password"
              type="password"
              class="form-control"
              placeholder="Create a password"
              required
              autocomplete="new-password"
          />
        </div>

        <div class="form-group mb-3">
          <label for="age">Age</label>
          <input
              v-model="age"
              id="age"
              type="number"
              min="0"
              class="form-control"
              placeholder="Your age"
          />
        </div>

        <div class="form-group mb-3">
          <label for="addressId">Address ID</label>
          <input
              v-model="addressId"
              id="addressId"
              type="number"
              min="1"
              class="form-control"
              placeholder="Address ID"
          />
        </div>

        <button type="submit" class="btn btn-primary w-100 py-2 fw-semibold">
          Register
        </button>
      </form>

      <p class="text-center mt-3">
        Already have an account?
        <router-link to="/auth/login" class="text-primary text-decoration-none">
          Log in here
        </router-link>
      </p>
    </div>
  </div>
</template>

<style scoped>
.signup-wrapper {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #667eea, #764ba2);
  padding: 1rem;
}

.signup-card {
  background-color: #fff;
  border-radius: 12px;
  max-width: 420px;
  width: 100%;
  padding: 2.5rem 2rem;
  box-shadow: 0 12px 25px rgba(0, 0, 0, 0.15);
  transition: box-shadow 0.3s ease;
}

.signup-card:hover {
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.25);
}

.form-control {
  border-radius: 8px;
  padding: 0.625rem 0.75rem;
  font-size: 1rem;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

.form-control:focus {
  border-color: #667eea;
  box-shadow: 0 0 8px rgba(102, 126, 234, 0.6);
  outline: none;
}

label {
  font-weight: 600;
  font-size: 0.9rem;
}

.btn-primary {
  background: #667eea;
  border: none;
  font-size: 1.1rem;
  border-radius: 8px;
  transition: background-color 0.3s ease;
}

.btn-primary:hover,
.btn-primary:focus {
  background: #5a67d8;
  box-shadow: 0 0 12px rgba(90, 103, 216, 0.7);
  outline: none;
}

p {
  font-size: 0.9rem;
}

.text-primary:hover {
  text-decoration: underline;
  cursor: pointer;
}
</style>
