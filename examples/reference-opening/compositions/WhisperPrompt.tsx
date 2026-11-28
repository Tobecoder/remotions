import {Img, interpolate, staticFile} from 'remotion';
import {CardEntrance, ContentCollapse, HighlightBox, TextFlip} from '../../../packages/animations/src';
import {during} from '../../../packages/animations/src/reference-opening/motion';

const white = '#fafbf5';
const ink = '#282b35';
const coral = '#cb563f';
const textRows = [
  {text: '请根据旁白音频，生成 SRT 字幕文件：', at: 11335},
  {text: '- 参考脚本，校准识别文字；', at: 11340, highlight: 11385},
  {text: '- 按语义和停顿合理分段，多数控制在约 8–18 个汉字的宽度', at: 11345, highlight: 11703},
];

type CorrectionCopy = {time: string; before: string; error: string; correct: string; after: string};
export type WhisperCorrectionCards = readonly [CorrectionCopy, CorrectionCopy, CorrectionCopy];
type Correction = CorrectionCopy & {show: number; typeAt: number; emphasize: number; fix: number; firstGreenScale: number};

const corrections: readonly Correction[] = [
  {time: '00:05:42,180', before: '用 ', error: '瑞莫申', correct: 'Remotion', after: ' 做讲解视频', show: 11465,
    typeAt: 11467, emphasize: 11523, fix: 11630, firstGreenScale: .87},
  {time: '00:05:55,880', before: '', error: '欧帕斯', correct: 'Opus', after: '、Astra 这些模型', show: 11471,
    typeAt: 11473, emphasize: 11538, fix: 11639, firstGreenScale: .28},
  {time: '00:06:09,580', before: '根据', error: '实践戳', correct: '时间戳', after: '安排字幕', show: 11477,
    typeAt: 11479, emphasize: 11569, fix: 11649, firstGreenScale: .43},
];

const PromptCard = ({frame}: {frame: number}) => (
  <ContentCollapse data-whisper-prompt progress={during(frame, 11453, 11465)}
    from={{x: 109, y: 102, scale: 1.45}} to={{x: 41, y: 60, scale: 1}}>
    <CardEntrance x={0} y={0} width={402} height={112} progress={during(frame, 11325, 11336)}
      borderRadius={11} background={white} boxShadow="0 12px 18px #31374622" offset={{x: 0, y: 7}}>
      <div style={{height: 25, paddingLeft: 12, borderBottom: '1px solid #c6c8bf', display: 'flex', alignItems: 'center',
        gap: 6, fontSize: 9, color: '#777e89'}}>
        <span style={{fontFamily:'Consolas,monospace', color:coral, fontWeight:900, letterSpacing:1.2}}>PROMPT</span> 提示词
      </div>
      <div style={{padding: '10px 8px', color: ink, fontSize: 12.8, fontWeight: 550, fontFamily: 'Consolas,"Microsoft YaHei",monospace'}}>
        {textRows.map((row, i) => {
          const write = during(frame, row.at, row.at + 11);
          const highlight = row.highlight === undefined ? 0 : during(frame, row.highlight, row.highlight + 7);
          return <div key={row.at} data-whisper-prompt-line={i} style={{
            position: 'relative', height: 21, paddingLeft: 6, display: 'flex', alignItems: 'center',
            borderRadius: 2, background: `rgba(236,180,185,${.23 * highlight})`, whiteSpace: 'nowrap',
          }}>
            {highlight > 0 && <div style={{position:'absolute',left:0,top:0,bottom:0,width:2,borderRadius:'2px 0 0 2px',background:coral,opacity:highlight}}/>}
            {row.text.slice(0, Math.floor(row.text.length * write))}
          </div>;
        })}
      </div>
    </CardEntrance>
  </ContentCollapse>
);

const ScriptSheet = ({frame}: {frame: number}) => {
  if (frame < 11609 || frame >= 11646) return null;
  const extrapolate = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
  const x = interpolate(frame,
    [11609, 11613, 11618, 11622, 11626, 11629, 11630, 11632, 11636, 11640, 11643, 11645],
    [282, 287, 307, 357, 419, 477, 497, 535, 596, 646, 662, 666], extrapolate);
  const angle = interpolate(frame, [11609, 11618, 11629, 11643], [8, -3, -1, -3], extrapolate);
  return <div data-whisper-script-sheet style={{
    position: 'absolute', left: x, top: 65, width: 126, height: 203,
    background: '#faf9f2', borderRadius: 7, boxShadow: '0 10px 18px #34343d30',
    transform: `rotate(${angle}deg)`, opacity: during(frame, 11609, 11617),
    padding: '12px 11px', boxSizing: 'border-box',
  }}>
    <div style={{color: coral, fontWeight: 850, fontSize: 12, fontFamily: 'Consolas,"Microsoft YaHei",monospace'}}>脚本.md</div>
    <div style={{display: 'grid', gap: 7, marginTop: 6}}>
      {[68,86,75,84,82,91,88,80,70,88,65,81].map((width, i) =>
        <div key={i} style={{width, height: 4, borderRadius: 3, background: '#d0d3cc'}}/>)}
    </div>
  </div>;
};

const CorrectionLine = ({frame, line}: {frame: number; line: Correction}) => {
  const {before, error, correct, after, typeAt, emphasize, fix, firstGreenScale} = line;
  const corrected = frame >= fix;
  const visible = Math.max(0, Math.floor((frame - typeAt + 1) * .75));
  const highlighted = 1 + .11 * during(frame, emphasize, emphasize + 7);
  return <div style={{position: 'absolute', left: 11, top: 23, fontSize: 16.2, fontWeight: 900, color: ink, whiteSpace: 'nowrap'}}>
    {before.slice(0, visible)}
    <TextFlip data-whisper-correction-word={corrected ? 'corrected' : 'mistake'}
      frame={frame - fix} before={error.slice(0, Math.max(0, visible - before.length))} after={correct}
      beforeScale={highlighted} firstAfterScale={firstGreenScale}
      beforeStyle={{color:'#bd4658', textDecoration:'underline wavy #bd4658', textDecorationThickness:'1.8px', textUnderlineOffset:'2px'}}
      afterStyle={{color:'#369870', textDecoration:'none', textDecorationThickness:'1.8px', textUnderlineOffset:'2px'}}/>
    {after.slice(0, Math.max(0, visible - before.length - error.length))}
  </div>;
};

const CorrectionCards = ({frame, copy}: {frame: number; copy?: WhisperCorrectionCards}) => <div style={{
  position: 'absolute', inset: 0, opacity: 1 - during(frame, 11700, 11711),
}}>
  {corrections.map((defaultLine, i) => {
    const line = copy ? {...defaultLine, ...copy[i]} : defaultLine;
    return <CardEntrance key={i} data-whisper-correction={frame >= line.fix ? 'corrected' : 'mistake'}
      x={451} y={77 + i * 63} width={308} height={50} progress={during(frame, line.show, line.show + 7)}
      background={white} borderRadius={8} offset={{x: 11, y: 5}} boxShadow="0 5px 9px #30343b16">
      <div style={{position: 'absolute', left: 11, top: 8, font: '9px Consolas,monospace', color: '#787c88'}}>{line.time}</div>
      <CorrectionLine frame={frame} line={line}/>
    </CardEntrance>;
  })}
  <ScriptSheet frame={frame}/>
</div>;

const SubtitleWidthExample = ({frame}: {frame: number}) => {
  const first = '但也有人说他光做一个音符跳跃的动画';
  const second = '就蹬完了一周的额度。';
  const single = frame >= 11854;
  const doubleOutline = during(frame, 11813, 11820) * (1 - during(frame, 11849, 11855));
  return <>
    <CardEntrance data-whisper-srt-sample x={451} y={60} width={308} height={100}
      progress={during(frame, 11759, 11772)} borderRadius={8} offset={{x: 8, y: 4}}
      boxShadow="0 8px 13px #34363b1f">
      <div style={{display:'grid',height:'100%',padding:'4px 12px',boxSizing:'border-box',
        color:'#22252b',fontFamily:'Consolas,"Microsoft YaHei",monospace',fontSize:13.1}}>
        {['15', '00:00:31,870 --> 00:00:35,910', first, second].map((text, i) => (
          <div key={text} style={{display:'grid',gridTemplateColumns:'32px 1fr',alignItems:'center'}}>
            <span style={{color:'#646970'}}>{57 + i}</span><span>{text}</span>
          </div>
        ))}
      </div>
    </CardEntrance>
    {frame >= 11809 && <CardEntrance data-whisper-caption-preview x={451} y={178} width={308} height={174}
      progress={during(frame, 11809, 11819)} borderRadius={8} offset={{x: 0, y: 9}}
      background="#dddce1" boxShadow="0 9px 13px #34363b20">
      <Img src={staticFile('whisper/subtitle-preview.jpg')} style={{display:'block',width:'100%',height:139.6}}/>
      <div data-whisper-caption-lines={single ? 1 : 2} style={{
        position:'absolute', left:'50%', bottom:single ? 10 : 9, transform:'translateX(-50%)',
        width:single ? 126 : 188, height:single ? 23 : 40, display:'grid', placeContent:'center',
        background:'#2b3041', borderRadius:5, color:'white', textAlign:'center', fontSize:11.4,
        fontWeight:900, lineHeight:'16px', whiteSpace:'nowrap',
      }}>{single ? second : <>但也有人说他光做一个音符跳跃的<br/>动画{second}</>}</div>
      {doubleOutline > 0 && <HighlightBox progress={doubleOutline} x={60} y={125} width={188} height={40}
        radius={5} color="#d45160" strokeWidth={1.8} shadowColor="transparent"/>}
    </CardEntrance>}
  </>;
};

export const WhisperPrompt = ({frame, correctionCopy}: {frame: number; correctionCopy?: WhisperCorrectionCards}) => <div data-whisper-prompt-scene style={{position:'absolute',inset:0}}>
  <PromptCard frame={frame}/>
  {frame >= 11465 && frame < 11711 && <CorrectionCards frame={frame} copy={correctionCopy}/>}
  {frame >= 11759 && <SubtitleWidthExample frame={frame}/>}
</div>;
