const fs = require('fs');
const fse = require('fs-extra');
const path = require('path');

const components = fs.readdirSync(path.join('node_modules', '@psu-ooe'));
components.forEach(component => {
  const package_json = require('../node_modules/@psu-ooe/' + component + '/package.json');
  const namespace = package_json.ooe.namespace;
  fse.copySync(
    path.join('node_modules', '@psu-ooe', component),
    path.join('components', namespace, component), {
      overwrite: true
    }
  );
});

//fse.removeSync('node_modules');
