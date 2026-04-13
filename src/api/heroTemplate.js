import api from './index.js'

export function getAllHeroTemplates(){
    return api.get('/hero-template')
}