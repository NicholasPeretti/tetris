import { useState, useEffect } from 'preact/hooks'

export default function useViewportSize() {
  const [height, setHeight] = useState(window.innerHeight)
  const [width, setWidth] = useState(window.innerWidth)

  useEffect(() => {
    const updateSize = () => {
      setHeight(window.innerHeight)
      setWidth(window.innerWidth)
    }

    window.addEventListener('resize', updateSize)

    return () => {
      window.removeEventListener('resize', updateSize)
    }
  }, [])

  return {
    width,
    height,
  }
}
