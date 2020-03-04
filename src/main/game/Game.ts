import { Piece, rotatePiece } from './Piece'
import {
  Board,
  getEmptyBoard,
  isPieceDrawableAt,
  drawPieceAt,
  replacePiece,
  removeCompletedRows,
} from './Board'
import { getRandomNumber } from '../utils'

export type Game = {
  activePiece: Piece
  board: Board
  pieceX: number
  pieceY: number
  score: number
}

export type ShareableGameState = {
  board: Board
  pieceX: number
  pieceY: number
  score: number
}

export const piecesRepresentations = {
  S: { color: '#2196F3', representations: ['6C00', '4620', '06C0', '8C40'] },
  Z: { color: '#F4511E', representations: ['C600', '2640', '0C60', '4C80'] },
  J: { color: '#FF9800', representations: ['44C0', '8E00', '6440', '0E20'] },
  L: { color: '#FFC107', representations: ['4460', '0E80', 'C440', '2E00'] },
  T: { color: '#512DA8', representations: ['4e00', '4640', '0e40', '4c40'] },
  I: { color: '#2db8c5', representations: ['4444', '0F00', '2222', '00F0'] },
  O: { color: '#FFEB3B', representations: ['CC00'] },
}

export function getRandomPiece(): Piece {
  const availablePieces = Object.values(piecesRepresentations)
  const randomIndex = getRandomNumber({
    max: availablePieces.length,
  })
  const pieceRepresentations = [...availablePieces[randomIndex].representations]
  const pieceActiveRepresentationIndex = getRandomNumber({
    max: pieceRepresentations.length - 1,
  })

  return {
    id: Symbol(),
    representations: pieceRepresentations,
    activeRepresentationIndex: pieceActiveRepresentationIndex,
    color: availablePieces[randomIndex].color,
  }
}

export function getNewGame(rows: number = 14, cols: number = 6): Game {
  const piece = getRandomPiece()
  const emptyBoard = getEmptyBoard(rows, cols)
  const [x, y] = [
    getRandomNumber({
      max: emptyBoard[0].length - 4,
    }),
    0,
  ]
  return {
    activePiece: piece,
    board: drawPieceAt(emptyBoard, piece, x, y),
    pieceX: x,
    pieceY: y,
    score: 0,
  }
}
export enum Direction {
  DOWN,
  LEFT,
  RIGHT,
}

export function moveActivePiece(game: Game, direction: Direction): Game {
  const { x: targetX, y: targetY } = getCoordinatesByDirection(game, direction)

  if (!isPieceDrawableAt(game.board, game.activePiece, targetX, targetY)) {
    return game
  }

  return {
    ...game,
    board: drawPieceAt(game.board, game.activePiece, targetX, targetY),
    pieceX: targetX,
    pieceY: targetY,
    score: game.score + (direction === Direction.DOWN ? 1 : 0),
  }
}

export function isPieceMovableTo(game: Game, direction: Direction): boolean {
  const { x: targetX, y: targetY } = getCoordinatesByDirection(game, direction)
  return isPieceDrawableAt(game.board, game.activePiece, targetX, targetY)
}

export function getCoordinatesByDirection(
  game: Game,
  direction: Direction
): { x: number; y: number } {
  let [targetX, targetY] = [game.pieceX, game.pieceY]

  //  Calculate the destination position
  switch (direction) {
    case Direction.DOWN: {
      targetY += 1
      break
    }
    case Direction.LEFT: {
      targetX -= 1
      break
    }
    case Direction.RIGHT: {
      targetX += 1
      break
    }
  }

  return {
    x: targetX,
    y: targetY,
  }
}

export function insertNextPiece(game: Game): Game {
  const piece = getRandomPiece()
  const x = getRandomNumber({ max: game.board[0].length - 4 })
  const { board: resettedBoard, completedRows } = removeCompletedRows(
    replacePiece(game.board, game.activePiece, game.activePiece.color)
  )
  const score = completedRows === 4 ? 800 : completedRows * 100

  return {
    ...game,
    pieceY: 0,
    pieceX: x,
    activePiece: piece,
    board: drawPieceAt(resettedBoard, piece, x, 0),
    score: game.score + score,
  }
}

export function rotateActivePiece(game: Game): Game {
  const { activePiece, pieceX, pieceY, board } = game
  const rotatedPiece = rotatePiece(activePiece)

  if (isPieceDrawableAt(board, rotatedPiece, pieceX, pieceY)) {
    return {
      ...game,
      activePiece: rotatedPiece,
      board: drawPieceAt(board, rotatedPiece, pieceX, pieceY),
    }
  }

  if (isPieceDrawableAt(board, rotatedPiece, pieceX + 1, pieceY)) {
    return {
      ...game,
      activePiece: rotatedPiece,
      board: drawPieceAt(board, rotatedPiece, pieceX + 1, pieceY),
      pieceX: pieceX + 1,
    }
  }
  if (isPieceDrawableAt(board, rotatedPiece, pieceX - 1, pieceY)) {
    return {
      ...game,
      activePiece: rotatedPiece,
      board: drawPieceAt(board, rotatedPiece, pieceX - 1, pieceY),
      pieceX: pieceX - 1,
    }
  }

  return game
}

export function duplicateGame(game: Game): Game {
  return {
    ...game,
    board: game.board.map(row => [...row]),
    activePiece: {
      ...game.activePiece,
      representations: [...game.activePiece.representations],
    },
  }
}

export function getSharableGameState(game: Game): ShareableGameState {
  return {
    board: replacePiece(game.board, game.activePiece, game.activePiece.color),
    score: game.score,
    pieceX: game.pieceX,
    pieceY: game.pieceY,
  }
}
