import progressComparison from '../../../examples/component-examples/progress-row/example.json';
import scriptDocument from '../../../examples/component-examples/script-document/example.json';
import cardSpotlight from '../../../examples/component-examples/card-spotlight/example.json';
import documentFocus from '../../../examples/component-examples/document-focus/example.json';
import sectionCollapse from '../../../examples/component-examples/content-collapse/example.json';
import sceneThumbnail from '../../../examples/component-examples/scene-thumbnail/example.json';
import preparationCards from '../../../examples/component-examples/preparation-cards/example.json';
import writingComparison from '../../../examples/component-examples/writing-comparison/example.json';
import usageComparison from '../../../examples/component-examples/usage-meter/example.json';
import threeStepFlow from '../../../examples/component-examples/three-step-flow/example.json';
import tutorialWalkthrough from '../../../examples/component-examples/tutorial-walkthrough/example.json';
import resourceCredits from '../../../examples/component-examples/resource-credits/example.json';
import materialFiling from '../../../examples/component-examples/material-filing/example.json';
import dropCards from '../../../examples/component-examples/drop-cards/example.json';
import impactRecoil from '../../../examples/component-examples/impact-recoil/example.json';
import srtSync from '../../../examples/component-examples/srt-sync/example.json';
import transcriptRouting from '../../../examples/component-examples/transcript-routing/example.json';
import scriptCorrection from '../../../examples/component-examples/script-correction/example.json';
import type {MaterialId} from './catalog';

export type MaterialExample=Omit<typeof progressComparison,'defaultProps'> & {defaultProps:Readonly<Record<string,unknown>>};
export const materialExamples:readonly MaterialExample[]=[progressComparison,scriptDocument,cardSpotlight,documentFocus,sectionCollapse,sceneThumbnail,preparationCards,writingComparison,usageComparison,threeStepFlow,tutorialWalkthrough,resourceCredits,materialFiling,dropCards,impactRecoil,srtSync,transcriptRouting,scriptCorrection];
export const getMaterialExamples=(materialId:MaterialId)=>materialExamples.filter(example=>example.materialIds.includes(materialId));

export const getExampleUsage=(example:MaterialExample)=>`import {Composition} from 'remotion';
import {${example.source.exportName}} from './${example.source.component.replace(/\.tsx$/,'')}';

<Composition id="${example.composition.id}" component={${example.source.exportName}}
  width={${example.composition.width}} height={${example.composition.height}}
  fps={${example.composition.fps}} durationInFrames={${example.composition.durationInFrames}}
  defaultProps={${JSON.stringify(example.defaultProps,null,2)}} />`;
