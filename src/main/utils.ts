export function getGenericMatrix(
  rows: number,
  cols: number,
  content: any = null
) {
  /**
   * Cannot use .fill(new Array()) because it would use the same
   * array instance in each element of the first array.
   * That would cause a change in one of the rows to change also
   * the other ones
   */
  return (
    new Array(rows)
      .fill(null)
      //  Please read above before changing this
      .map(() => new Array(cols).fill(content))
  )
}

export function getRandomNumber(
  options: { min?: number; max?: number } = {}
): number {
  const { max = 1, min = 0 } = options

  return Math.floor(Math.random() * (max - min)) + min
}

type RequestAnimationFrameFn = (cb: () => void) => number
type StopRafLoopFn = () => void
