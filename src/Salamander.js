import Tone from 'Tone/core/Tone'
import Frequency from 'Tone/type/Frequency'
import Buffers from 'Tone/core/Buffers'
import BufferSource from 'Tone/source/BufferSource'

function noteToMidi(note){
	return Frequency(note).toMidi()
}

function midiToNote(midi){
	let mod = midi % 3
	if (mod === 1){
		return [midi - 1, Tone.prototype.intervalToFrequencyRatio(1)]
	} else if (mod === 2){
		return [midi + 1, Tone.prototype.intervalToFrequencyRatio(-1)]
	} else {
		return [midi, 1]
	}
}

function clone(obj){
	let ret = {}
	for (let attr in obj){
		ret[attr] = obj[attr]
	}
	return ret
}

const velocitiesMap = {
	1  : [8],
	2  : [6, 12],
	3  : [1, 8, 15],
	4  : [1, 5, 10, 15],
	5  : [1, 4, 8, 12, 16],
	6  : [1, 3, 7, 10, 13, 16],
	7  : [1, 3, 6, 9, 11, 13, 16],
	8  : [1, 3, 5, 7, 9, 11, 13, 15],
	9  : [1, 3, 5, 7, 9, 11, 13, 15, 16],
	10 : [1, 2, 3, 5, 7, 9, 11, 13, 15, 16],
	11 : [1, 2, 3, 5, 7, 9, 11, 13, 14, 15, 16],
	12 : [1, 2, 3, 4, 5, 7, 9, 11, 13, 14, 15, 16],
	13 : [1, 2, 3, 4, 5, 7, 9, 11, 12, 13, 14, 15, 16],
	14 : [1, 2, 3, 4, 5, 6, 7, 9, 11, 12, 13, 14, 15, 16],
	15 : [1, 2, 3, 4, 5, 6, 7, 9, 10, 11, 12, 13, 14, 15, 16],
	16 : [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16],
}

const notes = ['A0', 'C1', 'D#1', 'F#1', 'A1', 'C2', 'D#2', 'F#2', 'A2', 'C3', 'D#3', 'F#3', 'A3', 'C4', 'D#4', 'F#4', 'A4', 'C5', 'D#5', 'F#5', 'A5', 'C6', 'D#6', 'F#6', 'A6', 'C7', 'D#7', 'F#7', 'A7', 'C8']
const harmonics = ['A0', 'C1', 'D#1', 'F#1', 'A1', 'C2', 'D#2', 'F#2', 'A2', 'C3', 'D#3', 'F#3', 'A3', 'C4', 'D#4', 'F#4', 'A4', 'C5', 'D#5', 'F#5', 'A5', 'C6', 'D#6']
console.log(harmonics.sort((a, b) => noteToMidi(a) - noteToMidi(b)))
const pedals = ['pedalU1', 'pedalD1']
const releases = []
for (let i = 0; i < 88; i++){
	releases[i] = 'rel'+(i + 1)
}


export default {

	velocityCount : 0,

	buffer : null,

	harmonics : null,

	notes : null,

	releases : null,

	newSource(buffer){
		return new BufferSource(buffer)
	},

	loadHarmonics(baseUrl){
		return new Promise((success) => {
			const loadObj = {}
			harmonics.forEach((note) => {
				loadObj[noteToMidi(note)] = `harmL${encodeURIComponent(note)}.mp3`
			})
			this.harmonics = new Buffers(loadObj, success, baseUrl)
		})
	},

	loadReleases(baseUrl){
		return new Promise((success) => {			
			const loadObj = {}
			for (let i = 0; i < 88; i++){
				loadObj[i + 21] = `rel${i+1}.mp3`
			}
			this.releases = new Buffers(loadObj, success, baseUrl)
		})
	},

	loadPedals(baseUrl){
		return new Promise((success) => {			
			this.pedals = new Buffers({
				up : 'pedalU1.mp3',
				down : 'pedalD1.mp3'
			}, success, baseUrl)
		})
	},

	loadNotes(baseUrl, velocities){
		const promises = []
		this.notes = []
		velocities.forEach((vel, i) => {
			let prom = new Promise((success) => {
				const loadObj = {}
				notes.forEach((note) => {
					loadObj[noteToMidi(note)] = `${encodeURIComponent(note)}v${vel}.mp3`
				})
				this.notes[i] = new Buffers(loadObj, success, baseUrl)
			})
			promises.push(prom)
		})
		return Promise.all(promises)
	},

	load(url, velocities=1){
		this.velocityCount = velocities
		return Promise.all([this.loadHarmonics(url), this.loadNotes(url, velocitiesMap[velocities]), this.loadReleases(url), this.loadPedals(url)])
	},

	getNote(midi, velocity){
		let [note, rate] = midiToNote(midi)
		const source = this.newSource(this.notes[velocity].get(note))
		source.playbackRate.value = rate
		return source
	},

	getPedal(direction){
		const ratePermutation = 0.01
		const randomPermutation = Math.random() * ratePermutation * 2 - ratePermutation + 1
		const source = this.newSource(this.pedals.get(direction))
		source.playbackRate.value = Math.random() * ratePermutation * 2 - ratePermutation + 1
		return source
	},

	hasHarmonics(midi){
		let [note, rate] = midiToNote(midi)
		return this.harmonics.has(note)
	},

	getHarmonics(midi){
		let [note, rate] = midiToNote(midi)
		const source = this.newSource(this.harmonics.get(note))
		source.playbackRate.value = rate
		return source
	},

	getRelease(midi){
		const source = this.newSource(this.releases.get(midi))
		return source
	}
}