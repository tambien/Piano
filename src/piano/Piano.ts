import {
	Gain, isString,
	Midi, optionsFromArguments, Param,
	ToneAudioNode, Unit, isDefined
} from 'tone'
import { Harmonics } from './Harmonics'
import { Keybed } from './Keybed'
import { Pedal } from './Pedal'
import { PianoStrings } from './Strings'

type ToneAudioNodeOptions = import('tone/build/esm/core/context/ToneAudioNode').ToneAudioNodeOptions

export interface PianoOptions extends ToneAudioNodeOptions {
	/**
	 * The number of velocity steps to load
	 */
	velocities: number,
	/**
	 * The lowest note to load
	 */
	minNote: number,
	/**
	 * The highest note to load
	 */
	maxNote: number,
	/**
	 * If it should include a 'release' sounds composed of a keyclick and string harmonic
	 */
	release: boolean,
	/**
	 * If the piano should include a 'pedal' sound.
	 */
	pedal: boolean,
	/**
	 * The directory of the salamander grand piano samples
	 */
	url: string,
	/**
	 * The maximum number of notes that can be held at once
	 */
	maxPolyphony: number,
	/**
	 * Volume levels for each of the components (in decibels)
	 */
	volume: {
		pedal: number,
		strings: number,
		keybed: number,
		harmonics: number,
	}
}

interface KeyEvent {
	time?: Unit.Time;
	velocity?: number;
	note?: string;
	midi?: number;
}

interface PedalEvent {
	time?: Unit.Time;
}

/**
 *  The Piano
 */
export class Piano extends ToneAudioNode<PianoOptions> {

	readonly name = 'Piano'
	readonly input = undefined
	readonly output = new Gain({ context: this.context })

	/**
	 * The string harmonics
	 */
	private _harmonics: Harmonics

	/**
	 * The keybed release sound
	 */
	private _keybed: Keybed

	/**
	 * The pedal
	 */
	private _pedal: Pedal

	/**
	 * The strings
	 */
	private _strings: PianoStrings

	/**
	 * The volume level of the strings output. This is the main piano sound.
	 */
	strings: Param<"decibels">

	/**
	 * The volume output of the pedal up and down sounds
	 */
	pedal: Param<"decibels">

	/**
	 * The volume of the string harmonics
	 */
	harmonics: Param<"decibels">

	/**
	 * The volume of the keybed click sound
	 */
	keybed: Param<"decibels">

	/**
	 * The maximum number of notes which can be held at once
	 */
	maxPolyphony: number;

	/**
	 * The sustained notes
	 */
	private _sustainedNotes: Map<number, any>

	/**
	 * The currently held notes
	 */
	private _heldNotes: Map<number, any> = new Map()

	/**
	 * If it's loaded or not
	 */
	private _loaded: boolean = false

	constructor(options?: Partial<PianoOptions>);
	constructor() {
		super(optionsFromArguments(Piano.getDefaults(), arguments))

		const options = optionsFromArguments(Piano.getDefaults(), arguments)

		// make sure it ends with a /
		if (!options.url.endsWith('/')) {
			options.url += '/'
		}
		this.maxPolyphony = options.maxPolyphony
		this._heldNotes = new Map()

		this._sustainedNotes = new Map()

		this._strings = new PianoStrings(Object.assign({}, options, {
			enabled: true,
			samples: options.url,
			volume: options.volume.strings,
		})).connect(this.output)
		this.strings = this._strings.volume

		this._pedal = new Pedal(Object.assign({}, options, {
			enabled: options.pedal,
			samples: options.url,
			volume: options.volume.pedal,
		})).connect(this.output)
		this.pedal = this._pedal.volume

		this._keybed = new Keybed(Object.assign({}, options, {
			enabled: options.release,
			samples: options.url,
			volume: options.volume.keybed,
		})).connect(this.output)
		this.keybed = this._keybed.volume

		this._harmonics = new Harmonics(Object.assign({}, options, {
			enabled: options.release,
			samples: options.url,
			volume: options.volume.harmonics,
		})).connect(this.output)
		this.harmonics = this._harmonics.volume
	}

	static getDefaults(): PianoOptions {
		return Object.assign(ToneAudioNode.getDefaults(), {
			maxNote: 108,
			minNote: 21,
			pedal: true,
			release: false,
			url: 'https://tambien.github.io/Piano/audio/',
			velocities: 1,
			maxPolyphony: 32,
			volume: {
				harmonics: 0,
				keybed: 0,
				pedal: 0,
				strings: 0,
			},
		})
	}

	/**
	 *  Load all the samples
	 */
	async load(): Promise<void> {
		await Promise.all([
			this._strings.load(),
			this._pedal.load(),
			this._keybed.load(),
			this._harmonics.load(),
		])
		this._loaded = true
	}

	/**
	 * If all the samples are loaded or not
	 */
	get loaded(): boolean {
		return this._loaded
	}

	/**
	 *  Put the pedal down at the given time. Causes subsequent
	 *  notes and currently held notes to sustain.
	 */
	pedalDown({ time = this.immediate() }: PedalEvent = {}): this {

		if (this.loaded) {
			time = this.toSeconds(time)
			if (!this._pedal.isDown(time)) {
				this._pedal.down(time)
			}
		}
		return this
	}

	/**
	 *  Put the pedal up. Dampens sustained notes
	 */
	pedalUp({ time = this.immediate() }: PedalEvent = {}): this {

		if (this.loaded) {
			const seconds = this.toSeconds(time)
			if (this._pedal.isDown(seconds)) {
				this._pedal.up(seconds)
				// dampen each of the notes
				this._sustainedNotes.forEach((t, note) => {
					if (!this._heldNotes.has(note)) {
						this._strings.triggerRelease(note, seconds)
					}
				})
				this._sustainedNotes.clear()
			}
		}
		return this
	}

	/**
	 *  Play a note.
	 *  @param note	  The note to play. If it is a number, it is assumed to be MIDI
	 *  @param velocity  The velocity to play the note
	 *  @param time	  The time of the event
	 */
	keyDown({ note, midi, time = this.immediate(), velocity = 0.8 }: KeyEvent): this {
		if (this.loaded && this.maxPolyphony > this._heldNotes.size + this._sustainedNotes.size) {

			time = this.toSeconds(time)

			midi = isString(note) ? Math.round(Midi(note).toMidi()) : note

			if (!this._heldNotes.has(midi)) {
				// record the start time and velocity
				this._heldNotes.set(midi, { time, velocity })

				this._strings.triggerAttack(midi, time, velocity)
			}
		} else {
			console.warn('samples not loaded')
		}
		return this
	}

	/**
	 *  Release a held note.
	 */
	keyUp({ note, midi, time = this.immediate(), velocity = 0.8 }: KeyEvent): this {
		if (this.loaded) {
			time = this.toSeconds(time)

			if (isString(note)) {
				midi = Math.round(Midi(note).toMidi())
			}

			if (this._heldNotes.has(midi)) {

				const prevNote = this._heldNotes.get(midi)
				this._heldNotes.delete(midi)

				// compute the release velocity
				const holdTime = Math.pow(Math.max(time - prevNote.time, 0.1), 0.7)
				const prevVel = prevNote.velocity
				let dampenGain = (3 / holdTime) * prevVel * velocity
				dampenGain = Math.max(dampenGain, 0.4)
				dampenGain = Math.min(dampenGain, 4)

				if (this._pedal.isDown(time)) {
					if (!this._sustainedNotes.has(midi)) {
						this._sustainedNotes.set(midi, time)
					}
				} else {
					// release the string sound
					this._strings.triggerRelease(midi, time)
					// trigger the harmonics sound
					this._harmonics.triggerAttack(midi, time, dampenGain)
				}

				// trigger the keybed release sound
				this._keybed.start(midi, time, velocity)
			}
		}
		return this
	}

	stopAll(): this {
		this.pedalUp()
		this._heldNotes.forEach((_, midi) => {
			this.keyUp({ midi })
		})
		return this
	}
}

