<template>
   <div style="padding: 20px;">
    <h1>🏛️ 冒險者大廳</h1>
    <!-- 載入中 --> 
    <div v-if="playerStore.loading">載入中...</div>

    <!-- 錯誤 -->
    <div v-else-if="playerStore.error">{{ playerStore.error }}</div>

    <!-- 資料載入完成 -->
    <div v-else-if="playerStore.player">
      <el-card style="max-width: 400px;">
        <p>👤 玩家名稱：{{ playerStore.player.name }}</p>
        <p>💰 世界幣：{{ playerStore.player.worldCoin }}</p>
        <p>💎 強化石：{{ playerStore.player.reinforceStone }}</p>
      </el-card>
    </div>

  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { usePlayerStore } from '../stores/player.js'

const playerStore = usePlayerStore()

// 元件載入時自動呼叫 API
// 這裡先把 playerId 寫死，之後做登入功能再改
onMounted(() => {
  playerStore.fetchPlayer('647c3377-9c00-1d7e-819c-000dc7d50000')
})

</script>