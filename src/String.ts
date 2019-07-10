import { getNotesUrl } from './Salamander'
import { Sampler, AudioNode } from '../node_modules/tone/tone'

/**
 * A single velocity of strings
 */
export class String extends AudioNode {
	
	_loaded: Promise<unknown>;
	
	_sampler: Sampler;
	
	output: Sampler;
	
	constructor(notes, velocity, baseUrl){
		super()
		//create the urls
		const urls = {}
		notes.forEach(note => urls[note] = getNotesUrl(note, velocity))

		this._loaded = new Promise(onload => {
			this._sampler = this.output = new Sampler(urls, {
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
