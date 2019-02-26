import { LevelManager } from "@/plugins/levelManager"

export default function(manager: LevelManager) {
  manager
    .insertToast("Swipe left!", 2)
    .insertTile("TileTriangle", undefined, false, "right")
    .insertToast("Swipe up!", 2)
    .insertTile("TileTriangle", undefined, false, "down")
    .insertToast("Swipe right!", 2)
    .insertTile("TileTriangle", undefined, false, "left")
    .insertToast("Swipe down!", 2)
    .insertTile("TileTriangle", undefined, false, "up")
  for (let i = 0; i < 20; i++) {
    manager.insertTile({
      TileSquare: 3,
      TileTapSquare: 1,
      TileCircle: 1,
      TileTriangle: 2,
    })
  }
  manager.insertNextLevel("tuto-5")
}
