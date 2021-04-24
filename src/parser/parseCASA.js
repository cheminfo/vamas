export function parseCASA(text) {
  const casa = { regions: [], components: [], calibrations: [] };
  const lines = text.split(/\r?\n/);
  for (const line of lines) {
    if (line.startsWith('CASA comp ')) {
      appendComponent(casa.components, line);
    }
    if (line.startsWith('CASA region')) {
      appendRegion(casa.regions, line);
    }
    if (line.startsWith('Calib')) {
      appendCalibration(casa.calibrations, line);
    }
  }

  return casa;
}

function appendCalibration(calibrations, line) {
  let calibration = {};
  // Calib M = 281.1700 A = 284.8 BE AD
  let fields = line.match(/Calib (M = .*) (A = [^ ]*) (.*)/);
  if (fields.length === 0) {
    throw new Error(`appendCalibration fails on: ${line}`);
  }
  calibrations.push(calibration);
}

function appendRegion(regions, line) {
  // CASA region (*Mo 3d*) (*Shirley*) 1249.3343 1262.7065 10.804667 2 0 0 392.54541 -450 0 0 (*Mo 3d*) 95.9219 0 9.5
  let region = {};
  let fields = line.match(
    /CASA region \((.*)\) \(([^ ]*)\) (.*) \((.*)\) (.*)/,
  );
  if (fields.length === 0) {
    throw new Error(`appendCalibration fails on: ${line}`);
  }
  regions.push(region);
}

function appendComponent(components, line) {
  // CASA comp (*Mo 3d MoS2 2H*) (*LA(1.53,243)*) Area 230.36971 1e-020 2327991 -1 1 MFWHM 0.88528218 0.2 2 -1 1 Position 1257.22 1257.02 1257.22 -1 1 RSF 10.804667 MASS 95.9219 INDEX -1 (*Mo 3d*) CONST (**) UNCORRECTEDRSF 9.5
  let component = {};
  const componentRegex = new RegExp(
    [
      /CASA comp /,
      /\((.*)\) /,
      /\(([^ ]*)\) /,
      /(?<area>Area .*)/,
      /(?<mfwm>MFWHM .*)/,
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
  if (fields.length === 0) {
    throw new Error(`appendCalibration fails on: ${line}`);
  }
  component = { ...fields };
  components.push(component);
}
