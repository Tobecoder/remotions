# Remotions ✦

面向 Remotion 的开源动效素材库。当前开放音频动画、字幕动画、数据图表、背景特效、视觉效果、版式转场和信息叠加分类，包含二十九个可复用组件：**示波曲线、镜像频谱、语音波形、基础字幕、气泡字幕、移动气泡、弹出单词、逐字高亮、横向条形图、趋势折线图、数字计数器、占比饼图、纵向条形图、液态轮廓、流动波浪、折线流动、笔记网格、纸张纹理、旋转星芒、光环脉冲、粒子漂移、光泽扫过、画中画转场、滑动分屏、旋转卡片、产品卡组、地点下三分之一、姓名下三分之一、社交安全区**。原有 11 个通用动效已从公开组件入口和网站移除，历史实现保存在 [`archive/v0.1-legacy`](archive/v0.1-legacy/README.md)。

## 本地运行

需要 Node.js 20+ 和 npm 10+。

```bash
npm ci
npm run dev
```

打开终端显示的本地地址（默认 `http://localhost:3000`）。网页按分类展示组件；悬浮卡片会在卡片内部播放逐帧画面，直接查看音频可视化、字幕动画、数据图表、背景特效、视觉效果、版式转场和信息叠加。

## 在 Remotion 中使用

将音频放到宿主工程的 `public/` 目录，保持 `remotion`、`@remotion/media` 和 `@remotion/media-utils` 版本一致。此工作区使用 `4.0.536`。

```tsx
import {Audio} from '@remotion/media';
import {MirroredSpectrum} from '@remotions/animations';
import {staticFile} from 'remotion';

const src = staticFile('your-audio.wav');

export const Scene = () => <>
  <Audio src={src} />
  <MirroredSpectrum src={src} color="#8ee5d2" />
</>;
```

背景特效不需要音频输入，可以直接作为 Composition 的全屏背景：

```tsx
import {LiquidContours} from '@remotions/animations';

export const BackgroundScene = () => <LiquidContours width={1920} height={1080} />;
```

视觉效果同样不需要音频输入，可以叠加到标题、Logo 或转场画面：

```tsx
import {PulseRings} from '@remotions/animations';

export const IntroScene = () => <PulseRings color="#409eff" width={1920} height={1080} />;
```

数据图表接受可复用的 `ChartDatum[]`，每个组件都支持 `progress`，适合把数据展示固定到某一帧。横向/纵向条形图和趋势折线图会保留有限的负值并自动计算零基线；占比饼图将负值按零权重处理，使用实际正权重总和计算占比（即使总量小于 1 也不会被抬高），权重总和为零时显示无有效占比状态。只有数据项显式提供 `color` 时才会覆盖组件的主题色，数据项不会被静默截断；显式传入 `data={[]}` 会显示空状态。数据较多时会归一化交错动画、压缩行高或柱宽并对各类图表隔项显示标签，同时保留稀疏数据中的有效扇区标签，保持图形在画布内：

```tsx
import {LineChart} from '@remotions/animations';
import type {ChartDatum} from '@remotions/animations';

const data: ChartDatum[] = [
  {label: '一月', value: 34},
  {label: '二月', value: 48},
  {label: '三月', value: 71},
];

export const DataScene = () => <LineChart data={data} color="#409eff" />;
```

版式转场可以直接包裹自己的场景，也可以使用组件内置的演示面板：

```tsx
import {PictureInPictureTransition} from '@remotions/animations';

export const LayoutScene = () => (
  <PictureInPictureTransition width={1920} height={1080} insetPosition="bottom-right">
    <ProductScene />
  </PictureInPictureTransition>
);
```

`SlideToSplitScreen` 接受 `children` 和 `secondary` 两个场景，`RotatingCards` 保留本库自有的 `cards` 数组实现，`ProductCollection` 对齐 Remotion Elements 的源站旋转卡片；四个版式组件都支持 `durationInSeconds`、`speed` 和可选的 `progress` 控制。`PictureInPictureTransition` 的 `padding` 表示小窗最终距画布四边的像素边距；省略时保留源站默认的右上留白。`ProductCollection` 还支持 `fadeOut={false}`，适合停在目录预览的最后一帧。

信息叠加组件用于在画面上方添加可复用的辅助信息：

```tsx
import {LocationLowerThird, NameLowerThird, SocialSafeZones} from '@remotions/animations';

export const Scene = () => (
  <>
    <LocationLowerThird location="Shanghai, China" venue="Conference hall" color="#2563eb" />
    <NameLowerThird name="Alex Morgan" role="Creative Developer" color="#67c23a" />
    <SocialSafeZones platform="tiktok" color="#ffffff" />
  </>
);
```

`LocationLowerThird` 和 `NameLowerThird` 支持 `durationInSeconds`、`speed`、`progress` 以及自定义文案。默认 4 秒内完成进入、停留和退出，`progress={0.5}` 固定在完整展示状态；目录悬浮时正向循环，停止时展示中间帧。地点叠加默认只有定位针与单行地点；姓名叠加为蓝黑双色、无圆角的信息条。

`SocialSafeZones` 默认使用 1080×1920 竖屏比例，透明叠加独立重绘的 Instagram Reels 或 TikTok 界面，包括顶部导航、右侧操作栏与底部文案。`showSafeArea` 可额外显示避让参考区。该组件是静态构图辅助，非平台实测标定截图；平台界面变化后仍需实际检查。演示背景只出现在目录中，不包含在公开组件内。

`Oscilloscope`、`MirroredSpectrum`、`VoiceNote` 都接受 `src`、`color`、`width`、`height`。组件只根据当前帧与解码后的音频计算画面；声音播放由宿主 Composition 的 `<Audio>` 控制。`Oscilloscope` 和 `MirroredSpectrum` 使用 `useWindowedAudioData()`，`src` 可以使用 Mediabunny 支持的音频格式（例如 WAV、MP3、AAC）；实际可用格式取决于运行环境的解码器、资源加载和跨域配置，适合长音频的实时窗口分析。`VoiceNote` 是覆盖完整音频的静态波形，使用 `useAudioData()` 读取完整源文件；长音频会占用更多内存。

## 工程结构

- `packages/animations/`：二十九个可复用的音频动画、字幕动画、数据图表、背景特效、视觉效果、版式转场和信息叠加组件，构建 ESM、CJS 和类型声明。
- `apps/catalog/`：中文素材库、卡片内 Remotion 动效预览、原创 WAV 示例音频。
- `scripts/generate-demo-audio.mjs`：可重复生成示例音频；不依赖第三方音效素材。
- `examples/AudioComposition.tsx`：在 Remotion Composition 中引用音频动画的示例。
- `archive/v0.1-legacy/`：以前的通用动效与历史验证文档，不参与当前构建。

运行 `npm run check` 可执行组件与示例音频测试、类型检查和生产构建。组件库尚未发布到 npm；目录站点的部署状态以项目中的托管配置为准。更多结果见 [验证记录](docs/VERIFICATION.md)。

## 来源与许可

音频处理使用 Remotion 官方的 [`@remotion/media-utils`](https://www.remotion.dev/docs/audio/visualization) API；背景特效和视觉效果参考 [Remotion Elements](https://www.remotion.dev/elements) 的分类思路并由本仓库独立实现。项目采用 MIT 许可，详见 [LICENSE](LICENSE)。
