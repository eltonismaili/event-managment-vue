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
              v-if="enableEdit"
              @click="$emit('edit', item)"
              class="btn btn-sm btn-warning me-2"
          >
            Edit
          </button>

          <button
              v-if="enableDelete"
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

<script setup>
defineProps({
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
</script>
