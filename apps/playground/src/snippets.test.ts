import {describe, expect, it} from 'vitest';
import ts from 'typescript';
import {catalog, snippetFor} from './catalog';

describe('copy-ready snippets', () => {
  it.each(catalog)('$name generates valid TSX with the chosen timing and escaped text', ({id}) => {
    const snippet = snippetFor(id, '中文 "quote" {braces}\n👩🏽‍💻', '#123456', 64, 17);
    expect(snippet).toContain('durationInFrames={64}');
    expect(snippet).toContain('delayInFrames={17}');
    const result = ts.transpileModule(snippet, {
      fileName: 'snippet.tsx', reportDiagnostics: true,
      compilerOptions: {jsx: ts.JsxEmit.ReactJSX, module: ts.ModuleKind.ESNext},
    });
    expect(result.diagnostics?.filter((diagnostic) => diagnostic.category === ts.DiagnosticCategory.Error)).toEqual([]);
  });
});
