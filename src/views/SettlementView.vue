<template>
  <div style="padding: 20px">
    <h1>📜 地城結算</h1>

    <div v-if="loading">結算中...</div>

    <div v-else-if="result">
      <el-card style="max-width: 400px; margin-bottom: 20px">
        <h3>{{ statusLabel }}</h3>
        <p>🪙 獲得世界幣：{{ result.worldCoinGained }}</p>
        <p>💎 獲得強化石：{{ result.reinforceStoneGained }}</p>
        <p>🏅 地城幣總計：{{ result.totalEarnedCoin }}</p>
      </el-card>
      <el-button type="primary" @click="goToLobby">回大廳</el-button>
    </div>

    <div v-else-if="error">
      <p>{{ error }}</p>
      <el-button @click="goToLobby">回大廳</el-button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useDungeonStore } from "../stores/dungeon.js";
import { useRouter } from "vue-router";
import { settle } from "../api/dungeon.js";

const dungeonStore = useDungeonStore();
const router = useRouter();

const loading = ref(true);
const result = ref(null);
const error = ref(null);

const statusLabel = computed(() => {
  if (result.value?.status === "CLEARED") return "🎉 恭喜通關！";
  if (result.value?.status === "FAILED") return "💀 挑戰失敗";
  return "結算完成";
});

function goToLobby() {
  dungeonStore.clear();
  router.push({ name: "lobby" });
}

onMounted(async () => {
  const run = dungeonStore.dungeonRun;
  if (!run) {
    router.push({ name: "lobby" });
    return;
  }

  try {
    const res = await settle(run.id, run.playerId, run.status);
    if (res.success) {
      result.value = res.data;
    }
  } catch (e) {
    const msg = e.response?.data?.message || "結算失敗，請回大廳重試";
    error.value = msg;
  } finally {
    loading.value = false;
  }
});
</script>
