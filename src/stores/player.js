import { defineStore } from "pinia";
import { ref } from "vue";
import { getPlayer } from '../api/player.js'

export const usePlayerStore = defineStore('player', () => {
  const player = ref(null)
  const loading = ref(false)   // 控制載入中狀態
  const error = ref(null)      // 記錄錯誤訊息

  async function fetchPlayer(playerId) {
    loading.value = true
    error.value = null
    try {
      const res = await getPlayer(playerId)
      // 你後端回傳格式是 { success, message, data }
      // 所以玩家資料在 res.data
      player.value = res.data
    } catch (e) {
      error.value = '載入玩家資料失敗'
    } finally {
      // 不管成功或失敗，loading 都要關掉
      loading.value = false
    }
  }

  function clearPlayer() {
    player.value = null
  }

  return { player, loading, error, fetchPlayer, clearPlayer }
})