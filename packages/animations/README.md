# @remotions/animations

Remotion 可复用动画组件，当前公开导出 **22 个**。旧组件及归档实现已移除。

| 类别 | 组件 | 用途 |
| --- | --- | --- |
| 版式转场 | `PerspectivePanel` | 任意内容的透视投影与姿态过渡 |
| 叙事动画 | `ExplodedLayers` | 多层内容拆解与引线标注 |
| 版式转场 | `SceneThumbnail` | 完整场景缩为章节缩略卡 |
| 版式转场 | `FanCardDeck` | 图片、文档等卡片的扇形展开 |
| 文字特效 | `ChapterHeading` | 编号、标题和说明的遮罩切换 |
| 背景特效 | `BlurredCollage` | 静止纸纹上的虚化拼贴向左下漂移并淡出 |
| 信息叠加 | `AudioPulseBadge` | 装饰波形图标及扩散细圆环 |
| 叙事动画 | `ChapterCardRow` | 章节缩略卡上移、放大并排为总览 |
| 叙事动画 | `BranchingPaths` | 多条素材路径、否定标签和选路强调 |
| 版式转场 | `SectionCollapse` | 完整讲解画面缩进顶部已完成条目 |
| 叙事动画 | `TargetReticle` | 偏心落点、准星归位及靶面移到侧边 |
| 叙事动画 | `ConstraintSwitches` | 约束开关依次关闭、文字划线 |
| 叙事动画 | `TetheredMotion` | 可替换对象前进、被绳索牵回并切换姿态 |
| 数据图表 | `RisingCurve` | 概念趋势曲线、面积和端点同步展开 |
| 版式转场 | `DocumentFocusGallery` | 五卡文档版式虚化后突出前景引文 |
| 叙事动画 | `PreparationCards` | 四张素材卡依次浮入，停留后汇聚 |
| 叙事动画 | `AgentPipeline` | Agent 显现，连接工具与成片窗口 |
| 版式转场 | `ScriptDocumentGuide` | 文档入场、提示段落标注和清单收拢 |
| 文字特效 | `TypewriterComparison` | 两段文字逐字输入，再缩成左右栏 |
| 版式转场 | `CardSpotlight` | 卡片放大到前景，讲解后回到原位 |
| 数据图表 | `ProgressRace` | 进度快慢、完成标记、等待及计数示意 |
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

`ChapterCardRow` 接收 `cards=[{id,title,description,content}]` 和 `progress`（0–1）。默认三张卡从下方小卡移动到居中大卡，插图、主标题和说明随布局一起移动。`content` 填满插图区域，也可以使用 `({width,height,progress}) => ReactNode`，根据实际插图区域尺寸对齐内容；原有静态内容写法保持兼容。原有 `SceneThumbnail` 新增可选 `number`，不传仍为 `01`。

`BranchingPaths` 接收 `time`、可选整体开始 `startAt`，以及 `cards=[{id,content,x,y,width?,height?,rotation?,selected?,enterAt?}]`。每张卡默认 90×51，`selected` 标识最终保留的路径节点。默认前两秒展开，2.3 秒出现 `stamp`、2.85 秒划线、3.9 秒淡去；4.1–4.9 秒绘出强调路径并淡化其他卡。`fromLabel/toLabel/stamp/routeLabel` 均可替换。曲线路径为该参考结构，适用于一个起点与一个终点之间的多路解释。

选路后的光点在 4.1–6 秒沿同一条曲线前进，中段较快、接近终点时温和放慢，到终点保持；6.25–6.65 秒显示 `resultLabel`（默认“启发 · 灵感”）。这些时间均相对 `startAt`，支持随机跳帧。

三条基础路线按“上 → 下 → 中”交替起笔，分别从 0、0.35、0.7 秒开始，单条绘制仍为 0.65 秒。卡片入场及后续选路不随此错峰调整而改变。

`SectionCollapse` 接收 `children`、`progress`、`label`，可选 `number`（默认 `1`）及 `target={x,y,width,height}`（默认 `{x:49,y:47,width:150,height:37}`）。将讲解主体放在组件内部，纸底、字幕和其他导航放在外部；整个主体向摘要条缩小并淡去，保留已完成的小节名称。素材库和第一点案例均使用 0.75 秒的收束进度。

`TargetReticle`、`ConstraintSwitches`、`TetheredMotion`、`DocumentFocusGallery`、`ConstraintRelease` 均接收 `time`（秒）和可选 `startAt`。靶心可替换 `shotLabel/aimLabel/color`；约束开关默认两行，可替换 `heading/labels/offLabel`，默认先后关闭时刻为相对 5.1、7.3 秒；目录演示整体提前 2.2 秒。

`TargetReticle` 在相对 0.6 秒命中时加入短促衰减抖动，0.88 秒前归稳，再接原有 0.9 秒开始的准星归位。抖动只作用于靶面，不移动整页，也不改变后面的移位和缩放时间。

`TetheredMotion` 的 `running` 和 `caught` 为 React 内容插槽，建议透明图片或 SVG；组件只负责运动与绳索，不生成角色逐帧肢体动画。约 1.35 秒切换姿态，避免两个姿态半透明重叠。1.4 秒牵住角色，停顿至 1.9 秒，再用 1.1 秒慢慢回拉 72px 并归稳；最终停留位置保持。绳索端点跟随角色，受力时收紧但始终保留弧度，回拉时逐渐放松。

也可用 `spriteSrc` 替代两个 React 插槽，提供 4×4 的透明图集：前 8 帧以 12 FPS 跑动循环，后 8 帧在牵住时以 18 FPS 播放一次后保持。仓库内置演示使用新生成的毛绒小熊，图集及动图位于 `assets/characters/runner-v2`，需将图集放进调用工程的静态资源目录。素材库与成片共用 `RunnerSprite` 的帧计算，避免 GIF 自行播放造成跳帧不同步。

`constraintLabel` 默认是“约束”，在角色被牵住时从绳索中点向上弹出，并跟随绳子的形状和回拉位置；传入空字符串可隐藏。原来的 `label` 仍控制角色旁的“跑偏了！”提示。

`DocumentFocusGallery` 的文档按顺序逐张进入：相对 0.1 秒起，每隔 0.4 秒一张，单张入场 0.3 秒。全部到齐后显示 `caption`，再开始聚焦前景引文；目录和成片共用时间线。

`PreparationCards` 接收 `time/startAt/cards`，每项含 `id/title/artwork` 和可选 `description`；按四卡版式排列。相对 0.15 秒开始逐张入场，3.35–3.95 秒向 Agent 的位置汇聚并淡出。`AgentPipeline` 接收 `time/startAt/output`，以及可选的 `agentLabel/toolLabel`，先显现 Agent，再展开右侧输出窗口。目录的素材准备演示将两者串接，结尾保持成片窗口，避免停在空白帧。

脚本讲解新组件均接收 `time/startAt`：`ScriptDocumentGuide` 的 `document` 插槽负责正文，组件负责窗口、标题、标注框与清单；`TypewriterComparison` 接收 `ownText/aiText` 及可选缩略图，先输入两段内容再收成两栏。`CardSpotlight` 的 `from` 是原位置，`content` 可为 React 内容或接收放大进度的渲染函数，默认放大至 336×189，停留后回位，字号可随进度变化以避免拉伸文字。`ProgressRace` 可替换标题、两行名称、快慢标签，呈现示意进度与计数，不是实测图表。

`ScriptDocumentGuide` 可传 `chapterFrom`（`number/title/description`）：先展示章节标题，完整停留 1.2 秒，再复用 `ChapterHeading` 原有的上下遮罩切换为“逐字稿”。文档在切换期间进入，后续讲解节奏整体从 1.8 秒后开始；不传该参数仍直接进入逐字稿。标题后续收为清单时使用等比缩放，不拉伸字形。

分层内部可以播放动态 React 内容：每层的 `content` 和顶部的 `screen` 可传 `(elapsed) => ReactNode`，`elapsed` 为该面板入场完成后的秒数，暂停或随机跳帧仍与画面一致。传普通 React 内容的原有用法保持。仓库演示和成片已接入正文与素材图滚动、装饰声波、字幕扫色和时间线播放头，面板姿态与进入时刻不变。声波是动画示意，不分析真实音频。

长脚本可配置 `ScriptDocumentGuide scrollDistance={233}`，正文由 `document` 提供足够高度；默认 `0` 不滚动。窗口进入后停顿，再在局部 1–6.3 秒滚动对应距离，结束后保持并标注段落。案例将两张正文上下连续排列，不再靠两张短图交叠切换。

`RisingCurve` 使用 `progress`（0–1）控制曲线、填充和端点，支持 `label/title/color`。曲线是概念趋势示意，不是实测数据图；同屏多实例使用独立渐变 ID。

`DocumentFocusGallery` 的 `documents=[{id,content}]` 对应预设五卡布局，`focusContent` 为前景引文插槽，`caption` 和 `badge` 可替换；约 2.3–3 秒虚化背景并显示引文。`ConstraintRelease` 接收 `content`、默认六条 `tags` 和 `badge`；先展开标签，再掉落标签，2.3–2.8 秒显示窗口内容，3.3–3.8 秒放大窗口。内容均由调用方提供，不内置原片图片。
