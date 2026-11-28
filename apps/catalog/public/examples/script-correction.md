# 脚本扫过与三处错词校正

本范例使用第 14 段的 `WhisperPrompt`。提示词卡缩到左上，右侧三张错词卡先后出现。红字和波浪线逐个放大，脚本纸页扫过后，三处错词依次压扁并翻成绿字。

## 替换内容

`correctionCopy` 接收从上到下的三张卡。每条包含 `time`（显示的时间戳）、`before` 和 `after`（词语前后文）、`error` 和 `correct`（替换前后的词语）。省略 `correctionCopy` 即使用复现片文案。

```tsx
import {ScriptCorrectionExample} from './examples/component-examples/script-correction/Example';

const MyScene = () => <ScriptCorrectionExample correctionCopy={[
  {time:'00:00:02,100', before:'用 ', error:'瑞莫申', correct:'Remotion', after:' 做示例'},
  {time:'00:00:05,200', before:'选择', error:'宽屏比列', correct:'宽屏比例', after:'导出'},
  {time:'00:00:08,300', before:'根据', error:'实践戳', correct:'时间戳', after:'安排字幕'},
]}/>;
```

每张卡按一行短句排版，建议整句控制在 16 个汉字左右。换入明显更长的词时，需核对卡片宽度和第一处绿字从纸页后露出的时刻。

范例为 1280×720、30 FPS、252 帧（8.4 秒）。三处红字从第 75、90、121 帧起分别放大，纸页从第 161 帧开始扫动。绿字在第 182、191、201 帧依次出现。

## 单独使用文字翻转

`TextFlip` 可嵌在一行文字内，用 `before` 和 `after` 提供前后内容。传 `frame={当前帧 - 替换帧}`，第 0 帧切换内容。默认从相对第 −3 帧收窄，替换后于第 2 帧完全展开。给相对帧数乘比例即可调整快慢。用 `beforeStyle`、`afterStyle` 设置颜色与下划线，用 `beforeScale` 控制替换前的放大幅度。

[独立动效](../../../packages/animations/src/reference-opening/TextFlip.tsx) · [范例入口](./index.tsx) · [原案例组合](../../reference-opening/compositions/WhisperPrompt.tsx)。

用 `node examples/component-examples/script-correction/render.mjs` 生成范例视频和海报。素材库入口在「文字特效 → 文字翻转替换」。新范例待用户视觉确认。
