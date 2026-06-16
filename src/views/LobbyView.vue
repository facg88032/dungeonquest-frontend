<template>
  <div style="padding: 20px">
    <h1>🏛️ 冒險者大廳</h1>
    <!-- 載入中 -->
    <div v-if="playerStore.loading">載入中...</div>

    <!-- 錯誤 -->
    <div v-else-if="playerStore.error">{{ playerStore.error }}</div>

    <!-- 資料載入完成 -->
    <div v-else-if="playerStore.player">
      <el-card style="max-width: 400px; margin-bottom: 20px">
        <p>👤 玩家名稱：{{ playerStore.player.name }}</p>
        <p>💰 世界幣：{{ playerStore.player.worldCoin }}</p>
        <p>💎 強化石：{{ playerStore.player.reinforceStone }}</p>
      </el-card>

      <!-- 進行中地城提示 -->
      <el-card
        v-if="activeDungeon"
        style="max-width: 400px; margin-bottom: 20px; border: 2px solid #e6a23c"
      >
        <p>⚠️ 你有一場尚未完成的地城冒險！</p>
        <p>📍 目前樓層：{{ activeDungeon.currentFloor }}</p>
        <p>🗺️ 地圖主題：{{ activeDungeon.floorThemeName ?? "隨機" }}</p>
        <el-button type="warning" @click="continueDungeon">繼續冒險</el-button>
      </el-card>

      <el-button
        type="primary"
        style="margin-bottom: 20px"
        @click="goToDungeonSelect"
      >
        ⚔️ 前往地城
      </el-button>

      <!-- 英雄列表 -->
      <h2>⚔️ 英雄圖鑑</h2>
      <div style="display: flex; gap: 16px; flex-wrap: wrap">
        <el-card
          v-for="hero in heroDisplayList"
          :key="hero.id"
          style="width: 200px"
        >
          <!-- 已解鎖：顯示完整資料 -->
          <div v-if="hero.isUnlocked">
            <p>{{ hero.name }}</p>
            <p>職業：{{ hero.jobType }}</p>
            <p>技能：{{ hero.skillName }}</p>
            <p>{{ hero.skillDescription }}</p>
            <el-divider />
            <p>等級：{{ hero.heroData.level }}</p>
            <p>攻擊：{{ hero.heroData.totalAttack }}</p>
            <p>防禦：{{ hero.heroData.totalDefense }}</p>
            <p>血量：{{ hero.heroData.totalHp }}</p>
          </div>

          <!-- 未解鎖：只顯示職業名稱和鎖頭 -->
          <div v-else>
            <div style="opacity: 0.5; filter: grayscale(100%)">
              <p>🔒 {{ hero.name }}</p>
              <p>職業：{{ hero.jobType }}</p>
              <p style="color: #999">尚未解鎖</p>
            </div>
            <el-button
              size="small"
              type="primary"
              :loading="loadingTemplateId === hero.id"
              @click="handleUnlock(hero.id)"
            >
              解鎖
            </el-button>
          </div>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { usePlayerStore } from "../stores/player.js";
import { useHeroTemplateStore } from "../stores/heroTemplate.js";
import { useDungeonStore } from "../stores/dungeon.js";
import { useRouter } from "vue-router";
import { getCurrentDungeon } from "../api/dungeon.js";
import { unlockHero } from "../api/player.js";
import { ElMessage } from "element-plus";

const playerStore = usePlayerStore();
const templateStore = useHeroTemplateStore();
const dungeonStore = useDungeonStore();
const router = useRouter();

const activeDungeon = ref(null);
const loadingTemplateId = ref(null);

function goToDungeonSelect() {
  router.push({ name: "dungeonSelect" });
}

function continueDungeon() {
  dungeonStore.setDungeonRun(activeDungeon.value);
  router.push({ name: "dungeon" });
}

const heroDisplayList = computed(() => {
  const unlockedMap = new Map(playerStore.heroes.map((h) => [h.templateId, h]));

  return templateStore.templates.map((template) => ({
    ...template,
    isUnlocked: unlockedMap.has(template.id),
    heroData: unlockedMap.get(template.id) || null,
  }));
});

async function handleUnlock(templateId) {
  loadingTemplateId.value = templateId;
  try {
    const res = await unlockHero(playerStore.player.id, templateId);
    if (res.success) {
      playerStore.heroes.push(res.data);
      ElMessage.success("英雄解鎖成功！");
    }
  } catch (e) {
    const msg = e.response?.data?.message || "解鎖失敗";
    ElMessage.error(msg);
  } finally {
    loadingTemplateId.value = null;
  }
}

// 元件載入時自動呼叫 API
// 這裡先把 playerId 寫死，之後做登入功能再改
onMounted(async () => {
  await Promise.all([
    playerStore.fetchAll("019aac2c-296b-7d45-8432-a51e9d1750f3"),
    templateStore.fetchTemplates(),
  ]);

  if (!playerStore.player) return;

  try {
    const res = await getCurrentDungeon(playerStore.player.id);
    if (res.success && res.data) {
      activeDungeon.value = res.data;
    }
  } catch (e) {
    // 查無進行中地城或後端錯誤，不影響大廳顯示
    console.log(e);
  }
});
</script>
