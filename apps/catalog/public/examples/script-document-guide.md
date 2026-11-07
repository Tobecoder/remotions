# 文档窗口、区域高亮与标题收拢的完整范例

完整效果：**脚本文档讲解**。本范例直接调用原案例 `ScriptDocumentGuide`，保留「脚本 → 逐字稿」标题衔接、文档入场、正文滚动、区域高亮、说明收拢及两条摘要的原有编排。文档窗口、区域高亮、标题收拢三个动作共享同一个范例和预览。

范例入口及示例正文待用户确认，测试和视频生成通过不等于视觉验收。

## 什么时候使用

适合脚本结构、教程文档、正文与画面备注等说明。左侧负责讲解，右侧提供文档，最后把讲解收为要点。

## 替换内容

| 参数 | 内容 | 建议 |
| --- | --- | --- |
| `chapterFrom` | 开头章节的编号、标题与说明 | 保持短标题；默认显示「脚本 → 逐字稿」衔接 |
| `eyebrow` | 收拢后的章节短句 | 建议一行内显示 |
| `copy` | 逐字稿标题、提示说明、摘要与文档标题 | 支持局部替换，未提供项沿用范例默认值 |
| `paragraphs` | 代码绘制的示例正文 | 替换为实际文本，不改变文档窗口布局 |
| `document` | 自定义 React 文档内容 | 在自己的镜头组件里传入；会替代示例正文 |
| `scrollDistance` | 正文滚动距离，单位为设计像素 | 默认 `233`；正文较短时减小，避免滚到空白处 |

`copy` 可配置：`narrationTitle/narrationDescription`、`instructionLead/instructionTitle/instructionDescription`、`compactDescription`、`summary` 和 `documentTitle`。标题建议不超过 8 个汉字，说明保持一至两行；更长内容需要重新检查。

## 保留的效果

- 沿用 16:9、800×450 设计坐标下左标题、右文档的布局，外层等比缩放。
- 开头保留原章节标题，1.5–2.2 秒切换为逐字稿，1.8–2.2 秒文档入场；正文在 2.8–8.1 秒滚动，8.1 秒停下后高亮。
- 保留文字缩小为第一条摘要、提示说明出现、高亮、同一说明连续收拢为第二条摘要的顺序。完整镜头为 12 秒，末尾保持展示。
- 原高亮区位于文档窗口内部 `(118,64)`，尺寸 `219×160`，不会自动寻找文本。替换文档时将重点安排在该区域；需要移动强调区域时，使用独立 `HighlightBox` 重新组合并验收。
- 新比例、较长正文、不同标题结构或改变动作速度均需重新检查画面。

## 使用方式

以下示例放在仓库根目录的 Remotion 入口中，其他位置按目录调整导入路径：

```tsx
import {Composition,registerRoot} from 'remotion';
import {ScriptDocumentExample} from './examples/component-examples/script-document/Example';

registerRoot(()=><Composition
  id="DocumentExplanation" component={ScriptDocumentExample}
  width={1280} height={720} fps={30} durationInFrames={360}
  defaultProps={{
    chapterFrom:{number:'01 / 03',title:'操作指南',description:'正文与步骤说明'},
    eyebrow:'01 · 操作里写什么',
    copy:{narrationTitle:'操作正文',instructionTitle:'步骤 · 备注',summary:'整理成清楚的步骤'},
    paragraphs:['第一步：先准备好输入材料。','第二步：说明本次操作的重点。'],
    scrollDistance:0,
  }}
/>);
```

需要图片、富文本或自定义排版时，在自己的镜头组件中调用 `<ScriptDocumentExample document={<YourDocument />} scrollDistance={233} />`，再将这个镜头注册为 Composition。`document={null}` 保留空正文；`paragraphs={[]}` 不补入示例段落。

入口：[index.tsx](./index.tsx)。默认内容与时间：[example.json](./example.json)。原组合：[ScriptDocumentGuide.tsx](../../reference-opening/compositions/ScriptDocumentGuide.tsx)。基础动作：[DocumentWindow](../../../packages/animations/src/reference-opening/DocumentWindow.tsx)、[HighlightBox](../../../packages/animations/src/reference-opening/HighlightBox.tsx)、[CollapsingTitle](../../../packages/animations/src/reference-opening/CollapsingTitle.tsx)。

## 预览维护

从仓库根目录运行 `node examples/component-examples/script-document/render.mjs`，使用共享导出流程生成 MP4、封面和说明。改动组合、默认内容或时间后重新生成，并检查入口与说明是否一致。

素材站入口：版式转场 → 文档窗口、信息叠加 → 区域高亮、文字特效 → 标题收拢，各卡片下均可打开「脚本文档讲解」完整范例。
