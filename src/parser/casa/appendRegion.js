export function appendRegion(regions, line) {
  // CASA region (*Mo 3d*) (*Shirley*) 1249.3343 1262.7065 10.804667 2 0 0 392.54541 -450 0 0 (*Mo 3d*) 95.9219 0 9.5
  let fields = line.match(
    /CASA region \(\*(?<blockID>.*)\*\) \(\*(?<backgroundType>.*)\*\) (?<backgroundOptions>.*) \((?<comment>.*)\) (?<surface>.*)/,
  );

  if (!fields) {
    throw new Error(`appendRegion fails on: ${line}`);
  }

  let region = {
    name: fields.groups.name,
    background: {
      type: fields.groups.backgroundType,
      parameters: parseBackgroundParameters(
        fields.groups.backgroundType,
        fields.groups.backgroundOptions,
      ),
      options: fields.groups.backgroundOptions,
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
    .map((field) => parseFloat(field));

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
