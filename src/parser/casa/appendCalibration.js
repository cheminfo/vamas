/**
 * Referencing: (energy calibration, typically performed on the binding energy scale)
 * " Calib M = 0 A = 3.111 ADD"
 * means that the block should be shifted in binding energy by adding the difference A - M = 3.111 eV. M is not necessarily 0.
 * If the line contains BE, it means that the operation should be done on the BE scale,
 * alternatively, simply change the sign of the difference, here it would be -3,111, to be added to the data in the binding energy scale.
 * @param {object} calibrations
 * @param {string} line
 */

export function appendCalibration(calibrations, line) {
  let calibration = {};
  // Calib M = 281.1700 A = 284.8 BE ADD
  // calibration may be present on many lines

  let fields = line.match(
    /Calib M = (?<measured>.*) A = (?<referenced>[^ ]*) (?<rest>.*)/,
  );
  if (!fields) {
    throw new Error(`appendCalibration fails on: ${line}`);
  }
  if (!fields.groups.rest.includes('ADD')) {
    throw new Error(
      `appendCalibration fails because line does not contain ADD: ${line}`,
    );
  }
  calibration.measured = Number(fields.groups.measured);
  calibration.referenced = Number(fields.groups.referenced);
  if (fields.groups.rest.includes('BE')) {
    calibration.bindingEnergyShift =
      calibration.referenced - calibration.measured;
    calibration.kind = 'bindingEnergy';
  } else {
    calibration.bindingEnergyShift =
      calibration.measured - calibration.referenced;
    calibration.kind = 'kineticEnergy';
  }
  calibration.kineticEnergyShift = -calibration.bindingEnergyShift;
  calibrations.push(calibration);
}
