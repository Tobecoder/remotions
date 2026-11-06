"""Extract only four static illustrations from the observed reference frame.

Card geometry, text, Agent and motion are implemented as reusable components.
"""
from pathlib import Path
from PIL import Image

root = Path(__file__).resolve().parents[2]
frame = Image.open(root / '.verification/preparation-study/frame-2.png')
destination = Path(__file__).parent / 'public/textures'
boxes = [(242,263,349,369),(423,266,524,369),(600,266,696,369),(775,267,877,369)]
for index, box in enumerate(boxes):
    frame.crop(box).convert('RGB').save(destination / f'preparation-{index}.jpg', quality=95)
