import { getReleasesUrl } from './Salamander'
import { BufferSource, AudioNode, Buffers } from 'tone'
import { randomBetween } from './Util'

export class Keybed extends AudioNode {
	_buffers: Buffers;
	
	_keybedSound: any;
	
	_loaded: Promise<unknown>;

	constructor({ minNote, maxNote, release, samples }){
		super()

		this.createInsOuts(0, 1)

		this._buffers = {}
		for (let i = minNote; i <= maxNote; i++){
			this._buffers[i] = getReleasesUrl(i)
		}

		this._keybedSound = release

		if (this._keybedSound){
			this._loaded = new Promise((success) => {
				this._buffers = new Buffers(this._buffers, success, samples)
			})
		} else {
			this._loaded = Promise.resolve()
		}
	}

	load(){
		return this._loaded
	}

	start(note, time, velocity){
		if (this._keybedSound && this._buffers.has(note)){
			const source = new BufferSource(this._buffers.get(note)).connect(this.output)
			//randomize the velocity slightly
			source.start(time, 0, undefined, 0.015 * velocity * randomBetween(0.5, 1))
		}
	}
	
	output(output: any){
		throw new Error('Method not implemented.')
	}
}
