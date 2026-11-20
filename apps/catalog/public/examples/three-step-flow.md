# 三步流程与角落摘要

完整镜头与原片案例共同调用 `ThreeStepFlow`，组合现有的 `CardEntrance`、`ContentCollapse`。三张卡依次入场、虚线连接、解释和结论出现，最后整排缩到左上角，并为下一段详细演示留出空间。属于案例组合，不增加公开动作组件。

## 适用与替换

适合三步制作流程、三个阶段的结果对照。`ThreeStepFlowExample` 提供 `labels`（三个一行短标签）、`artwork`（三个 React 内容）及 `copy`。`copy` 可局部替换 `eyebrow/title/question/explanation/badge/summary`。默认预览使用程序绘制的玩偶示意；原案例的实际图片和视频仅在原片工程调用，不随范例绑定。

设计坐标 800×450，三张卡固定为 202×152，位于 `(35/299/563,158)`，内容区域 196×146。替换内容建议保持约 4:3，图片使用 `objectFit:'cover'`，步骤标签保持 8–12 字以内，说明为一行短句。不同卡数、新布局、长文案或重新配速需要重新验收。

```tsx
import {ThreeStepFlowExample} from './examples/component-examples/three-step-flow/Example';

const MyScene=()=> <ThreeStepFlowExample
  labels={['准备图片','生成动态','输出结果']}
  artwork={[<YourImage/>,<YourMotion/>,<YourResult/>]}
  copy={{title:'从参考图到完整动画',summary:'下一步：检查输出'}}
/>;
```

将 `MyScene` 注册为 1280×720、30 FPS、480 帧的 Remotion 入口即可。自定义内容通过调用方时间驱动；若使用视频，在自己的内容中设置开始帧，避免在收拢时换一个新的视频实例。固定的三步布局、先后关系和相对节奏应保留。

## 保留的节奏

以范例时间零点为准：标题在前 11 帧淡入；步骤一从第 71 帧、步骤二从第 131 帧、步骤三从第 290 帧浮入，每张 11 帧，从下方 24px 快速浮起再减速归位。连线在下一张卡出现后显现。解释在第 195 帧开始出现，绿色结论在第 315 帧开始出现；结论展开时说明组向左让位，保持整体居中。

第 364–384 帧整排缩到左上角，终点 `translate(74px,-5px) scale(.36)`。卡片、标签、连线共用收拢变换；说明先淡出，顶部标题随后淡出，角落摘要在第 375–384 帧显现。卡内内容在收拢前后保持同一实例及时间线，末尾继续播放。

如直接使用案例组合，可传 `time`（秒）、`startAt`（秒）、`steps` 和 `copy`。`steps` 为恰好三个 `{id,label,content}`，`id` 保持唯一且稳定。调用方可平移整个镜头时间，不依赖播放历史，支持倒序跳帧。

## 入口与维护

- [完整范例入口](./index.tsx)、[内容替换入口](./Example.tsx)、[元数据](./example.json)。
- [同源组合实现](../../reference-opening/compositions/ThreeStepFlow.tsx)。
- 生成预览：`node examples/component-examples/three-step-flow/render.mjs`，输出完整视频、海报及同步说明到素材站。
- 新范例待用户视觉确认；自动检查证明入口、共享实现、导出和解码，不代表视觉验收。
