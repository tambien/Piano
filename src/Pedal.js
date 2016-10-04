import PianoBase from './PianoBase'
import Salamander from './Salamander'

export default class Pedal extends PianoBase {
	constructor(){
		super()

		this._downTime = Infinity

		this._currentSound = null
	}

	/**
	 *  Squash the current playing sound
	 */
	_squash(time){
		if (this._currentSound){
			this._currentSound.stop(time, 0.1)
		}
		this._currentSound = null
	}

	_playSample(time, dir){
		this._currentSound = Salamander.getPedal(dir)
		this._currentSound.connect(this.output).start(time, 0, undefined, 0.2)
	}

	down(time){
		this._squash(time)
		this._downTime = time
		this._playSample(time, 'down')
	}

	up(time){
		this._squash(time)
		this._downTime = Infinity
		this._playSample(time, 'up')
	}

	isDown(time){
		return time > this._downTime
	}
}