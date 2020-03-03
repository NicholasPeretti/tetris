export type Piece = {
  id: Symbol
  color: string
  representations: Array<string>
  activeRepresentationIndex: number
}

export function rotatePiece(piece: Piece): Piece {
  const { activeRepresentationIndex, representations } = piece

  //  Computer science trick to keep the number inside a certain range
  const newActiveRepresentationIndex =
    (activeRepresentationIndex + 1) % representations.length

  return {
    ...piece,
    activeRepresentationIndex: newActiveRepresentationIndex,
    representations: [...representations],
  }
}
