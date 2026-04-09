import api from './index.js'

// 根據 ID 查詢單一玩家
export function getPlayer(playerId){
    return api.get(`/players/${playerId}`)
}

// 查詢玩家所有英雄
export function getHeroesByPlayerId(playerId) {
  return api.get(`/players/${playerId}/heroes`)
}