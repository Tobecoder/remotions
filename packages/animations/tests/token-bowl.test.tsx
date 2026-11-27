/** @vitest-environment jsdom */
import {renderToStaticMarkup} from 'react-dom/server';
import {describe,it,expect} from 'vitest';
import {TokenBowl} from '../src';
const at=(time:number,props={})=>new DOMParser().parseFromString(renderToStaticMarkup(<TokenBowl time={time} {...props}/>),'text/html');
describe('independent falling collection',()=>{
 it('stages entry and retains all items after they settle',()=>{
  expect(at(-.1).querySelectorAll('[data-bowl-token]')).toHaveLength(0);
  expect(at(.2).querySelectorAll('[data-bowl-token]')).toHaveLength(3);
  const end=at(4);expect(end.querySelectorAll('[data-bowl-token]')).toHaveLength(20);expect(end.querySelectorAll('[data-settled]')).toHaveLength(20);
  expect(at(8).querySelectorAll('[data-settled]')).toHaveLength(20);
 });
 it('places every item behind the front and allows another token shape',()=>{
  const d=at(4,{token:<b>♦</b>}),bowl=d.querySelector('[data-token-bowl]')!;
  expect(bowl.firstElementChild!.hasAttribute('data-bowl-back')).toBe(true);expect(bowl.lastElementChild!.hasAttribute('data-bowl-front')).toBe(true);
  expect(d.querySelectorAll('[data-bowl-token] b')).toHaveLength(20);
 });
 it('uses a caller clock and reproduces past frames after seeking',()=>{
  expect(renderToStaticMarkup(<TokenBowl time={10.2} startAt={10}/>)).toBe(renderToStaticMarkup(<TokenBowl time={.2}/>));
  const before=at(.2).body.innerHTML;at(8);expect(at(.2).body.innerHTML).toBe(before);
 });
 it('keeps malformed inputs finite and clamps unreasonable item counts',()=>{
  const d=at(Infinity,{count:1000,interval:NaN,fallDuration:-1,width:NaN,x:Infinity});
  expect(d.body.innerHTML).not.toMatch(/NaN|Infinity/);expect(at(100,{count:1000}).querySelectorAll('[data-bowl-token]')).toHaveLength(60);
  expect(at(100,{count:-2}).querySelectorAll('[data-bowl-token]')).toHaveLength(0);
 });
});
