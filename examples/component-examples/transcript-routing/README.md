# 文字三路入卡

本范例取自第 13 段的语音识别说明，与复现片共用 `SpeechRecognition`。识别节点接入后，从同一出口依次发出三条文字，分别向右上、正右和右下飞入对应的卡片。每条文字到达时，卡片的红叉切换为绿勾。

## 替换内容

`TranscriptRoutingExample` 的 `cards` 依上、中、下排列。每张卡的 `name` 控制名称，`color` 控制卡片左侧标记，`transcript` 控制飞入这张卡的文字。省略 `cards` 时沿用原镜头内容，省略某张卡的 `transcript` 时沿用对应的原文字。

```tsx
import {TranscriptRoutingExample} from './examples/component-examples/transcript-routing/Example';

const MyScene = () => <TranscriptRoutingExample cards={[
  {name:'预览', color:'#cb775f', transcript:'生成画面预览'},
  {name:'字幕', color:'#4c7bbb', transcript:'生成时间戳字幕'},
  {name:'归档', color:'#5d63c9', transcript:'保存识别结果'},
]}/>;
```

卡片名称和飞行文字都保持单行。卡名建议不超过 5 个汉字，飞行文字建议约 10 个汉字。改动布局时需重新核对出口和落点。

## 保留方向与节奏

默认输出 1280×720、30 FPS、120 帧（4 秒）。识别节点在第 8 帧开始进入。文字分别在第 68、74、80 帧从同一出口发出，目标卡分别在第 86、92、98 帧切换为绿勾。末尾留出约 0.7 秒展示三张卡全部接收成功。

[范例入口](./index.tsx) · [范例参数](./Example.tsx) · [原案例组合](../../reference-opening/compositions/SpeechRecognition.tsx)。在素材库的「版式转场 → 卡片入场」下可打开此范例。

可用 `node examples/component-examples/transcript-routing/render.mjs` 生成预览。单独打开 Studio 时，入口使用本目录的 `index.tsx`，`--public-dir` 指向 `examples/reference-opening/public`。范例待用户视觉确认。
