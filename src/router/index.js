import { createRouter, createWebHistory } from 'vue-router'
import LobbyView from '../views/LobbyView.vue'

const routes = [
  {
    path: '/',
    name: 'lobby',
    component: LobbyView
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router