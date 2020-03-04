import { h } from 'preact'
import { route } from 'preact-router'

export type Props = {
  path: string
}

export default function HomeRoute({}: Props) {
  return (
    <div class="h-full w-full text-center flex flex-col justify-center items-center appear-in ">
      <h1 class="tracking-widest text-white text-4xl text-orbitron mb-5">
        T E T R I S
      </h1>
      <button
        class="text-orbitron blink tracking-widest text-xl rounded bg-white text-black py-4 px-6"
        onClick={() => {
          route('/game')
        }}
      >
        S T A R T
      </button>
    </div>
  )
}
