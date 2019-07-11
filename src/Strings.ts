import * as Tone from 'tone'
import {getNotesInRange, velocitiesMap} from './Salamander'
import {String} from './String'

type StringsOptions = { minNote: number, maxNote: number, velocities: number, samples: string }

/**
 *  Manages all of the hammered string sounds
 */
export class Strings extends Tone.AudioNode {
    
    output: Tone.ProcessingNode
    _velocities: number[];
    _strings: String[];
    _activeNotes: Map<number, String>;
    
    constructor({minNote, maxNote, velocities = 1, samples = './audio/'}: StringsOptions) {
        super()
        this.createInsOuts(0, 1)
        
        const notes = getNotesInRange(minNote, maxNote)
        
        this._velocities = velocitiesMap[velocities].slice()
        
        this._strings = this._velocities.map(velocity => {
            const string = new String(notes, velocity, samples)
            string.connect(this.output)
            return string
        })
        
        this._activeNotes = new Map()
        
    }
    
    scale(val: number, inMin: number, inMax: number, outMin: number, outMax: number): number {
        return ((val - inMin) / (inMax - inMin)) * (outMax - outMin) + outMin
    }
    
    triggerAttack(note: number, time: number, velocity: number) {
        const scaledVel = this.scale(velocity, 0, 1, -0.5, this._strings.length - 0.51)
        const stringIndex = Math.max(Math.round(scaledVel), 0)
        let gain = 1 + scaledVel - stringIndex
        
        if (this._strings.length === 1) {
            gain = velocity
        }
        
        const sampler = this._strings[stringIndex]
        
        if (this._activeNotes.has(note)) {
            this.triggerRelease(note, time)
        }
        
        this._activeNotes.set(note, sampler)
        sampler.triggerAttack(Tone.Midi(note), time, gain)
    }
    
    triggerRelease(note: number, time: number) {
        //trigger the release of all of the notes at that velociy
        if (this._activeNotes.has(note)) {
            this._activeNotes.get(note).triggerRelease(Tone.Midi(note), time)
            this._activeNotes.delete(note)
        }
    }
    
    async load(): Promise<void> {
        await Promise.all(this._strings.map(s => s.load()))
    }
}
