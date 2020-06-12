import { readFileSync } from 'fs';
import { join } from 'path';

import { parse } from '../parse';

test('fromVamas', () => {
  const text = readFileSync(join(__dirname, './data/multiplex.vms'), 'utf8');
  let parsed = parse(text);
  expect(parsed.blocks).toHaveLength(3);
});
