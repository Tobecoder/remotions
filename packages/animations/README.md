# @remotions/animations

Remotion 可复用动画组件，当前公开导出 **10 个**。旧组件及归档实现已移除。

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

`ChapterCardRow` 接收 `cards=[{id,title,description,content}]` 和 `progress`（0–1）。默认三张卡从下方小卡移动到居中大卡，插图、主标题和说明随布局一起移动。`content` 填满插图区域。原有 `SceneThumbnail` 新增可选 `number`，不传仍为 `01`。

`BranchingPaths` 接收 `time`、可选整体开始 `startAt`，以及 `cards=[{id,content,x,y,width?,height?,rotation?,selected?,enterAt?}]`。每张卡默认 90×51，`selected` 标识最终保留的路径节点。默认前两秒展开，2.3 秒出现 `stamp`、2.85 秒划线、3.9 秒淡去；4.1–4.9 秒绘出强调路径并淡化其他卡。`fromLabel/toLabel/stamp/routeLabel` 均可替换。曲线路径为该参考结构，适用于一个起点与一个终点之间的多路解释。

选路后的光点在 4.1–6 秒沿同一条曲线前进，到终点保持；6.25–6.65 秒显示 `resultLabel`（默认“启发 · 灵感”）。这些时间均相对 `startAt`，支持随机跳帧。

`SectionCollapse` 接收 `children`、`progress`、`label`，可选 `number`（默认 `1`）及 `target={x,y,width,height}`（默认 `{x:49,y:47,width:150,height:37}`）。将讲解主体放在组件内部，纸底、字幕和其他导航放在外部；整个主体向摘要条缩小并淡去，保留已完成的小节名称。素材库和第一点案例均使用 0.75 秒的收束进度。
