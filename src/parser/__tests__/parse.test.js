import { readFileSync } from 'fs';
import { join } from 'path';

import { parse } from '../parse';

describe('fromVamas', () => {
  it('multiples', () => {
    const text = readFileSync(join(__dirname, './data/multiplex.vms'), 'utf8');
    let parsed = parse(text);
    expect(parsed.blocks).toHaveLength(3);
  });
  it('ARXPS', () => {
    const text = readFileSync(join(__dirname, './data/survey.vms'), 'utf8');
    let parsed = parse(text);

    expect(parsed.blocks).toHaveLength(1);
  });
});
