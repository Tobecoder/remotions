import {CardEntrance, ContentCollapse} from '../../../packages/animations/src';
import {during, mix} from '../../../packages/animations/src/reference-opening/motion';
import {NarrationWaveform} from './NarrationTools';

const models = [
  ['tiny', '~1 GB', '~273 MB'],
  ['base', '~1 GB', '~388 MB'],
  ['small', '~2 GB', '~852 MB'],
  ['medium', '~5 GB', '~2.1 GB'],
  ['large-v3-turbo', '~6 GB', '未单列'],
  ['large-v3', '~10 GB', '~3.9 GB'],
] as const;

const recognitionLines = [
  {at: 10785, stamp: '00:12', width: 254},
  {at: 10811, stamp: '00:13', width: 225},
  {at: 10836, stamp: '00:14', width: 249},
  {at: 10867, stamp: '00:15', width: 176},
  {at: 10900, stamp: '06:16', width: 202},
  {at: 10930, stamp: '06:17', width: 130},
  {at: 10946, stamp: '06:18', width: 199},
  {at: 10986, stamp: '06:20', width: 178},
  {at: 11003, stamp: '06:21', width: 242},
  {at: 11029, stamp: '06:22', width: 169},
  {at: 11174, stamp: '06:24', width: 247},
  {at: 11201, stamp: '06:26', width: 209},
  {at: 11218, stamp: '06:27', width: 240},
  {at: 11242, stamp: '06:28', width: 199},
  {at: 11290, stamp: '06:30', width: 190},
];

const WhisperLaptop = ({frame}: {frame: number}) => {
  const enter = during(frame, 10754, 10762);
  const fold = during(frame, 10914, 10933);
  const name = during(frame, 10803, 10816);
  const source = during(frame, 10844, 10873);
  const label = during(frame, 10962, 11000);
  const run = during(frame, 10991, 11132);
  const lines = recognitionLines.filter(line => frame >= line.at).slice(-3);

  return <ContentCollapse data-whisper-laptop progress={fold} opacity={enter}
    from={{x: 207, y: mix(83, 72, enter), scale: 1}} to={{x: 38, y: 120, scale: .59}}>
    <div style={{
      position: 'absolute', width: 386, height: 244, borderRadius: 14, border: '10px solid #191c25',
      boxSizing: 'border-box', background: 'radial-gradient(ellipse at 49% 29%,#2b303e,#1d202a 73%)',
    }}>
      <div style={{position: 'absolute', left: 18, top: 18}}>
        <NarrationWaveform width={61} height={46} step={5.1} color="#db5743" offset={(frame - 10754) * .31}/>
      </div>
      <svg width="19" height="20" viewBox="0 0 19 20" aria-hidden="true" style={{position: 'absolute', left: 88, top: 31}}>
        <path d="M2 10h15M11 4l6 6-6 6" fill="none" stroke="#efeff0" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      <div style={{position: 'absolute', left: 117, top: 11, color: '#f9f9f9', fontSize: 35, fontWeight: 900, opacity: name}}>Whisper</div>
      <div style={{position: 'absolute', left: 118, top: 52, color: '#aab0bf', fontFamily: 'Consolas,monospace', fontSize: 12, opacity: source}}>OpenAI · open source</div>
      <div style={{position: 'absolute', left: 18, top: 85, display: 'grid', gap: 8}}>
        {lines.map(line => {
          const draw = during(frame, line.at, line.at + 9);
          return <div key={line.at} style={{display: 'flex', alignItems: 'center', gap: 8, height: 13}}>
            <span style={{color: '#9ba1ad', fontSize: 12, fontFamily: 'Consolas,monospace', opacity: draw}}>{line.stamp}</span>
            <span style={{width: line.width * draw, height: 6, background: '#d6dae4', borderRadius: 5}}/>
          </div>;
        })}
      </div>
      <div style={{position: 'absolute', left: 18, right: 18, top: 169, color: '#db6047', fontSize: 12,
        fontFamily: 'Consolas,monospace', fontWeight: 700, opacity: label}}>
        whisper.cpp · ggml-large-v3-turbo
        <div style={{height: 6, marginTop: 5, borderRadius: 5, background: '#2e303b'}}>
          <div style={{width: `${run * 100}%`, height: '100%', borderRadius: 5, background: '#d6533c'}}/>
        </div>
      </div>
    </div>
    <div style={{position: 'absolute', left: -21, top: 243, width: 428, height: 16, background: '#c8cbd4',
      borderRadius: '0 0 15px 15px', boxShadow: '0 8px 13px #30343f16'}}/>
  </ContentCollapse>;
};

const WhisperModels = ({frame}: {frame: number}) => {
  const selection = during(frame, 10963, 10974);
  return <CardEntrance data-whisper-table x={299} y={71} width={463} height={244}
    progress={during(frame, 10931, 10941)} borderRadius={11} offset={{x: 0, y: 8}}
    background="#fafbf5" boxShadow="0 13px 18px #35394422" style={{opacity: during(frame, 10931, 10941) * (1 - during(frame, 11165, 11183))}}>
    <div style={{display: 'grid', height: '100%', gridTemplateRows: '26px repeat(6,1fr)', color: '#282b35'}}>
      {[['whisper 模型', '官方原版参考显存', 'whisper.cpp 参考内存'], ...models].map((row, index) => {
        const highlight = index === 5 ? selection : 0;
        return <div key={row[0]} data-whisper-model={index ? row[0] : undefined} style={{
          display: 'grid', gridTemplateColumns: '1.4fr 1fr 1.3fr', alignItems: 'center', padding: '0 12px',
          borderBottom: index === 6 ? 0 : '1px solid #c4c7be', fontWeight: 800, position: 'relative',
          fontFamily: index ? 'Consolas, "Microsoft YaHei", monospace' : undefined, fontSize: index ? 13 : 9,
          color: index ? undefined : '#787d88', opacity: index ? during(frame, 10934 + index * 3, 10943 + index * 3) : 1,
          background: `rgba(238,193,194,${.23 * highlight})`,
        }}>
          {index === 5 && <div style={{position:'absolute',left:0,top:0,bottom:0,width:2,background:'#d15a48',opacity:highlight}}/>}
          {row.map((cell, col) => <span key={cell} style={{textAlign: col ? 'right' : 'left', whiteSpace: 'nowrap'}}>{cell}</span>)}
        </div>;
      })}
    </div>
  </CardEntrance>;
};

const terminalLines = [
  {at: 11178, span: 15, text: '> 请检查本机配置，判断适合运行哪个 Whisper 模型。', color: '#faf8f4', top: 31},
  {at: 11194, span: 12, text: '如果适合，再安装（whisper.cpp）并部署（large-v3-turbo）；', color: '#faf8f4', top: 57},
  {at: 11204, span: 14, text: '安装模型前告诉我下载大小、保存位置和预计资源占用，得到确认后再继续。', color: '#faf8f4', top: 75},
  {at: 11217, span: 12, text: '● 内存 16 GB，可运行 large-v3-turbo', color: '#a9d5ba', top: 108},
  {at: 11231, span: 12, text: '● 下载约 1.6 GB → ~/models/whisper', color: '#a9d5ba', top: 126},
  {at: 11244, span: 12, text: '继续安装? [y/N] y', color: '#faf8f4', top: 144},
  {at: 11257, span: 36, text: '$ whisper-cli -m ggml-large-v3-turbo.bin -f 旁白.wav -osrt', color: '#bfc2cc', top: 162},
  {at: 11303, span: 8, text: '✓ 旁白.srt', color: '#a9d5ba', top: 180},
];

const WhisperTerminal = ({frame}: {frame: number}) => {
  const reveals = [[11212,11216], [11225,11230], [11239,11243], [11254,11259], [11285,11291]] as const;
  const height = 119.5 + reveals.reduce((total, [start, end]) => total + 17.9 * during(frame, start, end), 0);
  return <>
    <CardEntrance data-whisper-terminal x={290} y={56} width={473} height={height}
      progress={during(frame, 11165, 11178)} offset={{x: 0, y: 4}} borderRadius={10}
      background="#1c1e27" boxShadow="0 12px 16px #282d3a22">
      <div style={{height: 19, paddingLeft: 8, background: '#242833', display: 'flex', alignItems: 'center', gap: 3}}>
        {['#ec626e', '#e7bf61', '#67bf77'].map(color => <div key={color} style={{width: 5.6, height: 5.6, borderRadius: '50%', background: color}}/>)}
      </div>
      <div style={{position: 'absolute', left: 15, right: 15, top: 99, height: .55, background: '#41434c', opacity: during(frame, 11212, 11218)}}/>
      {terminalLines.map(({at, span, text, color, top}) => {
        const typed = text.slice(0, Math.floor(text.length * during(frame, at, at + span)));
        return <div key={at} style={{
          color, position: 'absolute', left: 15, top, whiteSpace: 'nowrap',
          fontFamily: 'Consolas,"Microsoft YaHei",monospace', fontWeight: 600, fontSize: 11,
        }}>
          {typed.startsWith('>') ? <><span style={{color:'#da654e'}}>&gt;</span>{typed.slice(1)}</>
            : typed.endsWith('[y/N] y') ? <>{typed.slice(0, -1)}<span style={{color:'#da654e'}}>y</span></> : typed}
        </div>;
      })}
    </CardEntrance>
    <div style={{position: 'absolute', left: 290, top: 65 + height, fontSize: 11, fontWeight: 700,
      color: '#858a95', opacity: during(frame, 11210, 11222)}}>※ 提示词按你的实际需求调整</div>
  </>;
};

export const WhisperSetup = ({frame}: {frame: number}) => <div data-whisper-setup style={{
  position: 'absolute', inset: 0, opacity: 1 - during(frame, 11321, 11329),
}}>
  <WhisperLaptop frame={frame}/>
  {frame >= 10931 && frame < 11184 && <WhisperModels frame={frame}/>}
  {frame >= 11165 && <WhisperTerminal frame={frame}/>}
</div>;
