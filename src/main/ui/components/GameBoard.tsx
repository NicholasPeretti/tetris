import { h } from 'preact'
import useGameController from '../hooks/useGameController'

export default function GameBoard() {
  const { gameState } = useGameController()

  if (!gameState) return null

  return (
    <div>
      {gameState.game.board.map(row => (
        <div>
          {row.map(el => {
            return (
              <div
                style={`display: inline-block; width: 10px; height: 10px; background:${el ||
                  '#FFFFFF'}`}
              ></div>
            )
          })}
        </div>
      ))}
    </div>
  )
}
