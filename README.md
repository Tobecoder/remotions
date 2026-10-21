# Remotions ✦

面向 Remotion 的开源动效素材库。当前开放音频动画分类，包含三种由真实音频数据驱动的组件：**示波曲线、镜像频谱、语音波形**；字幕、背景、视觉效果和版式转场分类已预留。原有 11 个通用动效已从公开组件入口和网站移除，历史实现保存在 [`archive/v0.1-legacy`](archive/v0.1-legacy/README.md)。

## 本地运行

需要 Node.js 20+ 和 npm 10+。

```bash
npm ci
npm run dev
```

打开终端显示的本地地址（默认 `http://localhost:3000`）。网页按分类展示组件；悬浮音频卡片会在卡片内部播放静音画面，直接查看音频驱动的波形和频谱。

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

`Oscilloscope`、`MirroredSpectrum`、`VoiceNote` 都接受 `src`、`color`、`width`、`height`。组件只根据当前帧与解码后的音频计算画面；声音播放由宿主 Composition 的 `<Audio>` 控制。当前分析路径使用 `useWindowedAudioData()`，因此 `src` 应为 WAV 文件（本地 `staticFile()`、对象 URL 或允许跨域读取的远程 WAV）；MP3、AAC 等格式请先转换为 WAV。长音频通过窗口化读取，而不是把整段原始音频一直放在内存中。

## 工程结构

- `packages/animations/`：三个可复用的音频动画组件，构建 ESM、CJS 和类型声明。
- `apps/catalog/`：中文素材库、卡片内 Remotion 动效预览、原创 WAV 示例音频。
- `scripts/generate-demo-audio.mjs`：可重复生成示例音频；不依赖第三方音效素材。
- `examples/AudioComposition.tsx`：在 Remotion Composition 中引用音频动画的示例。
- `archive/v0.1-legacy/`：以前的通用动效与历史验证文档，不参与当前构建。

运行 `npm run check` 可执行组件与示例音频测试、类型检查和生产构建。当前工作区尚未发布到 npm，也未配置网站部署。更多结果见 [验证记录](docs/VERIFICATION.md)。

## 来源与许可

音频处理使用 Remotion 官方的 [`@remotion/media-utils`](https://www.remotion.dev/docs/audio/visualization) API；三个视觉组件为本仓库独立实现。项目采用 MIT 许可，详见 [LICENSE](LICENSE)。
