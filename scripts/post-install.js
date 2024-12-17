const fse = require('fs-extra');
const path = require('path');
fse.copySync(
  path.join('node_modules', '@psu-ooe', 'components', 'packages'),
  'upstream-components',
  { overwrite: true }
);
