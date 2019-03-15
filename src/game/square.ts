import { Graphics, interaction, Rectangle } from "pixi.js"
import { vec2, glMatrix } from "gl-matrix"
import {
  threshold,
  maxDuration,
  pixi2vec,
  vec2pixi,
  Direction,
  colors,
  speed,
} from "@/tools"

type InteractionEvent = interaction.InteractionEvent

type SwipeData = {
  position: vec2
  touch: vec2
  time: number
}

export type SwipeEvent = {
  target: Square
  velocity: vec2
  origin: vec2
  inverseResult?: boolean
}

export default class Square extends Graphics {
  isDragged = false
  swiped = false
  isSwipable = false
  isStopped = false
  startSwipe?: SwipeData
  velocity?: vec2
  direction: Direction
  stopPosition?: vec2

  constructor(direction: Direction) {
    super()
    this.direction = direction
    this.alpha = 0.5
    this.interactive = true
    this.position.set(innerWidth / 2, 0)
    this.draw()

    this.on("tick", this.tick, this)
    this.on("pointerdown", this.pointerDown, this)
    this.on("pointerup", this.pointerUp, this)
    this.on("pointerupoutside", this.pointerUp, this)
    this.on("pointermove", this.pointerMove, this)
    this.on("swipablechange", (value: boolean, stopPosition: vec2) => {
      this.isSwipable = value
      this.alpha = value || this.swiped ? 1 : 0.5
      this.stopPosition = stopPosition
    })
  }

  get isFalling(): boolean {
    return !this.swiped && !this.isDragged && !this.isStopped
  }

  get isOutOfView(): boolean {
    return (
      Math.abs(this.position.x - innerWidth / 2) > innerHeight ||
      Math.abs(this.position.y - innerHeight / 2) > innerHeight
    )
  }

  draw() {
    let vmin = Math.min(innerHeight, innerWidth)
    let w = 0.22 * vmin
    this.beginFill(colors[this.direction]).drawRect(-w / 2, -w / 2, w, w)
    w *= 1.2
    this.rotation = Math.PI / 4
    this.hitArea = new Rectangle(-w / 2, -w / 2, w, w)
  }

  tick(delta: number) {
    let distance = delta * speed
    let pos = pixi2vec(this.position)

    if (this.isStopped) {
      this.scale.set(this.scale.x - delta / 3)
    } else if (this.velocity) {
      vec2.scaleAndAdd(pos, pos, this.velocity, delta)
      this.position = vec2pixi(pos)
    } else if (this.stopPosition) {
      if (vec2.dist(pos, this.stopPosition) < distance) {
        // if close enough just snap to it
        this.position = vec2pixi(this.stopPosition)
        this.isStopped = true
      } else {
        // else chase stopPosition
        let direction = vec2.sub(vec2.create(), this.stopPosition, pos)
        vec2.normalize(direction, direction)
        vec2.scaleAndAdd(pos, pos, direction, distance)
        this.position = vec2pixi(pos)
      }
    } else if (this.isFalling) {
      this.position.y += distance
    }

    if (this.isOutOfView) {
      this.emit("outofview")
      return this.destroy()
    }
    if (this.scale.x < 0) {
      this.emit("timeout")
      return this.destroy()
    }
  }

  swipe(e: SwipeEvent) {
    this.swiped = true
    this.isStopped = false
    this.stopPosition = undefined
    this.velocity = e.velocity
    this.interactive = false
    this.emit("swipe", e)
  }

  pointerDown(e: InteractionEvent) {
    if (!this.isSwipable) return
    this.isDragged = true
    this.startSwipe = {
      position: pixi2vec(this.position),
      touch: pixi2vec(e.data.global),
      time: Date.now(),
    }
  }

  pointerUp(e: InteractionEvent) {
    if (!this.startSwipe) return
    let swipe = this.startSwipe
    let global = pixi2vec(e.data.global)
    let delta = vec2.sub(global, global, swipe.touch)
    let deltaTime = Date.now() - swipe.time

    this.startSwipe = undefined
    this.isDragged = false
    if (deltaTime > maxDuration) return

    if (vec2.len(delta) > threshold) {
      this.swipe({
        target: this,
        velocity: vec2.scale(delta, delta, 1000 / deltaTime), // in px/s,
        origin: swipe.touch,
      })
    }
  }

  pointerMove(e: InteractionEvent) {
    if (!this.startSwipe) return
    let swipe = this.startSwipe
    let global = pixi2vec(e.data.global)
    let delta = vec2.sub(global, global, swipe.touch)
    this.position = vec2pixi(
      vec2.scaleAndAdd(global, swipe.position, delta, 0.5)
    )
  }
}
