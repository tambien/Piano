import {noteToMidi, midiToNote} from './Util'

export default {

	getReleasesUrl(midi){
		return `rel${midi - 20}.mp3?${(Math.random()*100).toFixed(0)}`
	},

	getHarmonicsUrl(midi){
		return `harmL${midiToNote(midi).replace('#', 's')}.mp3?${(Math.random()*100).toFixed(0)}`
	},

	getNotesUrl(midi, vel){
		return `${midiToNote(midi).replace('#', 's')}v${vel}.mp3?${(Math.random()*100).toFixed(0)}`
	}
}
