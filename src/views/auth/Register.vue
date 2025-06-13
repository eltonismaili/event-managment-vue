<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore.js'
import { useAppToast } from '@/composables/useAppToast.js'
import { useLoading } from "@/composables/useLoading.js"

const router = useRouter()
const authStore = useAuthStore()
const toast = useAppToast()
const { isLoading, withLoading } = useLoading()

const form = reactive({
  name: { val: '', isValid: true },
  surname: { val: '', isValid: true },
  email: { val: '', isValid: true },
  password: { val: '', isValid: true },
  age: { val: null, isValid: true },
  createdAt: '',
  address: reactive({
    zipCode: { val: '', isValid: true },
    city: { val: '', isValid: true },
    country: { val: '', isValid: true },
    street: { val: '', isValid: true },
  }),
})

const formIsValid = ref(true)

function validateForm() {
  formIsValid.value = true


  for (const key of ['name', 'surname', 'email', 'password', 'age']) {
    if (!form[key].val || (typeof form[key].val === 'string' && !form[key].val.trim())) {
      form[key].isValid = false
      formIsValid.value = false
    } else {
      form[key].isValid = true
    }
  }


  for (const key in form.address) {
    if (!form.address[key].val || !form.address[key].val.trim()) {
      form.address[key].isValid = false
      formIsValid.value = false
    } else {
      form.address[key].isValid = true
    }
  }
}

function clearValidity(key, nested = false) {
  if (nested) {
    form.address[key].isValid = true
  } else {
    form[key].isValid = true
  }
}

async function handleSubmit() {
  validateForm()
  if (!formIsValid.value) {
    toast.showWarning('Please fill in all required fields.')
    return
  }

  form.createdAt = new Date().toISOString()

  const payload = {
    name: form.name.val.trim(),
    surname: form.surname.val.trim(),
    email: form.email.val.trim(),
    password: form.password.val.trim(),
    age: form.age.val,
    roles: 'USER',
    createdBy: form.name.val.trim(),
    createdAt: form.createdAt,
    address: {
      zipCode: form.address.zipCode.val.trim(),
      city: form.address.city.val.trim(),
      country: form.address.country.val.trim(),
      street: form.address.street.val.trim(),
    },
  }

  await withLoading(async () => {
    try {
      await authStore.signUp(payload)
      toast.showSuccess('Registration successful!')
      router.push('/auth/login')
    } catch (error) {
      toast.showError(error.response?.data?.message || 'Registration failed.')
    }
  })
}
</script>

<template>
  <section class="register-section">
    <div class="card shadow">
      <h2>Create Your Account</h2>

      <form @submit.prevent="handleSubmit" novalidate>
        <div class="form-grid">

          <div>
            <label for="name">Name *</label>
            <input
                id="name"
                v-model="form.name.val"
                type="text"
                class="form-control"
                :class="{ 'is-invalid': !form.name.isValid }"
                @blur="clearValidity('name')"
                placeholder="Your first name"
                required
            />
            <div class="invalid-feedback">Name is required (2-50 chars).</div>
          </div>

          <div>
            <label for="surname">Surname *</label>
            <input
                id="surname"
                v-model="form.surname.val"
                type="text"
                class="form-control"
                :class="{ 'is-invalid': !form.surname.isValid }"
                @blur="clearValidity('surname')"
                placeholder="Your surname"
                required
            />
            <div class="invalid-feedback">Surname is required (2-50 chars).</div>
          </div>


          <div>
            <label for="email">Email *</label>
            <input
                id="email"
                v-model="form.email.val"
                type="email"
                class="form-control"
                :class="{ 'is-invalid': !form.email.isValid }"
                @blur="clearValidity('email')"
                placeholder="example@mail.com"
                required
            />
            <div class="invalid-feedback">Valid email is required.</div>
          </div>


          <div>
            <label for="password">Password *</label>
            <input
                id="password"
                v-model="form.password.val"
                type="password"
                class="form-control"
                :class="{ 'is-invalid': !form.password.isValid }"
                @blur="clearValidity('password')"
                placeholder="Create a password"
                required
            />
            <div class="invalid-feedback">Password is required (2-50 chars).</div>
          </div>


          <div>
            <label for="age">Age *</label>
            <input
                id="age"
                v-model.number="form.age.val"
                type="number"
                min="0"
                class="form-control"
                :class="{ 'is-invalid': !form.age.isValid }"
                @blur="clearValidity('age')"
                placeholder="Your age"
                required
            />
            <div class="invalid-feedback">Age is required.</div>
          </div>
        </div>


        <fieldset class="address-fieldset">
          <legend>Address *</legend>
          <div class="address-grid">
            <div>
              <label for="zipCode">Zip Code *</label>
              <input
                  id="zipCode"
                  v-model="form.address.zipCode.val"
                  type="text"
                  class="form-control"
                  :class="{ 'is-invalid': !form.address.zipCode.isValid }"
                  @blur="clearValidity('zipCode', true)"
                  placeholder="Zip Code"
                  maxlength="5"
                  required
              />
              <div class="invalid-feedback">Zip Code is required (5 chars).</div>
            </div>

            <div>
              <label for="city">City *</label>
              <input
                  id="city"
                  v-model="form.address.city.val"
                  type="text"
                  class="form-control"
                  :class="{ 'is-invalid': !form.address.city.isValid }"
                  @blur="clearValidity('city', true)"
                  placeholder="City"
                  required
              />
              <div class="invalid-feedback">City is required.</div>
            </div>

            <div>
              <label for="country">Country *</label>
              <input
                  id="country"
                  v-model="form.address.country.val"
                  type="text"
                  class="form-control"
                  :class="{ 'is-invalid': !form.address.country.isValid }"
                  @blur="clearValidity('country', true)"
                  placeholder="Country"
                  required
              />
              <div class="invalid-feedback">Country is required.</div>
            </div>

            <div>
              <label for="street">Street *</label>
              <input
                  id="street"
                  v-model="form.address.street.val"
                  type="text"
                  class="form-control"
                  :class="{ 'is-invalid': !form.address.street.isValid }"
                  @blur="clearValidity('street', true)"
                  placeholder="Street"
                  required
              />
              <div class="invalid-feedback">Street is required.</div>
            </div>
          </div>
        </fieldset>

        <button :disabled="isLoading" type="submit" class="btn btn-primary w-100 py-2 fw-semibold">
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
  </section>
</template>
<style scoped>
.register-section {
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
  max-width: 600px;
  width: 100%;
  min-width: 320px;
  background: linear-gradient(145deg, #ffffffcc, #f3f7ffcc);
  backdrop-filter: blur(8px);
  padding: 2.5rem 2rem;
  transition: box-shadow 0.3s ease;
}

.card:hover {
  box-shadow: 0 16px 32px rgba(0, 0, 0, 0.25);
}

h2 {
  color: #333e72;
  font-weight: 700;
  margin-bottom: 1.5rem;
  text-align: center;
  letter-spacing: 1.2px;
}

.form-control {
  border: 1.8px solid #c3cfe2;
  border-radius: 8px;
  background-color: #f9fbff;
  color: #2a2f4a;
  font-size: 1rem;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
  padding: 0.5rem 0.75rem;
}

.form-control:focus {
  border-color: #5061f7;
  box-shadow: 0 0 8px rgba(80, 97, 247, 0.5);
  outline: none;
  background-color: #fff;
  color: #1a1f3d;
}

.is-invalid {
  border-color: #e55353 !important;
  box-shadow: 0 0 0 0.2rem rgba(229, 83, 83, 0.3) !important;
}

label {
  color: #5061f7;
  font-weight: 600;
  margin-bottom: 0.35rem;
  display: block;
}

.invalid-feedback {
  color: #e55353;
  font-size: 0.85rem;
  margin-top: 0.25rem;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem 1.5rem;
  margin-bottom: 1.5rem;
}

.address-fieldset {
  border: 1.5px solid #5061f7;
  padding: 1rem 1.25rem 1.25rem;
  border-radius: 1rem;
  background-color: #f0f4ff;
  margin-bottom: 1.5rem;
}

.address-fieldset legend {
  color: #5061f7;
  font-weight: 700;
  padding: 0 0.5rem;
  font-size: 1.1rem;
  margin-bottom: 1rem;
}

.address-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem 1.5rem;
}

button.btn-primary {
  background-color: #5061f7;
  border-color: #5061f7;
  font-weight: 700;
  font-size: 1.1rem;
  transition: background-color 0.3s ease, border-color 0.3s ease;
  border-radius: 8px;
  padding: 0.75rem 0;
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

@media (max-width: 575.98px) {
  .form-grid,
  .address-grid {
    grid-template-columns: 1fr;
  }
}
</style>
