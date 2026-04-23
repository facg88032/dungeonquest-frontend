import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useDungeonStore = defineStore('dungeon', () =>{
    const dungeonRun = ref(null)

    function setDungeonRun(data){
        dungeonRun.value = data
    }

    function clear(){
        dungeonRun.value = null
    }


    return { dungeonRun, setDungeonRun, clear }
})