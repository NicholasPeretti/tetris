import { h } from 'preact'
import { Router } from 'preact-router'
import { createMemoryHistory } from 'history'
import Background from './components/Background'
import HomeRoute from './components/HomeRoute'
import GameRoute from './components/GameRoute'

import './index.css'

export default function App() {
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
