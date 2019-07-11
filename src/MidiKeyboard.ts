/* eslint-disable no-console */
import WebMidi from '../node_modules/webmidi/webmidi.min.js'
import { EventEmitter } from 'events'

export class MidiKeyboard extends EventEmitter {
	connectedDevices: Map<any, any>;
	
	ready: Promise<unknown>;
	
	constructor(){
		super()
		debugger;
		this.connectedDevices = new Map()

		this.ready = new Promise((done, error) => {
			WebMidi.enable((e) => {
				if (e){
					error(e)
				}
				WebMidi.addListener('connected', (e) => {
					if (e.port.type === 'input'){
						this._addListeners(e.port)
					}
				})
				WebMidi.addListener('disconnected', (e) => {
					this._removeListeners(e.port)
				})
				done()
			})
		})

	}

	_addListeners(device){

		if (!this.connectedDevices.has(device.id)){
			this.connectedDevices.set(device.id, device)

			device.addListener('noteon', 'all', (event) => {
				this.emit('keyDown', `${event.note.name}${event.note.octave}`, event.velocity)
			})
			device.addListener('noteoff', 'all', (event) => {
				this.emit('keyUp', `${event.note.name}${event.note.octave}`, event.velocity)
			})

			device.addListener('controlchange', 'all', (event) => {
				if (event.controller.name === 'holdpedal'){
					this.emit(event.value ? 'pedalDown' : 'pedalUp')
				}
			})
		}

	}
	
	emit(event: string | symbol, ...args): boolean {
		throw new Error('Method not implemented.')
	}


	_removeListeners(event){
		if (this.connectedDevices.has(event.id)){
			const device = this.connectedDevices.get(event.id)
			this.connectedDevices.delete(event.id)
			console.log('MidiKeyboard._removeListeners(event): removing: ', device)
			device.removeListener('noteon')
			device.removeListener('noteoff')
			device.removeListener('controlchange')
			
		}
	}
}
