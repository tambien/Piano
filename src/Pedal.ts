import { ToneAudioBuffers, ToneBufferSource } from 'tone'
import { PianoComponent, PianoComponentOptions } from './Component'
import { randomBetween } from './Util'

export class Pedal extends PianoComponent {

	private _downTime: number = Infinity

	private _currentSound: ToneBufferSource = null

	private _buffers: ToneAudioBuffers

	constructor(options: PianoComponentOptions) {
		super(options)

		this._downTime = Infinity
	}

	protected _internalLoad(): Promise<void> {
		return new Promise((success) => {
			this._buffers = new ToneAudioBuffers({
				down1 : 'pedalD1.mp3',
				down2 : 'pedalD2.mp3',
				up1 : 'pedalU1.mp3',
				up2 : 'pedalU2.mp3',
			}, success, this.samples)
		})
	}

	/**
	 *  Squash the current playing sound
	 */
	private _squash(time: number): void {
		if (this._currentSound && this._currentSound.state !== 'stopped') {
			this._currentSound.stop(time)
		}
		this._currentSound = null
	}

	private _playSample(time: number, dir: 'down' | 'up'): void {
		if (this._enabled) {
			this._currentSound = new ToneBufferSource({
				buffer: this._buffers.get(`${dir}${Math.random() > 0.5 ? 1 : 2}`),
				context: this.context,
				curve: 'exponential',
				fadeIn: 0.05,
				fadeOut : 0.1,
			}).connect(this.output)
			this._currentSound.start(time, randomBetween(0, 0.01), undefined, 0.1 * randomBetween(0.5, 1))
		}
	}

	/**
	 * Put the pedal down
	 */
	down(time: number): void {
		this._squash(time)
		this._downTime = time
		this._playSample(time, 'down')
	}

	/**
	 * Put the pedal up
	 */
	up(time: number): void {
		this._squash(time)
		this._downTime = Infinity
		this._playSample(time, 'up')
	}

	/**
	 * Indicates if the pedal is down at the given time
	 */
	isDown(time: number): boolean {
		return time > this._downTime
	}
}
