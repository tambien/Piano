import * as Tone from 'tone'
import { randomBetween } from './Util'

export class Pedal extends Tone.AudioNode {
	_downTime: number
	
	_currentSound: Tone.BufferSource
	
	_pedalSound: boolean
	
	_loaded: Promise<void>
	
	_buffers: Tone.Buffers
	
	constructor({ samples, pedal }:{samples:string, pedal:boolean}){
		super()
		this.createInsOuts(0, 1)

		this._downTime = Infinity

		this._currentSound = null
		
		this._pedalSound = pedal

		if (this._pedalSound){
			this._loaded = new Promise((success) => {
				this._buffers = new Tone.Buffers({
					up1 : 'pedalU1.mp3',
					down1 : 'pedalD1.mp3',
					up2 : 'pedalU2.mp3',
					down2 : 'pedalD2.mp3',
				}, success, samples)
			})
		} else {
			this._loaded = Promise.resolve()
		}

	}

	load(): Promise<void>{
		return this._loaded
	}

	/**
	 *  Squash the current playing sound
	 */
	_squash(time:number){
		if (this._currentSound && !this._currentSound._sourceStopped){
			this._currentSound.stop(time)
		}
		this._currentSound = null
	}

	_playSample(time:number, dir: 'down'|'up'){
		if (this._pedalSound){
			this._currentSound = new Tone.BufferSource(this._buffers.get(`${dir}${Math.random() > 0.5 ? 1 : 2}`))
			this._currentSound.curve = 'exponential'
			this._currentSound.fadeOut = 0.1
			this._currentSound.connect(this.output).start(time, randomBetween(0, 0.01), undefined, 0.1 * randomBetween(0.5, 1), 0.05)
		}
	}

	output(output: any){
		throw new Error('Method not implemented.')
	}

	down(time:number){
		this._squash(time)
		this._downTime = time
		this._playSample(time, 'down')
	}

	up(time){
		this._squash(time)
		this._downTime = Infinity
		this._playSample(time, 'up')
	}

	isDown(time:number): boolean{
		return time > this._downTime
	}
}
