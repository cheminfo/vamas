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

  it('Tougaard background', () => {
    let casa = parseCASA(
      'CASA region (*C 1s*) (*U 2 Tougaard*) 1193.9028 1205.0344 0.278 2 0 0 786.70222 -450 0 0 (*C 1s*) 12.011 0 0.278',
    );

    expect(casa.regions).toStrictEqual([
      {
        name: undefined,
        background: {
          type: 'U 2 Tougaard',
          parameters: {
            kineticEnergyStart: 1193.9028,
            kineticEnergyEnd: 1205.0344,
            relativeSensitivityFactor: 0.278,
            averageWidth: 1,
            startOffset: 0,
            endOffset: 0,
            crossSection: [786.70222, -450, 0, 0],
          },
          options: '1193.9028 1205.0344 0.278 2 0 0 786.70222 -450 0 0',
        },
      },
    ]);
  });
  it('Shirley background', () => {
    let casa = parseCASA(
      'CASA region (*C 1s*) (*Shirley*) 1194.8785 1203.5916 0.278 2 0 0 115.3918 -450 0 0 (*C 1s*) 12.011 0 0.278',
    );
    expect(casa.regions).toStrictEqual([
      {
        name: undefined,
        background: {
          type: 'Shirley',
          parameters: {
            kineticEnergyStart: 1194.8785,
            kineticEnergyEnd: 1203.5916,
            relativeSensitivityFactor: 0.278,
            averageWidth: 1,
            startOffset: 0,
            endOffset: 0,
            crossSection: [115.3918, -450, 0, 0]
          },
          options: '1194.8785 1203.5916 0.278 2 0 0 115.3918 -450 0 0',
        },
      },
    ]);
  });
  it('issue #9', () => {
    let casa = parseCASA(
      'CASA comp (*Mo 3d MoS2 2H*) (*LA(1.53,243)*) Area 153.57981 1e-020 2327991 0 0.66666667 MFWHM 0.76493355 0.65389948 1.2538995 -1 1 Position 1254.08 0 0 0 -3.14 RSF 10.804667 MASS 95.9219 INDEX -1 (*Mo 3d*) CONST (**) UNCORRECTEDRSF 9.5',
    );
    expect(casa.components[0].shape.kind).toStrictEqual('LA');
  });
});
