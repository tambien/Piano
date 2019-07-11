import { getNotesUrl } from './Salamander'
import * as Tone from 'tone';

/**
 * A single velocity of strings
 */
export class String extends Tone.AudioNode {
	
	_loaded: Promise<void>;
	
	_sampler: Tone.Sampler;
	
	output: Tone.Sampler;
	
	constructor(notes:number[], velocity:number, baseUrl:string){
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

	triggerAttack(midi, note:number, gain:number, ...args:any[]){
		this._sampler.triggerAttack(midi, note, gain, ...args)
	}

	triggerRelease(midi, note:number, ...args:any[]){
		// TODO: in @types/tone, the sig of triggerRelease is (time?)=>this;
		//  in build/Piano.js it's (t, e)=>this
		this._sampler.triggerRelease(midi, note, ...args)
	}
}
