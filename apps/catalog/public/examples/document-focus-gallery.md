# 卡片入场与前景聚焦的完整范例：文档聚焦

本范例直接调用原案例 `DocumentFocusGallery`，保留资料卡逐张入场、说明出现、背景虚化淡化和前景要点显现的原有编排。两个动作 `CardEntrance` 与 `FocusLayer` 共享同一个完整范例。新范例入口及示例内容待用户确认。

## 什么时候使用

适合先展示多份材料，再突出一个引用、结论、图片或图表的镜头。背景资料由本案例显式提供，独立 `FocusLayer` 的背景参数仍然可选。

## 替换内容

| 参数 | 内容 | 建议 |
| --- | --- | --- |
| `cards` | 简单文档卡片，每项含 `id/label/title/body` | 默认五张；标题建议不超过 6 个汉字，摘要建议不超过 22 个汉字 |
| `documents` | 自定义卡片，每项含唯一 `id` 和 React `content` | 提供时替代 `cards`，可放图片、图表或文档缩略内容 |
| `copy` | 资料旁的说明及前景重点文案 | 支持局部替换，未提供项沿用默认值 |
| `focusContent` | 自定义前景 React 内容 | 提供时替代默认重点说明，区域为 `600×183` 设计像素 |
| `caption` | 自定义资料旁说明 | 提供时替代默认说明；`null` 保留空说明 |
| `badge` | 前景右上角的短标签 | 建议保持一行短句 |

`copy` 包含 `captionLead/captionTitle/captionEmphasis` 与 `focusLead/focusText/detailLead/detailText`。默认前景正文建议不超过两行、补充说明不超过一行；内容更长需重新检查或自行排版。

范例保留原五卡布局，支持 0–5 张卡片。超过五张会明确报错，不会静默截断或重叠复用位置；需要更多卡片时，使用独立 `CardEntrance` 自定义布局。`cards={[]}`、`documents={[]}` 均保留空资料列表，`focusContent={null}` 不补入默认重点内容。

## 保留的效果

- 沿用 16:9、800×450 设计坐标下的五卡位置、尺寸和轻微倾斜，外层等比缩放。
- 默认 0.1 秒起逐张入场，相隔 0.4 秒，每张 0.3 秒；五张卡在 2 秒完成入场，2–2.25 秒出现资料说明。
- 2.3–3 秒背景同步虚化淡化，前景从下方显现并轻微放大；标签在聚焦后半段出现，3–6 秒保持展示，保留原案例聚焦后的阅读停顿。
- 前景区域为 `(105,168,600,183)`，背景最终虚化 3px、透明度 0.35。少于五张时，说明会在现有卡片入场后出现，聚焦最早仍从 2.3 秒开始。
- 新卡片布局、画布比例或动作速度需要重新验收。图片建议填满卡片容器，并明确使用留白还是裁切。

## 使用方式

以下代码放在仓库根目录的 Remotion 入口中，其他位置按目录调整导入路径：

```tsx
import {Composition,registerRoot} from 'remotion';
import {DocumentFocusExample} from './examples/component-examples/document-focus/Example';

registerRoot(()=><Composition
  id="EvidenceFocus" component={DocumentFocusExample}
  width={1280} height={720} fps={30} durationInFrames={180}
  defaultProps={{
    cards:[
      {id:'a',label:'资料 01',title:'具体问题',body:'先说明要解决的问题。'},
      {id:'b',label:'资料 02',title:'关键证据',body:'再给出支持这个观点的材料。'},
    ],
    copy:{focusText:'把当前要讲清楚的重点放在前景。',detailText:'资料作为上下文继续保留。'},
    badge:'本段重点',
  }}
/>);
```

需要自定义文档或前景时，在自己的镜头组件中调用 `<DocumentFocusExample documents={[{id:'a',content:<YourDocument />}]} focusContent={<YourQuote />} />`，再将该镜头注册为 Composition。保留内容容器的尺寸约定，避免长文直接挤入缩略卡或前景区域。

入口：[index.tsx](./index.tsx)。默认内容与时间：[example.json](./example.json)。原组合：[DocumentFocusGallery.tsx](../../reference-opening/compositions/DocumentFocusGallery.tsx)。基础动作：[CardEntrance](../../../packages/animations/src/reference-opening/CardEntrance.tsx)、[FocusLayer](../../../packages/animations/src/reference-opening/FocusLayer.tsx)。

## 预览维护

从仓库根目录运行 `node examples/component-examples/document-focus/render.mjs`，由共享导出流程生成 MP4、封面与说明。改动内容、布局或组合后重新生成预览，检查逐张入场及聚焦的衔接。

素材站入口：版式转场 → 卡片入场 / 前景聚焦 → 查看完整范例 · 文档聚焦。
