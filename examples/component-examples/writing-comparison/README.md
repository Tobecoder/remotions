# 双栏打字对照的完整范例：自己写与 AI 写

本范例直接调用原案例 `WritingComparison`。业务文案和校验、淡化、收拢的原版配置保存在案例层，实际动作全部复用通用 `TypewriterComparison`；原成片也调用同一份案例。新预览入口及示意缩略图待用户确认。

## 什么时候使用

适合两段文案先后输入、给出说明，再将两张卡收为左右栏的讲解。原稿中关于自己写作与 AI 的观点、点评和“2 处建议”均是案例文案，可替换；组件不自动执行 AI 校验，也不生成建议数量。

## 替换内容

| 参数 | 内容 | 建议 |
| --- | --- | --- |
| `ownText` / `aiText` | 左右两段正文 | 默认保留原稿；新内容建议每段不超过三行、每行不超过 16 个汉字，更多内容需重新排版 |
| `copy` | 标题、身份、点评及收拢后的短文案 | 支持局部替换，字段见下方；标题保持一行，卡片名称不超过 12 个汉字 |
| `ownThumbnail` / `aiThumbnail` | 自定义 React 缩略图内容 | 54×42 设计像素，右侧当前为 16:9 内容留白显示；图片需自行选择留白或裁切 |

`copy` 支持 `headingPrefix/headingEmphasis/headingSuffix`、`leftColumn/rightColumn`、`leftLabel/rightLabel`、`checkLabel/critique`、`leftTitle/leftDescription/rightTitle/rightDescription`。正文或缩略图显式传空值时，不会恢复示例内容；校验、淡化与收拢阶段在本案例中保留原配置。

## 保留的效果

- 16:9、800×450 设计坐标，输出 1280×720、30 FPS、7 秒、210 帧。
- 左段 0.15–2.7 秒输入，右段 2.3–3.5 秒输入；校验提示在 1.7–2 秒显现，左文从 1.8 秒后加下划线。
- 右侧点评在 3.5–3.8 秒显现，正文在 3.5–4.4 秒淡化至 0.36；4.9–5.5 秒两张卡连续收成左右栏，保持到 7 秒。
- 原卡片位置、尺寸、字号、圆角、阴影及文字风格不变。默认右缩略图使用与成片相同的 `time-5.4` 动画时钟，变形时不重置。
- 后续放大镜头继续由原成片的 `SpotlightSequence` 编排，并通过案例内 `getAiComparisonThumbnailRect` 读取通用缩略图位置计算。此预览展示输入、对照及收拢；放大回位可另看已有完整范例。

## 使用方式

以下入口放在仓库根目录，其他位置按目录调整导入路径：

```tsx
import {Composition,registerRoot} from 'remotion';
import {WritingComparisonExample} from './examples/component-examples/writing-comparison/Example';

registerRoot(()=><Composition
  id="WritingComparison" component={WritingComparisonExample}
  width={1280} height={720} fps={30} durationInFrames={210}
  defaultProps={{
    ownText:'先提出具体问题。\n再给出一个例子。\n最后归纳结论。',
    aiText:'先展示案例。\n再解释其中的原理。\n最后回到问题。',
    copy:{leftColumn:'方案 A',rightColumn:'方案 B',leftTitle:'问题出发',rightTitle:'案例出发'},
  }}
/>);
```

需要关闭校验、淡化或收拢，或者改变输入时间时，直接使用通用 `TypewriterComparison` 的 `left/right/check/dim/compact` 配置，见 [组件说明](../../../packages/animations/README.md)。原案例通过参数保留已确认效果，不另写一套动作。

入口：[index.tsx](./index.tsx)。预览默认正文：[example.json](./example.json)。原文案与组合：[WritingComparison.tsx](../../reference-opening/compositions/WritingComparison.tsx)。独立组件：[TypewriterComparison.tsx](../../../packages/animations/src/reference-opening/TypewriterComparison.tsx)。

## 预览维护

从仓库根目录运行 `node examples/component-examples/writing-comparison/render.mjs`，生成完整 MP4、封面和说明。改动案例内容后重新导出；机器检查通过不代表完成视觉验收。

素材站入口：文字特效 → 打字对照 → 查看完整范例 · 自己写与 AI 写。
