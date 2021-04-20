import { readFileSync } from 'fs';
import { join } from 'path';

import { parseCASA } from '../parseCASA';

describe('parseCASA', () => {
  it('assigned', () => {
    const text = readFileSync(
      join(__dirname, './data/caseBlockComment.txt'),
      'utf8',
    );
    let casa = parseCASA(text);

    expect(casa).toEqual({});
  });
});
