# 卡片放大回位完整范例

本范例直接调用原案例 `SpotlightSequence`，使用基础动作 `CardSpotlight` 完成从缩略图放大、背景淡化、停留讲解和返回原位。标签、来源卡片及文案留在案例中，新的范例入口待用户确认。

## 什么时候使用

适合图片、图表、作品案例或动态片段的重点讲解：先保留所在版面，放大局部内容，讲完后回到原位置。

默认内容沿用已有的神经元示意动画，用来展示缩略图与放大画面同步更新的效果。替换为其他内容时，同样使用统一时间。

## 替换内容

| 参数 | 内容 | 建议 |
| --- | --- | --- |
| `title` | 画面上方标题 | 建议保持一行短句 |
| `sourceTitle` / `sourceDescription` | 缩略图旁的名称和说明 | 标题建议不超过 12 个汉字，说明保持短句 |
| `badge` | 停留时出现的标签 | 支持 React 内容；传空字符串或 `null` 隐藏 |
| `content` | 图片、图表或自定义画面 | 支持 React 内容或 `({time,expanded}) => ReactNode`，省略时使用默认动画 |

`content` 回调中的 `time` 是本镜头的秒数，两处视图完全一致；来源缩略图的 `expanded` 始终为 `0`，前景画面的值随放大进度变化。可用它调整字号或排版，保持文字可读。

`content={null}` 保留空画面，不补入默认动画。默认画面是动画素材示意，本范例不提供数据结论。

## 保留的效果

- 沿用 16:9、800×450 设计坐标，缩略图与来源卡片对应；前景目标区域为 `(232,138,336,189)`。
- 原缩略图起点继续使用案例中的位置计算，首段约 0.1 秒完成原版微小位置衔接；放大与归位都使用该实际位置。
- 0–0.4 秒放大，0.4–3 秒停留，3–3.5 秒缩回，3.5–4 秒保持原位。
- 标签在 1.9–2.2 秒出现，在缩回时淡去；背景淡化、圆角和阴影沿用原组合。
- 动态内容按同一个 `time` 连续更新，返回时不重新从零计时。回调应只根据输入计算画面，以支持倒序跳帧和视频导出。
- 新的位置、尺寸或其他时间编排可使用 `CardSpotlight` 另行组合并验收；此完整范例保留现有版面和节奏。

## 使用方式

以下代码放在仓库根目录的 Remotion 入口中，其他位置按目录调整导入路径：

```tsx
import {Composition,registerRoot} from 'remotion';
import {CardSpotlightExample} from './examples/component-examples/card-spotlight/Example';

registerRoot(()=><Composition
  id="CaseSpotlight" component={CardSpotlightExample}
  width={1280} height={720} fps={30} durationInFrames={120}
  defaultProps={{title:'看一下这个案例',sourceTitle:'案例预览',sourceDescription:'展开查看重点',badge:'讲完再回到原位'}}
/>);
```

替换画面时，在自己的镜头组件中调用 `<CardSpotlightExample content={<YourPicture />} />`；动态内容可使用 `<CardSpotlightExample content={({time,expanded})=><YourChart time={time} expanded={expanded}/>} />`，再将自己的镜头注册为 Composition。将图片铺满内容容器，默认前景区域是 16:9；其他比例需明确选择留白、裁切或重新排版。

入口：[index.tsx](./index.tsx)。文案、尺寸和时间：[example.json](./example.json)。原组合：[SpotlightSequence.tsx](../../reference-opening/compositions/SpotlightSequence.tsx)。独立动作：[CardSpotlight.tsx](../../../packages/animations/src/reference-opening/CardSpotlight.tsx)。

## 预览维护

从仓库根目录运行 `node examples/component-examples/card-spotlight/render.mjs`，由共享导出流程生成 MP4、封面和说明。修改默认内容或组合后重新生成预览，并检查缩略图、前景及返回时的衔接。

素材站入口：版式转场 → 卡片放大回位 → 查看完整范例。
