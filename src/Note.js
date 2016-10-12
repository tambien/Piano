import Tone from 'Tone/core/Tone'
import Salamander from './Salamander'
import PianoBase from './PianoBase'

/**
 *  Internal class
 */
class Note extends Tone{
	constructor(time, source, velocity, gain){
		super()
		//round the velocity
		this._velocity = velocity
		this._startTime = time

		this.output = source
		this.output.start(time, 0, undefined, gain, 0)
	}

	stop(time){
		if (this.output.buffer){

			// return the amplitude of the damper playback
			let progress = (time - this._startTime) / this.output.buffer.duration
			progress = (1 - progress) * this._velocity
			// stop the buffer
			this.output.stop(time, 0.2)

			return Math.pow(progress, 0.5)
		} else {
			return 0
		}
	}
}

/**
 *  Manages all of the hammered string sounds
 */
export default class Strings extends PianoBase {

	start(note, velocity, time){

		let velPos = velocity * (Salamander.velocityCount - 1)
		let roundedVel = Math.round(velPos)
		let diff = roundedVel - velPos
		let gain = 1 - diff * 0.5

		if (Salamander.hasNote(note, roundedVel)){
			let source = Salamander.getNote(note, roundedVel)

			let retNote = new Note(time, source, velocity, gain).connect(this.output)

			return retNote
		} else {
			return null
		}
	}
}