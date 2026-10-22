import {BasicCaptions, HorizontalBarChart, LineChart, LiquidContours, LocationLowerThird, MirroredSpectrum, MovingPillCaptions, MovingWaves, MovingZigzags, NameLowerThird, NotebookPaper, NumberCounter, Oscilloscope, PaperTexture, ParticleField, PieChart, PictureInPictureTransition, PoppingWordCaptions, ProductCollection, PulseRings, RotatingCards, RotatingStarburst, RoundedCaptions, ShimmerSweep, SlideToSplitScreen, VerticalBarChart, VoiceNote, WordHighlightCaptions} from '@remotions/animations';
import type {Caption} from '@remotions/animations';
import {staticFile} from 'remotion';

export type DemoId = 'oscilloscope' | 'spectrum' | 'voice' | 'basic-captions' | 'rounded-captions' | 'moving-pill-captions' | 'popping-word-captions' | 'word-highlight-captions' | 'horizontal-bar-chart' | 'line-chart' | 'number-counter' | 'pie-chart' | 'vertical-bar-chart' | 'liquid-contours' | 'moving-waves' | 'moving-zigzags' | 'notebook-paper' | 'paper-texture' | 'rotating-starburst' | 'pulse-rings' | 'particle-field' | 'shimmer-sweep' | 'picture-in-picture' | 'slide-to-split-screen' | 'rotating-cards' | 'product-collection' | 'location-lower-third' | 'name-lower-third';
export type CategoryId = 'audio' | 'captions' | 'charts' | 'backgrounds' | 'effects' | 'layouts' | 'overlays';
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
  previewDurationInSeconds?: number;
  previewLoopMode?: PreviewLoopMode;
  /** A readable resting frame for overlays whose animation starts transparent. */
  previewStillFrame?: number;
};

export type PreviewLoopMode = 'forward' | 'forward-hold' | 'ping-pong';

/** Categories are intentionally independent from the demo list so new families can be added without changing the page layout. */
export const categories: CatalogCategory[] = [
  {id: 'audio', name: '音频动画', description: '让声音驱动画面', status: 'active'},
  {id: 'captions', name: '字幕动画', description: '文字跟着时间出现', status: 'active'},
  {id: 'charts', name: '数据图表', description: '让数据产生动效', status: 'active'},
  {id: 'backgrounds', name: '背景特效', description: '可循环的氛围背景', status: 'active'},
  {id: 'effects', name: '视觉效果', description: '光、粒子与形变', status: 'active'},
  {id: 'layouts', name: '版式转场', description: '可复用的镜头结构', status: 'active'},
  {id: 'overlays', name: '信息叠加', description: '地点与人物信息条', status: 'active'},
];

export const catalog: Demo[] = [
  {id: 'oscilloscope', category: 'audio', name: '示波曲线', componentName: 'Oscilloscope', description: '将声音的起伏绘成连续光轨', useCase: '音乐开场 · 声音实验', color: '#2563eb', tag: '01'},
  {id: 'spectrum', category: 'audio', name: '镜像频谱', componentName: 'MirroredSpectrum', description: '按真实频段绘制上下对称的律动', useCase: '音乐视频 · 节奏展示', color: '#2563eb', tag: '02'},
  {id: 'voice', category: 'audio', name: '语音波形', componentName: 'VoiceNote', description: '把语音或音频片段变成消息卡片', useCase: '播客片段 · 对话演绎', color: '#2563eb', tag: '03'},
  {id: 'basic-captions', category: 'captions', name: '基础字幕', componentName: 'BasicCaptions', description: '干净的居中字幕，适合旁白和教程', useCase: '教程视频 · 旁白字幕', color: '#409eff', tag: '01'},
  {id: 'rounded-captions', category: 'captions', name: '气泡字幕', componentName: 'RoundedCaptions', description: '气泡边缘贴合字形，随字幕长度自然展开', useCase: '知识卡片 · 对话字幕', color: '#67c23a', tag: '02'},
  {id: 'moving-pill-captions', category: 'captions', name: '移动气泡', componentName: 'MovingPillCaptions', description: '字形气泡包边从侧边滑入，形成轻快节奏', useCase: '短视频 · 重点提示', color: '#e6a23c', tag: '03'},
  {id: 'popping-word-captions', category: 'captions', name: '弹出单词', componentName: 'PoppingWordCaptions', description: '字符逐个弹出，增强语气和节奏', useCase: '标题强调 · 节奏剪辑', color: '#f56c6c', tag: '04'},
  {id: 'word-highlight-captions', category: 'captions', name: '逐字高亮', componentName: 'WordHighlightCaptions', description: '高亮沿字幕推进，模拟卡拉 OK 阅读感', useCase: '歌词视频 · 口播字幕', color: '#8b5cf6', tag: '05'},
  {id: 'horizontal-bar-chart', category: 'charts', name: '横向条形图', componentName: 'HorizontalBarChart', description: '数据条按顺序展开，直接标注每一项数值', useCase: '指标对比 · 项目复盘', color: '#409eff', tag: '01', previewDurationInSeconds: 4, previewLoopMode: 'forward-hold'},
  {id: 'line-chart', category: 'charts', name: '趋势折线图', componentName: 'LineChart', description: '折线沿时间轴绘出变化趋势，保留关键节点', useCase: '增长趋势 · 数据故事', color: '#67c23a', tag: '02', previewDurationInSeconds: 4, previewLoopMode: 'forward-hold'},
  {id: 'number-counter', category: 'charts', name: '数字计数器', componentName: 'NumberCounter', description: '数字从起点平滑计数到目标值，适合强调成果', useCase: '数据结论 · 成果展示', color: '#e6a23c', tag: '03', previewDurationInSeconds: 4, previewLoopMode: 'forward-hold'},
  {id: 'pie-chart', category: 'charts', name: '占比饼图', componentName: 'PieChart', description: '分区从中心展开，标签跟随每个占比出现', useCase: '构成分析 · 比例说明', color: '#8b5cf6', tag: '04', previewDurationInSeconds: 4, previewLoopMode: 'forward-hold'},
  {id: 'vertical-bar-chart', category: 'charts', name: '纵向条形图', componentName: 'VerticalBarChart', description: '柱形依次升起，适合展示排名和阶段数据', useCase: '排名展示 · 阶段对比', color: '#f56c6c', tag: '05', previewDurationInSeconds: 4, previewLoopMode: 'forward-hold'},
  {id: 'liquid-contours', category: 'backgrounds', name: '液态轮廓', componentName: 'LiquidContours', description: '双色轮廓带缓慢流动，铺出柔和氛围', useCase: '品牌背景 · 氛围铺底', color: '#70b7e8', tag: '01', previewDurationInSeconds: 8, previewLoopMode: 'ping-pong'},
  {id: 'moving-waves', category: 'backgrounds', name: '流动波浪', componentName: 'MovingWaves', description: '多层波浪持续向上流动，适合循环使用', useCase: '音乐视频 · 开场铺底', color: '#70b7e8', tag: '02', previewDurationInSeconds: 8},
  {id: 'moving-zigzags', category: 'backgrounds', name: '折线流动', componentName: 'MovingZigzags', description: '重复折线向上漂移，增加画面的节奏和方向感', useCase: '科技背景 · 节奏铺底', color: '#70b7e8', tag: '03', previewDurationInSeconds: 8},
  {id: 'notebook-paper', category: 'backgrounds', name: '笔记网格', componentName: 'NotebookPaper', description: '蓝色网格和侧边线组成轻量纸张背景', useCase: '教程画面 · 知识卡片', color: '#8db8da', tag: '04', previewDurationInSeconds: 8, previewLoopMode: 'ping-pong'},
  {id: 'paper-texture', category: 'backgrounds', name: '纸张纹理', componentName: 'PaperTexture', description: '细微颗粒缓慢变化，给画面增加纸张触感', useCase: '手绘内容 · 氛围铺底', color: '#9eb8cf', tag: '05', previewDurationInSeconds: 8, previewLoopMode: 'ping-pong'},
  {id: 'rotating-starburst', category: 'backgrounds', name: '旋转星芒', componentName: 'RotatingStarburst', description: '放射光束缓慢旋转，制造能量聚焦', useCase: '片头转场 · 重点强调', color: '#70b7e8', tag: '06', previewDurationInSeconds: 8},
  {id: 'pulse-rings', category: 'effects', name: '光环脉冲', componentName: 'PulseRings', description: '同心光环从中心扩散，制造清晰的节奏焦点', useCase: '片头强调 · Logo 出场', color: '#409eff', tag: '01', previewDurationInSeconds: 4.5},
  {id: 'particle-field', category: 'effects', name: '粒子漂移', componentName: 'ParticleField', description: '细小粒子缓慢漂移，给画面增加空间层次', useCase: '科技背景 · 氛围过渡', color: '#409eff', tag: '02', previewDurationInSeconds: 8},
  {id: 'shimmer-sweep', category: 'effects', name: '光泽扫过', componentName: 'ShimmerSweep', description: '高光沿斜线扫过网格，适合标题或卡片强调', useCase: '标题强调 · 产品展示', color: '#409eff', tag: '03', previewDurationInSeconds: 5.5},
  {id: 'picture-in-picture', category: 'layouts', name: '画中画转场', componentName: 'PictureInPictureTransition', description: '全屏画面收缩为可配置的小窗，适合产品演示和播客画面', useCase: '产品演示 · 播客画面', color: '#409eff', tag: '01', previewDurationInSeconds: 5, previewLoopMode: 'forward-hold'},
  {id: 'slide-to-split-screen', category: 'layouts', name: '滑动分屏', componentName: 'SlideToSplitScreen', description: '全屏画面展开为双栏分屏，适合对比和讲解', useCase: '前后对比 · 双画面讲解', color: '#67c23a', tag: '02', previewDurationInSeconds: 5, previewLoopMode: 'forward-hold'},
  {id: 'rotating-cards', category: 'layouts', name: '旋转卡片', componentName: 'RotatingCards', description: '卡片依次进入中心，适合案例、作品和商品展示', useCase: '案例展示 · 商品陈列', color: '#8b5cf6', tag: '03', previewDurationInSeconds: 5, previewLoopMode: 'forward-hold'},
  {id: 'product-collection', category: 'layouts', name: '产品卡组', componentName: 'ProductCollection', description: '三张商品卡以透视、旋转和缩放依次占据中心', useCase: '商品集合 · 作品陈列', color: '#f56c6c', tag: '04', previewDurationInSeconds: 5, previewLoopMode: 'forward-hold'},
  {id: 'location-lower-third', category: 'overlays', name: '地点叠加', componentName: 'LocationLowerThird', description: '定位针描绘填色后，地点文字从左向右展开', useCase: '活动现场 · 旅行记录', color: '#2563eb', tag: '01', previewDurationInSeconds: 4, previewStillFrame: 60},
  {id: 'name-lower-third', category: 'overlays', name: '姓名叠加', componentName: 'NameLowerThird', description: '蓝黑双色信息条交错擦入，介绍姓名与身份', useCase: '访谈视频 · 人物介绍', color: '#2563eb', tag: '02', previewDurationInSeconds: 4, previewStillFrame: 60},
];

export const getPreviewDurationInSeconds = (id: DemoId) => catalog.find((item) => item.id === id)?.previewDurationInSeconds ?? 6;
export const getPreviewLoopMode = (id: DemoId): PreviewLoopMode => catalog.find((item) => item.id === id)?.previewLoopMode ?? 'forward';
export const getPreviewStillFrame = (id: DemoId) => catalog.find((item) => item.id === id)?.previewStillFrame ?? 0;

export type PreviewProps = {id: DemoId; src: string; captions?: Caption[]};
export const demoAudioSrc = staticFile('demo-audio.wav');
export const demoCaptions: Caption[] = [
  // Keep narrow glyphs in the default demo so caption bubbles stay regression-visible.
  {text: '一', startMs: 0, endMs: 1000, timestampMs: 500, confidence: null},
  {text: '~', startMs: 1000, endMs: 2000, timestampMs: 1500, confidence: null},
  {text: '让素材', startMs: 2000, endMs: 2900, timestampMs: 2450, confidence: null},
  {text: '随时可用', startMs: 2900, endMs: 3800, timestampMs: 3350, confidence: null},
  {text: '按类别收进库里', startMs: 3800, endMs: 5000, timestampMs: 4400, confidence: null},
  {text: '继续扩展', startMs: 5000, endMs: 6000, timestampMs: 5500, confidence: null},
];

/** A quiet, compact composition for the library cards. The card plays the visual timeline on hover. */
export const AudioCardComposition = ({id, src, captions = demoCaptions}: PreviewProps) => {
  const active = catalog.find((item) => item.id === id) ?? catalog[0];
  const isBackground = active.category === 'backgrounds';
  const isAudio = active.category === 'audio';
  const isCaption = active.category === 'captions';
  const isChart = active.category === 'charts';
  const isEffect = active.category === 'effects';
  const isLayout = active.category === 'layouts';
  const isOverlay = active.category === 'overlays';
  const isFullPreview = isBackground || isAudio || isCaption || isChart || isEffect || isLayout || isOverlay;
  return <div style={{width: '100%', height: '100%', position: 'relative', overflow: 'hidden', background: isBackground ? '#eaf5ff' : isAudio ? '#f8fafc' : isCaption ? '#eef6ff' : isChart ? '#f7fbff' : isEffect ? '#f4f8ff' : isLayout ? '#f5f8fc' : isOverlay ? '#f8fbff' : 'linear-gradient(135deg, #ffffff 0%, #f5f7fa 100%)', color: '#303133', fontFamily: 'system-ui, sans-serif'}}>
    {!isFullPreview && <div style={{position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(#409eff18 1px, transparent 0), linear-gradient(90deg, #409eff18 1px, transparent 0)', backgroundSize: '32px 32px', maskImage: 'linear-gradient(transparent, #000 28%, #000 72%, transparent)'}} />}
    <div style={{position: 'absolute', inset: isFullPreview ? 0 : '32px 24px 28px', display: isFullPreview ? 'block' : 'grid', placeItems: 'center'}}>
      {id === 'oscilloscope' && <Oscilloscope src={src} color={active.color} width={900} height={300} />}
      {id === 'spectrum' && <MirroredSpectrum src={src} color={active.color} width={900} height={300} />}
      {id === 'voice' && <VoiceNote src={src} color={active.color} width={900} height={300} />}
      {id === 'basic-captions' && <BasicCaptions captions={captions} color="#ffffff" secondaryColor="#1f2937" backgroundColor="#dcecff" width={640} height={260} />}
      {id === 'rounded-captions' && <RoundedCaptions captions={captions} color="#1f2937" secondaryColor="#409eff" backgroundColor="#eef6ff" width={640} height={260} />}
      {id === 'moving-pill-captions' && <MovingPillCaptions captions={captions} color="#ffffff" secondaryColor="#e6a23c" backgroundColor="#fff7e6" width={640} height={260} />}
      {id === 'popping-word-captions' && <PoppingWordCaptions captions={captions} color="#1f2937" secondaryColor="#f56c6c" backgroundColor="#fff1f0" width={640} height={260} />}
      {id === 'word-highlight-captions' && <WordHighlightCaptions captions={captions} color="#64748b" secondaryColor="#8b5cf6" backgroundColor="#f6f2ff" width={640} height={260} />}
      {id === 'horizontal-bar-chart' && <HorizontalBarChart color={active.color} secondaryColor="#8b5cf6" backgroundColor="#f7fbff" width={640} height={260} />}
      {id === 'line-chart' && <LineChart color={active.color} secondaryColor="#67c23a" backgroundColor="#f7fbff" width={640} height={260} />}
      {id === 'number-counter' && <NumberCounter color={active.color} secondaryColor="#8b5cf6" backgroundColor="#f7fbff" width={640} height={260} to={128} suffix="+" />}
      {id === 'pie-chart' && <PieChart color={active.color} secondaryColor="#8b5cf6" backgroundColor="#f7fbff" width={640} height={260} />}
      {id === 'vertical-bar-chart' && <VerticalBarChart color={active.color} secondaryColor="#8b5cf6" backgroundColor="#f7fbff" width={640} height={260} />}
      {id === 'liquid-contours' && <LiquidContours color={active.color} secondaryColor={active.color} backgroundColor="#dff0ff" width={640} height={260} />}
      {id === 'moving-waves' && <MovingWaves color={active.color} secondaryColor={active.color} backgroundColor="#dff0ff" width={640} height={260} />}
      {id === 'moving-zigzags' && <MovingZigzags color={active.color} secondaryColor={active.color} backgroundColor="#dff0ff" width={640} height={260} />}
      {id === 'notebook-paper' && <NotebookPaper color={active.color} secondaryColor="#8b5cf6" backgroundColor="#fbfdff" width={640} height={260} />}
      {id === 'paper-texture' && <PaperTexture color={active.color} secondaryColor="#d3b58d" backgroundColor="#fbfaf6" width={640} height={260} />}
      {id === 'rotating-starburst' && <RotatingStarburst color={active.color} secondaryColor={active.color} backgroundColor="#dff0ff" width={640} height={260} />}
      {id === 'pulse-rings' && <PulseRings color={active.color} secondaryColor="#8b5cf6" backgroundColor="#f4f8ff" width={640} height={260} />}
      {id === 'particle-field' && <ParticleField color={active.color} secondaryColor="#8b5cf6" backgroundColor="#f8fbff" width={640} height={260} />}
      {id === 'shimmer-sweep' && <ShimmerSweep color={active.color} secondaryColor="#8b5cf6" backgroundColor="#f4f8ff" width={640} height={260} />}
      {id === 'picture-in-picture' && <PictureInPictureTransition color={active.color} secondaryColor="#8b5cf6" backgroundColor="#f4f8ff" width={640} height={260} />}
      {id === 'slide-to-split-screen' && <SlideToSplitScreen color={active.color} secondaryColor="#67c23a" backgroundColor="#f4f8ff" width={640} height={260} />}
      {id === 'rotating-cards' && <RotatingCards color={active.color} secondaryColor="#8b5cf6" backgroundColor="#f5f8fc" width={640} height={260} />}
      {id === 'product-collection' && <ProductCollection backgroundColor="#f5f5f3" fadeOut={false} width={640} height={260} />}
      {id === 'location-lower-third' && <LocationLowerThird width={640} height={260} location="Berlin, Germany" />}
      {id === 'name-lower-third' && <div style={{width: '100%', height: '100%', display: 'grid', placeItems: 'center'}}><NameLowerThird width={460} height={114} name="Alex Morgan" role="Creative Developer" /></div>}
    </div>
  </div>;
};

export const snippetFor = (id: DemoId): string => {
  const active = catalog.find((item) => item.id === id) ?? catalog[0];
  if (active.category === 'overlays') {
    const textProps = id === 'location-lower-third' ? 'location="Berlin, Germany"' : 'name="Alex Morgan" role="Creative Developer"';
    return `import {${active.componentName}} from '@remotions/animations';\n\nexport const Scene = () => (\n  <${active.componentName} color="${active.color}" ${textProps} durationInSeconds={4} />\n);`;
  }
  if (active.category === 'audio') {
    return `import {Audio} from '@remotion/media';\nimport {${active.componentName}} from '@remotions/animations';\nimport {staticFile} from 'remotion';\n\nconst src = staticFile('your-audio.wav');\n\nexport const Scene = () => (\n  <>\n    <Audio src={src} />\n    <${active.componentName} src={src} color="${active.color}" />\n  </>\n);`;
  }
  if (active.category === 'captions') {
    return `import type {Caption} from '@remotion/captions';\nimport {${active.componentName}} from '@remotions/animations';\n\nconst captions: Caption[] = [{text: 'Hello', startMs: 0, endMs: 900, timestampMs: 450, confidence: null}];\n\nexport const Scene = () => (\n  <${active.componentName} captions={captions} color="${active.color}" />\n);`;
  }
  if (active.category === 'charts') {
    if (active.componentName === 'NumberCounter') {
      return `import {${active.componentName}} from '@remotions/animations';\n\nexport const Scene = () => (\n  <${active.componentName} color="${active.color}" from={0} to={128} suffix="+" />\n);`;
    }
    return `import {${active.componentName}} from '@remotions/animations';\nimport type {ChartDatum} from '@remotions/animations';\n\nconst data: ChartDatum[] = [\n  {label: '设计', value: 68},\n  {label: '工程', value: 84},\n  {label: '内容', value: 52},\n];\n\nexport const Scene = () => (\n  <${active.componentName} color="${active.color}" data={data} />\n);`;
  }
  return `import {${active.componentName}} from '@remotions/animations';\n\nexport const Scene = () => (\n  <${active.componentName} color="${active.color}" />\n);`;
};
