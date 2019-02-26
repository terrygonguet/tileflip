import _Vue, { PluginObject } from "vue"

var installPrompt: any = null
window.addEventListener("beforeinstallprompt", e => {
  e.preventDefault()
  installPrompt = e
})

export default {
  install(Vue: typeof _Vue) {
    Vue.mixin({
      methods: {
        $getInstallPrompt() {
          let p = installPrompt
          installPrompt = null
          return p
        },
      },
    })
  },
} as PluginObject<never>
