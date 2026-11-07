import progressComparison from '../../../examples/component-examples/progress-row/example.json';
import type {MaterialId} from './catalog';

export type MaterialExample=typeof progressComparison;
export const materialExamples:readonly MaterialExample[]=[progressComparison];
export const getMaterialExamples=(materialId:MaterialId)=>materialExamples.filter(example=>example.materialId===materialId);

export const getExampleUsage=(example:MaterialExample)=>`import {Composition} from 'remotion';
import {${example.source.exportName}} from './${example.source.component.replace(/\.tsx$/,'')}';

<Composition id="TaskComparison" component={${example.source.exportName}}
  width={${example.composition.width}} height={${example.composition.height}}
  fps={${example.composition.fps}} durationInFrames={${example.composition.durationInFrames}}
  defaultProps={${JSON.stringify(example.defaultProps,null,2)}} />`;
