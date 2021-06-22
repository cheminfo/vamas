export function appendComponent(components, line) {
  // CASA comp (*Mo 3d MoS2 2H*) (*LA(1.53,243)*) Area 230.36971 1e-020 2327991 -1 1 MFWHM 0.88528218 0.2 2 -1 1 Position 1257.22 1257.02 1257.22 -1 1 RSF 10.804667 MASS 95.9219 INDEX -1 (*Mo 3d*) CONST (**) UNCORRECTEDRSF 9.5
  let component = {};
  const componentRegex = new RegExp(
    [
      /CASA comp /,
      /\((?<name>.*)\) /,
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
    name: fields.groups.name,
    shape: parseShape(fields.groups.shape),
    area: parseArea(fields.groups.area),
    fwhm: parseFWHM(fields.groups.fwhm),
    position: parsePosition(fields.groups.position),
    rsf: parseRSF(fields.groups.rsf),
    mass: parseMass(fields.groups.mass),
    index: parseIndex(fields.groups.index),
    const: parseConst(fields.groups.const),
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
    case 'LA':
      kind = `??? ${parts[0]}`;
      options.asymmetry = Number(parts[1]);
      options.extension = Number(parts[2]);
      break;
    case 'GL':
      kind = `??? ${parts[0]}`;
      options.unknown = Number(parts[1]);
      break;
    default:
      throw Error(`appendComponent: unknown shape: ${parts[0]}`);
  }
  return {
    kind,
    options,
  };
}
function parseArea(value) {
  let parts = value.split(' ');
  return {
    value: Number(parts[1]),
    from: Number(parts[2]),
    to: Number(parts[3]),
    unknown1: Number(parts[4]),
    unknown2: Number(parts[5]),
  };
}
function parseFWHM(value) {
  let parts = value.split(' ');
  return {
    value: Number(parts[1]),
    from: Number(parts[2]),
    to: Number(parts[3]),
    unknown1: Number(parts[4]),
    unknown2: Number(parts[5]),
  };
}
function parsePosition(value) {
  let parts = value.split(' ');
  return {
    value: Number(parts[1]),
    from: Number(parts[2]),
    to: Number(parts[3]),
    unknown1: Number(parts[4]),
    unknown2: Number(parts[5]),
  };
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
function parseConst(value) {return value} // We do not really know what this value means and hence just parse the string
function parseUncorrectedRSF(value) {
  let parts = value.split(' ');
  return Number(parts[1]);
}
