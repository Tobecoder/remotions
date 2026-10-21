import {LiquidContours, MirroredSpectrum, MovingWaves, MovingZigzags, Oscilloscope, ParticleField, PulseRings, RotatingStarburst, ShimmerSweep, VoiceNote} from '@remotions/animations';
import {staticFile} from 'remotion';

export type DemoId = 'oscilloscope' | 'spectrum' | 'voice' | 'liquid-contours' | 'moving-waves' | 'moving-zigzags' | 'rotating-starburst' | 'pulse-rings' | 'particle-field' | 'shimmer-sweep';
export type CategoryId = 'audio' | 'captions' | 'backgrounds' | 'effects' | 'layouts';
export type CatalogCategory = {
  id: CategoryId;
  name: string;
  description: string;
  status: 'active' | 'coming-soon';
};
export type Demo = {
  id: DemoId;
  category: CategoryId;
  name: string;
  componentName: string;
  description: string;
  useCase: string;
  color: string;
  tag: string;
};

/** Categories are intentionally independent from the demo list so new families can be added without changing the page layout. */
export const categories: CatalogCategory[] = [
  {id: 'audio', name: '音频动画', description: '让声音驱动画面', status: 'active'},
  {id: 'captions', name: '字幕动画', description: '文字跟着时间出现', status: 'coming-soon'},
  {id: 'backgrounds', name: '背景特效', description: '可循环的氛围背景', status: 'active'},
  {id: 'effects', name: '视觉效果', description: '光、粒子与形变', status: 'active'},
  {id: 'layouts', name: '版式转场', description: '可复用的镜头结构', status: 'coming-soon'},
];

export const catalog: Demo[] = [
  {id: 'oscilloscope', category: 'audio', name: '示波曲线', componentName: 'Oscilloscope', description: '将声音的起伏绘成连续光轨', useCase: '音乐开场 · 声音实验', color: '#2563eb', tag: '01'},
  {id: 'spectrum', category: 'audio', name: '镜像频谱', componentName: 'MirroredSpectrum', description: '按真实频段绘制上下对称的律动', useCase: '音乐视频 · 节奏展示', color: '#2563eb', tag: '02'},
  {id: 'voice', category: 'audio', name: '语音波形', componentName: 'VoiceNote', description: '把语音或音频片段变成消息卡片', useCase: '播客片段 · 对话演绎', color: '#2563eb', tag: '03'},
  {id: 'liquid-contours', category: 'backgrounds', name: '液态轮廓', componentName: 'LiquidContours', description: '双色轮廓带缓慢流动，铺出柔和氛围', useCase: '品牌背景 · 氛围铺底', color: '#70b7e8', tag: '01'},
  {id: 'moving-waves', category: 'backgrounds', name: '流动波浪', componentName: 'MovingWaves', description: '多层波浪持续向上流动，适合循环使用', useCase: '音乐视频 · 开场铺底', color: '#70b7e8', tag: '02'},
  {id: 'moving-zigzags', category: 'backgrounds', name: '折线流动', componentName: 'MovingZigzags', description: '重复折线向上漂移，增加画面的节奏和方向感', useCase: '科技背景 · 节奏铺底', color: '#70b7e8', tag: '03'},
  {id: 'rotating-starburst', category: 'backgrounds', name: '旋转星芒', componentName: 'RotatingStarburst', description: '放射光束缓慢旋转，制造能量聚焦', useCase: '片头转场 · 重点强调', color: '#70b7e8', tag: '04'},
  {id: 'pulse-rings', category: 'effects', name: '光环脉冲', componentName: 'PulseRings', description: '同心光环从中心扩散，制造清晰的节奏焦点', useCase: '片头强调 · Logo 出场', color: '#409eff', tag: '01'},
  {id: 'particle-field', category: 'effects', name: '粒子漂移', componentName: 'ParticleField', description: '细小粒子缓慢漂移，给画面增加空间层次', useCase: '科技背景 · 氛围过渡', color: '#409eff', tag: '02'},
  {id: 'shimmer-sweep', category: 'effects', name: '光泽扫过', componentName: 'ShimmerSweep', description: '高光沿斜线扫过网格，适合标题或卡片强调', useCase: '标题强调 · 产品展示', color: '#409eff', tag: '03'},
];

export type PreviewProps = {id: DemoId; src: string};
export const demoAudioSrc = staticFile('demo-audio.wav');

/** A quiet, compact composition for the library cards. The card plays the visual timeline on hover. */
export const AudioCardComposition = ({id, src}: PreviewProps) => {
  const active = catalog.find((item) => item.id === id) ?? catalog[0];
  const isBackground = active.category === 'backgrounds';
  const isAudio = active.category === 'audio';
  const isEffect = active.category === 'effects';
  return <div style={{width: '100%', height: '100%', position: 'relative', overflow: 'hidden', background: isBackground ? '#eaf5ff' : isAudio ? '#f8fafc' : isEffect ? '#f4f8ff' : 'linear-gradient(135deg, #ffffff 0%, #f5f7fa 100%)', color: '#303133', fontFamily: 'system-ui, sans-serif'}}>
    {!isBackground && !isAudio && !isEffect && <div style={{position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(#409eff18 1px, transparent 0), linear-gradient(90deg, #409eff18 1px, transparent 0)', backgroundSize: '32px 32px', maskImage: 'linear-gradient(transparent, #000 28%, #000 72%, transparent)'}} />}
    <div style={{position: 'absolute', inset: isBackground || isAudio || isEffect ? 0 : '32px 24px 28px', display: isBackground || isAudio || isEffect ? 'block' : 'grid', placeItems: 'center'}}>
      {id === 'oscilloscope' && <Oscilloscope src={src} color={active.color} width={900} height={300} />}
      {id === 'spectrum' && <MirroredSpectrum src={src} color={active.color} width={900} height={300} />}
      {id === 'voice' && <VoiceNote src={src} color={active.color} width={900} height={300} />}
      {id === 'liquid-contours' && <LiquidContours color={active.color} secondaryColor={active.color} backgroundColor="#dff0ff" width={640} height={260} />}
      {id === 'moving-waves' && <MovingWaves color={active.color} secondaryColor={active.color} backgroundColor="#dff0ff" width={640} height={260} />}
      {id === 'moving-zigzags' && <MovingZigzags color={active.color} secondaryColor={active.color} backgroundColor="#dff0ff" width={640} height={260} />}
      {id === 'rotating-starburst' && <RotatingStarburst color={active.color} secondaryColor={active.color} backgroundColor="#dff0ff" width={640} height={260} />}
      {id === 'pulse-rings' && <PulseRings color={active.color} secondaryColor="#8b5cf6" backgroundColor="#f4f8ff" width={640} height={260} />}
      {id === 'particle-field' && <ParticleField color={active.color} secondaryColor="#8b5cf6" backgroundColor="#f8fbff" width={640} height={260} />}
      {id === 'shimmer-sweep' && <ShimmerSweep color={active.color} secondaryColor="#8b5cf6" backgroundColor="#f4f8ff" width={640} height={260} />}
    </div>
  </div>;
};

export const snippetFor = (id: DemoId): string => {
  const active = catalog.find((item) => item.id === id) ?? catalog[0];
  if (active.category === 'audio') {
    return `import {Audio} from '@remotion/media';\nimport {${active.componentName}} from '@remotions/animations';\nimport {staticFile} from 'remotion';\n\nconst src = staticFile('your-audio.wav');\n\nexport const Scene = () => (\n  <>\n    <Audio src={src} />\n    <${active.componentName} src={src} color="${active.color}" />\n  </>\n);`;
  }
  return `import {${active.componentName}} from '@remotions/animations';\n\nexport const Scene = () => (\n  <${active.componentName} color="${active.color}" />\n);`;
};
