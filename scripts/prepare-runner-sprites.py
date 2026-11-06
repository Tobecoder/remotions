"""Package the generated 4x4 atlas and encode animation previews, preserving its RGBA pixels.

Usage: python scripts/prepare-runner-sprites.py <generated-png>
The Remotion component reads the atlas directly; GIFs are only previews.
"""
import argparse
import hashlib
import json
import math
import shutil
from pathlib import Path

from PIL import Image

parser = argparse.ArgumentParser()
parser.add_argument('source', type=Path)
args = parser.parse_args()
root = Path(__file__).resolve().parents[1]
out = root / 'assets/characters/runner-v2'
out.mkdir(parents=True, exist_ok=True)
image = Image.open(args.source).convert('RGBA')
assert image.width == image.height, 'Expected a square 4x4 sprite atlas'
assert image.getchannel('A').getextrema()[0] == 0, 'Atlas must have real transparency'
size = math.ceil(image.width / 4)
frames = []
for i in range(16):
    col, row = i % 4, i // 4
    cell = image.crop((round(col * image.width / 4), round(row * image.height / 4), round((col + 1) * image.width / 4), round((row + 1) * image.height / 4)))
    frame = Image.new('RGBA', (size, size))
    frame.alpha_composite(cell, ((size - cell.width) // 2, (size - cell.height) // 2))
    frames.append(frame)
assert len({hashlib.sha256(frame.tobytes()).hexdigest() for frame in frames}) == 16, 'All animation frames must be distinct'
for index, frame in enumerate(frames):
    assert frame.getchannel('A').getbbox(), f'Empty sprite cell {index}'
shutil.copyfile(args.source, out / 'generated-source.png')
atlas = Image.new('RGBA', (size * 4, size * 4))
for i, frame in enumerate(frames):
    atlas.alpha_composite(frame, ((i % 4) * size, (i // 4) * size))
atlas.save(out / 'sprite-sheet.png')
for destination in [root / 'apps/catalog/public/characters/runner-v2.png', root / 'examples/reference-opening/public/characters/runner-v2.png']:
    destination.parent.mkdir(parents=True, exist_ok=True)
    shutil.copyfile(out / 'sprite-sheet.png', destination)

# GIF cannot retain soft alpha. Composite previews on the video's ivory paper;
# the runtime atlas above keeps the original transparency unchanged.
previews = []
for frame in frames:
    paper = Image.new('RGBA', frame.size, '#f5f6ef')
    paper.alpha_composite(frame)
    previews.append(paper.convert('RGB').resize((320, 320), Image.Resampling.LANCZOS))
palette_source = Image.new('RGB', (1280, 1280), '#f5f6ef')
for index, frame in enumerate(previews):
    palette_source.paste(frame, ((index % 4) * 320, (index // 4) * 320))
palette = palette_source.quantize(colors=256)
previews = [frame.quantize(palette=palette, dither=Image.Dither.NONE) for frame in previews]
previews[0].save(out / 'runner-run.gif', save_all=True, append_images=previews[1:8], duration=80, loop=0, disposal=2)
previews[8].save(out / 'runner-brace.gif', save_all=True, append_images=previews[9:], duration=[60] * 7 + [1400], loop=0, disposal=2)
(out / 'metadata.json').write_text(json.dumps({
    'atlasSize': atlas.size, 'columns': 4, 'rows': 4, 'frameCount': 16,
    'runFrames': [0, 7], 'runFps': 12, 'braceFrames': [8, 15], 'braceFps': 18,
    'sha256': hashlib.sha256((out / 'sprite-sheet.png').read_bytes()).hexdigest(),
    'alphaPreserved': True, 'gifBackground': '#f5f6ef',
}, ensure_ascii=False, indent=2), encoding='utf-8')
print(json.dumps({'output': str(out), 'size': image.size, 'frames': len(frames)}, ensure_ascii=False))
