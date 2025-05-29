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
const addressId = ref(1) // ose nga dropdown
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
await router.push({ name: 'login' })
</script>

<template>
  <div class="container">
    <form @submit.prevent="handleRegister" class="mt-5 w-50 mx-auto">
      <h2>Sign Up</h2>
      <div class="mb-3">
        <label>Name</label>
        <input v-model="name" class="form-control" />
      </div>
      <div class="mb-3">
        <label>Surname</label>
        <input v-model="surname" class="form-control" />
      </div>
      <div class="mb-3">
        <label>Email</label>
        <input v-model="email" class="form-control" type="email" />
      </div>
      <div class="mb-3">
        <label>Password</label>
        <input v-model="password" class="form-control" type="password" />
      </div>
      <div class="mb-3">
        <label>Age</label>
        <input v-model="age" class="form-control" type="number" />
      </div>
      <div class="mb-3">
        <label>Address ID</label>
        <input v-model="addressId" class="form-control" type="number" />
      </div>
      <button class="btn btn-primary">Register</button>
    </form>
  </div>
</template>
