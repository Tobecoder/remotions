import progressComparison from '../../../examples/component-examples/progress-row/example.json';
import scriptDocument from '../../../examples/component-examples/script-document/example.json';
import cardSpotlight from '../../../examples/component-examples/card-spotlight/example.json';
import documentFocus from '../../../examples/component-examples/document-focus/example.json';
import sectionCollapse from '../../../examples/component-examples/content-collapse/example.json';
import type {MaterialId} from './catalog';

export type MaterialExample=Omit<typeof progressComparison,'defaultProps'> & {defaultProps:Readonly<Record<string,unknown>>};
export const materialExamples:readonly MaterialExample[]=[progressComparison,scriptDocument,cardSpotlight,documentFocus,sectionCollapse];
export const getMaterialExamples=(materialId:MaterialId)=>materialExamples.filter(example=>example.materialIds.includes(materialId));

export const getExampleUsage=(example:MaterialExample)=>`import {Composition} from 'remotion';
import {${example.source.exportName}} from './${example.source.component.replace(/\.tsx$/,'')}';

<Composition id="${example.composition.id}" component={${example.source.exportName}}
  width={${example.composition.width}} height={${example.composition.height}}
  fps={${example.composition.fps}} durationInFrames={${example.composition.durationInFrames}}
  defaultProps={${JSON.stringify(example.defaultProps,null,2)}} />`;
