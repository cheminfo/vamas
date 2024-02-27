export function appendCalibration(calibrations, line) {
  let calibration = {};
  // Calib M = 281.1700 A = 284.8 BE ADD
  // calibration may be present on many lines

  let fields = line.match(/Calib (M = .*) (A = [^ ]*) (.*)/);
  if (!fields) {
    throw new Error(`appendCalibration fails on: ${line}`);
  }
  calibrations.push(calibration);
}
