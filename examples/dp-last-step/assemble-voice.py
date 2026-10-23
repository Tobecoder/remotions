"""Assemble original-speed local speech into exactly 600 frames."""
from pathlib import Path
import array
import hashlib
import json
import wave
import prepare

prepare.stage.require(prepare.ROOT,'production')
root=prepare.ROOT
rate=16000
segments=json.loads((root/'assets/voice-segments.json').read_text(encoding='utf-8'))
chunks=[b'\0\0'*int(rate*.45)]
position=int(rate*.45)
cues=[]
marks=[]
for i,segment in enumerate(segments):
    with wave.open(str(root/f"work/voice/{segment['id']}.wav"),'rb') as source:
        assert (source.getframerate(),source.getnchannels(),source.getsampwidth())==(rate,1,2)
        pcm=source.readframes(source.getnframes())
    start=position/rate
    chunks.append(pcm)
    position+=len(pcm)//2
    cue={**segment,'start':start,'end':position/rate,'sampleStart':round(start*rate),'sampleEnd':position}
    cues.append(cue)
    raw=json.loads((root/f"work/voice/{segment['id']}.json").read_text(encoding='utf-8-sig'))
    marks.extend([{**mark,'cue':segment['id'],'audioSeconds':start+mark['milliseconds']/1000} for mark in raw])
    if i<len(segments)-1:
        gap=round(rate*.15)
        chunks.append(b'\0\0'*gap);position+=gap
spokenEnd=position/rate
assert position<=rate*20, f'Original-speed narration takes {spokenEnd:.2f}s; shorten copy instead of speeding it up.'
chunks.append(b'\0\0'*(rate*20-position))
out=root/'public/audio/narration.wav'
out.parent.mkdir(parents=True,exist_ok=True)
with wave.open(str(out),'wb') as target:
    target.setparams((1,2,rate,0,'NONE','not compressed'))
    target.writeframes(b''.join(chunks))
timing={'fps':30,'durationInFrames':600,'durationInSeconds':20,'sampleRate':rate,'sampleCount':rate*20,'spokenEndSeconds':spokenEnd,'tailHoldSeconds':20-spokenEnd,'voice':'Microsoft Huihui Desktop','timingSource':'Actual PCM sample counts; SAPI SpeakProgress word offsets, no estimated ASR. Original speed preserved.','audioSha256':hashlib.sha256(out.read_bytes()).hexdigest(),'cues':cues,'wordMarks':marks}
prepare.save('timing.json',timing)
board=prepare.stage.read(root/'composition.json')
board['audio_tracks']=[{'path':'public/audio/narration.wav','start_frame':0,'end_frame':600,'gain':1}]
prepare.stage.save(root/'composition.json',board)
def stamp(sec):
    m=round(sec*1000)
    return f'{m//3600000:02}:{m//60000%60:02}:{m//1000%60:02},{m%1000:03}'
(root/'narration.srt').write_text('\n\n'.join(f"{i+1}\n{stamp(c['start'])} --> {stamp(c['end'])}\n{c['text']}" for i,c in enumerate(cues))+'\n',encoding='utf-8',newline='\n')
prepare.stage.require(root,'production')
print(json.dumps({'spokenEndSeconds':spokenEnd,'holdSeconds':20-spokenEnd,'peak':max(abs(v) for v in array.array('h',b''.join(chunks))),'cues':[{'id':c['id'],'start':c['start'],'end':c['end']} for c in cues]},indent=2))
