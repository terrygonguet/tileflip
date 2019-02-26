import { LevelManager } from "@/plugins/levelManager"

export default function(manager: LevelManager) {
  manager
    .insertToast("Tap first!", 2)
    .insertTile("TileTapSquare", undefined, false)
  for (let i = 0; i < 20; i++) {
    manager.insertTile({ TileSquare: 5, TileTapSquare: 2 })
  }
  manager.insertNextLevel("tuto-3")
}
