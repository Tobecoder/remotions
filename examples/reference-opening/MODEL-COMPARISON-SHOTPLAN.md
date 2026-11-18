# 模型对照镜头

逐点重看[原片](https://www.douyin.com/video/7703213715362158075)。约 134.3 秒文档已缩到接近左侧终点，134.7 秒右侧播放上期成片，135.5 秒起补出第一个名称。约 137 秒，蛋落在 Codex 头顶停留，到 139 秒后继续向左飞，锅另起轨迹。140 秒左右切到“踩过的坑”。本段止于 139.5 秒。

| 工程时间 | 画面 |
| --- | --- |
| 134.06–134.46 秒 | 复用 `ContentCollapse` 把同一张文档从居中位置缩到左侧，保留高亮和顶部摘要。 |
| 134.63–134.83 秒 | 黑框在成片位置显现，开始播放短片，橙色点线随即连起两端。 |
| 135.58、136.67、137.60 秒 | Claude、Codex、DeepSeek 名称依次显现。 |
| 134.63–139.5 秒 | 三只玩偶在高低台面上。锅先冒热气，鸡蛋抛到 Codex 头上并停留，末尾鸡蛋向左方碗里飞，锅随后单独甩出。 |

文档收缩和窗口入场调用已有动作组件。案例通过 `ModelComparisonPanel` 的内容插槽播放独立 MP4，可替换为同规格的演示素材。作者在原片 3:46–4:34 演示了绿幕生图、视频模型生成和去绿幕的角色素材流程。本项目使用新生成的透明底立体玩偶图，由 `ModelComparisonClip` 逐帧合成动画，角色姿态与轨迹按观测重建。

玩偶图源为 `public/model-comparison/toys.png`。运行 `node examples/reference-opening/render.mjs --model-clip` 可重新生成 `public/model-comparison/demo.mp4`（960×540、30 fps、5 秒），再用 `--model-comparison` 渲染主片。主片预览从 134 秒接入该段，供人工核对。

<details>
<summary>立体玩偶生图提示词</summary>

使用内置图像生成，输出透明背景。

> Create one production sprite sheet of three separate full body 3D miniature vinyl / resin toy character cutouts for a Chinese technology tutorial video. Horizontal wide 3:1 composition with three equal columns and the characters centered at 1/6, 1/2, 5/6, on a genuinely transparent alpha canvas. No touching or overlapping between columns, generous empty space between them, each has head and feet visible. Consistent fixed camera, near frontal, slightly looking down so softly sculpted shading and depth are visible. The toys will be animated separately and shown 45 pixels high, so silhouettes must read extremely well. LEFT: chibi dark navy and cobalt blue anime maid figurine, very dark wavy long blue hair, little pale face with big lively dark eyes, white ruffled lace frill on top of her head, blue dress, tiny white apron, hands cupped together holding a very small off-white shallow bowl at waist height, small blue shoes. Face slightly toward center. CENTER: a rounded fluffy indigo cloud mascot with a smooth 3D plush vinyl surface, 4 distinct softly merged rounded blue lobes, soft periwinkle light at upper left and deep vibrant cobalt blue underneath, short round arms and two very short feet, off-white raised sculpted terminal prompt symbols >_ across middle of body, no eyes and no mouth. Arms down and open relaxed. RIGHT: small friendly warm orange pixel-shaped mascot with a box-like orange body with soft bevels and visible volume, tiny square short legs, two small black vertical dot eyes, arms reaching out slightly, tall puffed round white chef toque, with round folds and a wide fabric hatband, soft subtle pale violet ambient shadows under folds. Chef faces slightly left. No frying pan, no eggs, no labels, no podiums, no backdrop, no lettering except the center mascot's white terminal symbols, no borders, no baked floor or shadow on canvas. Smooth dimensional forms, well lit toy product render with large softbox and slight warm bounced light. Keep all three independently extractable. Make all three the same overall visual height.

</details>
