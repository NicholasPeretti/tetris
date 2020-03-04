import { h } from 'preact'
import { Router } from 'preact-router'
import { createMemoryHistory } from 'history'
import Background from './components/Background'
import HomeRoute from './components/HomeRoute'
import useLazyLoad from './hooks/useLazyLoad'

import './index.css'

export default function App() {
  //  Load the component in a lazy when the user downloads the main bundle
  //  This helps loading because it makes us download the rest of the app
  //  while the user is facing the home screen
  const GameRoute = useLazyLoad(() => import('./components/GameRoute'))

  return (
    <div class="container h-full mx-auto sm:w-full md:w2/3 lg:w-1/3">
      <Background />
      <Router history={createMemoryHistory()}>
        <HomeRoute path="/" />
        <GameRoute path="/game" />
      </Router>
    </div>
  )
}
