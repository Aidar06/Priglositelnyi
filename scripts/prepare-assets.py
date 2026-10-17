from pathlib import Path
from PIL import Image
import subprocess,sys
root=Path(__file__).resolve().parent.parent
sys.path.insert(0,str(root/'.tools/python'))
import imageio_ffmpeg
ffmpeg=imageio_ffmpeg.get_ffmpeg_exe()
for name in ['closed-box','ring-held','ring-worn','forever']:
    image=Image.open(root/'dist/assets'/f'{name}.png').convert('RGB')
    image.thumbnail((1080,1920))
    image.save(root/'dist/assets'/f'{name}.webp',quality=88,method=6)
for name in ['opening','proposal','forever']:
    source=root/'production'/f'{name}.mp4'
    if not source.exists(): continue
    subprocess.run([ffmpeg,'-hide_banner','-loglevel','error','-i',str(source),'-an','-vf','scale=720:1280:force_original_aspect_ratio=decrease,pad=720:1280:(ow-iw)/2:(oh-ih)/2,fps=24','-c:v','libx264','-preset','fast','-crf','23','-g','6','-keyint_min','6','-sc_threshold','0','-pix_fmt','yuv420p','-movflags','+faststart','-y',str(root/'dist/assets'/f'{name}.mp4')],check=True)
    subprocess.run([ffmpeg,'-hide_banner','-loglevel','error','-i',str(source),'-vf','fps=0.8,scale=180:-1,tile=4x2','-frames:v','1','-update','1','-y',str(root/'production'/f'{name}-contact.png')],check=True)
for name in ['proposal','forever']:
    source=root/'dist/assets'/f'{name}.mp4'
    target=root/'dist/assets'/f'{name}-reverse.mp4'
    subprocess.run([ffmpeg,'-hide_banner','-loglevel','error','-i',str(source),'-an','-vf','reverse','-c:v','libx264','-preset','fast','-crf','23','-g','6','-keyint_min','6','-sc_threshold','0','-pix_fmt','yuv420p','-movflags','+faststart','-y',str(target)],check=True)
print('Optimized posters, short-GOP videos and contact sheets ready.')
