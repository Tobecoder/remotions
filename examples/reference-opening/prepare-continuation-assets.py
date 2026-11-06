"""Extract only small illustration contents from the observed 16.67-second screenshot.

No full-screen reference frame is used by the runtime. Run only after the named
source screenshot has been observed and saved; committed JPGs are self-contained.
"""
from pathlib import Path
from PIL import Image

root = Path(__file__).resolve().parents[2]
source = root / '.verification/continuation-study/play-15.png'
out = Path(__file__).parent / 'public/textures'
image = Image.open(source).convert('RGB')
# Screen coordinates inside the visible reference video, excluding player UI.
boxes = [
    (381,280,466,325), (367,327,449,369), (373,395,454,437),
    (386,443,467,462), (519,262,603,306), (520,344,601,393),
    (522,440,602,477), (658,281,739,322), (670,314,749,355),
    (674,367,752,399), (657,420,739,458),
]
for index, box in enumerate(boxes):
    image.crop(box).save(out / f'path-{index}.jpg', quality=94)
print(f'Prepared {len(boxes)} small path-card textures')
