<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { getSubscribers, removeSubscriber, type Subscriber } from '../services/newsletter'

const subscribers = ref<Subscriber[]>([])
const loading = ref(false)
const errorMessage = ref('')

async function loadSubscribers() {
  loading.value = true
  errorMessage.value = ''

  try {
    subscribers.value = await getSubscribers()
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Something went wrong.'
  } finally {
    loading.value = false
  }
}

async function deleteSubscriber(subscriber: Subscriber) {
  if (!window.confirm(`Remove ${subscriber.name} from the newsletter?`)) {
    return
  }

  errorMessage.value = ''

  try {
    await removeSubscriber(subscriber.id)
    subscribers.value = subscribers.value.filter(({ id }) => id !== subscriber.id)
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Something went wrong.'
  }
}

onMounted(loadSubscribers)
</script>

<template>
  <section class="panel">
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
</template>

<style scoped>
.page-heading {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 2rem;
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

.delete-button {
  padding: 0.45rem 0.7rem;
  border: 1px solid #edb7b3;
  border-radius: 0.4rem;
  color: #9f2621;
  background: #fff8f7;
  cursor: pointer;
}

@media (max-width: 540px) {
  .page-heading {
    align-items: flex-start;
    flex-direction: column;
  }
}
</style>
