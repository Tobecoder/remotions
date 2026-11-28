# 三路波形撞击与回摆

本范例取自第 13 段，复现片与范例共用 `SpeechRecognition` 组合。三张卡先入场，三路波形依次从左向右撞击各自卡片，随后弹开。每张卡先向右移，再左右回摆归位，各自的红叉紧随碰撞出现。

## 替换内容

`ImpactRecoilExample` 接收 `cards`，按上、中、下的顺序提供三张卡的 `name` 和 `color`。省略时使用原案例内容。名称建议保持一行，给右侧状态图标留出空间。

```tsx
import {ImpactRecoilExample} from './examples/component-examples/impact-recoil/Example';

const MyScene = () => <ImpactRecoilExample cards={[
  {name:'工具 A', color:'#cb775f'},
  {name:'工具 B', color:'#4c7bbb'},
  {name:'工具 C', color:'#5d63c9'},
]}/>;
```

## 保留节奏

输出 1280×720、30 FPS、120 帧。三个波形在本范例第 90、95、99 帧到达卡片。每张卡从自己的碰撞帧开始回摆，13 帧后回到原位置。红叉依次进入，结尾保留三张卡归位的画面。需要替换编排时，让波形到达、位移首帧和状态切换仍按这个先后关系触发。

## 单独使用动作

`ImpactRecoil` 接收相对撞击时刻的 `frame`，向子函数提供带正负号的回摆量。默认从 1 开始并在 13 帧后归零。`strength` 放大或反转回摆量，`durationInFrames` 改变时长，`samples` 可替换逐帧轨迹。

把回摆量用于水平坐标即可让卡片左右移动。把它用于旋转角度，并把 `transformOrigin` 放在底座，就可以复用第 12 段的话筒回摆。第 12 段第 8979 帧开始旋转，第 8993 帧回正。

[独立动作源码](../../../packages/animations/src/reference-opening/ImpactRecoil.tsx) · [范例入口](./index.tsx) · [范例参数](./Example.tsx) · [原案例组合](../../reference-opening/compositions/SpeechRecognition.tsx)。

生成预览用 `node examples/component-examples/impact-recoil/render.mjs`。单独打开 Studio 时，入口使用本目录的 `index.tsx`，`--public-dir` 指向 `examples/reference-opening/public`。新范例待用户视觉确认。
