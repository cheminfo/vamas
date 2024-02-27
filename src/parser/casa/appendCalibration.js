export function appendCalibration(calibrations, line) {
  let calibration = {};
  // Calib M = 281.1700 A = 284.8 BE ADD
  // calibration may be present on many lines

  let fields = line.match(
    /Calib M = (?<before>.*) A = (?<after>[^ ]*) (?<rest>.*)/,
  );
  if (!fields) {
    throw new Error(`appendCalibration fails on: ${line}`);
  }
  if (!fields.groups.rest.includes('ADD')) {
    throw new Error(
      `appendCalibration fails because line does not contain ADD: ${line}`,
    );
  }
  calibration.before = Number(fields.groups.before);
  calibration.after = Number(fields.groups.after);
  if (fields.groups.rest.includes('BE')) {
    calibration.bindingEnergyShift = calibration.after - calibration.before;
    calibration.kind = 'bindingEnergy';
  } else {
    calibration.bindingEnergyShift = calibration.before - calibration.after;
    calibration.kind = 'kineticEnergy';
  }
  calibration.kineticEnergyShift = -calibration.bindingEnergyShift;
  calibrations.push(calibration);
}
