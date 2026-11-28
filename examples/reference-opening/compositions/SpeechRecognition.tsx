import {CardEntrance, ImpactRecoil} from '../../../packages/animations/src';
import {clamp, during, mix} from '../../../packages/animations/src/reference-opening/motion';
import {NarrationWaveform, RecordingMicrophone} from './NarrationTools';

const red = '#c74751';
const coral = '#c9543e';
const green = '#399e72';
const panelColor = '#22262f';
// Horizontal recoil measured from the card accent strips at 30 FPS.
const impactOffsets = [3.85, -1.56, -2.53, 2.41, 1.15, -2.32, .11, 1.77, -.69, -.89, .78, .28, -.26];
const defaultModels = [
  {name: 'Opus', color: '#cb775f', y: 78, show: 10401, send: 10471, impact: 10490, reject: 10492, accept: 10601, transcript: '要根据配音生成SRT'},
  {name: 'Astra', color: '#4c7bbb', y: 170, show: 10424, send: 10476, impact: 10495, reject: 10497, accept: 10607, transcript: '它得借助语音识别模型'},
  {name: 'DeepSeek', color: '#5d63c9', y: 263, show: 10441, send: 10481, impact: 10499, reject: 10501, accept: 10613, transcript: '或者飞书妙记'},
];
type RecognitionModel = typeof defaultModels[number];
type RecognitionCard = Pick<RecognitionModel, 'name' | 'color'> & {transcript?: string};
export type SpeechRecognitionCards = readonly [RecognitionCard, RecognitionCard, RecognitionCard];

// Measured progress along and away from the shared speaker-height baseline.
const transcriptFlight = [
  [0, 0], [.005, 0], [.015, .005], [.035, .015], [.065, .035], [.11, .07],
  [.18, .12], [.265, .175], [.38, .25], [.51, .36], [.64, .50], [.75, .63],
  [.84, .74], [.9, .84], [.945, .92], [.98, .97], [1, 1],
] as const;

const TranscriptPackets = ({frame, models}: {frame: number; models: readonly RecognitionModel[]}) => <>
  {models.map((model, index) => {
    const start = model.accept - 18;
    if (frame < start || frame >= model.accept + 2) return null;
    const age = frame - start;
    const [forward, branch] = transcriptFlight[Math.min(age, transcriptFlight.length - 1)];
    const absorbed = during(frame, start + 13, model.accept + 1);
    const opacity = during(frame, start - 1, start + 2) * (1 - during(frame, model.accept - 1, model.accept + 2));
    return <div key={index} data-srt-transcript-packet={model.name} style={{
      position: 'absolute', left: mix(442, 582, forward) + 12 * absorbed, top: mix(207, model.y + 36, branch),
      padding: '2px 5px', borderRadius: 4, background: '#fcfcf7', color: '#30313a', whiteSpace: 'nowrap',
      fontSize: 9.6, fontWeight: 800, lineHeight: '14px', opacity, transformOrigin: 'left center',
      transform: `translate3d(0,-50%,0) scale(${mix(1, .76, absorbed)})`,
    }}>{model.transcript}</div>;
  })}
</>;

const WavePacket = ({frame, index, model}: {frame: number; index: number; model: RecognitionModel}) => {
  const flight = clamp((frame - model.send) / (model.impact - model.send));
  const recoil = during(frame, model.impact, model.impact + 10);
  const y = mix(200, model.y + 32, flight) + (index < 2 ? -48 : 23) * recoil;
  const x = mix(113, 540, flight) - 140 * recoil;
  return <div data-rejected-wave={model.name} style={{
    position: 'absolute', left: x - 27, top: y - 10, opacity: (1 - recoil) ** 1.6,
    transform: `rotate(${(index === 0 ? 25 : -25) * recoil}deg)`,
  }}>
    <NarrationWaveform width={58} height={22} step={2.7} color={coral} offset={index * 10 + 6}/>
  </div>;
};

export const SpeechRecognition = ({frame, cards}: {frame: number; cards?: SpeechRecognitionCards}) => {
  const models = cards ? defaultModels.map((model, index) => {
    const {name, color, transcript = model.transcript} = cards[index];
    return {...model, name, color, transcript};
  }) : defaultModels;
  const enterMic = during(frame, 10379, 10391);
  const bridge = during(frame, 10523, 10542);
  return <div data-speech-recognition style={{position: 'absolute', inset: 0}}>
    <RecordingMicrophone width={45} height={90} style={{
      position: 'absolute', left: 71, top: 159, opacity: enterMic,
      transform: `translate3d(${12 * (1 - enterMic)}px,0,0)`,
    }}/>
    {models.map((model, index) => frame >= model.send && frame < model.impact + 10 && <WavePacket key={index} frame={frame} index={index} model={model}/>)}
    {frame >= 10536 && <div data-srt-wave-stream style={{position: 'absolute', left: 118, top: 190, width: 188, height: 21, overflow: 'hidden', opacity: bridge}}>
      {Array.from({length: 6}, (_, i) => {
        const x = (i * 40 + (frame - 10536) * 1.32) % 240 - 34;
        return <div key={i} style={{position: 'absolute', left: x, top: 2, opacity: during(x, -5, 33) * (1 - during(x, 147, 188))}}>
          <NarrationWaveform width={33} height={16} color={coral} step={2.15} offset={i * 5 + 3}/>
        </div>;
      })}
    </div>}
    {frame >= 10523 && <CardEntrance data-srt-recognizer progress={bridge} x={316} y={137} width={135} height={126}
      borderRadius={12} fromScale={.85} offset={{x: 0, y: 0}} background={panelColor} boxShadow="0 9px 19px #30343e28">
      <div style={{position: 'absolute', left: 10, top: 38}}>
        <NarrationWaveform width={47} height={50} step={3.1} color={coral} offset={(frame - 10524) * .39}/>
      </div>
      <svg width="58" height="46" viewBox="0 0 58 46" aria-hidden="true" style={{position: 'absolute', left: 66, top: 40}}>
        <path d="M0 23h10m-4-4 4 4-4 4" fill="none" stroke="#f8f7ef" strokeWidth="1.55" strokeLinecap="round" strokeLinejoin="round"/>
        {[34, 23, 30, 14].map((w, index) => {
          const written = during(frame, 10548 + index * 5, 10556 + index * 5);
          return <rect key={index} x="21" y={5 + index * 10} width={written * (w + 3 * Math.sin(frame * .15 + index))}
            height="5" fill="#f8f7ef" rx="2.5"/>;
        })}
      </svg>
    </CardEntrance>}
    {models.map((model, index) => {
      const success = frame >= model.accept;
      const statusAt = success ? model.accept : model.reject;
      const status = during(frame, statusAt - 2, statusAt + 5);
      return <ImpactRecoil key={index} frame={frame - model.impact} samples={impactOffsets}>
        {shake => <CardEntrance data-srt-model={model.name}
          progress={during(frame, model.show, model.show + 8)} x={568 + shake} y={model.y} width={185} height={72}
          borderRadius={10} offset={{x: 21, y: 3}} background="#fcfcf7" boxShadow="0 7px 15px #30343e22">
          <div style={{position: 'absolute', left: 14, top: 21, width: 8, height: 30, background: model.color, borderRadius: 5}}/>
          <div style={{position: 'absolute', left: 31, top: 23, color: '#2a2c35', fontSize: 22, lineHeight: '27px', fontWeight: 850, transform: 'translateZ(0)'}}>{model.name}</div>
          {frame >= model.reject - 1 && <svg data-srt-status={success ? 'accepted' : 'rejected'} width="28" height="28" viewBox="0 0 28 28"
            aria-label={success ? '接收文字' : '无法直接识别'} style={{position: 'absolute', right: 14, top: 22, opacity: status, transform: `scale(${mix(.73, 1, status)})`}}>
            <circle cx="14" cy="14" r="13.5" fill={success ? green : red}/>
            <path d={success ? 'M8.8 14.8l3.8 4.5 6.5-9.7' : 'M8.8 8.8l10.4 10.4m0-10.4L8.8 19.2'} fill="none" stroke="white" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>}
        </CardEntrance>}
      </ImpactRecoil>;
    })}
    <TranscriptPackets frame={frame} models={models}/>
    {['飞书妙记', '剪映'].map((tool, i) => <CardEntrance key={tool} progress={during(frame, i === 0 ? 10637 : 10677, i === 0 ? 10645 : 10685)}
      x={290 + i * 97} y={284} width={89} height={40} borderRadius={8} offset={{x: 0, y: 9}}
      background={panelColor} boxShadow="none">
      <div style={{height: '100%', display: 'grid', placeItems: 'center', color: '#f8f7ef', fontSize: 14, fontWeight: 800, transform: 'translateZ(0)'}}>{tool}</div>
    </CardEntrance>)}
  </div>;
};
