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

	_randomRate(){
		let ratePermutation = 0.01
		return Math.random() * ratePermutation * 2 - ratePermutation + 1
	}

	_playSample(time, dir){
		let timing = Salamander.getPedal(dir)
		this._currentSound = Salamander.newSource()
		this._currentSound.playbackRate.value = this._randomRate()
		this._currentSound.connect(this.output).start(time, timing.start, timing.duration, 0.2)
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