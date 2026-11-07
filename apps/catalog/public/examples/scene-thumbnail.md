# 内容收拢与章节标题的完整范例：章节缩略卡

本范例直接调用原案例 `SceneThumbnail`，用原 `ChapterHeading` 和 `openingState` 同步切换章节标题。默认分层插图及扇形卡片继续使用 `ExplodedLayers/FanCardDeck`；只替换图片、文案等演示内容，不另写缩小或标题动作。新入口与演示内容待用户确认。

## 什么时候使用

适合一个章节讲完后，让旧插图缩入底部卡片，保留上一节的视觉线索，同时开始下一节。它与「小节收束」共用 `ContentCollapse`，但结果不同：小节收束留下短摘要条，本范例留下画面缩略卡并衔接下一章。

## 替换内容

| 参数 | 内容 | 建议 |
| --- | --- | --- |
| `from` / `to` | 前后章节的 `{number,title,description}` | 标题建议不超过 6 个汉字、说明不超过 16 个汉字，保持原单行布局 |
| `caption` / `number` | 旧插图缩略卡的说明和编号 | 与 `from` 独立配置；说明建议不超过 12 个汉字，编号建议 2 位数字 |
| `overview` | 顶部总览的 `{eyebrow,title}` | 可局部替换，保持原短文案长度量级 |
| `content` | 上一节插图，React 内容或 `({time,progress}) => ReactNode` | 同一份插图连续缩小，不重建第二份缩略图 |
| `nextContent` | 下一节插图，React 内容或 `({time,progress}) => ReactNode` | 外层按原扇形卡组的显现进度渐显；回调可进一步控制内部动作 |

两个内容插槽均使用 800×450 的**透明设计舞台**，标题由外面的 `ChapterHeading` 提供。上一节默认是右侧分层插图，下一节默认是右侧扇形卡组。替换时保持原右侧插图的位置与占用区域，避免将整幅 800×450 的截图直接填满舞台，或把标题重复放入插图。

上一节的内容是围绕原 `(338,94)`、360×202.5 面板展开的插图，缩小目标为 `(120,298,0.23)`，并非把整幅舞台缩放后居中塞进卡片。自定义内容若使用其他原点或尺寸，应在自己的案例中调整 `SceneThumbnail` 的 `target/card`，再验收新的落点。

回调的 `time` 是从 0 开始的范例秒数，两个插槽共用此时钟，不在章节切换时重置；`content` 的 `progress` 是缩小进度，`nextContent` 的 `progress` 是稍晚启动的入场进度。默认旧插图的外部标签随收拢淡出，自定义插图可用 `progress` 控制自己的标注。`content={null}` / `nextContent={null}` 会保留空内容，不补入演示画面。

## 保留的效果

- 16:9、800×450 设计坐标，输出 1280×720、30 FPS、4 秒。范例从原开场 7.5 秒开始，第一秒保留当前章节与已展开的分层画面。
- 1–1.5 秒对应原开场 8.5–9 秒：旧插图缩至 `(120,298,0.23)`，卡片底板在 `(155,310)`、尺寸 `153×92`，标题三行同时上移切换。
- 下一节默认卡片在 1.15–1.68 秒展开，对应原开场 8.65–9.18 秒；顶端总览在 1–1.43 秒显现。其相对先后顺序保留。
- 编号和说明随缩小进度渐显，旧插图保持连续时间；默认分层标签在 1–1.33 秒淡出，避免缩略卡外残留大标签。
- 最后保留新章节与旧缩略卡，延长展示停顿，不继续播放原成片的下一次章节切换。更改速度、画幅、布局或插图占用范围需要重新验收。

## 使用方式

以下入口放在仓库根目录，其他位置按目录调整导入路径：

```tsx
import {Composition,registerRoot} from 'remotion';
import {SceneThumbnailExample} from './examples/component-examples/scene-thumbnail/Example';

registerRoot(()=><Composition
  id="ChapterHandoff" component={SceneThumbnailExample}
  width={1280} height={720} fps={30} durationInFrames={120}
  defaultProps={{
    from:{number:'01 / 03',title:'提出问题',description:'先把问题说清楚'},
    to:{number:'02 / 03',title:'拆解步骤',description:'逐步展示解决过程'},
    caption:'先把问题说清楚',number:'01',
    overview:{title:'从问题到解决过程'},
  }}
/>);
```

自定义插图可在自己的镜头中传入：

```tsx
const MyChapter=()=> <SceneThumbnailExample
  content={({time,progress})=><PreviousArtwork time={time} shrink={progress}/>}
  nextContent={({time,progress})=><NextArtwork time={time} entrance={progress}/>}
/>;
```

入口：[index.tsx](./index.tsx)。默认文案与时长：[example.json](./example.json)。原组合：[SceneThumbnail.tsx](../../reference-opening/compositions/SceneThumbnail.tsx)。基础动作：[ContentCollapse.tsx](../../../packages/animations/src/reference-opening/ContentCollapse.tsx)、[ChapterHeading.tsx](../../../packages/animations/src/reference-opening/ChapterHeading.tsx)。

## 预览维护

从仓库根目录运行 `node examples/component-examples/scene-thumbnail/render.mjs`，由共享流程导出完整 MP4、封面及说明。修改内容或编排后重新导出；机器检查不代替视觉确认。

素材站入口：版式转场 → 内容收拢，或文字特效 → 章节标题切换 → 查看完整范例 · 章节缩略卡。
