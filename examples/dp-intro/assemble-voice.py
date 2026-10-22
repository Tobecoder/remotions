from pathlib import Path
import array
import hashlib
import json
import math
import wave
import prepare

prepare.stage.require(prepare.ROOT,'production')
root=prepare.ROOT
segments=json.loads((root/'assets/voice-segments.json').read_text(encoding='utf-8'))
rate=16000
chunks=[b'\0\0'*int(rate*.5)]
position=int(rate*.5)
cues=[]
words=[]
scenes=[]
for segment in segments:
    path=root/f"work/voice/{segment['id']}.wav"
    with wave.open(str(path),'rb') as audio:
        assert (audio.getframerate(),audio.getnchannels(),audio.getsampwidth())==(rate,1,2)
        pcm=audio.readframes(audio.getnframes())
    start=position/rate
    chunks.append(pcm)
    position+=len(pcm)//2
    end=position/rate
    cues.append({'id':segment['id'],'scene':segment['scene'],'text':segment['text'],'spoken':segment['spoken'],'start':start,'end':end,'sampleStart':round(start*rate),'sampleEnd':position})
    marks=json.loads((root/f"work/voice/{segment['id']}.json").read_text(encoding='utf-8-sig'))
    words.extend([{**mark,'audioSeconds':start+mark['milliseconds']/1000,'cue':segment['id']} for mark in marks])
    gap=.07
    if segment is segments[-1] or segments[segments.index(segment)+1]['scene']!=segment['scene']:
        gap=4.0 if segment is segments[-1] else 1.0
        begin=0 if segment['scene']==0 else scenes[-1]['endFrame']
        finish=math.ceil((end+gap)*30)
        scenes.append({'id':f"S{segment['scene']+1:02}",'index':segment['scene'],'startFrame':begin,'endFrame':finish,'durationInFrames':finish-begin})
        gap=finish/30-end
    chunks.append(b'\0\0'*round(rate*gap))
    position+=round(rate*gap)
public=root/'public/audio'
public.mkdir(parents=True,exist_ok=True)
with wave.open(str(public/'narration.wav'),'wb') as out:
    out.setparams((1,2,rate,0,'NONE','not compressed'))
    out.writeframes(b''.join(chunks))
timing={'fps':30,'durationInFrames':scenes[-1]['endFrame'],'durationInSeconds':position/rate,'sampleRate':rate,'sampleCount':position,'provider':'windows-system-speech','voice':'Microsoft Huihui Desktop','timingSource':'Actual WAV sample boundaries per synthesized phrase; word starts from SpeechSynthesizer SpeakProgress.AudioPosition, not estimated ASR.','audioSha256':hashlib.sha256((public/'narration.wav').read_bytes()).hexdigest(),'scenes':scenes,'cues':cues,'wordMarks':words}
prepare.save(root/'timing.json',timing)
prepare.save(root/'public/timing.json',timing)
board=prepare.stage.read(root/'composition.json')
board['duration_frames']=timing['durationInFrames']
for shot,scene in zip(board['shots'],scenes):
    shot['start_frame']=scene['startFrame'];shot['end_frame']=scene['endFrame']
board['audio_tracks']=[{'path':'public/audio/narration.wav','start_frame':0,'end_frame':timing['durationInFrames'],'gain':1}]
prepare.stage.save(root/'composition.json',board)
prepare.stage.require(root,'production')
def stamp(seconds):
    t=round(seconds*1000)
    return f'{t//3600000:02}:{t//60000%60:02}:{t//1000%60:02},{t%1000:03}'
(root/'narration.srt').write_text('\n\n'.join(f"{i+1}\n{stamp(c['start'])} --> {stamp(c['end'])}\n{c['text']}" for i,c in enumerate(cues))+'\n',encoding='utf-8')
samples=array.array('h',b''.join(chunks))
print(json.dumps({'seconds':timing['durationInSeconds'],'frames':timing['durationInFrames'],'cues':len(cues),'actualWordStarts':len(words),'peak':max(abs(v) for v in samples),'scenes':scenes},ensure_ascii=False,indent=2))
