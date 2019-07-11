import * as Tone from 'tone'
// import { Sampler, Midi, AudioNode } from 'tone'
import { getHarmonicsInRange, getHarmonicsUrl, inHarmonicsRange } from './Salamander'
import { randomBetween } from './Util'
type HarmonicsOptions = { minNote: number, maxNote: number, release: boolean, samples: string }
export class Harmonics extends Tone.AudioNode {
	
	_harmonicsSound: boolean;
	
	_loaded: Promise<void>;
	
	_sampler: Tone.Sampler;
	
	output: Tone.ProcessingNode
	
	constructor({ minNote, maxNote, release, samples }:HarmonicsOptions){
		super()

		this.createInsOuts(0, 1)

		this._harmonicsSound = release

		const urls = {}
		const notes = getHarmonicsInRange(minNote, maxNote)
		for (let n of notes){
			urls[n] = getHarmonicsUrl(n)
		}

		if (this._harmonicsSound){
			this._loaded = new Promise(onload => {
				this._sampler = new Tone.Sampler(urls, { onload, baseUrl : samples }).connect(this.output)
			})
		} else {
			this._loaded = Promise.resolve()
		}
	}

	triggerAttack(note:number, time:number, velocity:number){
		if (this._harmonicsSound && inHarmonicsRange(note)){
			this._sampler.triggerAttack(Tone.Midi(note), time, velocity * randomBetween(0.5, 1))
		}
	}

	load(): Promise<void> {
		return this._loaded
	}
}
