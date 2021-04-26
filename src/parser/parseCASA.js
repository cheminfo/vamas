import { appendCalibration } from './casa/appendCalibration';
import { appendComponent } from './casa/appendComponent';
import { appendRegion } from './casa/appendRegion';

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
