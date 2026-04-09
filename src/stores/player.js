import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getPlayer, getHeroesByPlayerId } from '../api/player.js'

export const usePlayerStore = defineStore('player', () => {

  const player = ref(null)
  const heroes = ref([])
  const loading = ref(false)
  const error = ref(null)

  async function fetchAll(playerId) {
    loading.value = true
    error.value = null
    try {
      // 同時發出兩個請求，等全部回來
      const [playerRes, heroesRes] = await Promise.all([
        getPlayer(playerId),
        getHeroesByPlayerId(playerId)
      ])
      player.value = playerRes.data
      heroes.value = heroesRes.data
    } catch (e) {
      error.value = '載入資料失敗'
    } finally {
      loading.value = false
    }
  }

  function clearAll() {
    player.value = null
    heroes.value = []
  }

  return { player, heroes, loading, error, fetchAll, clearAll }
})