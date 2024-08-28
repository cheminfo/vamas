/**
 * Regions are used to calculate the baseline.
 * There may be several overlapping regions.
 * We could just throw an error if it happens has this is likely just a bug from casaXPS to allow for this.
 * "CASA region (*C 1s*) (*Shirley*) 1202.686 1208.454 0.278 2 0 0 115.3918 -450 0 0 (*C 1s*) 12.011 0 0.278"
 *
 * THe last 3 numbers:  12.011 0 0.278, are the mass of the element (Carbon here), a separator
 * and the relative sensitivity factor of the element.
 *  Note that the relative sensitivity factor given within the background part ((*C 1s*) (*Shirley*) 1202.686 1208.454 0.278 2 0 0 115.3918 -450 0 0 (*C 1s*)), can be different than the last one.
 * @param regions
 * @param line
 */

export function appendRegion(regions, line) {
  // CASA region (*Mo 3d*) (*Shirley*) 1249.3343 1262.7065 10.804667 2 0 0 392.54541 -450 0 0 (*Mo 3d*) 95.9219 0 9.5
  let fields = line.match(
    /CASA region \(\*(?<regionID>.*)\*\) \(\*(?<backgroundType>.*)\*\) (?<backgroundOptions>.*) \(\*(?<regionBlockID>.*)\*\) (?<atomicMass>.*) (?<separator>.) (?<relativeSensitivityFactor>.*)/,
  );

  if (!fields) {
    throw new Error(`appendRegion fails on: ${line}`);
  }

  let region = {
    regionID: fields.groups.regionID,
    block: {
      regionBlockID: fields.groups.regionBlockID,
      atomicMass: Number.parseFloat(fields.groups.atomicMass),
      relativeSensitivityFactor: Number.parseFloat(
        fields.groups.relativeSensitivityFactor,
      ),
    },
    background: {
      type: fields.groups.backgroundType,
      parameters: parseBackgroundParameters(
        fields.groups.backgroundType,
        fields.groups.backgroundOptions,
      ),
      rawParameters: fields.groups.backgroundOptions,
    },
  };

  regions.push(region);
}

function parseBackgroundParameters(type, string) {
  const [
    kineticEnergyStart,
    kineticEnergyEnd,
    relativeSensitivityFactor,
    averageWidth,
    startOffset,
    endOffset,
    ...otherParameters
  ] = string
    .split(/ +/)
    .filter((field) => field.trim() !== '')
    .map((field) => Number.parseFloat(field));

  // todo: strange we need to remove 1 from averageWidth
  return {
    kineticEnergyStart,
    kineticEnergyEnd,
    relativeSensitivityFactor,
    averageWidth: averageWidth - 1,
    startOffset,
    endOffset,
    crossSection: otherParameters,
  };
}
