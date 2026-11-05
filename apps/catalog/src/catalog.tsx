export type CategoryId = 'audio' | 'captions' | 'charts' | 'backgrounds' | 'effects' | 'layouts' | 'overlays' | 'storytelling' | 'text-effects';
export type CatalogCategory = {id: CategoryId; name: string};
export type MaterialId = 'perspective-panel' | 'exploded-layers' | 'scene-thumbnail' | 'fan-card-deck' | 'chapter-heading';
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
  tiltProgress={progress}
  screen={<FinishedVideo />}
  layers={[
    {id:'captions',label:'字幕',content:<Captions />,enterAt:2},
    {id:'script',label:'脚本',content:<Script />,enterAt:0.4},
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
  {id:'chapter-heading',category:'text-effects',name:'章节标题切换',component:'ChapterHeading',description:'编号、标题和说明在各自遮罩内切换',usage:'章节标题 · 段落过渡',durationInFrames:120,posterFrame:80,code:`import {ChapterHeading} from '@remotions/animations';

<ChapterHeading
  from={{number:'01 / 03',title:'制作方法',description:'从脚本到成片'}}
  to={{number:'02 / 03',title:'Skill 推荐',description:'大家最关心的'}}
  progress={progress}
/>`},
];
