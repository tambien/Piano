import Salamander from './Salamander'
import PianoBase from './PianoBase'
import { noteToMidi, createSource, midiToFrequencyRatio, midiToNote, randomBetween } from './Util'
import { Buffers, Sampler, Frequency } from 'tone'

// the harmonics notes that Salamander has
const harmonics = [21, 24, 27, 30, 33, 36, 39, 42, 45, 48, 51, 54, 57, 60, 63, 66, 69, 72, 75, 78, 81, 84, 87]

export default class Harmonics extends PianoBase {

	constructor(range=[21, 108]){
		super()

		const lowerIndex = harmonics.findIndex((note) => note >= range[0])
		let upperIndex = harmonics.findIndex((note) => note >= range[1])
		upperIndex = upperIndex === -1 ? upperIndex = harmonics.length : upperIndex

		const notes = harmonics.slice(lowerIndex, upperIndex)

		this._samples = {}

		for (let n of notes){
			this._samples[n] = Salamander.getHarmonicsUrl(n)
		}
	}

	start(note, time, velocity){
		//make sure it's a valid range
		if (note >= harmonics[0] && note <= harmonics[harmonics.length-1]){
			this._sampler.triggerAttack(midiToNote(note), time, velocity * randomBetween(0.5, 1))
		}
	}

	load(baseUrl){
		return new Promise((success, fail) => {
			this._sampler = new Sampler(this._samples, success, baseUrl).connect(this.output)
			this._sampler.release = 1
		})
	}
}
