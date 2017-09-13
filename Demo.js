import {Piano} from './src/Piano'
import Tone, { Buffer, Master, Part, Transport } from 'tone'
Tone.context.lookAhead = 0
import MidiConvert from 'midiconvert'
import WebMidi from 'webmidi'
import events from 'events'

var piano = new Piano([21, 108], 5).toMaster()

piano.load().then(()=>{
	//make the button active on load
	let button = document.querySelector('button')
	button.classList.add('active')
})

/**
 *  LOADING BAR
 */
Buffer.on('progress', (prog) => {
	document.querySelector('#loading #fill').style.width = (prog * 100).toString() + '%'
})

Buffer.on('load', (prog) => {
	document.querySelector('#loading').remove()
})

/**
 *  MIDI FILE
 */
MidiConvert.load('clair_de_lune.mid').then((midi) => {

	function playNote(time, event){
		piano.keyDown(event.note, event.velocity, time).keyUp(event.note, time + event.duration)
	}

	Transport.bpm.value = midi.bpm
	Transport.timeSignature = midi.timeSignature

	//schedule the pedal
	let sustain = new Part((time, event) => {
		if (event.value){
			piano.pedalDown(time)
		} else {
			piano.pedalUp(time)
		}
	}, midi.tracks[0].controlChanges[64]).start(0)

	let noteOffEvents = new Part((time, event) => {
		piano.keyUp(event.midi, time, event.velocity)
	}, midi.tracks[0].noteOffs).start(0)

	let noteOnEvents = new Part((time, event) => {
		piano.keyDown(event.midi, time, event.velocity)
	}, midi.tracks[0].notes).start(0)

})

/**
 *  VOLUME CONTROLS
 */
window.addEventListener('DOMContentLoaded', () => {
	let inputs = document.querySelectorAll('input')
	for (let input of inputs){
		input.addEventListener('input', (e) => {
			piano.setVolume(e.target.name, e.target.value)
		})
	}

	let button = document.querySelector('button')
	button.addEventListener('click', (e) => {
		if (Transport.state === 'started'){
			Transport.pause()
			button.textContent = 'START'
		} else {
			Transport.start()
			button.textContent = 'PAUSE'
		}
	})
})


class Midi extends events.EventEmitter{
	constructor(){
		super()

		this._isEnabled = false

		WebMidi.enable((err) => {
			if (!err){
				this._isEnabled = true
				if (WebMidi.inputs){
					WebMidi.inputs.forEach((input) => this._bindInput(input))
				}
				WebMidi.addListener('connected', (device) => {
					if (device.input){
						this._bindInput(device.input)
					}
				})
			}
		})
	}

	_bindInput(inputDevice){
		if (this._isEnabled){
			WebMidi.addListener('disconnected', (device) => {
				if (device.input){
					device.input.removeListener('noteOn')
					device.input.removeListener('noteOff')
				}
			})
			inputDevice.addListener('noteon', 'all', (event) => {
                this.emit('keyDown', event.note.number, event.velocity)
			})
			inputDevice.addListener('noteoff', 'all',  (event) => {
                this.emit('keyUp', event.note.number, event.velocity)
			})

			inputDevice.addListener('controlchange', "all", (event) => {
				if (event.controller.name === 'holdpedal'){
					this.emit(event.value ? 'pedalDown' : 'pedalUp')
				}
			})
		}
	}
}

const midi = new Midi()
midi.on('keyDown', (note, velocity) => {
	piano.keyDown(note, Tone.now(), velocity)
})

midi.on('keyUp', (note, velocity) => {
	piano.keyUp(note, Tone.now(), velocity)
})

midi.on('pedalDown', () => {
	piano.pedalDown()
})

midi.on('pedalUp', () => {
	piano.pedalUp()
})
