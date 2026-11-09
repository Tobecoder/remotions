# 已拆分组件的完整范例

按已拆分组件逐项补充，选择标准为完整效果是否方便复用。范例保留原组合实现、可替换内容说明、预览及代码入口；基础动作仍由组件包提供。AI 制片时先读相应范例说明，沿用完整效果，再替换内容。

| 动作 | 完整效果 | 说明与代码入口 | 新范例验收状态 |
| --- | --- | --- | --- |
| `ProgressRow` · 单条进度 | 进度对比 | [使用说明](./progress-row/README.md) · [入口](./progress-row/index.tsx) | 待用户确认 |
| `DocumentWindow` / `HighlightBox` / `CollapsingTitle` · 文档窗口、区域高亮、标题收拢 | 脚本文档讲解 | [使用说明](./script-document/README.md) · [入口](./script-document/index.tsx) | 待用户确认 |
| `CardSpotlight` · 卡片放大回位 | 卡片放大回位 | [使用说明](./card-spotlight/README.md) · [入口](./card-spotlight/index.tsx) | 待用户确认 |
| `CardEntrance` / `FocusLayer` · 卡片入场、前景聚焦 | 文档聚焦 | [使用说明](./document-focus/README.md) · [入口](./document-focus/index.tsx) | 待用户确认 |
| `ContentCollapse` / `BranchingPaths` · 内容收拢、多路径演示 | 小节收束 | [使用说明](./content-collapse/README.md) · [入口](./content-collapse/index.tsx) | 待用户确认 |
| `ContentCollapse` / `ChapterHeading` · 内容收拢、章节标题切换 | 章节缩略卡 | [使用说明](./scene-thumbnail/README.md) · [入口](./scene-thumbnail/index.tsx) | 待用户确认 |
| `CardEntrance` / `ContentCollapse` / `AgentPipeline` · 卡片入场、内容收拢、Agent 成片流程 | 素材准备卡 | [使用说明](./preparation-cards/README.md) · [入口](./preparation-cards/index.tsx) | 待用户确认 |
| `TypewriterComparison` · 打字对照 | 自己写与 AI 写 | [使用说明](./writing-comparison/README.md) · [入口](./writing-comparison/index.tsx) | 待用户确认 |

原七组已拆分组合及打字对照均已补齐独立入口、完整预览和替换说明，当前共八份；新范例的视觉验收状态仍以上表为准。

本站完整范例预览产物位于 `apps/catalog/public/examples/`，由对应案例的导出脚本生成。素材站仅引用范例元数据和预览文件，不另写案例动画，也不将固定组合重新导出为通用组件。

多个动作可共享同一份完整范例，例如文档窗口、区域高亮、标题收拢都关联到脚本文档讲解。各目录的 `render.mjs` 使用共享的 `render-example.mjs` 导出流程，保持尺寸、帧数及解码检查一致。
