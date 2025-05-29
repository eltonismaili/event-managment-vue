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
      const redirect = `${route?.query?.redirect || '/'}`;
      await router.push(redirect)
      console.log(router)
    })
  }

  </script>

  <template>

    <div class="container d-flex justify-content-center align-items-center min-vh-100 bg-light">
      <div class="card shadow-lg p-4 rounded-4 w-100" style="max-width: 420px;">
        <div class="text-center mb-4">
          <div style="font-size: 40px;">🔐</div>
          <h2 class="mt-3">Login</h2>
          <p class="text-muted">Welcome back! Please log in to continue.</p>
        </div>
        <form @submit.prevent="handleSubmit">
          <div class="form-group mb-3">
            <label for="email" class="form-label">Email</label>
            <div class="input-group">
              <span class="input-group-text bg-white"><i class="bi bi-envelope"></i></span>
              <input type="email" v-model.trim="email" id="email" class="form-control" required/>
            </div>
          </div>

          <div class="form-group mb-4">
            <label for="password" class="form-label">Password</label>
            <div class="input-group">
              <span class="input-group-text bg-white"><i class="bi bi-lock"></i></span>
              <input type="password" v-model.trim="password" id="password" class="form-control" required/>
            </div>
          </div>

          <button type="submit" class="btn btn-primary w-100 fw-bold" :disabled="isLoading">
            <span v-if="isLoading" class="spinner-border spinner-border-sm me-2"></span>
            Login
          </button>

          <div class="text-center mt-3">
            <small>
              Don't have an account?
              <a href="#" @click.prevent="router.push({name:'register'})">Register</a>
            </small>
          </div>


        </form>
      </div>
    </div>
  </template>


  <style scoped>
  body {
    background-color: #f8f9fa;
  }

  .card {
    border: none;
  }
  </style>
