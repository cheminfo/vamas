import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { describe, expect, it } from 'vitest';

import { parse } from '../parse';

describe('fromVamas', () => {
  it('multiplex', () => {
    const text = readFileSync(join(__dirname, './data/multiplex.vms'), 'utf8');
    let parsed = parse(text);
    expect(parsed.blocks).toHaveLength(3);
  });

  it('survey', () => {
    const text = readFileSync(join(__dirname, './data/survey.vms'), 'utf8');
    let parsed = parse(text);

    expect(parsed.blocks).toHaveLength(1);
  });

  it('single_sample', () => {
    const text = readFileSync(
      join(__dirname, './data/single_sample.vms'),
      'utf8',
    );
    let parsed = parse(text);
    expect(parsed.blocks).toHaveLength(9);

    let starts = parsed.blocks.map((block) => block['abscissa start']);
    expect(starts).toStrictEqual([
      286.69, 851.69, 1336.69, 943.69, 1076.69, 1186.69, 1311.69, 15.22, 1.22,
    ]);
    let result = analyseBlock(parsed.blocks[6]);
    expect(result).toHaveLength(101);
    expect(result[0]).toStrictEqual({ x: 175, y: 55111, k: 1311.69 });
    expect(result.at(-1)).toStrictEqual({
      x: 155,
      y: 64967,
      k: 1331.69,
    });
  });
});

function analyseBlock(block) {
  const energy = block['analysis source characteristic energy'];
  const xStart = block['abscissa start'];
  const xIncrement = block['abscissa increment'];

  const ys = block.correspondingVariables[0].array;

  const result = [];
  for (let i = 0; i < ys.length; i++) {
    result.push({
      x: energy - (xStart + i * xIncrement),
      y: ys[i],
      k: xStart + i * xIncrement,
    });
  }
  return result;
}
