const fs = require('fs');
const fse = require('fs-extra');
const path = require('path');

const components = fs.readdirSync(path.join('node_modules', '@psu-ooe'));
components.forEach(component => {
  fse.mkdirpSync(path.join('components', component));
  fse.copySync(
    path.join('node_modules', '@psu-ooe', component),
    path.join('components', component), {
      overwrite: true
    }
  );
});
