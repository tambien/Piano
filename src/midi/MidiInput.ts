import { EventEmitter } from 'events'
import WebMidi, { Input } from 'webmidi'

type NoteEventType = 'keyDown' | 'keyUp';
type PedalEventType = 'pedalDown' | 'pedalUp';
type ConnectionEventType = 'connect' | 'disconnect'

interface DeviceData {
	id: string;
	manufacturer: string;
	name: string;
}

interface MidiEvent {
	device: DeviceData;
}

interface NoteEvent extends MidiEvent {
	note: string;
	midi: number;
	velocity: number;
}

type ConditionalEmitter<EventType> =
	EventType extends PedalEventType ? MidiEvent :
	EventType extends ConnectionEventType ? DeviceData :
	EventType extends NoteEventType ? NoteEvent : unknown;

type ConditionalListener<EventType> = (e: ConditionalEmitter<EventType>) => void;


export class MidiInput extends EventEmitter {

	/**
	 * The device ID string. If set to 'all', will listen
	 * to all MIDI inputs. Otherwise will filter a specific midi device
	 */
	deviceId: string | 'all';

	constructor(deviceId: string | 'all' = 'all') {
		super()

		this.deviceId = deviceId

		/**
		 * Automatically attaches the event listeners when a device is connect
		 * and removes listeners when a device is disconnected
		 */
		MidiInput.enabled().then(() => {
			WebMidi.addListener('connected', (event) => {
				if (event.port.type === 'input') {
					this._addListeners(event.port)
				}
			})
			WebMidi.addListener('disconnected', (event) => {
				this._removeListeners(event.port)
			})

			// add all of the existing inputs
			WebMidi.inputs.forEach(input => this._addListeners(input));
		})
	}


	/**
	 * Attach listeners to the device when it's connected
	 */
	private _addListeners(device: Input): void {

		if (!MidiInput.connectedDevices.has(device.id)) {
			MidiInput.connectedDevices.set(device.id, device)
			this.emit('connect', this._inputToDevice(device));

			device.addListener('noteon', 'all', (event) => {
				if (this.deviceId === 'all' || this.deviceId === device.id) {
					this.emit('keyDown', {
						note: `${event.note.name}${event.note.octave}`,
						midi: event.note.number,
						velocity: event.velocity,
						device: this._inputToDevice(device)
					})
				}
			})
			device.addListener('noteoff', 'all', (event) => {
				if (this.deviceId === 'all' || this.deviceId === device.id) {
					this.emit('keyUp', {
						note: `${event.note.name}${event.note.octave}`,
						midi: event.note.number,
						velocity: event.velocity,
						device: this._inputToDevice(device)
					})
				}
			})

			device.addListener('controlchange', 'all', (event) => {
				if (this.deviceId === 'all' || this.deviceId === device.id) {
					if (event.controller.name === 'holdpedal') {
						this.emit(event.value ? 'pedalDown' : 'pedalUp', {
							device: this._inputToDevice(device)
						})
					}
				}
			})
		}

	}

	private _inputToDevice(input: Input): DeviceData {
		return {
			name: input.name,
			id: input.id,
			manufacturer: input.manufacturer
		}
	}

	/**
	 * Internal call to remove all event listeners associated with the device
	 */
	private _removeListeners(event: { id: string }): void {
		if (MidiInput.connectedDevices.has(event.id)) {
			const device = MidiInput.connectedDevices.get(event.id)
			this.emit('disconnect', this._inputToDevice(device));
			MidiInput.connectedDevices.delete(event.id)
			device.removeListener('noteon')
			device.removeListener('noteoff')
			device.removeListener('controlchange')
		}
	}

	// EVENT FUNCTIONS

	emit<EventType extends PedalEventType | ConnectionEventType | NoteEventType>(
		event: EventType,
		data: ConditionalEmitter<EventType>
	): boolean {
		return super.emit(event, data)
	}

	on<EventType extends PedalEventType | ConnectionEventType | NoteEventType>(
		event: EventType,
		listener: ConditionalListener<EventType>
	): this {
		super.on(event, listener)
		return this;
	}

	once<EventType extends PedalEventType | ConnectionEventType | NoteEventType>(
		event: EventType,
		listener: ConditionalListener<EventType>
	): this {
		super.once(event, listener)
		return this;
	}

	off<EventType extends PedalEventType | ConnectionEventType | NoteEventType>(
		event: EventType,
		listener: ConditionalListener<EventType>
	): this {
		super.off(event, listener)
		return this;
	}

	// STATIC

	private static connectedDevices: Map<string, Input> = new Map()

	private static _isEnabled = false;

	/**
	 * Resolves when the MIDI Input is enabled and ready to use
	 */
	static async enabled(): Promise<void> {
		if (!MidiInput._isEnabled) {
			await new Promise((done, error) => {
				WebMidi.enable((e) => {
					if (e) {
						error(e)
					} else {
						MidiInput._isEnabled = true
						done()
					}
				})
			})
		}
	}

	/**
	 * Get a list of devices that are currently connected
	 */
	static async getDevices(): Promise<DeviceData[]> {
		await MidiInput.enabled();
		return WebMidi.inputs;
	}
}
