# 方法切换与操作步骤

本范例和原案例共用 `TutorialWalkthrough`，复用 `CardEntrance` 完成方法卡与演示窗口交接。上一种方法退为背景，新方法突出显示；同一个演示窗口一直播放，编号步骤在窗口下方按时间切换。属于案例组合，不新增公开动作组件。

## 替换内容

`TutorialWalkthroughExample` 可传 `previousMethod`、`activeMethod`（各含 `title/description`）、`steps`（按时间递增的 `{at,label}`）和 `content(time)`。`at` 是相对镜头起点的秒数，步骤出现前不显示编号，最后一步持续至结束。空步骤数组可以只展示方法交接及连续窗口。保持时间递增，标签用一行短句。

```tsx
import {TutorialWalkthroughExample} from './examples/component-examples/tutorial-walkthrough/Example';

const MyScene=()=> <TutorialWalkthroughExample
  previousMethod={{title:'自动处理',description:'使用工具快速得到结果'}}
  activeMethod={{title:'手动精修',description:'检查边缘并保留细节'}}
  steps={[{at:2.5,label:'选择要处理的区域'},{at:7,label:'调整参数'},{at:18,label:'检查并导出'}]}
  content={time=><YourRecording time={time}/>}
/>;
```

范例为 1280×720、30 FPS、720 帧、24 秒。默认操作窗口为程序示意，方便查看完整效果，不代表真实软件界面或已导出的 Alpha 素材。原案例独立引用实际录屏素材，外部方法卡和编号说明由共享组合绘制。

如直接使用 `TutorialWalkthrough`，传 `time`、`startAt`、`children` 和可选 `previousStage`。`startAt` 只平移整段时钟；动态内容的播放起点由调用方控制。不要在步骤切换时重新挂载视频，否则播放会重置。

## 保留的布局与节奏

使用 800×450 设计坐标。两张方法卡位于 `(46,148)` 和 `(46,215)`，各为 200×58；演示窗口位于 `(274,119.5)`，496×235.5，建议以约 2.1:1 的录屏内容替换。上一演示窗口可置于 `(299,137)`、454.2×252.5，交接时淡出。窗口下编号步骤从 `(274,368)` 开始。

前 8 帧内完成方法交接，先前卡片退至 45% 不透明度并移除强调边框，新方法卡从下方 6px 归位。步骤一至五默认分别在相对第 76、139、291、405、551 帧切换，保留原案例“先操作、再补充说明”的停顿。步骤切换直接更换文字，窗口的内容与时间线保持连续。不同画幅、新布局、长文案和重新配速应重新验收。

## 入口与维护

[入口](./index.tsx)、[替换内容](./Example.tsx)、[元数据](./example.json)、[同源组合](../../reference-opening/compositions/TutorialWalkthrough.tsx)。生成预览：`node examples/component-examples/tutorial-walkthrough/render.mjs`。输出完整视频、海报与同步说明到素材站，关联“卡片入场”。新范例待用户视觉确认，自动检查只证明调用、导出与解码正常。
