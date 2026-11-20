"""Extract replaceable inset contents; outer layout, captions and motion stay in TSX."""
from pathlib import Path
import subprocess
import cv2
import numpy as np

episode=Path(__file__).resolve().parent
root=episode.parents[1]
source=root/'.verification/reference-opening/frame-review/original.mp4'
out=episode/'public/green-screen'
out.mkdir(exist_ok=True)
cap=cv2.VideoCapture(str(source))
current=-1
cached=None
def frame(f):
 global current,cached
 if f==current:return cached
 if f!=current+1:cap.set(cv2.CAP_PROP_POS_FRAMES,f)
 ok,a=cap.read();assert ok,f
 current=f;cached=a
 return a
row=frame(6750)
for i,x in enumerate([158,489,820,1151,1482]):
 cv2.imwrite(str(out/f'stock-{i}.jpg'),row[466:742,x:x+278],[cv2.IMWRITE_JPEG_QUALITY,96])
first=frame(6900)[385:735,92:562]
cv2.imwrite(str(out/'green-still.jpg'),first,[cv2.IMWRITE_JPEG_QUALITY,96])

def green_boxes(a):
 mask=((a[:,:,1]>150)&(a[:,:,2]<130)&(a[:,:,0]<150)).astype('uint8')
 contours,_=cv2.findContours(mask,cv2.RETR_EXTERNAL,cv2.CHAIN_APPROX_SIMPLE)
 return sorted([cv2.boundingRect(c) for c in contours if cv2.contourArea(c)>2000],key=lambda b:b[0])

for name,start,opaque in [('green-motion',6918,6930),('transparent-motion',7077,7093)]:
 temp=out/f'{name}.avi'
 writer=cv2.VideoWriter(str(temp),cv2.VideoWriter_fourcc(*'MJPG'),30,(470,350))
 for f in range(start,7333):
  a=frame(max(f,opaque));boxes=green_boxes(a);assert boxes,(name,f)
  if name=='green-motion':
   assert len(boxes)>=2,(f,boxes)
   x,y,w,h=boxes[1]
  else:
   x,y,w,h=boxes[0]
   x=round(x+1268*w/470)
  crop=a[y:y+h,x:x+w];assert crop.size,(name,f)
  writer.write(cv2.resize(crop,(470,350),interpolation=cv2.INTER_CUBIC))
 writer.release()
 subprocess.run(['ffmpeg','-hide_banner','-loglevel','error','-y','-i',str(temp),'-an','-c:v','libx264','-crf','18','-preset','fast',str(out/f'{name}.mp4')],check=True)
 temp.unlink()
# The large demonstration is isolated from all captions/labels. The first opaque
# inset frame avoids baking the source's outer fade into its replaceable content.
temp=out/'agent-alpha.avi'
writer=cv2.VideoWriter(str(temp),cv2.VideoWriter_fourcc(*'MJPG'),30,(1090,606))
for f in range(7260,7333):
 a=frame(max(f,7270));writer.write(a[328:934,718:1808])
writer.release()
subprocess.run(['ffmpeg','-hide_banner','-loglevel','error','-y','-i',str(temp),'-an','-c:v','libx264','-crf','18','-preset','fast',str(out/'agent-alpha.mp4')],check=True)
temp.unlink()
cap.release()
# Continue the five old inset videos only through the crossfade, without changing old assets.
for name,rect in [('main-late',(134,345,732,398)),('archive-0',(940,330,430,242)),('archive-1',(1390,330,430,242)),('archive-2',(940,592,430,242)),('archive-3',(1390,592,430,242))]:
 x,y,w,h=rect
 subprocess.run(['ffmpeg','-hide_banner','-loglevel','error','-y','-ss','221.1','-i',str(source),'-t',str(81/30),'-an','-vf',f'crop={w}:{h}:{x}:{y}','-c:v','libx264','-crf','18','-preset','fast',str(out/f'{name}.mp4')],check=True)
print('Extracted 6 images and 8 isolated clips; no full scene frames used.')
