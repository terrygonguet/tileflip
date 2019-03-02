import { vec2 } from "gl-matrix"

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
export let speed = 750

export function isBlockingType(type: string) {
  return type === "GameOver" || type === "Tile"
}

export function randomDirection(): Direction {
  return (["up", "down", "left", "right"] as Direction[])[
    Math.floor(Math.random() * 4)
  ]
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
