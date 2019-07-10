import { getNotesUrl } from './Salamander'
import * as Tone from 'tone'

/**
 * A single velocity of strings
 */
export class String extends Tone.AudioNode {
	
	_loaded: Promise<void>;
	
	_sampler: Tone.Sampler;
	
	output: Tone.Sampler;
	
	constructor(notes, velocity, baseUrl){
		super()
		//create the urls
		const urls = {}
		notes.forEach(note => urls[note] = getNotesUrl(note, velocity))

		this._loaded = new Promise(onload => {
			this._sampler = this.output = new Tone.Sampler(urls, {
				onload, baseUrl,
				release : 0.4,
				attack : 0,
				curve : 'exponential',
				volume : 3
			})
		})
	}

	load(){
		return this._loaded
	}

	triggerAttack(...args){
		this._sampler.triggerAttack(...args)
	}

	triggerRelease(...args){
		this._sampler.triggerRelease(...args)
	}
}
