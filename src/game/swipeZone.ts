import { Graphics, Circle, DisplayObject, Point, interaction } from "pixi.js"
import { colors, pixi2vec } from "@/tools"
import { vec2 } from "gl-matrix"
import { SwipeEvent } from "./square"
import { glMatrix } from "gl-matrix"

export default class extends Graphics {
  radius = 0
  objectsInside: DisplayObject[] = []
  thickness = 15
  directions: {
    [name: string]: { start: number; end: number }
  } = {
    up: { start: Math.PI, end: 1.5 * Math.PI },
    right: { start: 1.5 * Math.PI, end: 0 },
    down: { start: 0, end: 0.5 * Math.PI },
    left: { start: 0.5 * Math.PI, end: Math.PI },
  }
  controlpoints: {
    [name: string]: { start: vec2; end: vec2 }
  } = {}

  constructor() {
    super()
    this.resize()

    window.addEventListener("resize", this.resize.bind(this))
  }

  resize() {
    this.radius = innerWidth / 2.8
    this.position.set(innerWidth / 2, innerHeight - this.radius - 30)
    this.draw()
  }

  draw() {
    this.calculateControlPoints()
    this.clear()

    for (const direction in this.directions) {
      let data = this.directions[direction]
      this.lineStyle(this.thickness, colors[direction])
      this.arc(0, 0, this.radius, data.start, data.end)
    }

    this.hitArea = new Circle(0, 0, this.radius)
  }

  calculateControlPoints() {
    let zero = vec2.fromValues(this.radius, 0)
    let origin = vec2.create()
    this.controlpoints = {}
    for (const direction in this.directions) {
      const data = this.directions[direction]
      this.controlpoints[direction] = {
        start: vec2.rotate(vec2.create(), zero, origin, data.start),
        end: vec2.rotate(vec2.create(), zero, origin, data.end),
      }
    }
  }

  updateIntersection(obj: DisplayObject) {
    let i = this.objectsInside.indexOf(obj)
    if (i !== -1) return

    let pos = this.toLocal(new Point(), obj)
    if (this.hitArea.contains(pos.x, pos.y)) {
      this.objectsInside.push(obj)
      obj.emit("swipablechange", true, pixi2vec(this.position))
      // ewww but I can't detect destruction reliably...
      setTimeout(() => {
        let i = this.objectsInside.indexOf(obj)
        this.objectsInside.splice(i, 1)
      }, 5000)
    }
  }

  isSwipeCorrect(swipe: SwipeEvent): boolean {
    let ctrlpts = this.controlpoints[swipe.target.direction]
    let sum =
      vec2.angle(swipe.velocity, ctrlpts.start) +
      vec2.angle(swipe.velocity, ctrlpts.end)
    let correct = sum - Math.PI / 2 < glMatrix.EPSILON
    return swipe.inverseResult ? !correct : correct
  }
}
