"""Extract only replaceable card contents and inset clips, never the composed frame."""
from pathlib import Path
import subprocess
import cv2

episode=Path(__file__).resolve().parent
source=episode.parents[1]/'.verification/reference-opening/frame-review/original.mp4'
out=episode/'public/material-quality'
out.mkdir(exist_ok=True)
cap=cv2.VideoCapture(str(source))
def crop(name,time,rect):
    cap.set(cv2.CAP_PROP_POS_FRAMES,round(time*30))
    ok,frame=cap.read();assert ok
    x,y,w,h=rect
    image=frame[y:y+h,x:x+w]
    assert image.size
    cv2.imwrite(str(out/f'{name}.jpg'),image,[cv2.IMWRITE_JPEG_QUALITY,96])

for name,rect in [('outline',(996,350,224,124)),('chart',(1250,350,230,124)),('map',(1510,350,224,124)),('clock',(1770,350,150,124)),('coffee',(996,515,224,124))]:
    crop(name,211.9,rect)
clock=cv2.imread(str(out/'clock.jpg'))
clock=cv2.copyMakeBorder(clock,0,0,0,74,cv2.BORDER_REPLICATE)
cv2.imwrite(str(out/'clock.jpg'),clock,[cv2.IMWRITE_JPEG_QUALITY,96])
crop('workbuddy',211,(1254,518,220,120))
crop('city-map',212.3,(1510,518,220,120))
crop('portrait',212,(1770,518,150,120))
portrait=cv2.imread(str(out/'portrait.jpg'))
mask=cv2.cvtColor(portrait,cv2.COLOR_BGR2GRAY)*0
mask[62:,114:]=255
portrait=cv2.inpaint(portrait,mask,3,cv2.INPAINT_TELEA)
portrait=cv2.copyMakeBorder(portrait,0,0,0,74,cv2.BORDER_REPLICATE)
cv2.imwrite(str(out/'portrait.jpg'),portrait,[cv2.IMWRITE_JPEG_QUALITY,96])
crop('rejected-blur',205.8,(764,290,632,370))
crop('rejected-ui',206.4,(764,290,632,370))
crop('rejected-cover',206.9,(764,290,632,370))
rects=[(940,330,430,242),(1390,330,430,242),(940,592,430,242),(1390,592,430,242)]
for i,(x,y,w,h) in enumerate(rects):
    crop(f'archive-{i}',221.1,(x,y,w,h))
    subprocess.run(['ffmpeg','-hide_banner','-loglevel','error','-y','-ss','221.1','-i',str(source),'-t',str(73/30),'-an','-vf',f'crop={w}:{h}:{x}:{y}','-c:v','libx264','-preset','veryfast','-crf','19',str(out/f'archive-{i}.mp4')],check=True)
cap.release()
for name,start,duration,rect in [('main-early',134.5,84/30,(1077,315,736,400)),('main-late',221.1,73/30,(134,345,732,398))]:
    x,y,w,h=rect
    subprocess.run(['ffmpeg','-hide_banner','-loglevel','error','-y','-ss',str(start),'-i',str(source),'-t',str(duration),'-an','-vf',f'crop={w}:{h}:{x}:{y}','-c:v','libx264','-preset','veryfast','-crf','18',str(out/f'{name}.mp4')],check=True)
