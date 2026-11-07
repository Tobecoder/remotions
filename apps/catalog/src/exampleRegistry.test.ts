import {existsSync,readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {describe,expect,it} from 'vitest';
import {catalog} from './catalog';
import {getExampleUsage,getMaterialExamples,materialExamples} from './exampleRegistry';

const repository=new URL('../../../',import.meta.url);
const local=(path:string)=>fileURLToPath(new URL(path,repository));

describe('complete example registry',()=>{
  it('links a real material to its original composition, copy settings and usage guide',()=>{
    expect(materialExamples).toHaveLength(5);
    expect(new Set(materialExamples.map(example=>example.id)).size).toBe(materialExamples.length);
    for(const example of materialExamples){
      expect(example.materialIds.length).toBeGreaterThan(0);
      expect(new Set(example.materialIds).size).toBe(example.materialIds.length);
      for(const materialId of example.materialIds)expect(catalog.some(item=>item.id===materialId)).toBe(true);
      for(const key of ['entry','component','implementation','guide'] as const)expect(existsSync(local(example.source[key]))).toBe(true);
      const implementation=example.source.implementation.split('/').pop()!.replace(/\.tsx$/,'');
      expect(readFileSync(local(example.source.component),'utf8')).toContain(`from '../../reference-opening/compositions/${implementation}'`);
      expect(example.composition.durationInFrames).toBeGreaterThan(example.composition.posterFrame);
      expect(example.composition.posterFrame).toBeGreaterThan(0);
      expect(example.composition.width/example.composition.height).toBe(16/9);
      expect(example.replaceable.length).toBeGreaterThan(0);expect(example.preserve.length).toBeGreaterThan(0);
      expect(['pending','approved']).toContain(example.reviewStatus);
      expect(getExampleUsage(example)).toContain(example.source.exportName);
    }
  });
  it('shares one document explanation across its three standalone actions',()=>{
    for(const materialId of ['document-window','highlight-box','collapsing-title'] as const){
      expect(getMaterialExamples(materialId).map(example=>example.id)).toEqual(['script-document-guide']);
    }
    expect(getMaterialExamples('progress-row').map(example=>example.id)).toEqual(['progress-row-comparison']);
    expect(getMaterialExamples('card-spotlight').map(example=>example.id)).toEqual(['card-spotlight-return']);
    expect(getMaterialExamples('content-collapse').map(example=>example.id)).toEqual(['section-collapse']);
    for(const materialId of ['card-entrance','focus-layer'] as const)expect(getMaterialExamples(materialId).map(example=>example.id)).toEqual(['document-focus-gallery']);
    expect(getMaterialExamples('perspective-panel')).toEqual([]);
  });
  it('ships the example preview and guide used by the material card',()=>{
    for(const example of materialExamples)for(const asset of Object.values(example.preview)){
      expect(asset).toMatch(/^\/examples\/[a-z0-9-]+\.(mp4|jpg|md)$/);
      expect(existsSync(local(`apps/catalog/public${asset}`))).toBe(true);
    }
    for(const example of materialExamples)expect(readFileSync(local(`apps/catalog/public${example.preview.guide}`),'utf8')).toBe(readFileSync(local(example.source.guide),'utf8'));
  });
});
