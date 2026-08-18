import { createRouter, createWebHistory } from 'vue-router'
import SubscribersView from './views/SubscribersView.vue'
import SignupView from './views/SignupView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', redirect: '/subscribers' },
    { path: '/subscribers', component: SubscribersView },
    { path: '/signup', component: SignupView },
  ],
})

export default router
