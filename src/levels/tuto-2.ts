import { LevelManager } from "@/plugins/levelManager"

export default function(manager: LevelManager) {
  manager.statsEnabled = false
  manager
    .insertNoStatsMessage("Tap grey squares once to reveal the color")
    .insertToast("Tap first!", 2)
    .insertTile("TileTapSquare", undefined, false)
    .insertNoStatsMessage()
  for (let i = 0; i < 15; i++) {
    manager.insertTile({ TileSquare: 5, TileTapSquare: 2 })
  }
  manager.insertNextLevel("tuto-3")
}
