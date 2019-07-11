import * as Tone from 'tone'
// import * as ToneStatic from '../node_modules/tone/Tone/core/Tone'
// import AudioNode from '../node_modules/tone/Tone/core/AudioNode'
import { Strings } from './Strings'
import { Pedal } from './Pedal'
import { Keybed } from './Keybed'
import { Harmonics } from './Harmonics'

// const { Volume, Midi } = Tone
// import {Volume as TVolume} from '../node_modules/tone/Tone/component/Volume'
interface PianoOptions extends AudioContext {
    velocities: number,
    minNote: number,
    maxNote: number,
    release: boolean,
    pedal: boolean,
    samples: string,
    volume: {
        pedal: number,
        strings: number,
        keybed: number,
        harmonics: number
    }
}
/**
 *  @extends {Tone}
 */
export class Piano extends Tone.AudioNode {
	
	/**The string harmonics */
	_harmonicsOutput: Tone.Volume
	
	_harmonicsSampler: Harmonics
	
	/** The currently held notes*/
	_heldNotes: Map<any, any>
	
	/**The keybed release sound */
	_keybedOutput: Tone.Volume
	
	_keybedSampler: Keybed
	
	/**If it's loaded or not */
	_loaded: boolean
	
	/**The pedal */
	_pedalOutput: Tone.Volume
	
	_pedalSampler: Pedal
	
	_release: any
	
	_stringSamplers: Strings
	
	/**Hammered notes */
	_stringsOutput: Tone.Volume
	
	/**The sustained notes */
	_sustainedNotes: Map<any, any>
	
	harmonics: any
	
	keybed: any
	
	pedal: any
	
	strings: any
	
	output: Tone.ProcessingNode
	
	constructor(){
		const options: PianoOptions = Tone.defaults(arguments, ['velocities'], {
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
		
		this._loaded = false
		
		this._heldNotes = new Map()
		
		this._sustainedNotes = new Map()
		
		this._stringsOutput = new Tone.Volume(options.volume.strings).connect(this.output)
		this.strings = this._stringsOutput.volume
		this._stringSamplers = new Strings(options).connect(this._stringsOutput)
		
		this._pedalOutput = new Tone.Volume(options.volume.pedal).connect(this.output)
		this.pedal = this._pedalOutput.volume
		this._pedalSampler = new Pedal(options).connect(this._pedalOutput)
		
		this._keybedOutput = new Tone.Volume(options.volume.keybed).connect(this.output)
		this.keybed = this._keybedOutput.volume
		this._keybedSampler = new Keybed(options).connect(this._keybedOutput)
		
		this._harmonicsOutput = new Tone.Volume(options.volume.harmonics).connect(this.output)
		this.harmonics = this._harmonicsOutput.volume
		this._harmonicsSampler = new Harmonics(options).connect(this._harmonicsOutput)
	}
	
	/**
	 *  Load all the samples
	 */
	async load(): Promise<void>{
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
	 */
	get loaded(): boolean{
		return this._loaded
	}
	
	/**
	 *  Put the pedal down at the given time. Causes subsequent
	 *  notes and currently held notes to sustain.
	 *  @param time  The time the pedal should go down
	 */
	pedalDown(time?: Tone.Encoding.Time): Piano{
		
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
	 *  @param time  The time the pedal should go up
	 */
	pedalUp(time?: Tone.Encoding.Time): Piano{
		
		if (this.loaded){
			time = this.toSeconds(time)
			if (this._pedalSampler.isDown(time)){
				this._pedalSampler.up(time)
				// dampen each of the notes
				this._sustainedNotes.forEach((t, note) => {
					if (!this._heldNotes.has(note)){
						this._stringSamplers.triggerRelease(note, <number>time)
					}
				})
				this._sustainedNotes.clear()
			}
		}
		return this
	}
	
	/**
	 *  Play a note.
	 *  @param note	  The note to play. If it is a number, it is assumed
	 *									 to be MIDI
	 *  @param velocity  The velocity to play the note
	 *  @param time	  The time of the event
	 */
	keyDown(note: string|number, time: Tone.Encoding.Time = Tone.immediate(), velocity: number = 0.8): Piano{
		console.log('keyDown typeof note: ', typeof note)
		if (this.loaded){
			time = this.toSeconds(time)
			
			if (Tone.isString(note)){
				note = Math.round(Tone.Midi(note))
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
	 */
	keyUp(note: string|number, time: Tone.Encoding.Time = Tone.immediate(), velocity = 0.8): Piano{
		if (this.loaded){
			time = this.toSeconds(time)
			
			if (Tone.isString(note)){
				note = Math.round(Tone.Midi(note))
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
				let dampenGain = (3 / holdTime) * prevVel * velocity
				dampenGain = Math.max(dampenGain, 0.4)
				dampenGain = Math.min(dampenGain, 4)
				
				if (this._pedalSampler.isDown(time)){
					if (!this._sustainedNotes.has(note)){
						this._sustainedNotes.set(note, time)
					}
					
				} else {
					
					//release the string sound
					this._stringSamplers.triggerRelease(note, time)
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
