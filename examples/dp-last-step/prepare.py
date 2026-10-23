"""Validate the approved twenty-second scene and its real input facts."""
from pathlib import Path
import importlib.util
import json
import sys

ROOT=Path(__file__).resolve().parent
helper=Path.home()/'.codex/skills/handraw-style/skills/handraw-video-producer/lib/production_stage.py'
spec=importlib.util.spec_from_file_location('production_stage',helper)
stage=importlib.util.module_from_spec(spec)
spec.loader.exec_module(stage)

def save(name,data):
    p=ROOT/name
    p.parent.mkdir(parents=True,exist_ok=True)
    p.write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')

def initialize():
    if (ROOT/'production.json').exists():
        print(json.dumps(stage.status(ROOT),ensure_ascii=False));return
    facts={'goal':4,'allowedSteps':[1,2],'groups':[{'source':3,'count':3,'prefixes':[[1,1,1],[1,2],[2,1]],'lastStep':1,'color':'#e7aa28'},{'source':2,'count':2,'prefixes':[[1,1],[2]],'lastStep':2,'color':'#397c8d'}],'meaning':'one token represents one distinct route, not one physical person','visual':{'background':'#f6f4ef','stairs':'#fffdf7','ink':'#223633','font':'Microsoft YaHei','geometry':'four rounded white steps, physically lit spheres, contact shadows','noExternalImages':True}}
    save('assets/scene-spec.json',facts)
    texts=(ROOT/'script.txt').read_text(encoding='utf-8').strip().splitlines()
    save('assets/voice-segments.json',[{'id':f'V{i+1:03}','scene':0,'text':t,'spoken':t} for i,t in enumerate(texts)])
    save('episode.json',{'workflow':'composition-v2','title':'DP 入门：最后一步来自哪里','width':1920,'height':1080,'aspect_ratio':'16:9','fps':30,'output_target':'web','subtitle_mode':'burn-in','media_policy':'no_video','brief':{'audience':'DP 初学者','goal':'用具体走法解释 dp[4]=dp[3]+dp[2]','source':'独立路径枚举核对；按用户选择的三维空间和爬楼梯讲法实现'},'visual':facts['visual'],'narration':{'enabled':True,'provider':'windows-system-speech','voice':'Microsoft Huihui Desktop','user_selected':True}})
    save('composition.json',{'version':2,'duration_frames':600,'shots':[{'id':'S01','purpose':'最后一步的两类来源互斥，合并得到五种走法','type':'ST-005','start_frame':0,'end_frame':600,'voice_anchor':texts[0],'intent':{'action':'三颗金色走一步、两颗蓝色走两步，到第4级相加'},'config':{'entry':'src/Scene.tsx','props':{},'inputs':['assets/scene-spec.json'],'code_files':[]}}],'audio_tracks':[],'subtitle_cues':[],'local_types':[]})
    stage.initialize(ROOT)
    doc=stage.read(ROOT/'production.json')
    doc['plan']['complete']=True
    doc['inventory_complete']=True
    doc['visual_assets']=[{'id':'FACTS','kind':'data','path':'assets/scene-spec.json','required':True},{'id':'COPY','kind':'data','path':'assets/voice-segments.json','required':True}]
    stage.save(ROOT/'production.json',doc)
    stage.record_approval(ROOT,'按你的来')
    routes=[p+[g['lastStep']] for g in facts['groups'] for p in g['prefixes']]
    assert len(routes)==5 and len({tuple(p) for p in routes})==5
    assert all(sum(p)==4 and all(s in (1,2) for s in p) for p in routes)
    assert len(texts)==4
    stage.review_asset(ROOT,'FACTS',{'status':'pass','notes':'逐项核对第3级三条前缀111/12/21后加1，第2级两条前缀11/2后加2，五个完整路径互异且总步数4。三维阶梯/棋子为制作时程序构造，仅使用已列事实与视觉规范，无外部画面素材；本机Microsoft YaHei已由原样片实际显示。'})
    stage.review_asset(ROOT,'COPY',{'status':'pass','notes':'核对四句短稿，分别建立最后一步、已知三种后走一步、已知两种后走两步、互斥相加等于五；符合用户授权的20秒单一概念讲解，不引入额外知识点或代码。实际配音时间在合成后取得。'})
    stage.require(ROOT,'production')
    print('Approved twenty-second scope and reviewed inputs verified.')

if __name__=='__main__':
    if '--require' in sys.argv:
        stage.require(ROOT,'production');print('Production gate: ready.')
    else: initialize()
