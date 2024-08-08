const fse = require('fs-extra');
const path = require('path');
fse.copySync(
  path.join('node_modules', '@psu-ooe'),
  'upstream-components',
  { overwrite: true }
);