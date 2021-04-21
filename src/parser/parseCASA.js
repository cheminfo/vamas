export function parseCASA(text) {
  const casa = {};
  const lines = text.split(/\r?\n/);
  for (const line of lines) {
    if (line.startsWith('CASA comp ')) {
      parseComp(line);
    }
    if (line.startsWith('CASA region')) {
      parseRegion(line);
    }
    if (line.startsWith('Calib')) {
      parseCalib(line);
    }
  }

  return casa;
}

function parseCalib(line) {
  // Calib M = 281.1700 A = 284.8 BE AD
  let fields = line.match(/Calib (M = .*) (A = [^ ]*) (.*)/);
  console.log(fields.slice(1));
}

function parseRegion(line) {
  // CASA region (*Mo 3d*) (*Shirley*) 1249.3343 1262.7065 10.804667 2 0 0 392.54541 -450 0 0 (*Mo 3d*) 95.9219 0 9.5
  let fields = line.match(
    /CASA region \((.*)\) \(([^ ]*)\) (.*) \((.*)\) (.*)/,
  );
  console.log(fields.slice(1));
}

function parseComp(line) {
  // CASA comp (*Mo 3d MoS2 2H*) (*LA(1.53,243)*) Area 230.36971 1e-020 2327991 -1 1 MFWHM 0.88528218 0.2 2 -1 1 Position 1257.22 1257.02 1257.22 -1 1 RSF 10.804667 MASS 95.9219 INDEX -1 (*Mo 3d*) CONST (**) UNCORRECTEDRSF 9.5
  let fields = line.match(
    /CASA comp \((.*)\) \(([^ ]*)\) (Area .*) (MFWHM .*) (Position .*) (RSF .*) (MASS .*) (INDEX .*) (CONST .*) (UNCORRECTEDRSF.*)/,
  );
  console.log(fields.slice(1));
}
