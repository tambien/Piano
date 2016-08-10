import Gain from 'Tone/core/Gain'
import Tone from 'Tone/core/Tone'
import Frequency from 'Tone/type/Frequency'
import Pedal from './Pedal'
import Note from './Note'
import Harmonics from './Harmonics'
import Release from './Release'
import Salamander from './Salamander'

/**
 *  @class Multisampled Grand Piano using [Salamander Piano Samples](https://archive.org/details/SalamanderGrandPianoV3)
 *  @extends {Tone}
 */
export default class Piano extends Tone{

	constructor(){

		super(0, 1)

		this._loaded = false

		this._heldNotes = new Map()

		this._sustainedNotes = new Map()

		this._pedal = new Pedal().connect(this.output)

		this._notes = new Note().connect(this.output)

		this._harmonics = new Harmonics().connect(this.output)

		this._release = new Release().connect(this.output)
	}

	/**
	 *  Load all the samples
	 *  @param  {String}  baseUrl  The url for the Salamander base folder
	 *  @return  {Promise}
	 */
	load(url){
		return Salamander.load(url).then(() => {
			this._loaded = true
		})
	}

	/**
	 *  Put the pedal down at the given time. Causes subsequent
	 *  notes and currently held notes to sustain.
	 *  @param  {Time}  time  The time the pedal should go down
	 *  @returns {Piano} this
	 */
	pedalDown(time){
		if (this._loaded){
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
		if (this._loaded){
			time = this.toSeconds(time)
			if (this._pedal.isDown(time)){
				this._pedal.up(time)
				// dampen each of the notes
				this._sustainedNotes.forEach((notes) => {
					notes.forEach((note) => {
						note.stop(time)
					})
				})
				this._sustainedNotes.clear()
			}
		}
		return this
	}

	/**
	 *  Play a note.
	 *  @param  {String|Number}  note      The note to play
	 *  @param  {Number}  velocity  The velocity to play the note
	 *  @param  {Time}  time      The time of the event
	 *  @return  {Piano}  this
	 */
	keyDown(note, velocity=0.8, time=undefined){
		if (this._loaded){
			time = this.toSeconds(time)

			if (this.isString(note)){
				note = Math.round(Frequency(note).toMidi())
			}

			if (!this._heldNotes.has(note)){
				let key = this._notes.start(note, velocity, time)
				this._heldNotes.set(note, key)
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
	keyUp(note, time=undefined){
		if (this._loaded){
			time = this.toSeconds(time)

			if (this.isString(note)){
				note = Math.round(Frequency(note).toMidi())
			}

			if (this._heldNotes.has(note)){

				let key = this._heldNotes.get(note)
				this._heldNotes.delete(note)

				this._release.start(note, time)

				if (this._pedal.isDown(time)){
					let notes = []
					if (this._sustainedNotes.has(note)){
						notes = this._sustainedNotes.get(note)
					}
					notes.push(key)
					this._sustainedNotes.set(note, notes)
				} else {
					let dampenGain = key.stop(time)
					this._harmonics.start(note, dampenGain, time)
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
	 * piano.setVolume('keybed', -10)
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
				this._release.volume = vol
				break
			case 'harmonics':
				this._harmonics.volume = vol
				break
		}
	}
}