import { AudioNode, Midi } from 'tone'
import { getNotesInRange, velocitiesMap } from './Salamander'
import { String } from './String'

/**
 *  Manages all of the hammered string sounds
 */
export class Strings extends AudioNode {
	
	_velocities: any;
	
	_strings: any;
	
	_activeNotes: Map<any, any>;

	constructor({ minNote, maxNote, velocities=1, samples='./audio/' }){
		super()
		this.createInsOuts(0, 1)

		const notes = getNotesInRange(minNote, maxNote)

		this._velocities = velocitiesMap[velocities].slice()

		this._strings = this._velocities.map(velocity => {
			const string = new String(notes, velocity, samples)
			string.connect(this.output)
			return string
		})

		this._activeNotes = new Map()

	}

	scale(val, inMin, inMax, outMin, outMax){
		return ((val - inMin) / (inMax - inMin)) * (outMax - outMin) + outMin
	}

	triggerAttack(note, time, velocity){

		const scaledVel = this.scale(velocity, 0, 1, -0.5, this._strings.length - 0.51)
		const stringIndex = Math.max(Math.round(scaledVel), 0)
		let gain = 1 + scaledVel - stringIndex
		
		if (this._strings.length === 1){
			gain = velocity
		}

		const sampler = this._strings[stringIndex]

		if (this._activeNotes.has(note)){
			this.triggerRelease(note, time)
		}

		this._activeNotes.set(note, sampler)
		sampler.triggerAttack(Midi(note), time, gain)
	}

	triggerRelease(note, time){
		//trigger the release of all of the notes at that velociy
		if (this._activeNotes.has(note)){
			this._activeNotes.get(note).triggerRelease(Midi(note), time)
			this._activeNotes.delete(note)
		}
	}

	async load(){
		await Promise.all(this._strings.map(s => s.load()))
	}
}
