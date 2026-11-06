# 原片开头到 1:36 · Remotion 复原候选

最新入口为 http://localhost:3004/Reference-Script-96s ，96 秒、2880 帧。58 秒前直接复用既有成片，续段见 [脚本章节拆解](SCRIPT-SHOTPLAN.md)。新增「版式转场 → 脚本文档标注、卡片放大回位」「文字特效 → 打字对照」「数据图表 → 进度对比」，共二十二项。停止在“还是重点聊两个大家比较关心的问题”，不进入后面的两个问题。

导出：`node examples/reference-opening/render.mjs --script --video-only`，文件 `.verification/reference-opening/reference-script-96s.mp4`、报告 `report-script.json`。新段落只增加两张静态文档正文，共 53,257 字节；正文标注、打字、卡片放大回位、神经元和计数、进度快慢全部由代码实现。模型对比复原原片观点，仅是动画示意，不是独立实测。

此前入口 http://localhost:3004/Reference-Preparation 为 58 秒、1740 帧，素材准备阶段结束；原有五个 Composition 均保留。此前动作见 [素材准备拆解](PREPARATION-SHOTPLAN.md)。

导出：`node examples/reference-opening/render.mjs --preparation --video-only`，文件 `.verification/reference-opening/reference-preparation.mp4`、报告 `report-preparation.json`。案例仅新增四张小图标贴图，共 21,247 字节；卡片、Agent、连接和窗口均为代码动画，目录演示用原创 SVG 图标。毛绒小熊已由新生成的 16 帧图集替代早期两张参考角色图。

入口 `index.tsx`，1920×1080、30 FPS，无声。保留 `Reference-Opening-10s`（300 帧），新增 `Reference-Opening-20s`（600 帧）。前十秒动作与时间点见 [SHOTPLAN.md](./SHOTPLAN.md)，后续见 [11–20 秒拆解](./CONTINUATION-SHOTPLAN.md)。

第一点已补到收束：`Reference-First-Point`（25 秒、750 帧），在第二点之前结束，后续工作暂停。结尾动作见 [第一点结尾拆解](./FIRST-POINT-SHOTPLAN.md)。

按后续指示继续补完第二点：新增 `Reference-Before-Work`（52.5 秒、1575 帧），停在“开工之前 / 我会先准备这些素材”标题页，不展开后续素材卡。参考动作见 [第二点拆解](./SECOND-POINT-SHOTPLAN.md)。原有三种时长继续保留。

```powershell
npx remotion studio examples/reference-opening/index.tsx --public-dir=examples/reference-opening/public --port=3004
node examples/reference-opening/render.mjs
```

只导出视频、跳过关键帧截图：`node examples/reference-opening/render.mjs --video-only`。

导出完整二十秒：`node examples/reference-opening/render.mjs --20s --video-only`；视频为 `.verification/reference-opening/reference-opening-20s.mp4`，独立报告为 `report-20s.json`，不会覆盖十秒视频。

导出第一点完整版本：`node examples/reference-opening/render.mjs --first-point --video-only`；视频为 `.verification/reference-opening/reference-first-point.mp4`，报告为 `report-first-point.json`。

导出之前的第二点版本：`node examples/reference-opening/render.mjs --before-work --video-only`；视频为 `.verification/reference-opening/reference-before-work.mp4`，报告为 `report-before-work.json`。

输出 `.verification/reference-opening/reference-opening-10s.mp4` 及关键帧。先生成截图可加 `--stills`，快速四帧检查可再加 `--quick`。

可复用组件位于 `packages/animations/src/reference-opening/`，包入口当前公开导出二十五个组件及类型。目录独立演示与本场景复用同一套独立动作；当前视频的固定组合编排位于本工程的 `compositions/`。

预览服务启动后打开 http://localhost:3004/Reference-Opening-10s 。

连续二十秒预览为 http://localhost:3004/Reference-Opening-20s 。续段新增「信息叠加 → 音效脉冲徽章」「叙事动画 → 章节卡总览」「叙事动画 → 多路径演示」三项素材。目录卡片用原创配图；案例使用观察截图中的 11 张小卡静态贴图（约 25 KB），没有使用整屏视频代替代码动画。

第一点完整预览为 http://localhost:3004/Reference-First-Point 。补全路线光点到达结果、“启发 · 灵感”标签，最后使用新增「版式转场 → 小节收束」组件归档为顶部条目，停留到 25 秒。

第二点的独立预览为 http://localhost:3004/Reference-Before-Work 。第二点新增六项组件；早期使用的两张角色静态图现已更换为原创毛绒小熊的 16 帧图集，位移、绳索和序列帧均由代码控制。五张文档小图仍由 `prepare-second-point-assets.py` 提取，运行时不依赖原片页面。

`ExplodedLayers` 的 `layers` 数组配置每层内容、标签、进入时间；`screen` 可传入任意 React 内容。`PerspectivePanel` 的姿态可替换，`SceneThumbnail` 的目标位置与比例可配置，`FanCardDeck` 的图片、文案、角度和间距可替换。动画不依赖进入时间或播放历史，逐帧与随机跳帧一致。

静态贴图取自本次已观察的参考截图，限于显示器内部、文档、卡片图像。运行不需要原视频、截图目录或网络。`prepare-assets.py` 记录贴图提取坐标；无需在使用时执行。

## 案例组合的归属

- [脚本文档讲解](./compositions/ScriptDocumentGuide.tsx) 编排章节标题、文档滚动、高亮和说明收拢，使用库中的 `ChapterHeading/DocumentWindow/HighlightBox/CollapsingTitle`。保留原有停顿与切换时刻，`copy` 可替换案例文案。
- [进度对比](./compositions/ProgressRace.tsx) 编排两条 `ProgressRow` 的快慢、转圈和计数。`eyebrow/countTo/phrases` 为案例配置。
- [卡片强调镜头](./compositions/SpotlightSequence.tsx) 计算放大、停留和缩回进度，调用 `CardSpotlight`，并在组件外绘制提示标签。保留原有成片节奏及标签位置。
- [文档聚焦镜头](./compositions/DocumentFocusGallery.tsx) 安排五张文档的布局、逐张入场、说明出现及聚焦时刻，调用 `CardEntrance/FocusLayer`；引文与提示标签由案例提供。

这些编排由 `ScriptScene` 在本工程内导入，不属于素材目录及组件包公开 API。移到其他视频时可参考其代码，也可直接使用独立动作重新编排。

## 验证边界

`render.mjs` 生成包含转场的 18 个截图检查点（含一次倒序跳帧重渲染），检查输出尺寸、非空画面及逐帧确定性；导出后使用 ffprobe 读取全部 300 帧并确认 10 秒。报告保存在 `.verification/reference-opening/report.json`。

截图检查和机械验证分别记录：它们不等于逐像素一致，也不代替你对还原效果的验收。面板内部的上期视频目前用截图序列表示，未获取其完整原视频或原工程；中间图层的内容为可替换的代码绘制示例。

片头两行标题到“制作方法”由 `ChapterHeading` 的 `intro` / `introProgress` 统一处理。按用户指定的字幕节点，“是怎么从脚本到成片的”在 1.9 秒出现时开始切换，2.6 秒完成；保持原来 0.7 秒的切换效果。与后续“制作方法 → Skill 推荐”的 `progress` 分开编排；共同复用同一个标题组件。

分层展开以素材库组件的默认效果为准。案例仅传入 `startAt={2.1}`、图片文案和画面位置，不再单独设置各层时间、旋转进度或透明度模式。底层在 2.5–3.3 秒完成透视，中间层从 3.9 秒起每隔 0.5 秒入场、每层 0.55 秒；这些值由组件的同一套默认时间线产生。顶部截图始终只有一张可见。

背景使用独立的 `BlurredCollage`：纸纹静止、虚化拼贴向左下漂移并在 3–4.25 秒淡出。目录卡片与案例只替换图片内容，使用相同的漂移、模糊与退场参数；见「背景特效 → 虚化拼贴漂移」。
