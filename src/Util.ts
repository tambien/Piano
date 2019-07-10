import * as Tone from 'tone'
const { Frequency } = Tone
import { BufferSource } from '../node_modules/tone/tone'
// import * as Tone2 from '../node_modules/tone/tone'
// const { BufferSource } = Tone2

function noteToMidi(note: number){
	return Frequency(note).toMidi()
}

function midiToNote(midi: number){
	return Frequency(midi, 'midi').toNote()
}

function midiToFrequencyRatio(midi: number){
	let mod = midi % 3
	if (mod === 1){
		// @ts-ignore
		return [midi - 1, Tone.intervalToFrequencyRatio(1)]
	} else if (mod === 2){
		// @ts-ignore
		return [midi + 1, Tone.intervalToFrequencyRatio(-1)]
	} else {
		return [midi, 1]
	}
}

function createSource(buffer: any){
	return new BufferSource(buffer)
}

function randomBetween(low: number, high: number){
	return Math.random() * (high - low) + low
}

export { midiToNote, noteToMidi, createSource, midiToFrequencyRatio, randomBetween }
