import Salamander from './Salamander'
import PianoBase from './PianoBase'

export default class Harmonics extends PianoBase {

	constructor(){
		super()
	}

	start(note, gain, time){
		if (Salamander.hasHarmonics(note)){
			let source = Salamander.getHarmonics(note).connect(this.output)
			source.start(time, 0, undefined, gain, 0)
		}
	}
}