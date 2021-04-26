export function appendCalibration(calibrations, line) {
  let calibration = {};
  // Calib M = 281.1700 A = 284.8 BE AD
  let fields = line.match(/Calib (M = .*) (A = [^ ]*) (.*)/);
  if (!fields) {
    throw new Error(`appendCalibration fails on: ${line}`);
  }
  calibrations.push(calibration);
}
