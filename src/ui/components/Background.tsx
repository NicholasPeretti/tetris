import { h } from 'preact'
import { useRef, useEffect } from 'preact/hooks'
import { getRandomNumber } from '../../utils'
import useViewportSize from '../hooks/useViewportSize'
import useDevicePixelRatio from '../hooks/useDevicePixelRatio'

const DENSITY = 0.000015

export default function Background() {
  const canvasRef = useRef(null)
  const devicePixelRatio = useDevicePixelRatio()
  const { height, width } = useViewportSize()

  useEffect(() => {
    const canvas: HTMLCanvasElement = canvasRef.current
    const context = canvas.getContext('2d')

    //  Setup canvas size based on pixel ratio
    canvas.style.height = `${height}px`
    canvas.style.width = `${width}px`
    canvas.height = height * devicePixelRatio
    canvas.width = width * devicePixelRatio
    context.scale(devicePixelRatio, devicePixelRatio)

    //  I want a piece every 9 slot in the screen
    const SCREEN_AREA = width * height
    const MAX_PIECES_ON_SCREEN = Math.floor(SCREEN_AREA * DENSITY)

    let backgroundPieces = getRandomPieces(
      MAX_PIECES_ON_SCREEN,
      height,
      width,
      true
    )

    let nextRaf = null
    const loop = () => {
      const updatedBackgroundPieces = backgroundPieces.map(el => {
        const isElOffScreen = el.y < -el.size * 3

        return isElOffScreen
          ? getRandomPiece(height, width)
          : {
              ...el,
              y: el.y - el.velocity,
              angle: (el.angle + el.rotationVelocity) % 360,
            }
      })
      backgroundPieces = updatedBackgroundPieces
      drawBackgroundPiecesStateOnCanvas(canvas, updatedBackgroundPieces)
      nextRaf = window.requestAnimationFrame(loop)
    }

    window.requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(nextRaf)
    }
  }, [height, width, devicePixelRatio])

  return <canvas className="w-full h-full fixed inset-0 -z-1" ref={canvasRef} />
}

enum Shape {
  L,
  T,
  S,
}

interface ShapeState {
  x: number
  y: number
  angle: number
  velocity: number
  rotationVelocity: number
  size: number
  weight: number
  shape: Shape
}

function getRandomPieces(
  amount: number = 0,
  viewportHeight: number,
  viewportWidth: number,
  useRandomY: boolean = false
): Array<ShapeState> {
  return new Array(amount).fill(null).map((el, index) => {
    return getRandomPiece(viewportHeight, viewportWidth, useRandomY)
  })
}

function getRandomPiece(
  viewportHeight: number,
  viewportWidth: number,
  useRandomY: boolean = false
): ShapeState {
  const size = getRandomNumber({ min: 10, max: 15 })
  const shapesLength = Object.keys(Shape).length / 2
  const randomShapeIndex = getRandomNumber({ max: shapesLength })

  return {
    x: getRandomNumber({ max: viewportWidth }),
    y: useRandomY
      ? getRandomNumber({ max: viewportHeight })
      : viewportHeight + size * 3,
    angle: getRandomNumber({ max: 360 }),
    velocity: getRandomNumber({ min: 0.5, max: 1.5 }),
    rotationVelocity: getRandomNumber({ min: 0.5, max: 1 }),
    size,
    shape: randomShapeIndex,
    weight: getRandomNumber({
      min: 1,
      max: 2,
    }),
  }
}

function drawBackgroundPiecesStateOnCanvas(
  canvas: HTMLCanvasElement,
  backgroundState: Array<ShapeState>
): void {
  const context = canvas.getContext('2d')
  context.clearRect(0, 0, canvas.width, canvas.height)
  backgroundState.forEach(shapeState => {
    drawPiece(context, shapeState)
  })
}

function drawPiece(context: CanvasRenderingContext2D, shapeState: ShapeState) {
  const { x, y, angle, size, weight, shape } = shapeState

  //  Set color
  context.strokeStyle = 'rgba(255, 255, 255, 0.3)'
  context.lineWidth = weight

  //  Draw the shape
  switch (shape) {
    case Shape.L: {
      let height = size * 3
      let width = size * 2

      rotateCanvasMatrix(context, angle, x + width / 2, y + height / 2)

      context.beginPath()
      context.moveTo(x, y)
      context.lineTo(x, y + height)
      context.lineTo(x + width, y + height)
      context.lineTo(x + width, y + height - size)
      context.lineTo(x + width - size, y + height - size)
      context.lineTo(x + width - size, y)
      context.closePath()
      context.stroke()
      break
    }
    case Shape.T: {
      let height = size * 2
      let width = size * 3

      rotateCanvasMatrix(context, angle, x + width / 2, y + height / 2)

      context.beginPath()
      context.moveTo(x, y)
      context.lineTo(x + width, y)
      context.lineTo(x + width, y + size)
      context.lineTo(x + size * 2, y + size)
      context.lineTo(x + size * 2, y + height)
      context.lineTo(x + size, y + height)
      context.lineTo(x + size, y + size)
      context.lineTo(x, y + size)
      context.closePath()
      context.stroke()
      break
    }
    case Shape.S: {
      let height = size * 3
      let width = size * 2

      rotateCanvasMatrix(context, angle, x + width / 2, y + height / 2)

      context.beginPath()
      context.moveTo(x, y)
      context.lineTo(x, y + size * 2)
      context.lineTo(x + size, y + size * 2)
      context.lineTo(x + size, y + height)
      context.lineTo(x + width, y + height)
      context.lineTo(x + width, y + size)
      context.lineTo(x + size, y + size)
      context.lineTo(x + size, y)
      context.closePath()
      context.stroke()
      break
    }
  }

  //  Reset matrix rotation
  context.setTransform(
    window.devicePixelRatio,
    0,
    0,
    window.devicePixelRatio,
    0,
    0
  )
}

function rotateCanvasMatrix(
  context: CanvasRenderingContext2D,
  angle: number,
  x: number,
  y: number
): void {
  context.translate(x, y)
  context.rotate(angle * (Math.PI / 180))
  context.translate(-x, -y)
}
