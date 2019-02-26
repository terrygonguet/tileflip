import { LevelManager } from "@/plugins/levelManager"

export default function(manager: LevelManager) {
  manager
    .insertToast("Anywhere but up!", 2)
    .insertTile("TileCircle", undefined, false, "up")
    .insertToast("Anywhere but left!", 2)
    .insertTile("TileCircle", undefined, false, "left")
  for (let i = 0; i < 20; i++) {
    manager.insertTile({ TileSquare: 4, TileTapSquare: 1, TileCircle: 2 })
  }
  manager.insertNextLevel("tuto-4")
}
