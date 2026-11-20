# 用量与电量切换

用于解释计数增速与资源状态的变化。完整范例和原案例共用 `UsageComparison`，独立动作是 `UsageMeter`。

可替换标签、快阶段终值、最终数值及中间插图。范例的方块插图是中性替换示例；原片案例传入独立角色素材。通过 `UsageComparison.content` 替换中间内容，布局基于 800×450 舞台，`UsageMeter` 内部坐标为 340×200。

沿用左上计数、中间内容、右侧分格条的布局；先快速计数，再减速；红色五格向下退出，同时绿色单格从上方落下。各块错峰亮暗闪动，绿色单格也持续闪动。数值保持连续，绿色开始出现时红色仍在场。需要改变布局、方向或相对节奏时重新验收。

`UsageMeter` 自身不读取视频时钟或包含模型文案。调用方提供 `value`、`label`、`indicators` 和 `time={frame / fps}`；每根指示条可配置位置、尺寸、格数、填充比例、颜色及透明度。`blink={false}` 可关闭闪动；默认周期约 0.65 秒，各格错峰，不改变填充比例或整条透明度。`children` 可留空或提供任意插图。不要将这些示意数值解释为真实模型评测数据。

代码入口：`examples/component-examples/usage-meter/Example.tsx`；组合：`examples/reference-opening/compositions/UsageComparison.tsx`；动作：`packages/animations/src/reference-opening/UsageMeter.tsx`。

导出：`node examples/component-examples/usage-meter/render.mjs`。范例视觉状态：待用户确认。
