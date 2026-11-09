# @remotions/animations

Remotion 可复用动画组件，当前公开导出 **23 个**。旧组件及归档实现已移除。

| 类别 | 组件 | 用途 |
| --- | --- | --- |
| 版式转场 | `PerspectivePanel` | 任意内容的透视投影与姿态过渡 |
| 叙事动画 | `ExplodedLayers` | 多层内容拆解与引线标注 |
| 版式转场 | `FanCardDeck` | 图片、文档等卡片的扇形展开 |
| 文字特效 | `ChapterHeading` | 编号、标题和说明的遮罩切换 |
| 背景特效 | `BlurredCollage` | 静止纸纹上的虚化拼贴向左下漂移并淡出 |
| 信息叠加 | `AudioPulseBadge` | 装饰波形图标及扩散细圆环 |
| 叙事动画 | `ChapterCardRow` | 章节缩略卡上移、放大并排为总览 |
| 叙事动画 | `BranchingPaths` | 多条素材路径、否定标签和选路强调 |
| 版式转场 | `ContentCollapse` | 任意内容移动缩小到指定位置，显隐独立控制 |
| 叙事动画 | `TargetReticle` | 偏心落点、准星归位，可缩到指定位置或保持原位 |
| 叙事动画 | `ConstraintSwitches` | 约束开关依次关闭、文字划线 |
| 叙事动画 | `TetheredMotion` | 可替换对象前进、被绳索牵回并切换姿态 |
| 数据图表 | `RisingCurve` | 概念趋势曲线、面积和端点同步展开 |
| 版式转场 | `CardEntrance` | 独立卡片入场，外部安排位置、数量和进度 |
| 版式转场 | `FocusLayer` | 独立突出任意前景，可选背景虚化淡化 |
| 叙事动画 | `AgentPipeline` | Agent 显现，连接工具与成片窗口 |
| 文字特效 | `TypewriterComparison` | 两段文字逐字输入，再缩成左右栏 |
| 版式转场 | `CardSpotlight` | 进度控制卡片放大与归位 |
| 数据图表 | `ProgressRow` | 独立进度、状态及附加内容，供自定义组合 |
| 版式转场 | `DocumentWindow` | 独立文档窗口、入场与滚动 |
| 信息叠加 | `HighlightBox` | 任意区域的展开高亮框 |
| 文字特效 | `CollapsingTitle` | 同一标题移动缩小为摘要条目 |
| 叙事动画 | `ConstraintRelease` | 约束标签掉落、窗口内容显现并放大 |

```tsx
import {FanCardDeck} from '@remotions/animations';
import {interpolate, useCurrentFrame} from 'remotion';

const Gallery = () => {
  const frame = useCurrentFrame();
  const progress = interpolate(frame, [0, 45], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  return <FanCardDeck progress={progress} cards={[
    {id:'script',caption:'脚本',content:<div>替换为你的内容</div>},
    {id:'image',caption:'画面',content:<img src="/your-image.png" />},
  ]}/>;
};
```

组件使用 800×450 设计坐标；可通过组件的尺寸、姿态与位置参数调整，并用外层容器等比缩放到目标画布。内容均为 React 插槽，组件本身不内置参考视频截图，也不负责声音播放。动画进度由调用方的帧计算，适用于随机跳帧与视频渲染。

`ChapterHeading` 也可以接收片头内容：`intro={{eyebrow, title, description}}`（`title` 支持 React 内容，例如两行标题及彩色强调），并传入 `introProgress`。同一进度控制片头退场与章节入场，无需另外写两个淡入淡出动画；`progress` 仍用于后续章节之间的切换。不传 `intro` 时保留普通章节切换行为。

`ExplodedLayers` 自带与素材库一致的默认时间线：0.4–1.2 秒转为透视，1.8 秒起从下向上依次加入中间层，相隔 0.5 秒、每层 0.55 秒。调用时提供 `time`、`startAt`（整体开始时间）、各层内容和画面位置即可。`tiltProgress`、各层 `enterAt` / `duration` 仍可显式传入，但普通案例不再各自改写这些参数。

每张卡片与对应文案共用进度，文字、圆点和引线跟随该卡片的实际位置；`labelOpacity` 用于整组标注显隐。组件库预览与十秒案例均使用默认的整卡淡入，不另设透明度模式。

构建：`npm run build -w @remotions/animations`。旧代码可从 Git 历史查看。MIT 许可，见 LICENSE。

`BlurredCollage` 接收 `time={frame / fps}` 和 `cards`，每项指定 `id`、`content`、`x`、`y`、`width`、`height`，可选 `rotation`。默认以每秒 `(-16, 8)` 个设计像素向左下移动，3–4.25 秒淡出；`startAt` 可以整体延后。默认纸纹是固定种子的静态 SVG 纹理，也可用 `paper={<Img ... />}` 替换。`drift`、`blur`、`opacity`、`fadeStart`、`fadeEnd` 可调整，但目录与十秒案例使用同一默认运动参数。纸纹不跟随图片墙移动或淡出。

`AudioPulseBadge` 接收秒数 `time`，可配置 `progress`、中心 `x/y`、`size` 和强调 `color`。这是装饰性的音效示意图标，不分析音频，也不播放声音。

`ChapterCardRow` 接收 `cards=[{id,title,description,content}]` 和 `progress`（0–1）。默认三张卡从下方小卡移动到居中大卡，插图、主标题和说明随布局一起移动。`content` 填满插图区域，也可以使用 `({width,height,progress}) => ReactNode`，根据实际插图区域尺寸对齐内容；原有静态内容写法保持兼容。

`BranchingPaths` 接收 `time`、可选整体开始 `startAt`，以及 `cards=[{id,content,x,y,width?,height?,rotation?,selected?,enterAt?}]`。每张卡默认 90×51。未提供新路线配置时保留原参考结构和 `selected` 卡片标记：前两秒展开，2.3 秒出现 `stamp`、2.85 秒划线、3.9 秒淡去；4.1–4.9 秒绘出强调路径并淡化其他卡。

选路后的光点在 4.1–6 秒沿同一条曲线前进，中段较快、接近终点时温和放慢，到终点保持；6.25–6.65 秒显示 `resultLabel`（默认“启发 · 灵感”）。这些时间均相对 `startAt`，支持随机跳帧。

三条基础路线按“上 → 下 → 中”交替起笔，分别从 0、0.35、0.7 秒开始，单条绘制仍为 0.65 秒。卡片入场及后续选路不随此错峰调整而改变。

自定义路线使用 `routes=[{id,path,cardIds?,enterAt?,duration?}]`，`path` 是一条连续 SVG 路径。`selectedRoute` 指定路线 id，高亮线与光点使用该路径本身，关联的 `cardIds` 控制哪些卡片保留、高亮和位于前景。卡片位置仍由 `x/y/width/height` 控制，`cardIds` 不会自动移动卡片；安排路径时应让它经过相应卡片。显式选路后不再读取旧的 `card.selected`，避免高亮到另一条路线的节点。

```tsx
<BranchingPaths time={frame / fps} cards={[
  {id:'a',x:355,y:154.5,content:<FirstImage />},
  {id:'b',x:355,y:314.5,content:<SecondImage />},
]} routes={[
  {id:'upper',path:'M100 260 Q400 100 700 260',cardIds:['a']},
  {id:'lower',path:'M100 260 Q400 420 700 260',cardIds:['b']},
]} selectedRoute="upper" fromLabel="问题" toLabel="结果"
  stamp={false} routeLabel="选定方案" resultLabel={false}
  timing={{selectAt:1.5,travelDuration:2}} />
```

- 起终点默认从第一条自定义路线读取；也可指定 `from/to={x,y}`，坐标以 800×450 为设计画布。所有路线必须连接同一起点与终点。未提供 `routes` 时，修改起终点会同步旋转/缩放原曲线与光点轨迹，卡片继续使用调用方坐标。
- 自定义路线默认不自动选中，需显式指定 `selectedRoute`；`selectedRoute={false}` 只展示多路与卡片，不做选路、淡化或光点展示。原三条基础路线也可通过 `upper/middle/lower` 指定选择；需要关联节点时提供相应 `routes/cardIds`。
- `stamp={false}` 关闭整个盖章划线阶段；`routeLabel={false}` 和 `resultLabel={false}` 分别关闭路线提示、结果标签。空字符串同样不会生成空框。关闭阶段不会自动压缩其他阶段的时间。
- `timing.stampAt` 平移整个盖章划线阶段，默认 `2.3`；`selectAt` 控制选路、淡化及光点开始，默认 `4.1`；`travelDuration` 控制光点行进时长，默认 `1.9`；`resultAt` 单独指定结果标签开始时刻，默认在选路线条和光点都完成后再等 `0.25` 秒。时间均相对组件的 `startAt`，零行进时长直接到达终点。
- 每条自定义路线的 `enterAt` 默认按列表顺序相隔 `0.35` 秒，绘制 `duration` 默认 `0.65` 秒，可独立配置。`positions={stamp:{x,y},routeLabel:{x,y},resultLabel:{x,y}}` 可覆盖提示的左上角位置；省略时随起终点布局调整。标题和结果文案仍需保持原来的短句长度，其他布局自行验收。
- 显式空路线列表不会补回原路线，也不显示盖章提示；无效 SVG、多子路径、重合起终点、端点不一致、重复 id、无效选路或缺失卡片引用会明确报错。非有限时序回退默认值，负绘制/行进时长按零处理。

[多路径演示与小节收束完整范例](../../examples/component-examples/content-collapse/README.md) 复用现有的 11 秒镜头：多路径讲解结束后收成摘要。两个动作入口共享同一份预览。

`ContentCollapse` 接收任意 `children`、`progress`（0–1）和目标 `to={x,y,scale}`；可选起点 `from`（默认 `{x:0,y:0,scale:1}`）及 `opacity`（默认 `1`）。坐标以内容容器左上角为原点，位置和缩放随进度插值；没有内置淡出、编号、文案或摘要条，显隐由调用方独立控制。支持 `style/className` 等容器属性。原 `SectionCollapse` 及其专属类型已退出公开入口，编号与摘要条组合保存在案例工程。

[小节收束完整范例](../../examples/component-examples/content-collapse/README.md) 直接使用原 `SectionCollapse`，展示完整场景讲解、左上收拢淡出与编号摘要保持。11 秒预览支持替换整段静态或动态内容、小节名称和编号，沿用原收拢方向、落点及 0.75 秒节奏。

[章节缩略卡完整范例](../../examples/component-examples/scene-thumbnail/README.md) 由原 `SceneThumbnail` 配合 `ChapterHeading`，将上一节插图缩入底部卡片并同步切入下一节。4 秒预览支持替换前后标题、两节插图、编号说明及总览文案；与小节收束分别保留，两处动作卡片共享此范例。

[素材准备卡完整范例](../../examples/component-examples/preparation-cards/README.md) 直接使用原 `PreparationCards`，展示四卡错峰入场、停留、汇聚及 `AgentPipeline` 接力输出的 6.4 秒完整流程。卡片内容、默认/自定义插图、标题与输出画面可替换，卡片入场、内容收拢及 Agent 成片流程共享同一范例。

```tsx
<ContentCollapse progress={progress} to={{x:60,y:45,scale:0.3}}>
  <YourContent />
</ContentCollapse>
```

`TargetReticle`、`ConstraintSwitches`、`TetheredMotion`、`ConstraintRelease` 均接收 `time`（秒）和可选 `startAt`。靶心可替换 `shotLabel/aimLabel/color`；约束开关默认两行，可替换 `heading/labels/offLabel`，默认先后关闭时刻为相对 5.1、7.3 秒；目录演示整体提前 2.2 秒。

`TargetReticle` 在相对 0.6 秒命中时加入短促衰减抖动，0.88 秒前归稳，再接原有 0.9 秒开始的准星归位。抖动只作用于靶面，不移动整页，也不改变后面的移位和缩放时间。

`move` 控制后续移位，未传时保留原成片效果：相对 1.8–3.4 秒从中心 `(400,277)` 缩到 `(199,277)`，最终比例 `0.78`。传 `move={false}` 时只完成命中、抖动与准星归位，靶面保持在原中心，标签保持显示。

```tsx
// 2.5 秒开始，用 1 秒缩到右侧的指定位置；到达后保持。
<TargetReticle time={frame / fps} startAt={0}
  move={{startAt:2.5,duration:1,to:{x:620,y:210,scale:0.65}}} />

// 不移位。
<TargetReticle time={frame / fps} move={false} />
```

`move.startAt/duration` 单位为秒，开始时刻相对于组件的 `startAt`；`to.x/y` 是 800×450 设计画布上的目标靶心坐标，`to.scale` 为目标比例。省略配置字段时沿用原默认值，`to` 若提供则需同时指定 `x/y`，`scale` 可省略。标签随移位开始淡出，最长持续 0.4 秒；关闭移位时不淡出。`duration=0` 在指定时刻直接到位，负时长按 0 处理；非有限参数回退到默认值，负比例按 0 处理。新目标位置与时间可自行编排并验收，原成片调用无需修改。

`TetheredMotion` 的 `running` 和 `caught` 为 React 内容插槽，建议透明图片或 SVG；组件只负责运动与绳索，不生成角色逐帧肢体动画。约 1.35 秒切换姿态，避免两个姿态半透明重叠。1.4 秒牵住角色，停顿至 1.9 秒，再用 1.1 秒慢慢回拉 72px 并归稳；最终停留位置保持。绳索端点跟随角色，受力时收紧但始终保留弧度，回拉时逐渐放松。

也可用 `spriteSrc` 替代两个 React 插槽，提供 4×4 的透明图集：前 8 帧以 12 FPS 跑动循环，后 8 帧在牵住时以 18 FPS 播放一次后保持。仓库内置演示使用新生成的毛绒小熊，图集及动图位于 `assets/characters/runner-v2`，需将图集放进调用工程的静态资源目录。素材库与成片共用 `RunnerSprite` 的帧计算，避免 GIF 自行播放造成跳帧不同步。

`constraintLabel` 默认是“约束”，在角色被牵住时从绳索中点向上弹出，并跟随绳子的形状和回拉位置；传入空字符串可隐藏。原来的 `label` 仍控制角色旁的“跑偏了！”提示。

`AgentPipeline` 接收 `time/startAt/output`，以及可选的 `agentLabel/toolLabel`，先显现 Agent，再展开右侧输出窗口。目录独立演示该流程；素材卡入场及汇聚由案例使用 `CardEntrance/ContentCollapse` 编排。

`TypewriterComparison` 保留两段内容先后打字、展示和收成左右栏的完整动作，内容改由 `left/right` 提供。每侧的 `text` 为必填正文；`label` 为卡片内身份，`columnTitle` 为收拢后的栏标题，`thumbnail` 为缩略图，`compactTitle/compactDescription` 为收拢后的名称和说明，均可替换。`heading` 为展开时的总标题。省略的标签与说明不会补入业务文案；`compactTitle` 未传时依次沿用 `columnTitle/label`，显式 `null` 或空字符串则不显示。

```tsx
<TypewriterComparison time={frame/fps}
  heading="两种方案，对照来看"
  left={{text:'先提出问题。\n再给出例子。',label:'方案 A',columnTitle:'方案 A',compactTitle:'问题出发'}}
  right={{text:'先展示案例。\n再解释原理。',label:'方案 B',columnTitle:'方案 B',compactTitle:'案例出发'}}
  check={false} dim={false} compact={{startAt:4.9,duration:0.6}}
/>
```

`time/startAt` 单位为秒，下面的阶段时刻均相对于 `startAt`。每侧的 `typing` 可设置 `startAt/duration`；默认左侧 0.15–2.7 秒，右侧 2.3–3.5 秒，各卡片随其输入开始时刻淡入。打字按 Unicode 码点推进。固定的 800×450 设计画布中，展开卡为 318×176 与 268×176；新正文建议不超过三行、每行 16 个汉字，超出时需重新排版确认。

| 阶段 | 默认及可配置内容 |
| --- | --- |
| `check` | 默认关闭；传 `{label:'已核实'}` 显示调用方提供的提示，默认 1.7–2 秒渐显。可设置 `startAt/duration`，左文下划线由独立的 `underlineAt` 控制，默认从 1.8 秒后出现；`underlineAt:false` 不加下划线。组件不执行内容校验或生成建议数量。 |
| `dim` | 默认关闭；传 `{opacity:0.4,badge:'备注'}` 淡化右文，可用 `startAt/duration` 调整默认 3.5–4.4 秒时段，默认最终透明度 0.36。`badge` 可省略或置空，若提供则从淡化开始时刻起在最多 0.3 秒内显现。 |
| `compact` | 默认在 4.9–5.5 秒将原卡片连续收为 66px 高的左右栏，到位后保持。可设置 `startAt/duration`；`false` 则保持展开状态。缩略图区域为 54×42 设计像素。 |

阶段 `duration=0` 为即时切换，负时长按 0 处理，非有限阶段参数回退默认值；淡化透明度限制在 0–1。所有动画由当前时间计算，支持倒序跳帧；动态缩略图由调用方提供统一时钟。

旧的 `ownText/aiText/ownThumbnail/aiThumbnail` 现改用 `left/right` 对象。原视频的专用命名及“自己写与 AI 写”文案继续保存在案例 `WritingComparison` 中，[完整范例](../../examples/component-examples/writing-comparison/README.md) 直接复用该案例，提供 7 秒输入、提示、淡化和收拢预览。原成片同样调用此案例，后续缩略图放大衔接保持原时钟。

`CardSpotlight` 由调用方提供 `progress`（0–1）、`from` 和 `to` 两个矩形（`x/y/width/height`）：0 在起点、1 在终点，进度从 1 降回 0 即归位。`from` 应匹配被放大内容的实际区域，例如卡片内的小缩略图；`to` 指定放大后的位置和尺寸。`fromRadius/toRadius` 默认为 10，可调整两端圆角；`dimColor/dimOpacity` 配置背景淡化，默认 `#f5f6ef` / `0.88`，透明度设为 0 可关闭。

`content` 可为 React 内容或接收同一放大进度的渲染函数，字号可随进度变化以避免拉伸文字。动态内容与原缩略图使用同一时钟；组件只控制几何及淡化，不重置内容时间。停留时长、往返时间线和提示标签由视频工程编排，不再提供 `time/startAt/badge` 参数。

[卡片放大回位完整范例](../../examples/component-examples/card-spotlight/README.md) 直接使用原 `SpotlightSequence`，提供缩略图、放大、停留说明和归位的 4 秒完整预览。可替换静态或动态内容，来源与前景共用时间；范例仍保存在案例工程。

```tsx
<CardSpotlight progress={progress}
  from={{x:435,y:187,width:54,height:42}}
  to={{x:232,y:138,width:336,height:189}}
  fromRadius={3} content={<YourContent />} />
```

分层内部可以播放动态 React 内容：每层的 `content` 和顶部的 `screen` 可传 `(elapsed) => ReactNode`，`elapsed` 为该面板入场完成后的秒数，暂停或随机跳帧仍与画面一致。传普通 React 内容的原有用法保持。仓库演示和成片已接入正文与素材图滚动、装饰声波、字幕扫色和时间线播放头，面板姿态与进入时刻不变。声波是动画示意，不分析真实音频。

`RisingCurve` 使用 `progress`（0–1）控制曲线、填充和端点，支持 `label/title/color`。曲线是概念趋势示意，不是实测数据图；同屏多实例使用独立渐变 ID。

`ProgressRow` 是独立的单条进度：`label`、`progress`（0–1）和 `color` 由调用方提供，组件不会自动推进或生成数字。`status` 可选 `none`、`waiting`、`complete`，`time` 只驱动等待图标旋转；等待图标默认跟随进度，也可用 `markerProgress` 单独指定位置。`enterProgress/statusProgress` 控制入场和状态显隐，默认均为 1。`x/y/width` 调整位置与尺寸，默认 696×82，内建内容随宽度等比调整。

`caption`、`annotation`、`value` 和 `children` 接收 React 内容，分别用于轨道下方说明、等待标注、右侧数值和自定义内容；计数规则和业务文案留给调用方。`badge` 替换完成标记，默认勾号。

需要完整的两行快慢对照时，参考 [单条进度 → 进度对比完整范例](../../examples/component-examples/progress-row/README.md)。范例使用原 `ProgressRace` 组合，列出可替换内容与保留节奏；素材站的单条进度卡片提供 9 秒完整预览。组合继续位于案例工程，不作为本包公开组件导出。

```tsx
<ProgressRow label="素材准备" progress={progress} color="#409eff"
  status={progress >= 1 ? 'complete' : 'waiting'} time={frame / fps}
  caption="收集并整理画面素材" value={Math.round(progress * 100) + '%'} />
```

`DocumentWindow` 只负责窗口与正文展示。`children` 提供文档，`title` 提供标题栏；`enterProgress/scrollProgress` 均为 0–1，默认 1/0。`scrollDistance` 是正文需要滚动的像素数，正文应有相应长度。`x/y/width/height` 可设置窗口区域，尺寸最低 40px。`overlay` 是窗口内固定位置的叠加内容；需要随正文滚动的内容放进 `children`。组件没有内置时间线、章节或脚本文案。

`HighlightBox` 接收 `progress`（0–1）及父容器内的 `x/y/width/height`，控制高亮框展开；可设置 `color/shadowColor/radius/strokeWidth`。它可独立覆盖任意内容，也可作为文档窗口的 `overlay`。

```tsx
<DocumentWindow title="教程文档" scrollProgress={scroll} scrollDistance={240}
  overlay={<HighlightBox progress={highlight} x={50} y={80} width={280} height={100} />}>
  <YourDocument />
</DocumentWindow>
```

`CollapsingTitle` 接收 `title`、`progress`、起终点 `from/to`（均指标题正文左上角）及 `fontSize/compactFontSize`，同一标题持续显示并移动缩小。可传 `lead/description/compactDescription`，配合收拢切换说明；组件没有固定章节编号或业务文案，颜色可由标题 React 内容自行设置。

文档窗口、区域高亮与标题收拢共享 [脚本文档讲解完整范例](../../examples/component-examples/script-document/README.md)：沿用原案例的章节衔接、文档滚动、高亮和两条摘要编排。素材站三个对应卡片均可打开同一份 12 秒预览；正文、标题和说明可替换，原组合继续位于案例工程。

固定讲解顺序、计数节奏和业务文案由视频工程编排。仓库原有的脚本文档讲解、快慢进度对比、五卡文档聚焦、小节摘要、章节缩略卡和四卡素材准备代码已迁入 `examples/reference-opening/compositions/`，不属于本包的导出或素材目录；可参考案例组合上述独立动作。`SceneThumbnail`、`PreparationCards` 及其专属类型已退出公开入口，案例使用独立动作配合底板、编号和文案完成原有效果。

`CardEntrance` 接收单张卡片的 `children`、`progress`（0–1）、`x/y/width/height`。`offset` 为入场前相对目标位置的偏移，默认 `{x:0,y:12}`；`fromScale` 控制起始缩放并随入场回到 `1`，默认 `1` 保持原有大小不变。`rotation/background/borderRadius/boxShadow` 可调整样式。调用方可映射任意数量卡片，并逐张传入位置和进度；组件没有五卡布局或固定入场间隔。

`FocusLayer` 接收 `progress`、`foreground` 和前景区域 `rect={x,y,width,height}`，可以只展示前景。`background` 可选，默认不创建背景层；传入时，`blur/backgroundOpacity` 控制聚焦完成时背景的模糊半径与透明度，默认 3px / 0.35。`offset/fromScale` 控制前景入场位移与起始缩放，默认 `{x:0,y:24}` / 0.96；`panelStyle` 可调整前景外观。说明、标签和时间线由调用方提供。

```tsx
<CardEntrance progress={entry} x={60} y={100} width={220} height={150} rotation={-3}>
  <YourCard />
</CardEntrance>

<FocusLayer progress={focus} rect={{x:105,y:168,width:600,height:183}}
  foreground={<YourContent />} />
```

需要同时处理背景时，再传入 `background={<YourScene />}`；素材预览默认仅展示前景。

[文档聚焦完整范例](../../examples/component-examples/document-focus/README.md) 由原 `DocumentFocusGallery` 组合 `CardEntrance/FocusLayer`，展示资料卡逐张入场、背景淡化虚化和前景要点显现的 6 秒完整镜头。资料、说明及前景内容可替换，两个动作卡片共享同一份范例。

`ConstraintRelease` 接收 `content`、默认六条 `tags` 和 `badge`；先展开标签，再掉落标签，2.3–2.8 秒显示窗口内容，3.3–3.8 秒放大窗口。内容均由调用方提供，不内置原片图片。
