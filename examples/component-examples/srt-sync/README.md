# SRT 字幕与时间线同步

本范例取自第 13 段的教程预览镜头，与复现片共用 `SrtSyncExample`。左侧播放预览，右侧高亮相应的 SRT 行，下方的播放头和片段标记同步推进。

## 替换内容

传入 `playback`，同时提供无内嵌字幕的预览视频 `previewSrc`，以及按开始时间排序、互不重叠的 `cues`。每条字幕包含 `startMs`、`endMs` 和 `text`。时间以预览视频第 0 秒为起点，单位为毫秒。字幕区间含开始时刻，结束时刻起清空，播放头在字幕间隔内继续走。

```tsx
import {staticFile} from 'remotion';
import {SrtSyncFullExample} from './examples/component-examples/srt-sync/Example';

const MyScene = () => <SrtSyncFullExample playback={{
  previewSrc: staticFile('my-preview.mp4'),
  cues: [
    {startMs:140, endMs:2630, text:'先看完整画面。'},
    {startMs:2840, endMs:4210, text:'接着标出每句字幕的时间。'},
    {startMs:4310, endMs:5850, text:'字幕与时间线共用这些时间戳。'},
  ],
}}/>;
```

同一组 `cues` 生成画面字幕、右侧 SRT 时间戳与高亮、底部时间轴区间。建议每句简短，右侧 SRT 正文按单行显示。预览视频在范例第 34 帧启动，保持 30 FPS。更换长度时，把组合帧数设为 `34 + Math.ceil(预览时长秒数 * 30)`，并把字幕区间安排在视频时长内。范例静音播放，字幕区间由调用方提供。

## 保留布局与节奏

默认范例 1280×720、30 FPS、312 帧（10.4 秒），保留复现片的教程裁剪画面及原有字幕。右窗先进入，左侧随后出现，描边强调后再显示底部时间线。自带素材的字幕已经嵌在原预览里，因此保留案例校准的切换帧。替换视频时，范例从时间戳重新生成字幕，时间线随预览启动。

[范例入口](./index.tsx) · [范例参数](./Example.tsx) · [原案例组合](../../reference-opening/compositions/SrtSynchronization.tsx)。范例关联独立动作 `CardEntrance` 和 `HighlightBox`。

生成预览用 `node examples/component-examples/srt-sync/render.mjs`。单独打开 Studio 时，入口使用本目录的 `index.tsx`，`--public-dir` 指向 `examples/reference-opening/public`。新范例待用户视觉确认。
