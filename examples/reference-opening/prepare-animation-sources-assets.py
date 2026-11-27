"""Extract inset animation contents only; outside copy/layout stays code-owned."""
from pathlib import Path
import cv2,subprocess
episode=Path(__file__).resolve().parent
source=episode.parents[1]/'.verification/reference-opening/frame-review/original.mp4'
out=episode/'public/animation-sources';out.mkdir(exist_ok=True)
cap=cv2.VideoCapture(str(source));current=-1;cached=None
def frame(f):
 global current,cached
 if f==current:return cached
 if f!=current+1:cap.set(cv2.CAP_PROP_POS_FRAMES,f)
 ok,a=cap.read();assert ok,f
 current=f;cached=a;return a
a=frame(8420);cv2.imwrite(str(out/'platform.jpg'),a[320:372,1097:1149],[cv2.IMWRITE_JPEG_QUALITY,96])
clips=[('comparison',8157,8252,8167,8240,(1010,488,640,350)),('gallery-0',8553,8733,8564,8732,(116,335,512,380)),('gallery-1',8575,8733,8587,8732,(704,335,512,380)),('gallery-2',8597,8733,8609,8732,(1292,335,512,380))]
for name,start,end,opaque,last,rect in clips:
 x,y,w,h=rect;temp=out/f'{name}.avi';writer=cv2.VideoWriter(str(temp),cv2.VideoWriter_fourcc(*'MJPG'),30,(w,h))
 for f in range(start,end):writer.write(frame(min(last,max(opaque,f)))[y:y+h,x:x+w])
 writer.release();subprocess.run(['ffmpeg','-hide_banner','-loglevel','error','-y','-i',str(temp),'-an','-c:v','libx264','-preset','fast','-crf','18',str(out/f'{name}.mp4')],check=True);temp.unlink()
cap.release();print('Prepared four isolated clips and one platform icon.')

# Hold only each existing inset's last decoded frame; layout and copy remain shared code.
for name in ['editor-screen','green-motion','transparent-motion']:
 inset=cv2.VideoCapture(str(episode/'public/editor-walkthrough'/f'{name}.mp4'))
 inset.set(cv2.CAP_PROP_POS_FRAMES,int(inset.get(cv2.CAP_PROP_FRAME_COUNT))-1)
 ok,last=inset.read();assert ok,name
 cv2.imwrite(str(out/f'{name}-last.png'),last);inset.release()
