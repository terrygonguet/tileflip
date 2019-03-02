import { LevelManager } from "@/plugins/levelManager"

export default function(manager: LevelManager) {
  manager.statsEnabled = false
  manager
    .insertNoStatsMessage("Swipe circles anywhere but their color")
    .insertToast("Anywhere but up!", 2)
    .insertTile("TileCircle", undefined, false, "up")
    .insertToast("Anywhere but left!", 2)
    .insertTile("TileCircle", undefined, false, "left")
    .insertToast("Anywhere but right!", 2)
    .insertTile("TileCircle", undefined, false, "right")
    .insertToast("Anywhere but down!", 2)
    .insertTile("TileCircle", undefined, false, "down")
    .insertNoStatsMessage()
  for (let i = 0; i < 15; i++) {
    manager.insertTile({ TileSquare: 4, TileTapSquare: 1, TileCircle: 2 })
  }
  manager.insertNextLevel("tuto-4")
}
