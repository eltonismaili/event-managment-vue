<script setup>
import { computed } from 'vue'
import { useAuthStore } from '@/stores/authStore.js'

const authStore = useAuthStore()


const canEditDelete = computed(() => {
  const user = authStore.loggedInUser
  if (!user) return false
  return user.role !== 'user'
})

const props = defineProps({
  title: String,
  items: {
    type: Array,
    required: true,
  },
  columns: {
    type: Array,
    required: true,
  },
  enableActions: {
    type: Boolean,
    default: true,
  },
  enableView: {
    type: Boolean,
    default: false,
  },
  enableUpdate: {
    type: Boolean,
    default: false,
  },
  enableDelete: {
    type: Boolean,
    default: false,
  },
})

defineEmits(['click', 'edit', 'delete', 'view'])
</script>

<template>
  <div class="container mt-4">
    <h2 class="mb-4 text-primary fw-bold">{{ title }}</h2>

    <div v-if="items.length" class="table-responsive">
      <table class="table align-middle bg-white border shadow-sm rounded overflow-hidden">
        <thead class="bg-light text-secondary">
        <tr>
          <th v-for="col in columns" :key="col.key" class="fw-semibold">{{ col.label }}</th>
          <th v-if="enableActions" class="fw-semibold">Actions</th>
        </tr>
        </thead>
        <tbody>
        <tr
            v-for="item in items"
            :key="item.id"
            class="border-bottom"
            style="vertical-align: middle;"
        >
          <td
              v-for="col in columns"
              :key="col.key"
              @click="$emit('click', item)"
              class="py-3"
              style="cursor: pointer;"
          >
            {{ item[col.key] }}
          </td>
          <td v-if="enableActions" class="text-nowrap py-3">
            <div class="d-flex gap-2 justify-content-end">
              <button
                  v-if="enableView"
                  @click="$emit('view', item)"
                  class="btn btn-sm btn-outline-info d-flex align-items-center gap-1"
              >
                <i class="bi bi-eye"></i>
                View
              </button>
              <button
                  v-if="enableUpdate && canEditDelete"
                  @click="$emit('edit', item)"
                  class="btn btn-sm btn-outline-warning d-flex align-items-center gap-1"
              >
                <i class="bi bi-pencil"></i>
                Edit
              </button>
              <button
                  v-if="enableDelete && canEditDelete"
                  @click="$emit('delete', item)"
                  class="btn btn-sm btn-outline-danger d-flex align-items-center gap-1"
              >
                <i class="bi bi-trash"></i>
                Delete
              </button>
            </div>
          </td>
        </tr>
        </tbody>
      </table>
    </div>

    <div v-else class="alert alert-info mt-4">No items found.</div>
  </div>
</template>

<style scoped>
.table td,
.table th {
  border: none;
}
.table tbody tr:hover {
  background-color: #f8f9fa;
  transition: background-color 0.2s;
}
</style>
