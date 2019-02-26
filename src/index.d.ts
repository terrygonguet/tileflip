import Vue from "vue"
import { LevelManager } from "./plugins/levelManager"

declare module "vue/types/vue" {
  interface Vue {
    getInstallPrompt(): any
    isMobile: boolean
    levelManager: LevelManager
  }
}
