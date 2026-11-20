# 原片开头到 4:04.433 · Remotion 分段预览

[打开 Studio](http://localhost:3004/01-Opening-Principle)。每段从自己的第 0 秒开始。每段至少 20 秒，超过 20 秒后在完整的讲解或章节节点结束；相邻短镜头合并，保留原有画面和节奏，不用停帧或重复画面凑时长。

| 分段 | 对应原片区间 | 时长 | 结束节点 |
| --- | --- | --- | --- |
| [01 片头与第一条原则](http://localhost:3004/01-Opening-Principle) | 0:00–0:25 | 25 秒 | 第一条原则收束 |
| [02 第二条原则与素材准备](http://localhost:3004/02-Principles-Preparation) | 0:25–0:58 | 33 秒 | 准备完成，进入脚本章节 |
| [03 脚本章节](http://localhost:3004/03-Script-Chapter) | 0:58–1:36 | 38 秒 | 脚本与画面说明完成 |
| [04 素材备注](http://localhost:3004/04-Material-Notes) | 1:36–2:09 | 33 秒 | 第一问收束、转入第二问 |
| [05 分段文档、踩坑与原则要求](http://localhost:3004/05-Planning-Pitfalls) | 2:09–2:39.5 | 30.5 秒 | 原则要求收成第二条摘要 |
| [06 是否逐段规划与章节结尾](http://localhost:3004/06-Planning-Conclusion) | 2:39.5–3:00 | 20.5 秒 | 结束控制效果的提问，提示后面的制作章节 |
| [07 素材收集与技术可行性](http://localhost:3004/07-Material-Collection) | 3:00–3:23 | 23 秒 | MCP / Computer Use 接入，技术可行结论 |
| [08 素材整理边界与旧视频玩偶](http://127.0.0.1:3004/08-Material-Quality) | 3:23–3:43.533 | 20.533 秒 | “这些是老演员了”完整结束 |
| [09 常用素材与透明底动画](http://127.0.0.1:3004/09-Green-Screen) | 3:43.533–4:04.433 | 20.9 秒 | Agent 处理的透明底演示结束，下一方法进入前 |

单段导出示例：

```powershell
node examples/reference-opening/render.mjs --segment 09-Green-Screen --video-only
```

用 `--segments` 批量导出以上九段，输出到 `.verification/reference-opening/segments/`。默认逐段对照首帧、中间帧、末帧与累计时间线对应帧；加 `--stills` 只核对图片，加 `--video-only` 只导出视频。此前 11 个短段的切点已合并，Studio 不再逐条显示；历史导出文件保留。累计时间线为 `render-root.tsx` 的 `Reference-Green-Screen`；`--material-collection --video-only` 仍导出 203 秒版本，其他较短整片入口保留。当前严格逐像素对照仍有字体边缘渲染差异，详见验证记录。

新增镜头见[原则性的要求](SCRIPT-PRINCIPLES-SHOTPLAN.md)、[是否逐段规划与章节结尾](SCRIPT-CLOSING-SHOTPLAN.md)和[素材收集与技术可行性](MATERIAL-COLLECTION-SHOTPLAN.md)。

第 08 段见[素材整理的边界与旧视频玩偶](MATERIAL-QUALITY-SHOTPLAN.md)，[逐帧对照](http://127.0.0.1:3006/continuation-review/)支持每次 1 帧及慢放。原片与当前导出帧保存在 `.verification/reference-opening/continuation-review/`，新组件的完整范例见 `examples/component-examples/usage-meter/`。预览仍待用户确认。

第 09 段见[常用素材与透明底动画三步流程](GREEN-SCREEN-SHOTPLAN.md)，[逐帧对照](http://127.0.0.1:3006/green-screen-review/)支持每次 1 帧及慢放；[三步流程完整范例](../component-examples/three-step-flow/README.md) 可替换三张内容卡、步骤、解释与角落摘要，原片和范例共用实现。预览仍待用户确认。

第 07 段的[原片逐帧对照](http://localhost:3005/)支持前后 1 帧、10 帧与慢放；[当前 23 秒视频](http://localhost:3005/current.mp4)同步更新。对照文件位于 `.verification/reference-opening/frame-review/`，本地服务关闭后可从该目录重新启动静态服务。2026-11-19 已修正文件夹遮挡、人物姿态和字幕切点；仍待视觉确认，具体差异见分镜说明。

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

`render.mjs --segments` 会逐段核对首帧、中间帧、末帧，与当前整片的对应帧严格比较，并检查 MP4 的尺寸、时长、帧数与渲染日志。批量报告为 `.verification/reference-opening/segments/report.json`，单段报告为 `report-<分段ID>.json`。本次素材段对应 `report-07-Material-Collection.json`，此前六段导出及报告保留；`--material-collection --stills` 包含新段转场、文件夹、三窗口锁定与解锁的关键帧。旧整片入口仍使用各自原有检查点和报告。

截图检查和机械验证分别记录：它们不等于逐像素一致，也不代替你对还原效果的验收。面板内部的上期视频目前用截图序列表示，未获取其完整原视频或原工程；中间图层的内容为可替换的代码绘制示例。

片头两行标题到“制作方法”由 `ChapterHeading` 的 `intro` / `introProgress` 统一处理。按用户指定的字幕节点，“是怎么从脚本到成片的”在 1.9 秒出现时开始切换，2.6 秒完成；保持原来 0.7 秒的切换效果。与后续“制作方法 → Skill 推荐”的 `progress` 分开编排；共同复用同一个标题组件。

分层展开以素材库组件的默认效果为准。案例仅传入 `startAt={2.1}`、图片文案和画面位置，不再单独设置各层时间、旋转进度或透明度模式。底层在 2.5–3.3 秒完成透视，中间层从 3.9 秒起每隔 0.5 秒入场、每层 0.55 秒；这些值由组件的同一套默认时间线产生。顶部截图始终只有一张可见。

背景使用独立的 `BlurredCollage`：纸纹静止、虚化拼贴向左下漂移并在 3–4.25 秒淡出。目录卡片与案例只替换图片内容，使用相同的漂移、模糊与退场参数；见「背景特效 → 虚化拼贴漂移」。
