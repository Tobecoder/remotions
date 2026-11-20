"""Rectify individual reference card contents, never a whole composed scene.

Input: .verification/reference-opening/frame-review/original.mp4, 1920x1080/30.
The source stays local; outputs are replaceable case-owned screenshot textures.
"""
from pathlib import Path
import cv2
import numpy as np

episode = Path(__file__).resolve().parent
source = episode.parents[1] / '.verification/reference-opening/frame-review/original.mp4'
out = episode / 'public/material-collection'
out.mkdir(exist_ok=True)
cap = cv2.VideoCapture(str(source))

def rectify(name, time, corners, size):
    cap.set(cv2.CAP_PROP_POS_FRAMES, round(time*30))
    ok, frame = cap.read()
    assert ok, (name, time)
    w, h = size
    target = np.float32([[0,0],[w-1,0],[w-1,h-1],[0,h-1]])
    image = cv2.warpPerspective(frame, cv2.getPerspectiveTransform(np.float32(corners), target), size)
    cv2.imwrite(str(out / f'{name}.jpg'), image, [cv2.IMWRITE_JPEG_QUALITY,96])

# Corners exclude the white card borders and shadows. No foreground mascot here.
rectify('chart', 182, [(150,215),(496,177),(516,374),(170,413)], (348,200))
rectify('history', 182, [(683,116),(1020,137),(1008,316),(671,296)], (348,188))
rectify('desk', 201.5, [(692,338),(1196,338),(1196,526),(692,526)], (504,188))
rectify('voice', 182, [(1450,662),(1782,628),(1802,830),(1469,864)], (348,200))
rectify('neurons', 182, [(1100,721),(1447,739),(1434,933),(1087,919)], (348,200))
# The laptop is partly behind the document. Its narrow covered corner is repaired
# below, so the document itself is never baked into a flying card.
rectify('workspace', 182, [(125,575),(476,611),(454,803),(106,773)], (348,200))
workspace = cv2.imread(str(out / 'workspace.jpg'))
mask = np.zeros(workspace.shape[:2], np.uint8)
cv2.fillPoly(mask, [np.int32([[275,0],[347,0],[347,124],[300,124]])],255)
workspace = cv2.inpaint(workspace, mask, 5, cv2.INPAINT_TELEA)
cv2.imwrite(str(out / 'workspace.jpg'), workspace, [cv2.IMWRITE_JPEG_QUALITY,96])
# Complete app-window content is rectified; title chrome is still rendered in code.
rectify('script', 184, [(348,402),(914,382),(925,701),(359,724)], (575,330))
rectify('editor-green', 184, [(933,334),(1477,359),(1462,661),(919,636)], (548,306))
rectify('editor-black', 185.4, [(953,312),(1525,339),(1510,653),(936,627)], (548,306))
# Web thumbnails and the real desk drawing used by the editor example.
rectify('web-gallery', 190, [(1228,173),(1749,173),(1749,427),(1228,427)], (522,254))
web = cv2.imread(str(out / 'web-gallery.jpg'))
for index, (x,y,w,h) in enumerate([(0,0,169,119),(178,0,165,119),(354,0,168,119),(0,136,169,118),(178,136,165,118),(354,136,168,118)]):
    cv2.imwrite(str(out / f'web-{index}.jpg'), web[y:y+h,x:x+w], [cv2.IMWRITE_JPEG_QUALITY,96])
rectify('computer-use', 201.5, [(1286,332),(1805,332),(1805,640),(1286,640)], (520,308))
# The tiny covered corner of the otherwise isolated chart contains only blue
# background. Remove the baked-in white window corner before code composites it.
chart = cv2.imread(str(out / 'chart.jpg'))
mask = np.zeros(chart.shape[:2], np.uint8)
mask[176:,240:] = 255
chart = cv2.inpaint(chart, mask, 4, cv2.INPAINT_TELEA)
cv2.imwrite(str(out / 'chart.jpg'), chart, [cv2.IMWRITE_JPEG_QUALITY,96])

# Separate artwork for the turn and tablet; code still owns position and time.
# Every ROI isolates the foreground mascot, excluding the folder and editor.
def isolate_pose(name, frame_number, bounds):
    cap.set(cv2.CAP_PROP_POS_FRAMES, frame_number)
    ok, frame = cap.read()
    assert ok, (name, frame_number)
    x0,y0,x1,y1=bounds
    sprite = frame[y0:y1,x0:x1]
    b,g,r = cv2.split(sprite.astype(np.int16))
    mask = np.uint8((b-r>14)&(b-g>18)&(b>100))*255
    _, labels, stats, _ = cv2.connectedComponentsWithStats(mask)
    component = 1+np.argmax(stats[1:,cv2.CC_STAT_AREA])
    mask = np.uint8(labels==component)*255
    mask = cv2.morphologyEx(mask,cv2.MORPH_CLOSE,np.ones((3,3),np.uint8))
    outside = cv2.copyMakeBorder(mask,1,1,1,1,cv2.BORDER_CONSTANT,value=0)
    cv2.floodFill(outside,None,(0,0),255)
    mask |= 255-outside[1:-1,1:-1]
    alpha=cv2.GaussianBlur(mask,(3,3),.45)
    sprite = cv2.cvtColor(sprite,cv2.COLOR_BGR2BGRA)
    sprite[:,:,3]=alpha
    x,y,w,h=cv2.boundingRect(mask)
    assert x>0 and y>0 and x+w<mask.shape[1] and y+h<mask.shape[0], (name,'clipped pose')
    cv2.imwrite(str(out / f'{name}.png'),sprite[max(0,y-2):y+h+2,max(0,x-2):x+w+2])

isolate_pose('agent',5616,(824,548,1084,778))
isolate_pose('agent-left',5635,(780,480,1100,810))
isolate_pose('agent-tablet',5748,(1170,530,1500,850))
cap.release()
