import { h } from 'preact'
import { useState, useEffect } from 'preact/hooks'

type Props = {
  getComponent: () => Promise<any>
}

export default function LazyLoad({ getComponent }: Props) {
  const [Component, setComponent] = useState(null)

  useEffect(() => {
    ;(async () => {
      const component = await getComponent()
      setComponent(component)
    })()
  }, [])

  if (!Component) return null
  return <Component />
}
