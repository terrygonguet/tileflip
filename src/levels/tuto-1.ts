import { LevelManager } from "@/plugins/levelManager"

export default function(manager: LevelManager) {
  manager.statsEnabled = false
  manager
    .insertNoStatsMessage("Swipe the squares according to their colors")
    .insertToast("Swipe Left!", 2)
    .insertTile("TileSquare", undefined, false, "left")
    .insertToast("Swipe Right!")
    .insertTile("TileSquare", undefined, false, "right")
    .insertToast("Swipe Up!")
    .insertTile("TileSquare", undefined, false, "up")
    .insertToast("Swipe Down!")
    .insertTile("TileSquare", undefined, false, "down")
    .insertNoStatsMessage("Swipe before they go away!")
  for (let i = 0; i < 15; i++) {
    manager.insertTile("TileSquare")
    if (i == 3) manager.insertNoStatsMessage()
  }
  manager.insertNextLevel("tuto-2")
}
