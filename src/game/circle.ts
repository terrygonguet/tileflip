import Square, { SwipeEvent } from "./square"
import { Direction, colors } from "@/tools"
import { Circle } from "pixi.js"

export default class extends Square {
  constructor(direction: Direction) {
    super(direction)
  }

  draw() {
    let vmin = Math.min(innerHeight, innerWidth)
    let w = 0.27 * vmin
    this.beginFill(colors[this.direction]).drawCircle(0, 0, w / 2)
    this.hitArea = new Circle(0, 0, w / 1.8)
  }

  swipe(e: SwipeEvent) {
    e.inverseResult = true
    super.swipe(e)
  }
}
