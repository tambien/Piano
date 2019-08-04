import { Sampler, ToneAudioNode } from 'tone'
import { PianoComponentOptions, UrlsMap } from './Component'
import { getNotesUrl } from './Salamander'

interface PianoStringOptions extends PianoComponentOptions {
	notes: number[]
	velocity: number
}

/**
 * A single velocity of strings
 */
export class PianoString extends ToneAudioNode {

	readonly name = 'PianoString'

	private _sampler: Sampler

	output: Sampler
	input: undefined

	private _urls: UrlsMap = {}

	readonly samples: string

	constructor(options: PianoStringOptions) {
		super(options)

		// create the urls
		options.notes.forEach(note => this._urls[note] = getNotesUrl(note, options.velocity))

		this.samples = options.samples
	}

	load(): Promise<void> {
		return new Promise(onload => {
			this._sampler = this.output = new Sampler({
				attack : 0,
				baseUrl: this.samples,
				curve : 'exponential',
				onload,
				release : 0.4,
				urls: this._urls,
				volume : 3,
			})
		})
	}

	triggerAttack(note: string, time: number, velocity: number): void {
		this._sampler.triggerAttack(note, time, velocity)
	}

	triggerRelease(note: string, time: number): void {
		this._sampler.triggerRelease(note, time)
	}
}
