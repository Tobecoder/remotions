export type CategoryId = 'audio' | 'captions' | 'charts' | 'backgrounds' | 'effects' | 'layouts' | 'overlays' | 'storytelling' | 'text-effects';
export type CatalogCategory = {id: CategoryId; name: string};
export type MaterialId = 'perspective-panel' | 'exploded-layers' | 'scene-thumbnail' | 'fan-card-deck' | 'chapter-heading' | 'blurred-collage' | 'audio-pulse-badge' | 'chapter-card-row' | 'branching-paths' | 'section-collapse' | 'target-reticle' | 'constraint-switches' | 'tethered-motion' | 'rising-curve' | 'document-focus-gallery' | 'constraint-release' | 'preparation-cards' | 'agent-pipeline' | 'typewriter-comparison' | 'card-spotlight' | 'progress-row' | 'document-window' | 'highlight-box' | 'collapsing-title';
export type CatalogItem = {id: MaterialId; category: CategoryId; name: string; component: string; description: string; usage: string; durationInFrames: number; posterFrame: number; code: string};

export const categories: CatalogCategory[] = [
  {id: 'audio', name: '音频动画'},
  {id: 'captions', name: '字幕动画'},
  {id: 'charts', name: '数据图表'},
  {id: 'backgrounds', name: '背景特效'},
  {id: 'effects', name: '视觉效果'},
  {id: 'layouts', name: '版式转场'},
  {id: 'overlays', name: '信息叠加'},
  {id: 'storytelling', name: '叙事动画'},
  {id: 'text-effects', name: '文字特效'},
];

export const catalog: CatalogItem[] = [
  {id:'document-window',category:'layouts',name:'文档窗口',component:'DocumentWindow',description:'文档独立入场、滚动与停留，内容和进度由你提供',usage:'文档展示 · 教程演示',durationInFrames:180,posterFrame:105,code:`import {DocumentWindow} from '@remotions/animations';

<DocumentWindow title="操作指南" scrollProgress={progress} scrollDistance={240}>
  <YourDocument />
</DocumentWindow>`},
  {id:'highlight-box',category:'overlays',name:'区域高亮',component:'HighlightBox',description:'在任意画面区域展开高亮框，可独立控制位置和进度',usage:'重点标注 · 操作指引',durationInFrames:120,posterFrame:45,code:`import {HighlightBox} from '@remotions/animations';

<HighlightBox progress={progress} x={220} y={174} width={350} height={94}
  color="#409eff" shadowColor="#409eff22" />`},
  {id:'collapsing-title',category:'text-effects',name:'标题收拢',component:'CollapsingTitle',description:'同一标题连续缩小并移动到摘要位置，说明文字配合切换',usage:'观点归纳 · 标题转条目',durationInFrames:135,posterFrame:75,code:`import {CollapsingTitle} from '@remotions/animations';

<CollapsingTitle progress={progress} title="核心概念" lead="接下来说明"
  description="先展开讲清楚" compactDescription="归纳为一条要点"
  from={{x:140,y:220}} to={{x:100,y:120}} />`},
  {id:'typewriter-comparison',category:'text-effects',name:'打字对照',component:'TypewriterComparison',description:'两段文案先后输入、校验和淡化，再收为左右栏',usage:'文案对照 · 观点表达',durationInFrames:210,posterFrame:115,code:`import {TypewriterComparison} from '@remotions/animations';

<TypewriterComparison time={frame / fps} ownText={ownText} aiText={aiText} />`},
  {id:'card-spotlight',category:'layouts',name:'卡片放大回位',component:'CardSpotlight',description:'用进度控制卡片在起终点间放大与回位，可替换内容和目标区域',usage:'案例展示 · 重点讲解',durationInFrames:150,posterFrame:72,code:`import {CardSpotlight} from '@remotions/animations';

// progress：0 在原位，1 在目标位置，回到 0 即归位。
<CardSpotlight progress={progress} from={{x:435,y:187,width:54,height:42}}
  to={{x:232,y:138,width:336,height:189}} fromRadius={3} content={<Preview />} />`},
  {id:'progress-row',category:'charts',name:'单条进度',component:'ProgressRow',description:'独立控制名称、进度和状态，可组合自己的流程与对比',usage:'任务进度 · 过程讲解',durationInFrames:180,posterFrame:115,code:`import {ProgressRow} from '@remotions/animations';

// progress 为 0–1，由你的数据或动画时间控制。
<ProgressRow label="素材准备" progress={progress} color="#409eff"
  status={progress >= 1 ? 'complete' : 'waiting'} time={frame / fps}
  caption="收集并整理画面素材" value={Math.round(progress * 100) + '%'} />`},
  {id:'preparation-cards',category:'storytelling',name:'素材准备卡',component:'PreparationCards',description:'素材卡依次浮入，停留后汇入 Agent',usage:'制作准备 · 内容归集',durationInFrames:192,posterFrame:75,code:`import {PreparationCards} from '@remotions/animations';

<PreparationCards time={frame / fps} cards={cards} />`},
  {id:'agent-pipeline',category:'storytelling',name:'Agent 成片流程',component:'AgentPipeline',description:'Agent 显现，连接工具标签并展开成片窗口',usage:'工作流程 · 制作演示',durationInFrames:105,posterFrame:65,code:`import {AgentPipeline} from '@remotions/animations';

<AgentPipeline time={frame / fps} output={<VideoPreview />} toolLabel="Remotion" />`},
  {id:'target-reticle',category:'storytelling',name:'靶心归位',component:'TargetReticle',description:'先留下偏心落点，再让准星归位，靶面缩至侧边',usage:'试错讲解 · 先做后调',durationInFrames:180,posterFrame:54,code:`import {TargetReticle} from '@remotions/animations';

<TargetReticle time={frame / fps} shotLabel="先开枪" aimLabel="再瞄准" />`},
  {id:'constraint-switches',category:'storytelling',name:'约束开关',component:'ConstraintSwitches',description:'开关依次关闭，并划掉暂时不加的约束',usage:'极简讲解 · 条件取舍',durationInFrames:210,posterFrame:185,code:`import {ConstraintSwitches} from '@remotions/animations';

<ConstraintSwitches time={frame / fps + 2.2}
  heading="极简主义先行" labels={['额外的 Skill','非必须的约束']} offLabel="先不加" />`},
  {id:'tethered-motion',category:'storytelling',name:'绳索牵回',component:'TetheredMotion',description:'角色逐帧跑动，牵住停顿后慢慢回拉',usage:'约束比喻 · 偏离提醒',durationInFrames:120,posterFrame:80,code:`import {TetheredMotion} from '@remotions/animations';

<TetheredMotion time={frame / fps}
  spriteSrc="/characters/runner-v2.png" label="跑偏了！" />`},
  {id:'rising-curve',category:'charts',name:'曲线上升',component:'RisingCurve',description:'橙色曲线与面积同步向右上展开，端点沿线移动',usage:'趋势示意 · 能力变化',durationInFrames:105,posterFrame:75,code:`import {RisingCurve} from '@remotions/animations';

// 概念趋势示意，不是实测数据图。
<RisingCurve progress={progress} label="模型能力" title="越来越聪明" />`},
  {id:'document-focus-gallery',category:'layouts',name:'文档聚焦',component:'DocumentFocusGallery',description:'文档卡片展开，背景虚化并突出前景引文',usage:'证据展示 · 引文强调',durationInFrames:150,posterFrame:105,code:`import {DocumentFocusGallery} from '@remotions/animations';

<DocumentFocusGallery time={frame / fps}
  documents={documents.map(item=>({id:item.id,content:<DocumentImage src={item.src} />}))}
  focusContent={<YourQuote />} badge="重点说明" />`},
  {id:'constraint-release',category:'storytelling',name:'限制解除',component:'ConstraintRelease',description:'窗口旁的限制标签逐个掉落，内容显现并放大',usage:'条件解除 · 结果揭示',durationInFrames:165,posterFrame:120,code:`import {ConstraintRelease} from '@remotions/animations';

<ConstraintRelease time={frame / fps} content={<YourContent />}
  tags={['必须一步一步 …','禁止使用 …','严格按照模板 …','每一帧都要 …','不允许 …','只能用 …']}
  badge="惊喜" />`},
  {id:'section-collapse',category:'layouts',name:'小节收束',component:'SectionCollapse',description:'讲解画面缩进顶部摘要条，保留已讲完的小节',usage:'观点收尾 · 内容归档',durationInFrames:150,posterFrame:45,code:`import {SectionCollapse} from '@remotions/animations';

// 将背景和底部字幕放在组件外；画布为 800 × 450。
<SectionCollapse progress={progress} label="没有标准答案" number="1">
  <YourExplanation />
</SectionCollapse>`},
  {id:'audio-pulse-badge',category:'overlays',name:'音效脉冲徽章',component:'AudioPulseBadge',description:'圆形波形图标与淡淡扩散的细圆环',usage:'音效说明 · 章节配图',durationInFrames:150,posterFrame:30,code:`import {AudioPulseBadge} from '@remotions/animations';

// 装饰图标，不读取音频；800 × 450 设计坐标。
<AudioPulseBadge time={frame / fps} x={400} y={225} size={96} />`},
  {id:'chapter-card-row',category:'storytelling',name:'章节卡总览',component:'ChapterCardRow',description:'章节缩略卡向画面中间移动、放大并排展示',usage:'内容目录 · 章节回顾',durationInFrames:135,posterFrame:90,code:`import {ChapterCardRow} from '@remotions/animations';

<ChapterCardRow progress={progress} cards={[
  {id:'method',title:'制作方法',description:'从脚本到成片',content:<MethodPreview />},
  {id:'skill',title:'Skill 推荐',description:'找素材 · 选零件',content:<SkillPreview />},
  {id:'sound',title:'音效处理',description:'合成，不如找到',content:<SoundPreview />},
]} />`},
  {id:'branching-paths',category:'storytelling',name:'多路径演示',component:'BranchingPaths',description:'图片沿曲线展开、强调一条路线，光点到达结果',usage:'思路讲解 · 方案对比',durationInFrames:240,posterFrame:165,code:`import {BranchingPaths} from '@remotions/animations';

// 800 × 450 画布；前 2 秒展开，2.3 秒出现标签，4.1 秒开始突出路径。
<BranchingPaths time={frame / fps} cards={[
  {id:'start',x:210,y:314,selected:true,content:<FirstImage />},
  {id:'middle',x:356,y:260,width:90,height:66,selected:true,content:<SecondImage />},
  {id:'end',x:505,y:233,selected:true,content:<ThirdImage />},
]} fromLabel="想法" toLabel="成片" stamp="标准答案" routeLabel="我摸索的一条路" />`},
  {id:'blurred-collage',category:'backgrounds',name:'虚化拼贴漂移',component:'BlurredCollage',description:'图片墙向左下缓慢漂移，淡出后留下静止纸纹',usage:'片头铺底 · 教程开场',durationInFrames:180,posterFrame:18,code:`import {BlurredCollage} from '@remotions/animations';
import {Img, useCurrentFrame, useVideoConfig} from 'remotion';

// 800 × 450 设计画布；与十秒案例共用默认运动和淡出节拍。
export const Background = () => <BlurredCollage
  time={useCurrentFrame() / useVideoConfig().fps}
  cards={[
    {id:'a',x:-32,y:24,width:137,height:111,rotation:-5,
      content:<Img src="/image-a.jpg" style={{width:'100%',height:'100%',objectFit:'cover'}} />},
    {id:'b',x:328,y:-53,width:217,height:140,rotation:-3,
      content:<Img src="/image-b.jpg" style={{width:'100%',height:'100%',objectFit:'cover'}} />},
  ]}
/>;`},
  {id:'perspective-panel',category:'layouts',name:'透视面板',component:'PerspectivePanel',description:'将正面内容转为倾斜的透视面板',usage:'截图展示 · 空间转场',durationInFrames:120,posterFrame:75,code:`import {PerspectivePanel} from '@remotions/animations';

<PerspectivePanel
  from={{x:220,y:114,ax:1,ay:0,bx:0,by:1}}
  to={{x:355,y:128,ax:.525,ay:.275,bx:-.489,by:.281}}
  progress={progress}
>
  <YourContent />
</PerspectivePanel>`},
  {id:'exploded-layers',category:'storytelling',name:'分层展开',component:'ExplodedLayers',description:'逐层展开内容，并用引线标注各层名称',usage:'流程拆解 · 结构讲解',durationInFrames:210,posterFrame:165,code:`import {ExplodedLayers} from '@remotions/animations';

<ExplodedLayers
  time={frame / fps}
  startAt={0}
  screen={<FinishedVideo />}
  layers={[
    {id:'captions',label:'字幕',content:<Captions />},
    {id:'script',label:'脚本',content:<Script />},
  ]}
/>`},
  {id:'scene-thumbnail',category:'layouts',name:'章节缩略卡',component:'SceneThumbnail',description:'将完整场景缩小，收进下一节的章节卡',usage:'章节衔接 · 内容回顾',durationInFrames:150,posterFrame:105,code:`import {SceneThumbnail} from '@remotions/animations';

<SceneThumbnail
  progress={progress}
  target={{x:56,y:265,scale:.28}}
  card={{x:58,y:265,width:224,height:145}}
  caption="上一章节"
>
  <PreviousScene />
</SceneThumbnail>`},
  {id:'fan-card-deck',category:'layouts',name:'扇形卡组',component:'FanCardDeck',description:'多张图片卡片依次展开成扇形',usage:'素材展示 · 工具推荐',durationInFrames:100,posterFrame:65,code:`import {FanCardDeck} from '@remotions/animations';

<FanCardDeck
  progress={progress}
  x={156} y={114} spread={94}
  cardWidth={112} cardHeight={166}
  cards={images.map(image => ({
    id:image.id,caption:image.name,
    content:<img src={image.src} style={{width:'100%',height:'100%',objectFit:'cover'}} />,
  }))}
/>`},
  {id:'chapter-heading',category:'text-effects',name:'章节标题切换',component:'ChapterHeading',description:'从片头大标题衔接到章节，再切换下一章节',usage:'片头标题 · 章节过渡',durationInFrames:180,posterFrame:18,code:`import {ChapterHeading} from '@remotions/animations';
import {useCurrentFrame, useVideoConfig} from 'remotion';

// 800 × 450 画布，6 秒演示
export const ChapterExample = () => {
  const time = useCurrentFrame() / useVideoConfig().fps;
  const transition = (start: number, end: number) => {
    const p = Math.min(1, Math.max(0, (time - start) / (end - start)));
    return p * p * (3 - 2 * p);
  };
  return <ChapterHeading
    x={195} y={135}
    intro={{
      eyebrow:'REMOTION 教程 · 第二期',
      title:<>一条讲解视频的<br/>制作<span style={{color:'#ca6041'}}>全流程</span>拆解</>,
      description:'以上期16分钟的视频为例 · 从脚本到成片',
    }}
    introProgress={transition(1.2, 1.9)}
    from={{number:'01 / 03',title:'制作方法',description:'从脚本到成片'}}
    to={{number:'02 / 03',title:'Skill 推荐',description:'大家最关心的'}}
    progress={transition(3.2, 4)}
  />;
};`},
];
