import Vue from "vue"
import App from "./App.vue"
import router from "./router"
import "./registerServiceWorker"
import InstallPrompt from "./plugins/installPrompt"
import DetectMobile from "./plugins/detectMobile"
import LevelManager from "./plugins/levelManager"

Vue.config.productionTip = false
Vue.use(InstallPrompt)
Vue.use(DetectMobile)
Vue.use(LevelManager)

new Vue({
  router,
  render: h => h(App),
}).$mount("#app")
