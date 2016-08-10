import Piano from 'Piano'
import Master from 'Tone/core/Master'
import Buffer from 'Tone/core/Buffer'
import MidiConvert from 'midiconvert'
import Part from 'Tone/event/Part'
import Transport from 'Tone/core/Transport'

var piano = new Piano().toMaster()

piano.load('./Salamander/Salamander.mp3').then(()=>{
	//make the button active on load
	let button = document.querySelector('button')
	button.classList = 'active'
})

/**
 *  LOADING BAR
 */
Buffer.on('progress', (prog) => {
	document.querySelector('#loading #fill').style.width = (prog * 100).toString() + '%'
})

Buffer.on('load', (prog) => {
	document.querySelector('#loading').remove()
})

/**
 *  MIDI FILE
 */
MidiConvert.load('clair_de_lune.mid', (midi) => {

	function playNote(time, event){
		piano.keyDown(event.note, event.velocity, time).keyUp(event.note, time + event.duration)
	}

	Transport.set(midi.transport)

	//schedule the pedal
	let sustain = new Part((time, event) => {
		if (event.value){
			piano.pedalDown(time)
		} else {
			piano.pedalUp(time)
		}
	}, midi.tracks[0].sustain).start(0)

	let noteOffEvents = new Part((time, event) => {
		piano.keyUp(event.midi, time)
	}, midi.tracks[0].noteOffs).start(0)
	
	let noteOnEvents = new Part((time, event) => {
		piano.keyDown(event.midi, event.velocity, time)
	}, midi.tracks[0].notes).start(0)
	
})

/**
 *  VOLUME CONTROLS
 */
window.addEventListener('DOMContentLoaded', () => {
	let inputs = document.querySelectorAll('input')
	for (let input of inputs){
		input.addEventListener('input', (e) => {
			piano.setVolume(e.target.name, e.target.value)
		})
	}

	let button = document.querySelector('button')
	button.addEventListener('click', (e) => {
		if (Transport.state === 'started'){
			Transport.pause()
			button.textContent = 'START'
		} else {
			Transport.start()
			button.textContent = 'PAUSE'
		}
	})
})


/**
 *  MIDI INPUT
 */
function parseInput(message){
	let note;
	if (message[0] === 176 && message[1] == 64){
		if (message[2] > 0){
			piano.pedalDown()
		} else {
			piano.pedalUp()
		}
	} else if (message[0] === 128){ //noteOff
		piano.keyUp(message[1])
	} else if (message[0] === 144){ //noteOn
		piano.keyDown(message[1], message[2] / 127)
	}
}

if (navigator.requestMIDIAccess) {
    navigator.requestMIDIAccess().then((midiAccess) => {
    	midiAccess.inputs.forEach((input) => {
    		input.addEventListener('midimessage', (e) => {
    			parseInput(e.data)
    		})
    	});
    });
}