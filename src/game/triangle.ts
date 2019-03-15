import Square, { SwipeEvent } from "./square"
import { Direction, colors } from "@/tools"
import { Circle } from "pixi.js"
import { vec2 } from "gl-matrix"

export default class Triangle extends Square {
  wind?: vec2

  constructor(direction: Direction) {
    super(direction)
  }

  draw() {
    let vmin = Math.min(innerHeight, innerWidth)
    let w = 0.27 * vmin
    this.beginFill(colors[this.direction]).drawStar(0, 0, 3, w / 1.5, w / 3)
    this.hitArea = new Circle(0, 0, w / 1.5)
  }

  swipe(e: SwipeEvent) {
    this.wind = vec2.negate(vec2.create(), e.velocity)
    let originalVelocity = vec2.scale(vec2.create(), e.velocity, 0.75)
    e.velocity = this.wind // point the event in the right dir
    super.swipe(e)
    this.velocity = originalVelocity
  }

  tick(delta: number) {
    if (this.velocity && this.wind) {
      vec2.scaleAndAdd(this.velocity, this.velocity, this.wind, delta * 1.5)
      this.rotation += delta * 1.4
    }
    super.tick(delta)
  }
}
