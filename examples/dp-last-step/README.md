# DP：最后一步 · 20 秒样片

用真实三维台阶、三颗金色棋子与两颗蓝色棋子，演示到第 4 级时最后一步的两类来源：第 3 级走 1 级，第 2 级走 2 级，合并为 5 种走法。第 2、3 级的计数在本片中作为已知条件；这段并非完整 DP 课程。

```sh
npm ci
npm run preview:dp20
```

打开 http://localhost:3002/DP-Last-Step-20s，点击播放。1920×1080，30 FPS，600 帧；保留原有三分钟示例和组件库。

配音为 Windows Microsoft Huihui Desktop，原速，不调用付费服务。仓库内已有实际 WAV、字幕与词语时间，预览不需要再次合成。可在 Windows 运行 `synthesize.ps1`、再运行 `assemble-voice.py` 重建声音；`prepare.py` 的制作流程检查依赖本机对应 skill，普通预览不依赖该检查器。

`npm run verify:dp20` 实际渲染首、中、末与起跳/落地关键帧，核对声音文件、字幕边界、到达数量、结果出现时间，以及重复跳转的像素一致性。截图和报告存放于忽略目录 `.verification/dp-last-step/`。需要本机 Remotion Chromium 和 WebGL；可用 `REMOTION_BROWSER_EXECUTABLE` 指定浏览器。

镜头、几何、光照、材质和运动由本工程独立实现。参考作品仅观察质感、动作与讲解方式，地址记录于 `plan.md`，未导入外部视频或付费素材。当前交付为可编辑预览，尚未导出 MP4；风格及教学效果由用户审看。
