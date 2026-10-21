import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {describe, expect, it} from 'vitest';
import ts from 'typescript';
import {catalog, categories, snippetFor} from './catalog';

describe('audio animation catalog', () => {
  it('contains only the three audio-reactive components', () => {
    expect(catalog.map((item) => item.componentName)).toEqual(['Oscilloscope', 'MirroredSpectrum', 'VoiceNote']);
    expect(catalog.every((item) => item.category === 'audio')).toBe(true);
  });

  it('keeps future categories separate from the active catalog entries', () => {
    expect(categories.map((item) => item.id)).toEqual(['audio', 'captions', 'backgrounds', 'effects', 'layouts']);
    expect(categories.filter((item) => item.status === 'coming-soon')).toHaveLength(4);
    expect(categories.every((item) => item.name && item.description)).toBe(true);
  });

  it.each(catalog)('$name provides valid TSX wired to one audio source', ({id, componentName}) => {
    const snippet = snippetFor(id);
    expect(snippet).toContain(`<${componentName} src={src}`);
    expect(snippet).toContain('<Audio src={src} />');
    const result = ts.transpileModule(snippet, {fileName: 'snippet.tsx', reportDiagnostics: true, compilerOptions: {jsx: ts.JsxEmit.ReactJSX, module: ts.ModuleKind.ESNext}});
    expect(result.diagnostics?.filter((item) => item.category === ts.DiagnosticCategory.Error)).toEqual([]);
  });

  it('ships a valid dynamic six-second demo WAV', () => {
    const path = fileURLToPath(new URL('../public/demo-audio.wav', import.meta.url));
    const data = readFileSync(path);
    expect(data.toString('ascii', 0, 4)).toBe('RIFF');
    expect(data.toString('ascii', 8, 12)).toBe('WAVE');
    expect(data.readUInt32LE(24)).toBe(48_000);
    expect(data.length).toBe(44 + 6 * 48_000 * 2);
    const energy = (start: number) => Array.from({length: 400}, (_, index) => Math.abs(data.readInt16LE(44 + (start + index) * 2))).reduce((sum, value) => sum + value, 0);
    expect(energy(4_800)).not.toBe(energy(24_000));
  });
});
