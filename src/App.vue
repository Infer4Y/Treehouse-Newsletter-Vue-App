<script setup lang="ts">
import { ref } from 'vue'
import HelloWorld from './components/HelloWorld.vue'

type Page = 'subscribers' | 'signup'

const currentPage = ref<Page>('subscribers')
</script>

<template>
  <header class="site-header">
    <a class="brand" href="#" @click.prevent="currentPage = 'subscribers'">
      Treehouse Newsletter
    </a>

    <nav aria-label="Main navigation">
      <button
        type="button"
        :class="{ active: currentPage === 'subscribers' }"
        @click="currentPage = 'subscribers'"
      >
        Subscribers
      </button>
      <button
        type="button"
        :class="{ active: currentPage === 'signup' }"
        @click="currentPage = 'signup'"
      >
        Sign up
      </button>
    </nav>
  </header>

  <main>
    <HelloWorld :page="currentPage" @show-subscribers="currentPage = 'subscribers'" />
  </main>
</template>

<style scoped>
.site-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
  padding: 1.25rem 0;
  border-bottom: 1px solid var(--color-border);
}

.brand {
  color: var(--color-heading);
  font-size: 1.1rem;
  font-weight: 700;
  text-decoration: none;
}

nav {
  display: flex;
  gap: 0.5rem;
}

nav button {
  padding: 0.55rem 0.85rem;
  border: 0;
  border-radius: 0.4rem;
  color: var(--color-text-muted);
  background: transparent;
  cursor: pointer;
}

nav button:hover,
nav button.active {
  color: var(--color-primary-dark);
  background: var(--color-primary-soft);
}

@media (max-width: 540px) {
  .site-header {
    align-items: flex-start;
    flex-direction: column;
    gap: 0.75rem;
  }
}
</style>
