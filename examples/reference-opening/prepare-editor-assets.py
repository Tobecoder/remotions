"""Keep only replaceable inset footage; rebuild all outer layout and captions in TSX."""
from pathlib import Path
import subprocess
import cv2
import numpy as np

episode=Path(__file__).resolve().parent
source=episode.parents[1]/'.verification/reference-opening/frame-review/original.mp4'
out=episode/'public/editor-walkthrough';out.mkdir(exist_ok=True)
cap=cv2.VideoCapture(str(source));current=-1;cached=None
def frame(f):
 global current,cached
 if f==current:return cached
 if f!=current+1:cap.set(cv2.CAP_PROP_POS_FRAMES,f)
 ok,a=cap.read();assert ok,f
 current=f;cached=a;return a
def encode(temp,target):
 subprocess.run(['ffmpeg','-hide_banner','-loglevel','error','-y','-i',str(temp),'-an','-c:v','libx264','-preset','fast','-crf','18',str(target)],check=True)
 temp.unlink()
def green_boxes(a):
 mask=((a[:,:,1]>150)&(a[:,:,2]<130)&(a[:,:,0]<150)).astype('uint8')
 contours,_=cv2.findContours(mask,cv2.RETR_EXTERNAL,cv2.CHAIN_APPROX_SIMPLE)
 return sorted([cv2.boundingRect(c) for c in contours if cv2.contourArea(c)>2000],key=lambda b:b[0])

cv2.imwrite(str(out/'previous-stage.jpg'),frame(7332)[328:934,718:1808],[cv2.IMWRITE_JPEG_QUALITY,96])
for name,start,opaque in [('green-motion',6918,6930),('transparent-motion',7077,7093)]:
 temp=out/f'{name}.avi';writer=cv2.VideoWriter(str(temp),cv2.VideoWriter_fourcc(*'MJPG'),30,(470,350))
 for f in range(start,8046):
  a=frame(max(f,opaque));boxes=green_boxes(a);assert len(boxes)>=2,(name,f,boxes)
  if name=='green-motion':x,y,w,h=boxes[1]
  else:
   x,y,w,h=boxes[0]
   x+=2*(boxes[1][0]-x)
  crop=a[y:y+h,x:x+w];assert crop.size
  writer.write(cv2.resize(crop,(470,350),interpolation=cv2.INTER_CUBIC))
 writer.release();encode(temp,out/f'{name}.mp4')

# Only the software window. The first opaque frame avoids double-baking its fade.
temp=out/'editor-screen.avi';writer=cv2.VideoWriter(str(temp),cv2.VideoWriter_fourcc(*'MJPG'),30,(1184,558))
for f in range(7333,8046):
 writer.write(frame(max(f,7341))[290:848,660:1844])
writer.release();encode(temp,out/'editor-screen.mp4');cap.release()
print('Extracted three isolated videos and one outgoing inset image.')
