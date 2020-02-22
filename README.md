![Piano Logo with keyboard and knobs](./tone-piano.png)

# @tonejs/piano

Tone Piano is a Web Audio instrument which uses high-quality multi-sampled piano sounds provided by [Salamander Grand Piano](https://archive.org/details/SalamanderGrandPianoV3) 

It has up to 16 velocity levels across 88 keys (sampled every third note) of a Yamaha C5. 

## Install

Install the npm package:

```
npm install --save @tonejs/piano
```

Tone Piano requires Tone.js as a peer dependency (and webmidi to use MidiKeyboard):

```
npm install --save tone
# optional
npm install --save webmidi
```


## Usage

### Import

Using CommonJS:

```js
const Piano = require('@tonejs/piano');
```

Using ES6 modules:

```js
import { Piano } from '@tonejs/piano'
```

### Create and load samples


```javascript
// create the piano and load 5 velocity steps
const piano = new Piano({
	velocities: 5
})

//connect it to the speaker output
piano.toDestination()
```

All of the samples are loaded with the `load()` method which returns a promise

```javascript
piano.load().then(() => {
	console.log('loaded!')
})
```

## API reference

Once the samples are loaded, it exposes 4 methods for playing the notes:


### `.keyDown(note: string, time?: Time, velocity?: number)`

Press a note down on the piano. Optionally give it a time using Tone.js time notation or seconds relative to the AudioContext clock.

The velocity is a value between 0-1. 

```javascript
//play a 'C4' 1 second from now
piano.keyDown('C4', '+1')
```

### `.keyUp(note: string, time?: Time)`

Release a note at the given time. 

```javascript
//release the pressed 'C4' immediately
piano.keyUp('C4')
```

### `.pedalDown(time?: Time)`

Press and hold the pedal starting at the given time. While the pedal is down, notes scheduled after the time will be sustained and released once the pedal is lifted.

### `.pedalUp(time?: Time)`

Release the pedal and also dampen any notes which are currently sustained. 