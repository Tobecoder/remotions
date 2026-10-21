import {mkdirSync, writeFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {dirname, resolve} from 'node:path';

const sampleRate = 48_000;
const duration = 6;
const notes = [220, 261.63, 329.63, 392, 293.66, 440];
const count = sampleRate * duration;
const pcm = Buffer.alloc(44 + count * 2);
pcm.write('RIFF', 0);
pcm.writeUInt32LE(pcm.length - 8, 4);
pcm.write('WAVEfmt ', 8);
pcm.writeUInt32LE(16, 16);
pcm.writeUInt16LE(1, 20);
pcm.writeUInt16LE(1, 22);
pcm.writeUInt32LE(sampleRate, 24);
pcm.writeUInt32LE(sampleRate * 2, 28);
pcm.writeUInt16LE(2, 32);
pcm.writeUInt16LE(16, 34);
pcm.write('data', 36);
pcm.writeUInt32LE(count * 2, 40);

for (let index = 0; index < count; index++) {
  const time = index / sampleRate;
  const beat = time % 0.5;
  const note = notes[Math.floor(time / 0.5) % notes.length];
  const envelope = (1 - Math.exp(-35 * beat)) * Math.exp(-3.1 * beat);
  const tone = envelope * (Math.sin(2 * Math.PI * note * time) + 0.24 * Math.sin(4 * Math.PI * note * time) + 0.1 * Math.sin(6 * Math.PI * note * time));
  const kick = Math.exp(-31 * beat) * Math.sin(2 * Math.PI * (55 + 60 * Math.exp(-18 * beat)) * time);
  const hatBeat = (time + 0.25) % 0.5;
  const hat = Math.exp(-64 * hatBeat) * (Math.sin(2 * Math.PI * 5900 * time) + 0.4 * Math.sin(2 * Math.PI * 8100 * time));
  const value = Math.max(-0.95, Math.min(0.95, 0.29 * tone + 0.58 * kick + 0.12 * hat));
  pcm.writeInt16LE(Math.round(value * 32767), 44 + index * 2);
}

const target = resolve(dirname(fileURLToPath(import.meta.url)), '../apps/catalog/public/demo-audio.wav');
mkdirSync(dirname(target), {recursive: true});
writeFileSync(target, pcm);
console.log(target);
