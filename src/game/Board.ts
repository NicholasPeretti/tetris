import { Piece } from './Piece'
import { getPieceMatrix } from './PieceMatrix'
import { getGenericMatrix } from '../utils'

export type Board = Array<Array<Symbol | string | null>>

export function getEmptyBoard(rows: number, cols: number): Board {
  return getGenericMatrix(rows, cols, null)
}

export function isPieceDrawableAt(
  board: Board,
  piece: Piece,
  x: number,
  y: number
): boolean {
  const pieceMatrix = getPieceMatrix(piece)

  //  Looping the rows
  for (let rowIndex = y; rowIndex < y + pieceMatrix.length; rowIndex++) {
    //  Looping each element in the row (column)
    for (let colIndex = x; colIndex < x + pieceMatrix[0].length; colIndex++) {
      let targetAreaContent = board[rowIndex]
        ? board[rowIndex][colIndex]
        : undefined
      let valueToSet = pieceMatrix[rowIndex - y][colIndex - x]

      //  No need to check if the piece won't overwrite the target area
      if (!valueToSet) continue

      if (targetAreaContent !== null && targetAreaContent !== piece.id) {
        //  No need to check for other combinations.
        return false
      }
    }
  }

  return true
}

export function removePiece(board: Board, piece: Piece): Board {
  return replacePiece(board, piece, null)
}

export function replacePiece(
  board: Board,
  piece: Piece,
  replacement: any
): Board {
  return board.map(row => row.map(el => (el === piece.id ? replacement : el)))
}

export function drawPieceAt(
  board: Board,
  piece: Piece,
  x: number,
  y: number
): Board {
  if (!isPieceDrawableAt(board, piece, x, y)) return board

  const pieceMatrix = getPieceMatrix(piece)
  const cleanBoard = removePiece(board, piece)

  //  Looping the rows
  for (
    let rowIndex = y;
    rowIndex < y + pieceMatrix.length && rowIndex < cleanBoard.length;
    rowIndex++
  ) {
    //  Looping each element in the row (column)
    for (
      let colIndex = x;
      colIndex < x + pieceMatrix[0].length && colIndex < cleanBoard[0].length;
      colIndex++
    ) {
      const shouldDrawPiece = pieceMatrix[rowIndex - y][colIndex - x]

      if (shouldDrawPiece) {
        cleanBoard[rowIndex][colIndex] = piece.id
      }
    }
  }

  return cleanBoard
}

export function removeCompletedRows(
  board: Board
): { board: Board; completedRows: number } {
  const colsNumber = board[0].length
  let completedRows = 0

  //  Remove all the completed rows
  const cleanedBoard = board.filter(row => {
    const isRowCompleted = row.reduce((acc, item) => {
      return acc && item !== null
    }, true)

    if (isRowCompleted) {
      completedRows++
    }

    return !isRowCompleted
  })

  //  Add new empty rows
  cleanedBoard.splice(
    0,
    0,
    ...getGenericMatrix(completedRows, colsNumber, null)
  )

  return { board: cleanedBoard, completedRows }
}
