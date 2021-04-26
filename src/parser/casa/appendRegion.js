export function appendRegion(regions, line) {
  // CASA region (*Mo 3d*) (*Shirley*) 1249.3343 1262.7065 10.804667 2 0 0 392.54541 -450 0 0 (*Mo 3d*) 95.9219 0 9.5
  let fields = line.match(
    /CASA region \(\*(?<name>.*)\*\) \(\*(?<backgroundKind>[^ ]*)\*\) (?<backgroundOptions>.*) \((?<comment>.*)\) (?<surface>.*)/,
  );
  if (!fields) {
    throw new Error(`appendRegion fails on: ${line}`);
  }

  let region = {
    name: fields.groups.name,
  };

  regions.push(region);
}
