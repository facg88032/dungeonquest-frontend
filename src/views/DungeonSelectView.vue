<template>
  <div style="padding: 20px">
    <h1>⚔️ 地城選擇</h1>

    <!-- 遊戲模式 -->
    <el-card style="max-width: 500px; margin-bottom: 20px">
      <h3>遊戲模式</h3>
      <el-radio-group v-model="form.mode">
        <el-radio value="NORMAL">普通模式</el-radio>
        <el-radio value="CHALLENGER">挑戰者方式</el-radio>
      </el-radio-group>
    </el-card>

    <el-card style="max-width: 500px; margin-bottom: 20px">
      <h3>選擇英雄</h3>
      <el-select
        v-model="form.playerHeroId"
        placeholder="請選擇英雄"
        style="width: 100%"
      >
        <el-option
          v-for="hero in heroOptions"
          :key="hero.id"
          :label="hero.name"
          :value="hero.id"
        />
      </el-select>
    </el-card>

    <!-- 地圖主題（只有 NORMAL 模式才顯示） -->
    <el-card
      v-if="form.mode === 'NORMAL'"
      style="max-width: 500px; margin-bottom: 20px"
    >
      <h3>地城主題</h3>
      <el-select
        v-model="form.floorThemeId"
        placeholder="請選擇地圖主題"
        style="width: 100%"
      >
        <el-option
          v-for="theme in themes"
          :key="theme.id"
          :label="theme.name"
          :value="theme.id"
        />
      </el-select>
    </el-card>

    <!--出發按鈕-->
    <el-button
      type="primart"
      size="large"
      :loading="loading"
      @click="handleStart"
    >
      出發!
    </el-button>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from "vue";
import { usePlayerStore } from "../stores/player.js";
import { useHeroTemplateStore } from "../stores/heroTemplate.js";
import { getFloorThemes, startDungeon } from "../api/dungeon.js";
import { ElMessage } from "element-plus";
import { el, tr } from "element-plus/es/locale/index.mjs";
import { useDungeonStore } from "../stores/dungeon.js";
import { useRouter } from "vue-router";

const playerStore = usePlayerStore();
const templateStore = useHeroTemplateStore();
const dungeonStore = useDungeonStore();
const router = useRouter();

const themes = ref([]);
const loading = ref(false);

const form = ref({
  mode: "NORMAL",
  difficulty: "NORMAL",
  playerHeroId: "",
  floorThemeId: "",
});

// 切換到 CHALLENGER 時，強制將難度設為 HARD
watch(
  () => form.value.mode,
  (newMode) => {
    if (newMode === "CHALLENGER") {
      form.value.difficulty = "HARD";
    }
  },
);

// 將英雄清單與模板名稱結合，用於下拉選單
const heroOptions = computed(() => {
  const templateMap = new Map(templateStore.templates.map((t) => [t.id, t]));
  console.log("templateMap", templateMap);

  const a = playerStore.heroes.map((hero) => ({
    id: hero.id,
    name: templateMap.get(hero.templateId)?.name || "英雄",
  }));

  return a;
});

onMounted(async () => {
  const res = await getFloorThemes();
  themes.value = res.data;
});

onMounted(async () => {
  await Promise.all([
    playerStore.heroes.length === 0
      ? playerStore.fetchAll("019aac2c-296b-7d45-8432-a51e9d1750f3")
      : Promise.resolve(),
    templateStore.templates.length === 0
      ? templateStore.fetchTemplates()
      : Promise.resolve(),
    getFloorThemes().then((res) => {
      themes.value = res.data;
    }),
  ]);
});

async function handleStart() {
  if (!form.value.playerHeroId) {
    ElMessage.warning("請選擇英雄");
    return;
  }

  if (form.value.mode === "NORMAL" && !form.value.floorThemeId) {
    ElMessage.warning("普通模式請選擇地圖主題");
    return;
  }

  loading.value = true;
  try {
    const payload = {
      playerId: playerStore.player.id,
      playerHeroId: form.value.playerHeroId,
      mode: form.value.mode,
      difficulty: form.value.difficulty,
      floorThemeId:
        form.value.mode === "NORMAL" ? form.value.floorThemeId : undefined,
    };

    console.log("payload", payload);

    const res = await startDungeon(payload);
    if (res.success) {
      ElMessage.success("出發成功!");
      dungeonStore.setDungeonRun(res.data);
      router.push({ name: 'dungeon' })
      console.log("dungeon run data:", res.data);
      // E-09 再跳轉
    }
  } catch (e) {
    ElMessage.error("出發失敗");
  } finally {
    loading.value = false;
  }
}
</script>
