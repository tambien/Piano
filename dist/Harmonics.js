import { Sampler, Midi, AudioNode } from 'tone';
import { getHarmonicsInRange, getHarmonicsUrl, inHarmonicsRange } from './Salamander';
import { randomBetween } from './Util';
export class Harmonics extends AudioNode {
    constructor({ minNote, maxNote, release, samples }) {
        super();
        this.createInsOuts(0, 1);
        this._harmonicsSound = release;
        const urls = {};
        const notes = getHarmonicsInRange(minNote, maxNote);
        for (let n of notes) {
            urls[n] = getHarmonicsUrl(n);
        }
        if (this._harmonicsSound) {
            this._loaded = new Promise(onload => {
                this._sampler = new Sampler(urls, { onload, baseUrl: samples }).connect(this.output);
            });
        }
        else {
            this._loaded = Promise.resolve();
        }
    }
    triggerAttack(note, time, velocity) {
        if (this._harmonicsSound && inHarmonicsRange(note)) {
            this._sampler.triggerAttack(Midi(note), time, velocity * randomBetween(0.5, 1));
        }
    }
    load() {
        return this._loaded;
    }
}
//# sourceMappingURL=Harmonics.js.map