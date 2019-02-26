import Vue from "vue"
import App from "./App.vue"
import router from "./router"
import "./registerServiceWorker"
import InstallPrompt from "./plugins/installPrompt"
import detectMobile from "./plugins/detectMobile"

Vue.config.productionTip = false
Vue.use(InstallPrompt)
Vue.use(detectMobile)

new Vue({
  router,
  render: h => h(App),
}).$mount("#app")
