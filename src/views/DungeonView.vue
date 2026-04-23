<template>
  <div style="padding: 20px">
    <h1>⚔️ 地城進行中</h1>

    <div v-if="!run">
      <p>沒有進行中的地城，請先從大廳出發。</p>
    </div>

    <div v-else>
      <!-- 地城資訊 -->
      <el-card style="max-width: 500px; margin-bottom: 20px">
        <h3>地城資訊</h3>
        <p>🗺️ 地圖主題： {{ run.floorThemeName ?? "隨機" }}</p>
        <p>🏠 目前樓層：{{ run.currentFloor }}</p>
        <p>⚔️ 模式：{{ modeLabel }}</p>
        <p>💀 難度：{{ difficultyLabel }}</p>
        <p>🪙 地城幣：{{ run.dungeonCoin }}</p>
      </el-card>

      <!-- 英雄狀態 -->
      <el-card style="max-width: 500px; margin-bottom: 20px">
        <h3>英雄狀態</h3>
        <p>⭐ 等級：{{ run.heroLevel }}</p>
        <el-progress
          :percentage="hpPercentage"
          :color="hpColor"
          style="margin-bottom: 8px"
        />
        <p>❤️ 血量：{{ run.currentHp }} / {{ run.maxHp }}</p>
        <p>🗡️ 攻擊：{{ run.currentAttack }}</p>
        <p>🛡️ 防禦：{{ run.currentDefense }}</p>
      </el-card>

      <!-- 當前事件 -->
      <el-card style="max-width: 500px; margin-bottom: 20px">
        <h3>當前事件</h3>
        <el-tag :type="eventTagType" size="large">{{ eventLabel }}</el-tag>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useDungeonStore } from "../stores/dungeon.js";

const dungeonStore = useDungeonStore();
const run = computed(() => dungeonStore.dungeonRun);

const modeLabel = computed(() =>
  run.value?.mode === "CHALLENGER" ? "挑戰者" : "普通",
);

const difficultyLabel = computed(() => {
  const map = { EASY: "簡單", NORMAL: "普通", HARD: "困難" };
  return map[run.value?.difficulty] ?? "";
});

const hpPercentage = computed(() => {
  if (!run.value) return 0;
  return Math.round((run.value.currentHp / run.value.maxHp) * 100);
});

const hpColor = computed(() => {
  if (hpPercentage.value > 50) return "#67c23a";
  if (hpPercentage.value > 25) return "#e6a23c";
  return "#f56c6c";
});

const eventLabel = computed(() => {
  const map = {
    NONE: "平靜",
    BATTLE: "⚔️ 戰鬥",
    TREASURE: "💎 寶箱",
    ANGEL: "😇 天使",
    MERCHANT: "🛒 商人",
    ELITE: "💀 精英怪",
    BOSS: "👹 首領",
  };
  return map[run.value?.currentEvent] ?? "未知";
});

const eventTagType = computed(() => {
  const map = {
    NONE: "info",
    BATTLE: "danger",
    TREASURE: "success",
    ANGEL: "",
    MERCHANT: "warning",
    ELITE: "danger",
    BOSS: "danger",
  };
  return map[run.value?.currentEvent] ?? "info";
});
</script>
