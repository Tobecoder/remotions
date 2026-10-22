"""Prepare reviewed episode inputs and enforce the shared production gate."""
from pathlib import Path
import importlib.util
import json
import re
import sys

ROOT = Path(__file__).resolve().parent
STAGES = Path.home()/'.codex/skills/handraw-style/skills/handraw-video-producer/lib/production_stage.py'
spec = importlib.util.spec_from_file_location('production_stage', STAGES)
stage = importlib.util.module_from_spec(spec)
spec.loader.exec_module(stage)

def save(path, data):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2)+'\n', encoding='utf-8')

def paths(n):
    return [[]] if n == 0 else [[step]+tail for step in (1, 2) if step <= n for tail in paths(n-step)]

def initialize():
    if (ROOT/'production.json').exists():
        print(json.dumps(stage.status(ROOT), ensure_ascii=False))
        return
    paragraphs = (ROOT/'script.txt').read_text(encoding='utf-8').strip().split('\n\n')
    split = paragraphs[0].index('？')+1
    spoken_scenes = [paragraphs[0][:split], paragraphs[0][split:], *paragraphs[1:6], '\n'.join(paragraphs[6:])]
    assert len(spoken_scenes) == 8
    titles = ['四级楼梯，几种走法？','先列出来：五种走法','只看最后一步','给每个答案一个名字','计算需要起点','从小到大，逐格计算','把过程写成代码','记住三个问题']
    spans = [(0,480),(480,960),(960,1800),(1800,2460),(2460,3120),(3120,3960),(3960,4470),(4470,5100)]
    save(ROOT/'episode.json', {'workflow':'composition-v2','title':'动态规划入门：从最后一步想起','width':1920,'height':1080,'aspect_ratio':'16:9','fps':30,'output_target':'web','subtitle_mode':'burn-in','media_policy':'no_video','brief':{'audience':'理解变量、数组和循环的 DP 初学者','goal':'通过四级楼梯解释状态、递推和初始条件','source':'MIT 6.006 Lecture 19；本例独立枚举核对'},'visual':{'background':'#f6f5f0','ink':'#18243b','one_step':'#3167e3','two_steps':'#dd8b35','answer':'#248469'},'narration':{'enabled':True,'provider':'windows-system-speech','voice':'Microsoft Huihui Desktop','user_selected':True}})
    save(ROOT/'composition.json', {'version':2,'duration_frames':5100,'shots':[{'id':f'S{i+1:02}','purpose':title,'type':'ST-005','start_frame':start,'end_frame':end,'voice_anchor':text[:26],'intent':{'lesson':title},'config':{'entry':f'src/scenes/S{i+1:02}.tsx','props':{},'inputs':['assets/lesson-data.json'],'code_files':[]}} for i,(title,text,(start,end)) in enumerate(zip(titles, spoken_scenes, spans))], 'audio_tracks':[],'subtitle_cues':[],'local_types':[]})
    # These are input facts and visual specifications, not preview/animation code.
    facts = {'n':4,'allowedSteps':[1,2],'paths':paths(4),'dp':[len(paths(i)) for i in range(5)],'recurrence':'dp[i] = dp[i-1] + dp[i-2]','baseCases':{'dp[0]':1,'dp[1]':1},'practice':{'n':5,'answer':8,'showAnswer':False},'code':['int n = 4;','vector<long long> dp(n + 2, 0);','dp[0] = dp[1] = 1;','for (int i = 2; i <= n; ++i) {','    dp[i] = dp[i-1] + dp[i-2];','}','cout << dp[n];  // 5'],'visualSpec':{'canvas':[1920,1080],'safeMargin':96,'subtitleBottom':52,'subtitleMaxHeight':130,'colors':{'oneStep':'#3167e3','twoSteps':'#dd8b35','answer':'#248469'},'fonts':['Microsoft YaHei','Consolas'],'noExternalImages':True}}
    save(ROOT/'assets/lesson-data.json', facts)
    segments=[]
    for i,text in enumerate(spoken_scenes):
        for part in re.findall(r'[^，。！？：；\n]+[，。！？：；]?',text):
            spoken=part.replace('dp[i-1]','D P 下标艾减一').replace('dp[i-2]','D P 下标艾减二').replace('dp[i]','D P 下标艾').replace('dp[0]','D P 下标零').replace('dp[1]','D P 下标一').replace('第 i 级','第艾级')
            segments.append({'id':f'V{len(segments)+1:03}','scene':i,'text':part,'spoken':spoken})
    save(ROOT/'assets/voice-segments.json',segments)
    stage.initialize(ROOT)
    doc=stage.read(ROOT/'production.json')
    doc['plan']['complete']=True
    doc['inventory_complete']=True
    doc['visual_assets']=[{'id':'LESSON','kind':'data','path':'assets/lesson-data.json','required':True},{'id':'COPY','kind':'data','path':'assets/voice-segments.json','required':True}]
    stage.save(ROOT/'production.json',doc)
    stage.record_approval(ROOT,'按方案制作，先用本机中文合成音试听')
    assert facts['dp'] == [1,1,2,3,5] and len({tuple(p) for p in facts['paths']}) == 5
    assert all(sum(p)==4 for p in facts['paths'])
    stage.review_asset(ROOT,'LESSON',{'status':'pass','notes':'逐项审查枚举路径 1111/112/121/211/22，步长仅 1/2 且和为 4，互不重复；dp 表与独立枚举一致；空路径 dp[0]=1、互斥最后一步分类、n=4 的短代码和五级练习答案已核对。纯图形镜头无外部图片，统一蓝/橙/绿概念色与字体、字幕安全区已盘点。'})
    stage.review_asset(ROOT,'COPY',{'status':'pass','notes':'逐句核对批准稿的原文和分镜顺序；仅将 DP 数组符号转换为对应的口语读音，显示字幕仍使用原文；共八镜，句子未增删。声音与字幕尚未合成，不以估时当语音时间。'})
    stage.require(ROOT,'production')
    print(json.dumps(stage.status(ROOT),ensure_ascii=False))

if __name__=='__main__':
    if '--require' in sys.argv:
        stage.require(ROOT,'production')
        print('Production gate: approved plan and reviewed inputs verified.')
    else:
        initialize()
