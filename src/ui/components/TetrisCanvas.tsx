import { h } from 'preact'
import { useRef, useEffect } from 'preact/hooks'
import useGameController from '../hooks/useGameController'
import useDevicePixelRatio from '../hooks/useDevicePixelRatio'

const CELL_WIDTH = 20

export default function TetrisCanvas() {
  const { gameState } = useGameController()
  const devicePixelRatio = useDevicePixelRatio()
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!gameState) return

    const { rows, cols } = gameState

    requestAnimationFrame(() => {
      const canvas = canvasRef.current
      const context = canvas.getContext('2d')

      canvas.style.width = `${cols * CELL_WIDTH}px`
      canvas.style.height = `${rows * CELL_WIDTH}px`
      canvas.width = cols * CELL_WIDTH * devicePixelRatio
      canvas.height = rows * CELL_WIDTH * devicePixelRatio

      context.scale(devicePixelRatio, devicePixelRatio)
      context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)

      gameState.game.board.forEach((row, y) => {
        row.forEach((cell, x) => {
          if (cell) {
            renderCanvasCell(
              context,
              x,
              y,
              typeof cell === 'string' ? cell : '#FFFFFF'
            )
          }
        })
      })
    })
  }, [gameState, devicePixelRatio])

  if (!gameState) return null

  return <canvas ref={canvasRef} style="border: 1px solid black;"></canvas>
}

function renderCanvasCell(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  color: string
) {
  context.fillStyle = color
  context.fillRect(CELL_WIDTH * x, CELL_WIDTH * y, CELL_WIDTH, CELL_WIDTH)
  context.strokeStyle = '#333333'
  context.strokeRect(CELL_WIDTH * x, CELL_WIDTH * y, CELL_WIDTH, CELL_WIDTH)
}
