# 卡片入场与内容收拢的完整范例：素材准备卡

本范例直接调用原案例 `PreparationCards`，由它组合 `CardEntrance/ContentCollapse`，再按原成片时刻衔接 `AgentPipeline`。四卡逐张浮入、阅读停顿、旋转归正、缩小汇聚及输出窗口保持原有编排。默认插图复用已有的共用 SVG，输出窗口为可替换的程序示意内容；新入口和示例内容待用户确认。

## 什么时候使用

适合展示一段工作开始前需要准备的材料，以及材料如何交给工具、形成结果。它展示完整的「准备 → 汇集 → 工具处理 → 输出」镜头，卡片名称、内容和结果均可替换。

## 替换内容

| 参数 | 内容 | 建议 |
| --- | --- | --- |
| `cards` | 0–4 张卡片，每项含唯一 `id`、`title` 和可选 `description/kind/artwork` | 标题建议不超过 6 个汉字，说明保持一行短句；少于四张时保留原靠左的排布与时间 |
| `kind` | 默认插图：0 脚本、1 配音、2 字幕、3 素材 | 省略时按卡片索引选择；仅支持整数 0–3 |
| `artwork` | 单卡自定义 React 内容 | 提供时替代默认插图；区域为 108×111 设计像素，图片建议使用 `objectFit: 'contain'` |
| `copy` | 标题和默认输出窗口文案 | 可局部替换 `eyebrow/title/outputEyebrow/outputTitle/outputDescription` |
| `agentLabel` / `toolLabel` | Agent 与工具名称 | 保持原有一行短名称，避免挤入连接线或输出窗口 |
| `output` | 自定义输出画面，React 内容或 `(time) => ReactNode` | 外框内约 242×132 设计像素；动态内容使用同一范例时钟 |

只有省略 `cards` 才使用默认四张卡。`cards={[]}` 保留空列表，超过四张会明确报错，不会截断或在画外继续排卡。需要更多卡片时，用独立 `CardEntrance` 重新编排并验收。`artwork={null}` 和 `output={null}` 不补入演示内容；输出为空时仍保留原有窗口外框与显现动作。

`kind` 属于每张卡片的字段，`artwork` 同样填在对应卡片内。自定义插图优先于 `kind`，应填满或居中于卡片插图区域，不要复制外部卡片底板。

默认输出窗口的标题建议不超过 11 个汉字、说明不超过 28 个汉字，保持一行；更长内容通过 `output` 自行排版。顶部标题建议不超过 24 个汉字。

## 保留的效果

- 16:9、800×450 设计坐标，输出 1280×720、30 FPS、6.4 秒，共 192 帧，对应原成片 51.6–58 秒。
- 卡片从相对 0.15 秒起逐张浮入，相隔 0.25 秒，每张持续 0.4 秒；从下方 36px 浮入，缩放 `0.92→1`，初始旋转 `-4/-1/0/4` 度，1.3 秒全部就位。
- 四张卡在 `(70/248/426/604,175)`，尺寸 `132×166`，插图、标题和说明随同一张卡一起运动。卡片保持至 3.35 秒，再用 0.6 秒汇聚到原 `(251,168)`、缩放 `0.2`，同时旋转归正；3.65–3.95 秒淡出。
- Agent 在 3.4 秒开始显现，工具名称从 4.2 秒起显现，连接线从 4.25 秒起显现，成片窗口在 4.35–4.8 秒展开；保持到结束，光标继续按原节奏闪烁。
- 输出画面可随本镜头 `time` 连续更新，不在窗口出现时重置。需要从窗口出现时才启动内部内容，可在调用方使用 `Math.max(0,time-4.35)` 计算内部时间。
- 新卡片排布、更多卡片、画幅或动作速度需要重新验收。独立动作仍由组件包提供，固定组合留在案例中，不重新登记为公开动作。

## 使用方式

以下入口放在仓库根目录，其他位置按目录调整导入路径：

```tsx
import {Composition,registerRoot} from 'remotion';
import {PreparationCardsExample} from './examples/component-examples/preparation-cards/Example';

registerRoot(()=><Composition
  id="PrepareMaterials" component={PreparationCardsExample}
  width={1280} height={720} fps={30} durationInFrames={192}
  defaultProps={{
    cards:[
      {id:'outline',title:'提纲',kind:0},
      {id:'voice',title:'旁白',kind:1},
      {id:'captions',title:'字幕',kind:2},
      {id:'images',title:'配图',description:'图片与演示片段',kind:3},
    ],
    copy:{title:'先把讲解需要的内容准备好',outputTitle:'从素材到完整讲解'},
    agentLabel:'Agent',toolLabel:'Remotion',
  }}
/>);
```

替换插图或动态输出时，在自己的镜头中传 React 内容，再注册该镜头：

```tsx
const MyPreparation=()=> <PreparationCardsExample
  cards={[{id:'chart',title:'图表',artwork:<YourArtwork />} ]}
  output={time=><YourResult time={time} />}
/>;
```

入口：[index.tsx](./index.tsx)。默认素材与文案：[example.json](./example.json)。原组合：[PreparationCards.tsx](../../reference-opening/compositions/PreparationCards.tsx)。独立动作：[CardEntrance.tsx](../../../packages/animations/src/reference-opening/CardEntrance.tsx)、[ContentCollapse.tsx](../../../packages/animations/src/reference-opening/ContentCollapse.tsx)、[AgentPipeline.tsx](../../../packages/animations/src/reference-opening/AgentPipeline.tsx)。

## 预览维护

从仓库根目录运行 `node examples/component-examples/preparation-cards/render.mjs`，由共享流程导出完整 MP4、封面和说明。改动内容或编排后重新导出；机器检查通过不代替用户视觉确认。

素材站入口：版式转场 → 卡片入场 / 内容收拢，或叙事动画 → Agent 成片流程 → 查看完整范例 · 素材准备卡。
