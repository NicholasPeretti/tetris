/**
 * PAY ATTENTION ON WHAT YOU PUT HERE
 *
 * This file is put as inline code in the index.html, so the
 * bigger it is, the slower the user will see the page
 */

import { wrap, Remote } from 'comlink'
import GameController from './game'
import renderApp from './ui'

declare global {
  interface Window {
    gameController: Remote<GameController>
  }
}

window.gameController = wrap<GameController>(new Worker('./worker.ts'))

renderApp()

//  Register service worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('/sw.js')
  })
}
