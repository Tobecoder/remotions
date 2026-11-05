"""Extract static panel textures from already observed browser screenshots.

Not used at runtime: committed public assets make the example self-contained.
"""
from pathlib import Path
from PIL import Image
import numpy as np

ROOT = Path(__file__).resolve().parents[2]
SOURCE = ROOT / '.verification/reference-window'
OUT = Path(__file__).parent / 'public/textures'
OUT.mkdir(parents=True, exist_ok=True)

def extract(name, source, points, size=(720, 405)):
    # Pillow maps destination pixels back to the four observed source corners.
    destination = [(0, 0), (size[0], 0), (size[0], size[1]), (0, size[1])]
    rows, values = [], []
    for (x, y), (u, v) in zip(destination, points):
        rows += [[x,y,1,0,0,0,-u*x,-u*y], [0,0,0,x,y,1,-v*x,-v*y]]
        values += [u,v]
    coefficients = np.linalg.solve(np.asarray(rows, float), np.asarray(values, float))
    image = Image.open(SOURCE / source).convert('RGB')
    image.transform(size, Image.Transform.PERSPECTIVE, coefficients,
                    Image.Resampling.BICUBIC).save(OUT / (name + '.jpg'), quality=94)

for i in range(3):
    extract('screen-' + str(i), f'opening-{i}.png', [(505,178),(859,178),(859,369),(505,369)])
plane = [(596,135),(778,229),(686,278),(504,187)]
for i in range(3,9):
    extract('screen-' + str(i), f'opening-{i}.png', plane)
extract('script', 'opening-3.png', [(596,312),(778,405),(687,456),(504,363)])
cards = [
    [(441,253),(498,233),(523,305),(465,322)],
    [(510,227),(562,212),(582,289),(528,303)],
    [(584,207),(639,211),(634,285),(580,282)],
    [(657,214),(708,231),(685,302),(640,284)],
    [(728,236),(806,260),(781,330),(706,304)],
]
for i, quad in enumerate(cards):
    extract('skill-' + str(i), 'opening-9.png', quad, (200, 250))
rng = np.random.default_rng(37)
noise = rng.normal(0, 1.6, (450,800,1))
paper = np.clip(np.array([245,246,239])[None,None,:] + noise, 0, 255).astype('uint8')
Image.fromarray(paper).save(OUT / 'paper.jpg', quality=93)
print('Prepared reference textures:', len(list(OUT.iterdir())))
