import { expect, test } from 'vitest';

import { parse } from '../index.js';

test('check parse', () => {
  expect(parse).toBeInstanceOf(Function);
});
