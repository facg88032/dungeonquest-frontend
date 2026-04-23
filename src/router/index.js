import { createRouter, createWebHistory } from 'vue-router'
import LobbyView from '../views/LobbyView.vue'
import DungeonSelectView from '../views/DungeonSelectView.vue'
import DungeonView from '../views/DungeonView.vue'

const routes = [
  {
    path: '/',
    name: 'lobby',
    component: LobbyView
  },
  {
    path: '/dungeon/select',
    name: 'dungeonSelect',
    component: DungeonSelectView
  },
  {
    path:'/dungeon',
    name: 'dungeon',
    component : DungeonView
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router