export function parseCASA(text) {
  const casa = {};
  const lines = text.split(/\r?\n/);
  for (const line of lines) {
    if (line.startsWith('CASA comp ')) {
      parseComp(line);
    }
  }

  return casa;
}

function parseComp(line) {
  let fields = line.split(' ');
  console.log(fields);
}
