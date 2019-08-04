import { EventEmitter } from 'events'
import WebMidi, { Input } from 'webmidi'

export class MidiKeyboard extends EventEmitter {

	private connectedDevices: Map<string, Input> = new Map()

	readonly ready: Promise<unknown>

	constructor() {
		super()

		this.ready = new Promise((done, error) => {
			WebMidi.enable((e) => {
				if (e) {
					error(e)
				}
				WebMidi.addListener('connected', (event) => {
					if (event.port.type === 'input') {
						this._addListeners(event.port)
					}
				})
				WebMidi.addListener('disconnected', (event) => {
					this._removeListeners(event.port)
				})
				done()
			})
		})

	}

	private _addListeners(device: Input): void {

		if (!this.connectedDevices.has(device.id)) {
			this.connectedDevices.set(device.id, device)

			device.addListener('noteon', 'all', (event) => {
				this.emit('keyDown', `${event.note.name}${event.note.octave}`, event.velocity)
			})
			device.addListener('noteoff', 'all', (event) => {
				this.emit('keyUp', `${event.note.name}${event.note.octave}`, event.velocity)
			})

			device.addListener('controlchange', 'all', (event) => {
				if (event.controller.name === 'holdpedal') {
					this.emit(event.value ? 'pedalDown' : 'pedalUp')
				}
			})
		}

	}

	private _removeListeners(event: { id: any }): void {
		if (this.connectedDevices.has(event.id)) {
			const device = this.connectedDevices.get(event.id)
			this.connectedDevices.delete(event.id)
			device.removeListener('noteon')
			device.removeListener('noteoff')
			device.removeListener('controlchange')

		}
	}
}
