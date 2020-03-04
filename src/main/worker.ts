import { expose } from 'comlink'
import GameController from './game'

expose(new GameController({ rows: 25, cols: 14 }))
