import { LevelManager } from "@/plugins/levelManager"

export default function(manager: LevelManager) {
  manager
    .insertToast("Rotate to align colors then tap", 2, 1)
    .insertTile("TileLosange", undefined, false)
    .insertTile("TileLosange", undefined, false)
  for (let i = 0; i < 40; i++) {
    manager.insertTile({
      TileSquare: 2,
      TileTapSquare: 1,
      TileCircle: 1,
      TileTriangle: 1,
      TileLosange: 2,
    })
    if (i > 0 && i % 10 == 0) manager.speedUp()
  }
  manager.insertGameOver()
}
