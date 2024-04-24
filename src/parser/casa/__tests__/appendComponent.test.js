import { appendComponent } from '../appendComponent';

test('appendComponent', () => {
  const data = `
CASA comp (*C 1s CO*) (*LA(1.4,1.4,100)*) Area 12064.956 1e-020 433826 -1 1 MFWHM 2.1060023 0.3960396 9.9009901 -1 1 Position 1205.191 1198.8295 1210.6853 -1 1 RSF 0.278 MASS 12.011 INDEX -1 (*C 1s*) CONST (**) UNCORRECTEDRSF 0.278
CASA comp (*C 1s*) (*LA(1,643)*) Area 1572.7938 1e-020 433826 -1 1 MFWHM 2.6387221 0.52774442 13.19361 -1 1 Position 1205.69 1198.8295 1210.6853 -1 1 RSF 0.278 MASS 12.011 INDEX -1 (*C 1s*) CONST (**) UNCORRECTEDRSF 0.278
CASA comp (*C 1s CC*) (*GL(30)*) Area 35666.616 1e-020 623362.6 -1 1 MFWHM 1.1910554 0.3960396 9.9009901 -1 1 Position 1205.9046 1198.8295 1210.6853 -1 1 RSF 0.278 MASS 12.011 INDEX -1 (*C 1s*) CONST (**) UNCORRECTEDRSF 0.278
CASA comp (*C 1s C=O*) (*SGL(10)*) Area 3971.5812 1e-020 433826 -1 1 MFWHM 1.9803865 0.3960396 9.9009901 -1 1 Position 1202.355 1198.8295 1210.6853 -1 1 RSF 0.278 MASS 12.011 INDEX -1 (*C 1s*) CONST (**) UNCORRECTEDRSF 0.278
CASA comp (*O 1s metal oxides*) (*GL(30)*) Area 42915.464 1e-020 1583614.4 -1 1 MFWHM 1.0947654 0.68 17 -1 1 Position 961.1203 954.38267 963.88622 -1 1 RSF 0.78 MASS 15.9994 INDEX -1 (*O 1s*) CONST (**) UNCORRECTEDRSF 0.78
CASA comp (*O 1s orgs*) (*GL(30)*) Area 21457.732 1e-020 1583614.4 0 0.5 MFWHM 2.3895444 0.68 17 4 2.1827 Position 959.3078 0 0 0 -1.8125 RSF 0.78 MASS 15.9994 INDEX -1 (*O 1s*) CONST (**) UNCORRECTEDRSF 0.78
 `;

  const components = [];
  const lines = data.split(/\r?\n/);
  for (const line of lines) {
    if (line.startsWith('CASA comp')) {
      appendComponent(components, line);
    }
  }

  const componentIDs = components.map((c) => c.componentID);
  expect(componentIDs).toEqual([
    'C 1s CO',
    'C 1s',
    'C 1s CC',
    'C 1s C=O',
    'O 1s metal oxides',
    'O 1s orgs',
  ]);

  const shapes = components.map((c) => c.shape);
  expect(shapes).toStrictEqual([
    {
      kind: 'lorentzianAsymmetric',
      options: { alpha: 1.4, beta: 1.4, m: 100 },
    },
    {
      kind: 'lorentzianAsymmetric',
      options: { alpha: 1, beta: 643 },
    },
    { kind: 'gaussianLorentzianProduct', options: { mixingRatio: 30 } },
    { kind: 'pseudoVoigt', options: { mu: 10 } },
    { kind: 'gaussianLorentzianProduct', options: { mixingRatio: 30 } },
    { kind: 'gaussianLorentzianProduct', options: { mixingRatio: 30 } },
  ]);

  const areas = components.map((c) => c.area);
  expect(areas).toStrictEqual([
    {
      value: 12064.956,
      lowerBound: 1e-20,
      upperBound: 433826,
    },
    {
      value: 1572.7938,
      lowerBound: 1e-20,
      upperBound: 433826,
    },
    {
      value: 35666.616,
      lowerBound: 1e-20,
      upperBound: 623362.6,
    },
    {
      value: 3971.5812,
      lowerBound: 1e-20,
      upperBound: 433826,
    },
    {
      value: 42915.464,
      lowerBound: 1e-20,
      upperBound: 1583614.4,
    },
    {
      value: 21457.732,
      lowerBound: 1e-20,
      upperBound: 1583614.4,
      constrain: { linkedComponent: 0, factor: 0.5 },
    },
  ]);

  const fwhms = components.map((c) => c.fwhm);
  expect(fwhms).toStrictEqual([
    {
      value: 2.1060023,
      lowerBound: 0.3960396,
      upperBound: 9.9009901,
    },
    {
      value: 2.6387221,
      lowerBound: 0.52774442,
      upperBound: 13.19361,
    },
    {
      value: 1.1910554,
      lowerBound: 0.3960396,
      upperBound: 9.9009901,
    },
    {
      value: 1.9803865,
      lowerBound: 0.3960396,
      upperBound: 9.9009901,
    },
    {
      value: 1.0947654,
      lowerBound: 0.68,
      upperBound: 17,
    },
    {
      value: 2.3895444,
      lowerBound: 0.68,
      upperBound: 17,
      constrain: {
        factor: 2.1827,
        linkedComponent: 4,
      },
    },
  ]);

  const positions = components.map((c) => c.position);
  expect(positions).toStrictEqual([
    { value: 1205.191, lowerBound: 1198.8295, upperBound: 1210.6853 },
    { value: 1205.69, lowerBound: 1198.8295, upperBound: 1210.6853 },
    { value: 1205.9046, lowerBound: 1198.8295, upperBound: 1210.6853 },
    { value: 1202.355, lowerBound: 1198.8295, upperBound: 1210.6853 },
    { value: 961.1203, lowerBound: 954.38267, upperBound: 963.88622 },
    {
      value: 959.3078,
      lowerBound: 0,
      upperBound: 0,
      constrain: { linkedComponent: 0, shift: -1.8125 },
    },
  ]);

  expect(components[0]).toStrictEqual({
    componentID: 'C 1s CO',
    shape: {
      kind: 'lorentzianAsymmetric',
      options: { alpha: 1.4, beta: 1.4, m: 100 },
    },
    area: { value: 12064.956, lowerBound: 1e-20, upperBound: 433826 },
    fwhm: { value: 2.1060023, lowerBound: 0.3960396, upperBound: 9.9009901 },
    position: { value: 1205.191, lowerBound: 1198.8295, upperBound: 1210.6853 },
    relativeSensitivityFactor: 0.278,
    atomicMass: 12.011,
    groupIndex: -1,
    uncorrectedRSF: 0.278,
  });
});
