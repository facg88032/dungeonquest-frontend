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

       <el-button
        type="primary"
        style="margin-bottom: 20px;"
        @click="goToDungeonSelect">
        ⚔️ 前往地城
      </el-button>

      <!-- 英雄列表 -->
      <h2>⚔️ 英雄圖鑑</h2>
      <div style="display: flex; gap: 16px; flex-wrap: wrap">
        <el-card
          v-for="hero in heroDisplayList"
          :key="hero.id"
          style="width: 200px"
          :style="
            hero.isUnlocked ? {} : { opacity: '0.5', filter: 'grayscale(100%)' }
          "
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
            <p>🔒 {{ hero.name }}</p>
            <p>職業：{{ hero.jobType }}</p>
            <p style="color: #999">尚未解鎖</p>
          </div>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from "vue";
import { usePlayerStore } from "../stores/player.js";
import { useHeroTemplateStore } from "../stores/heroTemplate.js";
import { useRouter } from 'vue-router'

const playerStore = usePlayerStore();
const templateStore = useHeroTemplateStore();
console.log("templateStore",templateStore.templates)
const router = useRouter()

function goToDungeonSelect() {
  router.push({ name: 'dungeonSelect' })
}

const heroDisplayList = computed(() => {
  const unlockedMap = new Map(playerStore.heroes.map((h) => [h.templateId, h]));

  return templateStore.templates.map((template) => ({
    ...template,
    isUnlocked: unlockedMap.has(template.id),
    heroData: unlockedMap.get(template.id) || null,
  }));
});

// 元件載入時自動呼叫 API
// 這裡先把 playerId 寫死，之後做登入功能再改
onMounted(async () => {
  await Promise.all([
    playerStore.fetchAll("019aac2c-296b-7d45-8432-a51e9d1750f3"),
    templateStore.fetchTemplates()
  ]);

});
</script>
