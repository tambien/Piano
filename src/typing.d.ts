declare interface PianoOptions {
    velocities : number,
    minNote : number,
    maxNote : number,
    release : boolean,
    pedal : boolean,
    samples : string,
    volume : {
        pedal : number,
        strings : number,
        keybed : number,
        harmonics : number
    }
}
