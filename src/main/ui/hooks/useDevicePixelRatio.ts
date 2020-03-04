import { useState, useEffect } from 'preact/hooks'

export default function useDevicePixelRatio() {
  const [ratio, setRatio] = useState(window.devicePixelRatio)

  useEffect(() => {
    window
      .matchMedia('screen and (min-resolution: 2dppx)')
      .addListener(function(e) {
        if (e.matches) {
          setRatio(2)
        } else {
          setRatio(1)
        }
      })
  })

  return ratio
}
