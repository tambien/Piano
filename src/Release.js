import Salamander from './Salamander'
import PianoBase from './PianoBase'

export default class Release extends PianoBase {
	
	start(note, time){

		let source = Salamander.getRelease(note).connect(this.output)
		source.start(time, 0, undefined, 0.01, 0)
	}
}