import Vue from "vue"
import App from "./App.vue"
import router from "./router"
import "./registerServiceWorker"

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App),
}).$mount("#app")

declare var installPrompt: any
window.addEventListener("beforeinstallprompt", e => {
  e.preventDefault()
  installPrompt = e
})
