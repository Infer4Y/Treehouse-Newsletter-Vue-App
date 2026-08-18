<template>
  <header class="site-header">
    <RouterLink class="brand" to="/subscribers">
      <span>
        <strong>Treehouse</strong>
        <small>Newsletter Manager</small>
      </span>
    </RouterLink>

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
  min-height: 100px;
  padding: 1.25rem 0;
  border-bottom: 2px solid var(--color-primary);
  background: white;
}

.brand {
  color: var(--color-heading);
  display: flex;
  align-items: center;
  font-family: Montserrat, Arial, sans-serif;
  text-decoration: none;
}

.brand strong,
.brand small {
  display: block;
}

.brand strong {
  font-size: 1.15rem;
  font-weight: 800;
  letter-spacing: 0.02em;
  line-height: 1.1;
  text-transform: uppercase;
}

.brand small {
  margin-top: 0.15rem;
  color: var(--color-text-muted);
  font-family: Asap, Arial, sans-serif;
  font-size: 0.75rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

nav {
  display: flex;
  gap: 0.5rem;
}

nav a {
  padding: 0.65rem 0.9rem;
  border-radius: 8px;
  color: var(--color-heading);
  font-weight: 700;
  text-decoration: none;
  transition: color 0.2s ease, background 0.2s ease;
}

nav a:hover,
nav a.router-link-active {
  color: white;
  background: var(--color-primary);
}

@media (max-width: 540px) {
  .site-header {
    align-items: flex-start;
    flex-direction: column;
    gap: 0.75rem;
  }
}
</style>
