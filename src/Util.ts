// import * as Tone from '../node_modules/tone/Tone'
import * as Tone from 'tone'
import Frequency from '../node_modules/tone/Tone/type/Frequency'
// import MIDI from '../node_modules/tone/Tone/type/MIDI'
// import Note from '../node_modules/tone/Tone/type/Type'
// import { Buffer } from 'tone'
// import { BufferSource } from '../node_modules/tone/tone'
// import * as Tone2 from '../node_modules/tone/tone'
// const { BufferSource } = Tone2

function noteToMidi(note: Tone.Encoding.Note): Tone.Encoding.MIDI{
	return Frequency(note).toMidi()
}

function midiToNote(midi: number): Tone.Encoding.Note{
	let frequency = Frequency(midi, 'midi');
	console.log('frequency: ',frequency);
	console.log('frequency: ',frequency);
	console.log('frequency: ',frequency);
	debugger;
	return frequency.toNote()
}

function midiToFrequencyRatio(midi: number):[number, number]{
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

function createSource(buffer: Tone.Buffer | AudioBuffer):Tone.BufferSource{
	return new Tone.BufferSource(buffer)
}

function randomBetween(low: number, high: number):number{
	return Math.random() * (high - low) + low
}

// export { midiToNote, noteToMidi, createSource, midiToFrequencyRatio, randomBetween }
export { midiToNote, randomBetween }
