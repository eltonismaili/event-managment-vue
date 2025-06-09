<template>
  <form @submit.prevent="submitForm">
    <h2>Create Event</h2>

    <!-- Event Basic Info -->
    <div>
      <label>Event Name:</label>
      <input v-model="form.name" type="text" />
      <span v-if="errors.name">{{ errors.name }}</span>
    </div>

    <div>
      <label>Description:</label>
      <textarea v-model="form.description"></textarea>
      <span v-if="errors.description">{{ errors.description }}</span>
    </div>

    <!-- UserDto -->
    <fieldset>
      <legend>User Info</legend>
      <label>Name:</label>
      <input v-model="form.user.name" type="text" />
      <label>Surname:</label>
      <input v-model="form.user.surname" type="text" />
      <label>Email:</label>
      <input v-model="form.user.email" type="email" />
      <label>Password:</label>
      <input v-model="form.user.password" type="password" />
      <label>Age:</label>
      <input v-model.number="form.user.age" type="number" />
      <label>Role:</label>
      <select v-model="form.user.roles">
        <option value="ADMIN">ADMIN</option>
        <option value="USER">USER</option>
        <!-- Add your other roles -->
      </select>

      <!-- User Address -->
      <fieldset>
        <legend>User Address</legend>
        <label>Zip Code:</label>
        <input v-model="form.user.address.zipCode" type="text" />
        <label>City:</label>
        <input v-model="form.user.address.city" type="text" />
        <label>Country:</label>
        <input v-model="form.user.address.country" type="text" />
        <label>Street:</label>
        <input v-model="form.user.address.street" type="text" />
      </fieldset>
    </fieldset>

    <!-- Dates -->
    <div>
      <label>Start Date:</label>
      <input v-model="form.startDate" type="datetime-local" />
    </div>
    <div>
      <label>End Date:</label>
      <input v-model="form.endDate" type="datetime-local" />
    </div>

    <div>
      <label>Image URL:</label>
      <input v-model="form.imageUrl" type="text" />
    </div>

    <!-- Event Type -->
    <div>
      <label>Event Type:</label>
      <select v-model="form.eventType">
        <option value="CONFERENCE">Conference</option>
        <option value="MEETUP">Meetup</option>
        <option value="WORKSHOP">Workshop</option>
        <!-- Add your enum options -->
      </select>
    </div>

    <!-- CategoryDto -->
    <fieldset>
      <legend>Category</legend>
      <label>Name:</label>
      <input v-model="form.category.name" type="text" />
    </fieldset>

    <!-- VenueDto -->
    <fieldset>
      <legend>Venue</legend>
      <label>Name:</label>
      <input v-model="form.venue.name" type="text" />
      <label>Capacity:</label>
      <input v-model.number="form.venue.capacity" type="number" />

      <!-- Venue Address -->
      <fieldset>
        <legend>Venue Address</legend>
        <label>Zip Code:</label>
        <input v-model="form.venue.address.zipCode" type="text" />
        <label>City:</label>
        <input v-model="form.venue.address.city" type="text" />
        <label>Country:</label>
        <input v-model="form.venue.address.country" type="text" />
        <label>Street:</label>
        <input v-model="form.venue.address.street" type="text" />
      </fieldset>
    </fieldset>

    <div>
      <label>Created By:</label>
      <input v-model="form.createdBy" type="text" />
    </div>

    <button type="submit">Create Event</button>
  </form>
</template>

<script setup>
import { reactive, ref } from 'vue';

// Form data structure based on your DTOs
const form = reactive({
  id: null,
  name: '',
  description: '',
  user: {
    id: null,
    name: '',
    surname: '',
    email: '',
    password: '',
    age: null,
    roles: 'USER',
    address: {
      id: null,
      zipCode: '',
      city: '',
      country: '',
      street: '',
    },
  },
  startDate: '',
  endDate: '',
  imageUrl: '',
  eventType: 'CONFERENCE',
  category: {
    id: null,
    name: '',
  },
  venue: {
    id: null,
    name: '',
    capacity: null,
    address: {
      id: null,
      zipCode: '',
      city: '',
      country: '',
      street: '',
    },
  },
  createdBy: '',
  createdAt: new Date().toISOString().slice(0, 16), // yyyy-MM-ddTHH:mm for datetime-local
});

const errors = reactive({});

function validate() {
  errors.name = form.name.length < 2 || form.name.length > 50 ? 'Name must be between 2 and 50 characters' : '';
  errors.description = form.description.length < 2 || form.description.length > 1000 ? 'Description must be between 2 and 1000 characters' : '';
  errors.createdBy = form.createdBy.length < 2 || form.createdBy.length > 50 ? 'Created By must be between 2 and 50 characters' : '';

  // Add other validations for nested objects (User, Category, Venue, Address) as needed

  // Example validation for User name
  errors.userName = form.user.name.length < 2 || form.user.name.length > 50 ? 'User name must be between 2 and 50 characters' : '';

  // Return true if no errors
  return !errors.name && !errors.description && !errors.createdBy && !errors.userName;
}

function submitForm() {
  if (!validate()) {
    alert('Please fix errors');
    return;
  }

  // Build the payload as expected by your backend
  const payload = {
    name: form.name,
    description: form.description,
    userId: form.user,
    startDate: new Date(form.startDate).toISOString(),
    endDate: new Date(form.endDate).toISOString(),
    imageUrl: form.imageUrl,
    eventType: form.eventType,
    categoryId: form.category,
    venueId: form.venue,
    createdBy: form.createdBy,
    createdAt: new Date(form.createdAt).toISOString(),
  };

  console.log('Submitting event:', payload);

  // Example: send data to API
  // fetch('/api/v1/events', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(payload),
  // })
  //   .then(res => res.json())
  //   .then(data => alert('Event created successfully'))
  //   .catch(err => alert('Error creating event'));
}
</script>

<style scoped>
form {
  max-width: 600px;
  margin: auto;
}
label {
  display: block;
  margin-top: 10px;
}
input, textarea, select {
  width: 100%;
  padding: 6px;
  margin-top: 4px;
}
fieldset {
  border: 1px solid #ccc;
  margin: 10px 0;
  padding: 10px;
}
legend {
  font-weight: bold;
}
span {
  color: red;
  font-size: 0.8em;
}
button {
  margin-top: 20px;
  padding: 10px 15px;
}
</style>
