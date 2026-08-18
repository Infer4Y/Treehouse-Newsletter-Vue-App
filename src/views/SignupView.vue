<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { createSubscriber } from '../services/newsletter'

const router = useRouter()
const name = ref('')
const email = ref('')
const submitting = ref(false)
const errorMessage = ref('')

async function addSubscriber() {
  submitting.value = true
  errorMessage.value = ''

  try {
    await createSubscriber(name.value.trim(), email.value.trim())
    await router.push('/subscribers')
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Something went wrong.'
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <section class="panel form-panel">
    <p class="eyebrow">Newsletter</p>
    <h1>Add a subscriber</h1>
    <p>Enter their name and email address below.</p>

    <p v-if="errorMessage" class="message error" role="alert">{{ errorMessage }}</p>

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
</style>
