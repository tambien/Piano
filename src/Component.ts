import { Context, Param, ToneAudioNode, Unit, Volume } from 'tone'

export interface PianoComponentOptions {
	context: Context
	volume: Unit.Decibels
	enabled: boolean
	samples: string
}

export interface UrlsMap {
	[note: string]: string
}

/**
 * Base class for the other components
 */
export abstract class PianoComponent extends ToneAudioNode {
	readonly name = 'PianoComponent'
	readonly input = undefined
	readonly output = new Volume({context : this.context })

	/**
	 * If the component is enabled or not
	 */
	protected _enabled: boolean = false

	/**
	 * The volume output of the component
	 */
	readonly volume: Param<Unit.Decibels> = this.output.volume

	/**
	 * Boolean indication of if the component is loaded or not
	 */
	private _loaded: boolean = false

	/**
	 * The directory to load the Salamander samples out of
	 */
	readonly samples: string

	constructor(options: PianoComponentOptions) {
		super(options)

		this.volume.value = options.volume

		this._enabled = options.enabled

		this.samples = options.samples
	}

	/**
	 * Load the component internally
	 */
	protected abstract _internalLoad(): Promise<void>

	/**
	 * If the samples are loaded or not
	 */
	get loaded(): boolean {
		return this._loaded
	}

	/**
	 * Load the samples
	 */
	async load(): Promise<void> {
		if (this._enabled) {
			await this._internalLoad()
			this._loaded = true
		} else {
			return Promise.resolve()
		}
	}
}
