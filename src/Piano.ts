import { Context, Gain, isString,
	Midi, optionsFromArguments, Param,
	ToneAudioNode, Unit } from 'tone'
import { Harmonics } from './Harmonics'
import { Keybed } from './Keybed'
import { Pedal } from './Pedal'
import { PianoStrings } from './Strings'

interface PianoOptions {
	/**
	 * The audio context. Defaults to the global Tone audio context
	 */
	context: Context
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
	samples: string,

	/**
	 * Volume levelts for each of the components (in decibels)
	 */
	volume: {
		pedal: number,
		strings: number,
		keybed: number,
		harmonics: number,
	}
}

/**
 *  The Piano
 */
export class Piano extends ToneAudioNode<PianoOptions> {

	readonly name = 'Piano'
	readonly input = undefined
	readonly output = new Gain({context : this.context})

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
	strings: Param<Unit.Decibels>

	/**
	 * The volume output of the pedal up and down sounds
	 */
	pedal: Param<Unit.Decibels>

	/**
	 * The volume of the string harmonics
	 */
	harmonics: Param<Unit.Decibels>

	/**
	 * The volume of the keybed click sound
	 */
	keybed: Param<Unit.Decibels>

	/**
	 * The sustained notes
	 */
	private _sustainedNotes: Map<any, any>

	/**
	 * The currently held notes
	 */
	private _heldNotes: Map<any, any> = new Map()

	/**
	 * If it's loaded or not
	 */
	private _loaded: boolean = false

	constructor(options?: Partial<PianoOptions>);
	constructor() {
		super(optionsFromArguments(Piano.getDefaults(), arguments))

		const options = optionsFromArguments(Piano.getDefaults(), arguments)

		this._heldNotes = new Map()

		this._sustainedNotes = new Map()

		this._strings = new PianoStrings(Object.assign({}, options, {
			enabled: true,
			volume : options.volume.strings,
		})).connect(this.output)
		this.strings = this._strings.volume

		this._pedal = new Pedal(Object.assign({}, options, {
			enabled: options.pedal,
			volume : options.volume.pedal,
		})).connect(this.output)
		this.pedal = this._pedal.volume

		this._keybed = new Keybed(Object.assign({}, options, {
			enabled: options.release,
			volume : options.volume.keybed,
		})).connect(this.output)
		this.keybed = this._keybed.volume

		this._harmonics = new Harmonics(Object.assign({}, options, {
			enabled: options.release,
			volume : options.volume.harmonics,
		})).connect(this.output)
		this.harmonics = this._harmonics.volume
	}

	static getDefaults(): PianoOptions {
		return Object.assign(ToneAudioNode.getDefaults(), {
			maxNote : 108,
			minNote : 21,
			pedal : true,
			release : false,
			samples : './audio/',
			velocities : 1,
			volume : {
				harmonics : 0,
				keybed : 0,
				pedal : 0,
				strings : 0,
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
	 *  @param time  The time the pedal should go down
	 */
	pedalDown(time?: Unit.Time): this {

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
	 *  @param time  The time the pedal should go up
	 */
	pedalUp(time?: Unit.Time): this {

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
	keyDown(note: string | number, time: Unit.Time = this.immediate(), velocity: number = 0.8): this {
		if (this.loaded) {
			time = this.toSeconds(time)

			if (isString(note)) {
				note = Math.round(Midi(note).toMidi())
			}

			if (!this._heldNotes.has(note)) {
				// record the start time and velocity
				this._heldNotes.set(note, { time, velocity })

				this._strings.triggerAttack(note, time, velocity)
			}

		}
		return this
	}

	/**
	 *  Release a held note.
	 */
	keyUp(note: string | number, time: Unit.Time = this.immediate(), velocity = 0.8): this {
		if (this.loaded) {
			time = this.toSeconds(time)

			if (isString(note)) {
				note = Math.round(Midi(note).toMidi())
			}

			if (this._heldNotes.has(note)) {

				const prevNote = this._heldNotes.get(note)
				this._heldNotes.delete(note)

				// compute the release velocity
				const holdTime = Math.pow(Math.max(time - prevNote.time, 0.1), 0.7)
				const prevVel = prevNote.velocity
				let dampenGain = (3 / holdTime) * prevVel * velocity
				dampenGain = Math.max(dampenGain, 0.4)
				dampenGain = Math.min(dampenGain, 4)

				if (this._pedal.isDown(time)) {
					if (!this._sustainedNotes.has(note)) {
						this._sustainedNotes.set(note, time)
					}
				} else {
					// release the string sound
					this._strings.triggerRelease(note, time)
					// trigger the harmonics sound
					this._harmonics.triggerAttack(note, time, dampenGain)
				}

				// trigger the keybed release sound
				this._keybed.start(note, time, velocity)
			}
		}
		return this
	}

	stopAll(): this {
		this.pedalUp()
		this._heldNotes.forEach((value, note) => {
			this.keyUp(note)
		})
		return this
	}
}
