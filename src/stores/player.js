import { defineStore } from "pinia";
import { ref } from 'vue';

export const userPlayerStore = defineStore('player', () => {
    const player  = ref(null)

    function setPlayer(data){
        player.value = data
    }

    function clearPlayer(data){
        player.value = null
    }

    return { player, setPlayer, clearPlayer}

})