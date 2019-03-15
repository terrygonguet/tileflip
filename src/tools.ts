import { vec2 } from "gl-matrix"
import { Point } from "pixi.js"

export type Direction = "up" | "down" | "left" | "right"

export type Tile = {
  type: "Tile"
  tileName: string
  startTime: number
  doesTick?: boolean
  direction?: Direction
}

export type Toast = {
  type: "Toast"
  message: string
  duration?: number
  size?: number
}

export type NextLevel = {
  type: "NextLevel"
  name: string
  resetStats?: boolean
}

export type GameOver = {
  type: "GameOver"
}

export type NoStatsMessage = {
  type: "NoStatsMessage"
  message: string
}

export type Action = Tile | Toast | NextLevel | GameOver | NoStatsMessage

export type SwipeEvent = {
  time: number
  startTime: number
  momentum: vec2
  direction: Direction
  correct: boolean
}

export type ScoreEvent = {
  n: number
  startTime: number
  time: number
}

export type ToastEvent = {
  message: string
  duration?: number
  size?: number
}

export let threshold = 50
export let maxDuration = 300
export let speed = 285

export function isBlockingType(type: string) {
  return type === "GameOver" || type === "Tile"
}

export function randomDirection(): Direction {
  return (["up", "down", "left", "right"] as Direction[])[
    Math.floor(Math.random() * 4)
  ]
}

export const colors: {
  [name: string]: number
} = {
  up: 0x00ffff,
  down: 0xff00ff,
  left: 0xffff00,
  right: 0x77ff77,
  locked: 0x888888,
}

export type Weights = { [type: string]: number }
export function randomWeighted(weights: Weights): string {
  let bag: string[] = []
  for (const type in weights) {
    let weight = weights[type]
    // add 'papers' to the bag
    bag.push(...new Array(weight).fill(type))
  }
  return bag[Math.floor(Math.random() * bag.length)]
}

export function oppositeDirection(dir: Direction): Direction {
  switch (dir) {
    case "up":
      return "down"
    case "down":
      return "up"
    case "left":
      return "right"
    case "right":
      return "left"
  }
}

export function getSwipeDirection(swipe: vec2): Direction {
  const absX = Math.abs(swipe[0])
  const absY = Math.abs(swipe[1])
  if (absX > absY) {
    return swipe[0] > 0 ? "right" : "left"
  } else {
    return swipe[1] > 0 ? "down" : "up"
  }
}

export function pixi2vec(point: Point): vec2 {
  return vec2.fromValues(point.x, point.y)
}

export function vec2pixi(point: vec2): Point {
  return new Point(point[0], point[1])
}
