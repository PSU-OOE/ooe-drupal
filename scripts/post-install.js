const fs = require('fs');
const fse = require('fs-extra');
const path = require('path');

const components = fs.readdirSync(path.join('node_modules', '@psu-ooe'));
components.forEach(component => {
  fse.moveSync(
    path.join('node_modules', '@psu-ooe', component),
    path.join('components', component), {
      overwrite: true
    }
  );
});

fse.removeSync('node_modules');
