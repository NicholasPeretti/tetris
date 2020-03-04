import { useState, useEffect } from 'preact/hooks'
import { GameState } from '../../game'
import { Direction } from '../../game/Game'

export { Direction } from '../../game/Game'

type GameStateProxyUpdateCallback = (gameState: GameState) => void
type GameStateProxyUpdateUnsubscribe = () => void

interface GameStateProxyInterface {
  getGameState: () => GameState
  setGameState: (gameState: GameState) => void
  onGameStateUpdate: (
    cb: GameStateProxyUpdateCallback
  ) => GameStateProxyUpdateUnsubscribe
}

class GameStateProxy implements GameStateProxyInterface {
  private gameState: GameState | null = null
  private subscribers: Array<GameStateProxyUpdateCallback> = []

  getGameState() {
    //  Return a copy of the game state
    return this.gameState
      ? {
          ...this.gameState,
          game: {
            ...this.gameState.game,
            board: this.gameState.game.board.map(row => [...row]),
          },
        }
      : null
  }
  setGameState(gameState) {
    this.gameState = gameState

    //  Trigger all the subscribers in parallel
    Promise.all(
      this.subscribers.map(
        subscriber =>
          new Promise(resolve => {
            subscriber(this.getGameState())
            resolve()
          })
      )
    )
  }
  onGameStateUpdate(cb) {
    this.subscribers.push(cb)

    //  Unsubscribe function
    return () => {
      this.subscribers = this.subscribers.filter(el => el !== cb)
    }
  }
}

const gameStateProxy = new GameStateProxy()

export default function useGameController() {
  const [gameState, setGameState] = useState<GameState | null>(
    gameStateProxy.getGameState()
  )
  useEffect(() => {
    ;(async () => {
      gameStateProxy.setGameState(await window.gameController.getGameState())
    })()
  }, [])
  gameStateProxy.onGameStateUpdate(updatedGameState => {
    setGameState(updatedGameState)
  })

  const { movePiece, rotatePiece, reset, iterate } = window.gameController

  return {
    gameState,
    async movePiece(direction: Direction) {
      gameStateProxy.setGameState(await movePiece(direction))
    },
    async rotatePiece() {
      gameStateProxy.setGameState(await rotatePiece())
    },
    async reset() {
      gameStateProxy.setGameState(await reset())
    },
    async iterate() {
      gameStateProxy.setGameState(await iterate())
    },
  }
}
