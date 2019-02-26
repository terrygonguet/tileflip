import { LevelManager } from "@/plugins/levelManager"
import { randomWeighted } from "@/tools"

const weights = {
  TileSquare: 3,
  TileTapSquare: 1,
  TileCircle: 1,
  TileTriangle: 1,
  TileLosange: 1,
}

export default function(manager: LevelManager) {
  manager.setMode("function", () => {
    if (manager.i % 10 == 0 && manager.i != 0) {
      manager.speed++
      return {
        type: "Toast",
        message: "SPEED UP",
      }
    } else {
      return {
        type: "Tile",
        tileName: randomWeighted(weights),
        startTime: manager.startTime,
      }
    }
  })
}
