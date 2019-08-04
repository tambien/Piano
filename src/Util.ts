// import * as Tone from '../node_modules/tone/Tone'
import { Frequency, intervalToFrequencyRatio, ToneAudioBuffer, ToneBufferSource } from 'tone'

export function noteToMidi(note: string): number {
	return Frequency(note).toMidi()
}

export function midiToNote(midi: number): string {
	const frequency = Frequency(midi, 'midi')
	const ret = frequency.toNote()
	return ret
}

function midiToFrequencyRatio(midi: number): [number, number] {
	const mod = midi % 3
	if (mod === 1) {
		return [midi - 1, intervalToFrequencyRatio(1)]
	} else if (mod === 2) {
		// @ts-ignore
		return [midi + 1, intervalToFrequencyRatio(-1)]
	} else {
		return [midi, 1]
	}
}

function createSource(buffer: ToneAudioBuffer | AudioBuffer): ToneBufferSource {
	return new ToneBufferSource(buffer)
}

export function randomBetween(low: number, high: number): number {
	return Math.random() * (high - low) + low
}
