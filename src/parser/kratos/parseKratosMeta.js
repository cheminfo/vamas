/**
 * Instrument manufacturers store some key metadata in their own fields
 * in the vamas file. This does not follow the ISO specification.
 *
 * For this reason, there needs to be one parsing step that is specific to the manufacturer that extracts this data.
 *
 * Note that we only parse data that is not in ISO-specified block, in the case of Kratos, this is, for example, information about charge neutralization
 *
 * To avoid an additional for loop this function takes an object and a line and updates key/value pairs as appropriate
 */

function splitTrim(line) {
  return line.replace(/\s/).split(':')[1];
}

function splitTrimValueUnit(line) {
  let intermediate = splitTrim(line);
  const unit = intermediate.match(/[a-zA-Z]+/g)[0];
  const value = parseFloat(intermediate.replace(unit, ''));
  return { value: value, unit: unit };
}

export function parseKratosBlock(meta, line) {
  if (line.startsWith('Charge Neutraliser :')) {
    if (line.includes('On')) {
      meta.chargeNeutraliser.activated = true;
    }
  }
  if (line.startsWith('Sweeps :')) {
    meta.scanSettings.numberSweeps = splitTrim(line);
  }
  if (line.startsWith('Dwell time :')) {
    meta.scanSettings.dwellTime = splitTrimValueUnit(line);
  }
  if (line.startsWith('Sweep time :')) {
    meta.scanSettings.sweepTime = splitTrimValueUnit(line);
  }
  if (line.startsWith('Charge Balance :')) {
    meta.chargeNeutraliser.chargeBalance = splitTrimValueUnit(line);
  }
}
