import Salamander from './Salamander'
import PianoBase from './PianoBase'

export default class Harmonics extends PianoBase {

	constructor(){
		super()
	}

	start(note, gain, time){
		if (Salamander.hasHarmonics(note)){
			let source = Salamander.newSource().connect(this.output)
			let {timing, rate} = Salamander.getHarmonics(note)
			source.playbackRate.value = rate
			source.start(time, timing.start, timing.duration, gain, 0)
		}
	}
}