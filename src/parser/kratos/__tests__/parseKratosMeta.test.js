import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { expect, test } from 'vitest';

import { parseKratosMeta } from '../parseKratosMeta.js';

test('example 1', () => {
  const text = readFileSync(
    join(import.meta.dirname, '../../__tests__/data/casaBlockComment.txt'),
    'utf8',
  );

  const meta = parseKratosMeta(text);

  expect(meta.scanSettings).toHaveProperty('dwellTime');
  expect(meta.chargeNeutraliser).toHaveProperty('chargeBalance');
  expect(meta.chargeNeutraliser.chargeBalance.value).toStrictEqual(4.9);
  expect(meta.chargeNeutraliser.chargeBalance.unit).toBe('V');
  expect(meta.chargeNeutraliser.activated).toBe(true);
});
