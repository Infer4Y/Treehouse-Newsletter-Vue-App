<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'

type Page = 'subscribers' | 'signup'

interface Subscriber {
  id: number | string
  name: string
  email: string
  createdAt?: string
}

const props = defineProps<{
  page: Page
}>()

const emit = defineEmits<{
  showSubscribers: []
}>()

const apiUrl = 'https://treehousechallenge.contractornation.com/newsletter'
const subscribers = ref<Subscriber[]>([])
const name = ref('')
const email = ref('')
const loading = ref(false)
const submitting = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

function requestOptions(method = 'GET', body?: { name: string; email: string }): RequestInit {
  const apiKey = import.meta.env.VITE_API_KEY

  return {
    method,
    headers: {
      Authorization: apiKey,
      ...(body ? { 'Content-Type': 'application/json' } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  }
}

async function loadSubscribers() {
  loading.value = true
  errorMessage.value = ''

  try {
    const response = await fetch(apiUrl, requestOptions())

    if (!response.ok) {
      throw new Error('The subscriber list could not be loaded.')
    }

    const data = (await response.json()) as Subscriber[]
    subscribers.value = [...data].sort((a, b) => {
      if (a.createdAt && b.createdAt) {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      }

      return Number(b.id) - Number(a.id)
    })
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Something went wrong.'
  } finally {
    loading.value = false
  }
}

async function addSubscriber() {
  submitting.value = true
  errorMessage.value = ''
  successMessage.value = ''

  try {
    const response = await fetch(
      apiUrl,
      requestOptions('POST', { name: name.value.trim(), email: email.value.trim() }),
    )

    if (!response.ok) {
      throw new Error('The subscriber could not be added.')
    }

    name.value = ''
    email.value = ''
    successMessage.value = 'Subscriber added.'
    await loadSubscribers()
    emit('showSubscribers')
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Something went wrong.'
  } finally {
    submitting.value = false
  }
}

async function deleteSubscriber(subscriber: Subscriber) {
  if (!window.confirm(`Remove ${subscriber.name} from the newsletter?`)) {
    return
  }

  errorMessage.value = ''

  try {
    const response = await fetch(`${apiUrl}/${subscriber.id}`, requestOptions('DELETE'))

    if (!response.ok) {
      throw new Error('The subscriber could not be removed.')
    }

    subscribers.value = subscribers.value.filter(({ id }) => id !== subscriber.id)
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Something went wrong.'
  }
}

watch(
  () => props.page,
  (page) => {
    errorMessage.value = ''
    successMessage.value = ''

    if (page === 'subscribers') {
      loadSubscribers()
    }
  },
)

onMounted(loadSubscribers)
</script>

<template>
  <section v-if="page === 'subscribers'" class="panel">
    <div class="page-heading">
      <div>
        <p class="eyebrow">Newsletter</p>
        <h1>Current subscribers</h1>
        <p>Everyone currently signed up, with the newest submissions first.</p>
      </div>
      <button type="button" class="secondary-button" :disabled="loading" @click="loadSubscribers">
        Refresh
      </button>
    </div>

    <p v-if="errorMessage" class="message error" role="alert">{{ errorMessage }}</p>
    <p v-if="loading" class="empty-state">Loading subscribers...</p>
    <p v-else-if="subscribers.length === 0 && !errorMessage" class="empty-state">
      No one has signed up yet.
    </p>

    <ul v-else class="subscriber-list">
      <li v-for="subscriber in subscribers" :key="subscriber.id">
        <div>
          <strong>{{ subscriber.name }}</strong>
          <a :href="`mailto:${subscriber.email}`">{{ subscriber.email }}</a>
        </div>
        <button type="button" class="delete-button" @click="deleteSubscriber(subscriber)">
          Delete
        </button>
      </li>
    </ul>
  </section>

  <section v-else class="panel form-panel">
    <p class="eyebrow">Newsletter</p>
    <h1>Add a subscriber</h1>
    <p>Enter their name and email address below.</p>

    <p v-if="errorMessage" class="message error" role="alert">{{ errorMessage }}</p>
    <p v-if="successMessage" class="message success" role="status">{{ successMessage }}</p>

    <form @submit.prevent="addSubscriber">
      <label for="name">Name</label>
      <input id="name" v-model="name" name="name" type="text" autocomplete="name" required />

      <label for="email">Email</label>
      <input id="email" v-model="email" name="email" type="email" autocomplete="email" required />

      <button type="submit" class="primary-button" :disabled="submitting">
        {{ submitting ? 'Adding...' : 'Add subscriber' }}
      </button>
    </form>
  </section>
</template>

<style scoped>
.panel {
  padding: 3.5rem 0;
}

.page-heading {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 2rem;
}

.eyebrow {
  margin-bottom: 0.35rem;
  color: var(--color-primary-dark);
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.09em;
  text-transform: uppercase;
}

h1 {
  color: var(--color-heading);
  font-size: clamp(2rem, 6vw, 3.25rem);
  font-weight: 750;
  letter-spacing: -0.04em;
  line-height: 1.05;
}

h1 + p {
  margin-top: 0.75rem;
  color: var(--color-text-muted);
}

button {
  font: inherit;
}

.primary-button,
.secondary-button,
.delete-button {
  border-radius: 0.4rem;
  cursor: pointer;
}

.primary-button {
  align-self: flex-start;
  margin-top: 0.5rem;
  padding: 0.75rem 1rem;
  border: 1px solid var(--color-primary-dark);
  color: white;
  background: var(--color-primary-dark);
}

.secondary-button {
  padding: 0.6rem 0.9rem;
  border: 1px solid var(--color-border-strong);
  color: var(--color-heading);
  background: white;
}

.delete-button {
  padding: 0.45rem 0.7rem;
  border: 1px solid #edb7b3;
  color: #9f2621;
  background: #fff8f7;
}

button:disabled {
  cursor: wait;
  opacity: 0.6;
}

.subscriber-list {
  display: grid;
  gap: 0.75rem;
  margin-top: 2rem;
  padding: 0;
  list-style: none;
}

.subscriber-list li {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1rem 1.1rem;
  border: 1px solid var(--color-border);
  border-radius: 0.55rem;
  background: white;
}

.subscriber-list strong,
.subscriber-list a {
  display: block;
}

.subscriber-list strong {
  color: var(--color-heading);
  font-weight: 650;
}

.subscriber-list a {
  margin-top: 0.15rem;
  color: var(--color-text-muted);
  text-decoration: none;
}

.form-panel {
  max-width: 36rem;
}

form {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 2rem;
}

label {
  margin-top: 0.75rem;
  color: var(--color-heading);
  font-weight: 650;
}

input {
  width: 100%;
  padding: 0.8rem 0.9rem;
  border: 1px solid var(--color-border-strong);
  border-radius: 0.4rem;
  color: var(--color-heading);
  background: white;
  font: inherit;
}

input:focus {
  border-color: var(--color-primary);
  outline: 3px solid var(--color-primary-soft);
}

.message,
.empty-state {
  margin-top: 2rem;
  padding: 0.9rem 1rem;
  border-radius: 0.4rem;
}

.empty-state {
  color: var(--color-text-muted);
  background: white;
}

.error {
  color: #84211d;
  background: #fff0ef;
}

.success {
  color: #246336;
  background: #eef9f0;
}

@media (max-width: 540px) {
  .page-heading {
    align-items: flex-start;
    flex-direction: column;
  }
}
</style>
