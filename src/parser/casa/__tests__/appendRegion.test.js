import { appendRegion } from '../appendRegion';

test('appendRegion', () => {
  const data = `CASA region (*C 1s*) (*Shirley*) 1194.8785 1203.5916 0.278 2 0 0 115.3918 -450 0 0 (*C 1s*) 12.011 0 0.278`;

  const regions = [];
  const lines = data.split(/\r?\n/);
  for (const line of lines) {
    if (line.startsWith('CASA region')) {
      appendRegion(regions, line);
    }
  }

  expect(regions).toHaveLength(1);
  expect(regions[0]).toStrictEqual({
    regionID: 'C 1s',
    block: {
      regionBlockID: 'C 1s',
      atomicMass: 12.011,
      relativeSensitivityFactor: 0.278,
    },
    background: {
      type: 'Shirley',
      parameters: {
        kineticEnergyStart: 1194.8785,
        kineticEnergyEnd: 1203.5916,
        relativeSensitivityFactor: 0.278,
        averageWidth: 1,
        startOffset: 0,
        endOffset: 0,
        crossSection: [115.3918, -450, 0, 0],
      },
      rawParameters: '1194.8785 1203.5916 0.278 2 0 0 115.3918 -450 0 0',
    },
  });
});
