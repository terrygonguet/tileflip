import Vue from "vue"

declare module "vue/types/vue" {
  interface Vue {
    $getInstallPrompt(): any
    $isMobile: boolean
  }
}
