import { LevelManager } from "@/plugins/levelManager"

export default function(manager: LevelManager) {
  manager
    .insertToast("Swipe Left!", 2)
    .insertTile("TileSquare", undefined, false, "left")
    .insertToast("Swipe Right!")
    .insertTile("TileSquare", undefined, false, "right")
    .insertToast("Swipe Up!")
    .insertTile("TileSquare", undefined, false, "up")
    .insertToast("Swipe Down!")
    .insertTile("TileSquare", undefined, false, "down")
    .insertToast("Swipe before they go!")
  for (let i = 0; i < 30; i++) {
    manager.insertTile("TileSquare")
  }
  manager.insertNextLevel("tuto-2")
}
