"""Prepare only small observed document textures and two character poses.

No full reference frame is used by the runtime. Paper keying is a static asset
preparation step; movement and the rope are rendered from the Remotion frame.
"""
from collections import deque
from pathlib import Path
from PIL import Image
import numpy as np

root=Path(__file__).resolve().parents[2]
source=root/'.verification/second-point-study'
out=Path(__file__).parent/'public/textures'
documents=Image.open(source/'part-a-32.png').convert('RGB')
for i,box in enumerate([(210,182,432,318),(456,183,675,315),(701,184,908,318),(381,347,535,458),(605,348,730,460)]):
    documents.crop(box).save(out/f'document-{i}.jpg',quality=94)

def pose(name,file,box):
    image=Image.open(source/file).convert('RGB').crop(box)
    pixels=np.asarray(image).astype(int)
    candidate=(pixels.min(axis=2)>140)&((pixels.max(axis=2)-pixels.min(axis=2))<45)
    height,width=candidate.shape
    background=np.zeros((height,width),bool)
    queue=deque()
    for x in range(width):queue.extend([(0,x),(height-1,x)])
    for y in range(height):queue.extend([(y,0),(y,width-1)])
    while queue:
        y,x=queue.popleft()
        if y<0 or x<0 or y>=height or x>=width or background[y,x] or not candidate[y,x]:continue
        background[y,x]=True
        queue.extend([(y-1,x),(y+1,x),(y,x-1),(y,x+1)])
    rgba=np.concatenate([pixels.astype('uint8'),np.where(background,0,255).astype('uint8')[:,:,None]],axis=2)
    Image.fromarray(rgba).save(out/f'{name}.png')

pose('runner','part-a-18.png',(464,282,612,429))
pose('runner-caught','part-a-20.png',(607,308,729,429))
print('Prepared five document crops and two replaceable character poses')
