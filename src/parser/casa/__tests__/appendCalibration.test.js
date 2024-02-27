import { appendCalibration } from '../appendCalibration';

test('appendCalibration', () => {
  const data = `Calib M = 10.1 A = 20.1 BE ADD
Calib M = 20.2 A = 40.2 BE ADD
Calib M = 1.1 A = 5.1 ADD`;

  const calibrations = [];
  const lines = data.split(/\r?\n/);
  for (const line of lines) {
    if (line.startsWith('Calib')) {
      appendCalibration(calibrations, line);
    }
  }

  expect(calibrations).toHaveLength(3);
  expect(calibrations).toStrictEqual([
    {
      after: 20.1,
      before: 10.1,
      bindingEnergyShift: 10.000000000000002,
      kind: 'bindingEnergy',
      kineticEnergyShift: -10.000000000000002,
    },
    {
      after: 40.2,
      before: 20.2,
      bindingEnergyShift: 20.000000000000004,
      kind: 'bindingEnergy',
      kineticEnergyShift: -20.000000000000004,
    },
    {
      after: 5.1,
      before: 1.1,
      bindingEnergyShift: -3.9999999999999996,
      kind: 'kineticEnergy',
      kineticEnergyShift: 3.9999999999999996,
    },
  ]);
});
