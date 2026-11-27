"""Prepare the inner tutorial preview. The surrounding scene remains editable."""
from pathlib import Path
import subprocess

episode = Path(__file__).resolve().parent
source = episode.parents[1] / '.verification/reference-opening/frame-review/original.mp4'
target = episode / 'public/srt-sync'
target.mkdir(exist_ok=True)
crop = 'crop=998:562:108:150'
common = ['ffmpeg', '-hide_banner', '-loglevel', 'error', '-y']
first, end = 10095, 10374
subprocess.run([
    *common, '-ss', f'{first / 30:.7f}', '-i', str(source), '-frames:v', str(end - first),
    '-vf', crop, '-an', '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-preset', 'fast', '-crf', '19',
    '-movflags', '+faststart', str(target / 'tutorial-preview.mp4'),
], check=True)
subprocess.run([
    *common, '-ss', f'{(end - 1) / 30:.7f}', '-i', str(source), '-frames:v', '1',
    '-vf', crop, '-update', '1', str(target / 'tutorial-last.png'),
], check=True)
