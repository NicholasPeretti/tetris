import {
  Game,
  getNewGame,
  duplicateGame,
  isPieceMovableTo,
  Direction,
  moveActivePiece,
  insertNextPiece,
  rotateActivePiece,
  ShareableGameState,
  getSharableGameState,
} from './Game'

export type GameState = {
  game: ShareableGameState
  rows: number
  cols: number
  isGameOver: boolean
}

export default class GameController {
  private gameState: Game
  private rows: number
  private cols: number
  private gameOverFlag: boolean

  constructor(
    { rows, cols }: { rows: number; cols: number } = { rows: 24, cols: 10 }
  ) {
    this.rows = rows
    this.cols = cols
    this.reset()
  }

  reset(): GameState {
    this.gameOverFlag = false
    this.gameState = getNewGame(this.rows, this.cols)
    return this.getGameState()
  }

  isGameOver(): boolean {
    return this.gameOverFlag
  }

  /**
   * Moves the piece down if possible.
   * If not, it generates a new piece at the top of
   * the board
   */
  iterate(): GameState {
    if (this.isGameOver()) return this.getGameState()

    if (isPieceMovableTo(this.gameState, Direction.DOWN)) {
      this.gameState = moveActivePiece(this.gameState, Direction.DOWN)
    } else {
      this.gameState = insertNextPiece(this.gameState)

      //  Check for game over
      if (!isPieceMovableTo(this.gameState, Direction.DOWN)) {
        this.gameOverFlag = true
      }
    }
    return this.getGameState()
  }

  movePiece(direction: Direction): GameState {
    if (this.isGameOver()) return this.getGameState()

    this.gameState = moveActivePiece(this.gameState, direction)
    return this.getGameState()
  }

  rotatePiece(): GameState {
    if (this.isGameOver()) return this.getGameState()

    this.gameState = rotateActivePiece(this.gameState)
    return this.getGameState()
  }

  getGameState(): GameState {
    return {
      game: getSharableGameState(this.gameState),
      rows: this.rows,
      cols: this.cols,
      isGameOver: this.isGameOver(),
    }
  }
}
