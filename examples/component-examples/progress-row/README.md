# 单条进度的完整范例：进度对比

对应动作：`ProgressRow`（单条进度）。本范例直接使用原案例的 `ProgressRace`，保留上下两行、快慢进度、完成徽章、等待转圈和计数的原有编排。新的完整范例入口待用户确认；构建及测试通过不代表视觉验收。

## 什么时候使用

适合两种方案、处理方式或任务节奏的对比。计数和进度为动画示意，不作为实际性能测试或业务数据结论。

优先选择此范例表达完整的快慢对照；需要单独一条进度、额外行或其他布局时，使用 `ProgressRow` 重新组合并验收。

## 替换内容

| 参数 | 内容 | 建议 |
| --- | --- | --- |
| `title` / `eyebrow` | 主标题、上方短句 | 主标题建议不超过 20 个汉字，上方保持短句 |
| `firstLabel` / `secondLabel` | 两行名称 | 建议每项不超过 4 个汉字或短英文名称 |
| `winnerLabel` / `slowLabel` | 完成、等待说明 | 保持短标签，建议不超过 8 个汉字 |
| `countTo` | 连续计数终值 | 使用非负有限数；说明其含义，勿默认当作实测值 |
| `phrases` | 下方短语 | 默认四条，建议每条不超过 6 个汉字 |

以上为原版布局的文案建议，不是自动排版保证；更长内容、更多标签或新比例需要重新检查画面。

## 保留的效果

- 维持 16:9、800×450 设计坐标的上下两行布局，外层按比例缩放。
- 先出现标题，再依次出现两条进度；上行快速完成，下行保留等待转圈并计数。
- 保留填充终点与转圈中心的对应关系，沿用徽章、转圈和计数的相对节奏。
- 原编排在 8.15 秒完成计数，本范例共 9 秒，末尾保持展示。增加时长可延长停留；改变内部动作速度需重新验收。

## 使用方式

以下示例放在仓库根目录的 Remotion 入口中；其他位置按文件目录调整相对导入路径。

```tsx
import {Composition,registerRoot} from 'remotion';
import {ProgressRowExample} from './examples/component-examples/progress-row/Example';

registerRoot(()=><Composition
  id="TaskComparison" component={ProgressRowExample}
  width={1280} height={720} fps={30} durationInFrames={270}
  defaultProps={{
    title:'两种处理方式的完成节奏',eyebrow:'任务对比',
    firstLabel:'方式 A',secondLabel:'方式 B',
    winnerLabel:'已完成',slowLabel:'仍在处理中',
    countTo:120,phrases:['等待','处理','校验','输出'],
  }}
/>);
```

入口：[index.tsx](./index.tsx)。默认文案、尺寸、时间与素材路径：[example.json](./example.json)。组合实现：[ProgressRace.tsx](../../reference-opening/compositions/ProgressRace.tsx)，基础动作：[ProgressRow.tsx](../../../packages/animations/src/reference-opening/ProgressRow.tsx)。

## 预览维护

从仓库根目录运行 `node examples/component-examples/progress-row/render.mjs`，生成素材站使用的 MP4、封面和说明。预览由同一份案例代码导出；修改组合或默认文案后应重新生成，再检查关联用法。

素材站入口：数据图表 → 单条进度 → 查看完整范例。只读预览不作为新的公开动作组件。
