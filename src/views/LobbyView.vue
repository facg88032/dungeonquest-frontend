<template>
  <div style="padding: 20px">
    <h1>🏛️ 冒險者大廳</h1>
    <!-- 載入中 -->
    <div v-if="playerStore.loading">載入中...</div>

    <!-- 錯誤 -->
    <div v-else-if="playerStore.error">{{ playerStore.error }}</div>

    <!-- 資料載入完成 -->
    <div v-else-if="playerStore.player">
      <el-card style="max-width: 400px; margin-bottom: 20px;">
        <p>👤 玩家名稱：{{ playerStore.player.name }}</p>
        <p>💰 世界幣：{{ playerStore.player.worldCoin }}</p>
        <p>💎 強化石：{{ playerStore.player.reinforceStone }}</p>
      </el-card>

      <!-- 英雄列表 -->
      <h2>⚔️ 我的英雄</h2>
      <div style="display: flex; gap: 16px; flex-wrap: wrap">
        <el-card
          v-for="hero in playerStore.heroes"
          :key="hero.id"
          style="width: 200px"
        >
          <p>{{ hero.templateName }}</p>
          <p>職業：{{ hero.jobType }}</p>
          <p>等級：{{ hero.level }}</p>
          <p>攻擊：{{ hero.totalAttack }}</p>
          <p>防禦：{{ hero.totalDefense }}</p>
          <p>血量：{{ hero.totalHp }}</p>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import { usePlayerStore } from "../stores/player.js";
import { pl } from "element-plus/es/locale/index.mjs";

const playerStore = usePlayerStore();

// 元件載入時自動呼叫 API
// 這裡先把 playerId 寫死，之後做登入功能再改
onMounted(() => {
  playerStore.fetchAll("647c3377-9c00-1d7e-819c-000dc7d50000");
});
</script>
