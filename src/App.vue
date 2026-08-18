<template>
  <header class="site-header">
    <RouterLink class="brand" to="/subscribers">Treehouse Newsletter</RouterLink>

    <nav aria-label="Main navigation">
      <RouterLink to="/subscribers">Subscribers</RouterLink>
      <RouterLink to="/signup">Sign up</RouterLink>
    </nav>
  </header>

  <main>
    <RouterView />
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

nav a {
  padding: 0.55rem 0.85rem;
  border-radius: 0.4rem;
  color: var(--color-text-muted);
  text-decoration: none;
}

nav a:hover,
nav a.router-link-active {
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
