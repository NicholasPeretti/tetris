import { Piece } from './Piece'
import { getGenericMatrix } from '../utils'

export type PieceMatrix = Array<Array<boolean>>

export function getPieceMatrix(piece: Piece): PieceMatrix {
  const matrix: PieceMatrix = getGenericMatrix(4, 4, false)

  //  Getting the 4 char representation
  const representation = piece.representations[piece.activeRepresentationIndex]
  const representationParts = representation.split('')

  return matrix.map((row, rowIndex) => {
    //  This represent the esadecimal number that hold the 4 bits of the row
    const representationChar = representationParts[rowIndex]

    //  This is the binary number translated from the esadecimal string
    //  into a binary string, like: '10'
    const representationBinary = Number.parseInt(
      representationChar,
      16
    ).toString(2)

    //  I want to have all the for digits, so I want to transform "10" in "0010"
    const fourDigitsRepresentation = ('0000' + representationBinary).substr(
      representationBinary.length
    )

    //  Map the string into an array of booleans
    return fourDigitsRepresentation.split('').map(el => el === '1')
  })
}
