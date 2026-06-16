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

        <!-- TREASURE 事件 -->
        <div v-if="run.currentEvent === 'TREASURE'" style="margin-top: 16px">
          <el-button
            type="warning"
            :loading="actionLoading"
            @click="handlOpenTreasure"
          >
            💎 開寶箱
          </el-button>
        </div>

        <!-- TREASURE 事件 -->
        <div v-if="run.currentEvent === 'ANGEL'" style="margin-top: 16px">
          <el-button
            type="primary"
            :loading="actionLoading"
            @click="handleAcceptAngel"
          >
            😇 接受天使祝福
          </el-button>
        </div>

        <!-- BOSS 事件 -->
        <div v-if="run.currentEvent === 'BOSS'" style="margin-top: 16px">
          <el-button
            type="danger"
            :loading="actionLoading"
            @click="handleFightBoss"
          >
            👹 挑戰 BOSS
          </el-button>
        </div>

        <!-- TREASURE 事件 -->
        <div v-if="run.currentEvent === 'NONE'" style="margin-top: 16px">
          <el-button
            type="success"
            :loading="actionLoading"
            @click="handleNextFloor"
          >
            ➡️ 前往下一層
          </el-button>
        </div>
      </el-card>

      <!-- 事件結果訊息 -->
      <el-card
        v-if="resultMessage"
        style="max-width: 500px; margin-bottom: 20px"
      >
        <p>{{ resultMessage }}</p>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useDungeonStore } from "../stores/dungeon.js";
import {
  openTreasure,
  acceptAngel,
  nextFloor,
  fightBoss,
} from "../api/dungeon.js";
import { ElMessage } from "element-plus";
import { useRouter } from "vue-router";

const dungeonStore = useDungeonStore();
const router = useRouter();

const run = computed(() => dungeonStore.dungeonRun);

const actionLoading = ref(false);
const resultMessage = ref("");

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

onMounted(() => {
  if (!dungeonStore.dungeonRun) {
    router.push({ name: "lobby" });
  }
});

async function handlOpenTreasure() {
  actionLoading.value = true;
  try {
    const res = await openTreasure(run.value.id, run.value.playerId);
    if (res.success) {
      // 更新 store 裡的地城幣和事件狀態
      dungeonStore.dungeonRun.dungeonCoin += res.data.addDungeonCoin;
      dungeonStore.dungeonRun.currentEvent = "NONE";
      resultMessage.value = `${res.data.message}（獲得 ${res.data.addDungeonCoin} 地城幣）`;
      ElMessage.success("開寶箱成功！");
    }
  } catch (e) {
    console.log(e);
    ElMessage.error("開寶箱失敗");
  } finally {
    actionLoading.value = false;
  }
}

async function handleAcceptAngel() {
  actionLoading.value = true;
  try {
    const res = await acceptAngel(run.value.id, run.value.playerId);
    if (res.success) {
      // 更新 store 裡的地城幣和事件狀態
      dungeonStore.dungeonRun.currentHp = res.data.hpAfter;
      dungeonStore.dungeonRun.currentEvent = "NONE";
      resultMessage.value = `${res.data.message}（恢復 ${res.data.hpAfter - res.data.hpBefore} 血量）`;
      ElMessage.success("天使祝福");
    }
  } catch (e) {
    const msg = e.response?.data?.message || "接受祝福失敗";
    ElMessage.error(msg);
  } finally {
    actionLoading.value = false;
  }
}

async function handleNextFloor() {
  actionLoading.value = true;
  resultMessage.value = "";
  try {
    const res = await nextFloor(run.value.id, run.value.playerId);
    if (res.success) {
      // 更新 store 裡的地城幣和事件狀態
      dungeonStore.setDungeonRun(res.data);
      ElMessage.success(`進入第 ${res.data.currentFloor} 層！`);
    }
  } catch (e) {
    console.log(e);
    const msg = e.response?.data?.message || "前往下一層失敗";
    ElMessage.error(msg);
  } finally {
    actionLoading.value = false;
  }
}


async function handleFightBoss(){
  actionLoading.value = true
  resultMessage.value = ''
  try{
    const res = await fightBoss(run.value.id, run.value.playerId)
    console.log(res)
    if(res.success){
      resultMessage.value = res.data.message
      dungeonStore.dungeonRun.status = res.data.runStatus

      if(res.data.runStatus === 'CLEARED' || res.data.runStatus === 'FAILED'){
        router.push({ name: 'settlement'})
      }else {
         // 挑戰者模式：打贏但繼續
        dungeonStore.dungeonRun.currentEvent = 'NONE'
        ElMessage.success(res.data.message)
      }
    }
  }catch (e) {
    console.log(e)
    const msg = e.response?.data?.message || 'BOSS 挑戰失敗'
    ElMessage.error(msg)
  } finally {
    actionLoading.value = false
  }


}

</script>
