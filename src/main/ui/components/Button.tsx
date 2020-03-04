import { h } from 'preact'

export enum Variant {
  primary,
  secondary,
}

export type Props = {
  children: any
  className?: string
  variant?: Variant
  onClick?: () => void
}
const classes = {
  [Variant.primary]: 'bg-white text-black',
  [Variant.secondary]:
    'bg-transparent border border-white border-solid text-white hover:bg-white hover:text-black',
}
export default function Button({
  children,
  className = '',
  variant = Variant.primary,
  onClick,
}: Props) {
  return (
    <button
      onClick={onClick}
      class={`text-orbitron tracking-widest text-xl rounded py-4 px-6 ${classes[variant]} ${className}`}
    >
      {children}
    </button>
  )
}
