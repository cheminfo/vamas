import { readFileSync } from 'fs';
import { join } from 'path';

import { parseKratosMeta } from '../parseKratosMeta';

describe('parse Kratos meta data', () => {
  it('example 1', () => {
    const text = readFileSync(
      join(__dirname, '../../__tests__/data/caseBlockComment.txt'),
      'utf8',
    );

    const meta = parseKratosMeta(text);

    expect(meta.scanSettings).toHaveProperty('dwellTime');
    expect(meta.chargeNeutraliser).toHaveProperty('chargeBalance');
    expect(meta.chargeNeutraliser.chargeBalance.value).toStrictEqual(4.9);
    expect(meta.chargeNeutraliser.chargeBalance.unit).toStrictEqual('V');
    expect(meta.chargeNeutraliser.activated).toStrictEqual(true);
  });
});
