<script setup>
import {ref} from 'vue'
import {useRouter, useRoute} from 'vue-router'
import {useAuthStore} from '@/stores/authStore'
import {useAppToast} from '@/composables/useAppToast'
import {useLoading} from '@/composables/useLoading'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const toast = useAppToast()
const {isLoading, withLoading} = useLoading()

const email = ref('')
const password = ref('')

const handleSubmit = async () => {
  if (!email.value || !password.value) {
    toast.showWarning('Please fill in all fields')
    return
  }

  await withLoading(async () => {
    await authStore.logIn({email: email.value, password: password.value})
    const redirect = `${route?.query?.redirect || '/'}`
    await router.push(redirect)
  })
}
</script>

<template>
  <section class="login-section">
    <div class="card shadow">
      <div class="text-center mb-4">
        <div class="lock-icon">🔐</div>
        <h2>Login</h2>
        <p class="text-muted">Welcome back! Please log in to continue.</p>
      </div>
      <form @submit.prevent="handleSubmit" novalidate>
        <div class="form-group">
          <label for="email">Email *</label>
          <input
              id="email"
              v-model.trim="email"
              type="email"
              class="form-control"
              placeholder="example@mail.com"
              required
          />
        </div>

        <div class="form-group">
          <label for="password">Password *</label>
          <input
              id="password"
              v-model.trim="password"
              type="password"
              class="form-control"
              placeholder="Enter your password"
              required
          />
        </div>

        <button :disabled="isLoading" type="submit" class="btn btn-primary w-100 fw-semibold">
          <span v-if="isLoading" class="spinner-border spinner-border-sm me-2"></span>
          Login
        </button>

        <p class="text-center mt-3">
          Don't have an account?
          <a href="#" @click.prevent="router.push({ name: 'register' })" class="text-primary text-decoration-none">
            Register here
          </a>
        </p>
      </form>
    </div>
  </section>
</template>

<style scoped>
.login-section {
  background: linear-gradient(135deg, #74ebd5 0%, #9face6 100%);
  padding: 2rem 1rem;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.card {
  border-radius: 1.25rem;
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
  max-width: 420px;
  width: 100%;
  background: linear-gradient(145deg, #ffffffcc, #f3f7ffcc);
  backdrop-filter: blur(8px);
  padding: 2.5rem 2rem;
  transition: box-shadow 0.3s ease;
}

.card:hover {
  box-shadow: 0 16px 32px rgba(0, 0, 0, 0.25);
}

.lock-icon {
  font-size: 40px;
}

h2 {
  color: #333e72;
  font-weight: 700;
  margin-bottom: 0.5rem;
  letter-spacing: 1.2px;
}

p.text-muted {
  color: #5061f7;
  margin-bottom: 1.5rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

label {
  color: #5061f7;
  font-weight: 600;
  margin-bottom: 0.35rem;
  display: block;
}

.form-control {
  border: 1.8px solid #c3cfe2;
  border-radius: 8px;
  background-color: #f9fbff;
  color: #2a2f4a;
  font-size: 1rem;
  padding: 0.5rem 0.75rem;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

.form-control:focus {
  border-color: #5061f7;
  box-shadow: 0 0 8px rgba(80, 97, 247, 0.5);
  outline: none;
  background-color: #fff;
  color: #1a1f3d;
}

button.btn-primary {
  background-color: #5061f7;
  border-color: #5061f7;
  font-weight: 700;
  font-size: 1.1rem;
  border-radius: 8px;
  padding: 0.75rem 0;
  transition: background-color 0.3s ease, border-color 0.3s ease;
}

button.btn-primary:hover:not(:disabled) {
  background-color: #3a4ecc;
  border-color: #3a4ecc;
  box-shadow: 0 0 12px rgba(58, 78, 204, 0.6);
  cursor: pointer;
}

button:disabled {
  cursor: not-allowed;
  opacity: 0.7;
}

a.text-primary {
  color: #5061f7;
  font-weight: 600;
}

a.text-primary:hover {
  color: #3a4ecc;
  text-decoration: underline;
}
</style>
