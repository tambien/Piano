import { midiToNote } from './Util'

export const githubURL = 'https://tambien.github.io/Piano/Salamander/'

export function getReleasesUrl(midi){
	return `rel${midi - 20}.[mp3|ogg]`
}

export function getHarmonicsUrl(midi){
	return `harmL${midiToNote(midi).replace('#', 's')}.[mp3|ogg]`
}

export function getNotesUrl(midi, vel){
	return `${midiToNote(midi).replace('#', 's')}v${vel}.[mp3|ogg]`
}
