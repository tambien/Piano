import { Midi, Sampler } from 'tone'
import { PianoComponent, PianoComponentOptions, UrlsMap } from './Component'
import { getHarmonicsInRange, getHarmonicsUrl, inHarmonicsRange } from './Salamander'
import { randomBetween } from './Util'

interface HarmonicsOptions extends PianoComponentOptions {
	minNote: number
	maxNote: number
	release: boolean
}

export class Harmonics extends PianoComponent {

	private _sampler: Sampler

	private _urls: UrlsMap

	constructor(options: HarmonicsOptions) {

		super(options)

		this._urls = {}
		const notes = getHarmonicsInRange(options.minNote, options.maxNote)
		for (const n of notes) {
			this._urls[n] = getHarmonicsUrl(n)
		}
	}

	triggerAttack(note: number, time: number, velocity: number): void {
		if (this._enabled && inHarmonicsRange(note)) {
			this._sampler.triggerAttack(Midi(note).toNote(), time, velocity * randomBetween(0.5, 1))
		}
	}

	protected _internalLoad(): Promise<void> {
		return new Promise(onload => {
			this._sampler = new Sampler({
				baseUrl: this.samples,
				onload,
				urls : this._urls,
			}).connect(this.output)
		})
	}
}
