import api from './index.js'

// 取得所有地圖主題（用於下拉選單）
export function getFloorThemes() {
  return api.get('/floor-theme')
}

// 開始地城冒險
// payload 是一個物件，包含 playerId、heroId、difficulty、gameMode、themeId
export function startDungeon(payload) {
  return api.post('/dungeon/start', payload)
}