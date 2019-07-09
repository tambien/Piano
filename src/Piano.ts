import Tone, { AudioNode, Midi, Volume } from 'tone'
import { Strings } from './Strings'
import { Pedal } from './Pedal'
import { Keybed } from './Keybed'
import { Harmonics } from './Harmonics'

/**
 *  @class Multisampled Grand Piano using [Salamander Piano Samples](https://archive.org/details/SalamanderGrandPianoV3)
 *  @extends {Tone}
 */
export class Piano extends AudioNode {

	constructor(){

		const options = Tone.defaults(arguments, ['velocities'], {
			//one velocity
			velocities : 1,
			//full range 88 keys
			minNote : 21,
			maxNote : 108,
			//default to no release sounds
			release : false,
			//include pedal sounds by default
			pedal : true,
			//the folder with all the piano samples
			samples : './audio/',
			//the initial volumes
			volume : {
				pedal : 0,
				strings : 0,
				keybed : 0,
				harmonics : 0
			}
		})

		super(options)

		this.createInsOuts(0, 1)

		/**
		 * If it's loaded or not
		 * @type {Boolean}
		 */
		this._loaded = false
		
		/**
		 * The currently held notes
		 * @type {Map}
		 */
		this._heldNotes = new Map()

		/**
		 * The sustained notes
		 * @type {Map}
		 */
		this._sustainedNotes = new Map()

		/**
		 * Hammered notes
		 */
		this._stringsOutput = new Volume(options.volume.strings).connect(this.output)
		this.strings = this._stringsOutput.volume
		this._stringSamplers = new Strings(options).connect(this._stringsOutput)

		/**
		 * The pedal
		 */
		this._pedalOutput = new Volume(options.volume.pedal).connect(this.output)
		this.pedal = this._pedalOutput.volume
		this._pedalSampler = new Pedal(options).connect(this._pedalOutput)

		/**
		 * The keybed release sound
		 */
		this._keybedOutput = new Volume(options.volume.keybed).connect(this.output)
		this.keybed = this._keybedOutput.volume
		this._keybedSampler = new Keybed(options).connect(this._keybedOutput)

		/**
		 * The string harmonics
		 */
		this._harmonicsOutput = new Volume(options.volume.harmonics).connect(this.output)
		this.harmonics = this._harmonicsOutput.volume
		this._harmonicsSampler = new Harmonics(options).connect(this._harmonicsOutput)
	}

	/**
	 *  Load all the samples
	 */
	async load(){
		await Promise.all([
			this._stringSamplers.load(), 
			this._pedalSampler.load(), 
			this._keybedSampler.load(),
			this._harmonicsSampler.load()
		])
		this._loaded = true
	}

	/**
	 * If all the samples are loaded or not
	 * @readOnly
	 * @type {Boolean}
	 */
	get loaded(){
		return this._loaded
	}

	/**
	 *  Put the pedal down at the given time. Causes subsequent
	 *  notes and currently held notes to sustain.
	 *  @param  {Time}  time  The time the pedal should go down
	 *  @returns {Piano} this
	 */
	pedalDown(time){
		if (this.loaded){
			time = this.toSeconds(time)
			if (!this._pedalSampler.isDown(time)){
				this._pedalSampler.down(time)
			}
		}
		return this
	}

	/**
	 *  Put the pedal up. Dampens sustained notes
	 *  @param  {Time}  time  The time the pedal should go up
	 *  @returns {Piano} this
	 */
	pedalUp(time){
		if (this.loaded){
			time = this.toSeconds(time)
			if (this._pedalSampler.isDown(time)){
				this._pedalSampler.up(time)
				// dampen each of the notes
				this._sustainedNotes.forEach((t, note) => {
					if (!this._heldNotes.has(note)){
						this._stringSamplers.triggerRelease(note, time)
					}
				})
				this._sustainedNotes.clear()
			}
		}
		return this
	}

	/**
	 *  Play a note.
	 *  @param  {String|Number}  note      The note to play. If it is a number, it is assumed
	 *                                     to be MIDI
	 *  @param  {NormalRange}  velocity  The velocity to play the note
	 *  @param  {Time}  time      The time of the event
	 *  @return  {Piano}  this
	 */
	keyDown(note, time=Tone.immediate(), velocity=0.8){
		if (this.loaded){
			time = this.toSeconds(time)

			if (Tone.isString(note)){
				note = Math.round(Midi(note))
			}

			if (!this._heldNotes.has(note)){
				//record the start time and velocity
				this._heldNotes.set(note, { time, velocity })

				this._stringSamplers.triggerAttack(note, time, velocity)
			}

		}
		return this
	}

	/**
	 *  Release a held note.
	 *  @param  {String|Number}  note      The note to stop
	 *  @param  {Time}  time      The time of the event
	 *  @return  {Piano}  this
	 */
	keyUp(note, time=Tone.immediate(), velocity=0.8){
		if (this.loaded){
			time = this.toSeconds(time)

			if (Tone.isString(note)){
				note = Math.round(Midi(note))
			}

			if (this._heldNotes.has(note)){

				const prevNote = this._heldNotes.get(note)
				this._heldNotes.delete(note)

				if (this._release){
					this._release.start(note, time, velocity)
				}

				//compute the release velocity
				const holdTime = Math.pow(Math.max(time - prevNote.time, 0.1), 0.7)
				const prevVel = prevNote.velocity
				let dampenGain = (3/holdTime) * prevVel * velocity
				dampenGain = Math.max(dampenGain, 0.4)
				dampenGain = Math.min(dampenGain, 4)

				if (this._pedalSampler.isDown(time)){
					if (!this._sustainedNotes.has(note)){
						this._sustainedNotes.set(note, time)
					}
				} else {
					//release the string sound
					this._stringSamplers.triggerRelease(note, time, velocity)
					//trigger the harmonics sound
					this._harmonicsSampler.triggerAttack(note, time, dampenGain)
				}

				//trigger the keybed release sound
				this._keybedSampler.start(note, time, velocity)
			}
		}
		return this
	}

	stopAll(){
		this.pedalUp()
		this._heldNotes.forEach((value, note) => {
			this.keyUp(note)
		})
		return this
	}
}
