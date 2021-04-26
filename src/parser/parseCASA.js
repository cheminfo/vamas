import { appendComponent } from './casa/appendComponent';

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
