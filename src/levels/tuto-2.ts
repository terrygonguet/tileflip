import { LevelManager } from "@/plugins/levelManager"

export default function(manager: LevelManager) {
  manager
    .insertToast("Tap first!", 2)
    .insertTile("TileTapSquare", undefined, false)
  for (let i = 0; i < 30; i++) {
    manager.insertTile({ TileSquare: 5, TileTapSquare: 2 })
  }
  manager.insertGameOver()
}
