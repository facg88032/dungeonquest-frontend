import api from "./index.js";

// 取得所有地圖主題（用於下拉選單）
export function getFloorThemes() {
  return api.get("/floor-theme");
}

// 開始地城冒險
// payload 是一個物件，包含 playerId、heroId、difficulty、gameMode、themeId
export function startDungeon(payload) {
  return api.post("/dungeon/start", payload);
}

export function openTreasure(runId, playerId) {
  return api.post(`/dungeon/event/${runId}/treasure/open`, null, {
    params: { playerId },
  });
}

export function getCurrentDungeon(playerId) {
  return api.get("/dungeon/current", {
    params: { playerId },
  });
}

export function acceptAngel(runId, playerId) {
  return api.post(`/dungeon/event/${runId}/angel/accept`, null, {
    params: { playerId },
  });
}

export function fightBoss(runId, playerId) {
  return api.post(`/dungeon/event/${runId}/boss/fight`, null, {
    params: { playerId }
  })
}

export function nextFloor(runId, playerId) {
  return api.post(`/dungeon/${runId}/next-floor`, null, {
    params: { playerId },
  });
}

export function settle(runId, playerId, status) {
  return api.post(`/dungeon-settle/${runId}/settle`, null, {
    params: { playerId, status }
  })
}
