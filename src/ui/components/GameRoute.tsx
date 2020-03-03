import { h } from 'preact'
import { useEffect } from 'preact/hooks'
import useGameController, { Direction } from '../hooks/useGameController'
import TetrisCanvas from './TetrisCanvas'
import GameOverBanner from './GameOverBanner'
import { route } from 'preact-router'

export type Props = {
  path: string
}

const INITIAL_GAME_VELOCITY = 600
const MIN_GAME_VELOCITY = 150
const LEVEL_SIZE = 500

export default function HomeRoute({}: Props) {
  const {
    iterate,
    gameState,
    movePiece,
    rotatePiece,
    reset,
  } = useGameController()
  const score = gameState ? gameState.game.score : 1
  const isGameOver = gameState ? gameState.isGameOver : false
  const level = Math.floor(score / LEVEL_SIZE)

  //  Start game loop
  useEffect(() => {
    const gameVelocity = INITIAL_GAME_VELOCITY - level * 50
    const isTooFast = gameVelocity < MIN_GAME_VELOCITY

    const intervalId = setInterval(
      () => {
        iterate()
      },
      isTooFast ? MIN_GAME_VELOCITY : gameVelocity
    )

    return () => {
      clearInterval(intervalId)
    }
  }, [level])

  //  Bind keystrokes to game controls
  useEffect(() => {
    const onKeyDown = e => {
      switch (e.keyCode) {
        case 37: {
          movePiece(Direction.LEFT)
          break
        }
        case 38: {
          rotatePiece()
          break
        }
        case 39: {
          movePiece(Direction.RIGHT)
          break
        }
        case 40: {
          movePiece(Direction.DOWN)
          break
        }
      }
    }

    window.addEventListener('keydown', onKeyDown)

    return () => {
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [])

  return (
    <div class="h-full w-full text-center flex flex-col justify-center items-center">
      {isGameOver && (
        <GameOverBanner
          onClickHome={() => {
            route('/')
          }}
          onClickRestart={() => {
            reset()
          }}
        />
      )}
      <h1 class="tracking-widest text-white text-xl text-orbitron mb-5">
        SCORE: {score}
      </h1>
      <div class="bg-white rounded-sm p-4 bg-opaque-light">
        <TetrisCanvas />
      </div>
    </div>
  )
}
