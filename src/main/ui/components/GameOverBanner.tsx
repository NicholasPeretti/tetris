import { h } from 'preact'
import Button, { Variant } from './Button'

type Props = {
  onClickRestart: () => void
  onClickHome: () => void
}

export default function GameOverBanner({ onClickHome, onClickRestart }: Props) {
  return (
    <div class="fixed inset-0 z-1 text-white text-center flex flex-col justify-center items-center bg-opaque-dark">
      <h1 class="tracking-widest text-4xl text-orbitron mb-5">GAME OVER</h1>
      <div class="flex flex-row">
        <Button
          className="mx-4"
          variant={Variant.secondary}
          onClick={onClickRestart}
        >
          RESTART
        </Button>
        <Button
          className="mx-4"
          variant={Variant.secondary}
          onClick={onClickHome}
        >
          HOME
        </Button>
      </div>
    </div>
  )
}
