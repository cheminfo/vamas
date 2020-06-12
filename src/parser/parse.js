const experiments = [
  'MAP',
  'MAPDP',
  'MAPSV',
  'MAPSVDP',
  'NORM',
  'SDP',
  'SDPSV',
  'SEM',
  'NOEXP',
];

const technics = [
  'AES diff',
  'AES dir',
  'EDX',
  'ELS',
  'FABMS',
  'FABMS energy spec',
  'ISS',
  'SIMS',
  'SIMS energy spec',
  'SNMS',
  'SNMS energy spec',
  'UPS',
  'XPS',
  'XRF',
];

const scans = ['REGULAR', 'IRREGULAR', 'MAPPING'];

export function parse(text) {
  const lines = text.split(/\r?\n/);
  let pointer = 0;
  let parsed = { header: {}, blocks: [], info: {} };
  pointer = parseHeader(lines, parsed, pointer);
  for (let i = 0; i < parsed.info.nbBlocks; i++) {
    parseBlock(lines, parsed, pointer);
  }
  return parsed;
}

function parseHeader(lines, parsed, pointer) {
  const { header, info } = parsed;
  header['format identifier'] = lines[pointer++];
  header['institution identifier'] = lines[pointer++];
  header['instrument model identifier'] = lines[pointer++];
  header['operator identifier'] = lines[pointer++];
  header['experiment identifier'] = lines[pointer++];
  info.nbComments = Number(lines[pointer++]);
  header['number of lines in comment'] = info.nbComments;
  const comments = [];
  for (let i = 0; i < info.nbComments; i++) {
    comments.push(lines[pointer++]);
  }
  header['comment line'] = comments.join('\n');
  header['experiment mode'] = lines[pointer++];
  header['scan mode'] = lines[pointer++];
  if (['MAP', 'MAPD', 'NORM', 'SDP'].includes(header['experiment mode'])) {
    header['number of spectral regions'] = Number(lines[pointer++]);
  }
  if (['MAP', 'MAPD'].includes(header['experiment mode'])) {
    header['number of analysis positions'] = Number(lines[pointer++]);
    header['number of discrete x coordinates available in full map'] = Number(
      lines[pointer++],
    );
    header['number of discrete y coordinates available in full map'] = Number(
      lines[pointer++],
    );
  }
  info.nbExperimentVariables = Number(lines[pointer++]);
  const experimentVariables = [];
  header['number of experimental variables'] = info.nbExperimentVariables;
  for (let i = 0; i < info.nbExperimentVariables; i++) {
    experimentVariables.push({
      label: lines[pointer++],
      unit: lines[pointer++],
    });
  }
  header.experimentVariables = experimentVariables;
  /*
    If the values of any of the block parameters are the same in all of the
    blocks their values may be sent in the first block and then omitted
    from all subsequent blocks.
    - n > 0 : the parameters listed are to be included
    - n < 0 : the parameters listed are to be excluded
    - n = 0 : all parameters are to be given in all blocks
    A complete block contains 40 parts.
    */
  info.nbEntriesInclusionExclusion = Number(lines[pointer++]);
  header['number of entries in parameter inclusion or exclusion list'] =
    info.nbEntriesInclusionExclusion;
  info.blockParametersincludes = new Array(40).fill(
    info.nbEntriesInclusionExclusion <= 0,
  );
  for (let i = 0; i < Math.abs(info.nbEntriesInclusionExclusion); i++) {
    info.blockParametersincludes[Number(lines[pointer++]) + 1] =
      info.nbEntriesInclusionExclusion > 0;
  }

  header['number of manually entered items in block'] = Number(
    lines[pointer++],
  );
  info.nbFutureUpgradeExperimentEntries = Number(lines[pointer++]);
  header['number of future upgrade experiment entries'] =
    info.nbFutureUpgradeExperimentEntries;
  const futureUpgradeExperimentEntries = [];
  for (let i = 0; i < info.nbFutureUpgradeExperimentEntries; i++) {
    futureUpgradeExperimentEntries.push({
      label: lines[pointer++],
      unit: lines[pointer++],
    });
  }
  header.futureUpgradeExperimentEntries = futureUpgradeExperimentEntries;
  if (info.nbFutureUpgradeExperimentEntries !== 0) {
    throw Error('unsupported future upgrade experiment entries');
  }

  header['number of future upgrade block entries'] = Number(lines[pointer++]);
  if (header['number of future upgrade block entries'] !== 0) {
    throw Error('unsupported future upgrade block entries');
  }

  info.nbBlocks = Number(lines[pointer++]);
  header['number of blocks'] = info.nbBlocks;
  return pointer;
}

function parseBlock(lines, parsed, pointer) {
  const { blocks, header, info } = parsed;

  const firstBlock = blocks[0];
  const includes =
    blocks.length === 0
      ? new Array(40).fill(true)
      : info.nbEntriesInclusionExclusion;

  const block = {};
  block['block identifier'] = lines[pointer++];
  block['sample identifier'] = lines[pointer++];
  block['year in full'] = includes[0]
    ? Number(lines[pointer++])
    : firstBlock['year in full'];
  block.month = includes[1] ? Number(lines[pointer++]) : firstBlock.month;
  block['day of month'] = includes[2]
    ? Number(lines[pointer++])
    : firstBlock['day of month'];
  block.hours = includes[3] ? Number(lines[pointer++]) : firstBlock.hours;
  block.minutes = includes[4] ? Number(lines[pointer++]) : firstBlock.minutes;
  block.seconds = includes[5] ? Number(lines[pointer++]) : firstBlock.seconds;
  block['number of hours in advance of Greenwich Mean Time'] = includes[6]
    ? Number(lines[pointer++])
    : firstBlock['number of hours in advance of Greenwich Mean Time'];

  if (includes[7]) {
    const nbComments = Number(lines[pointer++]);
    block['number of lines in block comment'] = nbComments;
    const comments = [];
    for (let i = 0; i < nbComments; i++) {
      comments.push(lines[pointer++]);
    }
    block.blockComment = comments.join('\n');
  } else {
    block['number of lines in block comment'] =
      firstBlock['number of lines in block comment'];
    block.blockComment = firstBlock.blockComment;
  }

  block.technique = includes[8] ? lines[pointer++] : firstBlock.technique;
  if (['MAP', 'MAPDP'].includes(header['experiment mode'])) {
    block['x coordinate'] = includes[9]
      ? Number(lines[pointer++])
      : firstBlock['x coordinate'];
    block['y coordinate'] = includes[9]
      ? Number(lines[pointer++])
      : firstBlock['y coordinate'];
  }

  if (includes[10]) {
    let values = [];
    for (let i = 0; i < header.experimentVariables.length; i++) {
      values.push(lines[pointer++]);
    }
    block['value of experimental variable'] = values;
  } else {
    block['value of experimental variable'] =
      firstBlock['value of experimental variable'];
  }

  block['analysis source label'] = includes[11]
    ? lines[pointer++]
    : firstBlock['analysis source label'];

  if (
    ['MAPDP', 'MAPSVDP', 'SDP', 'SDPSV'].includes(header['experiment mode']) ||
    [
      'SNMS energy spec',
      'FABMS',
      'FABMS energy spec',
      'ISS',
      'SIMS',
      'SIMS energy spec',
      'SNMS',
    ].includes(block.technique)
  ) {
    block['sputtering ion or atom atomic number'] = includes[12]
      ? Number(lines[pointer++])
      : firstBlock['sputtering ion or atom atomic number'];
    block['number of atoms in sputtering ion or atom particle'] = includes[12]
      ? Number(lines[pointer++])
      : firstBlock['number of atoms in sputtering ion or atom particle'];
    block['sputtering ion or atom charge sign and number'] = includes[12]
      ? lines[pointer++]
      : firstBlock['sputtering ion or atom charge sign and number'];
  }

  block['analysis source characteristic energy'] = includes[13]
    ? Number(lines[pointer++])
    : firstBlock['analysis source characteristic energy'];

  block['analysis source strength'] = includes[14]
    ? Number(lines[pointer++])
    : firstBlock['analysis source strength'];

  block['analysis source beam width x'] = includes[15]
    ? Number(lines[pointer++])
    : firstBlock['analysis source beam width x'];
  block['analysis source beam width y'] = includes[15]
    ? Number(lines[pointer++])
    : firstBlock['analysis source beam width y'];

  if (
    ['MAP', 'MAPDP', 'MAPSV', 'MAPSVDP', 'SEM'].includes(
      header['experiment mode'],
    )
  ) {
    block['field of view x'] = includes[16]
      ? Number(lines[pointer++])
      : firstBlock['field of view x'];
    block['field of view y'] = includes[16]
      ? Number(lines[pointer++])
      : firstBlock['field of view y'];
  }

  if (['SEM', 'MAPSV', 'MAPSVDP'].includes(header['experiment mode'])) {
    block['first linescan start x coordinate'] = includes[16]
      ? Number(lines[pointer++])
      : firstBlock['first linescan start x coordinate'];
    block['first linescan start y coordinate'] = includes[16]
      ? Number(lines[pointer++])
      : firstBlock['first linescan start y coordinate'];
    block['first linescan finish x coordinate'] = includes[16]
      ? Number(lines[pointer++])
      : firstBlock['first linescan finish x coordinate'];
    block['first linescan finish y coordinate'] = includes[16]
      ? Number(lines[pointer++])
      : firstBlock['first linescan finish y coordinate'];
    block['last linescan start x coordinate'] = includes[16]
      ? Number(lines[pointer++])
      : firstBlock['first linescan last x coordinate'];
    block['last linescan start y coordinate'] = includes[16]
      ? Number(lines[pointer++])
      : firstBlock['first linescan last y coordinate'];
  }

  block['analysis source polar angle of incidence'] = includes[18]
    ? Number(lines[pointer++])
    : firstBlock['analysis source polar angle of incidence'];

  block['analysis source azimuth'] = includes[19]
    ? Number(lines[pointer++])
    : firstBlock['analysis source azimuth'];

  block['analyser mode'] = includes[20]
    ? lines[pointer++]
    : firstBlock['analyser mode'];

  block[
    'analyser pass energy or retard ratio or mass resolution'
  ] = includes[21]
    ? Number(lines[pointer++])
    : firstBlock['analyser pass energy or retard ratio or mass resolution'];

  if (block.technique === 'AES diff') {
    block['differential width'] = includes[22]
      ? lines[pointer++]
      : firstBlock['differential width'];
  }

  block['magnification of analyser transfer lens'] = includes[23]
    ? Number(lines[pointer++])
    : firstBlock['magnification of analyser transfer lens'];

  block[
    'analyser work function or acceptance energy of atom or ion'
  ] = includes[24]
    ? Number(lines[pointer++])
    : firstBlock['analyser work function or acceptance energy of atom or ion'];

  block['target bias'] = includes[25]
    ? Number(lines[pointer++])
    : firstBlock['target bias'];

  block['analysis width x'] = includes[26]
    ? Number(lines[pointer++])
    : firstBlock['analysis width x'];
  block['analysis width y'] = includes[26]
    ? Number(lines[pointer++])
    : firstBlock['analysis width y'];

  block['analyser axis take off polar angle'] = includes[27]
    ? Number(lines[pointer++])
    : firstBlock['analyser axis take off polar angle'];
  block['analyser axis take off azimuth'] = includes[27]
    ? Number(lines[pointer++])
    : firstBlock['analyser axis take off azimuth'];

  block['species label'] = includes[28]
    ? lines[pointer++]
    : firstBlock['species label'];

  block['transition or charge state label'] = includes[29]
    ? lines[pointer++]
    : firstBlock['transition or charge state label'];
  block['charge of detected particle'] = includes[29]
    ? Number(lines[pointer++])
    : firstBlock['charge of detected particle'];

  if (header['scan mode'] !== 'REGULAR') {
    throw Error('Only REGULAR scans are supported');
  }

  block['abscissa label'] = includes[30]
    ? lines[pointer++]
    : firstBlock['abscissa label'];
  block['abscissa units'] = includes[30]
    ? lines[pointer++]
    : firstBlock['abscissa units'];
  block['abscissa start'] = includes[30]
    ? Number(lines[pointer++])
    : firstBlock['abscissa start'];
  block['abscissa increment'] = includes[30]
    ? Number(lines[pointer++])
    : firstBlock['abscissa increment'];

  if (includes[31]) {
    const nbCorrespondingVariables = Number(lines[pointer++]);
    block['number of corresponding variables'] = nbCorrespondingVariables;
    const correspondingVariables = [];
    for (let i = 0; i < nbCorrespondingVariables; i++) {
      correspondingVariables.push({
        label: lines[pointer++],
        unit: lines[pointer++],
        array: [],
      });
    }
    block.correspondingVariables = correspondingVariables;
  } else {
    block['number of corresponding variables'] =
      firstBlock['number of corresponding variables'];
    block.correspondingVariables = JSON.parse(
      JSON.stringify(firstBlock.correspondingVariables),
    );
    block.correspondingVariables.array = [];
  }

  block['signal mode'] = includes[32]
    ? lines[pointer++]
    : firstBlock['signal mode'];

  block['signal collection time'] = includes[33]
    ? Number(lines[pointer++])
    : firstBlock['signal collection time'];

  block['number of scans to compile this block'] = includes[34]
    ? Number(lines[pointer++])
    : firstBlock['number of scans to compile this block'];

  block['signal time correction'] = includes[35]
    ? Number(lines[pointer++])
    : firstBlock['signal time correction'];

  if (
    ['MAPDP', 'MAPSVDP', 'SDP', 'SDPSV'].includes(header['experiment mode']) &&
    ['AES diff', 'AES dir', 'EDX', 'ELS', 'UPS', 'XPS', 'XRF'].includes(
      block.technique,
    )
  ) {
    block['sputtering source energy'] = includes[36]
      ? Number(lines[pointer++])
      : firstBlock['sputtering source energy'];
    block['sputtering source beam current'] = includes[36]
      ? Number(lines[pointer++])
      : firstBlock['sputtering source beam current'];
    block['sputtering source width x'] = includes[36]
      ? Number(lines[pointer++])
      : firstBlock['sputtering source width x'];
    block['sputtering source width y'] = includes[36]
      ? Number(lines[pointer++])
      : firstBlock['sputtering source width y'];
    block['sputtering source polar angle of incidence'] = includes[36]
      ? Number(lines[pointer++])
      : firstBlock['sputtering source polar angle of incidence'];
    block['sputtering source azimuth'] = includes[36]
      ? Number(lines[pointer++])
      : firstBlock['sputtering source azimuth'];
    block['sputtering mode'] = includes[36]
      ? lines[pointer++]
      : firstBlock['sputtering mode'];
  }

  block['sample normal polar angle of tilt'] = includes[37]
    ? Number(lines[pointer++])
    : firstBlock['sample normal polar angle of tilt'];
  block['sample normal tilt azimuth'] = includes[37]
    ? Number(lines[pointer++])
    : firstBlock['sample normal tilt azimuth'];

  block['sample rotation angle'] = includes[38]
    ? Number(lines[pointer++])
    : firstBlock['sample rotation angle'];

  if (includes[39]) {
    const nbAdditionalNumericalParameters = Number(lines[pointer++]);
    block[
      'number of additional numerical parameters'
    ] = nbAdditionalNumericalParameters;
    const additionalNumericalParameters = [];
    for (let i = 0; i < nbAdditionalNumericalParameters; i++) {
      additionalNumericalParameters.push({
        label: lines[pointer++],
        unit: lines[pointer++],
        value: lines[pointer++],
      });
    }
    block.additionalNumericalParameters = additionalNumericalParameters;
  } else {
    block['number of additional numerical parameters'] =
      firstBlock['number of additional numerical parameters'];
    block.additionalNumericalParameters =
      firstBlock.additionalNumericalParameters;
  }

  block.nbOrdinateValues = Number(lines[pointer++]);
  for (let correspondingVariable of block.correspondingVariables) {
    correspondingVariable.minimumOrdinateValue = Number(lines[pointer++]);
    correspondingVariable.maximumOrdinateValue = Number(lines[pointer++]);
  }
  for (let i = 0; i < block.nbOrdinateValues; i++) {
    for (let correspondingVariable of block.correspondingVariables) {
      correspondingVariable.array.push(Number(lines[pointer++]));
    }
  }

  parsed.blocks.push(block);
}

function loadBlockHeader(lines, header, pointer) {}

function loadBlockData() {}
