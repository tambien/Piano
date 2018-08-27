import Tone, { Frequency, BufferSource } from 'tone'

function noteToMidi(note){
	return Frequency(note).toMidi()
}

function midiToNote(midi){
	return Frequency(midi, 'midi').toNote()
}

function midiToFrequencyRatio(midi){
	let mod = midi % 3
	if (mod === 1){
		return [midi - 1, Tone.intervalToFrequencyRatio(1)]
	} else if (mod === 2){
		return [midi + 1, Tone.intervalToFrequencyRatio(-1)]
	} else {
		return [midi, 1]
	}
}

function createSource(buffer){
	return new BufferSource(buffer)
}

function randomBetween(low, high){
	return Math.random() * (high - low) + low
}

export { midiToNote, noteToMidi, createSource, midiToFrequencyRatio, randomBetween }
