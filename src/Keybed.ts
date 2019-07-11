import { getReleasesUrl } from './Salamander'
import * as Tone from 'tone'
import { randomBetween } from './Util'

type KeybedOptions = { minNote: number, maxNote: number, release: boolean, samples: string }
export class Keybed extends Tone.AudioNode {
	_buffers: Tone.Buffers;
	
	_keybedSound: boolean;
	
	_loaded: Promise<void>;
	
	constructor({ minNote, maxNote, release, samples }: KeybedOptions){
		super()
		
		this.createInsOuts(0, 1)
		
		this._buffers = <Tone.Buffers>{}
		for (let i = minNote; i <= maxNote; i++){
			this._buffers[i] = getReleasesUrl(i)
		}
		
		this._keybedSound = release
		if (this._keybedSound){
			this._loaded = new Promise(success => {
				this._buffers = new Tone.Buffers(this._buffers, success, samples)
				
			})
		} else {
			this._loaded = Promise.resolve()
		}
	}
	
	load(): Promise<void>{
		return this._loaded
	}
	
	start(note:number, time:number, velocity:number){
		
		if (this._keybedSound && this._buffers.has(note)){
			const source = new Tone.BufferSource(this._buffers.get(note)).connect(this.output)
			//randomize the velocity slightly
			source.start(time, 0, undefined, 0.015 * velocity * randomBetween(0.5, 1))
		}
	}
	
	output(output: any){
		throw new Error('Method not implemented.')
	}
}
