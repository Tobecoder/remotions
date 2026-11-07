# 内容收拢的完整范例：小节收束

本范例直接调用原案例 `SectionCollapse`，由它组合 `ContentCollapse` 与编号摘要条。保留原第一点向左上角缩小、主体淡出、摘要渐显的方向、落点和相对节奏；默认演示沿用原 `BranchingPaths` 及卡片布局，缩略内容换成无外部依赖的示意图。新范例入口与示例内容待用户确认。

内容收拢与多路径演示共享这份完整预览：先展示多条路线、强调一条路线并让光点到达结果，再把讲完的内容收成摘要。关联入口不新增或复制动画。

## 什么时候使用

适合一个观点讲完后，把整段画面收成短摘要，给后续内容留出空间。范例展示完整的「讲解 → 收拢 → 归档保持」，不是只演示缩小动作。

## 替换内容

| 参数 | 内容 | 建议 |
| --- | --- | --- |
| `label` | 左上摘要条的小节名称，同时用于默认场景标题 | 建议不超过 8 个汉字，保持原 150×37 摘要条尺寸 |
| `number` | 摘要条圆形编号 | 建议 1–2 位数字 |
| `copy` | 默认场景的短文案 | 可局部替换 `eyebrow/description/fromLabel/toLabel/stamp/routeLabel/resultLabel`；保持原文案长度量级 |
| `content` | 自定义完整场景，传 React 内容或 `(time) => ReactNode` | 800×450 设计坐标；动态内容的 `time` 是从 0 开始的范例秒数 |

提供 `content` 时，完整替代默认标题和路径场景，`copy` 不再参与画面；`label/number` 仍用于摘要。`content={null}` 保留空场景，不会补入演示内容。背景色由外层提供，若希望背景也随内容一起缩小，可在 `content` 内显式绘制背景。

## 保留的效果

- 16:9，设计坐标 800×450，外层缩放至 1280×720。默认内容从原第一点的 14.9 秒开始，0–8.75 秒展示多路径讲解，保留交替画线和路线光点的原有时刻。
- 8.75–9.5 秒对应原成片 23.65–24.4 秒：整段内容从 `(0,0,1)` 收至 `(49,47,0.06)`，以左上角为变换原点。
- 收拢进度 0.4 后摘要开始渐显，主体在进度 0.65 后淡出。9.5–11 秒只保留已完成的编号摘要条。
- 摘要条位置 `(49,47)`，尺寸 `150×37`；编号、内边距、阴影及显隐均由原组合负责。原成片代码及公开动作 API 不变。
- 需要改变收拢开始时刻、目标位置、条目尺寸或画幅时，直接在自己的案例中调用 `SectionCollapse` 并传入进度和 `target`，再验收新编排。本范例的 11 秒镜头不自行重排动作。

## 使用方式

以下入口放在仓库根目录，其他位置按目录调整导入路径：

```tsx
import {Composition,registerRoot} from 'remotion';
import {SectionCollapseExample} from './examples/component-examples/content-collapse/Example';

registerRoot(()=><Composition
  id="SectionSummary" component={SectionCollapseExample}
  width={1280} height={720} fps={30} durationInFrames={330}
  defaultProps={{label:'先讲清楚问题',number:'1',copy:{description:'同一个目标，可以有不同的方法'}}}
/>);
```

复用自己的完整画面时，在自己的镜头组件中调用，再将镜头注册为 Composition：

```tsx
const MySection=()=> <SectionCollapseExample
  label="本节结论" number="2"
  content={time=><YourScene time={time} />}
/>;
```

`YourScene` 的根容器应填满 800×450 设计区域。其动画可使用回调提供的秒数；子组件直接读取 Remotion 帧时，读到的也是同一范例时钟，不会在收拢开始时重置。默认收拢在 8.75 秒开始，应让被替换内容在此之前完成讲解；更长的内容先调整案例编排再验收。

需要自定义路线、选择其他节点或关闭盖章划线时，可用 `content={time=><BranchingPaths time={time} cards={cards} routes={routes} selectedRoute="upper" stamp={false} />}` 替换讲解部分，继续复用原收拢动作。路线、时间、提示位置的配置见 [组件说明](../../../packages/animations/README.md)；本范例的默认画面仍保留原路径与阶段。

入口：[index.tsx](./index.tsx)。默认内容与时长：[example.json](./example.json)。原组合：[SectionCollapse.tsx](../../reference-opening/compositions/SectionCollapse.tsx)。基础动作：[ContentCollapse.tsx](../../../packages/animations/src/reference-opening/ContentCollapse.tsx)。

## 预览维护

从仓库根目录运行 `node examples/component-examples/content-collapse/render.mjs`，由共享流程导出完整 MP4、封面和说明。修改内容或编排后重新导出预览；机器检查通过不代替视觉确认。

素材站入口：版式转场 → 内容收拢，或叙事动画 → 多路径演示 → 查看完整范例 · 小节收束。
