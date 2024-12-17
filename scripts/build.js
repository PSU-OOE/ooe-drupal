const fs = require('fs');
const sass = require('sass');
const uglify = require('uglify-js');


let upstream_components_dir = 'upstream-components'

fs.readdirSync(upstream_components_dir).forEach(component => {
  const upstream_component_dir = upstream_components_dir + '/' + component;
  const src_dir = upstream_component_dir + '/src';

  const scss_src = src_dir + '/scss/styles.scss';
  const js_src = src_dir + '/js/scripts.js';

  const dist_dir = upstream_component_dir + '/dist';

  // Compile and minify SCSS.
  if (fs.existsSync(scss_src)) {
    fs.mkdirSync(dist_dir, {
      recursive: true,
    });
    const result = sass.compile(scss_src, {
      style: 'compressed',
    });
    fs.writeFileSync(dist_dir + '/styles.css', result.css);
  }

  // Minify JS.
  if (fs.existsSync(js_src)) {
    fs.mkdirSync(dist_dir, {
      recursive: true
    });
    const input_code = fs.readFileSync(js_src).toString('utf-8');
    const result = uglify.minify(input_code, {
      compress: {
        inline: false,
      },
    });
    fs.writeFileSync(dist_dir + '/scripts.js', result.code);
  }
});

const SVGSpriter = require('svg-sprite');

// Build upstream sprites
const config = {
  svg: {
    namespaceIDs: false,
    namespaceClassnames: false,
    xmlDeclaration: false,
    doctypeDeclaration: false,
  },
  mode: {
    defs: {
      inline: true,
    },
  },
  shape: {
    transform: [],
  }
};
const spriter = new SVGSpriter(config);
const sprites_dir = 'upstream-components/sprite/src/assets';
fs.readdirSync(sprites_dir).forEach(sprite => {
  spriter.add(sprite, null, fs.readFileSync('upstream-components/sprite/src/assets/' + sprite), 'utf-8');
});

spriter.compile((error, result) => {
  fs.writeFileSync('./upstream-components/sprite/dist/sprites.svg', Buffer.from(result.defs.sprite._contents));
});


let components_dir = 'components'

fs.readdirSync(components_dir).forEach(component => {
  const component_dir = components_dir + '/' + component;
  const src_dir = component_dir + '/src';

  const scss_src = src_dir + '/styles.scss';
  const js_src = src_dir + '/scripts.js';

  const dist_dir = component_dir + '/dist';

  // Compile and minify SCSS.
  if (fs.existsSync(scss_src)) {
    fs.mkdirSync(dist_dir, {
      recursive: true,
    });
    const result = sass.compile(scss_src, {
      style: 'compressed',
    });
    fs.writeFileSync(dist_dir + '/styles.css', result.css);
  }

  // Minify JS.
  if (fs.existsSync(js_src)) {
    fs.mkdirSync(dist_dir, {
      recursive: true
    });
    const input_code = fs.readFileSync(js_src).toString('utf-8');
    const result = uglify.minify(input_code, {
      compress: {
        inline: false,
      },
    });
    fs.writeFileSync(dist_dir + '/scripts.js', result.code);
  }
});
