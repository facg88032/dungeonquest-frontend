import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getAllHeroTemplates } from '../api/heroTemplate'

export const useHeroTemplateStore = defineStore('heroTemplate',  () => {

    const templates =  ref([])
    const loading = ref(false)
    const error = ref(null)

    async function fetchTemplates() {
        loading.value = true
        error.value = null

        try{
            const res = await getAllHeroTemplates()
            templates.value = res.data
        }catch(e){
            error.value = '載入英雄模板失敗'
        }finally{
            loading.value = true
        }
        
    }

    return { templates, loading, error, fetchTemplates }
})