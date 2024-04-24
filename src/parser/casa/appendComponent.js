/**
Fitting / each 'component' is a fitted lineshape, and can be from a different element while on a given orbital, for instance Ruthenium has peaks in the C1s region. The component will often have overlapping lineshapes

"CASA comp (*C 1s compA*) (*GL(30)*) Area 2447.211 1e-020 223027.03 -1 1 MFWHM 0.72109706 0.21 5.25 -1 1 Position 1203.2974 1198.6232 1207.3108 -1 1 RSF 0.278 MASS 12.011 INDEX -1 (*C 1s*) CONST (**) UNCORRECTEDRSF 0.278"
This relates to the fittings (comments on the constraints later on):

componentID: C 1s compA
lineshape: GL(30)
area: 2447.211
areaConstraint lb: 1e-020
areaConstraint ub: 223027.03
fwhm: 0.72109706
fwhmConstraint lb: 0.21
fwhmConstraint ub: 5.25
position: 1203.2974 // in kinetic energy eV
positionConstraint lb: 1198.6232 // in kinetic energy eV
positionConstraint ub: 1207.3108 // in kinetic energy eV
relativeSensitivityFactor: 0.278
mass: 12.011
index: -1	// index allows to group different components to plot their manifold
uncorrectedRSF: 0.278

Constraints: the constraints can either be absolute, in which case the value to constraint is directly followed by the constaints, e.g.:
Position 1203.4193 1202.686 1207.3108

or relative to another component, with this weird notation:
"Position 1202.261 0 0 2 -1.05017"
here the position is separated from the constaints by "0 0", then "2" indicates the component to which is is constrained, here the 2nd component (third line of the comp, i.e, starting from 0). And the last number "-1.05017" is the shift (in the kinetic energy scale)
*/

export function appendComponent(components, line) {
  // CASA comp (*Mo 3d MoS2 2H*) (*LA(1.53,243)*) Area 230.36971 1e-020 2327991 -1 1 MFWHM 0.88528218 0.2 2 -1 1 Position 1257.22 1257.02 1257.22 -1 1 RSF 10.804667 MASS 95.9219 INDEX -1 (*Mo 3d*) CONST (**) UNCORRECTEDRSF 9.5
  let component = {};
  const componentRegex = new RegExp(
    [
      /CASA comp /,
      /\(\*(?<componentID>.*)\*\) /,
      /\((?<shape>[^ ]*)\) /,
      /(?<area>Area .*)/,
      /(?<fwhm>MFWHM .*)/,
      /(?<position>Position .*) /,
      /(?<rsf>RSF .*) /,
      /(?<mass>MASS .*) /,
      /(?<index>INDEX .*) /,
      /(?<const>CONST .*) /,
      /(?<uncorrectedRSF>UNCORRECTEDRSF.*)/,
    ]
      .map((r) => r.source)
      .join(''),
  );

  let fields = line.match(componentRegex);
  if (!fields) {
    throw new Error(`appendComponent fails on: ${line}`);
  }
  component = {
    componentID: fields.groups.componentID,
    shape: parseShape(fields.groups.shape),
    area: parseMultiplicationConstrain(fields.groups.area),
    fwhm: parseMultiplicationConstrain(fields.groups.fwhm),
    position: parseKEShiftConstrain(fields.groups.position),
    relativeSensitivityFactor: parseRSF(fields.groups.rsf),
    atomicMass: parseMass(fields.groups.mass),
    groupIndex: parseIndex(fields.groups.index),
    uncorrectedRSF: parseUncorrectedRSF(fields.groups.uncorrectedRSF),
  };
  components.push(component);
}

function parseShape(value) {
  let parts = value
    .replace(/[*(),]/g, ' ')
    .trim()
    .split(/ +/);
  let options = {};
  let kind;
  switch (parts[0]) {
    case 'LA': // http://www.casaxps.com/help_manual/manual_updates/LA_Lineshape.pdf
      kind = 'lorentzianAsymmetric';
      options.alpha = Number(parts[1]);
      options.beta = Number(parts[2]);
      if (parts[3] !== undefined) {
        options.m = Number(parts[3]);
      }
      break;
    case 'GL': // http://www.casaxps.com/help_manual/line_shapes.htm
      kind = 'gaussianLorentzianProduct';
      options.mixingRatio = Number(parts[1]);
      break;
    case 'SGL': // https://docs.mantidproject.org/nightly/fitting/fitfunctions/PseudoVoigt.html
      kind = 'pseudoVoigt';
      options.mu = Number(parts[1]);
      break;
    case 'LF':
      kind = 'gaussianLorentzianSum';
      break;
    case 'LS':
      kind = 'gaussianLorentzianSum';
      break;
    default:
      throw Error(`appendComponent: unknown shape: ${parts[0]}`);
  }
  return {
    kind,
    options,
  };
}
function parseMultiplicationConstrain(value) {
  const parts = value.split(' ');
  const result = {
    value: Number(parts[1]),
    lowerBound: Number(parts[2]),
    upperBound: Number(parts[3]),
  };
  const constrain = {
    linkedComponent: Number(parts[4]), // line number, no constrain if -1
    factor: Number(parts[5]), // multiplication factor of the value in the linked line
  };
  if (constrain.linkedComponent >= 0) {
    result.constrain = constrain;
  }
  return result;
}

function parseKEShiftConstrain(value) {
  const parts = value.split(' ');
  const result = {
    value: Number(parts[1]),
    lowerBound: Number(parts[2]),
    upperBound: Number(parts[3]),
  };
  const constrain = {
    linkedComponent: Number(parts[4]), // line number, no constrain if -1
    shift: Number(parts[5]), // shift of the value in the linked line
  };
  if (constrain.linkedComponent >= 0) {
    result.constrain = constrain;
  }
  return result;
}

function parseRSF(value) {
  let parts = value.split(' ');
  return Number(parts[1]);
}

function parseMass(value) {
  let parts = value.split(' ');
  return Number(parts[1]);
}

function parseIndex(value) {
  let parts = value.split(' ');
  return Number(parts[1]);
}

function parseUncorrectedRSF(value) {
  let parts = value.split(' ');
  return Number(parts[1]);
}
