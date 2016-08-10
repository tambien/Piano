import Salamander from './Salamander'
import PianoBase from './PianoBase'

export default class Release extends PianoBase {
	
	start(note, time){

		let source = Salamander.newSource().connect(this.output)
		let {timing, rate} = Salamander.getRelease(note)
		source.playbackRate.value = rate
		source.start(time, timing.start, timing.duration, 0.01, 0)
	}
}