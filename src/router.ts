import Vue from "vue"
import Router from "vue-router"
import Home from "@/views/Home.vue"
import Game from "@/views/Game.vue"
import Levels from "@/views/Levels.vue"

Vue.use(Router)

export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: "home",
      component: Home,
    },
    {
      path: "/game/:level",
      name: "game",
      component: Game,
      props: true,
    },
    {
      path: "/levels",
      name: "levels",
      component: Levels,
    },
  ],
})
