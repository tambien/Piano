import {noteToMidi, midiToNote} from './Util'

export default {

	getReleasesUrl(midi){
		return `rel${midi - 20}.[mp3|ogg]`
	},

	getHarmonicsUrl(midi){
		return `harmL${midiToNote(midi).replace('#', 's')}.[mp3|ogg]`
	},

	getNotesUrl(midi, vel){
		return `${midiToNote(midi).replace('#', 's')}v${vel}.[mp3|ogg]`
	}
}
