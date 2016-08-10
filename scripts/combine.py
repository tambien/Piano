from pydub import AudioSegment
import re
import os
from music21 import pitch

salamander_folder = '../original/'
output_folder = '../Salamander/'

# first the hammer notes at 6 velocities
hammers = []
# velocities = ['1','4','7','10','13','16']
velocities = ['1','4','8','12','16']
# velocities = ['1']
for f in os.listdir(salamander_folder):
    if re.match(r'(A|C|D#|F#)[0-9]v('+'|'.join(velocities)+')\.wav', f):
        hammers.append(f)


# then the release harmonics
releases = []
for f in os.listdir(salamander_folder):
    if re.match(r'harmL(A|C|D#|F#)[0-9]\.wav', f):
        releases.append(f)


# then the hammer clicks
hammerclicks = []
for f in os.listdir(salamander_folder):
    if re.match(r'rel\d+.wav', f):
        hammerclicks.append(f)
hammerclicks = sorted(hammerclicks, lambda a, b: int(re.search(r'\d+', a).group()) - int(re.search(r'\d+', b).group()))

# keep only every 3rd
hammerclicks = [hammerclicks[i] for i in range(len(hammerclicks)) if (i % 3) == 0 ]


# then the pedals
pedals = []
for f in os.listdir(salamander_folder):
    if re.match(r'pedal(U|D)1\.wav', f):
        pedals.append(f)

# combine them into one file
output_map = {}
output_audio = AudioSegment.empty()

def note_to_midi(note_name):
    return str(pitch.Pitch(note_name).midi)

output_map['notes'] = {}
for h in hammers:
    vel = re.match(r'.+v(\d+)\.wav', h).group(1)
    vel_i = velocities.index(vel)
    # replace the first part with the note name
    midi = note_to_midi(h[:h.index('v')])
    if str(midi) not in output_map['notes']:
        output_map['notes'][str(midi)] = [0]*len(velocities)
        
    output_map['notes'][str(midi)][vel_i] = {}
    output_map['notes'][str(midi)][vel_i]['start'] = output_audio.duration_seconds
    audio_seg = AudioSegment.from_wav(salamander_folder + h)
    output_audio += audio_seg
    output_map['notes'][str(midi)][vel_i]['duration'] = audio_seg.duration_seconds

output_map['harmonics'] = {}
for r in releases:
    r_note = r[5:-4]
    midi = note_to_midi(r_note)
    output_map['harmonics'][midi] = {'start' : output_audio.duration_seconds}
    audio_seg = AudioSegment.from_wav(salamander_folder + r)
    output_audio += audio_seg
    output_map['harmonics'][midi]['duration'] = audio_seg.duration_seconds

output_map['hammers'] = {}
for k in hammerclicks:
    midi = str(int(k[3:-4]) + 20)
    output_map['hammers'][midi] = {'start' : output_audio.duration_seconds}
    audio_seg = AudioSegment.from_wav(salamander_folder + k)
    output_audio += audio_seg
    output_map['hammers'][midi]['duration'] = audio_seg.duration_seconds

output_map['pedals'] = {}
for p in pedals:
    direction = 'up' if 'U' in p else 'down'
    output_map['pedals'][direction] = {'start' : output_audio.duration_seconds}    
    audio_seg = AudioSegment.from_wav(salamander_folder + p)
    output_audio += audio_seg
    output_map['pedals'][direction]['duration'] = audio_seg.duration_seconds


# write the output
import json
with open(output_folder + 'spritemap.json', 'w') as out_json:
    json.dump(output_map, out_json)

output_audio.export(output_folder + 'Salamander.wav', format='wav')
