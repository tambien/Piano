import { Frequency } from 'tone'

function noteToMidi(note: any){
	return Frequency(note).toMidi()
}

function midiToNote(midi: any){
	return Frequency(midi, 'midi').toNote()
}

function midiToFrequencyRatio(midi: number){
	let mod = midi % 3
	if (mod === 1){
		return [midi - 1, Tone.intervalToFrequencyRatio(1)]
	} else if (mod === 2){
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
