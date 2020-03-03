import {
  Game,
  getNewGame,
  isPieceMovableTo,
  Direction,
  moveActivePiece,
  insertNextPiece,
  duplicateGame,
  rotateActivePiece,
} from './Game'

export type SubscribeFunction = (game: Game, isGameOver: boolean) => void

export default class GameController {
  private intervalRef?: NodeJS.Timeout
  private gameState: Game
  private gameSpeed: number
  private gameOverFlag: boolean

  private subscribers: Array<SubscribeFunction>

  constructor(options: { rows?: number; cols?: number } = {}) {
    const { rows = 16, cols = 10 } = options

    this.intervalRef = null
    this.gameState = getNewGame(rows, cols)
    this.gameOverFlag = false
    this.subscribers = []
    this.gameSpeed = 1000
  }

  private iteration(): void {
    if (isPieceMovableTo(this.gameState, Direction.DOWN)) {
      this.gameState = moveActivePiece(this.gameState, Direction.DOWN)
    } else {
      this.gameState = insertNextPiece(this.gameState)

      //  Check for game over
      if (!isPieceMovableTo(this.gameState, Direction.DOWN)) {
        this.gameOverFlag = true
        this.stop()
      }
    }

    this.triggerSubscribers()
  }

  private triggerSubscribers(): void {
    this.subscribers.forEach(subscribedFn => {
      return subscribedFn(duplicateGame(this.gameState), this.gameOverFlag)
    })
  }

  start(): void {
    this.stop()
    this.intervalRef = setInterval(() => {
      this.iteration()
    }, this.gameSpeed)
  }

  stop(): void {
    clearInterval(this.intervalRef)
  }

  onStateUpdate(callback: SubscribeFunction): void {
    this.subscribers.push(callback)
  }

  moveActievePiece(direction: Direction): void {
    this.gameState = moveActivePiece(this.gameState, direction)
    this.triggerSubscribers()
  }

  rotateActivePiece(): void {
    this.gameState = rotateActivePiece(this.gameState)
    this.triggerSubscribers()
  }
}
