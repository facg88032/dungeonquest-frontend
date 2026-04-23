---
name: dungeonquest-frontend
description: DungeonQuest RPG 前端專案背景與開發規範
---

# DungeonQuest 前端

## 專案定位
DungeonQuest RPG 遊戲前端，與後端（localhost:8080）分離部署。
前端新手學習專案，目標是理解 Vue 3 開發流程。

## 技術棧
- Vue 3（Composition API + `<script setup>`）
- Vite
- Vue Router 4
- Pinia
- Axios
- Element Plus
- JavaScript（非 TypeScript）

## 檔案結構規範
- src/
- api/        → 每個資源一個檔案（player.js、heroTemplate.js）
- stores/     → Pinia store，每個資源一個檔案
- views/      → 頁面元件，命名：XxxView.vue
- router/     → 路由設定，集中在 index.js

## API 規範
- 後端 baseURL：http://localhost:8080
- 回傳格式：{ success, message, data }
- 資料取用：res.data（攔截器已取出 HTTP body，再取 .data 才是實際資料）
- api-docs.json 是後端目前所有的API

## 遊戲核心流程
大廳（英雄管理）→ 地城選擇 → 地城進行（隨機事件）→ 結算 → 回大廳

## 事件類型
NONE / BATTLE / TREASURE / ANGEL / MERCHANT / ELITE / BOSS

## 難度
EASY / NORMAL / HARD

## 遊戲模式
- NORMAL：固定 10 層，開局選地圖主題
- CHALLENGER：無限層，每層隨機主題，固定 HARD

## 開發規範
- 命名用駝峰（camelCase）
- CSS class 用連字號（kebab-case）
- 每次給完整檔案內容，不給片段
- 一次只改一個檔案

## 學習導向原則
- 提供程式碼，由使用者手寫
- 每段程式碼都要解釋為什麼這樣寫
- 遇到新概念先解釋再給程式碼
- 不跳過任何步驟
- 開放所有閱讀權限
- 禁止所有寫入權限



## Phase E 任務清單

### 已完成
- E-00：環境建置（VS Code、Node.js、Git）
- E-01：Vite 建立 Vue 3 專案
- E-02：Vue Router 安裝與路由設定
- E-03：Pinia 安裝與 playerStore 建立
- E-04：Element Plus 安裝
- E-05：Axios 安裝與 API 基底封裝
- E-06：玩家大廳頁面，串接 GET /players/{id}
- E-07：英雄圖鑑，已解鎖/未解鎖狀態顯示

### 進行中
- E-08：地城選擇頁面（難度、地圖主題、串接 POST /dungeon/start）

### 待完成
- E-09：跳轉到地城進行頁面
- E-10：地城進行頁面，顯示樓層、血量、當前事件
- E-11：TREASURE 事件串接
- E-12：ANGEL 事件串接
- E-13：下一層按鈕串接
- E-14：結算頁面
- E-15：整合測試

## 當前任務
E-08：建立地城選擇頁面
- 難度選擇：EASY / NORMAL / HARD
- 地圖主題下拉選單：串接 GET /floor-theme
- CHALLENGER 模式不需要選地圖主題
- 按下「出發」呼叫 POST /dungeon/start
- 成功後跳轉到