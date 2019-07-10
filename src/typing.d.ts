declare interface ToneOptions {
    //one velocity
    velocities : number,
    //full range 88 keys
    minNote : number,
    maxNote : number,
    //default to no release sounds
    release : boolean,
    //include pedal sounds by default
    pedal : boolean,
    //the folder with all the piano samples
    samples : string,
    //the initial volumes
    volume : {
        pedal : number,
        strings : number,
        keybed : number,
        harmonics : number
    }
}
