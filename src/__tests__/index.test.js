import { test, expect } from 'vitest';

import { parse } from '..';

test('check parse', () => {
  expect(parse).toBeInstanceOf(Function);
});
