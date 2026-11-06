"""Retain two static document bodies; every motion and highlight is rendered in code."""
from pathlib import Path
from PIL import Image

root = Path(__file__).resolve().parents[2]
for index, frame in enumerate([0, 2]):
    image = Image.open(root / f'.verification/script-study/frame-{frame}.png')
    image.crop((489, 215, 916, 449)).convert('RGB').save(Path(__file__).parent / f'public/textures/script-body-{index}.jpg', quality=95)
