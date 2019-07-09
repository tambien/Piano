import { AudioNode, Sampler } from 'tone'
import { getNotesUrl } from './Salamander'

/**
 * A single velocity of strings
 */
export class String extends AudioNode {
	constructor(notes, velocity, baseUrl){
		super()
		//create the urls
		const urls = {}
		notes.forEach(note => urls[note] = getNotesUrl(note, velocity, baseUrl))

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
