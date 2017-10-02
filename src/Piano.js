import Tone, { Gain, Frequency, AudioNode, Buffer} from 'tone'
import Pedal from './Pedal'
import {Notes} from './Notes'
import Harmonics from './Harmonics'
import Release from './Release'
import Salamander from './Salamander'

/**
 *  @class Multisampled Grand Piano using [Salamander Piano Samples](https://archive.org/details/SalamanderGrandPianoV3)
 *  @extends {Tone}
 */
export class Piano extends AudioNode {

	constructor(){

		const options = Tone.defaults(arguments, ["range", "velocities", "release"], {
			velocities : 1,
			range : [21, 108],
			release : true
		});

		super()
		this.createInsOuts(0, 1)

		this._loaded = false

		this._heldNotes = new Map()

		this._sustainedNotes = new Map()

		this._notes = new Notes(options.range, options.velocities).connect(this.output)

		this._pedal = new Pedal().connect(this.output)

		if (options.release){
			this._harmonics = new Harmonics(options.range).connect(this.output)

			this._release = new Release(options.range).connect(this.output)
		}
	}

	/**
	 *  Load all the samples
	 *  @param  {String}  baseUrl  The url for the Salamander base folder
	 *  @return  {Promise}
	 */
	load(url='https://tambien.github.io/Piano/Salamander/'){
		const promises = [this._notes.load(url), this._pedal.load(url)]
		if (this._harmonics){
			promises.push(this._harmonics.load(url))
		}
		if (this._release){
			promises.push(this._release.load(url))
		}
		return Promise.all(promises).then(() => {
			this._loaded = true
		})
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
			if (!this._pedal.isDown(time)){
				this._pedal.down(time)
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
			if (this._pedal.isDown(time)){
				this._pedal.up(time)
				// dampen each of the notes
				this._sustainedNotes.forEach((t, note) => {
					if (!this._heldNotes.has(note)){
						this._notes.stop(note, time)
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
	keyDown(note, time=Tone.now(), velocity=0.8){
		if (this.loaded){
			time = this.toSeconds(time)

			if (Tone.isString(note)){
				note = Math.round(Frequency(note).toMidi())
			}

			if (!this._heldNotes.has(note)){
				//record the start time and velocity
				this._heldNotes.set(note, {time, velocity})

				this._notes.start(note, time, velocity)
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
	keyUp(note, time=Tone.now(), velocity=0.8){
		if (this.loaded){
			time = this.toSeconds(time)

			if (Tone.isString(note)){
				note = Math.round(Frequency(note).toMidi())
			}

			if (this._heldNotes.has(note)){

				const prevNote = this._heldNotes.get(note)
				this._heldNotes.delete(note)

				if (this._release){
					this._release.start(note, time, velocity)
				}

				//compute the release velocity
				const holdTime = time - prevNote.time
				const prevVel = prevNote.velocity
				let dampenGain = (0.5/Math.max(holdTime, 0.1)) + prevVel + velocity
				dampenGain = Math.pow(Math.log(Math.max(dampenGain, 1)), 2) / 2

				if (this._pedal.isDown(time)){
					if (!this._sustainedNotes.has(note)){
						this._sustainedNotes.set(note, time)
					}
				} else {
					this._notes.stop(note, time, velocity)

					if (this._harmonics){
						this._harmonics.start(note, time, dampenGain)
					}
				}
			}
		}
		return this
	}

	/**
	 *  Set the volumes of each of the components
	 *  @param {String} param
	 *  @param {Decibels} vol
	 *  @return {Piano} this
	 *  @example
	 * //either as an string
	 * piano.setVolume('release', -10)
	 */
	setVolume(param, vol){
		switch(param){
			case 'note':
				this._notes.volume = vol
				break
			case 'pedal':
				this._pedal.volume = vol
				break
			case 'release':
				if (this._release){
					this._release.volume = vol
				}
				break
			case 'harmonics':
				if (this._harmonics){
					this._harmonics.volume = vol
				}
				break
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

	/**
	 * Callback to invoke with normalized progress
	 * @param  {Function} cb
	 */
	progress(cb){
		Buffer.on('progress', cb)
		return this
	}
}
