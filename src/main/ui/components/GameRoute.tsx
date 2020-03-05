import { h, Fragment } from 'preact'
import { useEffect, useState } from 'preact/hooks'
import useGameController, { Direction } from '../hooks/useGameController'
import useMobileDetector from '../hooks/useMobileDetector'
import TetrisCanvas from './TetrisCanvas'
import GameOverBanner from './GameOverBanner'
import PauseBanner from './PauseBanner'
import Button, { Variant } from './Button'
import { route } from 'preact-router'

export type Props = {
  path: string
}

const INITIAL_GAME_VELOCITY = 600
const MIN_GAME_VELOCITY = 150
const LEVEL_SIZE = 500

const ESC_KEYCODE = 27
const P_KEYCODE = 80

export default function HomeRoute({}: Props) {
  const {
    iterate,
    gameState,
    movePiece,
    rotatePiece,
    reset,
    dropActivePiece,
  } = useGameController()
  const [isPaused, setIsPaused] = useState(false)
  const score = gameState ? gameState.game.score : 1
  const isGameOver = gameState ? gameState.isGameOver : false
  const level = Math.floor(score / LEVEL_SIZE)
  const isMobileBrowser = useMobileDetector()

  //  Start game loop
  useEffect(() => {
    //  Don't create the interval if the game is paused
    if (isPaused) return

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
  }, [level, isPaused])

  //  Bind keystrokes to game controls
  useEffect(() => {
    const onKeyDown = e => {
      switch (e.keyCode) {
        case 37: {
          if (!isPaused) movePiece(Direction.LEFT)
          break
        }
        case 38: {
          if (!isPaused) rotatePiece()
          break
        }
        case 39: {
          if (!isPaused) movePiece(Direction.RIGHT)
          break
        }
        case 40: {
          if (!isPaused) movePiece(Direction.DOWN)
          break
        }
        case ESC_KEYCODE:
        case P_KEYCODE: {
          setIsPaused(!isPaused)
          break
        }
        case 32: {
          dropActivePiece()
          break
        }
      }
    }

    window.addEventListener('keydown', onKeyDown)

    return () => {
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [isPaused])

  return (
    <div class="h-full w-full text-center flex flex-col justify-center items-center">
      {isGameOver && (
        <GameOverBanner
          onClickHome={() => {
            reset()
            route('/')
          }}
          onClickRestart={() => {
            reset()
          }}
        />
      )}
      {!isGameOver && isPaused && (
        <PauseBanner
          onClickHome={() => {
            reset()
            route('/')
          }}
          onClickResume={() => {
            setIsPaused(false)
          }}
        />
      )}
      <h1 class="tracking-widest text-white text-xl text-orbitron mb-5">
        SCORE: {score}
      </h1>
      <div class="bg-white rounded-sm p-4 bg-opaque-light">
        <TetrisCanvas />
      </div>
      {isMobileBrowser && (
        <div className="px-4 w-full">
          <div className="flex flex-row justify-evenly items-center bg-gray-900 text-white rounded-sm mt-4 w-full text-xl">
            <Button
              onClick={() => {
                if (!isPaused) movePiece(Direction.LEFT)
              }}
              variant={Variant.gameControl}
            >
              {/* LEFT */}
              &#8637;
            </Button>
            <Button
              onClick={() => {
                if (!isPaused) rotatePiece()
              }}
              variant={Variant.gameControl}
            >
              {/* ROTATE */}
              &#8635;
            </Button>
            <Button
              onClick={() => {
                setIsPaused(!isPaused)
              }}
              variant={Variant.gameControl}
            >
              {/* PLAY/PAUSE */}
              {isPaused ? (
                <Fragment>&#9658;</Fragment>
              ) : (
                <Fragment>&#10073; &#10073;</Fragment>
              )}
            </Button>
            <Button
              onClick={() => {
                if (!isPaused) movePiece(Direction.DOWN)

                dropActivePiece()
              }}
              variant={Variant.gameControl}
            >
              {/* DROP PIECE */}
              &#8675;
            </Button>
            <Button
              onClick={() => {
                movePiece(Direction.DOWN)
              }}
              variant={Variant.gameControl}
            >
              {/* DOWN */}
              &#8643;
            </Button>
            <Button
              onClick={() => {
                if (!isPaused) movePiece(Direction.RIGHT)
              }}
              variant={Variant.gameControl}
            >
              {/* RIGHT */}
              &#8641;
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
