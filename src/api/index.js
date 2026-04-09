import axios from 'axios'

// 建立一個 axios 實例，所有請求都共用這個設定
const api = axios.create({
    baseURL:'http://localhost:8080',
    timeout: 1000000,
    headers: {
        'Content-Type':'application/json'
    }
})

// 回應攔截器（Interceptor）
// 每一個 API 回應都會先經過這裡，統一處理錯誤
api.interceptors.response.use(
    (response) => {
         // 成功：直接把 response.data 回傳（省去每次都要 .data 的麻煩）
         return response.data
    },
    (error) => {
        // 失敗：印出錯誤，讓呼叫的地方自己決定怎麼處理
        console.error('API Error:', error.response?.data?.message || error.message)
        return Promise.reject(error)
    }
)

export default api