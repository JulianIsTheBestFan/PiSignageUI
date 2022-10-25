import Vue from 'vue'
import VueRouter from 'vue-router'
import PlayerMediaCP from '../views/PlayerMediaCP.vue'
import PlaylistManager from '../views/PlaylistManager.vue'
import AssetManager from '../views/AssetManager.vue'

Vue.use(VueRouter)

const routes = [

  {
    path: '/',
    name: 'players',
    component: PlayerMediaCP
  },
  {
    path: '/playlist-manager',
    name: 'playlistmanager',
    component: PlaylistManager
  },
  {
    path: '/upload',
    name: 'AssetManager',
    component: AssetManager
  },

]

const router = new VueRouter({
  mode: 'history',
  routes
})

export default router
