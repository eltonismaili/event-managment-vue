<script setup>
import { computed } from 'vue'
import { useAuthStore } from '@/stores/authStore'

const authStore = useAuthStore()

const props = defineProps({
  title: String,
  items: {
    type: Array,
    required: true,
  },
  enableView: {
    type: Boolean,
    default: false,
  },
  enableEdit: {
    type: Boolean,
    default: false,
  },
  enableDelete: {
    type: Boolean,
    default: false,
  },
})

defineEmits(['click', 'edit', 'delete', 'view'])

// Computed checks
const canEdit = computed(() => {
  return props.enableEdit && authStore.loggedInUser?.role !== 'USER'
})

const canDelete = computed(() => {
  return props.enableDelete && authStore.loggedInUser?.role !== 'USER'
})
</script>

<template>
  <div class="container mt-4">
    <h2>{{ title }}</h2>

    <ul class="list-group">
      <li
          v-for="item in items"
          :key="item.id"
          class="list-group-item d-flex justify-content-between align-items-center"
      >
        <span @click="() => $emit('click', item)" style="cursor:pointer;">
          {{ item.name }}
        </span>
        <div>
          <button
              v-if="enableView"
              @click="$emit('view', item)"
              class="btn btn-sm btn-info me-2"
          >
            View
          </button>

          <button
              v-if="canEdit"
              @click="$emit('edit', item)"
              class="btn btn-sm btn-warning me-2"
          >
            Edit
          </button>

          <button
              v-if="canDelete"
              @click="$emit('delete', item)"
              class="btn btn-sm btn-danger"
          >
            Delete
          </button>
        </div>
      </li>
    </ul>
  </div>
</template>
