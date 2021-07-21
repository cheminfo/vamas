import { readFileSync } from 'fs';
import { join } from 'path';

import { parseCASA } from '../parseCASA';

describe('parseCASA', () => {
  it('assigned', () => {
    const text = readFileSync(
      join(__dirname, './data/casaBlockComment.txt'),
      'utf8',
    );
    let casa = parseCASA(text);
    expect(casa).toHaveProperty('regions');
    expect(casa).toHaveProperty('components');
    expect(casa).toHaveProperty('calibrations');
    expect(casa.regions).toHaveLength(1);
    expect(casa.components).toHaveLength(10);
  });

  it('issue #8', () => {
    let casa = parseCASA("CASA region (*C 1s*) (*U 2 Tougaard*) 1193.9028 1205.0344 0.278 2 0 0 786.70222 -450 0 0 (*C 1s*) 12.011 0 0.278");
    expect(casa.regions[0].background.name).toStrictEqual('U 2 Tougaard')
  })
});
