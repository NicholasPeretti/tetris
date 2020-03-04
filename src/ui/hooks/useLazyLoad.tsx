import { h } from 'preact'
import { useState, useEffect } from 'preact/hooks'

export default function useLazyLoad(getComponent: () => Promise<any>) {
  const [component, setComponent] = useState(null)
  useEffect(() => {
    getComponent().then(mod => setComponent(mod))
  }, [])

  return !component
    ? EmtpyComponent
    : (props?: { path?: string }) => component.default(props)
}

function EmtpyComponent() {
  return null
}
