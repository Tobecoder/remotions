# 原片开头到 2:33 · Remotion 分段预览

[打开 Studio](http://localhost:3004/01-Opening)。每段在自己的时间轴上从第 0 秒开始，原片区间用来定位对应画面。分段沿用相同的成片实现和切点。

| 分段 | 对应原片区间 | 时长 |
| --- | --- | --- |
| [01 片头与分层](http://localhost:3004/01-Opening) | 0:00–0:10 | 10 秒 |
| [02 章节总览](http://localhost:3004/02-Chapter-Overview) | 0:10–0:20 | 10 秒 |
| [03 第一条原则](http://localhost:3004/03-First-Point) | 0:20–0:25 | 5 秒 |
| [04 第二条原则](http://localhost:3004/04-Second-Point) | 0:25–0:52.5 | 27.5 秒 |
| [05 素材准备](http://localhost:3004/05-Preparation) | 0:52.5–0:58 | 5.5 秒 |
| [06 脚本章节](http://localhost:3004/06-Script) | 0:58–1:36 | 38 秒 |
| [07 素材备注](http://localhost:3004/07-Material-Notes) | 1:36–2:09 | 33 秒 |
| [08 分段规划文档](http://localhost:3004/08-Planning-Cards) | 2:09–2:14 | 5 秒 |
| [09 模型对照](http://localhost:3004/09-Model-Comparison) | 2:14–2:19.5 | 5.5 秒 |
| [10 提示词被略过](http://localhost:3004/10-Skipped-Prompts) | 2:19.5–2:33 | 13.5 秒 |

单段导出示例：

```powershell
node examples/reference-opening/render.mjs --segment 10-Skipped-Prompts
```

用 `--segments` 批量导出十段，输出到 `.verification/reference-opening/segments/`。默认同时对照每段首帧、中间帧、末帧与原时间线。加 `--stills` 只核对图片，加 `--video-only` 只导出视频。需要整片时，可用原有 `--script-pitfalls --video-only` 导出 153 秒版本。

右侧的[玩偶短片](http://localhost:3004/Model-Comparison-Clip) 单独放在 Studio 的 Media 文件夹，仍可用 `--model-clip` 更新源文件。成片镜头说明见[片头](SHOTPLAN.md)、[章节总览](CONTINUATION-SHOTPLAN.md)、[素材准备](PREPARATION-SHOTPLAN.md)、[脚本章节](SCRIPT-SHOTPLAN.md)、[素材备注](SCRIPT-NOTES-SHOTPLAN.md)、[分段规划文档](SCRIPT-PLANNING-SHOTPLAN.md)、[模型对照](MODEL-COMPARISON-SHOTPLAN.md)和[提示词被略过](SCRIPT-PITFALLS-SHOTPLAN.md)。

可复用组件位于 `packages/animations/src/reference-opening/`，发布目录与本场景共用独立动作，案例编排位于本工程的 `compositions/`。

`ExplodedLayers` 的 `layers` 数组配置每层内容、标签、进入时间；`screen` 可传入任意 React 内容。`PerspectivePanel` 的姿态、`ContentCollapse` 的收拢位置与比例，以及 `FanCardDeck` 的图片、文案、角度和间距均可替换。动画不依赖进入时间或播放历史，逐帧与随机跳帧一致。

静态贴图取自本次已观察的参考截图，限于显示器内部、文档、卡片图像。运行不需要原视频、截图目录或网络。`prepare-assets.py` 记录贴图提取坐标；无需在使用时执行。

## 案例组合的归属

- [脚本文档讲解](./compositions/ScriptDocumentGuide.tsx) 编排章节标题、文档滚动、高亮和说明收拢，使用库中的 `ChapterHeading/DocumentWindow/HighlightBox/CollapsingTitle`。保留原有停顿与切换时刻，`copy` 可替换案例文案；[完整范例](../component-examples/script-document/README.md) 提供可替换正文、独立入口及共享预览。
- [进度对比](./compositions/ProgressRace.tsx) 编排两条 `ProgressRow` 的快慢、转圈和计数。`eyebrow/countTo/phrases` 为案例配置；[完整范例](../component-examples/progress-row/README.md) 提供独立入口、替换说明和同源预览。
- [卡片强调镜头](./compositions/SpotlightSequence.tsx) 计算放大、停留和缩回进度，调用 `CardSpotlight`，并在组件外绘制提示标签。保留原有成片节奏及标签位置；[完整范例](../component-examples/card-spotlight/README.md) 提供同源放大/归位预览及同步内容替换说明。
- [文档聚焦镜头](./compositions/DocumentFocusGallery.tsx) 安排五张文档的布局、逐张入场、说明出现及聚焦时刻，调用 `CardEntrance/FocusLayer`；引文与提示标签由案例提供。[完整范例](../component-examples/document-focus/README.md) 提供同源预览、可替换文档与前景内容，以及原五卡布局的使用边界。
- [小节收束](./compositions/SectionCollapse.tsx) 使用 `ContentCollapse` 收拢内容，并安排编号、摘要条及显隐。保持缩放终点 `0.06`，第一点在 23.65–24.4 秒收至 `(49,47)`，第二点在 50.3–51 秒收至 `(208,47)`；条目尺寸、文案和淡出进度属于案例配置。[完整范例](../component-examples/content-collapse/README.md) 保留第一点原收束动作，提供完整场景替换、编号摘要及归档停留的独立预览。
- [章节缩略卡](./compositions/SceneThumbnail.tsx) 使用 `ContentCollapse` 缩小原场景，并绘制底板、编号和说明。保留原三张卡的目标位置、比例和章节衔接；原 `target/card/caption/number` 配置仅用于本案例组合。[完整范例](../component-examples/scene-thumbnail/README.md) 保留首个缩略卡的落点、标题同步切换和下一节卡组展开，提供前后插图与文案替换说明。
- [素材准备卡](./compositions/PreparationCards.tsx) 用 `CardEntrance` 处理单卡浮入、透明度和 `0.92→1` 缩放，用 `ContentCollapse` 汇聚缩小。四卡排布、错峰入场、旋转归正、停留及 Agent 接力时间由案例安排：相对 0.15 秒起逐张入场，3.35–3.95 秒收至 `(251,168)`，3.65 秒起淡出。[完整范例](../component-examples/preparation-cards/README.md) 保留 51.6–58 秒的完整准备与 Agent 输出节奏，可替换卡片、插图、文案及输出画面。

- [写作对照](./compositions/WritingComparison.tsx) 将“主要自己写、AI 辅助校验”、点评及两侧文案保存在案例配置，调用通用 `TypewriterComparison` 完成先后输入、校验提示、淡化和收拢。`ScriptScene` 保留 73.7 秒起的原时序；后续放大从同一缩略图位置开始，神经元画面继续使用 `time-79.1` 时钟。[完整范例](../component-examples/writing-comparison/README.md) 提供同源的 7 秒对照与收拢预览、可替换正文和短文案。案例内 `getAiComparisonThumbnailRect` 使用通用位置计算，不另写卡片布局。

这些编排由 `OpeningScene`、`ScriptScene`、`ContinuationScene`、`SecondPointScene`、`PreparationScene` 在本工程内导入，不属于素材目录及组件包公开 API。移到其他视频时可参考其代码，也可直接使用独立动作重新编排。

## 验证边界

`render.mjs` 生成包含转场的 18 个截图检查点（含一次倒序跳帧重渲染），检查输出尺寸、非空画面及逐帧确定性；导出后使用 ffprobe 读取全部 300 帧并确认 10 秒。报告保存在 `.verification/reference-opening/report.json`。

截图检查和机械验证分别记录：它们不等于逐像素一致，也不代替你对还原效果的验收。面板内部的上期视频目前用截图序列表示，未获取其完整原视频或原工程；中间图层的内容为可替换的代码绘制示例。

片头两行标题到“制作方法”由 `ChapterHeading` 的 `intro` / `introProgress` 统一处理。按用户指定的字幕节点，“是怎么从脚本到成片的”在 1.9 秒出现时开始切换，2.6 秒完成；保持原来 0.7 秒的切换效果。与后续“制作方法 → Skill 推荐”的 `progress` 分开编排；共同复用同一个标题组件。

分层展开以素材库组件的默认效果为准。案例仅传入 `startAt={2.1}`、图片文案和画面位置，不再单独设置各层时间、旋转进度或透明度模式。底层在 2.5–3.3 秒完成透视，中间层从 3.9 秒起每隔 0.5 秒入场、每层 0.55 秒；这些值由组件的同一套默认时间线产生。顶部截图始终只有一张可见。

背景使用独立的 `BlurredCollage`：纸纹静止、虚化拼贴向左下漂移并在 3–4.25 秒淡出。目录卡片与案例只替换图片内容，使用相同的漂移、模糊与退场参数；见「背景特效 → 虚化拼贴漂移」。
